/**
 * 読者ジャーニー（lib/reader-journeys.ts）の受入ゲート。
 *
 * 守りたい性質:
 *   - ジャーニーの定義が壊れた状態（未公開 slug・自己リンク・重複）で公開されないこと
 *   - Home / 記事末尾 / /resources が同じ定義を参照し、並びを別々に持たないこと
 *   - 記事が増えたとき、ジャーニーに入れる・入れないの判断を必ず明示させること
 *
 * 既存ゲート（adsense-audit / sixth-review-original-value）の条件は弱めない。
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import matter from 'gray-matter';

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const JOURNEY_PATH = 'lib/reader-journeys.ts';
const journeySource = read(JOURNEY_PATH);

// ─── 記事 ────────────────────────────────────────────────────────────────
const articleDir = path.join(root, 'content/articles');
const articles = new Map(
  fs
    .readdirSync(articleDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const parsed = matter(read(`content/articles/${file}`));
      return [slug, { slug, ...parsed.data, content: parsed.content }];
    }),
);
const publishedSlugs = new Set(
  [...articles.values()].filter((a) => a.published !== false).map((a) => a.slug),
);

// ─── reader-journeys.ts の解析 ────────────────────────────────────────────
// TypeScript をそのまま import できないため、ソースから構造を読み取る。
// 「テストがソースの写しになる」ことを避けるため、値の中身ではなく関係だけを検証する。
function parseJourneys(source) {
  const body = source.slice(source.indexOf('export const READER_JOURNEYS'));
  const end = body.indexOf('\n];');
  assert.notEqual(end, -1, 'READER_JOURNEYS の終端が見つかること');
  const list = body.slice(0, end);

  const journeys = [];
  const journeyRe = /\{\s*\n\s*id: '([a-z]+)',\s*\n\s*title: '([^']+)',/g;
  const starts = [];
  let m;
  while ((m = journeyRe.exec(list)) !== null) {
    starts.push({ id: m[1], title: m[2], at: m.index });
  }
  for (let i = 0; i < starts.length; i += 1) {
    const chunk = list.slice(starts[i].at, i + 1 < starts.length ? starts[i + 1].at : list.length);
    const steps = [];
    const stepRe =
      /slug: '([a-z0-9-]+)',\s*\n\s*label: '([^']+)',\s*\n\s*decision:\s*\n?\s*'([^']+)',(\s*\n\s*primary: true,)?/g;
    let s;
    while ((s = stepRe.exec(chunk)) !== null) {
      steps.push({ slug: s[1], label: s[2], decision: s[3], primary: Boolean(s[4]) });
    }
    const description = /shortDescription:\s*\n?\s*'([^']+)'/.exec(chunk);
    journeys.push({
      id: starts[i].id,
      title: starts[i].title,
      shortDescription: description ? description[1] : '',
      steps,
    });
  }
  return journeys;
}

const journeys = parseJourneys(journeySource);
const unassigned = [
  ...journeySource
    .slice(journeySource.indexOf('JOURNEY_UNASSIGNED'))
    .matchAll(/slug: '([a-z0-9-]+)'/g),
].map((m) => m[1]);

// ─── 1. registry の整合性 ─────────────────────────────────────────────────
test('journey registry has unique ids and well-formed steps', () => {
  assert.ok(journeys.length >= 3, `ジャーニーが解析できていること（${journeys.length} 件）`);

  const ids = journeys.map((j) => j.id);
  assert.deepEqual([...new Set(ids)], ids, 'ジャーニー id が重複していないこと');

  const titles = journeys.map((j) => j.title);
  assert.deepEqual([...new Set(titles)], titles, 'ジャーニー名が重複していないこと');

  for (const journey of journeys) {
    assert.ok(journey.steps.length >= 2, `${journey.id}: 2段以上あること`);
    assert.ok(journey.shortDescription.length >= 10, `${journey.id}: 説明が空でないこと`);
    for (const step of journey.steps) {
      assert.ok(step.label.length > 0 && step.label.length <= 14, `${journey.id}/${step.slug}: ラベルは14字以内`);
      assert.ok(step.decision.length >= 10, `${journey.id}/${step.slug}: 決めることが書かれていること`);
    }
  }
});

// ─── 2. 参照先の記事が公開されていること ──────────────────────────────────
test('every journey step points at a published article', () => {
  const broken = [];
  for (const journey of journeys) {
    for (const step of journey.steps) {
      if (!articles.has(step.slug)) {
        broken.push(`${journey.id}: 記事が存在しない slug「${step.slug}」`);
      } else if (!publishedSlugs.has(step.slug)) {
        broken.push(`${journey.id}: 未公開記事へのステップ「${step.slug}」`);
      }
    }
  }
  assert.deepEqual(broken, [], 'ジャーニーの参照先が公開記事であること');

  // 統合により 301 を張った旧 slug をステップに置かない（読者を redirect 経由にしない）。
  const redirectSources = new Set(
    [...read('middleware.ts').matchAll(/'([a-z0-9-]+)': '([a-z0-9-]+)'/g)].map((m) => m[1]),
  );
  for (const journey of journeys) {
    for (const step of journey.steps) {
      assert.equal(
        redirectSources.has(step.slug),
        false,
        `${journey.id}: redirect 元 slug をステップにしている（${step.slug}）`,
      );
    }
  }
});

// ─── 3. 同じジャーニー内で重複・自己リンクが起きないこと ────────────────────
test('journey steps do not repeat, so previous and next never self-link', () => {
  for (const journey of journeys) {
    const slugs = journey.steps.map((s) => s.slug);
    assert.deepEqual(
      [...new Set(slugs)],
      slugs,
      `${journey.id}: 同じ記事が2回現れている（前後リンクが自己リンクになる）`,
    );
    const labels = journey.steps.map((s) => s.label);
    assert.deepEqual([...new Set(labels)], labels, `${journey.id}: ステップラベルが重複している`);

    // 隣り合う段が同じ記事を指していないこと（自己リンクの直接検査）。
    for (let i = 1; i < journey.steps.length; i += 1) {
      assert.notEqual(
        journey.steps[i].slug,
        journey.steps[i - 1].slug,
        `${journey.id}: ${i + 1}段目が前の段と同じ記事`,
      );
    }
  }
});

// ─── 4. 記事末尾に出す主ジャーニーが1本に定まること ────────────────────────
test('each article in a journey has exactly one primary step', () => {
  const primaryCount = new Map();
  const anyCount = new Map();
  for (const journey of journeys) {
    for (const step of journey.steps) {
      anyCount.set(step.slug, (anyCount.get(step.slug) ?? 0) + 1);
      if (step.primary) primaryCount.set(step.slug, (primaryCount.get(step.slug) ?? 0) + 1);
    }
  }
  const problems = [];
  for (const [slug, count] of anyCount) {
    const primary = primaryCount.get(slug) ?? 0;
    if (primary === 0) problems.push(`${slug}: primary のジャーニーが無い（記事末尾に何も出ない）`);
    if (primary > 1) problems.push(`${slug}: primary が ${primary} 本ある（案内が二重になる）`);
    if (count > 1 && primary !== 1) problems.push(`${slug}: 複数ジャーニーに属するのに primary が1本でない`);
  }
  assert.deepEqual(problems, [], '記事ごとの主ジャーニーが1本に定まること');
});

// ─── 5. 公開記事が黙って取り残されないこと ────────────────────────────────
test('every published article is either on a journey or explicitly excluded', () => {
  const onJourney = new Set(journeys.flatMap((j) => j.steps.map((s) => s.slug)));
  const missing = [...publishedSlugs].filter(
    (slug) => !onJourney.has(slug) && !unassigned.includes(slug),
  );
  assert.deepEqual(
    missing,
    [],
    'ジャーニーに入れない記事は JOURNEY_UNASSIGNED に理由つきで宣言すること',
  );
  // 逆に、宣言だけ残ってジャーニーにも入っている状態を許さない。
  const both = unassigned.filter((slug) => onJourney.has(slug));
  assert.deepEqual(both, [], 'JOURNEY_UNASSIGNED とステップの両方に現れる記事が無いこと');
  for (const slug of unassigned) {
    assert.equal(publishedSlugs.has(slug), true, `JOURNEY_UNASSIGNED の ${slug} が公開記事であること`);
  }
});

// ─── 6. ステップの様式が実在し、着地先の見出しに一致すること ────────────────
test('resources referenced through journeys resolve to a real heading', () => {
  const resourceSource = read('lib/practical-resources.ts');
  const entries = [...resourceSource.matchAll(/slug: '([a-z0-9-]+)',[\s\S]*?anchor: '([^']+)',/g)]
    .map((m) => ({ slug: m[1], anchor: m[2] }));
  const anchorBySlug = new Map(entries.map((e) => [e.slug, e.anchor]));

  const problems = [];
  for (const journey of journeys) {
    for (const step of journey.steps.filter((s) => s.primary)) {
      const anchor = anchorBySlug.get(step.slug);
      if (!anchor) {
        problems.push(`${journey.id}/${step.slug}: 様式が practical-resources に無い`);
        continue;
      }
      const article = articles.get(step.slug);
      const headings = [...article.content.matchAll(/^#{2,3}\s+(.+)$/gm)].map((m) => m[1].trim());
      if (!headings.includes(anchor)) {
        problems.push(`${journey.id}/${step.slug}: 見出し「${anchor}」が本文に無い`);
      }
    }
  }
  assert.deepEqual(problems, [], 'ジャーニーから辿る様式が記事の見出しに着地すること');
});

// ─── 7. 3箇所が同じ定義を参照していること（二重管理の検出） ─────────────────
test('home, article footer and resources all read the same journey source', () => {
  // それぞれがジャーニー定義を import していること。
  assert.match(read('components/JourneyFinder.tsx'), /from '@\/lib\/reader-journeys'/);
  assert.match(read('components/ArticleJourneyNav.tsx'), /from '@\/lib\/reader-journeys'/);
  assert.match(read('app/resources/page.tsx'), /from '@\/lib\/reader-journeys'/);
  assert.match(read('app/page.tsx'), /JourneyFinder/);
  assert.match(read('app/articles/[slug]/page.tsx'), /ArticleJourneyNav/);

  // ジャーニー名・ステップラベルを描画側へ書き写していないこと（写すと片方だけ古くなる）。
  const renderers = [
    'app/page.tsx',
    'app/resources/page.tsx',
    'app/articles/[slug]/page.tsx',
    'components/JourneyFinder.tsx',
    'components/ArticleJourneyNav.tsx',
  ];
  const literals = [...journeys.map((j) => j.title), ...journeys.flatMap((j) => j.steps.map((s) => s.label))];
  const duplicated = [];
  for (const file of renderers) {
    const source = read(file);
    for (const literal of literals) {
      if (source.includes(literal)) duplicated.push(`${file}: 「${literal}」を直書きしている`);
    }
  }
  assert.deepEqual(duplicated, [], 'ジャーニーの文言は lib/reader-journeys.ts だけが持つこと');

  // 様式の名前・アンカーもジャーニー側へ写していないこと（practical-resources が唯一の真実）。
  const resourceAssets = [...read('lib/practical-resources.ts').matchAll(/asset: '([^']+)'/g)].map((m) => m[1]);
  for (const asset of resourceAssets) {
    assert.equal(journeySource.includes(asset), false, `reader-journeys に様式名を写している：${asset}`);
  }
});

// ─── 8. ジャーニー UI が読者の判断以外のリンクを増やしていないこと ───────────
test('journey navigation adds decision links only, and stays server-rendered', () => {
  const finder = read('components/JourneyFinder.tsx');
  const nav = read('components/ArticleJourneyNav.tsx');
  for (const [name, source] of [['JourneyFinder', finder], ['ArticleJourneyNav', nav]]) {
    assert.doesNotMatch(source, /'use client'/, `${name}: クライアントコンポーネントにしないこと`);
    assert.doesNotMatch(source, /useState|useEffect|onClick/, `${name}: 不要な JS を持たないこと`);
  }
  // 記事末尾は前後の段と様式だけを出す（記事一覧の量産にしない）。
  const articleLinks = [...nav.matchAll(/href=\{`\/articles\//g)].length;
  assert.ok(articleLinks <= 2, `記事末尾から出る記事リンクは前後の2件まで（現在 ${articleLinks} 箇所）`);
  // 前後リンクは記事タイトルを必ず表示する（「前へ」「次へ」だけにしない）。
  assert.match(nav, /\{title\}/);
  assert.match(nav, /step\.decision/);
});

// ─── 9. カテゴリ導線を壊していないこと ────────────────────────────────────
test('category navigation survives the journey redesign', () => {
  const home = read('app/page.tsx');
  assert.match(home, /分野から探す/, 'Home にカテゴリの入口が残っていること');
  assert.match(home, /categories\/\$\{CATEGORY_TO_SLUG\[cat\]\}/, 'カテゴリページへのリンクが残っていること');
  assert.match(read('components/Header.tsx'), /categories\//, 'ヘッダーのカテゴリ導線が残っていること');
  // 「最近更新した記事」の面を復活させない（最新記事と重複し、鮮度を演出する面になる）。
  // 判断の理由をコメントで残すのは許すため、描画される見出しだけを見る。
  assert.doesNotMatch(home, />\s*最近更新した記事\s*</);
  assert.doesNotMatch(home, /recentlyUpdated/);
});

/**
 * 読者ジャーニー（lib/reader-journeys.ts）の受入ゲート。
 *
 * 守りたい性質:
 *   - ジャーニーの定義が壊れた状態（未公開 slug・自己リンク・重複）で公開されないこと
 *   - ジャーニーの形（kind）が宣言どおりに描かれること。順番の無い形を番号や矢印で並べないこと
 *       sequence    前の段の結論が次の段の前提になる。前後リンク・番号を出す
 *       hub         場面に合わせて選ぶ選択肢の束。共通の関門があるときだけ起点を1つ置く
 *       conditional 状況（when）で選ぶ。起点も順番もない
 *   - Home は「入口を選ぶ」層にとどめ、条件・決めること・記事タイトルは記事末尾に任せること
 *   - Home / 記事末尾 / /resources が同じ定義を参照し、並びを別々に持たないこと
 *   - 記事が増えたとき、ジャーニーに入れる・入れないの判断を必ず明示させること
 *
 * 既存ゲート（adsense-audit / sixth-review-original-value）の条件は弱めない。
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';
import matter from 'gray-matter';
import ts from 'typescript';

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

// ─── lib/reader-journeys.ts を実モジュールとして読み込む ─────────────────────
// 正規表現でソースを写し取るとテストがソースの写しになり、書き方の変化で壊れる。
// TypeScript の transpile だけを通して import し、記事末尾が使うヘルパの振る舞いまで検証する。
async function loadJourneyModules() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reader-journey-test-'));
  process.on('exit', () => fs.rmSync(dir, { recursive: true, force: true }));
  const transpile = (relativePath) =>
    ts.transpileModule(read(relativePath), {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    }).outputText;

  fs.writeFileSync(path.join(dir, 'practical-resources.mjs'), transpile('lib/practical-resources.ts'));
  const journeyJs = transpile('lib/reader-journeys.ts').replace(
    /from ['"]@\/lib\/practical-resources['"]/g,
    "from './practical-resources.mjs'",
  );
  assert.doesNotMatch(journeyJs, /from ['"]@\//, 'reader-journeys が想定外のモジュールに依存していないこと');
  fs.writeFileSync(path.join(dir, 'reader-journeys.mjs'), journeyJs);

  const load = (file) => import(pathToFileURL(path.join(dir, file)).href);
  return { journeyModule: await load('reader-journeys.mjs'), resourceModule: await load('practical-resources.mjs') };
}

const { journeyModule, resourceModule } = await loadJourneyModules();
const { READER_JOURNEYS: journeys, JOURNEY_UNASSIGNED, getPrimaryJourneyPosition } = journeyModule;
const { PRACTICAL_RESOURCES } = resourceModule;
const unassigned = JOURNEY_UNASSIGNED.map((entry) => entry.slug);

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

// Human Review（2026-09-11）で決めた形と、hub の起点の有無。順番が本当にあるものだけを sequence にし、
// 起点は「全員が先に通る共通の関門」があるときだけ置く（ICT には共通の前提が無い）。
// 形や起点を変える・ジャーニーを足すときは、この表も更新して判断を残す。
const REVIEWED_KINDS = {
  plan: 'sequence',
  family: 'sequence',
  support: 'conditional',
  ict: 'hub',
  ai: 'hub',
};
const REVIEWED_HUB_ENTRY = {
  ai: 'ai-koomu-kaizen-nyumon',
  ict: null,
};

/** 記事末尾が実際にリンクする記事（形ごとに持つ情報が違う）。 */
function linkedSteps(position) {
  if (position.kind === 'sequence') return [position.previous, position.next].filter(Boolean);
  if (position.kind === 'hub') {
    return position.isEntry ? position.choices : [position.entry, ...position.choices].filter(Boolean);
  }
  return position.others;
}

/** 描画側ソースから、名前つき関数1つ分の本文を取り出す（次の関数宣言の手前まで）。 */
function functionBody(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} が見つかること`);
  const rest = source.slice(start + 1);
  const end = rest.search(/\n(?:export default )?function \w+\(/);
  return end === -1 ? source.slice(start) : source.slice(start, start + 1 + end);
}

// ─── 1. registry の整合性 ─────────────────────────────────────────────────
test('journey registry has unique ids and well-formed steps', () => {
  assert.ok(journeys.length >= 3, `ジャーニーが読み込めていること（${journeys.length} 件）`);

  const ids = journeys.map((j) => j.id);
  assert.deepEqual([...new Set(ids)], ids, 'ジャーニー id が重複していないこと');
  const titles = journeys.map((j) => j.title);
  assert.deepEqual([...new Set(titles)], titles, 'ジャーニー名が重複していないこと');

  for (const journey of journeys) {
    assert.ok(['sequence', 'hub', 'conditional'].includes(journey.kind), `${journey.id}: kind が3つの形のどれかであること`);
    assert.ok(journey.steps.length >= 2, `${journey.id}: 2段以上あること`);
    assert.ok(journey.shortDescription.length >= 10, `${journey.id}: 説明が空でないこと`);
    for (const step of journey.steps) {
      assert.ok(step.label.length > 0 && step.label.length <= 14, `${journey.id}/${step.slug}: ラベルは14字以内`);
      assert.ok(
        typeof step.short === 'string' && step.short.length > 0 && step.short.length <= 10,
        `${journey.id}/${step.slug}: Home 用の短い呼び名（short）が10字以内で書かれていること`,
      );
      assert.ok(step.decision.length >= 10, `${journey.id}/${step.slug}: 決めることが書かれていること`);
    }
    const shorts = journey.steps.map((s) => s.short);
    assert.deepEqual([...new Set(shorts)], shorts, `${journey.id}: 短い呼び名が重複している`);
  }
});

// ─── 2. 参照先の記事が公開されていること ──────────────────────────────────
test('every journey step points at a published article', () => {
  const broken = [];
  for (const journey of journeys) {
    for (const step of journey.steps) {
      if (!articles.has(step.slug)) broken.push(`${journey.id}: 記事が存在しない slug「${step.slug}」`);
      else if (!publishedSlugs.has(step.slug)) broken.push(`${journey.id}: 未公開記事へのステップ「${step.slug}」`);
    }
  }
  assert.deepEqual(broken, [], 'ジャーニーの参照先が公開記事であること');

  // 統合により 301 を張った旧 slug をステップに置かない（読者を redirect 経由にしない）。
  const redirectSources = new Set(
    [...read('middleware.ts').matchAll(/'([a-z0-9-]+)': '([a-z0-9-]+)'/g)].map((m) => m[1]),
  );
  for (const journey of journeys) {
    for (const step of journey.steps) {
      assert.equal(redirectSources.has(step.slug), false, `${journey.id}: redirect 元 slug をステップにしている（${step.slug}）`);
    }
  }
});

// ─── 3. 重複・自己リンクが起きないこと ────────────────────────────────────
test('journey steps do not repeat, so previous and next never self-link', () => {
  for (const journey of journeys) {
    const slugs = journey.steps.map((s) => s.slug);
    assert.deepEqual([...new Set(slugs)], slugs, `${journey.id}: 同じ記事が2回現れている（自己リンクになる）`);
    const labels = journey.steps.map((s) => s.label);
    assert.deepEqual([...new Set(labels)], labels, `${journey.id}: ステップラベルが重複している`);
    for (let i = 1; i < journey.steps.length; i += 1) {
      assert.notEqual(journey.steps[i].slug, journey.steps[i - 1].slug, `${journey.id}: ${i + 1}段目が前の段と同じ記事`);
    }
  }
  // 記事末尾のヘルパが、どの形でも自分自身へのリンクを返さないこと。
  for (const slug of publishedSlugs) {
    const position = getPrimaryJourneyPosition(slug);
    if (!position) continue;
    for (const linked of linkedSteps(position)) {
      assert.notEqual(linked.slug, slug, `${slug}: 記事末尾が自分自身へリンクしている（self-link）`);
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
  for (const [slug] of anyCount) {
    const primary = primaryCount.get(slug) ?? 0;
    if (primary === 0) problems.push(`${slug}: primary のジャーニーが無い（記事末尾に何も出ない）`);
    if (primary > 1) problems.push(`${slug}: primary が ${primary} 本ある（案内が二重になる）`);
  }
  assert.deepEqual(problems, [], '記事ごとの主ジャーニーが1本に定まること');
});

// ─── 5. 公開記事が黙って取り残されないこと ────────────────────────────────
test('every published article is either on a journey or explicitly excluded', () => {
  const onJourney = new Set(journeys.flatMap((j) => j.steps.map((s) => s.slug)));
  const missing = [...publishedSlugs].filter((slug) => !onJourney.has(slug) && !unassigned.includes(slug));
  assert.deepEqual(missing, [], 'ジャーニーに入れない記事は JOURNEY_UNASSIGNED に理由つきで宣言すること');
  const both = unassigned.filter((slug) => onJourney.has(slug));
  assert.deepEqual(both, [], 'JOURNEY_UNASSIGNED とステップの両方に現れる記事が無いこと');
  for (const slug of unassigned) {
    assert.equal(publishedSlugs.has(slug), true, `JOURNEY_UNASSIGNED の ${slug} が公開記事であること`);
  }
});

// ─── 6. ステップの様式が実在し、着地先の見出しに一致すること ────────────────
test('resources referenced through journeys resolve to a real heading', () => {
  const anchorBySlug = new Map(PRACTICAL_RESOURCES.map((r) => [r.slug, r.anchor]));
  const problems = [];
  for (const journey of journeys) {
    for (const step of journey.steps.filter((s) => s.primary)) {
      const anchor = anchorBySlug.get(step.slug);
      if (!anchor) {
        problems.push(`${journey.id}/${step.slug}: 様式が practical-resources に無い`);
        continue;
      }
      const headings = [...articles.get(step.slug).content.matchAll(/^#{2,3}\s+(.+)$/gm)].map((m) => m[1].trim());
      if (!headings.includes(anchor)) problems.push(`${journey.id}/${step.slug}: 見出し「${anchor}」が本文に無い`);
    }
  }
  assert.deepEqual(problems, [], 'ジャーニーから辿る様式が記事の見出しに着地すること');
});

// ─── 7. 形（kind）と起点が宣言どおりの構造を持つこと ───────────────────────
test('journey kind semantics are declared, not implied by order', () => {
  assert.deepEqual(
    journeys.map((j) => j.id).sort(),
    Object.keys(REVIEWED_KINDS).sort(),
    '全ジャーニーの形が Human Review 済みであること（ジャーニーを足したら REVIEWED_KINDS も更新する）',
  );
  for (const journey of journeys) {
    assert.equal(journey.kind, REVIEWED_KINDS[journey.id], `${journey.id}: 形が Human Review の決定（${REVIEWED_KINDS[journey.id]}）と違う`);
    const entries = journey.steps.filter((s) => s.entry);

    if (journey.kind === 'sequence') {
      assert.equal(entries.length, 0, `${journey.id}: sequence に起点（entry）を置かない`);
      assert.equal(journey.homePrompt, undefined, `${journey.id}: sequence は Home で順序のボタンを使い、homePrompt を持たない`);
      for (const step of journey.steps) {
        assert.equal(step.when, undefined, `${journey.id}/${step.slug}: sequence では when を使わない（順番が「いつ読むか」を表す）`);
      }
      continue;
    }

    if (journey.kind === 'hub') {
      assert.ok(journey.id in REVIEWED_HUB_ENTRY, `${journey.id}: hub の起点の有無が Human Review 済みであること`);
      assert.ok(entries.length <= 1, `${journey.id}: hub の起点は0か1つ`);
      if (entries.length === 1) assert.equal(journey.steps[0].entry, true, `${journey.id}: hub の起点は先頭に置く`);
      assert.equal(
        entries[0]?.slug ?? null,
        REVIEWED_HUB_ENTRY[journey.id],
        `${journey.id}: 起点の有無と起点の記事が Human Review の決定と違う（共通の前提が無い hub に起点を置かない）`,
      );
      assert.ok(journey.steps.length - entries.length >= 2, `${journey.id}: hub には選択肢が2つ以上あること`);
    } else {
      assert.equal(entries.length, 0, `${journey.id}: conditional に起点を置かない`);
    }
    assert.ok(
      typeof journey.homePrompt === 'string' && journey.homePrompt.length > 0 && journey.homePrompt.length <= 20,
      `${journey.id}: Home で何を選ぶかを促す一言（homePrompt）が20字以内で書かれていること`,
    );
    for (const step of journey.steps) {
      assert.ok(
        typeof step.when === 'string' && step.when.length > 0 && step.when.length <= 28,
        `${journey.id}/${step.slug}: どんなときに読むか（when）が28字以内で書かれていること`,
      );
    }
  }
});

// ─── 8. 記事末尾の案内が形に従うこと（ヘルパの振る舞い） ───────────────────
test('article footer navigation follows the journey kind', () => {
  let checked = 0;
  for (const slug of publishedSlugs) {
    const position = getPrimaryJourneyPosition(slug);
    if (!position) continue;
    checked += 1;
    const { journey } = position;
    assert.equal(position.kind, journey.kind, `${slug}: 記事末尾の形がジャーニーの形と違う`);

    const members = new Set(journey.steps.map((s) => s.slug));
    const linked = linkedSteps(position);
    for (const step of linked) assert.ok(members.has(step.slug), `${slug}: 記事末尾がジャーニー外の記事へリンクしている`);
    assert.equal(new Set(linked.map((s) => s.slug)).size, linked.length, `${slug}: 同じ記事へ二重にリンクしている`);

    if (position.kind === 'sequence') {
      const i = journey.steps.findIndex((s) => s.slug === slug && s.primary);
      assert.equal(position.index, i + 1, `${slug}: 段の位置が違う`);
      assert.equal(position.previous?.slug, journey.steps[i - 1]?.slug, `${slug}: 前の段が隣の段でない`);
      assert.equal(position.next?.slug, journey.steps[i + 1]?.slug, `${slug}: 次の段が隣の段でない`);
      assert.ok(linked.length <= 2, `${slug}: sequence の記事末尾は前後の2件まで`);
      continue;
    }

    // 順番の無い形では、前後という概念そのものを返さない。
    assert.equal('previous' in position, false, `${slug}: ${position.kind} で前の段を返している`);
    assert.equal('next' in position, false, `${slug}: ${position.kind} で次の段を返している`);

    if (position.kind === 'hub') {
      const entry = journey.steps.find((s) => s.entry);
      if (entry) {
        assert.equal(position.entry?.slug, entry.slug, `${slug}: hub の起点が違う`);
        assert.equal(position.isEntry, slug === entry.slug, `${slug}: 起点かどうかの判定が違う`);
      } else {
        assert.equal(position.entry, undefined, `${slug}: 起点の無い hub で起点を返している`);
        assert.equal(position.isEntry, false, `${slug}: 起点の無い hub で起点扱いにしている`);
      }
      assert.deepEqual(
        position.choices.map((s) => s.slug),
        journey.steps.filter((s) => !s.entry && s.slug !== slug).map((s) => s.slug),
        `${slug}: hub の選択肢が「起点以外・自分以外」になっていない`,
      );
    } else {
      assert.deepEqual(
        position.others.map((s) => s.slug),
        journey.steps.filter((s) => s.slug !== slug).map((s) => s.slug),
        `${slug}: conditional のほかの記事が「自分以外の全員」になっていない`,
      );
    }
  }
  assert.equal(checked, publishedSlugs.size - unassigned.length, 'ジャーニーに載る全記事で記事末尾の案内を検証したこと');
});

// ─── 9. 3箇所が同じ定義を参照していること（二重管理の検出） ─────────────────
test('home, article footer and resources all read the same journey source', () => {
  assert.match(read('components/JourneyFinder.tsx'), /from '@\/lib\/reader-journeys'/);
  assert.match(read('components/ArticleJourneyNav.tsx'), /from '@\/lib\/reader-journeys'/);
  assert.match(read('app/resources/page.tsx'), /from '@\/lib\/reader-journeys'/);
  assert.match(read('app/page.tsx'), /JourneyFinder/);
  assert.match(read('app/articles/[slug]/page.tsx'), /ArticleJourneyNav/);

  // ジャーニー名・ステップラベル・Home の促し文を描画側へ書き写していないこと（写すと片方だけ古くなる）。
  // 短い呼び名（short）は「面談」「所見」のような一般語で誤検出するため対象にしない。
  const renderers = [
    'app/page.tsx',
    'app/resources/page.tsx',
    'app/articles/[slug]/page.tsx',
    'components/JourneyFinder.tsx',
    'components/ArticleJourneyNav.tsx',
  ];
  const literals = [
    ...journeys.map((j) => j.title),
    ...journeys.map((j) => j.homePrompt).filter(Boolean),
    ...journeys.flatMap((j) => j.steps.map((s) => s.label)),
  ];
  const duplicated = [];
  for (const file of renderers) {
    const source = read(file);
    for (const literal of literals) {
      if (source.includes(literal)) duplicated.push(`${file}: 「${literal}」を直書きしている`);
    }
  }
  assert.deepEqual(duplicated, [], 'ジャーニーの文言は lib/reader-journeys.ts だけが持つこと');

  // 様式の名前もジャーニー側へ写していないこと（practical-resources が唯一の真実）。
  const journeySource = read('lib/reader-journeys.ts');
  for (const resource of PRACTICAL_RESOURCES) {
    assert.equal(journeySource.includes(resource.asset), false, `reader-journeys に様式名を写している：${resource.asset}`);
  }
});

// ─── 10. 順番の無い形を、番号・矢印・前後で並べないこと ────────────────────
test('hub and conditional journeys never render a fake linear order', () => {
  const finder = read('components/JourneyFinder.tsx');
  const nav = read('components/ArticleJourneyNav.tsx');
  const resources = read('app/resources/page.tsx');

  // 3箇所とも、形で描き分けていること。
  for (const kind of ['sequence', 'hub', 'conditional']) {
    assert.match(finder, new RegExp(`journey\\.kind === '${kind}'`), `Home が ${kind} を描き分けていること`);
    assert.match(nav, new RegExp(`position\\.kind === '${kind}'`), `記事末尾が ${kind} を描き分けていること`);
  }
  assert.match(resources, /journey\.kind === 'sequence'/, '/resources が順番のあるものだけを番号つきにしていること');

  // Home: 順番の無いカードに、番号（<ol>）・矢印・「この順」を出さない。
  for (const name of ['HubCard', 'ConditionalCard', 'ChoiceList']) {
    const body = functionBody(finder, name);
    assert.doesNotMatch(body, /<ol/, `${name}: 順番の無い選択肢を <ol> にしている`);
    assert.doesNotMatch(body, /→/, `${name}: 矢印で順番を示している`);
    assert.doesNotMatch(body, /この順|（1\//, `${name}: 「この順」で順番を強いている`);
  }
  assert.match(functionBody(finder, 'SequenceCard'), /<ol/);
  assert.match(functionBody(finder, 'SequenceCard'), /この順/);

  // 記事末尾: 「前の段・次の段・段目」は sequence だけが使う。
  for (const name of ['HubNav', 'ConditionalNav', 'StepCard']) {
    assert.doesNotMatch(functionBody(nav, name), /前の段|次の段|段目/, `${name}: 順番の無い形で前後の段を示している`);
  }
  const sequenceNav = functionBody(nav, 'SequenceNav');
  assert.match(sequenceNav, /前の段/);
  assert.match(sequenceNav, /次の段/);

  // /resources: 兄弟の選択肢は番号なしの <ul>。番号は sequence のグループだけ。
  const choiceGroup = functionBody(resources, 'ChoiceGroup');
  assert.doesNotMatch(choiceGroup, /index \+ 1|<ol/, 'ChoiceGroup: 兄弟の選択肢に番号を振っている');
  assert.match(choiceGroup, /<ul/);
  const sequenceGroup = functionBody(resources, 'SequenceGroup');
  assert.match(sequenceGroup, /index \+ 1/);
  assert.match(sequenceGroup, /<ol/);
});

// ─── 11. Home のカードは入口を選ぶ層にとどめること ─────────────────────────
test('home journey cards stay a compact entry layer', () => {
  const finder = read('components/JourneyFinder.tsx');
  // 条件（when）・決めること（decision）・記事タイトルは記事末尾と /resources に任せる。
  assert.doesNotMatch(finder, /\.when\b/, 'Home カードに「どんなときに読むか」を出している');
  assert.doesNotMatch(finder, /\.decision\b/, 'Home カードに「決めること」を出している');
  assert.doesNotMatch(finder, /getAllArticles|titles?\.get\(/, 'Home カードに記事タイトルを出している');
  assert.match(finder, /\.short\b/, 'Home カードは短い呼び名で入口を示すこと');
  // 起点のある hub は起点をボタンにし、場面別の記事は控えめなリンクにする（安全の関門と同格に見せない）。
  const hub = functionBody(finder, 'HubCard');
  assert.match(hub, /className=\{primaryButton\}/, '起点をボタンとして目立たせること');
  assert.match(hub, /subdued/, '場面別の記事を控えめなリンクにすること');
  // 起点の無い hub と conditional は、何を選ぶかの一言（homePrompt）で選択肢を示す。
  assert.match(hub, /journey\.homePrompt/);
  assert.match(functionBody(finder, 'ConditionalCard'), /journey\.homePrompt/);
});

// ─── 12. ジャーニー UI がサーバー描画のままであること ───────────────────────
test('journey UI stays server-rendered, with no client JavaScript', () => {
  for (const file of ['components/JourneyFinder.tsx', 'components/ArticleJourneyNav.tsx', 'app/resources/page.tsx']) {
    const source = read(file);
    assert.doesNotMatch(source, /'use client'/, `${file}: クライアントコンポーネントにしないこと`);
    assert.doesNotMatch(source, /useState|useEffect|onClick/, `${file}: 不要な JS を持たないこと`);
  }
  // 記事末尾のリンクは、記事タイトルとその記事で決めることを必ず添える（「前へ」「次へ」だけにしない）。
  const card = functionBody(read('components/ArticleJourneyNav.tsx'), 'StepCard');
  assert.match(card, /\{title\}/);
  assert.match(card, /step\.decision/);
});

// ─── 13. Home のカテゴリ導線を残し、重複した記事一覧を戻さないこと ───────────
test('home keeps category navigation and drops duplicated article lists', () => {
  const home = read('app/page.tsx');
  assert.match(home, /分野から探す/, 'Home にカテゴリの入口が残っていること');
  assert.match(home, /categories\/\$\{CATEGORY_TO_SLUG\[cat\]\}/, 'カテゴリページへのリンクが残っていること');
  assert.match(read('components/Header.tsx'), /categories\//, 'ヘッダーのカテゴリ導線が残っていること');
  assert.match(home, /最新記事/, '記事一覧は最新記事の1つを残すこと');
  // 最新記事と重複していた面を戻さない（判断の理由をコメントで残すのは許すため、描画と変数だけを見る）。
  assert.doesNotMatch(home, />\s*最近更新した記事\s*</);
  assert.doesNotMatch(home, /recentlyUpdated/);
  assert.doesNotMatch(home, /このサイトの中心/, '特別支援教育の新着3件の面（最新記事と全件重複）を戻さない');
  assert.doesNotMatch(home, /specialNeedsArticles/);
});

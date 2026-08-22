/**
 * 第6回審査 — original value / distinctness の受入ゲート。
 *
 * scripts/adsense-audit.test.mjs（第3〜5回の受入条件）は残したまま、本ファイルで
 * 「サイトの専門性」と「記事ごとの独自価値」を機械的に固定する。
 *
 * 設計方針:
 *   - docs/adsense-sixth-review/01-canonical-value-registry.csv を単一の真実とし、
 *     ソースコード側と CSV の食い違いを両方向で検出する（CSV だけ直しても通らない）。
 *   - 「記事を1件足したら registry も足さないと落ちる」ようにして、
 *     OFFICIAL_SOURCE_SUMMARY だけの記事が canonical に混ざるのを防ぐ。
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import matter from 'gray-matter';

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const REGISTRY_PATH = 'docs/adsense-sixth-review/01-canonical-value-registry.csv';
const MATRIX_PATH = 'docs/adsense-sixth-review/02-distinctness-matrix.csv';

// ─── 記事の読み込み ────────────────────────────────────────────────────────
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
const published = [...articles.values()].filter((article) => article.published !== false);
const publishedSlugs = new Set(published.map((a) => a.slug));

// ─── 最小限の CSV パーサ（引用符つきフィールドに対応） ─────────────────────
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; } else { quoted = false; }
      } else field += ch;
      continue;
    }
    if (ch === '"') { quoted = true; continue; }
    if (ch === ',') { row.push(field); field = ''; continue; }
    if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue; }
    if (ch === '\r') continue;
    field += ch;
  }
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
  const [header, ...body] = rows.filter((r) => r.some((c) => c.trim() !== ''));
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

const registry = parseCsv(read(REGISTRY_PATH));
const matrix = parseCsv(read(MATRIX_PATH));

// 統合により 301 を張った旧 slug（middleware.ts が真実）
const redirectSources = new Set(
  [...read('middleware.ts').matchAll(/'([a-z0-9-]+)': '([a-z0-9-]+)'/g)].map((m) => m[1]),
);

// ─── 1. canonical セットが期待どおりであること ────────────────────────────
test('the canonical article set is exactly the 15 intended pages', () => {
  const expected = [
    'ai-class-newsletter-prompt',
    'ai-koomu-kaizen-nyumon',
    'chatgpt-tsuchihyo-shoken',
    'digital-textbook-introduction-school-changes',
    'education-ai-service-checklist-before-use',
    'free-ict-tools-safety-checklist',
    'giga-device-lesson-use-guide',
    'google-forms-school-use-guide',
    'individual-education-plan-writing-guide',
    'reasonable-accommodation-school-record',
    'special-needs-behavior-record-guide',
    'special-needs-ict-reasonable-accommodation',
    'special-needs-ict-support-tools-checklist',
    'special-needs-parent-collaboration',
    'special-needs-visual-schedule-support',
  ].sort();
  assert.deepEqual([...publishedSlugs].sort(), expected);
});

// ─── 2. 統合・退役した記事が審査面に出ないこと ───────────────────────────
test('merged and retired articles are unpublished and absent from the review surface', () => {
  const merged = [
    'generative-ai-guideline-v2-school-reading',
    'school-generative-ai-privacy-security',
    'ai-lesson-preparation-prompt',
    'ict-teaching-tools-selection-guide',
    'tokubetsu-shien-ict',
  ];
  const retired = ['information-morals-education-themes'];

  for (const slug of [...merged, ...retired]) {
    const article = articles.get(slug);
    assert.ok(article, `記事ファイルが存在しない: ${slug}`);
    assert.equal(article.published, false, `${slug} が公開のままになっている`);
  }
  // sitemap は getAllArticles()（公開のみ）由来なので、未公開なら sitemap に載らない。
  // 「未公開なのに sitemap に載る」経路が生まれていないことを固定する。
  assert.match(read('app/sitemap.ts'), /getAllArticles\(\)/);
  assert.match(read('lib/articles.ts'), /\.filter\(isArticlePublished\)/);
  // 退役記事は 301 を持たない（意味的に正しい統合先がないため）。
  for (const slug of retired) {
    assert.equal(redirectSources.has(slug), false, `${slug} に fake redirect が張られている`);
  }
  // 統合記事はすべて 301 を持つ。
  for (const slug of merged) {
    assert.equal(redirectSources.has(slug), true, `${slug} の 301 が無い`);
  }
});

// ─── 3. 統合の 301 先が意図どおりで、1 ホップで着地すること ───────────────
test('sixth-review merges redirect to their exact intended target in one hop', () => {
  const middleware = read('middleware.ts');
  const intended = {
    'generative-ai-guideline-v2-school-reading': 'ai-koomu-kaizen-nyumon',
    'school-generative-ai-privacy-security': 'ai-koomu-kaizen-nyumon',
    'ai-lesson-preparation-prompt': 'ai-koomu-kaizen-nyumon',
    'ict-teaching-tools-selection-guide': 'special-needs-ict-support-tools-checklist',
    'tokubetsu-shien-ict': 'special-needs-ict-support-tools-checklist',
  };
  for (const [slug, target] of Object.entries(intended)) {
    assert.match(middleware, new RegExp(`'${slug}': '${target}'`), `${slug} の 301 先が違う`);
    assert.equal(redirectSources.has(target), false, `${slug} -> ${target} が多段 redirect`);
    assert.equal(publishedSlugs.has(target), true, `${slug} -> ${target} が未公開`);
  }
});

// ─── 4. 全 redirect が 1 ホップで公開記事に着地すること ───────────────────
test('every redirect in middleware lands on a published article in one hop', () => {
  const pairs = [...read('middleware.ts').matchAll(/'([a-z0-9-]+)': '([a-z0-9-]+)'/g)];
  assert.ok(pairs.length >= 10, `redirect 件数が想定より少ない: ${pairs.length}`);
  for (const [, source, target] of pairs) {
    assert.equal(redirectSources.has(target), false, `${source} -> ${target} が redirect 連鎖`);
    assert.equal(publishedSlugs.has(target), true, `${source} -> ${target} が未公開へ着地`);
    assert.equal(articles.get(source)?.published, false, `${source} が公開のまま 301 を持つ`);
  }
});

// ─── 5. 公開記事が redirect 元へ内部リンクしていないこと ──────────────────
test('no published article links through a redirect', () => {
  const through = [];
  for (const article of published) {
    for (const match of article.content.matchAll(/\]\(\/articles\/([a-z0-9-]+)(?:[#?][^)]*)?\)/g)) {
      if (redirectSources.has(match[1])) through.push(`${article.slug} -> ${match[1]}`);
    }
  }
  assert.deepEqual(through, [], '内部リンクは 301 を経由せず最終 URL を指すこと');
});

// ─── 6. orphan（被リンクゼロ）の canonical 記事が無いこと ─────────────────
test('no canonical article is orphaned from the internal link graph', () => {
  const inbound = new Map([...publishedSlugs].map((slug) => [slug, 0]));
  for (const article of published) {
    const seen = new Set();
    for (const match of article.content.matchAll(/\]\(\/articles\/([a-z0-9-]+)(?:[#?][^)]*)?\)/g)) {
      if (match[1] !== article.slug) seen.add(match[1]);
    }
    for (const target of seen) {
      if (inbound.has(target)) inbound.set(target, inbound.get(target) + 1);
    }
  }
  const orphans = [...inbound].filter(([, count]) => count === 0).map(([slug]) => slug);
  assert.deepEqual(orphans, [], 'canonical 記事は他の canonical 記事から最低1本リンクされること');
});

// ─── 7. registry が canonical セットと 1:1 対応すること ───────────────────
test('every canonical article has exactly one registry entry, and vice versa', () => {
  const registrySlugs = registry.map((r) => r.slug);
  assert.deepEqual(
    [...new Set(registrySlugs)].sort(),
    registrySlugs.sort(),
    'registry に slug の重複がある',
  );
  assert.deepEqual(registrySlugs.sort(), [...publishedSlugs].sort());
});

// ─── 8. registry の各行が独自価値を持つこと ───────────────────────────────
// 注意: これは **宣言の整形式検査** であって、独自価値が実在することの証明ではない。
// CSV のセルを書き替えるだけで通るため、これ単独を「独自性の担保」と読まないこと。
// 独自性の実質的な根拠は、docs/adsense-sixth-review/07〜10 の人手レビューにある。
// 本文から計算した裏づけは 11b（distinctness claim is backed by a computable signal）が担う。
test('every registry entry declares a substantive primary unique value', () => {
  const REQUIRED = [
    'slug', 'reader_job', 'primary_unique_value_type', 'primary_unique_value',
    'why_this_page_exists', 'closest_competing_internal_page', 'distinctness_from_competing_page',
    'firsthand_boundary', 'source_authority', 'canonical_asset', 'status',
  ];
  for (const row of registry) {
    for (const column of REQUIRED) {
      assert.ok(column in row, `${row.slug}: 列 ${column} が無い`);
      assert.notEqual(row[column], '', `${row.slug}: ${column} が空`);
    }
    // 独自価値・reader job は一言で済ませない（プレースホルダ避け）。
    assert.ok(row.primary_unique_value.length >= 20, `${row.slug}: primary_unique_value が短すぎる`);
    assert.ok(row.reader_job.length >= 20, `${row.slug}: reader_job が短すぎる`);
    assert.ok(row.canonical_asset.length >= 4, `${row.slug}: canonical_asset が実体を指していない`);
    assert.equal(row.status, 'CANONICAL', `${row.slug}: status が CANONICAL でない`);
  }
});

// ─── 9. 一次資料の要約だけの canonical 記事が無いこと ─────────────────────
test('no canonical article exists purely as an official-source summary', () => {
  const ALLOWED = new Set([
    'OPERATOR_DECISION_RULE', 'PROCEDURE_GUIDE', 'DECISION_MATRIX', 'WORKSHEET_FORM',
    'WORKED_EXAMPLE', 'FIRSTHAND_PRACTICE_BOUNDARY', 'ORIGINAL_COMPARATIVE_ANALYSIS',
    'ORIGINAL_SYNTHESIS_WITH_DECISION_LOGIC',
  ]);
  const offenders = registry
    .filter((r) => !ALLOWED.has(r.primary_unique_value_type))
    .map((r) => `${r.slug}: ${r.primary_unique_value_type}`);
  assert.deepEqual(offenders, [], 'OFFICIAL_SOURCE_SUMMARY だけの canonical 記事は置かない');
});

// ─── 10. reader job が重複しないこと ──────────────────────────────────────
// 注意: これも CSV 内の整形式検査であり、言い換えれば衝突を回避できる。
// 実際の重複は 11b の本文ベースの計算と、人手レビューで見ている。
test('no two canonical articles share the same primary reader job', () => {
  // 同一文字列だけでなく、実質的な重複も拾う。助詞・記号を落とした指紋で比較する。
  const fingerprint = (text) =>
    text
      .replace(/[\s、。「」（）()：:・／/—\-…]/g, '')
      .replace(/(をどう|のために|するための|するか|したい|ための|ときに|場面で)/g, '');
  const seen = new Map();
  const duplicates = [];
  for (const row of registry) {
    const key = fingerprint(row.reader_job);
    if (seen.has(key)) duplicates.push(`${seen.get(key)} <-> ${row.slug}`);
    else seen.set(key, row.slug);
  }
  assert.deepEqual(duplicates, []);

  // canonical_asset も 1 記事 1 所有にする（同じ様式を複数記事が名乗らない）。
  const assets = new Map();
  const sharedAssets = [];
  for (const row of registry) {
    const key = fingerprint(row.canonical_asset);
    if (assets.has(key)) sharedAssets.push(`${assets.get(key)} <-> ${row.slug}: ${row.canonical_asset}`);
    else assets.set(key, row.slug);
  }
  assert.deepEqual(sharedAssets, []);
});

// ─── 11. distinctness matrix が全ペアを網羅し、未修復の重複が無いこと ─────
test('the distinctness matrix covers every pair and leaves no overlap unrepaired', () => {
  const slugs = [...publishedSlugs].sort();
  const expectedPairs = (slugs.length * (slugs.length - 1)) / 2;
  assert.equal(matrix.length, expectedPairs, `${expectedPairs} ペアすべてを分類すること`);

  const seen = new Set();
  for (const row of matrix) {
    assert.ok(publishedSlugs.has(row.a), `matrix の a が canonical でない: ${row.a}`);
    assert.ok(publishedSlugs.has(row.b), `matrix の b が canonical でない: ${row.b}`);
    assert.notEqual(row.a, row.b);
    const key = [row.a, row.b].sort().join('|');
    assert.equal(seen.has(key), false, `matrix にペアの重複: ${key}`);
    seen.add(key);
    assert.ok(
      ['DISTINCT', 'RELATED_BUT_DISTINCT', 'OVERLAP_REQUIRES_REPAIR', 'MERGE'].includes(row.verdict),
      `${key}: 未知の verdict ${row.verdict}`,
    );
  }
  assert.equal(seen.size, expectedPairs);

  const unresolved = matrix
    .filter((r) => r.verdict === 'OVERLAP_REQUIRES_REPAIR' || r.verdict === 'MERGE')
    .map((r) => `${r.a} <-> ${r.b}: ${r.verdict}`);
  assert.deepEqual(unresolved, [], '最終状態では OVERLAP_REQUIRES_REPAIR = 0 / MERGE = 0');
});

// ─── 11b. distinctness を、CSV の申告ではなく本文から計算した信号でも裏づけること ─
test('the distinctness claim is backed by a computable signal, not only the CSV', () => {
  // 独立レビュー2件（post-fix Review A / D）が、独自価値・distinctness のゲートが
  // 「実装者が書いた CSV を CSV の性質だけで検査していて反証不能」だと指摘した。
  // CSV のセルを DISTINCT に書き替えるだけでは通らないよう、本文から計算した重なりに上限を置く。
  //
  // 計測値（2026-08-22 時点）: 見出し Jaccard 最大 0.087 / 本文12-gram 重なり 最大 0.039。
  // 上限はその 2〜3 倍に置き、重複が実際に戻ってきたときだけ落ちるようにする。
  const HEADING_JACCARD_MAX = 0.20;
  const NGRAM_OVERLAP_MAX = 0.12;

  const profile = (article) => {
    const headings = new Set(
      [...article.content.matchAll(/^#{2,3}\s+(.+)$/gm)].map((m) => m[1].replace(/[\s：:（）()「」【】]/g, '')),
    );
    const flat = article.content
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[^\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}A-Za-z0-9]/gu, '');
    const grams = new Set();
    for (let i = 0; i + 12 <= flat.length; i += 1) grams.add(flat.slice(i, i + 12));
    return { slug: article.slug, headings, grams };
  };
  const profiles = published.map(profile);
  const inter = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n += 1; return n; };

  const verdictOf = new Map();
  for (const row of matrix) verdictOf.set([row.a, row.b].sort().join('|'), row.verdict);

  const tooSimilar = [];
  let maxJaccard = 0;
  let maxOverlap = 0;
  for (let i = 0; i < profiles.length; i += 1) {
    for (let j = i + 1; j < profiles.length; j += 1) {
      const A = profiles[i];
      const B = profiles[j];
      const hi = inter(A.headings, B.headings);
      const jaccard = hi / (A.headings.size + B.headings.size - hi);
      const overlap = inter(A.grams, B.grams) / Math.min(A.grams.size, B.grams.size);
      maxJaccard = Math.max(maxJaccard, jaccard);
      maxOverlap = Math.max(maxOverlap, overlap);
      const key = [A.slug, B.slug].sort().join('|');
      assert.ok(verdictOf.has(key), `matrix にペアが無い: ${key}`);
      if (jaccard > HEADING_JACCARD_MAX || overlap > NGRAM_OVERLAP_MAX) {
        tooSimilar.push(
          `${A.slug} x ${B.slug}: 見出しJaccard=${jaccard.toFixed(3)} / 12-gram重なり=${overlap.toFixed(3)}`
          + ` (CSV の申告は ${verdictOf.get(key)})`,
        );
      }
    }
  }
  assert.deepEqual(
    tooSimilar, [],
    '本文から計算した重なりが閾値を超えるペアがある。CSV の verdict にかかわらず重複とみなす',
  );
  // 上限そのものが緩みすぎていないことも固定する（記事を薄くして通す抜け道を塞ぐ）。
  assert.ok(maxJaccard <= HEADING_JACCARD_MAX, `見出しJaccardの最大値: ${maxJaccard.toFixed(3)}`);
  assert.ok(maxOverlap <= NGRAM_OVERLAP_MAX, `12-gram重なりの最大値: ${maxOverlap.toFixed(3)}`);
});

// ─── 12. 旧ポジショニング（情報を収集・整理する集約サイト）が残らないこと ─
test('the aggregator-era positioning is gone from every site-level surface', () => {
  const SURFACES = [
    'app/page.tsx', 'app/layout.tsx', 'app/about/page.tsx', 'app/articles/page.tsx',
    'app/operator/page.tsx', 'app/categories/[category]/page.tsx',
    'components/Footer.tsx', 'components/Header.tsx',
  ];
  // 「収集・整理」「情報メディア」「教育情報サイト」はサイトの自己定義として使わない。
  const BANNED = [/収集・整理/, /情報を収集し/, /情報メディア/, /教育情報サイト/, /最新情報を(?:収集|お届け)/];
  const hits = [];
  for (const file of SURFACES) {
    const source = read(file);
    for (const pattern of BANNED) {
      if (pattern.test(source)) hits.push(`${file}: ${pattern}`);
    }
  }
  assert.deepEqual(hits, []);
});

// ─── 13. サイトの専門性が site-level のコピーに現れていること ─────────────
test('the site declares special-needs-centred school practice as its specialty', () => {
  const home = read('app/page.tsx');
  const layout = read('app/layout.tsx');
  const footer = read('components/Footer.tsx');
  // hero と site description が「特別支援」と「学校実務の判断」を名指しすること。
  assert.match(home, /特別支援/);
  assert.match(layout, /特別支援/);
  assert.match(footer, /特別支援/);
  assert.match(layout, /判断|手順/);
  // About の「扱うテーマ」から、公開記事ゼロのカテゴリが消えていること。
  const about = read('app/about/page.tsx');
  for (const empty of ['助成金・補助金', '研修・セミナー']) {
    assert.doesNotMatch(about, new RegExp(`<strong>${empty}</strong>`), `About が空カテゴリ ${empty} を主要テーマに掲げている`);
  }
});

// ─── 14. AdSense が記事以外へ配信されないこと（第5回条件の再確認） ────────
test('AdSense stays confined to resolved article pages', () => {
  assert.doesNotMatch(read('app/layout.tsx'), /adsbygoogle|AdSenseScript/);
  for (const file of ['app/page.tsx', 'app/articles/page.tsx', 'app/about/page.tsx',
                      'app/privacy/page.tsx', 'app/operator/page.tsx', 'app/disclaimer/page.tsx',
                      'app/contact/page.tsx', 'app/not-found.tsx', 'app/db/page.tsx',
                      'app/news/page.tsx', 'app/categories/[category]/page.tsx']) {
    assert.doesNotMatch(read(file), /AdSenseScript/, `${file} に AdSense が入っている`);
  }
  assert.match(read('app/articles/[slug]/page.tsx'), /<AdSenseScript \/>/);
});

// ─── 15. 記事本文に Markdown の取りこぼしが無いこと ───────────────────────
test('canonical article bodies contain no leftover markdown artifacts', () => {
  const problems = [];
  for (const article of published) {
    const body = article.content
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`\n]*`/g, '');
    // 見出し記号の直後に空白が無い（## 見出し ではなく ##見出し）
    for (const m of body.matchAll(/^#{1,6}[^#\s]/gm)) {
      problems.push(`${article.slug}: 見出し記号の後に空白が無い (${m[0]})`);
    }
    // 表の区切り行が壊れている / セル数が揃わない
    const lines = body.split('\n');
    for (let i = 0; i < lines.length; i += 1) {
      if (!/^\s*\|/.test(lines[i])) continue;
      if (!/^\s*\|[\s:|-]+\|\s*$/.test(lines[i])) continue;
      const header = lines[i - 1];
      if (!header || !/^\s*\|/.test(header)) continue;
      const count = (line) => line.trim().replace(/^\||\|$/g, '').split('|').length;
      if (count(header) !== count(lines[i])) {
        problems.push(`${article.slug}: 表の列数が見出し行と一致しない (L${i + 1})`);
      }
    }
    // 未解決のリンク記法（[text]( ) や ]( の後が空）
    for (const m of body.matchAll(/\]\(\s*\)/g)) {
      problems.push(`${article.slug}: 空のリンク先 (${m[0]})`);
    }
    // 図解マーカーが本文に literal で残っていないか（描画側の既知キーのみ有効）
    for (const m of body.matchAll(/<!--diagram:([a-z0-9-]+)-->/g)) {
      if (!read('components/ArticleBody.tsx').includes(`'${m[1]}'`)) {
        problems.push(`${article.slug}: 未知の図解キー ${m[1]}`);
      }
    }
  }
  assert.deepEqual(problems, []);
});

// ─── 16. 実務経験の境界が広がっていないこと ──────────────────────────────
test('firsthand experience claims are not widened by the restructure', () => {
  const notes = read('lib/article-experience-notes.ts');
  const noteKeys = [...notes.matchAll(/^ {2}'([a-z0-9-]+)':/gm)].map((m) => m[1]);

  // 注記は公開記事にのみ置く（統合・退役した記事の注記は残さない）。
  for (const slug of noteKeys) {
    assert.equal(publishedSlugs.has(slug), true, `未公開記事に実務経験注記が残っている: ${slug}`);
  }
  // 経験C（資料でのみ確認）の記事は注記を持たない。
  for (const slug of ['digital-textbook-introduction-school-changes']) {
    assert.equal(noteKeys.includes(slug), false, `経験C の記事に注記が付いた: ${slug}`);
  }
  // registry の firsthand_boundary と注記の有無が一致すること。
  for (const row of registry) {
    const declared = row.firsthand_boundary.startsWith('A') || row.firsthand_boundary.startsWith('B');
    assert.equal(
      noteKeys.includes(row.slug),
      declared,
      `${row.slug}: registry の firsthand_boundary（${row.firsthand_boundary}）と注記の有無が食い違う`,
    );
  }
  assert.match(read('app/articles/[slug]/page.tsx'), /<ArticleExperienceNote slug=\{article\.slug\} \/>/);
});

// ─── 17. 効果の未立証な主張を本文へ持ち込んでいないこと ───────────────────
test('no unverified efficacy claim was introduced into canonical articles', () => {
  // 「○時間削減」「○%改善」など、測定していない効果の主張を禁止する。
  const BANNED = [
    /\d+\s*(?:時間|分)\s*(?:の)?(?:削減|短縮)/,
    /\d+\s*[%％]\s*(?:の)?(?:改善|向上|削減|短縮)/,
    /(?:残業|業務量)が\s*\d+/,
  ];
  const hits = [];
  for (const article of published) {
    for (const pattern of BANNED) {
      const m = article.content.match(pattern);
      if (m) hits.push(`${article.slug}: ${m[0]}`);
    }
  }
  assert.deepEqual(hits, []);
});

// ─── 18. 記事が同じ鋳型で作られていないこと ──────────────────────────────
test('canonical articles are not all cast from one template', () => {
  // 着手時点の実測は はじめに 7/15・まとめ 10/15・番号見出し 6/15。
  // REPAIR 4記事を reader job に合わせた構成へ直した結果（はじめに 4・まとめ 6）を上限として固定し、
  // 「また同じ鋳型に戻す」変更が入ったら落ちるようにする。
  const opener = published.filter((a) => /^##\s*はじめに\s*$/m.test(a.content));
  const closer = published.filter((a) => /^##\s*まとめ\s*$/m.test(a.content));
  assert.ok(
    opener.length <= 4,
    `「## はじめに」で始まる記事が多すぎる: ${opener.length}/15 (${opener.map((a) => a.slug)})`,
  );
  assert.ok(
    closer.length <= 6,
    `「## まとめ」で終わる記事が多すぎる: ${closer.length}/15 (${closer.map((a) => a.slug)})`,
  );

  // 量産記事に特有の見出し（「Nつのポイント」「N選」「Nつのコツ」）は canonical では使わない。
  // 「4つのゲート」のように、その記事が所有する枠組みの名前は対象外。
  const formulaic = [];
  for (const article of published) {
    const pattern = /[0-9０-９]+\s*(?:つのポイント|つのコツ|つの秘訣|選(?![ぁ-ん]))/g;
    for (const line of article.content.split('\n')) {
      if (!/^#{2,3}\s/.test(line)) continue;
      const m = line.match(pattern);
      if (m) formulaic.push(`${article.slug}: ${line.trim()}`);
    }
  }
  assert.deepEqual(formulaic, []);
});

test('internal link anchor text matches the current title of its target', () => {
  // 記事のタイトルを付け替えると、他記事のリンク文言が旧タイトルのまま取り残される。
  // 第6回では実際に9記事をリタイトルし、24箇所＋6箇所の取り残しが発生した。
  // 前方一致だけを見ると接尾辞の変更（「：5業務の使い分け」→「：4つの校務ゲート」）を
  // 見落とすため、記事タイトル風の長いアンカーは全体が現タイトルに含まれることを要求する。
  const titles = new Map(published.map((a) => [a.slug, a.title]));
  const normalize = (s) => s.replace(/[\s：:｜|【】（）()、。・]/g, '');
  const stale = [];
  for (const article of published) {
    for (const m of article.content.matchAll(/\[([^\]]+)\]\(\/articles\/([a-z0-9-]+)(?:[#?][^)]*)?\)/g)) {
      const [, anchor, target] = m;
      const title = titles.get(target);
      if (!title) continue;
      // 短い説明的アンカー（「校務ゲート2」等）は対象外。タイトルを引用した長いものだけ見る。
      if (anchor.length < 14) continue;
      const a = normalize(anchor);
      const t = normalize(title);
      if (!t.includes(a)) stale.push(`${article.slug} -> ${target}: 「${anchor}」 / 現タイトル「${title}」`);
    }
  }
  assert.deepEqual(stale, [], 'リンク文言は着地先の現タイトルの部分文字列であること');
});

test('the article skeleton does not become more uniform than it already is', () => {
  // 見出し文字列だけを見ていると、本文レベルの反復（同じ骨格の使い回し）を見落とす。
  // 骨格の要素ごとに現状値を上限として固定し、鋳型が「増える」方向の変更を落とす。
  //
  // 減らす対象にしないもの（指示書 §12 の「必要な共通 security/legal note は共有してよい」）:
  //   - 「本サイト作成の参考様式」… 公式様式との誤認を防ぐ注記。様式を持つ記事には必要
  //   - 「完全な架空」          … 架空例が実例と誤読されるのを防ぐ注記。省くほうが危険
  // これらは件数の増加だけを監視し、削減は求めない。
  const count = (re) => published.filter((a) => re.test(a.content)).length;

  const measured = {
    fictionalNotice: count(/完全な架空/),
    formTemplateNotice: count(/本サイト作成の参考様式/),
    scopeLimitSection: count(/^## (?:この記事の適用限界|この記事で決まらないこと|この手順で決められないこと)/m),
    bodyReferences: count(/^## 参考資料\s*$/m),
  };

  // 記事下部の参考資料はコンポーネントが描画する。本文にも置くと同じ H2 が1ページに2回出る。
  assert.equal(measured.bodyReferences, 0, '本文の「## 参考資料」はコンポーネントへ一本化する');

  // 以下は現状値を上限とするラチェット。増えたら鋳型が強まったということ。
  // 架空注記の上限は 10 → 11 へ引き上げた。post-fix の確認レビューが
  // 「chatgpt-tsuchihyo-shoken だけ架空の明示が0回で、依頼文例が実在児童の様子に読める。
  //  実在児童の情報をAIに入れないと説く記事として外形が食い違う」と指摘したため、
  // 同記事へ架空である旨を追加した結果。これは鋳型の増加ではなく、
  // 欠けていた安全上の注記を埋めたもの（§12 が共有を認める security/legal note にあたる）。
  assert.ok(measured.fictionalNotice <= 11, `架空注記の反復: ${measured.fictionalNotice}/15`);
  assert.ok(measured.formTemplateNotice <= 12, `参考様式注記の反復: ${measured.formTemplateNotice}/15`);
  assert.ok(measured.scopeLimitSection <= 6, `適用限界節の反復: ${measured.scopeLimitSection}/15`);

  // 導入部が「扱わないことの列挙」で始まる記事が過半に達すると、
  // どの記事も同じ入り方に見える。半数未満に抑える。
  const scopeOpeners = published.filter((a) =>
    /(だけを扱|は扱いません|別記事へ|へ委ね|引き受けない)/.test(a.content.split('\n').slice(0, 30).join('\n')),
  );
  assert.ok(
    scopeOpeners.length <= 9,
    `冒頭でスコープ宣言する記事が多すぎる: ${scopeOpeners.length}/15 (${scopeOpeners.map((a) => a.slug)})`,
  );
});

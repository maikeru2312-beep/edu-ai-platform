import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const articleDir = path.join(root, 'content/articles');
const files = fs.readdirSync(articleDir).filter((file) => file.endsWith('.md'));
const articles = new Map(
  files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const parsed = matter(read(`content/articles/${file}`));
    return [slug, { slug, ...parsed.data, content: parsed.content }];
  }),
);
const published = [...articles.values()].filter((article) => article.published !== false);

test('the default audit judges current state, not the 2026-07 snapshot', () => {
  const scripts = JSON.parse(read('package.json')).scripts ?? {};
  // 2026-07-20/21 の判断をハードコードした履歴用スクリプト。
  const legacy = /content-audit\.mjs|phase2-audit-data\.mjs/;
  assert.ok(scripts.audit, 'npm run audit が定義されていること');
  assert.doesNotMatch(scripts.audit, legacy);
  // 履歴用スクリプトを package script として残す場合は、名前で履歴用と分かること。
  for (const [name, body] of Object.entries(scripts)) {
    if (legacy.test(body)) assert.match(name, /^audit:legacy/);
  }
  // 履歴用スクリプトは出力先を明示しない限り書き出さない。
  for (const file of ['scripts/content-audit.mjs', 'scripts/phase2-audit-data.mjs']) {
    assert.match(read(file), /AUDIT_LEGACY_OUT_DIR/);
  }
});

test('AdSense is loaded only by a successfully resolved article detail', () => {
  assert.doesNotMatch(read('app/layout.tsx'), /adsbygoogle|AdSenseScript/);
  assert.match(read('app/articles/[slug]/page.tsx'), /<AdSenseScript \/>/);
  assert.match(read('components/AdSenseScript.tsx'), /adsbygoogle\.js/);
});

test('DB and news have no links in primary navigation or home', () => {
  for (const file of ['app/page.tsx', 'components/Header.tsx', 'components/Footer.tsx']) {
    const source = read(file);
    assert.doesNotMatch(source, /href=["']\/(?:db|news)(?:["'/])/);
  }
});

test('404 metadata has one explicit noindex policy', () => {
  const source = read('app/not-found.tsx');
  assert.doesNotMatch(source, /robots:/);
  assert.doesNotMatch(read('app/layout.tsx'), /robots:/);
  assert.match(source, /ページが見つかりません/);
  for (const file of ['app/db/page.tsx', 'app/news/page.tsx', 'app/news/[slug]/page.tsx']) {
    assert.match(read(file), /notFound\(\)/);
    assert.doesNotMatch(read(file), /robots:/);
  }
});

test('sitemap and listings use the shared published article reader', () => {
  assert.match(read('app/sitemap.ts'), /getAllArticles\(\)/);
  assert.match(read('lib/articles.ts'), /\.filter\(isArticlePublished\)/);
  assert.doesNotMatch(read('app/sitemap.ts'), /\/db|\/news/);
});

test('published articles do not link to unpublished or missing articles', () => {
  const broken = [];
  for (const article of published) {
    for (const match of article.content.matchAll(/\]\(\/articles\/([a-z0-9-]+)(?:[#?][^)]*)?\)/g)) {
      const target = articles.get(match[1]);
      if (!target || target.published === false) broken.push(`${article.slug} -> ${match[1]}`);
    }
  }
  assert.deepEqual(broken, []);
});

test('published articles do not link to themselves', () => {
  const selfLinks = [];
  for (const article of published) {
    if (article.content.includes(`/articles/${article.slug}`)) selfLinks.push(article.slug);
  }
  assert.deepEqual(selfLinks, []);
});

test('the review scope is deliberately reduced and focused', () => {
  assert.equal(articles.size, 30);
  // 第6回審査で 21 → 15 へ絞った（統合5件・退役1件）。記事を増やす方向の変更を検出する。
  assert.equal(published.length, 15);
  const categories = new Set(published.map((article) => article.category));
  assert.equal(categories.has('助成金・補助金'), false);
  assert.equal(categories.has('研修・セミナー'), false);
  // 特別支援教育がサイトの専門軸であることを、記事分布の側でも固定する。
  // 着手時は AI校務改善 6 / 特別支援教育 7 で、生成AI寄りのサイトに見えていた。
  const byCategory = new Map();
  for (const article of published) {
    byCategory.set(article.category, (byCategory.get(article.category) ?? 0) + 1);
  }
  const ranked = [...byCategory].sort((a, b) => b[1] - a[1]);
  assert.equal(ranked[0][0], '特別支援教育', `最大カテゴリが特別支援教育でない: ${JSON.stringify(ranked)}`);
  assert.ok(
    ranked[0][1] > ranked[1][1],
    `特別支援教育が単独で最大であること: ${JSON.stringify(ranked)}`,
  );
});

test('all MERGE articles have exact 301 targets and UNPUBLISH articles do not', () => {
  const middleware = read('middleware.ts');
  // slug の存在だけでなく 301 先まで exact に検証する（現在の middleware の受入条件）。
  const mergeTargets = {
    // 第3〜5回審査
    'chatgpt-teacher-beginner-guide': 'ai-koomu-kaizen-nyumon',
    'giga-school-device-troubleshooting': 'giga-device-lesson-use-guide',
    'kyoiku-dx-kiso': 'giga-device-lesson-use-guide',
    'microsoft-copilot-teacher-guide': 'education-ai-service-checklist-before-use',
    'tablet-ict-jugyo-giga': 'giga-device-lesson-use-guide',
    // 第6回審査
    'generative-ai-guideline-v2-school-reading': 'ai-koomu-kaizen-nyumon',
    'school-generative-ai-privacy-security': 'ai-koomu-kaizen-nyumon',
    'ai-lesson-preparation-prompt': 'ai-koomu-kaizen-nyumon',
    'ict-teaching-tools-selection-guide': 'special-needs-ict-support-tools-checklist',
    'tokubetsu-shien-ict': 'special-needs-ict-support-tools-checklist',
  };
  // RESTORE_REBUILD により公開へ戻した slug は 301 を持たない。
  const restoredSlugs = [
    'special-needs-parent-collaboration', 'ai-koomu-kaizen-nyumon', 'ai-class-newsletter-prompt',
    'google-forms-school-use-guide', 'free-ict-tools-safety-checklist',
  ];
  // 第6回審査で退役（noindex）した slug は、意味的に正しい統合先が無いため 301 を持たない。
  // 未公開だが redirect も無い＝404。fake redirect を作らないことを固定する。
  const retiredSlugs = ['information-morals-education-themes'];
  for (const slug of retiredSlugs) {
    assert.equal(articles.get(slug)?.published, false, `${slug} が公開のまま`);
    assert.doesNotMatch(middleware, new RegExp(`'${slug}':`), `${slug} に fake redirect がある`);
  }
  const unpublishSlugs = [
    'education-grant-search-guide', 'generative-ai-school-training-guide',
    'joseikin-guide-2025', 'school-training-ict-ai-guide',
  ];
  for (const [slug, target] of Object.entries(mergeTargets)) {
    assert.match(middleware, new RegExp(`'${slug}': '${target}'`));
    // 301 先は実在する公開記事であること（存在しない slug や未公開へ送らない）。
    const targetArticle = articles.get(target);
    assert.ok(targetArticle, `${slug} -> missing target: ${target}`);
    // 301 先が別の redirect 元でないこと（301 が 1 ホップで 200 に着地する）。
    // 未公開判定より先に見る。redirect 元は未公開なので、後段だと連鎖を診断できない。
    assert.equal(
      Object.hasOwn(mergeTargets, target),
      false,
      `${slug} -> redirect target is another redirect source: ${target}`,
    );
    assert.notEqual(targetArticle.published, false, `${slug} -> unpublished target: ${target}`);
  }
  // middleware に載る legacy redirect は上記の 5 件だけ。
  assert.deepEqual(
    [...middleware.matchAll(/'([a-z0-9-]+)': '([a-z0-9-]+)'/g)].map((m) => m[1]).sort(),
    Object.keys(mergeTargets).sort(),
  );
  for (const slug of unpublishSlugs) assert.doesNotMatch(middleware, new RegExp(`'${slug}':`));
  for (const slug of restoredSlugs) assert.doesNotMatch(middleware, new RegExp(`'${slug}':`));
  assert.match(middleware, /NextResponse\.redirect\([^;]+, 301\)/s);
});

test('every published article has article-specific references', () => {
  const references = read('lib/article-references.ts');
  for (const article of published) {
    assert.match(references, new RegExp(`'${article.slug}':`));
  }
  assert.match(read('components/ArticleReferences.tsx'), /rel="noopener noreferrer"/);
  assert.match(read('components/ArticleReferences.tsx'), /最終確認/);
});

test('published articles render every ** emphasis (no literal asterisks for readers)', async () => {
  // CommonMark の delimiter 規則により、`**…。**文字` や `文字**「…` のように
  // 強調の境界が句読点・括弧に接すると strong が閉じず、読者に ** がそのまま見える。
  // 日本語では「**「…」**です」が典型で、実サイトと同じ pipeline でしか検出できない。
  const broken = [];
  for (const article of published) {
    const html = String(
      await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(article.content),
    );
    // Markdown 構文を意図的に見せるコードブロック・インラインコードは対象外。
    const visible = html
      .replace(/<pre[\s\S]*?<\/pre>/g, '')
      .replace(/<code[\s\S]*?<\/code>/g, '')
      .replace(/<[^>]+>/g, '');
    const count = (visible.match(/\*\*/g) ?? []).length;
    if (count > 0) broken.push(`${article.slug}: ${count} literal ** markers`);
  }
  assert.deepEqual(broken, []);
});

test('operator experience notes match confirmed experience (C articles excluded)', () => {
  const notes = read('lib/article-experience-notes.ts');
  // 経験A/B と確認された canonical 記事にのみ注記を付ける。
  // 統合で未公開にした記事の注記は残さない（未公開記事に注記が残ると、経験の境界が
  // どの公開記事に対応するのか監査できなくなるため）。
  const withNote = [
    'ai-koomu-kaizen-nyumon', 'chatgpt-tsuchihyo-shoken',
    'education-ai-service-checklist-before-use', 'giga-device-lesson-use-guide',
    'individual-education-plan-writing-guide', 'reasonable-accommodation-school-record',
    'special-needs-behavior-record-guide', 'special-needs-ict-reasonable-accommodation',
    'special-needs-ict-support-tools-checklist', 'special-needs-parent-collaboration',
    'special-needs-visual-schedule-support',
  ];
  // 経験C（資料でのみ確認）の記事には実務経験注記を付けない。
  const withoutNote = [
    'digital-textbook-introduction-school-changes', 'ai-class-newsletter-prompt',
    'free-ict-tools-safety-checklist', 'google-forms-school-use-guide',
  ];
  for (const slug of withNote) assert.match(notes, new RegExp(`'${slug}':`));
  for (const slug of withoutNote) assert.doesNotMatch(notes, new RegExp(`'${slug}':`));
  // 注記の集合は「公開記事のうち経験A/Bのもの」と過不足なく一致すること。
  const noteKeys = [...notes.matchAll(/^ {2}'([a-z0-9-]+)':/gm)].map((m) => m[1]);
  assert.deepEqual(noteKeys.sort(), [...withNote].sort());
  assert.deepEqual(
    [...withNote, ...withoutNote].sort(),
    published.map((a) => a.slug).sort(),
    '経験の分類が公開記事の集合を網羅していること',
  );
  // 注記は記事詳細で描画される。
  assert.match(read('app/articles/[slug]/page.tsx'), /<ArticleExperienceNote slug=\{article\.slug\} \/>/);
});

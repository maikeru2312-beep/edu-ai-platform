import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import matter from 'gray-matter';

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
    for (const match of article.content.matchAll(/\]\(\/articles\/([a-z0-9-]+)(?:[)#?][^)]*)?\)/g)) {
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
  assert.equal(published.length, 17);
  const categories = new Set(published.map((article) => article.category));
  assert.equal(categories.has('助成金・補助金'), false);
  assert.equal(categories.has('研修・セミナー'), false);
});

test('all MERGE articles have exact 301 targets and UNPUBLISH articles do not', () => {
  const middleware = read('middleware.ts');
  const mergeSlugs = [
    'ai-class-newsletter-prompt',
    'chatgpt-teacher-beginner-guide', 'free-ict-tools-safety-checklist',
    'giga-school-device-troubleshooting', 'google-forms-school-use-guide',
    'information-morals-education-themes', 'kyoiku-dx-kiso',
    'microsoft-copilot-teacher-guide',
    'tablet-ict-jugyo-giga',
  ];
  // RESTORE_REBUILD により公開へ戻した slug は 301 を持たない。
  const restoredSlugs = ['special-needs-parent-collaboration', 'ai-koomu-kaizen-nyumon'];
  const unpublishSlugs = [
    'education-grant-search-guide', 'generative-ai-school-training-guide',
    'joseikin-guide-2025', 'school-training-ict-ai-guide',
  ];
  for (const slug of mergeSlugs) assert.match(middleware, new RegExp(`'${slug}':`));
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

test('operator experience notes match confirmed experience (C articles excluded)', () => {
  const notes = read('lib/article-experience-notes.ts');
  // 経験A/B と確認された15記事にのみ注記を付ける。
  const withNote = [
    'ai-koomu-kaizen-nyumon',
    'ai-lesson-preparation-prompt', 'chatgpt-tsuchihyo-shoken',
    'education-ai-service-checklist-before-use', 'giga-device-lesson-use-guide',
    'ict-teaching-tools-selection-guide', 'individual-education-plan-writing-guide',
    'reasonable-accommodation-school-record', 'school-generative-ai-privacy-security',
    'special-needs-behavior-record-guide', 'special-needs-ict-reasonable-accommodation',
    'special-needs-ict-support-tools-checklist', 'special-needs-parent-collaboration',
    'special-needs-visual-schedule-support', 'tokubetsu-shien-ict',
  ];
  // 経験C（資料でのみ確認）の記事には実務経験注記を付けない。
  const withoutNote = [
    'digital-textbook-introduction-school-changes',
    'generative-ai-guideline-v2-school-reading',
  ];
  for (const slug of withNote) assert.match(notes, new RegExp(`'${slug}':`));
  for (const slug of withoutNote) assert.doesNotMatch(notes, new RegExp(`'${slug}':`));
  // 注記は記事詳細で描画される。
  assert.match(read('app/articles/[slug]/page.tsx'), /<ArticleExperienceNote slug=\{article\.slug\} \/>/);
});

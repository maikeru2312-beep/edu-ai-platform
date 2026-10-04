import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import matter from 'gray-matter';
import nextConfig from '../next.config.mjs';

const root = process.cwd();
const slugs = [
  'special-needs-behavior-record-guide',
  'special-needs-ict-support-tools-checklist',
  'special-needs-visual-schedule-support',
];
const specialOrigin = 'https://special-support-navi.vercel.app';
const redirects = await nextConfig.redirects();
const articles = fs.readdirSync(path.join(root, 'content/articles'))
  .filter((file) => file.endsWith('.md'))
  .map((file) => ({ slug: file.slice(0, -3), ...matter(fs.readFileSync(path.join(root, 'content/articles', file), 'utf8')) }));

test('exact B1 old URLs redirect permanently and directly to Special', () => {
  for (const slug of slugs) {
    const path = `/articles/${slug}`;
    assert.deepEqual(redirects.filter((item) => item.source === path), [{
      source: path,
      destination: `${specialOrigin}${path}`,
      permanent: true,
    }]);
    assert.equal(articles.find((item) => item.slug === slug)?.data.published, false);
  }
  for (const alias of ['ict-teaching-tools-selection-guide', 'tokubetsu-shien-ict']) {
    assert.deepEqual(redirects.filter((item) => item.source === `/articles/${alias}`).map((item) => item.destination),
      [`${specialOrigin}/articles/special-needs-ict-support-tools-checklist`]);
  }
  assert.equal(redirects.length, 5);
  assert.equal(redirects.some((item) => item.source === '/articles/ai-koomu-kaizen-nyumon'), false);
});

test('the active DX catalog and article links do not rely on B1 redirects', () => {
  const published = articles.filter((item) => item.data.published !== false);
  assert.equal(published.length, 15);
  for (const article of published) {
    for (const slug of slugs) {
      assert.doesNotMatch(article.content, new RegExp(`\\]\\(/articles/${slug}(?:[)#?])`), `${article.slug} links through redirect`);
      if (article.content.includes(`/articles/${slug}`))
        assert.ok(article.content.includes(`${specialOrigin}/articles/${slug}`));
    }
  }
  for (const relative of ['lib/reader-journeys.ts', 'lib/practical-resources.ts', 'lib/article-references.ts', 'lib/article-experience-notes.ts']) {
    const source = fs.readFileSync(path.join(root, relative), 'utf8');
    for (const slug of slugs) assert.equal(source.includes(slug), false, `${relative} retains ${slug}`);
  }
  assert.match(fs.readFileSync(path.join(root, 'lib/articles.ts'), 'utf8'), /\.filter\(isArticlePublished\)/);
  assert.match(fs.readFileSync(path.join(root, 'app/sitemap.ts'), 'utf8'), /getAllArticles\(\)/);
});

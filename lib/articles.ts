import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import type { Article, ArticleMeta } from '@/types';
import { headingId } from '@/lib/heading-id';

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');

/**
 * h2 / h3 に id を付ける。/resources から記事の該当見出しへ直接リンクするために必要。
 * remark-html は見出しに id を付けないため、生成後の HTML へ後付けする。
 */
function withHeadingIds(html: string): string {
  return html.replace(/<(h[23])>([\s\S]*?)<\/\1>/g, (whole, tag: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    const id = headingId(text);
    if (!id) return whole;
    return `<${tag} id="${id.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">${inner}</${tag}>`;
  });
}

export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace('.md', ''));
}

export function isArticlePublished(article: ArticleMeta): boolean {
  return article.published !== false;
}

export function getPublishedArticleSlugs(): string[] {
  return getAllArticleSlugs().filter((slug) => isArticlePublished(getArticleMeta(slug)));
}

export function getAllArticles(): ArticleMeta[] {
  return getAllArticleSlugs()
    .map((slug) => getArticleMeta(slug))
    .filter(isArticlePublished)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getArticleMeta(slug: string): ArticleMeta {
  const fullPath = path.join(ARTICLES_DIR, `${slug}.md`);
  const { data } = matter(fs.readFileSync(fullPath, 'utf-8'));
  return { slug, ...data } as ArticleMeta;
}

export async function getArticle(slug: string): Promise<Article> {
  const fullPath = path.join(ARTICLES_DIR, `${slug}.md`);
  const { data, content } = matter(fs.readFileSync(fullPath, 'utf-8'));
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);
  const article = { slug, ...data, contentHtml: withHeadingIds(processed.toString()) } as Article;
  if (!isArticlePublished(article)) {
    throw new Error(`Article is not published: ${slug}`);
  }
  return article;
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.category === category);
}

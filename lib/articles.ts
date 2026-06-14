import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import type { Article, ArticleMeta } from '@/types';

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles');

export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace('.md', ''));
}

export function getAllArticles(): ArticleMeta[] {
  return getAllArticleSlugs()
    .map((slug) => getArticleMeta(slug))
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
  return { slug, ...data, contentHtml: processed.toString() } as Article;
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.category === category);
}

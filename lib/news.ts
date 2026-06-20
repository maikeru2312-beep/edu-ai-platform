import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import type { NewsDigest, NewsDigestMeta } from '@/types/news';

const NEWS_DIR = path.join(process.cwd(), 'content/news-digests');

export function getAllNewsDigestSlugs(): string[] {
  if (!fs.existsSync(NEWS_DIR)) return [];
  return fs
    .readdirSync(NEWS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace('.md', ''));
}

export function getAllNewsDigests(): NewsDigestMeta[] {
  return getAllNewsDigestSlugs()
    .map((slug) => getNewsDigestMeta(slug))
    .filter((n) => !n.draft)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getNewsDigestMeta(slug: string): NewsDigestMeta {
  const fullPath = path.join(NEWS_DIR, `${slug}.md`);
  const { data } = matter(fs.readFileSync(fullPath, 'utf-8'));
  return { slug, ...data } as NewsDigestMeta;
}

export async function getNewsDigest(slug: string): Promise<NewsDigest> {
  const fullPath = path.join(NEWS_DIR, `${slug}.md`);
  const { data, content } = matter(fs.readFileSync(fullPath, 'utf-8'));
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);
  return { slug, ...data, contentHtml: processed.toString() } as NewsDigest;
}

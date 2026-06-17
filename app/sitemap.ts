import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { CATEGORIES, CATEGORY_TO_SLUG } from '@/lib/categories';
import { getSiteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const articles = getAllArticles();

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${base}/articles/${a.slug}`,
    lastModified: a.updatedAt ?? a.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const activeCategories = CATEGORIES.filter((cat) => articles.some((a) => a.category === cat));
  const categoryEntries: MetadataRoute.Sitemap = activeCategories.map((cat) => ({
    url: `${base}/categories/${CATEGORY_TO_SLUG[cat]}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [
    { url: base, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/articles`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/db`, changeFrequency: 'weekly', priority: 0.8 },
    ...categoryEntries,
    ...articleEntries,
    { url: `${base}/about`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/operator`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/disclaimer`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/contact`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}

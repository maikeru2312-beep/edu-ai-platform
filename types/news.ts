export interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  topic: string;
  summary: string;
  schoolPoint: string;
  chifuyuNote: string;
}

export interface NewsDigestMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  topics: string[];
  draft?: boolean;
  items: NewsItem[];
}

export interface NewsDigest extends NewsDigestMeta {
  contentHtml: string;
}

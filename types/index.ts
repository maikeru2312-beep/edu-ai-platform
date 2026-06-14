export type Category =
  | '特別支援教育'
  | 'ICT活用'
  | 'AI校務改善'
  | '教材・支援ツール'
  | '助成金・補助金'
  | '研修・セミナー';

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  category: Category;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
}

export interface Article extends ArticleMeta {
  contentHtml: string;
}

export type DBItemType =
  | '法令・通知'
  | 'ツール'
  | '助成金'
  | '研修'
  | '教材'
  | '研究・報告書';

export interface DBItem {
  id: string;
  title: string;
  type: DBItemType;
  category: Category;
  description: string;
  tags: string[];
  source?: string;
  updatedAt: string;
}

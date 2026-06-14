import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { CATEGORIES, CATEGORY_TO_SLUG } from '@/lib/categories';
import ArticleCard from '@/components/ArticleCard';

export const metadata: Metadata = {
  title: '記事一覧',
  description: '特別支援教育・ICT活用・AI校務改善など教育DXに関する記事一覧です。',
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">記事一覧</h1>
        <p className="text-gray-500 text-sm">全 {articles.length} 件</p>
      </div>

      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-xs font-medium text-white bg-blue-600 px-3 py-1.5 rounded-full">
          すべて
        </span>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/categories/${CATEGORY_TO_SLUG[cat]}`}
            className="text-xs font-medium text-gray-600 bg-white border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
          >
            {cat}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <p className="text-gray-500 py-16 text-center">記事はまだありません。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

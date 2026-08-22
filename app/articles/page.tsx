import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { CATEGORIES, CATEGORY_TO_SLUG } from '@/lib/categories';
import ArticleCard from '@/components/ArticleCard';

const LIST_DESCRIPTION =
  '特別支援教育を中心とした学校実務で、ICT・生成AI・支援・記録をどう判断するかを扱う記事の一覧です。'
  + '各記事に確認手順と、そのまま使える様式・判断表を掲載しています。';

export const metadata: Metadata = {
  title: '記事一覧',
  description: LIST_DESCRIPTION,
  alternates: { canonical: '/articles' },
  openGraph: { type: 'website', url: '/articles', title: '記事一覧 | 教育DXナビ', description: LIST_DESCRIPTION },
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  const activeCategories = CATEGORIES.filter((cat) =>
    articles.some((article) => article.category === cat),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">記事一覧</h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
          特別支援教育を中心とした学校実務について、確認手順と判断の分かれ目を扱う記事です。
          記事数を増やすことは目的にしていません。1本ずつ、扱う場面と、
          そのまま使える様式・判断表を持たせています。
        </p>
        <p className="text-gray-400 text-xs mt-2">全 {articles.length} 件</p>
      </div>

      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-xs font-medium text-white bg-blue-600 px-3 py-1.5 rounded-full">
          すべて
        </span>
        {activeCategories.map((cat) => (
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

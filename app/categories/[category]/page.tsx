import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticlesByCategory } from '@/lib/articles';
import { CATEGORY_SLUGS, CATEGORY_TO_SLUG, CATEGORIES, CATEGORY_DESCRIPTIONS } from '@/lib/categories';
import ArticleCard from '@/components/ArticleCard';
import CategoryBadge from '@/components/CategoryBadge';

export function generateStaticParams() {
  return Object.keys(CATEGORY_SLUGS).map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = CATEGORY_SLUGS[slug];
  if (!category) return { title: 'カテゴリが見つかりません' };
  const desc = CATEGORY_DESCRIPTIONS[category].meta;
  return {
    title: `${category}の記事一覧`,
    description: desc,
    alternates: { canonical: `/categories/${slug}` },
    openGraph: {
      type: 'website',
      url: `/categories/${slug}`,
      title: `${category}の記事一覧 | 教育DXナビ`,
      description: desc,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = CATEGORY_SLUGS[slug];
  if (!category) notFound();

  const articles = getArticlesByCategory(category);
  const { intro, axes } = CATEGORY_DESCRIPTIONS[category];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-blue-600">
          ホーム
        </Link>
        <span>/</span>
        <Link href="/articles" className="hover:text-blue-600">
          記事一覧
        </Link>
        <span>/</span>
        <span className="text-gray-700">{category}</span>
      </nav>

      <div className="mb-8">
        <div className="mb-3">
          <CategoryBadge category={category} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{category}</h1>
        <p className="text-gray-500 text-sm mb-4">全 {articles.length} 件</p>
        <p className="text-gray-700 leading-relaxed max-w-3xl">{intro}</p>
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4 max-w-3xl">
          <p className="text-sm font-semibold text-gray-800 mb-2">このカテゴリで大切にする判断軸</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {axes.map((axis) => (
              <li key={axis}>{axis}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 他カテゴリへのリンク */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.filter((c) => c !== category).map((c) => (
          <Link
            key={c}
            href={`/categories/${CATEGORY_TO_SLUG[c]}`}
            className="text-xs font-medium text-gray-600 bg-white border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
          >
            {c}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <p className="text-gray-500 py-16 text-center">
          このカテゴリの記事はまだありません。
        </p>
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

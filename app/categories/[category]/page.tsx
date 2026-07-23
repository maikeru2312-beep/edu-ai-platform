import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllArticles, getArticlesByCategory } from '@/lib/articles';
import { CATEGORY_SLUGS, CATEGORY_TO_SLUG, CATEGORIES } from '@/lib/categories';
import ArticleCard from '@/components/ArticleCard';
import CategoryBadge from '@/components/CategoryBadge';

export function generateStaticParams() {
  const articles = getAllArticles();
  return Object.entries(CATEGORY_SLUGS)
    .filter(([, category]) => articles.some((article) => article.category === category))
    .map(([category]) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = CATEGORY_SLUGS[slug];
  if (!category) return { title: 'カテゴリが見つかりません' };
  const articles = getArticlesByCategory(category);
  if (articles.length === 0) {
    return { title: 'カテゴリが見つかりません', robots: { index: false, follow: false } };
  }
  return {
    title: `${category}の記事一覧`,
    description: `${category}に関する教育DXの記事をまとめています。`,
    alternates: { canonical: `/categories/${slug}` },
    openGraph: {
      type: 'website',
      url: `/categories/${slug}`,
      title: `${category}の記事一覧 | 教育DXナビ`,
      description: `${category}に関する教育DXの記事をまとめています。`,
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
  if (articles.length === 0) notFound();
  const activeCategories = CATEGORIES.filter((candidate) =>
    getAllArticles().some((article) => article.category === candidate),
  );

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
        <p className="text-gray-500 text-sm">全 {articles.length} 件</p>
      </div>

      {/* 他カテゴリへのリンク */}
      <div className="flex flex-wrap gap-2 mb-8">
        {activeCategories.filter((c) => c !== category).map((c) => (
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

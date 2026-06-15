import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllArticleSlugs, getArticle } from '@/lib/articles';
import CategoryBadge from '@/components/CategoryBadge';

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticle(slug);
    return {
      title: article.title,
      description: article.description,
      alternates: {
        canonical: `/articles/${slug}`,
      },
      openGraph: {
        type: 'article',
        url: `/articles/${slug}`,
        title: article.title,
        description: article.description,
        ...(article.publishedAt && { publishedTime: article.publishedAt }),
        ...(article.updatedAt && { modifiedTime: article.updatedAt }),
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.description,
      },
    };
  } catch {
    return { title: '記事が見つかりません' };
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let article;
  try {
    article = await getArticle(slug);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-blue-600">
          ホーム
        </Link>
        <span>/</span>
        <Link href="/articles" className="hover:text-blue-600">
          記事一覧
        </Link>
        <span>/</span>
        <span className="text-gray-700 line-clamp-1">{article.title}</span>
      </nav>

      <header className="mb-10">
        <div className="mb-3">
          <CategoryBadge category={article.category} linked />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {article.title}
        </h1>
        <p className="text-gray-600 text-lg mb-4 leading-relaxed">{article.description}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <time>公開: {article.publishedAt}</time>
          {article.updatedAt && <time>更新: {article.updatedAt}</time>}
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {article.tags.map((tag) => (
            <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
      </header>

      <div
        className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-lg prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded"
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />

      <div className="mt-12 pt-6 border-t border-gray-200">
        <Link href="/articles" className="text-blue-600 hover:text-blue-800 font-medium">
          ← 記事一覧に戻る
        </Link>
      </div>
    </div>
  );
}

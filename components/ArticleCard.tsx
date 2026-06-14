import Link from 'next/link';
import type { ArticleMeta } from '@/types';
import CategoryBadge from './CategoryBadge';
import { CATEGORY_BORDER_COLORS } from '@/lib/categories';

export default function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block h-full">
      <article
        className={`h-full bg-white rounded-xl border-t-4 ${CATEGORY_BORDER_COLORS[article.category]} shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex flex-col`}
      >
        <div className="mb-2">
          <CategoryBadge category={article.category} />
        </div>
        <h3 className="text-gray-900 font-semibold text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors flex-grow">
          {article.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{article.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {article.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
        <time className="text-xs text-gray-400 mt-auto block">{article.publishedAt}</time>
      </article>
    </Link>
  );
}

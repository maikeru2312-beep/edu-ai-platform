import type { DBItem } from '@/types';
import CategoryBadge from './CategoryBadge';
import TypeBadge from './TypeBadge';

export default function DBItemCard({ item }: { item: DBItem }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-5 flex flex-col">
      <div className="flex flex-wrap gap-2 mb-3">
        <TypeBadge type={item.type} />
        <CategoryBadge category={item.category} />
      </div>
      <h3 className="text-gray-900 font-semibold text-base leading-snug mb-2">{item.title}</h3>
      <p className="text-gray-500 text-sm mb-3 line-clamp-3 flex-grow">{item.description}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {item.tags.map((tag) => (
          <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            #{tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
        <time className="text-xs text-gray-400">更新: {item.updatedAt}</time>
        {item.source && (
          <a
            href={item.source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            ソースを見る →
          </a>
        )}
      </div>
    </div>
  );
}

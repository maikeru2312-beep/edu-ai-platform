import Link from 'next/link';
import { CATEGORIES, CATEGORY_TO_SLUG } from '@/lib/categories';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <span className="font-bold text-gray-900 text-lg tracking-tight">教育DXナビ</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/articles"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              記事一覧
            </Link>
            <Link
              href="/db"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              教育情報DB
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
            >
              サイトについて
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 pb-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/categories/${CATEGORY_TO_SLUG[cat]}`}
              className="text-xs text-gray-500 hover:text-blue-600 whitespace-nowrap transition-colors pb-1"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

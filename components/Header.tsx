import Link from 'next/link';
import { CATEGORIES, CATEGORY_TO_SLUG } from '@/lib/categories';
import { getAllArticles } from '@/lib/articles';

const PRIMARY_LINKS = [
  { href: '/articles', label: '記事一覧' },
  { href: '/resources', label: '様式・チェックリスト' },
  { href: '/about', label: 'サイトについて' },
];

export default function Header() {
  const articles = getAllArticles();
  const activeCategories = CATEGORIES.filter((cat) => articles.some((a) => a.category === cat));
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* キーボード利用者向けのスキップリンク。フォーカスしたときだけ左上に現れる */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-blue-700 focus:shadow"
      >
        本文へ移動
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2" aria-label="教育DXナビ ホーム">
            <span className="text-xl" aria-hidden="true">📚</span>
            <span className="font-bold text-gray-900 text-lg tracking-tight">教育DXナビ</span>
          </Link>
          {/* md 以上では主要リンクを右上に置く */}
          <nav aria-label="主要ナビゲーション" className="hidden md:flex items-center gap-6">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        {/* 2段目。md 未満では主要リンクもここに出す（以前は md 未満で「記事一覧」「様式・チェックリスト」
            「サイトについて」がヘッダーから完全に消え、Footer まで下りないと辿れなかった）。 */}
        <nav aria-label="サイト内の移動" className="flex items-center gap-4 pb-1 overflow-x-auto">
          {PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="md:hidden text-xs font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap py-2 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <span className="md:hidden h-4 w-px bg-gray-200 shrink-0" aria-hidden="true" />
          {activeCategories.map((cat) => (
            <Link
              key={cat}
              href={`/categories/${CATEGORY_TO_SLUG[cat]}`}
              className="text-xs text-gray-600 hover:text-blue-600 whitespace-nowrap py-2 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

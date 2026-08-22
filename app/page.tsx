import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles, getArticlesByCategory } from '@/lib/articles';
import {
  CATEGORIES,
  CATEGORY_TO_SLUG,
  CATEGORY_BORDER_COLORS,
  CATEGORY_ICONS,
} from '@/lib/categories';
import ArticleCard from '@/components/ArticleCard';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: '/' },
};

export default function HomePage() {
  const allArticles = getAllArticles();
  const latestArticles = allArticles.slice(0, 6);
  const activeCategories = CATEGORIES.filter((cat) =>
    allArticles.some((article) => article.category === cat),
  );
  const specialNeedsArticles = getArticlesByCategory('特別支援教育').slice(0, 3);
  // 全記事の最終確認日が同じとき（サイト全体を見直した直後など）、この一覧は
  // 「最近更新した」という情報を何も伝えないので出さない。
  const updateDates = new Set(allArticles.map((a) => a.updatedAt ?? a.publishedAt));
  const recentlyUpdated =
    updateDates.size < 2
      ? []
      : [...allArticles]
          .sort((a, b) =>
            (b.updatedAt ?? b.publishedAt).localeCompare(a.updatedAt ?? a.publishedAt),
          )
          .slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            特別支援教育と学校実務の判断を、<br className="sm:hidden" />現場で使える形に。
          </h1>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            公的資料と実務上の確認手順をつなぎ、ICT・生成AI・支援・記録について
            <br className="hidden sm:inline" />
            「何を確認し、どこで止まり、次に何をするか」まで整理します。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/articles"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              記事を読む
            </Link>
          </div>
        </div>
      </section>

      {/* カテゴリ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">場面から探す</h2>
        <p className="text-sm text-gray-500 mb-6">
          いずれも「特別支援教育を含む学校実務での判断」を扱う区分です。
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {activeCategories.map((cat) => (
            <Link
              key={cat}
              href={`/categories/${CATEGORY_TO_SLUG[cat]}`}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 ${CATEGORY_BORDER_COLORS[cat]} bg-white hover:shadow-md transition-all text-center gap-2`}
            >
              <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
              <span className="text-xs font-medium text-gray-700 leading-tight">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 千冬先生からのひとこと */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start">
          <div className="shrink-0 w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
            千
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 mb-1">千冬先生からのひとこと</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              ICTや生成AIは、使うこと自体が目的ではありません。授業や校務で安心して使えるように、まずは「何に使うか」「何を入力しないか」を一緒に整理していきましょう。
            </p>
            <p className="mt-2 text-xs text-gray-400">
              ※ 千冬先生は教育DXナビの編集キャラクターです。実在の学校・教員個人を代表するものではありません。
            </p>
          </div>
        </div>
      </section>

      {/* 最新記事 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">最新記事</h2>
          <Link href="/articles" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            すべて見る →
          </Link>
        </div>
        {latestArticles.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">記事はまだありません。</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* 最近更新した記事 */}
      {recentlyUpdated.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-700">最近更新した記事</h2>
              <Link href="/articles" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                記事一覧 →
              </Link>
            </div>
            <ul className="divide-y divide-gray-100">
              {recentlyUpdated.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 py-2 hover:text-blue-600 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600 leading-snug line-clamp-1">
                      {article.title}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">
                      更新: {article.updatedAt ?? article.publishedAt}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 特別支援教育 × ICT */}
      {specialNeedsArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">このサイトの中心：特別支援教育の学校実務</h2>
            <Link
              href="/categories/tokubetsu-shien"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              すべて見る →
            </Link>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            計画を書く、記録を取る、保護者と話す、配慮を決めて残す——
            公的資料と実務上の確認手順をつなぎ、判断が分かれる場面と、校内確認へ回す条件まで整理しています。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {specialNeedsArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { getAllDBItems } from '@/lib/db';
import {
  CATEGORIES,
  CATEGORY_TO_SLUG,
  CATEGORY_BORDER_COLORS,
  CATEGORY_ICONS,
} from '@/lib/categories';
import ArticleCard from '@/components/ArticleCard';
import DBItemCard from '@/components/DBItemCard';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: '/' },
};

export default function HomePage() {
  const latestArticles = getAllArticles().slice(0, 6);
  const latestDBItems = getAllDBItems().slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            教育現場のDXを、<br className="sm:hidden" />一歩前へ。
          </h1>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            特別支援教育・ICT活用・AI校務改善に関する<br />
            最新情報を収集・整理してお届けします。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/articles"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              記事を読む
            </Link>
            <Link
              href="/db"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold border border-blue-400 hover:bg-blue-500 transition-colors"
            >
              教育情報DB
            </Link>
          </div>
        </div>
      </section>

      {/* カテゴリ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">カテゴリから探す</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
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

      {/* 教育情報DB 新着 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">教育情報DB — 新着</h2>
          <Link href="/db" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            すべて見る →
          </Link>
        </div>
        {latestDBItems.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">データはまだありません。</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {latestDBItems.map((item) => (
              <DBItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

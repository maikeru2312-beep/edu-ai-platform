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
import JourneyFinder from '@/components/JourneyFinder';

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
  // 「最近更新した記事」は置かない。本サイトは記事をまとめて再確認するため最終確認日が
  // 数種類しかなく、並べても新しさを伝えない。最新記事と半分以上が重複していた。
  // 最終確認日は各記事のヘッダーで開示しており、Home で順位づけする情報ではない。

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
            <Link
              href="/resources"
              className="border border-white/70 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              様式・チェックリストから探す
            </Link>
          </div>
        </div>
      </section>

      {/* やりたいことから探す（読者ジャーニー）。定義は lib/reader-journeys.ts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">やりたいことから探す</h2>
        <p className="text-sm text-gray-600 mb-6">
          いま手が止まっている場面を選ぶと、最初に読む記事から順に、必要な判断と使う様式まで進めます。
        </p>
        <JourneyFinder />
      </section>

      {/* 分野から探す（カテゴリ。ジャーニーとは別軸なので残す） */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">分野から探す</h2>
        <p className="text-sm text-gray-600 mb-6">
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
              計画も記録も、ICTや生成AIも、書くこと・使うこと自体が目的ではありません。次の一手が決まるように、まずは「何を確認するか」「どこで止まるか」を一緒に整理していきましょう。
            </p>
            <p className="mt-2 text-xs text-gray-600">
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

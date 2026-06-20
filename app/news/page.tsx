import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllNewsDigests } from '@/lib/news';

export const metadata: Metadata = {
  title: 'ニュースまとめ',
  description:
    '教育DX・生成AI・ICT活用・校務改善・特別支援教育に関する動きを、学校現場向けに整理します。元記事本文の転載ではなく、出典リンクと独自コメントでお届けします。',
  alternates: { canonical: '/news' },
  openGraph: {
    type: 'website',
    url: '/news',
    title: 'ニュースまとめ | 教育DXナビ',
    description:
      '教育DX・生成AI・ICT活用・校務改善・特別支援教育に関する動きを、学校現場向けに整理します。',
  },
};

export default function NewsPage() {
  const digests = getAllNewsDigests();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">ニュースまとめ</h1>
      <p className="text-gray-600 mb-2 leading-relaxed">
        教育DX・生成AI・ICT活用・校務改善・特別支援教育に関する動きを、学校現場向けに整理します。
      </p>
      <p className="text-xs text-gray-400 mb-8">
        元記事本文の転載ではありません。詳細は必ず出典元をご確認ください。
      </p>

      {digests.length === 0 ? (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 text-center">
          <p className="text-gray-600 text-sm">ニュースまとめは準備中です。</p>
          <p className="text-gray-400 text-xs mt-2">
            教育DX・生成AIに関する情報を随時まとめていく予定です。
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {digests.map((digest) => (
            <Link
              key={digest.slug}
              href={`/news/${digest.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
            >
              <div className="flex flex-wrap gap-1 mb-2">
                {digest.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors leading-snug mb-2">
                {digest.title}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                {digest.description}
              </p>
              <p className="mt-3 text-xs text-gray-400">{digest.publishedAt}</p>
            </Link>
          ))}
        </div>
      )}

      <nav className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-600">
        <Link href="/articles" className="text-blue-600 hover:underline">
          ← 記事一覧に戻る
        </Link>
      </nav>
    </div>
  );
}

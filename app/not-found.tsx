import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ページが見つかりません',
};

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-7xl font-bold text-blue-600 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-3">ページが見つかりません</h1>
      <p className="text-gray-500 mb-10">
        お探しのページは存在しないか、URLが変更された可能性があります。
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          トップページへ
        </Link>
        <Link
          href="/articles"
          className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          記事一覧へ
        </Link>
      </div>
    </div>
  );
}

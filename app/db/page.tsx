import type { Metadata } from 'next';
import { getAllDBItems } from '@/lib/db';
import DBItemCard from '@/components/DBItemCard';

export const metadata: Metadata = {
  title: '教育情報DB',
  description:
    '特別支援教育・ICT・AI校務改善に関する法令・ツール・助成金・研修情報のデータベースです。',
};

const DB_TYPES = ['法令・通知', 'ツール', '助成金', '研修', '教材', '研究・報告書'] as const;

export default function DBPage() {
  const items = getAllDBItems();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">教育情報DB</h1>
        <p className="text-gray-500 mb-1">
          特別支援教育・ICT・AI校務改善に関する情報を集約したデータベースです。
        </p>
        <p className="text-gray-400 text-sm">全 {items.length} 件</p>
      </div>

      {/* 情報タイプ一覧 */}
      <div className="mb-8 p-4 bg-white rounded-xl border border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          情報タイプ
        </p>
        <div className="flex flex-wrap gap-2">
          {DB_TYPES.map((type) => (
            <span
              key={type}
              className="text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500 py-16 text-center">データはまだありません。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => (
            <DBItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

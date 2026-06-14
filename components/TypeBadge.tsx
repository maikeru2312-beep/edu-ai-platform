import type { DBItemType } from '@/types';

const TYPE_COLORS: Record<DBItemType, string> = {
  '法令・通知': 'bg-red-100 text-red-700 border-red-200',
  'ツール': 'bg-blue-100 text-blue-700 border-blue-200',
  '助成金': 'bg-amber-100 text-amber-700 border-amber-200',
  '研修': 'bg-teal-100 text-teal-700 border-teal-200',
  '教材': 'bg-green-100 text-green-700 border-green-200',
  '研究・報告書': 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function TypeBadge({ type }: { type: DBItemType }) {
  return (
    <span
      className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border ${TYPE_COLORS[type]}`}
    >
      {type}
    </span>
  );
}

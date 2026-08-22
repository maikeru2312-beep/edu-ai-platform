import type { Category } from '@/types';

export const CATEGORIES: Category[] = [
  '特別支援教育',
  'ICT活用',
  'AI校務改善',
  '教材・支援ツール',
  '助成金・補助金',
  '研修・セミナー',
];

/**
 * カテゴリの説明文。
 * カテゴリは独立した情報の箱ではなく、「特別支援教育を含む学校実務での判断」という
 * 一つの専門性の下位区分として見えるようにする。そのため各文は、扱う場面と
 * 「何を決めるためのカテゴリか」を必ず名指しする。
 */
export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  '特別支援教育':
    '個別の教育支援計画・個別の指導計画、行動記録、保護者面談、合理的配慮の相談と記録、見通し支援。'
    + '学校で実際に書く・話す・残す場面ごとに、何を確認し、どこで校内確認へ回すかを整理しています。',
  'ICT活用':
    '1人1台端末を使う授業の準備とトラブル時の判断、デジタル教科書の導入、学校でのフォーム作成。'
    + '支援を必要とする児童生徒を含む学級で、授業を止めずに進めるための確認手順を扱います。',
  'AI校務改善':
    '校務で生成AIを使ってよいかの判断、入力してよい情報の線引き、通知表所見やおたよりでの使い方。'
    + '効果の測定ではなく、使う前に決めておくことと、人が引き受ける確認を扱います。',
  '教材・支援ツール':
    '特別支援教育の支援ツール選定、未承認の外部ICTサービスを授業で使う判断、'
    + 'AIサービスを導入候補に載せてよいかの一次判定。いずれも「どこで止まるか」を含む手順です。',
  // 現在は公開記事が0件のため、カテゴリページは生成されない（notFound）。
  // 将来使う場合も、他4カテゴリと同じ「何を決めるための区分か」の文体にそろえる。
  '助成金・補助金': '教育ICT・特別支援に関わる費用をどう手当てするかを判断するための区分。現在この区分の公開記事はありません。',
  '研修・セミナー': '校内で何をどう共有するかを判断するための区分。現在この区分の公開記事はありません。',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  '特別支援教育': '♿',
  'ICT活用': '💻',
  'AI校務改善': '🤖',
  '教材・支援ツール': '📖',
  '助成金・補助金': '💰',
  '研修・セミナー': '🎓',
};

export const CATEGORY_SLUGS: Record<string, Category> = {
  'tokubetsu-shien': '特別支援教育',
  'ict': 'ICT活用',
  'ai-koomu': 'AI校務改善',
  'kyozai': '教材・支援ツール',
  'joseikin': '助成金・補助金',
  'kenshu': '研修・セミナー',
};

export const CATEGORY_TO_SLUG: Record<Category, string> = {
  '特別支援教育': 'tokubetsu-shien',
  'ICT活用': 'ict',
  'AI校務改善': 'ai-koomu',
  '教材・支援ツール': 'kyozai',
  '助成金・補助金': 'joseikin',
  '研修・セミナー': 'kenshu',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  '特別支援教育': 'bg-purple-100 text-purple-800 border-purple-200',
  'ICT活用': 'bg-blue-100 text-blue-800 border-blue-200',
  'AI校務改善': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  '教材・支援ツール': 'bg-green-100 text-green-800 border-green-200',
  '助成金・補助金': 'bg-amber-100 text-amber-800 border-amber-200',
  '研修・セミナー': 'bg-teal-100 text-teal-800 border-teal-200',
};

export const CATEGORY_BORDER_COLORS: Record<Category, string> = {
  '特別支援教育': 'border-purple-400',
  'ICT活用': 'border-blue-400',
  'AI校務改善': 'border-indigo-400',
  '教材・支援ツール': 'border-green-400',
  '助成金・補助金': 'border-amber-400',
  '研修・セミナー': 'border-teal-400',
};

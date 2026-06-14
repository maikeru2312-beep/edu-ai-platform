import type { Category } from '@/types';

export const CATEGORIES: Category[] = [
  '特別支援教育',
  'ICT活用',
  'AI校務改善',
  '教材・支援ツール',
  '助成金・補助金',
  '研修・セミナー',
];

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

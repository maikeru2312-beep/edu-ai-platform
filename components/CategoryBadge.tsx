import Link from 'next/link';
import type { Category } from '@/types';
import { CATEGORY_COLORS, CATEGORY_TO_SLUG } from '@/lib/categories';

interface Props {
  category: Category;
  linked?: boolean;
}

export default function CategoryBadge({ category, linked = false }: Props) {
  const classes = `inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border ${CATEGORY_COLORS[category]}`;

  if (linked) {
    return (
      <Link href={`/categories/${CATEGORY_TO_SLUG[category]}`} className={classes}>
        {category}
      </Link>
    );
  }

  return <span className={classes}>{category}</span>;
}

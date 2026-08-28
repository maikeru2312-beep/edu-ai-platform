import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { PRACTICAL_RESOURCES } from '@/lib/practical-resources';
import { CATEGORIES } from '@/lib/categories';
import CategoryBadge from '@/components/CategoryBadge';

const PAGE_DESCRIPTION =
  '教育DXナビの記事が持つ、そのまま使える様式・チェックリスト・判定表の一覧です。'
  + '個別の指導計画の確認、行動記録、配慮の記録、面談の保留管理、ICT・生成AIの利用判断など、'
  + '学校実務の場面から必要な様式を探せます。';

export const metadata: Metadata = {
  title: '様式・チェックリスト一覧',
  description: PAGE_DESCRIPTION,
  alternates: { canonical: '/resources' },
  openGraph: {
    type: 'website',
    url: '/resources',
    title: '様式・チェックリスト一覧 | 教育DXナビ',
    description: PAGE_DESCRIPTION,
  },
};

export default function ResourcesPage() {
  const articles = getAllArticles();
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  // 一覧はカテゴリ順（サイトの専門軸である特別支援教育が先頭に来る）でまとめる。
  // 公開記事に対応しないエントリは表示しない（データ側の取り残しを公開面に出さない）。
  const grouped = CATEGORIES.map((category) => ({
    category,
    items: PRACTICAL_RESOURCES.filter((r) => bySlug.get(r.slug)?.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">様式・チェックリスト一覧</h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
          各記事が持つ「そのまま使える様式・チェックリスト・判定表」を、場面から探せるように並べた一覧です。
          様式の実体と使い方・記入例は、それぞれの記事の中にあります。
          いずれも本サイト作成の参考様式であり、公的機関の定める様式ではありません。
          所属校・設置者の様式がある場合はそちらが優先です。
        </p>
      </div>

      <div className="space-y-10">
        {grouped.map(({ category, items }) => (
          <section key={category}>
            <div className="mb-4">
              <CategoryBadge category={category} linked />
            </div>
            <ul className="space-y-4">
              {items.map((resource) => {
                const article = bySlug.get(resource.slug)!;
                return (
                  <li key={resource.slug} className="bg-white border border-gray-200 rounded-xl p-5">
                    <p className="font-semibold text-gray-900 leading-snug mb-1">{resource.asset}</p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{resource.useWhen}</p>
                    <Link
                      href={`/articles/${resource.slug}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      使い方と記入例を見る：{article.title} →
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <p>
          様式は記事本文の文脈（何を確認し、どこで止まり、誰につなぐか）とあわせて使うことを前提にしています。
          一覧にない場面の様式が必要な場合は、
          <Link href="/contact" className="text-blue-600 hover:underline">お問い合わせページ</Link>
          からご要望をお寄せください。
        </p>
      </div>
    </div>
  );
}

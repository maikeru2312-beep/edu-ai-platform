import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { PRACTICAL_RESOURCES, type PracticalResource } from '@/lib/practical-resources';
import { headingId } from '@/lib/heading-id';
import {
  getResourceGroups,
  getStepResource,
  journeyAnchor,
  type JourneyKind,
  type JourneyStep,
} from '@/lib/reader-journeys';
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

type Item = { step: JourneyStep; resource: PracticalResource; title: string };

function ResourceCard({ kicker, resource, title }: { kicker: string; resource: PracticalResource; title: string }) {
  return (
    <li className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-xs font-semibold text-gray-700 mb-1">{kicker}</p>
      <p className="font-semibold text-gray-900 leading-snug mb-1">{resource.asset}</p>
      <p className="text-sm text-gray-600 leading-relaxed mb-3">{resource.useWhen}</p>
      <Link
        href={`/articles/${resource.slug}#${encodeURIComponent(headingId(resource.anchor))}`}
        className="text-sm text-blue-600 underline underline-offset-2 hover:text-blue-800 font-medium"
      >
        使い方と記入例を見る：{title} →
      </Link>
    </li>
  );
}

/** 順番の無いグループで、各様式の前に置く一言。hub は起点／場面、conditional は状況。 */
function choicePrefix(kind: JourneyKind, isEntry: boolean): string {
  if (kind === 'hub') return isEntry ? '起点' : '場面';
  return 'こんなとき';
}

/** 前の様式の結論を次で使う、順番のあるグループ（sequence）だけを番号つきにする。 */
function SequenceGroup({ items }: { items: Item[] }) {
  return (
    <ol className="space-y-4">
      {items.map((item, index) => (
        <ResourceCard
          key={item.step.slug}
          kicker={`${index + 1}. ${item.step.label}`}
          resource={item.resource}
          title={item.title}
        />
      ))}
    </ol>
  );
}

/** 兄弟の選択肢（hub）と状況で選ぶもの（conditional）。番号を振らない。 */
function ChoiceGroup({ kind, items }: { kind: JourneyKind; items: Item[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <ResourceCard
          key={item.step.slug}
          kicker={`${choicePrefix(kind, Boolean(item.step.entry))}：${item.step.when ?? ''}`}
          resource={item.resource}
          title={item.title}
        />
      ))}
    </ul>
  );
}

export default function ResourcesPage() {
  const articles = getAllArticles();
  const bySlug = new Map(articles.map((a) => [a.slug, a]));

  // 並びは読者ジャーニー順（lib/reader-journeys.ts が唯一の真実）。様式は主ジャーニーの下に1回だけ出す。
  // 記事へのリンク先アンカーは従来どおり見出しから作るので、既存の deep link は変わらない。
  const groups = getResourceGroups()
    .map(({ journey, steps }) => ({
      journey,
      items: steps.flatMap((step): Item[] => {
        const resource = getStepResource(step);
        const article = bySlug.get(step.slug);
        return resource && article ? [{ step, resource, title: article.title }] : [];
      }),
    }))
    .filter((group) => group.items.length > 0);

  // ジャーニーに載っていない様式は取り残さず末尾にまとめる（データ側の抜けを公開面で隠さない）。
  const grouped = new Set(groups.flatMap((g) => g.items.map((i) => i.step.slug)));
  const ungrouped = PRACTICAL_RESOURCES.filter(
    (resource) => !grouped.has(resource.slug) && bySlug.has(resource.slug),
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">様式・チェックリスト一覧</h1>
        <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
          各記事が持つ「そのまま使える様式・チェックリスト・判定表」を、やりたいことごとにまとめた一覧です。
          番号がついているのは、前の様式の結論を次の様式で使う、順番のあるものだけです。
          様式の実体と使い方・記入例は、それぞれの記事の中にあります。
          いずれも本サイト作成の参考様式であり、公的機関の定める様式ではありません。
          所属校・設置者の様式がある場合はそちらが優先です。
        </p>
      </div>

      {/* 資産が増えても目的の束へ直接飛べるようにする（JSなしのページ内リンク） */}
      <nav aria-label="やりたいことから探す" className="mb-10">
        <p className="text-sm font-semibold text-gray-900 mb-2">やりたいことから探す</p>
        <ul className="flex flex-wrap gap-2">
          {groups.map(({ journey, items }) => (
            <li key={journey.id}>
              <a
                href={`#${journeyAnchor(journey.id)}`}
                className="inline-block text-xs text-blue-600 underline underline-offset-2 hover:text-blue-800 bg-white border border-gray-200 rounded-full px-3 py-1.5"
              >
                {journey.title}（{items.length}）
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-10">
        {groups.map(({ journey, items }) => (
          <section key={journey.id} aria-labelledby={journeyAnchor(journey.id)}>
            <h2
              id={journeyAnchor(journey.id)}
              className="text-xl font-bold text-gray-900 mb-1 scroll-mt-24"
            >
              {journey.title}
            </h2>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{journey.shortDescription}</p>
            {journey.kind === 'sequence' ? (
              <SequenceGroup items={items} />
            ) : (
              <ChoiceGroup kind={journey.kind} items={items} />
            )}
          </section>
        ))}

        {ungrouped.length > 0 && (
          <section aria-labelledby="resources-other">
            <h2 id="resources-other" className="text-xl font-bold text-gray-900 mb-4 scroll-mt-24">
              そのほかの様式
            </h2>
            <ul className="space-y-4">
              {ungrouped.map((resource) => {
                const article = bySlug.get(resource.slug)!;
                return (
                  <li key={resource.slug} className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="mb-2">
                      <CategoryBadge category={article.category} linked />
                    </div>
                    <p className="font-semibold text-gray-900 leading-snug mb-1">{resource.asset}</p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{resource.useWhen}</p>
                    <Link
                      href={`/articles/${resource.slug}#${encodeURIComponent(headingId(resource.anchor))}`}
                      className="text-sm text-blue-600 underline underline-offset-2 hover:text-blue-800 font-medium"
                    >
                      使い方と記入例を見る：{article.title} →
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
        <p>
          様式は記事本文の文脈（何を確認し、どこで止まり、誰につなぐか）とあわせて使うことを前提にしています。
          一覧にない場面の様式が必要な場合は、
          <Link href="/contact" className="text-blue-600 underline underline-offset-2 hover:text-blue-800">お問い合わせページ</Link>
          からご要望をお寄せください。
        </p>
      </div>
    </div>
  );
}

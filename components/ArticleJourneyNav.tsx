import type { ReactNode } from 'react';
import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { headingId } from '@/lib/heading-id';
import {
  getPrimaryJourneyPosition,
  getStepResource,
  journeyAnchor,
  type JourneyPosition,
  type JourneyStep,
} from '@/lib/reader-journeys';

// 記事末尾の案内。同カテゴリの新着ではなく、その記事が属するジャーニーの中での位置を出す。
// ジャーニーの形（kind）で描き分ける。
//   sequence    前の段・次の段（順番に意味がある）。
//   hub         起点の記事では選択肢を並べ、選択肢の記事では起点とほかの場面を出す。前後という言葉を使わない。
//   conditional 状況（when）ごとにほかの記事を出す。前後・起点という言葉を使わない。
// どの形でも、リンクには記事タイトルと、その記事で決めることを添える（何があるか分からないまま押させない）。
//
// ジャーニーに属さない記事では null を返す。呼び出し側は従来の関連記事に切り替える。

type Titles = Map<string, string>;
type SequencePosition = Extract<JourneyPosition, { kind: 'sequence' }>;
type HubPosition = Extract<JourneyPosition, { kind: 'hub' }>;
type ConditionalPosition = Extract<JourneyPosition, { kind: 'conditional' }>;

const HEADINGS: Record<JourneyPosition['kind'], string> = {
  sequence: '次に確認すること',
  hub: 'この流れで確認すること',
  conditional: '状況に応じて確認すること',
};

function StepCard({ kicker, step, titles }: { kicker: ReactNode; step: JourneyStep; titles: Titles }) {
  const title = titles.get(step.slug);
  if (!title) return null;
  return (
    <li className="border border-gray-200 rounded-lg p-4 bg-white">
      <p className="text-xs font-semibold text-gray-700 mb-1">{kicker}</p>
      <Link
        href={`/articles/${step.slug}`}
        className="text-sm font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800 leading-snug"
      >
        {title}
      </Link>
      <p className="text-xs text-gray-600 leading-relaxed mt-1">{step.decision}</p>
    </li>
  );
}

function SequenceNav({ position, titles }: { position: SequencePosition; titles: Titles }) {
  const { journey, index, total, previous, next } = position;
  return (
    <>
      <p className="text-sm text-gray-600 mb-4">
        「{journey.title}」の {index} / {total} 段目です。前の段の結論が、次の段の前提になります。
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {previous && (
          <StepCard
            step={previous}
            titles={titles}
            kicker={
              <>
                <span aria-hidden="true">←</span> 前の段：{previous.label}
              </>
            }
          />
        )}
        {next && (
          <StepCard
            step={next}
            titles={titles}
            kicker={
              <>
                <span aria-hidden="true">→</span> 次の段：{next.label}
              </>
            }
          />
        )}
      </ul>
    </>
  );
}

function HubNav({ position, titles }: { position: HubPosition; titles: Titles }) {
  const { journey, isEntry, entry, choices } = position;

  if (isEntry) {
    return (
      <>
        <p className="text-sm text-gray-600 mb-4">
          「{journey.title}」の起点です。ここから先は、場面に合わせて記事を選びます（選ぶ順番はありません）。
        </p>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">場面に合わせて選ぶ</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {choices.map((choice) => (
            <StepCard
              key={choice.slug}
              step={choice}
              titles={titles}
              kicker={`${choice.label}（${choice.when ?? ''}）`}
            />
          ))}
        </ul>
      </>
    );
  }

  return (
    <>
      <p className="text-sm text-gray-600 mb-4">
        「{journey.title}」の中で、場面に合わせて選ぶ記事のひとつです（順番はありません）。
        {entry
          ? '起点が当てはまる場面なら、先にそちらを確かめます。'
          : '共通の前提はないので、ほかの場面の記事もそれぞれ単独で読めます。'}
      </p>
      {entry && (
        <ul className="grid grid-cols-1 gap-3 mb-4">
          <StepCard
            step={entry}
            titles={titles}
            kicker={`起点：${entry.label}（${entry.when ?? ''}）`}
          />
        </ul>
      )}
      {choices.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">ほかの場面</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {choices.map((choice) => (
              <StepCard
                key={choice.slug}
                step={choice}
                titles={titles}
                kicker={`${choice.label}（${choice.when ?? ''}）`}
              />
            ))}
          </ul>
        </>
      )}
    </>
  );
}

function ConditionalNav({ position, titles }: { position: ConditionalPosition; titles: Titles }) {
  const { journey, others } = position;
  return (
    <>
      <p className="text-sm text-gray-600 mb-4">
        「{journey.title}」の中で、状況に応じて読む記事のひとつです（決まった順番はありません）。
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {others.map((other) => (
          <StepCard
            key={other.slug}
            step={other}
            titles={titles}
            kicker={`こんなとき：${other.when ?? ''}`}
          />
        ))}
      </ul>
    </>
  );
}

export default function ArticleJourneyNav({ slug }: { slug: string }) {
  const position = getPrimaryJourneyPosition(slug);
  if (!position) return null;

  const titles: Titles = new Map(getAllArticles().map((article) => [article.slug, article.title]));
  const resource = getStepResource(position.step);

  return (
    <aside className="mt-12 pt-8 border-t border-gray-200" aria-labelledby="journey-next">
      <h2 id="journey-next" className="text-lg font-bold text-gray-900 mb-1">
        {HEADINGS[position.kind]}
      </h2>

      {position.kind === 'sequence' && <SequenceNav position={position} titles={titles} />}
      {position.kind === 'hub' && <HubNav position={position} titles={titles} />}
      {position.kind === 'conditional' && <ConditionalNav position={position} titles={titles} />}

      {resource && (
        <p className="mt-4 text-sm text-gray-700 leading-relaxed">
          <span aria-hidden="true">□</span> この記事で使う様式：
          <Link
            href={`#${encodeURIComponent(headingId(resource.anchor))}`}
            className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
          >
            {resource.asset}
          </Link>
        </p>
      )}

      <p className="mt-2 text-sm">
        <Link
          href={`/resources#${journeyAnchor(position.journey.id)}`}
          className="inline-block py-2 text-blue-600 underline underline-offset-2 hover:text-blue-800"
        >
          様式・チェックリスト一覧を見る
        </Link>
      </p>
    </aside>
  );
}

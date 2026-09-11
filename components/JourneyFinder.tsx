import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import {
  READER_JOURNEYS,
  journeyAnchor,
  splitHub,
  type JourneyStep,
  type ReaderJourney,
} from '@/lib/reader-journeys';

// Home の「やりたいことから探す」。ジャーニーの定義は lib/reader-journeys.ts が唯一の真実で、
// ここは描画だけを持つ。ジャーニーの形（kind）ごとに描き分ける。
//   sequence    番号つきの順序と、1段目から読む導線。
//   hub         起点と、場面に合わせて選ぶ選択肢。選択肢に番号や矢印をつけない（実際に順番が無い）。
//   conditional 状況（when）で選ぶ一覧。番号・矢印・起点を出さない。
// スマホで一目で選べるよう、1ジャーニー1カードに抑える。

type Titles = Map<string, string>;

const linkClass =
  'text-sm font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800';

/** 順番の無い選択肢の一覧（hub の選択肢と conditional の各記事）。 */
function ChoiceList({ steps }: { steps: JourneyStep[] }) {
  return (
    <ul className="space-y-1">
      {steps.map((step) => (
        <li key={step.slug} className="text-xs text-gray-600 leading-relaxed">
          <Link href={`/articles/${step.slug}`} className={`inline-block py-1.5 ${linkClass}`}>
            {step.label}
          </Link>
          <span>（{step.when}）</span>
        </li>
      ))}
    </ul>
  );
}

function SequenceCard({ journey, titles }: { journey: ReaderJourney; titles: Titles }) {
  const first = journey.steps[0];
  return (
    <>
      <p className="text-xs font-semibold text-gray-700 mb-1">この順に決めます</p>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-700 mb-4">
        {journey.steps.map((step, index) => (
          <li key={step.slug} className="flex items-center gap-2">
            {index > 0 && (
              <span aria-hidden="true" className="text-gray-500">
                →
              </span>
            )}
            <span className="bg-gray-100 rounded px-2 py-1">{step.label}</span>
          </li>
        ))}
      </ol>
      <Link href={`/articles/${first.slug}`} className={`block leading-snug ${linkClass}`}>
        この順で確認する（1/{journey.steps.length}）：{titles.get(first.slug)}
      </Link>
    </>
  );
}

function HubCard({ journey, titles }: { journey: ReaderJourney; titles: Titles }) {
  const { entry, choices } = splitHub(journey);
  return (
    <>
      <p className="text-xs font-semibold text-gray-700 mb-1">起点（{entry.when}）</p>
      <Link href={`/articles/${entry.slug}`} className={`block leading-snug mb-3 ${linkClass}`}>
        {entry.label}：{titles.get(entry.slug)}
      </Link>
      <p className="text-xs font-semibold text-gray-700 mb-1">場面に合わせて選ぶ（順番はありません）</p>
      <ChoiceList steps={choices} />
    </>
  );
}

function ConditionalCard({ journey }: { journey: ReaderJourney }) {
  return (
    <>
      <p className="text-xs font-semibold text-gray-700 mb-1">
        状況に合わせて選ぶ（決まった順番はありません）
      </p>
      <ChoiceList steps={journey.steps} />
    </>
  );
}

export default function JourneyFinder() {
  const titles: Titles = new Map(getAllArticles().map((article) => [article.slug, article.title]));

  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {READER_JOURNEYS.map((journey) => (
        <li key={journey.id} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 leading-snug mb-1">{journey.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">{journey.shortDescription}</p>
          <div className="flex-1">
            {journey.kind === 'sequence' && <SequenceCard journey={journey} titles={titles} />}
            {journey.kind === 'hub' && <HubCard journey={journey} titles={titles} />}
            {journey.kind === 'conditional' && <ConditionalCard journey={journey} />}
          </div>
          <Link
            href={`/resources#${journeyAnchor(journey.id)}`}
            className="inline-block self-start text-xs text-gray-700 underline underline-offset-2 hover:text-blue-800 py-2 mt-2"
          >
            この流れで使う様式を見る
          </Link>
        </li>
      ))}
    </ul>
  );
}

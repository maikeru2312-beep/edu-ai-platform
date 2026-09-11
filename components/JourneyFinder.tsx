import Link from 'next/link';
import { READER_JOURNEYS, splitHub, type JourneyStep, type ReaderJourney } from '@/lib/reader-journeys';

// Home の「やりたいことから探す」。Home の役割は「自分の入口を選ぶ」ことだけに絞る。
// 各記事の条件・決めること・記事タイトルはここに出さず、記事末尾の案内と /resources に任せる。
// ジャーニーの定義は lib/reader-journeys.ts が唯一の真実で、ここは描画だけを持つ。形ごとに描き分ける。
//   sequence                 説明と順序のプレビュー（短い呼び名）と、1段目から読むボタン。
//   hub（起点あり）          起点へのボタンを主に置き、場面別の記事は控えめなリンクにする（安全の関門と同格に見せない）。
//   hub（起点なし）・conditional  選択肢を短い呼び名のチップで並べる。番号・矢印・起点を出さない。
// 文字は従来より小さくせず、リンクのタップ領域は 32px 以上を保つ。

const primaryButton =
  'inline-flex items-center rounded-lg border-2 border-blue-600 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors';

/** 順番の無い選択肢。subdued は、起点のボタンより控えめに見せる場面別リンク。 */
function ChoiceList({ steps, subdued = false }: { steps: JourneyStep[]; subdued?: boolean }) {
  return (
    <ul className={subdued ? 'flex flex-wrap items-center gap-x-2' : 'flex flex-wrap gap-2'}>
      {steps.map((step, index) => (
        <li key={step.slug} className="flex items-center">
          {subdued && index > 0 && (
            <span aria-hidden="true" className="mr-2 text-gray-500">
              /
            </span>
          )}
          <Link
            href={`/articles/${step.slug}`}
            className={
              subdued
                ? 'inline-block py-1.5 text-sm text-gray-700 underline underline-offset-2 hover:text-blue-800'
                : 'inline-block rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 underline underline-offset-2 hover:bg-blue-50'
            }
          >
            {step.short}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SequenceCard({ journey }: { journey: ReaderJourney }) {
  const first = journey.steps[0];
  return (
    <>
      <p className="text-sm text-gray-600 leading-relaxed mb-3">{journey.shortDescription}</p>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-700 mb-4">
        {journey.steps.map((step, index) => (
          <li key={step.slug} className="flex items-center gap-2">
            {index > 0 && (
              <span aria-hidden="true" className="text-gray-500">
                →
              </span>
            )}
            <span className="bg-gray-100 rounded px-2 py-1">{step.short}</span>
          </li>
        ))}
      </ol>
      <Link href={`/articles/${first.slug}`} className={primaryButton}>
        この順で確認する（{first.short}から）
      </Link>
    </>
  );
}

function HubCard({ journey }: { journey: ReaderJourney }) {
  const { entry, choices } = splitHub(journey);
  if (entry) {
    return (
      <>
        <Link href={`/articles/${entry.slug}`} className={primaryButton}>
          {journey.homePrompt}
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-x-2">
          <span className="text-sm text-gray-600">場面別に読む：</span>
          <ChoiceList steps={choices} subdued />
        </div>
      </>
    );
  }
  return (
    <>
      <p className="text-sm font-semibold text-gray-800 mb-2">{journey.homePrompt}</p>
      <ChoiceList steps={choices} />
    </>
  );
}

function ConditionalCard({ journey }: { journey: ReaderJourney }) {
  return (
    <>
      <p className="text-sm font-semibold text-gray-800 mb-2">{journey.homePrompt}</p>
      <ChoiceList steps={journey.steps} />
    </>
  );
}

export default function JourneyFinder() {
  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {READER_JOURNEYS.map((journey) => (
        <li key={journey.id} className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2">{journey.title}</h3>
          {journey.kind === 'sequence' && <SequenceCard journey={journey} />}
          {journey.kind === 'hub' && <HubCard journey={journey} />}
          {journey.kind === 'conditional' && <ConditionalCard journey={journey} />}
        </li>
      ))}
    </ul>
  );
}

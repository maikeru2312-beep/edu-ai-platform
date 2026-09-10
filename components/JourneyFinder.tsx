import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { READER_JOURNEYS, journeyAnchor } from '@/lib/reader-journeys';

// Home の「やりたいことから探す」。ジャーニーの定義は lib/reader-journeys.ts が唯一の真実で、
// ここは描画だけを持つ（記事末尾・/resources と同じ並びになる）。
// 記事タイトルはフロントマターから引く。スマホで一目で選べるよう、1ジャーニー1カードに抑える。

export default function JourneyFinder() {
  const titleBySlug = new Map(getAllArticles().map((article) => [article.slug, article.title]));

  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {READER_JOURNEYS.map((journey) => {
        const first = journey.steps[0];
        const firstTitle = titleBySlug.get(first.slug);
        if (!firstTitle) return null;
        return (
          <li
            key={journey.id}
            className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col"
          >
            <h3 className="text-lg font-bold text-gray-900 leading-snug mb-1">{journey.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{journey.shortDescription}</p>

            {/* 決める順序。ラベルは記事タイトルの短縮ではなく「その段で決めること」。 */}
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-700 mb-4">
              {journey.steps.map((step, index) => (
                <li key={`${journey.id}-${step.slug}`} className="flex items-center gap-2">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-gray-500">
                      →
                    </span>
                  )}
                  <span className="bg-gray-100 rounded px-2 py-1">{step.label}</span>
                </li>
              ))}
            </ol>

            <div className="mt-auto space-y-2">
              <Link
                href={`/articles/${first.slug}`}
                className="block text-sm font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800 leading-snug"
              >
                この順で確認する（1/{journey.steps.length}）：{firstTitle}
              </Link>
              <Link
                href={`/resources#${journeyAnchor(journey.id)}`}
                className="inline-block text-xs text-gray-700 underline underline-offset-2 hover:text-blue-800 py-2"
              >
                この流れで使う様式を見る
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

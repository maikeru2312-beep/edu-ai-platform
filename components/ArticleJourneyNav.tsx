import Link from 'next/link';
import { getAllArticles } from '@/lib/articles';
import { headingId } from '@/lib/heading-id';
import {
  getPrimaryJourneyPosition,
  getStepResource,
  journeyAnchor,
  type JourneyStep,
} from '@/lib/reader-journeys';

// 記事末尾の「次に確認すること」。同カテゴリの新着ではなく、その記事が属するジャーニーの
// 前後の段と、この記事で使う様式を出す。前後は「前へ／次へ」だけにせず、記事タイトルと
// 「その段で決めること」を必ず添える（何があるか分からないまま押させない）。
//
// ジャーニーに属さない記事では null を返す。呼び出し側は従来の関連記事に切り替える。

function StepLink({
  step,
  direction,
  title,
}: {
  step: JourneyStep;
  direction: 'previous' | 'next';
  title: string;
}) {
  const isPrevious = direction === 'previous';
  return (
    <li className="border border-gray-200 rounded-lg p-4 bg-white">
      <p className="text-xs font-semibold text-gray-700 mb-1">
        <span aria-hidden="true">{isPrevious ? '←' : '→'}</span> {isPrevious ? '前の段' : '次の段'}
        ：{step.label}
      </p>
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

export default function ArticleJourneyNav({ slug }: { slug: string }) {
  const position = getPrimaryJourneyPosition(slug);
  if (!position) return null;

  const { journey, index, total, previous, next } = position;
  const titleBySlug = new Map(getAllArticles().map((article) => [article.slug, article.title]));
  const resource = getStepResource(position.step);

  return (
    <aside className="mt-12 pt-8 border-t border-gray-200" aria-labelledby="journey-next">
      <h2 id="journey-next" className="text-lg font-bold text-gray-900 mb-1">
        次に確認すること
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        「{journey.title}」の {index} / {total} 段目です。{journey.shortDescription}
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {previous && titleBySlug.has(previous.slug) && (
          <StepLink step={previous} direction="previous" title={titleBySlug.get(previous.slug)!} />
        )}
        {next && titleBySlug.has(next.slug) && (
          <StepLink step={next} direction="next" title={titleBySlug.get(next.slug)!} />
        )}
      </ul>

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
          href={`/resources#${journeyAnchor(journey.id)}`}
          className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
        >
          様式・チェックリスト一覧を見る
        </Link>
      </p>
    </aside>
  );
}

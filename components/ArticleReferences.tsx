import { getArticleReferences } from '@/lib/article-references';

export default function ArticleReferences({ slug }: { slug: string }) {
  const references = getArticleReferences(slug);
  if (references.length === 0) return null;

  return (
    <section className="mt-10 border-t border-gray-200 pt-6" aria-labelledby="primary-references">
      <h2 id="primary-references" className="text-lg font-bold text-gray-900 mb-3">
        参考資料
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        記事中の制度・方針・仕様に関する確認に使用した一次資料です。実施前に最新版と所属校・設置者の方針を確認してください。
      </p>
      <ul className="space-y-4 text-sm">
        {references.map((reference) => (
          <li key={reference.url} className="border-l-2 border-blue-200 pl-3">
            <a
              href={reference.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              {reference.title}
            </a>
            <dl className="mt-1 text-xs text-gray-500 grid sm:grid-cols-[7rem_1fr] gap-x-2 gap-y-1">
              <dt>発行主体</dt><dd>{reference.publisher}</dd>
              <dt>公開・改訂</dt><dd>{reference.publishedOrUpdatedAt}</dd>
              <dt>確認対象</dt><dd>{reference.supports}</dd>
              <dt>最終確認</dt><dd>{reference.checkedAt}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}

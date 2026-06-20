import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllNewsDigestSlugs, getNewsDigest } from '@/lib/news';
import ChifuyuProfileCard from '@/components/ChifuyuProfileCard';

export function generateStaticParams() {
  return getAllNewsDigestSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const digest = await getNewsDigest(slug);
    if (digest.draft) return { title: 'ニュースまとめ' };
    return {
      title: digest.title,
      description: digest.description,
      alternates: { canonical: `/news/${slug}` },
      openGraph: {
        type: 'article',
        url: `/news/${slug}`,
        title: digest.title,
        description: digest.description,
        ...(digest.publishedAt && { publishedTime: digest.publishedAt }),
        ...(digest.updatedAt && { modifiedTime: digest.updatedAt }),
      },
    };
  } catch {
    return { title: 'ニュースまとめ' };
  }
}

export default async function NewsDigestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let digest;
  try {
    digest = await getNewsDigest(slug);
  } catch {
    notFound();
  }

  if (digest.draft) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span>/</span>
        <Link href="/news" className="hover:text-blue-600">ニュースまとめ</Link>
        <span>/</span>
        <span className="text-gray-700 line-clamp-1">{digest.title}</span>
      </nav>

      <header className="mb-8">
        <div className="flex flex-wrap gap-1 mb-3">
          {digest.topics.map((topic) => (
            <span
              key={topic}
              className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium"
            >
              {topic}
            </span>
          ))}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          {digest.title}
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-4">{digest.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <time>公開: {digest.publishedAt}</time>
          {digest.updatedAt && <time>更新: {digest.updatedAt}</time>}
        </div>
      </header>

      {/* 免責ボックス */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-900 leading-relaxed">
        本ページは、公開情報をもとに教育現場向けの視点で整理したものです。元記事本文の転載ではありません。
        詳細は必ず出典元をご確認ください。法的・医療的・行政上の個別判断を代行するものではありません。
      </div>

      {/* 本文（Markdownから生成） */}
      {digest.contentHtml && (
        <div
          className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 mb-10"
          dangerouslySetInnerHTML={{ __html: digest.contentHtml }}
        />
      )}

      {/* ニュース項目カード */}
      {digest.items && digest.items.length > 0 && (
        <section className="space-y-6 mb-12">
          {digest.items.map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">
                  {item.topic}
                </span>
                <span className="text-xs text-gray-400">{item.publishedAt}</span>
                <span className="text-xs text-gray-400">出典: {item.source}</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-3">
                {item.title}
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">要点：</span>
                  <span className="text-gray-700 leading-relaxed"> {item.summary}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">学校現場でのポイント：</span>
                  <span className="text-gray-700 leading-relaxed"> {item.schoolPoint}</span>
                </div>
                {item.chifuyuNote && (
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                    <span className="text-xs font-semibold text-blue-700 block mb-1">
                      千冬先生メモ
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed">{item.chifuyuNote}</p>
                  </div>
                )}
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                出典を開く
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          ))}
        </section>
      )}

      {/* ChifuyuProfileCard */}
      <div className="mb-10">
        <ChifuyuProfileCard variant="compact" />
      </div>

      <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 text-sm">
        <Link href="/news" className="text-blue-600 hover:text-blue-800 font-medium">
          ← ニュースまとめ一覧
        </Link>
        <Link href="/articles" className="text-blue-600 hover:text-blue-800 font-medium sm:ml-auto">
          記事一覧を見る →
        </Link>
      </div>
    </div>
  );
}

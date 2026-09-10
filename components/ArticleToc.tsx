// 記事本文の h2 から目次を作る。
// 見出しの id は lib/articles.ts の withHeadingIds()（= lib/heading-id.ts）が付けたものをそのまま使うので、
// /resources の deep anchor と同じ規則で必ず着地する。
// 長い記事（h2 が 4 本以上）でだけ出す。JS を使わず <details> で折りたたむ。

export type TocEntry = { id: string; text: string };

const ENTITY: Record<string, string> = { '&amp;': '&', '&quot;': '"', '&#x27;': "'", '&#39;': "'", '&lt;': '<', '&gt;': '>' };
const decode = (s: string) => s.replace(/&(?:amp|quot|#x27|#39|lt|gt);/g, (m) => ENTITY[m] ?? m);

export function extractToc(contentHtml: string): TocEntry[] {
  const entries: TocEntry[] = [];
  for (const m of contentHtml.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)) {
    const id = decode(m[1]);
    const text = decode(m[2].replace(/<[^>]+>/g, '')).trim();
    if (id && text) entries.push({ id, text });
  }
  return entries;
}

export default function ArticleToc({ entries }: { entries: TocEntry[] }) {
  if (entries.length < 4) return null;
  return (
    <details className="mb-8 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm">
      <summary className="cursor-pointer font-semibold text-gray-800 select-none">
        目次（{entries.length}項目）
      </summary>
      <nav aria-label="目次">
        <ol className="mt-3 space-y-1.5 list-decimal list-inside text-gray-700">
          {entries.map((entry) => (
            <li key={entry.id}>
              <a
                href={`#${encodeURIComponent(entry.id)}`}
                className="underline decoration-gray-300 underline-offset-2 hover:text-blue-700 hover:decoration-blue-400"
              >
                {entry.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}

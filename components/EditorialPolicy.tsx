import Link from 'next/link';

export default function EditorialPolicy() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
      <p className="text-sm font-semibold text-gray-800 mb-2">編集方針・確認プロセス</p>
      <p className="text-sm text-gray-600 leading-relaxed">
        この記事は、文部科学省等の一次情報と教育現場での実務経験をもとに、
        教育DXナビ編集部（千冬先生＠教育DX）が編集しています。
        文章作成の補助としてAIを使う場合も、記事の構成・現場適用の判断・安全性の確認は人間が行っています。
      </p>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
        誤り・リンク切れのご指摘は
        <Link href="/contact" className="text-blue-600 hover:underline">お問い合わせ</Link>
        からお願いします。編集方針の詳細は
        <Link href="/about" className="text-blue-600 hover:underline">このサイトについて</Link>
        をご覧ください。
      </p>
    </div>
  );
}

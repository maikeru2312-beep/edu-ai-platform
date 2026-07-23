import Link from 'next/link';

export default function EditorialPolicy() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
      <p className="text-sm font-semibold text-gray-800 mb-2">編集方針・確認プロセス</p>
      <p className="text-sm text-gray-600 leading-relaxed">
        この記事は教育DXナビ運営者が編集し、制度・仕様・数値を扱う箇所では、
        文部科学省等の公的機関またはサービス提供者の一次資料を優先して確認しています。
        参考資料は、可能な限り主張を直接確認できるページへリンクします。
      </p>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
        AIは構成案や校正の補助に使う場合がありますが、出典確認、公開範囲の判断、
        個人情報を含まないことの確認は運営者が行います。AI出力を未確認のまま公開しません。
        内容に影響する訂正時は記事の最終確認日を更新します。
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

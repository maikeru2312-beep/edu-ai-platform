import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: '教育DXナビへのお問い合わせ・誤情報のご報告はこちらから。',
  alternates: { canonical: '/contact' },
  openGraph: { type: 'website', url: '/contact', title: 'お問い合わせ', description: '教育DXナビへのお問い合わせ・誤情報のご報告はこちらから。' },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">お問い合わせ</h1>
      <p className="text-sm text-gray-400 mb-10">最終更新日：2026年6月15日</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <p>
            記事の誤情報・リンク切れ・掲載内容に関するご指摘、
            または取り上げてほしいテーマのご要望などがあればお気軽にご連絡ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">お問い合わせ方法</h2>
          <p className="mb-4">
            現在、フォームによるお問い合わせを準備中です。
            それまでの間は以下の方法でご連絡いただけます。
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <p className="text-sm font-medium text-blue-900 mb-1">メールでのお問い合わせ</p>
            <p className="text-sm text-blue-700">
              サイト運営者のメールアドレスはプロフィールまたは各記事末尾に記載しています。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">対応について</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>誤情報・事実確認に関するご指摘には優先的に対応します。</li>
            <li>すべてのお問い合わせへの返信をお約束することは難しい場合があります。</li>
            <li>個人運営のため、対応に数日かかる場合があります。</li>
            <li>営業・宣伝・リンク依頼へのご対応はしていません。</li>
          </ul>
        </section>

        <section className="bg-gray-50 rounded-lg p-5 text-sm text-gray-500">
          <p>
            当サイトは個人運営です。勤務先・自治体・学校への問い合わせとは無関係です。
            公的機関等へのお問い合わせは各機関に直接お願いします。
          </p>
        </section>
      </div>
    </div>
  );
}

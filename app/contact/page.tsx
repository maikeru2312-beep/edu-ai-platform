import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: '教育DXナビへのお問い合わせ・誤情報のご報告はこちらから。',
  alternates: { canonical: '/contact' },
  openGraph: { type: 'website', url: '/contact', title: 'お問い合わせ', description: '教育DXナビへのお問い合わせ・誤情報のご報告はこちらから。' },
};

const contactFormUrl = process.env.NEXT_PUBLIC_CONTACT_FORM_URL;

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
          {contactFormUrl ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <p className="text-sm font-medium text-blue-900 mb-3">お問い合わせフォーム</p>
              <a
                href={contactFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                お問い合わせフォームを開く
              </a>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <p className="text-sm text-gray-700">
                現在、お問い合わせはメール（サイト内記事の誤情報報告・ご意見等）にて受け付けています。
                下記の「お問い合わせにあたってのお願い」をご確認のうえ、お気軽にご連絡ください。
              </p>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">お問い合わせにあたってのお願い</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>児童生徒の氏名・学校名・家庭の状況など、個人が特定できる情報はお送りにならないようお願いします。</li>
            <li>法的判断・医療的判断・行政上の手続きに関する個別のご相談へは回答できません。</li>
            <li>お問い合わせへの返信をお約束するものではありません。あらかじめご了承ください。</li>
            <li>具体的な支援や判断が必要な場合は、所属校・自治体の担当窓口・専門機関にご相談ください。</li>
          </ul>
          <p className="mt-4 text-sm text-gray-500">
            お問い合わせいただいた内容は、当サイトの
            <Link href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</Link>
            に従って取り扱います。また、当サイトの情報の利用・免責については
            <Link href="/disclaimer" className="text-blue-600 hover:underline">免責事項</Link>
            をご確認ください。
          </p>
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

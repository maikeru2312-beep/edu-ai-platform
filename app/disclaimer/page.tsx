import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '免責事項',
  description: '教育DXナビの免責事項です。',
  alternates: { canonical: '/disclaimer' },
  openGraph: { type: 'website', url: '/disclaimer', title: '免責事項', description: '教育DXナビの免責事項です。' },
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">免責事項</h1>
      <p className="text-sm text-gray-400 mb-10">最終更新日：2026年6月15日</p>

      <div className="space-y-10 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. 情報の正確性について</h2>
          <p className="mb-3">
            教育DXナビ（以下「当サイト」）は、掲載情報の正確性・完全性・最新性の
            確保に努めていますが、これらを保証するものではありません。
          </p>
          <p>
            特に以下の情報は変更される場合があります。実際にご利用になる際は、
            必ず一次情報（文部科学省・各財団・各機関の公式サイト）をご確認ください。
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm mt-3">
            <li>助成金・補助金の金額・申請期限・対象要件</li>
            <li>法令・通知の内容（改正の可能性あり）</li>
            <li>研修・セミナーの日程・受付状況</li>
            <li>ICTツールの仕様・料金・提供状況</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. 損害への責任</h2>
          <p>
            当サイトの情報を利用したことにより発生したいかなる損害（直接的・間接的を問わず）
            についても、当サイトは一切の責任を負いません。
            情報の利用は利用者ご自身の責任と判断のもとで行ってください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. 専門的助言の代替について</h2>
          <p>
            当サイトの情報は、法律・医療・教育に関する専門的な助言の代替を意図するものではありません。
            個別のケースについては、特別支援教育の専門家・弁護士・医師等の
            専門家へご相談ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. 外部リンクについて</h2>
          <p>
            当サイトに掲載している外部サイトへのリンクは情報提供を目的としています。
            リンク先の内容・サービス・運営については当サイトの管理外であり、
            リンク先で生じた問題について当サイトは一切責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. 著作権について</h2>
          <p className="mb-3">
            当サイトのオリジナルコンテンツ（記事文・デザイン等）の著作権は
            当サイト運営者に帰属します。無断転載・複製はご遠慮ください。
          </p>
          <p>
            なお、当サイトが参照・引用している外部情報（法令・通知・研究報告等）の
            著作権は各原著作者に帰属します。引用に際しては出所を明記しています。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. AIによる生成コンテンツについて</h2>
          <p>
            当サイトの一部コンテンツはAIを補助ツールとして活用して作成されています。
            公開前に編集者が内容を確認していますが、誤りが含まれる可能性があります。
            誤情報を発見された場合は、<a href="/contact" className="text-blue-600 hover:underline">お問い合わせページ</a>よりお知らせください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. 免責事項の変更</h2>
          <p>
            当サイトは、予告なくこの免責事項を変更することがあります。
            変更後は当ページの「最終更新日」を更新します。
          </p>
        </section>
      </div>
    </div>
  );
}

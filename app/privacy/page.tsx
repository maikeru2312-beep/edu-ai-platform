import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: '教育DXナビのプライバシーポリシーです。',
  alternates: { canonical: '/privacy' },
  openGraph: { type: 'website', url: '/privacy', title: 'プライバシーポリシー', description: '教育DXナビのプライバシーポリシーです。' },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">プライバシーポリシー</h1>
      <p className="text-sm text-gray-400 mb-10">最終更新日：2026年6月15日</p>

      <div className="space-y-10 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. 基本方針</h2>
          <p>
            教育DXナビ（以下「当サイト」）は、個人情報の保護を重要事項と認識し、
            適切な取り扱いに努めます。当サイトはログイン機能・会員登録機能を持たず、
            利用者から氏名・メールアドレス等の個人を特定できる情報を直接収集しません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. アクセス解析ツールについて</h2>
          <p className="mb-3">
            当サイトはアクセス状況の把握・改善のため、Google Analytics 4（GA4）を使用しています。
            GA4はCookieを使用し、以下の情報を自動収集します。
            収集した情報は個人を特定するものではなく、統計情報としてのみ利用します。
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>アクセス日時・閲覧ページ</li>
            <li>ブラウザの種類・OSの種類</li>
            <li>参照元URL</li>
            <li>IPアドレス（個人を特定しない統計情報として利用）</li>
          </ul>
          <p className="mt-3 text-sm text-gray-500">
            詳細は
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
              Google のプライバシーポリシー
            </a>
            をご確認ください。計測を停止したい場合は
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">
              Google Analytics オプトアウトアドオン
            </a>
            をご利用ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Cookieについて</h2>
          <p>
            当サイトはGoogle Analytics 4のためCookieを使用しています。
            ブラウザの設定でCookieを無効にしても当サイトの閲覧に支障はありませんが、
            アクセス計測が行われなくなります。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. 外部リンクについて</h2>
          <p>
            当サイトには文部科学省・国立特別支援教育総合研究所・各財団等の
            外部サイトへのリンクが含まれます。リンク先のプライバシーポリシーおよび
            情報の取り扱いについては、当サイトは一切関与・責任を負いません。
            各リンク先のポリシーを個別にご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. 広告・アフィリエイトについて</h2>
          <p className="mb-3">
            当サイトは現在、広告・アフィリエイトリンクを掲載していません。
          </p>
          <p className="mb-3">
            将来的に Google AdSense による広告を掲載する場合、Google およびその提携企業が
            Cookie を使用してパーソナライズ広告を表示することがあります。
            収集されるデータは Google の広告サービスの提供にのみ使用され、当サイトが
            個人を特定できる情報を受け取ることはありません。
          </p>
          <p className="mb-3">
            将来的にアフィリエイトリンクを掲載する場合は、当該リンクに「PR」「広告」等の
            表記を行い、利用者が明確に識別できるよう表示します。
          </p>
          <p className="text-sm text-gray-500">
            広告・アフィリエイトを導入した場合、その時点でこのページを更新します。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. プライバシーポリシーの変更</h2>
          <p>
            当サイトは、法令の改正や運営方針の変更等により、
            予告なくこのプライバシーポリシーを変更することがあります。
            変更後は当ページの「最終更新日」を更新します。
            定期的にご確認いただくことをお勧めします。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. お問い合わせ</h2>
          <p>
            プライバシーに関するご質問がある場合は、
            <a href="/contact" className="text-blue-600 hover:underline">お問い合わせページ</a>
            よりご連絡ください。
          </p>
        </section>
      </div>
    </div>
  );
}

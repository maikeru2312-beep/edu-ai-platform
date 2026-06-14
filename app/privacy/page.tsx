import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: '教育DXナビのプライバシーポリシーです。',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">プライバシーポリシー</h1>
      <p className="text-sm text-gray-400 mb-10">最終更新日：2025年6月15日</p>

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
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. 収集する情報</h2>
          <p className="mb-3">
            当サイトでは現在、利用者の個人情報を収集・保存していません。
            将来的にアクセス解析ツール（Google Analytics等）を導入する場合、
            以下の情報が自動的に収集される可能性があります。
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>アクセス日時・閲覧ページ</li>
            <li>ブラウザの種類・OSの種類</li>
            <li>参照元URL</li>
            <li>IPアドレス（個人を特定しない統計情報として利用）</li>
          </ul>
          <p className="mt-3 text-sm text-gray-500">
            アクセス解析ツール導入時はこのページで告知します。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Cookieについて</h2>
          <p>
            当サイトは現在、Cookie（クッキー）を使用していません。
            将来的にアクセス解析や利便性向上のためCookieを使用する場合は、
            その目的・内容をこのページで告知します。
            なお、ブラウザの設定でCookieを無効にしても当サイトの閲覧に支障はありません。
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
          <p>
            当サイトは現在、広告・アフィリエイトリンクを掲載していません。
            将来的に導入する場合は、該当箇所に明示し、このページでも告知します。
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
            当サイトトップページ記載の連絡先までお問い合わせください。
          </p>
        </section>
      </div>
    </div>
  );
}

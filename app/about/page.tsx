import Link from 'next/link';
import type { Metadata } from 'next';
import ChifuyuProfileCard from '@/components/ChifuyuProfileCard';

export const metadata: Metadata = {
  title: 'このサイトについて',
  description: '教育DXナビの運営方針・目的・運営者情報をご紹介します。',
  alternates: { canonical: '/about' },
  openGraph: { type: 'website', url: '/about', title: 'このサイトについて', description: '教育DXナビの運営方針・目的・運営者情報をご紹介します。' },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">このサイトについて</h1>
      <p className="text-sm text-gray-400 mb-10">最終更新日：2026年6月15日</p>

      <div className="space-y-10 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">サイトの目的</h2>
          <p>
            教育DXナビは、小中高・特別支援学校の教員・情報担当・校務改善に関心のある教職員を対象に、
            ICT活用・校務効率化・生成AI活用・特別支援教育の実践知をわかりやすく整理して届けるサイトです。
          </p>
          <p className="mt-3">
            日々の授業準備や校務の中でICTや生成AIを活用したい先生方が、
            必要な情報に素早くたどり着けることを目指しています。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">扱うテーマ</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>ICT活用</strong>：授業・学習支援でのタブレット・デジタル教材活用</li>
            <li><strong>校務効率化</strong>：業務自動化・クラウドツール・働き方改善</li>
            <li><strong>生成AI活用</strong>：ChatGPT等の教育現場での活用事例・注意点</li>
            <li><strong>特別支援教育</strong>：ICTを活用した合理的配慮・支援事例</li>
            <li><strong>助成金・補助金</strong>：教育ICT関連の公募・補助制度</li>
            <li><strong>研修・セミナー</strong>：教員向けのスキルアップ機会</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">運営方針</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>個人運営のサイトです。勤務先・自治体・学校を代表するものではありません。</li>
            <li>児童生徒が特定される情報・個人情報は一切掲載しません。</li>
            <li>引用・参照には出所を明記します。正確性に努めますが、必ず一次情報もご確認ください。</li>
            <li>コンテンツの一部はAIを補助ツールとして作成し、公開前に編集者が確認しています。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">千冬先生＠教育DXについて</h2>
          <ChifuyuProfileCard variant="full" />
          <p className="mt-4 text-sm text-gray-700 leading-relaxed">
            千冬先生＠教育DXは、教育DXナビの案内役です。ICT活用、生成AI、校務改善、特別支援教育について、学校現場で安全に使うための視点をやさしく整理します。
            実在の学校・自治体・教員個人を代表するものではなく、教育DXナビの編集キャラクターとして、サイト内記事やSNSで情報発信を行います。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">収益化・広告について</h2>
          <p className="text-sm leading-relaxed">
            当サイトは現在、広告・アフィリエイト収益を得ていません。
            将来的に Google AdSense による広告掲載やアフィリエイトリンクを導入する可能性があります。
            導入する場合は「PR」「広告」等の表示を行い、記事本文と明確に区別します。
            収益はサイトの運営・コンテンツ制作費に充てます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">運営者</h2>
          <p>
            教育現場でのICT活用に関心を持つ個人が運営しています。
            詳細はお問い合わせページよりご連絡ください。
          </p>
        </section>
      </div>

      <nav className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-600">
        <p className="mb-2 font-medium text-gray-700">関連ページ</p>
        <ul className="space-y-1">
          <li><Link href="/operator" className="text-blue-600 hover:underline">運営者情報</Link></li>
          <li><Link href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</Link></li>
          <li><Link href="/disclaimer" className="text-blue-600 hover:underline">免責事項</Link></li>
          <li><Link href="/contact" className="text-blue-600 hover:underline">お問い合わせ</Link></li>
        </ul>
      </nav>
    </div>
  );
}

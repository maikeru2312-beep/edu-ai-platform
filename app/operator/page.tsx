import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '運営者情報',
  description: '教育DXナビの運営者情報です。',
  alternates: { canonical: '/operator' },
  openGraph: { type: 'website', url: '/operator', title: '運営者情報', description: '教育DXナビの運営者情報です。' },
};

export default function OperatorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">運営者情報</h1>
      <p className="text-sm text-gray-400 mb-10">最終更新日：2026年6月29日</p>

      <div className="space-y-10 text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">運営者について</h2>
          <p className="mb-3">
            教育DXナビは、教育現場での実務経験を持つ個人が運営しています。
            ICT活用・校務改善・特別支援教育の実践に日常的に携わる中で感じた
            「現場で使える情報をまとまった形で届けたい」という思いから、このサイトを立ち上げました。
          </p>
          <p>
            プライバシー保護および勤務先への影響を避けるため、
            個人名・勤務校名・所属自治体名は公開していません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">サイトの目的</h2>
          <p className="mb-3">
            教育DXナビは、小中高・特別支援学校で働く教員・情報担当・管理職・支援員を主な対象として、
            教育DX・ICT活用・AI校務改善・特別支援教育に関する実践的な情報を整理・発信します。
          </p>
          <p>
            政策文書や研究報告だけでは見えにくい「現場での使い方」「導入時の注意点」「実践のヒント」を
            わかりやすく届けることを目指しています。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">扱うテーマ</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <strong>教育DX</strong>：学校のデジタル変革・GIGAスクール構想の活用・クラウド導入事例
            </li>
            <li>
              <strong>ICT活用</strong>：授業・学習支援・学校行事でのタブレット・デジタルツール活用方法
            </li>
            <li>
              <strong>AI校務改善</strong>：生成AIを活用した業務効率化・授業準備・校務のDX化
            </li>
            <li>
              <strong>特別支援教育</strong>：ICTを活用した合理的配慮・支援事例・アクセシビリティの実践
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">編集の方針</h2>
          <p className="mb-3">
            記事は、特別支援教育・ICT活用・校務改善に関わる教育現場での実務経験と、
            公開情報（文部科学省・こども家庭庁・個人情報保護委員会・各サービスの公式情報など）の
            確認をもとに編集しています。公式情報は貼って終わりにせず、「現場ではどう読むか・どう判断するか」まで整理することを心がけています。
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <strong>個人情報の保護</strong>：実在の児童生徒・保護者・学校・自治体・同僚が特定される情報は扱いません。
              事例は匿名化・一般化したうえで紹介します。
            </li>
            <li>
              <strong>AI利用時の人間による確認</strong>：本文作成に生成AIを補助的に用いる場合がありますが、
              構成・表現・教育現場への適用判断は最終的に人間が確認しています。
            </li>
            <li>
              <strong>断定の回避</strong>：法的・医療的・行政的な個別判断は代替せず、最終判断は各学校・教育委員会・専門機関に委ねます。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">免責事項</h2>
          <p className="mb-3">
            当サイトは情報提供を目的としており、個別の法的・医療的・行政的判断を代行するものではありません。
            掲載情報をもとに行動される際は、必ず所属校・教育委員会・専門機関にご確認ください。
          </p>
          <p className="mb-3">
            特に以下の事項については、当サイトの情報のみを根拠とした判断はお控えください。
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm mb-3">
            <li>児童生徒の障害認定・医療的ケアに関する判断</li>
            <li>合理的配慮の提供義務・範囲に関する法的解釈</li>
            <li>補助金・助成金の申請適格性・採択可否</li>
            <li>自治体・学校固有のルールに基づく行政手続き</li>
          </ul>
          <p>
            掲載情報の正確性・完全性・最新性の確保に努めていますが、これらを保証するものではありません。
            誤情報を発見された場合は、<a href="/contact" className="text-blue-600 hover:underline">お問い合わせページ</a>よりお知らせください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">勤務先との関係</h2>
          <p className="mb-3">
            当サイトの内容はすべて運営者個人の見解・経験に基づくものであり、
            勤務先・所属自治体・学校の公式見解を代表するものではありません。
          </p>
          <p>
            当サイトに関するお問い合わせは、勤務先・教育委員会等の公的機関とは一切無関係です。
            各機関へのお問い合わせは、それぞれの機関に直接お願いします。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">お問い合わせ</h2>
          <p className="mb-4">
            サイト内容に関するご意見・誤情報のご指摘・取り上げてほしいテーマのご要望は、
            お問い合わせページよりご連絡ください。
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            お問い合わせページへ
          </a>
        </section>

        <section className="bg-gray-50 rounded-lg p-5 text-sm text-gray-500">
          <p>
            個人情報保護方針については<a href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</a>をご覧ください。
            免責事項の詳細は<a href="/disclaimer" className="text-blue-600 hover:underline">免責事項ページ</a>に掲載しています。
          </p>
        </section>

      </div>
    </div>
  );
}

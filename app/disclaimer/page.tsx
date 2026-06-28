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
      <p className="text-sm text-gray-400 mb-10">最終更新日：2026年6月29日</p>

      <div className="space-y-10 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. 掲載情報について</h2>
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
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. 教育実践について</h2>
          <p>
            当サイトに掲載する教育実践・指導方法・ICT活用事例は、あくまで一般的な情報提供を目的としています。
            学校現場での実践に際しては、必ず所属校・設置者（学校法人・市区町村・都道府県等）・教育委員会の
            方針やルールに従ってください。個別のケースへの適用可否は、学校・教育委員会の判断に委ねられます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. 法的・医療的・行政的判断について</h2>
          <p className="mb-3">
            当サイトは情報提供を目的としており、以下に関する個別の判断を代行するものではありません。
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>児童生徒の障害認定・診断・医療ケアに関する判断</li>
            <li>合理的配慮の提供義務・範囲に関する法的解釈</li>
            <li>補助金・助成金の申請適格性・採択可否</li>
            <li>自治体・学校固有のルールに基づく行政手続き</li>
            <li>労働・雇用・人事に関する法的判断</li>
          </ul>
          <p className="mt-3">
            これらについては、所属校・教育委員会・専門家（弁護士・医師・社会福祉士等）にご相談ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. 生成AI・ICT活用について</h2>
          <p className="mb-3">
            当サイトで紹介する生成AI・ICTツールの活用方法は、利用可能性の紹介を目的としています。
            実際の利用にあたっては以下をご確認ください。
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm mb-3">
            <li>所属校・教育委員会のAI・ICT利用ガイドライン</li>
            <li>各サービスの利用規約・個人情報の取り扱い</li>
            <li>学校支給端末での外部サービス利用の可否</li>
            <li>生成AIへの個人情報（児童生徒氏名・学校名・診断情報等）の入力禁止</li>
          </ul>
          <p className="mb-3">
            当サイトの情報だけをもとに生成AIを業務利用しないでください。
            必ず所属校・教育委員会の方針を確認してから使用してください。
          </p>
          <p>
            また、生成AIの出力（文章・要約・分類結果など）を、確認・修正をせずにそのまま
            <strong>校務文書・通知表所見等の評価文・個人情報を含む処理</strong>に用いることは推奨しません。
            AIの出力はあくまで下書き・たたき台とし、最終的な内容・表現・適用判断は必ず教員・管理職が確認してください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. 個人情報・セキュリティについて</h2>
          <p>
            当サイトが紹介するICT活用事例・個人情報の取り扱いに関する情報は、一般的なガイドラインの紹介です。
            学校・自治体によって個人情報保護の規程・セキュリティポリシーが異なります。
            個人情報の取り扱いに関しては、所属校・教育委員会・設置者の方針を最優先としてください。
            当サイトの事例をそのまま適用せず、個別の状況に合わせた判断をしてください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. 損害への責任</h2>
          <p>
            当サイトの情報を利用したことにより発生したいかなる損害（直接的・間接的を問わず）
            についても、当サイトは一切の責任を負いません。
            情報の利用は利用者ご自身の責任と判断のもとで行ってください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. 専門的助言の代替について</h2>
          <p>
            当サイトの情報は、法律・医療・教育に関する専門的な助言の代替を意図するものではありません。
            個別のケースについては、特別支援教育の専門家・弁護士・医師等の
            専門家へご相談ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. 外部リンクについて</h2>
          <p>
            当サイトに掲載している外部サイトへのリンクは情報提供を目的としています。
            リンク先の内容・サービス・運営については当サイトの管理外であり、
            リンク先で生じた問題について当サイトは一切責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">9. 著作権について</h2>
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
          <h2 className="text-xl font-bold text-gray-900 mb-3">10. AIによる生成コンテンツについて</h2>
          <p>
            当サイトの一部コンテンツはAIを補助ツールとして活用して作成されています。
            公開前に編集者が内容を確認していますが、誤りが含まれる可能性があります。
            誤情報を発見された場合は、<a href="/contact" className="text-blue-600 hover:underline">お問い合わせページ</a>よりお知らせください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">11. 免責事項の変更</h2>
          <p>
            当サイトは、予告なくこの免責事項を変更することがあります。
            変更後は当ページの「最終更新日」を更新します。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">12. お問い合わせ</h2>
          <p>
            免責事項に関するご質問は<a href="/contact" className="text-blue-600 hover:underline">お問い合わせページ</a>よりご連絡ください。
            なお、個別の法的・医療的・行政的相談への回答はできません。専門家にご相談ください。
            また、<a href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</a>および
            <a href="/operator" className="text-blue-600 hover:underline">運営者情報</a>もあわせてご確認ください。
          </p>
        </section>
      </div>
    </div>
  );
}

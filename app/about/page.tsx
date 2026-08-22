import Link from 'next/link';
import type { Metadata } from 'next';
import ChifuyuProfileCard from '@/components/ChifuyuProfileCard';

export const metadata: Metadata = {
  title: 'このサイトについて',
  description: '教育DXナビの目的、運営方針、千冬先生＠教育DXの位置づけ、広告・収益化に関する考え方を紹介します。',
  alternates: { canonical: '/about' },
  openGraph: { type: 'website', url: '/about', title: 'このサイトについて', description: '教育DXナビの運営方針・目的・運営者情報をご紹介します。' },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">このサイトについて</h1>
      <p className="text-sm text-gray-400 mb-10">最終更新日：2026年8月22日</p>

      <div className="space-y-10 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">サイトの目的</h2>
          <p>
            教育DXナビは、特別支援教育を中心とした学校実務において、
            ICT・生成AI・支援・記録を<strong>どう判断し、どう実行するか</strong>を扱うサイトです。
            対象は、特別支援学校・特別支援学級・通級による指導の担当者と、
            通常の学級で支援を必要とする児童生徒を受け持つ教員、および校内の情報担当です。
          </p>
          <p className="mt-3">
            扱うのは「何が新しいか」ではありません。公的資料と実務上の確認手順をつなぎ、
            <strong>何を確認するか・どう判断するか・どこで止まるか・誰につなぐか・
            何を記録するか・どう見直すか</strong>まで、現場で次の一手が決まる形にして掲載します。
            記事には、そのまま使える確認シートや判断表と、完全な架空の記入例を添えています。
          </p>
          <p className="mt-3">
            ニュースの速報や、他サイトの情報をまとめ直した記事は扱いません。
            記事数を増やすことも目的にしていません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">扱うテーマ</h2>
          <p className="text-sm mb-3">
            次の3つを軸にしています。いずれも「特別支援教育を含む学校実務での判断」という
            一つの専門性の下位テーマとして扱っています。
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <strong>特別支援教育の学校実務</strong>：個別の教育支援計画・個別の指導計画、
              行動記録、保護者面談、合理的配慮の相談と記録、見通し支援
            </li>
            <li>
              <strong>ICT・支援技術の導入と判断</strong>：支援ツールの選定と試用・見直し、
              1人1台端末を使う授業の準備とトラブル時の判断、デジタル教科書の導入
            </li>
            <li>
              <strong>学校での生成AI利用と校務判断</strong>：校務で使ってよいかの判断手順、
              入力してよい情報の線引き、通知表所見・おたよりでの使い方、
              AIサービスを導入候補に載せてよいかの一次判定
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">運営方針</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>個人運営のサイトです。勤務先・自治体・学校を代表するものではありません。</li>
            <li>児童生徒が特定される情報・個人情報は一切掲載しません。</li>
            <li>引用・参照には出所を明記します。正確性に努めますが、必ず一次情報もご確認ください。</li>
            <li>文章作成の補助としてAIを使うことがあります。構成・現場適用の判断・安全確認は人間（運営者）が行います（詳細は下記「編集方針・記事公開前の確認プロセス」）。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">編集方針・記事公開前の確認プロセス</h2>
          <p className="text-sm leading-relaxed mb-3">
            記事は、文部科学省・デジタル庁等の公式資料（一次情報）、各ツール・サービスの公式ドキュメント、
            そして教育現場での実務判断をもとに、運営者が編集しています。
          </p>
          <p className="text-sm leading-relaxed mb-3">
            文章作成の補助としてAIを使うことがありますが、記事の構成、教育現場への適用可否の判断、
            安全性の確認は、いずれも人間（運営者）が行っています。AIの出力をそのまま公開することはありません。
          </p>
          <p className="text-sm leading-relaxed mb-2">すべての記事は、公開前に次の確認を行っています。</p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>文部科学省・デジタル庁等の一次情報との突き合わせ（数値・制度・出典の確認）</li>
            <li>児童生徒・教職員など個人が特定される情報が含まれていないことの確認</li>
            <li>教育現場で適用する際の注意点（所属校・教育委員会の方針確認等）の明記</li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed">
            <strong>2026年8月22日に、掲載記事の全体を見直しました。</strong>
            読者の目的が重なっていた記事を統合して21本から15本に整理し、
            残した記事から重複する説明を外して、それぞれが扱う判断を1つに絞っています。
            この見直しで全記事の本文に手を入れたため、現在は15本すべての最終確認日が同じ日付になっています。
            以降は、内容に影響する訂正を行った記事だけ日付を更新します。
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            なお、当サイトの記事は情報提供を目的としており、医療・法律・行政上の判断を代替するものではありません。
            誤情報・リンク切れを見つけた場合は、
            <Link href="/contact" className="text-blue-600 hover:underline">お問い合わせページ</Link>
            からお知らせください。確認のうえ修正します。
          </p>
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
          <p className="text-sm leading-relaxed mb-3">
            当サイトでは、記事ページにおいて Google AdSense による広告を掲載しています。
            広告配信に伴う Cookie の利用や第三者配信事業者の取り扱いについては、
            <Link href="/privacy" className="text-blue-600 hover:underline">プライバシーポリシー</Link>
            をご確認ください。
          </p>
          <p className="text-sm leading-relaxed">
            現時点で、アフィリエイトプログラムによる収益化は行っていません。
            掲載する場合は「PR」「広告」等の表示を行い、記事本文と明確に区別します。
            広告掲載による収益が生じた場合は、サイトの運営・コンテンツ制作費に充てます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">運営者</h2>
          <p className="mb-3">
            匿名の個人運営者が、掲載記事の選定、一次資料の確認、編集、訂正、公開範囲の判断を行っています。
            運営者は、特別支援学校での授業づくり・通知表所見・個別の指導計画・行動記録・合理的配慮の検討・
            ICTや視覚支援・AACの活用に関する業務経験を持ち、公的資料と実務上の確認手順を照合して記事を編集しています。
            実務経験に基づく記述は、個人や勤務先を特定できない範囲で、事実確認した内容だけを掲載します
            （詳しくは<Link href="/operator" className="text-blue-600 hover:underline">運営者情報</Link>）。
          </p>
          <p className="mb-3">
            児童生徒・保護者のプライバシー保護と、勤務先・所属自治体への影響を避けるため、
            実名・勤務校名・自治体名は公開しない方針です。
            匿名での運営とする代わりに、上記の編集方針・確認プロセスを公開し、内容への責任を明確にしています。
          </p>
          <p>
            詳しくは<Link href="/operator" className="text-blue-600 hover:underline">運営者情報</Link>をご覧ください。
            サイト内容へのご意見・誤りのご指摘は
            <Link href="/contact" className="text-blue-600 hover:underline">お問い合わせページ</Link>
            からお願いします。
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

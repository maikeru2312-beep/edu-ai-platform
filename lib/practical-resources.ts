// 記事が持つ「そのまま使える様式・チェックリスト・判定表」の横断一覧。
// ここに載せられるのは、公開記事の本文に実在する資産だけ（空リンク・準備中の予告は置かない）。
// 資産の実体は各記事にあり、この一覧は入口を提供するだけにとどめる。
// エントリの slug が公開記事であること、および anchor が着地先記事に実在する見出しで
// あることは、scripts/adsense-audit.test.mjs が機械検証する（broken anchor 検出）。

export type PracticalResource = {
  // 資産を所有する公開記事の slug
  slug: string;
  // 資産の名前（記事内の呼び名と一致させる）
  asset: string;
  // どの場面で使う様式かの一言（記事タイトルの言い換えではなく、使う場面を書く）
  useWhen: string;
  // 資産が置かれている見出しの文言。記事本文の見出しと完全一致していること。
  // headingId() を通して URL フラグメントにする。文言がずれたらテストが落ちる。
  anchor: string;
};

export const PRACTICAL_RESOURCES: PracticalResource[] = [
  {
    slug: 'individual-education-plan-writing-guide',
    asset: '共有・引継ぎ前の確認チェックリスト（5区分14項目）',
    useWhen: '個別の教育支援計画・個別の指導計画を書き上げて、共有・保管・引継ぎへ回す前の最終確認に',
    anchor: '共有・引継ぎ前の確認チェックリスト（本サイト作成の参考様式）',
  },
  {
    slug: 'individual-plan-three-viewpoint-evaluation',
    asset: '三観点の根拠確認表（国／設置者／学校／学部学年の4層）',
    useWhen: '個別の指導計画の評価欄を三観点に分けるべきか迷ったとき、要求がどの層から来ているかを特定する',
    anchor: '三観点の要求がどの層から来ているかを確かめる',
  },
  {
    slug: 'special-needs-behavior-record-guide',
    asset: 'ABC行動記録シート（6列の空欄表＋完全な架空の記入例）',
    useWhen: '行動の記録を明日から取り始めるとき、粒度を決めて1枚目を書くために',
    anchor: 'そのまま使えるABC行動記録シート（本サイト作成の参考様式）',
  },
  {
    slug: 'reasonable-accommodation-school-record',
    asset: '配慮記録の書き換え表（6欄の空欄様式＋3類型の書き換え対応表）',
    useWhen: '合意した合理的配慮を、次の担当者が読んで使える記録の文面に直すときに',
    anchor: '配慮記録の書き換え表（本サイト作成の参考様式）',
  },
  {
    slug: 'special-needs-parent-collaboration',
    asset: '面談1回分の記録シート（11項目＋保留事項の8列追跡表）',
    useWhen: '保護者面談の準備と、その場で答えられなかった保留を回答まで閉じる管理に',
    anchor: '面談1回分の記録シート（本サイト作成の参考様式）',
  },
  {
    slug: 'special-needs-visual-schedule-support',
    asset: '視覚支援の見直し記録シート（9欄・1ツール1枚）',
    useWhen: 'スケジュールや手順表を作ったあと、変更の履歴を残して次に見直す日を決めるために',
    anchor: '視覚支援の見直し記録シート（本サイト作成の参考様式）',
  },
  {
    slug: 'special-needs-ict-reasonable-accommodation',
    asset: '評価場面で使ってよいかの仕分け表（三つの問い＋4列の判定表）',
    useWhen: '読み上げ・音声入力などを、テスト等の評価場面でも使ってよいかを校内で確認する前に',
    anchor: '評価場面で使ってよいかの仕分け表',
  },
  {
    slug: 'special-needs-ict-support-tools-checklist',
    asset: '試用の条件と決める前の確認シート（16行）＋試用後の判定表',
    useWhen: '支援ツールを試すとき、観察する事実と「続ける・調整する・変える・やめる」の判定を決めておくために',
    anchor: '試用の条件と、決める前の確認を一枚にする',
  },
  {
    slug: 'giga-device-lesson-use-guide',
    asset: '授業前チェック表（10項目）＋切り上げ基準＋状況別トラブル対応表',
    useWhen: '端末を使う授業の前日確認と、当日トラブルで授業を止めないための見切りに',
    anchor: '授業前チェック表',
  },
  {
    slug: 'digital-textbook-introduction-school-changes',
    asset: '初めての単元でデジタル教科書を使う記録シート（4段階の記録＋紙との選択理由）',
    useWhen: '学習者用デジタル教科書を初めて使う単元の、導入前確認から授業後の継続判定までに',
    anchor: '記入様式：初めての単元でデジタル教科書を使う記録シート',
  },
  {
    slug: 'google-forms-school-use-guide',
    asset: 'Googleフォーム配布前設計シート（17項目）',
    useWhen: '保護者・児童生徒にフォームを配る前に、ログイン要求・記名・権限・削除場所を確定させるために',
    anchor: 'Googleフォーム配布前設計シート（本サイト作成の参考様式）',
  },
  {
    slug: 'free-ict-tools-safety-checklist',
    asset: '外部ICTサービス利用前確認シート（Gate 1〜5＋HOLDの期限・代替手段の記入欄）',
    useWhen: '正式導入されていない無料サービスを授業で使ってよいか、どこで止めるかを判断するときに',
    anchor: '止まった位置を書き留める：外部ICTサービス利用前確認シート',
  },
  {
    slug: 'education-ai-service-checklist-before-use',
    asset: 'AIサービス一次判定シート（21行の記入様式・3値判定）',
    useWhen: 'AIサービスを学校の導入候補に載せてよいかを、持ち込む前にその場で一次判定するために',
    anchor: 'AIサービス一次判定シート（本サイト作成の参考様式）',
  },
  {
    slug: 'ai-koomu-kaizen-nyumon',
    asset: '校務で生成AIを使う前の判断シート（校務ゲート1〜4・止まった位置の記録欄つき）',
    useWhen: '自分の担当校務で生成AIを使ってよいかを、入力を始める前に判断して記録するために',
    anchor: '校務で生成AIを使う前の判断シート（本サイト作成の参考様式）',
  },
  {
    slug: 'chatgpt-tsuchihyo-shoken',
    asset: '所見AI利用メモ（誰に使うかの判定表＋入力前・提出前チェック）',
    useWhen: '通知表所見で生成AIを使う子・使わない子を名簿単位で先に決めるために',
    anchor: '所見AI利用メモ（本サイト作成の参考様式）',
  },
  {
    slug: 'ai-class-newsletter-prompt',
    asset: 'AI下書き前シート＋原資料照合表＋配布前チェックリスト',
    useWhen: '学級通信・学年だよりの下書きに生成AIを使い、配布前に原資料と突き合わせるために',
    anchor: 'AI下書き前シート',
  },
];

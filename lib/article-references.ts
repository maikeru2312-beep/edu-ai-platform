export type ArticleReference = {
  title: string;
  publisher: string;
  publishedOrUpdatedAt: string;
  url: string;
  checkedAt: string;
  supports: string;
};

const checkedAt = '2026-07-21';

// 内閣府「障害を理由とする差別の解消の推進に関する基本方針」を確認した日（第6回クロージャ）
const basicPolicyCheckedAt = '2026-08-22';

// 保護者面談記事のために e-Gov 法令検索で条文本文を確認した日
const parentCollaborationCheckedAt = '2026-08-10';

// 校務AI判断ハブのために新規登録した資料（PPC 2025学校向け注意喚起・個情法第2条）を確認した日。
// 既存の generativeAiGuideline / ppcAiNotice は共有の checkedAt を用いる
const koomuHubCheckedAt = '2026-08-10';

// 情報モラル授業設計記事のために文部科学省の情報モラル教育ページを確認した日
const informationMoralsCheckedAt = '2026-08-10';

// 外部ICTサービス利用判断の記事のために、文科省ガイドラインとPPCのQ&Aを確認した日
const externalServiceCheckedAt = '2026-08-10';

// Googleフォーム記事の「現在の設定仕様」章のために Google 公式ヘルプを確認した日。
// この章だけが Google の現在仕様に依存するため、確認日を独立して持つ
const googleFormsSpecCheckedAt = '2026-08-10';

// 三観点評価記事のために、改善等通知・学習評価参考資料・施行規則の指導要録規定を確認した日
const threeViewpointCheckedAt = '2026-08-29';

const sources = {
  generativeAiGuideline: {
    title: '初等中等教育段階における生成AIの利活用に関するガイドライン（Ver.2.0）',
    publisher: '文部科学省',
    publishedOrUpdatedAt: '2024-12-26',
    url: 'https://www.mext.go.jp/content/000332373.pdf',
    checkedAt,
    supports: '学校での生成AI利用、校務利用、個人情報・著作権・ファクトチェックの留意点',
  },
  ppcAiNotice: {
    title: '生成AIサービスの利用に関する注意喚起等',
    publisher: '個人情報保護委員会',
    publishedOrUpdatedAt: '2023-06-02',
    url: 'https://www.ppc.go.jp/news/careful_information/230602_AI_utilize_alert/',
    checkedAt,
    supports: '生成AIへ個人情報を入力する際の確認事項と利用規約・処理方法の確認',
  },
  aiCopyright: {
    title: 'AIと著作権に関する考え方について',
    publisher: '文化庁 文化審議会著作権分科会法制度小委員会',
    publishedOrUpdatedAt: '2024-03-15',
    url: 'https://www.bunka.go.jp/seisaku/bunkashingikai/chosakuken/pdf/94037901_01.pdf',
    checkedAt,
    supports: '生成・利用段階における既存著作物との類似性・依拠性等の確認',
  },
  digitalTextbook: {
    title: '学習者用デジタル教科書について',
    publisher: '文部科学省',
    publishedOrUpdatedAt: '2025-09（審議まとめ掲載）',
    url: 'https://www.mext.go.jp/a_menu/shotou/kyoukasho/seido/1407731.htm',
    checkedAt,
    supports: '制度上の位置付け、紙との併用、2024年度からの段階的導入',
  },
  digitalTextbookNotice: {
    title: '学校教育法第三十四条第二項に規定する教材の使用について定める件の一部改正に関する通知',
    publisher: '文部科学省',
    publishedOrUpdatedAt: '2021-03-25',
    url: 'https://www.mext.go.jp/a_menu/shotou/kyoukasho/seido/1412813_00001.htm',
    checkedAt,
    supports: 'デジタル教科書使用時の健康・学習環境への留意',
  },
  studx: {
    title: '「StuDX Style」について',
    publisher: '文部科学省',
    publishedOrUpdatedAt: '2020-12',
    url: 'https://www.mext.go.jp/studxstyle/about/index.html',
    checkedAt,
    supports: '1人1台端末の日常的活用と学習活動の設計',
  },
  safeDevices: {
    title: '1人1台端末の安全・安心な利活用について',
    publisher: '文部科学省',
    publishedOrUpdatedAt: '2021-03',
    url: 'https://www.mext.go.jp/a_menu/shotou/zyouhou/detail/mext_01172.html',
    checkedAt,
    supports: '学校・家庭での安全な端末利用とOS別公式資料',
  },
  individualPlan: {
    title: '個別の教育支援計画の参考様式について',
    publisher: '文部科学省',
    publishedOrUpdatedAt: '2021-10-29',
    url: 'https://www.mext.go.jp/a_menu/shotou/tokubetu/material/1340250_00005.htm',
    checkedAt,
    supports: '個別の教育支援計画・個別の指導計画の役割と作成・活用プロセス',
  },
  disabilityBasicPolicy: {
    title: '障害を理由とする差別の解消の推進に関する基本方針',
    publisher: '内閣府（閣議決定）',
    publishedOrUpdatedAt: '2023-03-14（令和5年3月14日閣議決定）',
    url: 'https://www8.cao.go.jp/shougai/suishin/sabekai.html',
    checkedAt: basicPolicyCheckedAt,
    supports:
      '合理的配慮の「過重な負担」の判断要素、および意思の表明に関する考え方（本人を補佐して行う表明を含む点、表明が無い場合の建設的対話）。障害者差別解消法第6条に基づき政府が定める方針で、各府省の対応指針・地方公共団体等の対応要領はこれを踏まえて定められる',
  },
  accommodationGuideline: {
    title: '文部科学省所管事業分野における障害を理由とする差別の解消の推進に関する対応指針',
    publisher: '文部科学省',
    publishedOrUpdatedAt: '2023-12-28',
    url: 'https://www.mext.go.jp/a_menu/shotou/tokubetu/material/mext_02599.html',
    checkedAt,
    supports:
      '合理的配慮の申出と建設的対話（意思の表明が困難な場合に家族・支援者等が本人を補佐して行う表明を含む点を含む）。法第11条に基づく事業者向け指針であり、公立学校の教職員には地方公共団体等職員対応要領が別途あることに留意',
  },
  tsukyuGuide: {
    title: '初めて通級による指導を担当する教師のためのガイド',
    publisher: '文部科学省',
    publishedOrUpdatedAt: '2020-03',
    url: 'https://www.mext.go.jp/tsukyu-guide/index.html',
    checkedAt,
    supports: '実態把握、個別の計画、合理的配慮、校内外の連携',
  },
  specialNeedsIct: {
    title: 'StuDX Style 各教科等での活用「特別支援」',
    publisher: '文部科学省',
    publishedOrUpdatedAt: '2025-07-28',
    url: 'https://www.mext.go.jp/a_menu/shotou/tokubetu/mext_00025.html',
    checkedAt,
    supports: '障害特性に応じたICT機能の活用例と留意点',
  },
  behaviorResearch: {
    title: '行動問題のある自閉症支援における研修効果に関する研究',
    publisher: '国立特別支援教育総合研究所',
    publishedOrUpdatedAt: '2024-03',
    url: 'https://nise.repo.nii.ac.jp/records/2000006',
    checkedAt,
    supports: '行動観察、機能的アセスメント、ABC行動記録を用いた支援検討',
  },
  schoolEducationRule134: {
    title: '学校教育法施行規則 第百三十四条の二・第百三十九条の二・第百四十一条の二（個別の教育支援計画）',
    publisher: 'e-Gov 法令検索（デジタル庁）',
    publishedOrUpdatedAt: '2018-08-27（第134条の2・第139条の2・第141条の2 追加。公布の日から施行）',
    url: 'https://laws.e-gov.go.jp/law/322M40000080011',
    checkedAt: parentCollaborationCheckedAt,
    supports:
      '特別支援学校（第134条の2）に加え、準用により特別支援学級（第139条の2）・通級による指導（第141条の2）にも及ぶ個別の教育支援計画の作成義務、および作成にあたり「当該児童等又はその保護者の意向を踏まえつつ、あらかじめ、関係機関等と…必要な情報の共有を図らなければならない」とする規定',
  },
  disabilityDiscriminationAct: {
    title: '障害を理由とする差別の解消の推進に関する法律 第七条第二項・第八条第二項',
    publisher: 'e-Gov 法令検索（デジタル庁）',
    publishedOrUpdatedAt: '2024-04-01（事業者の合理的配慮を義務化する改正の施行日。公布は2013-06-26）',
    url: 'https://laws.e-gov.go.jp/law/425AC0000000065',
    checkedAt: parentCollaborationCheckedAt,
    supports:
      '合理的配慮は「意思の表明があった場合」に「負担が過重でないとき」に提供義務が生じるという構造。面談の場で即答せず校内確認へ持ち帰る判断手順の根拠',
  },
  childAbusePreventionAct: {
    title: '児童虐待の防止等に関する法律 第六条（児童虐待に係る通告）',
    publisher: 'e-Gov 法令検索（デジタル庁）',
    publishedOrUpdatedAt: '2000-05-24（公布）',
    url: 'https://laws.e-gov.go.jp/law/412AC1000000082',
    checkedAt: parentCollaborationCheckedAt,
    supports:
      '「児童虐待を受けたと思われる児童を発見した者」の通告義務が保護者の同意を要件としないこと、および第3項により守秘義務が通告義務の遵守を妨げないこと',
  },
  personalInfoActDefinitions: {
    title: '個人情報の保護に関する法律 第二条（定義）',
    publisher: 'e-Gov 法令検索（デジタル庁）',
    publishedOrUpdatedAt: '2003-05-30（公布）',
    url: 'https://laws.e-gov.go.jp/law/415AC0000000057',
    checkedAt: koomuHubCheckedAt,
    supports:
      '第2条第1項第1号「他の情報と容易に照合することができ…特定の個人を識別することができることとなるものを含む」（＝氏名を外しても個人情報でありうる）、第2条第3項の要配慮個人情報、第2条第5項の仮名加工情報および第6項の匿名加工情報の定義',
  },
  personalInfoActOrderSensitive: {
    title: '個人情報の保護に関する法律施行令 第二条（要配慮個人情報）',
    publisher: 'e-Gov 法令検索（デジタル庁）',
    publishedOrUpdatedAt: '2003-12-10（公布。平成十五年政令第五百七号）',
    url: 'https://laws.e-gov.go.jp/law/415CO0000000507',
    checkedAt: koomuHubCheckedAt,
    supports:
      '法第2条第3項の委任を受けた要配慮個人情報の記述等として、第1号に身体障害・知的障害・精神障害（発達障害を含む）等の心身の機能の障害があること、第2号に医師等により行われた健康診断その他の検査の結果、第3号に健康診断等の結果に基づき又は疾病・負傷等を理由として医師等により指導・診療・調剤が行われたことが定められていること（本人の病歴・犯罪の経歴は同条柱書きで除かれ、法第2条第3項に直接定められている）',
  },
  mextSecurityPolicy: {
    title: '教育情報セキュリティポリシーに関するガイドライン（令和7年3月）',
    publisher: '文部科学省',
    publishedOrUpdatedAt: '2025-03（令和7年3月改訂。平成29年10月策定）',
    url: 'https://www.mext.go.jp/content/20250325-mxt_jogai01-100003157_1.pdf',
    checkedAt: externalServiceCheckedAt,
    supports:
      '第2編9.4「約款による外部サービスの利用」において、約款による外部サービスを「インターネット上に約款を掲示し、同意した利用者に対して情報処理機能を提供するサービス」と定義し、SaaS型パブリッククラウドサービスの一種であるが第2編9.1・9.2で想定する個別契約締結型サービスとは別種であり、利用者が必要とする情報セキュリティに関する十分な条件設定の余地があるものを除くとしていること。同項の解説が「有償、無償に関わらず」条件設定の余地があるものを除き、約款への同意及び簡易なアカウントの登録により利用可能なサービスを想定するとしており、区分の基準が料金ではないこと。同解説がリスクの一つとして、利用者データの利用権限がサービス提供者側に帰属することを前提にサービス提供する場合があることを挙げていること。注3が、所属組織の承認を得ないクラウドサービス利用（シャドーIT）の対策として利用時に必ず申請し組織が承認する運用を挙げ、第2編5.2(11)②の無許可クラウドサービス・個人アカウントの利用禁止、同(14)の無許可ソフトウェアの利用禁止、5.1(5)の新規ソフトウェア及びコンテンツの導入・利用判断を参照するとしていること。教育情報システム管理者が利用してよい範囲・利用する外部サービス・利用手続及び運用手順を規定すること。約款に、登録した情報が同意なく無断使用されないことと事業者の守秘義務が規定されているかを教育情報システム管理者が確認すること。教職員等はリスクが許容できることを確認したうえで利用を申請し、適切な措置を講じたうえで利用すること。対策として、サービスの突然の停止に備えた代替サービスの確認、情報の滅失に備えたバックアップの取得、約款の予告なき一方的変更によるセキュリティ設定の変更または記録された情報を確実に消去できない場合に備えて取り扱うことのできる情報をあらかじめ定めることを挙げていること。同項の注として、本項が個人向けWebサービスを想定したものであること、および個人アカウントにより無断で約款による外部サービスを取り扱うことはセキュリティポリシー違反であり学校の情報セキュリティ管理をすり抜ける行為であることが示されていること。注2があわせて、一概に利用を禁止するものではなく教職員の私的利用を禁止し情報セキュリティ管理者が教職員等の利用を把握できる状態にすることが重要であるとしていること。なお本ガイドラインは教育委員会等がポリシーを策定・見直しする際の参考として示されたものであり、第2編は対策基準の例文と解説であること。第1編において、公立学校には個人情報保護法第5章（公的部門の規律）が適用され、私立学校には同法第4章（民間部門の規律）が適用されると整理していること',
  },
  ppcCloudFaq: {
    title: '「個人情報の保護に関する法律についてのガイドライン」に関するQ&A（Q7-53・Q7-54）',
    publisher: '個人情報保護委員会',
    publishedOrUpdatedAt: '2026-08-10（本サイト確認時点の掲載内容）',
    url: 'https://www.ppc.go.jp/all_faq_index/faq1-q7-53/',
    checkedAt: externalServiceCheckedAt,
    supports:
      'クラウドサービスの利用が第三者提供または委託に該当するかの判断が、保存されている電子データに個人データが含まれるか否かではなく、当該事業者が個人データを取り扱うこととなっているか否かによること。契約条項により事業者が個人データを取り扱わない旨が定められ適切にアクセス制御が行われている場合、本人の同意も委託先の監督義務も要しないこと。その場合でも利用者側の安全管理措置の義務は残ること（Q7-54）。なお同Q&Aは民間部門向けガイドラインに関するものであり、行政機関等である公立学校には法第5章の規律が適用されるため、本記事では考え方を参照する範囲にとどめていること',
  },
  googleFormsPublish: {
    title: 'Publish & share your form with responders',
    publisher: 'Google（Google Docs Editors ヘルプ）',
    publishedOrUpdatedAt: '2026-08-10（本サイト確認時点の掲載内容）',
    url: 'https://support.google.com/docs/answer/2839588',
    checkedAt: googleFormsSpecCheckedAt,
    supports:
      '公開（Publish）が独立した操作であり、未公開のフォームはリンクを知っていてもアクセスできないこと。「一般的なアクセス（General access）」で「リンクを知っているすべてのユーザー」または対象グループにアクセス権を付与できること。個人やグループを名前で指定して回答者に追加でき、アクセスに有効期限を設定できること。「1回に制限する」を有効にすると、フォームへのアクセスと入力にGoogleアカウントへのログインが必要になり、かつメールアドレスを収集する設定をオンにしない限り回答者のユーザー名は記録されないこと。回答者にフォームの結果へのリンクが表示され、回答の概要（各質問への回答の全文やグラフ）はフォームに回答できるすべてのユーザーが閲覧できること',
  },
  googleFormsResponses: {
    title: 'View & manage form responses',
    publisher: 'Google（Google Docs Editors ヘルプ）',
    publishedOrUpdatedAt: '2026-08-10（本サイト確認時点の掲載内容）',
    url: 'https://support.google.com/docs/answer/139706',
    checkedAt: googleFormsSpecCheckedAt,
    supports:
      'メールアドレスの収集に「Responder input（回答者が入力）」と「Verified（確認済み）」の2つの方式があり、Verified では回答者が自分のGoogleアカウントのメールアドレスの収集を確認する必要があること。Link to Sheets による回答スプレッドシートの作成。回答受付の停止（Accepting responses）と締切日・回答数上限の設定',
  },
  googleFormsCollaborators: {
    title: 'Share your form with collaborators',
    publisher: 'Google（Google Docs Editors ヘルプ）',
    publishedOrUpdatedAt: '2026-08-10（本サイト確認時点の掲載内容）',
    url: 'https://support.google.com/docs/answer/2917111',
    checkedAt: googleFormsSpecCheckedAt,
    supports:
      '回答用スプレッドシートを新規作成するとフォームの共同編集者が自動的にそのスプレッドシートにもアクセスできること、およびその後のフォーム側の権限変更は同期されず、変更・削除はフォームとリンク先シートの両方で別々に行う必要があること',
  },
  googleFormsErrors: {
    title: 'Fix common errors while you respond to a Google Form',
    publisher: 'Google（Google Docs Editors ヘルプ）',
    publishedOrUpdatedAt: '2026-08-10（本サイト確認時点の掲載内容）',
    url: 'https://support.google.com/docs/answer/15473134',
    checkedAt: googleFormsSpecCheckedAt,
    supports:
      'ファイルアップロードの設問に回答するにはGoogleアカウントへのログインが必要であること',
  },
  googleFormsPermission: {
    title: 'Get permission to open a Google Form',
    publisher: 'Google（Google Docs Editors ヘルプ）',
    publishedOrUpdatedAt: '2026-08-10（本サイト確認時点の掲載内容）',
    url: 'https://support.google.com/docs/answer/160166',
    checkedAt: googleFormsSpecCheckedAt,
    supports:
      '職場・学校アカウントで作成したフォームは、作成者が設定を変更しない限り通常は組織内の人のみアクセスできること。アクセスできない場合に「You need access」が表示されること',
  },
  googleFormsUpgrade: {
    title: 'Learn about updates in Google Forms',
    publisher: 'Google（Google Docs Editors ヘルプ）',
    publishedOrUpdatedAt: '2026-08-10（本サイト確認時点の掲載内容）',
    url: 'https://support.google.com/docs/answer/16319311',
    checkedAt: googleFormsSpecCheckedAt,
    supports:
      '2025年9月8日に旧設定による信頼済みドメイン経由での制限フォームへのアクセスが廃止され、当該回答者がアクセスできなくなったこと。2025年12月以降、古いフォームが新しい版へ自動的にアップグレードされ、所有者に共有設定の見直しが求められること',
  },
  googleFormsQuestionTypes: {
    title: 'Choose a type of question for your form',
    publisher: 'Google（Google Docs Editors ヘルプ）',
    publishedOrUpdatedAt: '2026-08-10（本サイト確認時点の掲載内容）',
    url: 'https://support.google.com/docs/answer/7322334',
    checkedAt: googleFormsSpecCheckedAt,
    supports:
      'ファイルアップロードの設問で提出されたファイルが、フォーム所有者のGoogleドライブ上の新しいフォルダに保存されること',
  },
  googleFormsAdmin: {
    title: 'Turn Forms on or off for users',
    publisher: 'Google（Google Workspace 管理者ヘルプ）',
    publishedOrUpdatedAt: '2026-08-10（本サイト確認時点の掲載内容）',
    url: 'https://knowledge.workspace.google.com/admin/users/access/turn-forms-on-or-off-for-users',
    checkedAt: googleFormsSpecCheckedAt,
    supports:
      '管理者が組織部門またはアクセスグループの単位でGoogleフォームを有効・無効にできること。フォームを有効にするにはGoogleドライブが有効である必要があること',
  },
  informationMoralsMext: {
    title: '情報モラル教育の充実等',
    publisher: '文部科学省',
    publishedOrUpdatedAt: '2026-03-16（日付が明示された掲載資料のうち最新。日付表記のない掲載物あり）',
    url: 'https://www.mext.go.jp/a_menu/shotou/zyouhou/detail/1369617.htm',
    checkedAt: informationMoralsCheckedAt,
    supports:
      '同ページに情報モラル教育関連資料・事例集・教材集および指導者向けセミナー資料が継続的に掲載されていること。授業例を掲載していないテーマの場面例・教材の入手先として本文から参照している',
  },
  ppcSchoolAlert2025: {
    title: '学校における個人情報の漏えい等事案を踏まえた個人情報の取扱いに関する留意点について（注意喚起）',
    publisher: '個人情報保護委員会',
    publishedOrUpdatedAt: '2025-06-25',
    url: 'https://www.ppc.go.jp/news/careful_information/250625_alert_school/',
    checkedAt: koomuHubCheckedAt,
    supports:
      '令和5年4月〜令和7年4月の学校からの漏えい等報告を分析し、学校設置者・教職員向けに留意点・事案例・発生原因・再発防止策を示したもの。学校は個人情報の管理が難しい環境であることを前提に入力情報を絞るべきという本記事の立場を支える。なお、同注意喚起は生成AIの利用を対象としたものではない',
  },
  copyrightActWork: {
    title: '著作権法 第二条第一項第一号（著作物の定義）',
    publisher: 'e-Gov 法令検索（デジタル庁）',
    publishedOrUpdatedAt: '1970-05-06（公布。昭和四十五年法律第四十八号）',
    url: 'https://laws.e-gov.go.jp/law/345AC0000000048',
    checkedAt: externalServiceCheckedAt,
    supports:
      '著作物を「思想又は感情を創作的に表現したものであつて、文芸、学術、美術又は音楽の範囲に属するもの」と定義していること（＝児童生徒の作品に著作権が生じるのは創作的な表現である場合であり、作品であれば一律に生じるとは限らない）',
  },
  personalInfoAct: {
    title: '個人情報の保護に関する法律 第二十七条（第三者提供の制限）・第六十九条（利用及び提供の制限）',
    publisher: 'e-Gov 法令検索（デジタル庁）',
    publishedOrUpdatedAt: '2023-04-01（第69条を含む令和3年改正の地方公共団体への適用開始日。公布は2003-05-30）',
    url: 'https://laws.e-gov.go.jp/law/415AC0000000057',
    checkedAt: parentCollaborationCheckedAt,
    supports:
      '公立学校（行政機関等）は第69条の利用目的外利用・提供の制限（第2項第1号に本人の同意の例外）。私立学校（学校法人）はそもそも第2条第11項の各号に該当せず個人情報取扱事業者であり、国立大学法人立・公立大学法人立の学校は第2条第11項第3号・第4号の括弧書きにより行政機関等から除かれ、いずれも第27条の本人同意原則が適用されること',
  },
  gakushuHyokaKaizenTsuchi: {
    title: '小学校、中学校、高等学校及び特別支援学校等における児童生徒の学習評価及び指導要録の改善等について（通知）',
    publisher: '文部科学省',
    publishedOrUpdatedAt: '2019-03-29（平成31年3月29日 30文科初第1845号）',
    url: 'https://www.mext.go.jp/b_menu/hakusho/nc/1415169.htm',
    checkedAt: threeViewpointCheckedAt,
    supports:
      '観点別学習状況の評価の観点が「知識・技能」「思考・判断・表現」「主体的に学習に取り組む態度」の3観点に整理され、設置者において通知に基づく適切な観点を設定することとされたこと。'
      + '特別支援学校（知的障害）の各教科の学習の記録は、評価の観点及びその趣旨を踏まえて文章で記述するとされていること。'
      + '通級による指導を受けている児童生徒について、記載すべき事項が個別の指導計画に記載されている場合には'
      + '「その写しを指導要録の様式に添付することをもって指導要録への記入に替えることも可能とする」とされていること',
  },
  tokushiGakushuHyokaSankou: {
    title: '特別支援学校小学部・中学部 学習評価参考資料',
    publisher: '文部科学省',
    publishedOrUpdatedAt: '2020-04（令和2年4月）',
    url: 'https://www.mext.go.jp/content/20200515-mxt_tokubetu01-1386427.pdf',
    checkedAt: threeViewpointCheckedAt,
    supports:
      '特別支援学校小学部・中学部学習指導要領総則（学習評価の充実）が「個別の指導計画に基づいて行われた学習状況や結果を適切に評価し、'
      + '指導目標や指導内容、指導方法の改善に努め、より効果的な指導ができるようにすること」を求めていること（同資料P.5の引用による）。'
      + '知的障害である児童生徒のための各教科が小・中・高等部を通じて3観点に整理されたこと（P.7）。'
      + '知的障害の各教科の指導要録の記載が「具体的に定めた指導内容、実現状況等を箇条書き等により文章で端的に記述する」であること（P.9）。'
      + '個別の指導計画の作成に当たり「各学校において定める各教科等の評価規準の内容を指導目標、指導内容等の設定に活かすことが考えられる」'
      + 'とされ、計画様式の形そのものは定められていないこと（P.9〜10）',
  },
  tokushiSokusokuKaisetsu: {
    title: '特別支援学校教育要領・学習指導要領解説 総則編（幼稚部・小学部・中学部）',
    publisher: '文部科学省',
    publishedOrUpdatedAt: '2018-03（平成30年3月。令和6年12月一部改訂）',
    url: 'https://www.mext.go.jp/content/20200407-mxt_tokubetu01-100002983_02.pdf',
    checkedAt: threeViewpointCheckedAt,
    supports:
      '個別の指導計画が「個々の児童生徒の実態に応じて適切な指導を行うために各学校で作成しなければならないもの」であること。'
      + 'および「個別の指導計画の作成の手順や様式は、それぞれの学校が児童生徒の実態や各教科や自立活動等の特質を踏まえて、'
      + '指導上最も効果が上がるように工夫して作成することが大切である」として、様式の設計を各学校に委ねていること（第2章第3節、印刷ページ241）。'
      + '各教科の個別の指導計画についても「児童生徒一人一人に対する指導上の配慮事項を付記するなど、児童生徒の実態や各教科等の特質等を踏まえて、'
      + '様式を工夫して作成することが大切である」としていること。計画がPlan-Do-Check-Actionのサイクルで評価・改善されるべきものとされていること',
  },
  kobetsuShidoKeikakuYoshikiRei: {
    title: '資料5 個別の指導計画の様式例',
    publisher: '文部科学省',
    publishedOrUpdatedAt: '2010-10（平成22年10月掲載。平成29年改訂より前の資料）',
    url: 'https://www.mext.go.jp/a_menu/shotou/tokubetu/material/1298214.htm',
    checkedAt: threeViewpointCheckedAt,
    supports:
      '国が示す個別の指導計画の様式例が単一ではなく、記載の単位や粒度の異なる複数の形式（実態と学期ごとの取組、題材・単元ごとの記入、'
      + '学期ごとの重点と年間の振り返り、基本的配慮と教科別配慮の分離など）を並べたものであること。'
      + 'ただし本資料は平成22年10月の掲載であり、平成29年改訂学習指導要領を踏まえたものではない点に留意が必要',
  },
  gakushuHyokaQa: {
    title: '平成29・30年改訂の学習指導要領下における学習評価に関するQ&A【令和元年11月5日時点】',
    publisher: '文部科学省',
    publishedOrUpdatedAt: '2019-11-05（令和元年11月5日時点）',
    url: 'https://www.mext.go.jp/a_menu/shotou/new-cs/qa/1421956.htm',
    checkedAt: threeViewpointCheckedAt,
    supports:
      '【通知表と指導要録】の項で、指導要録が「学校教育法施行規則に位置付けられた法令に基づく公簿」であるのに対し、'
      + '「通知表は法令上の作成義務はなく実態として各学校で作成するもの」と、法令上の位置付けの有無が異なることを明示していること。'
      + 'また通知表の記載事項が指導要録の「指導に関する記録」の記載事項をすべて満たす場合、設置者の判断で様式を共通のものとすることが'
      + '現行制度上も可能であること。【障害のある児童生徒に係る学習評価】の項で、個別の指導計画を作成している児童生徒について、'
      + '指導要録の指導に関する記録に記載すべき事項が当該計画に記載されている場合は「その写しをもって指導要録への記入に替えることも可能」'
      + 'としたこと。知的障害の各教科の学習の記録を、評価の観点及びその趣旨を踏まえ「観点別学習状況を考慮し、端的な文章記述とする」としたこと',
  },
  schoolEducationRuleShidoYoroku: {
    title: '学校教育法施行規則 第二十四条・第二十八条（指導要録・表簿）',
    publisher: 'e-Gov 法令検索（デジタル庁）',
    publishedOrUpdatedAt: '1947-05-23（公布。条文はe-Gov掲載の現行版を確認）',
    url: 'https://laws.e-gov.go.jp/law/322M40000080011',
    checkedAt: threeViewpointCheckedAt,
    supports:
      '校長に指導要録の作成義務があること（第24条第1項）、指導要録が学校に備えなければならない表簿であり、'
      + '保存期間が5年間（指導要録及びその写しのうち入学・卒業等の学籍に関する記録は20年間）であること（第28条）、'
      + 'および第28条第1項の表簿の列挙に通知表が含まれていないこと',
  },
} satisfies Record<string, ArticleReference>;

export const ARTICLE_REFERENCES: Record<string, ArticleReference[]> = {
  'free-ict-tools-safety-checklist': [
    sources.mextSecurityPolicy,
    sources.ppcCloudFaq,
    sources.personalInfoActDefinitions,
    sources.personalInfoActOrderSensitive,
    sources.ppcSchoolAlert2025,
    sources.copyrightActWork,
  ],
  'google-forms-school-use-guide': [
    sources.googleFormsPublish,
    sources.googleFormsResponses,
    sources.googleFormsCollaborators,
    sources.googleFormsErrors,
    sources.googleFormsPermission,
    sources.googleFormsUpgrade,
    sources.googleFormsQuestionTypes,
    sources.googleFormsAdmin,
  ],
  'ai-class-newsletter-prompt': [
    sources.generativeAiGuideline,
    sources.ppcAiNotice,
    sources.aiCopyright,
    sources.personalInfoActDefinitions,
  ],
  'ai-koomu-kaizen-nyumon': [
    sources.generativeAiGuideline,
    sources.ppcAiNotice,
    sources.ppcSchoolAlert2025,
    sources.personalInfoActDefinitions,
    sources.personalInfoActOrderSensitive,
    sources.personalInfoAct,
    sources.aiCopyright,
  ],
  'chatgpt-tsuchihyo-shoken': [sources.generativeAiGuideline, sources.ppcAiNotice],
  'digital-textbook-introduction-school-changes': [sources.digitalTextbook, sources.digitalTextbookNotice],
  'education-ai-service-checklist-before-use': [sources.ppcAiNotice, sources.generativeAiGuideline, sources.aiCopyright],
  'giga-device-lesson-use-guide': [sources.studx, sources.safeDevices],
  'individual-education-plan-writing-guide': [
    sources.schoolEducationRule134,
    sources.individualPlan,
    sources.tsukyuGuide,
  ],
  'individual-plan-three-viewpoint-evaluation': [
    sources.tokushiSokusokuKaisetsu,
    sources.gakushuHyokaKaizenTsuchi,
    sources.tokushiGakushuHyokaSankou,
    sources.gakushuHyokaQa,
    sources.schoolEducationRuleShidoYoroku,
    sources.kobetsuShidoKeikakuYoshikiRei,
    sources.individualPlan,
  ],
  'reasonable-accommodation-school-record': [
    sources.disabilityBasicPolicy,
    sources.accommodationGuideline,
    sources.individualPlan,
  ],
  'special-needs-behavior-record-guide': [sources.behaviorResearch, sources.individualPlan],
  'special-needs-ict-reasonable-accommodation': [
    sources.disabilityBasicPolicy,
    sources.accommodationGuideline,
    sources.specialNeedsIct,
  ],
  'special-needs-ict-support-tools-checklist': [
    sources.specialNeedsIct,
    sources.accommodationGuideline,
    sources.safeDevices,
    sources.individualPlan,
  ],
  'special-needs-parent-collaboration': [
    sources.disabilityDiscriminationAct,
    sources.disabilityBasicPolicy,
    sources.schoolEducationRule134,
    sources.personalInfoAct,
    sources.childAbusePreventionAct,
    sources.accommodationGuideline,
    sources.individualPlan,
  ],
  'special-needs-visual-schedule-support': [sources.tsukyuGuide, sources.behaviorResearch],
};

export function getArticleReferences(slug: string): ArticleReference[] {
  return ARTICLE_REFERENCES[slug] ?? [];
}

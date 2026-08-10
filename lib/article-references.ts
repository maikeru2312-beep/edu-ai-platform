export type ArticleReference = {
  title: string;
  publisher: string;
  publishedOrUpdatedAt: string;
  url: string;
  checkedAt: string;
  supports: string;
};

const checkedAt = '2026-07-21';

// 保護者面談記事のために e-Gov 法令検索で条文本文を確認した日
const parentCollaborationCheckedAt = '2026-08-10';

// 校務AI判断ハブのために新規登録した資料（PPC 2025学校向け注意喚起・個情法第2条）を確認した日。
// 既存の generativeAiGuideline / ppcAiNotice は共有の checkedAt を用いる
const koomuHubCheckedAt = '2026-08-10';

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
  ppcSchoolAlert2025: {
    title: '学校における個人情報の漏えい等事案を踏まえた個人情報の取扱いに関する留意点について（注意喚起）',
    publisher: '個人情報保護委員会',
    publishedOrUpdatedAt: '2025-06-25',
    url: 'https://www.ppc.go.jp/news/careful_information/250625_alert_school/',
    checkedAt: koomuHubCheckedAt,
    supports:
      '令和5年4月〜令和7年4月の学校からの漏えい等報告を分析し、学校設置者・教職員向けに留意点・事案例・発生原因・再発防止策を示したもの。学校は個人情報の管理が難しい環境であることを前提に入力情報を絞るべきという本記事の立場を支える。なお、同注意喚起は生成AIの利用を対象としたものではない',
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
} satisfies Record<string, ArticleReference>;

export const ARTICLE_REFERENCES: Record<string, ArticleReference[]> = {
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
  ],
  'ai-lesson-preparation-prompt': [sources.generativeAiGuideline, sources.ppcAiNotice, sources.aiCopyright],
  'chatgpt-tsuchihyo-shoken': [sources.generativeAiGuideline, sources.ppcAiNotice],
  'digital-textbook-introduction-school-changes': [sources.digitalTextbook, sources.digitalTextbookNotice],
  'education-ai-service-checklist-before-use': [sources.ppcAiNotice, sources.generativeAiGuideline, sources.aiCopyright],
  'generative-ai-guideline-v2-school-reading': [sources.generativeAiGuideline, sources.ppcAiNotice, sources.aiCopyright],
  'giga-device-lesson-use-guide': [sources.studx, sources.safeDevices],
  'ict-teaching-tools-selection-guide': [sources.safeDevices, sources.specialNeedsIct, sources.ppcAiNotice],
  'individual-education-plan-writing-guide': [sources.individualPlan, sources.tsukyuGuide],
  'reasonable-accommodation-school-record': [sources.accommodationGuideline, sources.individualPlan],
  'school-generative-ai-privacy-security': [sources.generativeAiGuideline, sources.ppcAiNotice, sources.aiCopyright],
  'special-needs-behavior-record-guide': [sources.behaviorResearch, sources.individualPlan],
  'special-needs-ict-reasonable-accommodation': [sources.accommodationGuideline, sources.specialNeedsIct],
  'special-needs-ict-support-tools-checklist': [sources.specialNeedsIct, sources.accommodationGuideline],
  'special-needs-parent-collaboration': [
    sources.disabilityDiscriminationAct,
    sources.schoolEducationRule134,
    sources.personalInfoAct,
    sources.childAbusePreventionAct,
    sources.accommodationGuideline,
    sources.individualPlan,
  ],
  'special-needs-visual-schedule-support': [sources.tsukyuGuide, sources.behaviorResearch],
  'tokubetsu-shien-ict': [sources.specialNeedsIct, sources.accommodationGuideline, sources.studx],
};

export function getArticleReferences(slug: string): ArticleReference[] {
  return ARTICLE_REFERENCES[slug] ?? [];
}

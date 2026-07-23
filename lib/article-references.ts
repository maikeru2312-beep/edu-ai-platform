export type ArticleReference = {
  title: string;
  publisher: string;
  publishedOrUpdatedAt: string;
  url: string;
  checkedAt: string;
  supports: string;
};

const checkedAt = '2026-07-21';

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
    supports: '合理的配慮の申出、建設的対話、個別の教育支援計画への記載と情報共有',
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
} satisfies Record<string, ArticleReference>;

export const ARTICLE_REFERENCES: Record<string, ArticleReference[]> = {
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
  'special-needs-visual-schedule-support': [sources.tsukyuGuide, sources.behaviorResearch],
  'tokubetsu-shien-ict': [sources.specialNeedsIct, sources.accommodationGuideline, sources.studx],
};

export function getArticleReferences(slug: string): ArticleReference[] {
  return ARTICLE_REFERENCES[slug] ?? [];
}

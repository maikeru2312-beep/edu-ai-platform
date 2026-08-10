// 運営者の実務経験に関する編集注記。
// 掲載できるのは、運営者本人が確認回答で「実際に担当した(A)」または「見聞・支援した(B)」と
// 回答した記事に限る。経験C（資料でのみ確認）の記事には注記を置かない。
// 注記は確認された経験の範囲のみを示し、効果の実証・具体的な時短時間・全校導入・
// 契約や管理者業務の担当・児童生徒個人を推測できる例は含めない。

export interface ArticleExperienceNote {
  // A: 実際に担当した / B: 見聞・支援した（確認回答に基づく）
  scope: 'A' | 'B';
  note: string;
}

const ARTICLE_EXPERIENCE_NOTES: Record<string, ArticleExperienceNote> = {
  'ai-lesson-preparation-prompt': {
    scope: 'A',
    note: '運営者は、授業案や教材のたたき台に生成AIを用い、学習目標・児童生徒の実態・原資料に照らして内容を確認・修正した経験に基づいて、本記事の手順を整理しています。用途によっては確認に時間がかかる場合もあります。',
  },
  'chatgpt-tsuchihyo-shoken': {
    scope: 'A',
    note: '運営者は、通知表所見の作成・確認業務に携わった経験に基づいて本記事を整理しています。生成AIの利用は匿名化したたたき台に限り、事実確認と校内での確認は人が行う前提です。',
  },
  'education-ai-service-checklist-before-use': {
    scope: 'B',
    note: '運営者は、ICT・クラウドサービスの利用条件や校内ルールを確認しながら活用を検討した経験に基づいて本記事を整理しています。全校導入・契約・管理者業務を担当したことを示すものではありません。',
  },
  'giga-device-lesson-use-guide': {
    scope: 'A',
    note: '運営者は、1人1台端末を使った授業の設計・支援に携わった経験に基づいて本記事を整理しています。活用の効果や到達度は、学年・教科・環境によって異なります。',
  },
  'ict-teaching-tools-selection-guide': {
    scope: 'A',
    note: '運営者は、ICT教材・支援ツールを授業目的に応じて選定・試用した経験に基づいて本記事を整理しています。',
  },
  'individual-education-plan-writing-guide': {
    scope: 'A',
    note: '運営者は、個別の指導計画等の作成・評価・引継ぎに携わった経験に基づいて本記事を整理しています。様式や作成手順は学校・自治体・設置者によって異なります。',
  },
  'reasonable-accommodation-school-record': {
    scope: 'B',
    note: '運営者は、合理的配慮の検討や記録に関わった経験に基づいて本記事を整理しています。相談・合意形成・記録の方法は学校・設置者によって異なります。',
  },
  'school-generative-ai-privacy-security': {
    scope: 'A',
    note: '運営者は、校務情報を生成AIに入力する際の個人情報・校内ルールの確認に携わった経験に基づいて本記事を整理しています。',
  },
  'special-needs-behavior-record-guide': {
    scope: 'A',
    note: '運営者は、行動観察・ABC記録と、その記録に基づく支援の見直しに携わった経験に基づいて本記事を整理しています。掲載する記入例はすべて架空例です。',
  },
  'special-needs-ict-reasonable-accommodation': {
    scope: 'B',
    note: '運営者は、ICTを合理的配慮として検討・記録する場面に関わった経験に基づいて本記事を整理しています。',
  },
  'special-needs-ict-support-tools-checklist': {
    scope: 'B',
    note: '運営者は、本人の様子を確認しながらICT支援ツールを選ぶ場面に関わった経験に基づいて本記事を整理しています。特定の製品名や個別の事例は掲載していません。',
  },
  'special-needs-parent-collaboration': {
    scope: 'B',
    note: '運営者は、特別支援学校で保護者との面談・相談の場に同席した経験があります。本記事は、その経験と公的資料を踏まえて整理しています。面談の進め方や記録方法は、学校・設置者によって異なります。',
  },
  'special-needs-visual-schedule-support': {
    scope: 'A',
    note: '運営者は、スケジュールや手順表などの視覚支援を作成・見直した経験に基づいて本記事を整理しています。支援の合う・合わないは本人により異なるため、記録して調整する前提です。',
  },
  'tokubetsu-shien-ict': {
    scope: 'A',
    note: '運営者は、コミュニケーションカード等のAACを含む支援に携わった経験に基づいて本記事を整理しています。各機能は本人のニーズと試用結果から選ぶものとして整理しており、掲載した機能のすべてを実践したことを示すものではありません。',
  },
};

export function getArticleExperienceNote(slug: string): ArticleExperienceNote | null {
  return ARTICLE_EXPERIENCE_NOTES[slug] ?? null;
}

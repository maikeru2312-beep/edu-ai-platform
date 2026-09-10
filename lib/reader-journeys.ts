// 読者ジャーニー（「今やりたいこと」から入って、判断を順に進めるための並び）の単一の真実。
//
// Home の「やりたいことから探す」、記事末尾の「次に確認すること」、/resources のグループ分けは
// すべてこのファイルを参照する。3箇所で同じ並びを別々に持たないこと（二重管理をテストで検出する）。
//
// ここに置くのはジャーニー固有の情報だけにとどめる。
//   - 記事タイトル・カテゴリ → content/articles のフロントマター（lib/articles.ts 経由）
//   - 様式の名前・使う場面・見出しアンカー → lib/practical-resources.ts
// どちらもこのファイルには写さず、slug で引く。写すと真実が2つになる。
//
// 並びの根拠は記事どうしの本文リンク（委譲）に置いている。本文が「次はこちら」と書いている
// 向きをそのまま順序にしているので、記事を読み進めた読者と、この並びで進む読者が同じ道を通る。

import { PRACTICAL_RESOURCES, type PracticalResource } from '@/lib/practical-resources';

export type JourneyId = 'plan' | 'support' | 'family' | 'ict' | 'ai';

export type JourneyStep = {
  /** 公開記事の slug。未公開・存在しない slug はテストで落ちる。 */
  slug: string;
  /** 一覧で順序を見せるための短いラベル（記事タイトルの短縮ではなく、その段で決めること）。 */
  label: string;
  /** この段で決めることを1文で。記事末尾の前後リンクの補助説明に使う。 */
  decision: string;
  /**
   * この記事の「主ジャーニー」がこのジャーニーであることを表す。
   * 記事末尾はこの1件だけを描画する（複数ジャーニーに属する記事を二重に案内しない）。
   * 複数に属する記事は、先に進める余地が大きい側を primary にしている。
   */
  primary?: boolean;
};

export type ReaderJourney = {
  id: JourneyId;
  /** 読者のやりたいこと。見出しになるので体言止めにしない。 */
  title: string;
  /** そのジャーニーで何を決め終わるかの1文。 */
  shortDescription: string;
  steps: JourneyStep[];
};

export const READER_JOURNEYS: ReaderJourney[] = [
  {
    id: 'plan',
    title: '個別の指導計画を書く',
    shortDescription:
      '計画の型から目標の具体化、評価欄の決め方、評価場面で支援を使ってよいかまでを順に決めます。',
    steps: [
      {
        slug: 'individual-education-plan-writing-guide',
        label: '計画の型を決める',
        decision:
          '個別の教育支援計画と個別の指導計画のどちらに何を書くか、実態把握・目標・手立て・評価の型を決める。',
        primary: true,
      },
      {
        slug: 'individual-plan-goal-specificity-evaluation',
        label: '目標を具体化する',
        decision:
          '目標をどこまで具体化するか。評価できる具体性と、知識・技能だけに偏らない書き方を決める。',
        primary: true,
      },
      {
        slug: 'individual-plan-three-viewpoint-evaluation',
        label: '評価欄を決める',
        decision: '評価欄を三観点に分けるかどうかを、要求がどの層から来ているかを確かめて決める。',
        primary: true,
      },
      {
        slug: 'special-needs-ict-reasonable-accommodation',
        label: '評価場面の可否',
        decision:
          '読み上げなどの支援を評価場面でも使ってよいかを、合理的配慮か教育課程上の指導かの仕分けから決める。',
        primary: true,
      },
    ],
  },
  {
    id: 'support',
    title: '支援を決めて記録する',
    shortDescription:
      '困っている場面の記録から、支援ツールと見通し支援を決め、合意した配慮を残すまでを扱います。',
    steps: [
      {
        slug: 'special-needs-behavior-record-guide',
        label: '行動を記録する',
        decision: '何を・どの粒度で記録するかを決め、ABC記録の1枚目を書く。',
        primary: true,
      },
      {
        slug: 'special-needs-ict-support-tools-checklist',
        label: '支援ツールを選ぶ',
        decision: '参加できていない場面から必要な機能を決め、試用の条件と判定の基準を決める。',
        primary: true,
      },
      {
        slug: 'special-needs-visual-schedule-support',
        label: '見通しを支える',
        decision: 'スケジュールや手順表の形式と情報量を決め、作り替えの履歴を残す。',
        primary: true,
      },
      {
        // 主ジャーニーは family 側（面談で合意してから記録するほうが、この記事の前段が揃う）。
        slug: 'reasonable-accommodation-school-record',
        label: '配慮を記録する',
        decision: '合意した合理的配慮を、引き継ぎと見直しに使える記録の文面に直す。',
      },
    ],
  },
  {
    id: 'family',
    title: '保護者と確認して残す',
    shortDescription: '面談の準備と保留の扱いから、合意した配慮の記録、計画への転記までを扱います。',
    steps: [
      {
        slug: 'special-needs-parent-collaboration',
        label: '面談を準備する',
        decision:
          '面談前に何を整理し、その場で答えられない要望をどう校内確認へ回すかを決める。',
        primary: true,
      },
      {
        slug: 'reasonable-accommodation-school-record',
        label: '合意を記録する',
        decision: '合意した配慮と保留を、次の担当者が読んで使える記録の文面に直す。',
        primary: true,
      },
      {
        // 主ジャーニーは plan 側（この記事から先に3段あり、読者を前へ進められる）。
        slug: 'individual-education-plan-writing-guide',
        label: '計画へ転記する',
        decision: '面談と記録の内容を、個別の教育支援計画・個別の指導計画のどこに書くかを決める。',
      },
    ],
  },
  {
    id: 'ict',
    title: 'ICTを授業で使う',
    shortDescription:
      'そのサービスを使ってよいかの確認から、端末の当日運用、デジタル教科書とフォームの設計まで。',
    steps: [
      {
        slug: 'free-ict-tools-safety-checklist',
        label: '使ってよいか',
        decision:
          '学校・設置者のルール、アカウント、外部へ出る情報を順に見て、使う・確認待ち・使わないを決める。',
        primary: true,
      },
      {
        slug: 'giga-device-lesson-use-guide',
        label: '授業当日の運用',
        decision: '前日に実機で確かめる項目と、当日トラブルで代替へ切り替える基準を決める。',
        primary: true,
      },
      {
        slug: 'digital-textbook-introduction-school-changes',
        label: '教科書の単元設計',
        decision:
          '学習者用デジタル教科書を初めて使う単元で、何を確かめ、授業後に続けるかをどう判定するかを決める。',
        primary: true,
      },
      {
        slug: 'google-forms-school-use-guide',
        label: 'フォームを配る',
        decision: 'ログイン要求・記名の粒度・2か所の権限・削除する場所を、配る前に確定させる。',
        primary: true,
      },
    ],
  },
  {
    id: 'ai',
    title: '生成AIを校務で使う',
    shortDescription:
      '校務ゲートで使えるかを決め、所見・学級通信での使い方と、新しいサービスの一次判定まで。',
    steps: [
      {
        slug: 'ai-koomu-kaizen-nyumon',
        label: '校務ゲートを通す',
        decision: '利用可否・入力情報・AIの役割・人の確認の4ゲートを通し、止まった位置と理由を残す。',
        primary: true,
      },
      {
        slug: 'chatgpt-tsuchihyo-shoken',
        label: '所見に使う',
        decision:
          '通知表所見で生成AIを使う子・使わない子を先に決め、入力前と提出前に見るところを固定する。',
        primary: true,
      },
      {
        slug: 'ai-class-newsletter-prompt',
        label: '学級通信に使う',
        decision: '下書きに足された事実・落ちた事実を原資料と突き合わせ、配布できる原稿に戻す。',
        primary: true,
      },
      {
        slug: 'education-ai-service-checklist-before-use',
        label: '新しいサービス',
        decision:
          '新しいAIサービスの案内が届いたとき、導入候補に載せてよいかを候補にする・保留・載せないで一次判定する。',
        primary: true,
      },
    ],
  },
];

/**
 * ジャーニーに載せていない公開記事。
 * 「17記事すべてをどこかへ入れる」ことは目的ではないので、外す判断はここに明示して残す。
 * 記事が増えてここにも steps にも無い状態は、テストで検出する（黙って落ちないようにする）。
 */
export const JOURNEY_UNASSIGNED: { slug: string; reason: string }[] = [];

// ─── 参照ヘルパ（Home / 記事末尾 / /resources はここだけを使う） ─────────────

export type JourneyPosition = {
  journey: ReaderJourney;
  step: JourneyStep;
  /** 1 始まり。「4段のうち2段目」の表示に使う。 */
  index: number;
  total: number;
  previous?: JourneyStep;
  next?: JourneyStep;
};

const resourceBySlug = new Map<string, PracticalResource>(
  PRACTICAL_RESOURCES.map((resource) => [resource.slug, resource]),
);

/** その段で使う様式。様式の名前・アンカーは practical-resources 側が唯一の真実。 */
export function getStepResource(step: JourneyStep): PracticalResource | undefined {
  return resourceBySlug.get(step.slug);
}

export function getJourney(id: JourneyId): ReaderJourney | undefined {
  return READER_JOURNEYS.find((journey) => journey.id === id);
}

/** その記事を含むすべてのジャーニー（本文リンクの補助や検証に使う）。 */
export function getJourneysForArticle(slug: string): ReaderJourney[] {
  return READER_JOURNEYS.filter((journey) => journey.steps.some((step) => step.slug === slug));
}

/**
 * 記事末尾に出す位置。primary 指定のある段だけを返すので、
 * 複数ジャーニーに属する記事でも案内は1本に定まる。
 */
export function getPrimaryJourneyPosition(slug: string): JourneyPosition | undefined {
  for (const journey of READER_JOURNEYS) {
    const index = journey.steps.findIndex((step) => step.slug === slug && step.primary);
    if (index === -1) continue;
    return {
      journey,
      step: journey.steps[index],
      index: index + 1,
      total: journey.steps.length,
      previous: journey.steps[index - 1],
      next: journey.steps[index + 1],
    };
  }
  return undefined;
}

/** /resources のグループ分け。各様式は主ジャーニーの下に1回だけ出す。 */
export function getResourceGroups(): { journey: ReaderJourney; steps: JourneyStep[] }[] {
  return READER_JOURNEYS.map((journey) => ({
    journey,
    steps: journey.steps.filter((step) => step.primary && resourceBySlug.has(step.slug)),
  })).filter((group) => group.steps.length > 0);
}

/** /resources 内のジャーニー見出しにつける id（Home からの着地先）。 */
export function journeyAnchor(id: JourneyId): string {
  return `journey-${id}`;
}

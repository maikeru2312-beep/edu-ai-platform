// 読者ジャーニー（「今やりたいこと」から入って判断を進めるための道筋）の単一の真実。
//
// Home の「やりたいことから探す」、記事末尾の案内、/resources のグループ分けは
// すべてこのファイルを参照する。3箇所で同じ並びを別々に持たないこと（二重管理をテストで検出する）。
//
// ここに置くのはジャーニー固有の情報だけにとどめる。
//   - 記事タイトル・カテゴリ → content/articles のフロントマター（lib/articles.ts 経由）
//   - 様式の名前・使う場面・見出しアンカー → lib/practical-resources.ts
// どちらもこのファイルには写さず、slug で引く。写すと真実が2つになる。
//
// ジャーニーには3つの形（kind）がある。形によって「並び」の意味が違うので、描画も分ける。
//   sequence    前の段の結論が次の段の前提になる。順番が意味を持つので、前後リンクと番号を出す。
//   hub         場面に合わせて選ぶ選択肢の束。選択肢どうしに順番はない。
//               全員が先に通るべき共通の関門があるときだけ、それを起点（entry）として1件置く
//               （生成AIの利用可否など）。共通の前提が無い hub（ICT）には起点を置かない。
//   conditional 困りごとや状況によって入口が変わる。起点も順番もなく、条件（when）で選ぶ。
// hub と conditional を番号や矢印で並べると、実際には無い順番を読者に強いることになる。
//
// 順番・起点・条件の根拠は、記事どうしの本文リンク（委譲）に置いている。

import { PRACTICAL_RESOURCES, type PracticalResource } from '@/lib/practical-resources';

export type JourneyId = 'plan' | 'family' | 'ict' | 'ai';

export type JourneyKind = 'sequence' | 'hub' | 'conditional';

export type JourneyStep = {
  /** 公開記事の slug。未公開・存在しない slug はテストで落ちる。 */
  slug: string;
  /** その段で決めること・その場面の名前（記事末尾と /resources で使う。記事タイトルの短縮ではない）。 */
  label: string;
  /** Home の入口カードで使う短い呼び名（10字以内）。Home は入口を選ぶ層なので、ここには詳細を出さない。 */
  short: string;
  /** この記事で決めることを1文で。記事末尾だけで使う。 */
  decision: string;
  /**
   * この記事の主ジャーニーがこのジャーニーであること。記事末尾はこの1件だけを描画する
   * （複数ジャーニーに属する記事を二重に案内しない）。
   * 複数に属する記事は、先へ進める余地が大きい側を primary にしている。
   */
  primary?: boolean;
  /**
   * hub の起点（全員が先に通る共通の関門）。置く場合は1ジャーニーに1件だけ、先頭に置く。
   * 共通の前提が無い hub や、sequence / conditional では使わない。
   */
  entry?: boolean;
  /**
   * どんな場面・状況でこの記事へ進むか。hub と conditional では全段で必須。記事末尾と /resources で使う。
   * sequence では使わない（順番そのものが「いつ読むか」を表すため）。
   */
  when?: string;
};

export type ReaderJourney = {
  id: JourneyId;
  kind: JourneyKind;
  /** 読者のやりたいこと。見出しになる。 */
  title: string;
  /** そのジャーニーで何を決めるか。Home（sequence のみ）と /resources で使う。 */
  shortDescription: string;
  /**
   * Home の入口カードで、読者に何を選ぶかを促す一言。hub と conditional で必須、sequence では使わない。
   * 起点のある hub では起点へのボタンの文言、起点の無い hub と conditional では選択肢の見出しになる。
   */
  homePrompt?: string;
  steps: JourneyStep[];
};

export const READER_JOURNEYS: ReaderJourney[] = [
  {
    id: 'plan',
    kind: 'sequence',
    title: '個別の指導計画を書く',
    shortDescription:
      '計画の型から評価場面の可否までを、この順に決めます。前の段の結論が次の段の前提になります。',
    steps: [
      {
        slug: 'individual-education-plan-writing-guide',
        label: '計画の型を決める',
        short: '計画の型',
        decision:
          '個別の教育支援計画と個別の指導計画のどちらに何を書くか、実態把握・目標・手立て・評価の型を決める。',
        primary: true,
      },
      {
        slug: 'individual-plan-goal-specificity-evaluation',
        label: '目標を具体化する',
        short: '目標',
        decision:
          '目標をどこまで具体化するか。評価できる具体性と、知識・技能だけに偏らない書き方を決める。',
        primary: true,
      },
      {
        slug: 'individual-plan-three-viewpoint-evaluation',
        label: '評価欄を決める',
        short: '評価欄',
        decision: '評価欄を三観点に分けるかどうかを、要求がどの層から来ているかを確かめて決める。',
        primary: true,
      },
      {
        slug: 'special-needs-ict-reasonable-accommodation',
        label: '評価場面の可否',
        short: '評価場面',
        decision:
          '読み上げなどの支援を評価場面でも使ってよいかを、合理的配慮か教育課程上の指導かの仕分けから決める。',
        primary: true,
      },
    ],
  },
  {
    id: 'family',
    kind: 'sequence',
    title: '保護者と確認して残す',
    shortDescription:
      '面談の準備と保留の扱いから、合意した配慮の記録、計画への転記までを、この順に進めます。',
    steps: [
      {
        slug: 'special-needs-parent-collaboration',
        label: '面談を準備する',
        short: '面談',
        decision:
          '面談前に何を整理し、その場で答えられない要望をどう校内確認へ回すかを決める。',
        primary: true,
      },
      {
        slug: 'reasonable-accommodation-school-record',
        label: '合意を記録する',
        short: '合意の記録',
        decision: '合意した配慮と保留を、次の担当者が読んで使える記録の文面に直す。',
        primary: true,
      },
      {
        // 主ジャーニーは plan 側（この記事から先に3段あり、読者を前へ進められる）。
        slug: 'individual-education-plan-writing-guide',
        label: '計画へ転記する',
        short: '計画へ転記',
        decision: '面談と記録の内容を、個別の教育支援計画・個別の指導計画のどこに書くかを決める。',
      },
    ],
  },
  {
    // 共通の前提が無い hub。端末・フォーム・デジタル教科書は未導入サービスではないので、
    // 外部サービスの確認を全員の起点にしない（使いたい場面から直接入る）。
    id: 'ict',
    kind: 'hub',
    title: 'ICTを授業で使う',
    shortDescription:
      '使いたい場面ごとに入口が分かれています。共通の前提はないので、いまの場面に合う記事から読みます。',
    homePrompt: '使いたい場面を選ぶ',
    steps: [
      {
        slug: 'giga-device-lesson-use-guide',
        label: '端末を使う授業を準備する',
        short: '端末授業',
        when: '1人1台端末を使う授業の前日と当日',
        decision: '前日に実機で確かめる項目と、当日トラブルで代替へ切り替える基準を決める。',
        primary: true,
      },
      {
        slug: 'google-forms-school-use-guide',
        label: 'Googleフォームを配る',
        short: 'Googleフォーム',
        when: '保護者や児童生徒に回答を求める前',
        decision: 'ログイン要求・記名の粒度・2か所の権限・削除する場所を、配る前に確定させる。',
        primary: true,
      },
      {
        slug: 'digital-textbook-introduction-school-changes',
        label: 'デジタル教科書を使う',
        short: 'デジタル教科書',
        when: 'デジタル教科書を初めて使う単元',
        decision:
          '学習者用デジタル教科書を初めて使う単元で、何を確かめ、授業後に続けるかをどう判定するかを決める。',
        primary: true,
      },
      {
        slug: 'free-ict-tools-safety-checklist',
        label: '未導入サービスを確認する',
        short: '未導入サービス',
        when: '正式に導入されていないサービスを使いたいとき',
        decision:
          '学校・設置者のルール、アカウント、外部へ出る情報を順に見て、使う・確認待ち・使わないを決める。',
        primary: true,
      },
    ],
  },
  {
    id: 'ai',
    kind: 'hub',
    title: '生成AIを校務で使う',
    shortDescription:
      'まず校務ゲートで使ってよいかと入力してよい情報を決め、そこから先は所見・学級通信・小さな教材づくり・教材修正の確認・教育情報の原典確認・新しいサービスの判定のうち、いまの場面に合うものを選びます。',
    homePrompt: 'まず利用可否を確認する',
    steps: [
      {
        // 起点（全員が先に通る安全の関門）。所見・学級通信・サービス判定の3記事すべてへ本文で委譲している。
        slug: 'ai-koomu-kaizen-nyumon',
        label: '校務ゲートを通す',
        short: '利用可否',
        entry: true,
        when: '校務で生成AIを使い始める前',
        decision: '利用可否・入力情報・AIの役割・人の確認の4ゲートを通し、止まった位置と理由を残す。',
        primary: true,
      },
      {
        slug: 'chatgpt-tsuchihyo-shoken',
        label: '所見に使う',
        short: '所見',
        when: '通知表所見の下書きに使うとき',
        decision:
          '通知表所見で生成AIを使う子・使わない子を先に決め、入力前と提出前に見るところを固定する。',
        primary: true,
      },
      {
        slug: 'ai-class-newsletter-prompt',
        label: '学級通信に使う',
        short: '学級通信',
        when: '学級通信・学年だよりの下書きに使うとき',
        decision: '下書きに足された事実・落ちた事実を原資料と突き合わせ、配布できる原稿に戻す。',
        primary: true,
      },
      {
        slug: 'codex-claude-code-teacher-small-tools',
        label: '小さな教材を作る',
        short: '教材づくり',
        when: '個人情報を使わず小さな授業用ツールを試作したいとき',
        decision: '依頼文で試作し、使用端末で動作を確かめ、費用・個人情報・配布条件を点検する。',
        primary: true,
      },
      {
        slug: 'ai-education-information-source-check',
        label: '教育情報の原典を確かめる',
        short: '原典確認',
        when: '生成AIが示した教育情報を研修資料や授業準備に使う前',
        decision: '主張を一文ずつ原典と照合し、対象・条件・版を確認して確認済み・条件付き・未確認を残す。',
        primary: true,
      },
      {
        slug: 'codex-claude-code-material-change-check',
        label: '教材の修正を確認する',
        short: '修正確認',
        when: 'CodexやClaude Codeで架空の教材を直す前後',
        decision: '変更範囲と権限を確かめ、ファイル一覧・差分・元の動作・復旧対象を確認して採用を判断する。',
        primary: true,
      },
      {
        slug: 'education-ai-service-checklist-before-use',
        label: '新しいサービス',
        short: '新サービス',
        when: '新しいAIサービスの案内が届いたとき',
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

/**
 * 記事末尾に出す、主ジャーニーの中での位置。形ごとに持つ情報が違う。
 * 順番の無い形（hub / conditional）は、前後（previous / next）をそもそも持たない。
 */
export type JourneyPosition =
  | {
      kind: 'sequence';
      journey: ReaderJourney;
      step: JourneyStep;
      /** 1 始まり。「4段のうち2段目」の表示に使う。 */
      index: number;
      total: number;
      previous?: JourneyStep;
      next?: JourneyStep;
    }
  | {
      kind: 'hub';
      journey: ReaderJourney;
      step: JourneyStep;
      /** この記事が起点かどうか（起点の無い hub では常に false）。 */
      isEntry: boolean;
      /** 共通の起点。起点の無い hub では undefined。 */
      entry?: JourneyStep;
      /** 場面に合わせて選ぶ記事（起点とこの記事自身は含めない）。 */
      choices: JourneyStep[];
    }
  | {
      kind: 'conditional';
      journey: ReaderJourney;
      step: JourneyStep;
      /** 状況に応じて読むほかの記事（この記事自身は含めない）。 */
      others: JourneyStep[];
    };

const resourceBySlug = new Map<string, PracticalResource>(
  PRACTICAL_RESOURCES.map((resource) => [resource.slug, resource]),
);

/** その段で使う様式。様式の名前・アンカーは practical-resources 側が唯一の真実。 */
export function getStepResource(step: JourneyStep): PracticalResource | undefined {
  return resourceBySlug.get(step.slug);
}

/** hub の起点（あれば）と選択肢。起点は entry 指定の1件だけで、無ければ全員が選択肢になる。 */
export function splitHub(journey: ReaderJourney): { entry?: JourneyStep; choices: JourneyStep[] } {
  const entry = journey.steps.find((step) => step.entry);
  return { entry, choices: journey.steps.filter((step) => step !== entry) };
}

/**
 * 記事末尾に出す位置。primary 指定のある段だけを返すので、
 * 複数ジャーニーに属する記事でも案内は1本に定まる。
 */
export function getPrimaryJourneyPosition(slug: string): JourneyPosition | undefined {
  for (const journey of READER_JOURNEYS) {
    const index = journey.steps.findIndex((step) => step.slug === slug && step.primary);
    if (index === -1) continue;
    const step = journey.steps[index];

    if (journey.kind === 'sequence') {
      return {
        kind: 'sequence',
        journey,
        step,
        index: index + 1,
        total: journey.steps.length,
        previous: journey.steps[index - 1],
        next: journey.steps[index + 1],
      };
    }

    if (journey.kind === 'hub') {
      const { entry, choices } = splitHub(journey);
      return {
        kind: 'hub',
        journey,
        step,
        isEntry: entry !== undefined && entry.slug === slug,
        entry,
        choices: choices.filter((choice) => choice.slug !== slug),
      };
    }

    return {
      kind: 'conditional',
      journey,
      step,
      others: journey.steps.filter((other) => other.slug !== slug),
    };
  }
  return undefined;
}

/** /resources のグループ分け。各様式は主ジャーニーの下に1回だけ、ジャーニーの並びどおりに出す。 */
export function getResourceGroups(): { journey: ReaderJourney; steps: JourneyStep[] }[] {
  return READER_JOURNEYS.map((journey) => ({
    journey,
    steps: journey.steps.filter((step) => step.primary && resourceBySlug.has(step.slug)),
  })).filter((group) => group.steps.length > 0);
}

/** /resources 内のジャーニー見出しにつける id（記事末尾からの着地先）。 */
export function journeyAnchor(id: JourneyId): string {
  return `journey-${id}`;
}

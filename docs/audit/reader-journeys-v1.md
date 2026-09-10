# 読者ジャーニー設計 v1（提案・prototype。未実装）

サイト改善監査（2026-09-10）で HUMAN_REVIEW_REQUIRED と判定した情報設計の提案。
実装していない。Owner が採用を決めたら、この文書の data 構造をそのまま `lib/reader-journeys.ts` に写して使う。

## なぜ必要か（実査で分かったこと）

- Home の「場面から探す」は、実際には4つのカテゴリ（特別支援教育／ICT活用／AI校務改善／教材・支援ツール）で、読者の「やりたいこと」ではなく分野の箱になっている。
- 記事末尾の「関連記事」は同カテゴリの新着3件で、次の意思決定につながらない（例: 書き方ガイドの下に出るのは日付順の3件）。
- 本文中の委譲リンクは17記事でよく整備されている（被リンク0の記事なし）が、記事を読む前に「どの順で読めばよいか」を示す面が無い。
- 被リンクが少ない記事（所見 1、フォーム 1→2、学級通信 2、目標 2、三観点 2、視覚支援 2）は、ジャーニーに置けば自然に到達される。

## ジャーニー（現在の17記事で構成できるもの）

| id | 読者のやりたいこと | 順序（→は「次に決めること」） | 途中で使う様式 |
|---|---|---|---|
| plan | 個別の指導計画を書く | individual-education-plan-writing-guide → individual-plan-goal-specificity-evaluation → individual-plan-three-viewpoint-evaluation → （評価欄）individual-education-plan-writing-guide#評価欄 → special-needs-ict-reasonable-accommodation（評価場面） | 引継ぎ前チェックリスト／目標具体化チェックシート／三観点の根拠確認表／評価場面の仕分け表 |
| record | 支援を決めて記録する | special-needs-behavior-record-guide → special-needs-ict-support-tools-checklist または special-needs-visual-schedule-support → reasonable-accommodation-school-record → individual-education-plan-writing-guide（転記） | ABC行動記録シート／試用条件シート／見直し記録シート／配慮記録の6欄 |
| family | 保護者と合意して残す | special-needs-parent-collaboration → reasonable-accommodation-school-record → individual-education-plan-writing-guide | 面談1回分の記録シート／配慮記録の6欄 |
| ict | ICTを授業で使う | free-ict-tools-safety-checklist → giga-device-lesson-use-guide → digital-textbook-introduction-school-changes ／ google-forms-school-use-guide | 利用前確認シート／授業前チェック表／単元記録シート／配布前設計シート |
| ai | 生成AIを校務で使う | ai-koomu-kaizen-nyumon → chatgpt-tsuchihyo-shoken ／ ai-class-newsletter-prompt。導入候補の判定は education-ai-service-checklist-before-use → free-ict-tools-safety-checklist | 判断シート／所見AI利用メモ／AI下書き前シート・原資料照合表／一次判定シート |

ジャーニーに属さない記事は無い。逆に、1記事が複数のジャーニーに属してよい（配慮記録・書き方ガイド）。

## 置く場所（3か所。すべて既存データから描画）

1. **Home**: 「場面から探す」を「やりたいことから探す」に置き換え、5ジャーニーを1行ずつ（やりたいこと／最初に読む記事／使う様式）。カテゴリ格子は「分野で探す」として下に残す。
2. **記事ページ**: 「関連記事（同カテゴリ新着3件）」を「このジャーニーの前後」に置き換える。前の記事／次の記事／使う様式へのリンク。ジャーニーに複数属する記事は、主ジャーニー（data の `primary: true`）を使う。同カテゴリ新着は残さなくてよい（本文の委譲リンクが既にある）。
3. **/resources**: カテゴリ順のグループ分けをジャーニー順に変える（「個別の指導計画を書く」の中に4様式が並ぶ）。資産数が増えても、ジャーニー単位で折りたためる。

## data 構造（prototype）

```ts
// lib/reader-journeys.ts（案）
export type JourneyStep = {
  slug: string;            // 公開記事の slug（テストで存在と公開を検証する）
  decision: string;        // この段で決めること（1文）
  asset?: string;          // 使う様式の見出し（practical-resources の anchor と一致させる）
};
export type ReaderJourney = {
  id: 'plan' | 'record' | 'family' | 'ict' | 'ai';
  job: string;             // 読者のやりたいこと（見出しになる）
  steps: JourneyStep[];    // 順序どおり
};
export const READER_JOURNEYS: ReaderJourney[] = [ /* 上の表を写す */ ];
```

受入ゲートに足すもの（既存テストと同じ流儀）:

- steps の slug はすべて公開記事であり、redirect 元でないこと
- asset を持つ step の見出しが記事本文に実在すること（practical-resources と同じ検査）
- 公開記事はいずれかのジャーニーに1回以上現れること（orphan 検査のジャーニー版）

## 実装しない理由（今回）

Home の主要導線と記事末尾の導線を差し替える変更で、サイトの見え方が変わる。データはこの文書で確定できるが、
どの記事をどのジャーニーの「最初」に置くかは編集判断なので Owner の確認を先に取る。

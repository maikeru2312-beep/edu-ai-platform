# 第6回審査 — 検証記録

`00-current-state.md`（着手時点の実測）に対する、完了時点の実測。

- 計測日: 2026-08-22
- Base HEAD: `1488efb016597aa8dc210478b039276153a41448`

---

## 1. 記事セット

| | 着手時 | 完了時 |
|---|---|---|
| 記事ファイル総数 | 30 | 30（削除していない） |
| 公開（canonical） | 21 | **15** |
| 未公開 | 9 | 15 |
| 本文の総バイト数（公開分） | 568,424 | **407,397（72%）** |

**記事数を増やしていない。** 統合5件・退役1件で6件減り、本文量も28%減った。
残した15本は、削減の一方で記入様式・判定表・架空例が増えているため、
1本あたりの密度は上がっている。

### canonical 15本と、その所有資産

| slug | 独自価値の種別 | 所有する資産 |
|---|---|---|
| `ai-koomu-kaizen-nyumon` | OPERATOR_DECISION_RULE | 校務で生成AIを使う前の判断シート（止まったゲートと再検討条件の欄つき） |
| `chatgpt-tsuchihyo-shoken` | DECISION_MATRIX | 所見AI利用メモ（誰に使うかの判定表＋入力前／提出前チェック） |
| `ai-class-newsletter-prompt` | WORKED_EXAMPLE | AI下書き前シート＋配布前チェックリスト＋原資料照合表 |
| `education-ai-service-checklist-before-use` | WORKSHEET_FORM | AIサービス一次判定シート（21行・3値判定） |
| `free-ict-tools-safety-checklist` | OPERATOR_DECISION_RULE | 外部ICTサービス利用前確認シート（Gate 1〜5・HOLDの期限と代替） |
| `google-forms-school-use-guide` | PROCEDURE_GUIDE | Googleフォーム配布前設計シート（17項目3列） |
| `giga-device-lesson-use-guide` | OPERATOR_DECISION_RULE | 授業前チェック表＋切り上げ基準＋状況別トラブル対応表＋授業後チェック表 |
| `digital-textbook-introduction-school-changes` | PROCEDURE_GUIDE | 初めての単元でデジタル教科書を使う記録シート（4段階＋選択理由） |
| `special-needs-ict-support-tools-checklist` | ORIGINAL_SYNTHESIS_WITH_DECISION_LOGIC | 試用の条件と確認シート＋4値判定表＋架空の適用例 |
| `special-needs-ict-reasonable-accommodation` | DECISION_MATRIX | 評価場面で使ってよいかの仕分け表 |
| `special-needs-visual-schedule-support` | PROCEDURE_GUIDE | 視覚支援の見直し記録シート（9欄） |
| `special-needs-behavior-record-guide` | OPERATOR_DECISION_RULE | ABC行動記録シート（6列）＋架空記入例＋解釈の打ち切り線 |
| `special-needs-parent-collaboration` | OPERATOR_DECISION_RULE | 面談1回分の記録シート（11項目＋保留事項8列追跡表） |
| `individual-education-plan-writing-guide` | OPERATOR_DECISION_RULE | 共有・引継ぎ前の確認チェックリスト（5区分14項目） |
| `reasonable-accommodation-school-record` | WORKSHEET_FORM | 配慮記録の書き換え表（6欄＋3類型＋架空記入例） |

`OFFICIAL_SOURCE_SUMMARY` は **0件**。着手時の独立プロファイリングでは
`education-ai-service-checklist-before-use` / `special-needs-ict-support-tools-checklist` /
`digital-textbook-introduction-school-changes` / `reasonable-accommodation-school-record` の
4件がこれに該当していた。

---

## 2. distinctness matrix

canonical 15本の全105ペアを、**修復前と修復後の2回**分類した。
修復後は、修復前の分類や所有者の割り当てを渡さず、実ファイルから再判定させている。

| | 修復前（`02-distinctness-matrix-initial.csv`） | 修復後（`02-distinctness-matrix.csv`） |
|---|---|---|
| DISTINCT | 38 | **57** |
| RELATED_BUT_DISTINCT | 30 | **48** |
| OVERLAP_REQUIRES_REPAIR | **37** | **0** |
| MERGE | 0 | **0** |

修復前の37件は7つの共有ブロックに集中していた。ブロックごとに所有者を1本へ確定し、
失う側は本文から削除して1行の委譲リンクへ置き換えた。

| # | 共有ブロック | 所有者 |
|---|---|---|
| 1 | 匿名加工情報・仮名加工情報の法的整理と入力可否 | `ai-koomu-kaizen-nyumon` の校務ゲート2 |
| 2 | ICT支援ツールの目的別分類 | `special-needs-ict-support-tools-checklist` |
| 3 | 支援ツールの導入前チェックリスト | `special-needs-ict-support-tools-checklist` |
| 4 | 個人情報・共有範囲・保管・廃棄 | `individual-education-plan-writing-guide` |
| 5 | 外部サービスの確認経路・年齢・回収削除 | `free-ict-tools-safety-checklist`（規約の見どころ一覧のみ `education-ai-service-checklist-before-use`） |
| 6 | 校内の相談ラダー | 特支系 `special-needs-behavior-record-guide` ／ AI・ICTサービス系 `free-ict-tools-safety-checklist` |
| 7 | 授業前の実機確認と端末トラブル | `giga-device-lesson-use-guide` |

再判定で残った3件（配慮記録の欄立て／観察事実で書く基準／校内の相談ラダー）も
指摘どおり片寄せして 0 にした。

---

## 3. 鋳型（テンプレート感）

15記事を横断した実測。

| 指標 | 着手時 | 完了時 |
|---|---|---|
| `## はじめに` で始まる記事 | 7 / 15 | **0 / 15** |
| `## まとめ` で終わる記事 | 10 / 15 | **0 / 15** |
| `## 1.` 〜 `## N.` の連番見出し | 6 / 15 | **0 / 15** |
| 「Nつのポイント」「N選」式の見出し | — | **0** |

共通で維持しているのは、安全・法務上の注意書きと参考資料の扱いだけ。
本文の見出しは各記事の読者ジョブを名指しする構成へ置き換えた。

---

## 4. 内部リンクと IA

| 検査 | 結果 |
|---|---|
| 公開記事 → 未公開・不存在の記事へのリンク | **0** |
| 自己リンク | **0** |
| 公開記事 → redirect 元へのリンク（301 経由） | **0** |
| orphan（被リンク0）の canonical 記事 | **0** |
| 関連記事リスト内の重複ターゲット | **0** |
| 旧タイトルを引用したままのリンク文言 | **0**（24箇所を修正） |
| sitemap の内容 | 公開15記事＋実在カテゴリ4＋固定6ページのみ |
| `/db` `/news` `/news/[slug]` | 404（sitemap・ナビ・内部リンク・AdSense のいずれにも無し） |
| 退役 `information-morals-education-themes` | 404（fake redirect なし） |
| middleware の redirect | 10件すべて 1ホップで公開記事へ 200 着地 |

### redirect の実測（`npm run start` に対する HTTP 応答）

| 旧 slug | 応答 | 着地 |
|---|---|---|
| `tokubetsu-shien-ict` | 301 | `/articles/special-needs-ict-support-tools-checklist` → 200 |
| `ict-teaching-tools-selection-guide` | 301 | 同上 → 200 |
| `ai-lesson-preparation-prompt` | 301 | `/articles/ai-koomu-kaizen-nyumon` → 200 |
| `school-generative-ai-privacy-security` | 301 | 同上 → 200 |
| `generative-ai-guideline-v2-school-reading` | 301 | 同上 → 200 |

---

## 5. 検証ハーネス

### 実行結果

> 本節の数値は、クロージャ時点の HEAD `5d60c334` で再実測した値へ更新済み。
> 以前この表は「30 pass（既存12 + 新規18）」と記載していたが、これは
> 本書を書いた時点の値であり、その後の closure commit（`5d60c33`）で
> 受入ゲートを1件追加したため陳腐化していた。文章を合わせるのではなく再実測で確定した。

| コマンド | 結果 |
|---|---|
| `npm test` | **31 pass / 0 fail**（既存12 + 新規19） |
| `npm run test:mutation` | **10 / 10 検出、作業ツリー完全復元** |
| `npm run validate` | 通過（記事30件 + DB 4ファイル11件） |
| `npm run typecheck` | 通過 |
| `npm run lint` | 警告のみ（worktree に lockfile が重複することによる workspace root 警告。既存・本件と無関係） |
| `npm run build` | 成功。静的33ページ、記事15ルート、カテゴリ4ルート、middleware 34.8 kB |

### 既存ハーネスの不具合を1件修正

内部リンク抽出の正規表現 `(?:[)#?][^)]*)?` が、文字クラスに `)` を含むために
1つのリンクから次の `)` までを飲み込み、その間のリンクを取りこぼしていた。

実測: `special-needs-ict-support-tools-checklist` 1記事で、
最長 **3,028文字** を1マッチとして消費し、**12リンク中6リンク**（distinct 9→5）を見落としていた。

`(?:[#?][^)]*)?` に修正。これにより、既存の
「published articles do not link to unpublished or missing articles」を含む
リンク系テストの検出漏れも解消された。修正後も既存12テストは全て通る。

この不具合は第5回以前から存在していたもので、本件の変更が原因ではない。

---

## 6. 目視確認（`npm run start` / localhost:3000）

| 対象 | 結果 |
|---|---|
| homepage first viewport | 「特別支援教育と学校実務の判断を、現場で使える形に。」が h1。専門性が最初の画面で分かる |
| `<title>` | 教育DXナビ \| 特別支援教育と学校実務の判断ガイド |
| 記事カード | 15本それぞれが別の読者ジョブと固有の資産を名乗っており、同じ generic な SEO タイトルには見えない |
| 記事一覧 | 扱う範囲の説明＋「記事数を増やすことは目的にしていません」を明示 |
| カテゴリページ（4件） | カテゴリ別の具体的な説明＋「いずれも特別支援教育を含む学校実務での判断を扱う区分です」 |
| About / Operator | 3軸に整理。空カテゴリを主要テーマに掲げていない。最終更新日を 2026-08-22 に更新 |
| 記事本文（8本を抽出確認） | 素の Markdown 記法の残存 0、表が5〜8個ずつ正常描画、`**` の取りこぼし 0 |
| 図解 | 5コンポーネントすべてが使用中（統合で未参照になった `privacy-check-flow` は校務ゲート2へ移設） |
| モバイル（375×812） | homepage・記事詳細ともに横スクロール無し。表は 343px 内に収まる |
| デスクトップ | 崩れなし。console エラー 0 |

### 目視確認の限界

- ブラウザペインが表示されていないためスクリーンショットは取得できず、
  レンダリング済み HTML・テキスト・レイアウト計測（`getBoundingClientRect`）で確認した。
- AdSense の実配信は、この環境に `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT` が設定されておらず
  コンポーネントが `null` を返すため、**実行時には検証していない**。
  配信範囲は静的なゲート（`<AdSenseScript />` が記事詳細以外の11ページに存在しないこと）で担保している。

---

## 7. 実務経験・主張の安全性

| 検査 | 結果 |
|---|---|
| 実務経験注記の総数 | 11（すべて公開記事。統合で未公開になった4件の注記は削除） |
| 経験C（SOURCE_ONLY）の記事 | 4（`digital-textbook` / `ai-class-newsletter` / `free-ict-tools` / `google-forms`）。注記なし |
| registry の `firsthand_boundary` と注記の有無の一致 | 機械チェックで固定 |
| 経験範囲の拡張 | **なし**（`lib/article-experience-notes.ts` の文面は1件も変更していない） |
| 効果の未立証な主張（○時間削減・○%改善） | **0**（機械チェックを追加） |
| 架空例 | すべて「架空」と明示 |

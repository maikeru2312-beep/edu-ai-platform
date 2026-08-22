# 第6回審査 — 着手時点の現状記録（機械確認）

本書は実装前に **実測した** リポジトリ状態の記録である。`docs/adsense/` 配下の第3〜4回監査文書は
当時のスナップショットであり、本書はそれを引き継がず、着手時点で再計測した値のみを記載する。

- 計測日: 2026-08-22
- Repository: `C:\Project\web\edu-dx-navi`（worktree: `.claude/worktrees/adsense-sixth-review-original-value-e14484`）
- Remote: `https://github.com/maikeru2312-beep/edu-ai-platform.git`
- Base HEAD: `1488efb016597aa8dc210478b039276153a41448`
- Branch: `claude/adsense-sixth-review-original-value-e14484`（clean な main から分岐、worktree 上）
- Working tree: 着手時 clean（`git status --short` / `git diff HEAD` / 未追跡ファイル いずれも空）

> 指示書の推奨 branch 名は `fix/adsense-sixth-review-original-value` だが、本作業は
> 既に clean な main（`1488efb`）から分岐済みの worktree branch
> `claude/adsense-sixth-review-original-value-e14484` 上で行う。分岐元・remote・作業内容は
> 指示書の要件と一致しており、branch 名のみが異なる。

---

## 1. 記事の実測

`content/articles/*.md` = **30 ファイル**、うち `published: false` が **9 件**、公開 **21 件**。

### 公開 21 件（着手時点）

| # | slug | category | 判断（本件） |
|---|---|---|---|
| 1 | `special-needs-behavior-record-guide` | 特別支援教育 | KEEP |
| 2 | `special-needs-parent-collaboration` | 特別支援教育 | KEEP |
| 3 | `individual-education-plan-writing-guide` | 特別支援教育 | KEEP |
| 4 | `reasonable-accommodation-school-record` | 特別支援教育 | KEEP |
| 5 | `special-needs-visual-schedule-support` | 特別支援教育 | KEEP |
| 6 | `special-needs-ict-reasonable-accommodation` | 特別支援教育 | KEEP |
| 7 | `ai-koomu-kaizen-nyumon` | AI校務改善 | KEEP（merge 先） |
| 8 | `free-ict-tools-safety-checklist` | 教材・支援ツール | KEEP |
| 9 | `chatgpt-tsuchihyo-shoken` | AI校務改善 | KEEP |
| 10 | `ai-class-newsletter-prompt` | AI校務改善 | KEEP |
| 11 | `google-forms-school-use-guide` | ICT活用 | KEEP |
| 12 | `digital-textbook-introduction-school-changes` | ICT活用 | REPAIR_SUBSTANTIAL |
| 13 | `education-ai-service-checklist-before-use` | 教材・支援ツール | REPAIR_SUBSTANTIAL |
| 14 | `special-needs-ict-support-tools-checklist` | 教材・支援ツール | REPAIR_SUBSTANTIAL（merge 先） |
| 15 | `giga-device-lesson-use-guide` | ICT活用 | REPAIR_SUBSTANTIAL |
| 16 | `generative-ai-guideline-v2-school-reading` | AI校務改善 | MERGE → 7 |
| 17 | `school-generative-ai-privacy-security` | AI校務改善 | MERGE → 7 |
| 18 | `ai-lesson-preparation-prompt` | AI校務改善 | MERGE → 7 |
| 19 | `ict-teaching-tools-selection-guide` | 教材・支援ツール | MERGE → 14 |
| 20 | `tokubetsu-shien-ict` | 特別支援教育 | MERGE → 14 |
| 21 | `information-morals-education-themes` | ICT活用 | RETIRE / noindex |

**指示書の disposition はリポジトリ実測と完全に整合する。** 11 KEEP + 4 REPAIR + 5 MERGE + 1 RETIRE = 21。
処理後の canonical は 11 + 4 = **15 件**で、指示書 §9 の目標と一致する。`OWNER_DECISION_REQUIRED` は生じていない。

### 既に非公開の 9 件（本件では触れない）

`chatgpt-teacher-beginner-guide` / `education-grant-search-guide` / `generative-ai-school-training-guide` /
`giga-school-device-troubleshooting` / `joseikin-guide-2025` / `kyoiku-dx-kiso` /
`microsoft-copilot-teacher-guide` / `school-training-ict-ai-guide` / `tablet-ict-jugyo-giga`

---

## 2. カテゴリ

`lib/categories.ts` は 6 カテゴリを定義するが、公開記事が存在するのは **4 つ**のみ。

| カテゴリ | 公開記事数（着手時） | 処理後 | 差分の理由 |
|---|---|---|---|
| 特別支援教育 | 7 | **6** | `tokubetsu-shien-ict` を統合 |
| AI校務改善 | 6 | **3** | 3件を `ai-koomu-kaizen-nyumon` へ統合 |
| ICT活用 | 4 | **3** | `information-morals-education-themes` を退役 |
| 教材・支援ツール | 4 | **3** | `ict-teaching-tools-selection-guide` を統合 |
| 助成金・補助金 | **0** | 0 | 該当記事はすべて既に非公開 |
| 研修・セミナー | **0** | 0 | 該当記事はすべて既に非公開 |
| 合計 | 21 | **15** | |

空カテゴリは既に安全に処理されている（後述 §5）。カテゴリ数は本件で増やさない。

処理後は **特別支援教育が 6/15（40%）で最大クラスタ**となり、残る3カテゴリが各3件で均衡する。
これは §6 で述べる新しいポジショニング（特別支援教育を専門軸に据える）と構造的に一致する。
現状は AI校務改善が 6 件で最大であり、サイトが「生成AI情報サイト」に見える一因になっている。

---

## 3. リダイレクト（`middleware.ts`）

着手時点で 5 件。すべて 1 ホップで公開記事に着地する。

| 旧 slug | → | 着地 |
|---|---|---|
| `chatgpt-teacher-beginner-guide` | → | `ai-koomu-kaizen-nyumon` |
| `giga-school-device-troubleshooting` | → | `giga-device-lesson-use-guide` |
| `kyoiku-dx-kiso` | → | `giga-device-lesson-use-guide` |
| `microsoft-copilot-teacher-guide` | → | `education-ai-service-checklist-before-use` |
| `tablet-ict-jugyo-giga` | → | `giga-device-lesson-use-guide` |

`matcher: '/articles/:slug'`、`NextResponse.redirect(..., 301)`。本件で 5 件を追加し計 10 件になる。

---

## 4. `/db` と `/news`

**復活していない。指示どおり削除済み状態を維持する。**

- `app/db/page.tsx`, `app/news/page.tsx`, `app/news/[slug]/page.tsx` はいずれも `notFound()` のみを返す
  stub（`robots:` メタは持たない — 404 の noindex 方針は `app/not-found.tsx` に一本化されている）
- `app/sitemap.ts` に `/db` `/news` は含まれない
- Header / Footer / homepage に `/db` `/news` へのリンクなし
- `AdSenseScript` は記事詳細でのみ描画されるため、これらの stub には配信されない
- `content/db/*.json`（11 件）と `content/news-digests/` はデータとして残るが、`lib/db.ts` / `lib/news.ts`
  経由で描画されるページが存在しないため、公開面には出ない

これらは `scripts/adsense-audit.test.mjs` の既存テスト2件で機械的に固定されている。

---

## 5. 情報アーキテクチャの既存実装

| 対象 | 実装 | 評価 |
|---|---|---|
| sitemap | `getAllArticles()`（公開のみ）＋ 記事が存在するカテゴリのみ | 良好。退役記事は自動的に落ちる |
| category page | 記事0件なら `notFound()` かつ `generateStaticParams` から除外 | 良好。空カテゴリの薄いページが生成されない |
| Header / Footer / homepage / 記事一覧 | いずれも `activeCategories` で絞り込み | 良好 |
| 記事詳細 | `getPublishedArticleSlugs()` で静的生成、`getArticle()` は未公開で throw → `notFound()` | 良好 |
| AdSense | `app/articles/[slug]/page.tsx` でのみ `<AdSenseScript />`。`app/layout.tsx` には無し | 良好 |
| canonical / OG | 各ページで `alternates.canonical` 設定済み | 良好 |
| 構造化データ | **未実装**（JSON-LD なし） | 本件の必須要件ではない |
| breadcrumb | 記事詳細・カテゴリページに視覚的パンくずあり（マークアップのみ） | 可 |

**結論: IA の配管はすでに健全である。** 第6回の問題は配管ではなく、サイトの自己定義と記事の役割分担にある。

---

## 6. サイトレベルのポジショニング（本件の主要因）

「情報を収集・整理して届ける aggregator」という自己定義が 3 箇所に残っている。

| ファイル | 行 | 現在の文言 |
|---|---|---|
| `app/page.tsx` | 40 | 「最新情報を**収集・整理**してお届けします。」（hero） |
| `components/Footer.tsx` | 15–16 | 「…情報を**収集・整理**し、教育現場のDXを支援する個人運営の**情報メディア**です。」 |
| `components/Footer.tsx` | 63 | 「個人運営の**教育情報サイト**」 |
| `app/operator/page.tsx` | 21 | 「個人が運営する**教育情報サイト**です」 |

加えて、`app/layout.tsx` の `SITE_DESCRIPTION` と `app/about/page.tsx` の「扱うテーマ」が、
現行 canonical セットの実態と乖離している。

- About「扱うテーマ」6項目のうち **助成金・補助金** と **研修・セミナー** は公開記事が **0 件**
- About / layout の主題順は「ICT活用・校務効率化・生成AI活用・特別支援教育」で、
  実際の記事分布（特別支援教育が最大クラスタ）と主従が逆

`app/privacy/page.tsx:32` の「個人情報を収集しません」は Search Console に関する記述で、
ポジショニングとは無関係。**変更してはならない。**

---

## 7. 記事の重複（内部カニバリゼーションの実測）

見出し走査により、以下が機械的に確認できた。

### (a) 匿名化チェックリストが 4 記事に重複

| 記事 | 該当見出し |
|---|---|
| `ai-koomu-kaizen-nyumon` | `### Gate 2：何を入力するか` |
| `school-generative-ai-privacy-security` | `## 3. 個人情報を含めずにAIを使う方法`（匿名化／抽象化／架空／観点のみ） |
| `chatgpt-tsuchihyo-shoken` | `## 4. 安全な使い方：4つの原則`（匿名化／観点・事実／抽象化／最終判断） |
| `ai-lesson-preparation-prompt` | `### 入力してはいけない情報` |

### (b) 支援ツール分類が 3 記事に重複

| 記事 | 該当見出し |
|---|---|
| `special-needs-ict-support-tools-checklist` | `## 目的別のICT支援ツールの考え方`（見通し／AAC／読み書き／記録／感覚／教材準備） |
| `tokubetsu-shien-ict` | `## 2. 活用場面の分類`（意思表出／読み書き／見通し／感覚／教材提示／記録） |
| `ict-teaching-tools-selection-guide` | `## 特別支援教育での選び方`（読み書き／コミュニケーション／視覚的スケジュール／感覚） |

MERGE 対象 5 件はいずれもこの (a)(b) のどちらかに属する。**指示書の統合方針は実測された重複と一致する。**

---

## 8. 内部リンクの実測

公開記事間の `/articles/<slug>` リンクは **153 箇所**。統合・退役により **修復が必要なリンク元** は以下
（いずれも実測値。残存する 15 canonical からの被リンクのみを数え、統合元どうしのリンクは除外している）。

| 統合元 slug | 残存 canonical からの被リンク数 | 修復方針 |
|---|---|---|
| `school-generative-ai-privacy-security` | 11 記事 / 18 箇所 | → `ai-koomu-kaizen-nyumon` |
| `tokubetsu-shien-ict` | 9 記事 / 19 箇所 | → `special-needs-ict-support-tools-checklist` |
| `ict-teaching-tools-selection-guide` | 4 記事 / 5 箇所 | → `special-needs-ict-support-tools-checklist`（一部は `free-ict-tools-safety-checklist`） |
| `ai-lesson-preparation-prompt` | 3 記事 / 4 箇所 | → `ai-koomu-kaizen-nyumon` |
| `generative-ai-guideline-v2-school-reading` | 3 記事 / 4 箇所 | → `ai-koomu-kaizen-nyumon` |
| `information-morals-education-themes` | **0 件** | 修復不要（退役が安全） |

注意すべき副作用が 2 つある。

1. **自己リンク化**: `ai-koomu-kaizen-nyumon` は自身の統合元 3 件すべてにリンクしており（L42 / L78 / L193）、
   `special-needs-ict-support-tools-checklist` は `tokubetsu-shien-ict` にリンクしている（L72 / L242）。
   URL を機械置換すると自己リンクになり、既存テスト
   `published articles do not link to themselves` が FAIL する。文ごと書き替える必要がある。
2. **リンク文言の約束**: 例えば `google-forms-school-use-guide:19` は
   「要配慮個人情報の定義など個人情報の枠組み → （統合元）」と書いている。
   統合先に要配慮個人情報の定義が残らなければリンクの約束が破れる。
   URL 差し替えではなく **意味的修復**（アンカーテキストと文脈の書き替え）が必須。

---

## 9. 一次資料・実務経験の管理状態

- `lib/article-references.ts`（360行）: 記事ごとに一次資料を保持。`title / publisher /
  publishedOrUpdatedAt / url / checkedAt / supports` を持ち、確認日を資料群ごとに分離管理している。
- `lib/article-experience-notes.ts`: 運営者の **確認済み実務経験** を記事別に保持。
  `scope: 'A'`（実際に担当）/ `'B'`（見聞・支援）。経験C（資料でのみ確認）の記事には注記を置かない。
  注記なし＝経験を主張しない、という運用。

**本件はこの境界を一切広げない。** 統合により A 記事の内容が B 記事へ移る場合でも、
移動するのは判断手順・様式・架空例であり、経験の主張は移さない。
`digital-textbook-introduction-school-changes` は経験C であり、REPAIR でも一人称の実務主張を追加しない。

---

## 10. 既存の検証ハーネス（着手時点で全て緑）

`package.json` scripts:

| script | 内容 |
|---|---|
| `test` | `node --test scripts/adsense-audit.test.mjs` |
| `validate` | `node scripts/validate.mjs`（frontmatter / DB JSON） |
| `audit` | `npm test && npm run validate` |
| `lint` | `next lint` |
| `typecheck` | `tsc --noEmit` |
| `build` | `next build` |

`scripts/adsense-audit.test.mjs` の既存 12 テスト（すべて維持・強化対象。削除しない）:

1. 既定の audit が 2026-07 スナップショットではなく現状を判定する
2. AdSense は記事詳細でのみ読み込まれる
3. `/db` `/news` が主要ナビ・homepage にリンクされない
4. 404 の noindex 方針が一箇所に限定される
5. sitemap と一覧が共通の公開記事リーダーを使う
6. 公開記事が未公開・不存在の記事へリンクしない
7. 公開記事が自己リンクしない
8. 審査対象が意図的に絞られている（**30 ファイル / 21 公開 / 空カテゴリ2つ** を固定）
9. MERGE の 301 先が exact で 1 ホップ、UNPUBLISH は 301 を持たない
10. 全公開記事が記事固有の参考資料を持つ
11. 公開記事に読者から見える literal `**` が残っていない
12. 実務経験注記が確認済み経験と一致する（経験C は除外）

**テスト 8・9・12 は本件の disposition 変更により更新が必要になる。**
これは「テストを通すための削除」ではなく、審査対象セットの意図的変更を反映するものであり、
それぞれ **より強い不変条件へ差し替える**（§7 の受入ゲートで担保）。

### 着手時ベースライン実行結果

```
npm test       12 pass / 0 fail
npm run validate  ✅ 記事30件 + DB 4ファイル11件 すべて通過
npm run typecheck exit 0
npm run lint      warning のみ（worktree に lockfile が重複することによる workspace root 警告。既存）
npm run build     成功。記事21ルート / カテゴリ4ルート / middleware 34.6 kB
```

`npm run lint` の警告は worktree 固有（親リポジトリと worktree の両方に `package-lock.json` と
`.eslintrc.json` が存在するため）であり、本件の変更に起因するものではない。

---

## 11. 本件で触れないもの

- `content/db/*.json`, `content/news-digests/`, `content/templates/`（公開面に出ない）
- `docs/adsense/` の第3〜4回監査文書（履歴として保存。本件は `docs/adsense-sixth-review/` に記録）
- `docs/news/`, `docs/sns/`, `operations/`, `planning/`（公開面に出ない）
- `scripts/content-audit.mjs`, `scripts/phase2-audit-data.mjs`（履歴用。テスト1が用途を固定している）
- `app/privacy/page.tsx` の Search Console 記述
- 既に非公開の 9 記事

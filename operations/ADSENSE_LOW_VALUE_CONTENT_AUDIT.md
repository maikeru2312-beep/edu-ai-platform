# AdSense「有用性の低いコンテンツ」判定 監査レポート

- **監査日**: 2026-07-08
- **担当**: Policy Auditor（AdSense再審査チーム）
- **対象サイト**: 教育DXナビ（https://edu-ai-platform-delta.vercel.app）
- **対象リポジトリ**: C:\Project\web\edu-dx-navi（branch: feature/digital-products 時点のローカル実装）

---

## 1. 監査範囲

| 区分 | 対象 | 確認方法 |
|---|---|---|
| 技術実装 | `app/sitemap.ts` / `app/robots.ts` / `app/layout.tsx` / `app/not-found.tsx` / `lib/site.ts` | ローカルコード全読 |
| ページ | `app/page.tsx`（トップ）、`app/db/page.tsx`、`app/news/page.tsx`、`app/news/[slug]/page.tsx`、`app/articles/page.tsx`、`app/articles/[slug]/page.tsx`、`app/categories/[category]/page.tsx`、`app/about`、`app/operator`、`app/privacy`、`app/disclaimer`、`app/contact` | ローカルコード全読 |
| コンテンツ | `content/articles/*.md`（30本）— 全記事のfrontmatter・見出し構成・文字数、本文は5本サンプリング。`content/db/*.json`（4ファイル）、`content/news-digests/*.md`（1本） | ローカル確認 |
| 公開サイト | トップ、`/db`、`/news`、`/contact`、記事1本（`/articles/kyoiku-dx-kiso`）、`sitemap.xml`、`robots.txt` | WebFetch / curl で取得成功。**公開サイトの確認は実施できた** |

補足: 記事本文の全文精読は行わず、見出し構成の全件比較＋本文冒頭のサンプリング（5本）＋定型フレーズの機械的カウントで構成類似性を評価した。

---

## 2. 総評

サイトの技術的な土台（robots / canonical / メタデータ / 内部リンク / ポリシーページ）はよく整備されており、「技術ミスでnoindexになっている」類の単純な原因ではない。記事も1本あたり11,000〜45,000文字と分量は十分で、いわゆる「数百文字の薄い記事」でもない。

低価値判定の主因は、**(1) 30記事中28本が12日間（2026-06-16〜06-27）に集中公開された量産パターン、(2) 全記事がほぼ同一のテンプレート構成・定型フレーズで書かれておりAI量産サイトのシグナルが強いこと、(3) 著者が架空キャラクターのみで実在の著者性・一次体験の裏付けがゼロであること、(4) 「教育情報DB」「ニュースまとめ」というサイトの2本柱が実質11件のリンク集と1本のダイジェストしかなく、看板倒れになっていること**、の複合と判断する。

加えて、**公開サイトの sitemap.xml がローカル実装より古く、`/db`・`/news` を含まない古いビルドが配信されている**（ステイル・デプロイ）ことを確認した。再審査前に最新ビルドの再デプロイが必須。

---

## 3. 分類別の所見

### 3.1 薄いページ（thin content）— 該当度: **高**

**根拠**:
- `/db`（`app/db/page.tsx`）: 「教育情報DB」を名乗るが、実データは `content/db/grants.json`(3件)・`ict-tools.json`(3件)・`laws.json`(3件)・`training.json`(2件) の**合計11件**のみ。公開サイトでも「全 11 件」と表示されることを確認。検索・絞り込み・詳細ページはなく、カード（タイトル＋2〜3行の説明＋外部リンク）が並ぶだけ。トップページのヒーローCTAとsitemap（priority 0.8）で主要ページ扱いされており、期待値と実体の落差が大きい。
- `/news`（`app/news/page.tsx`）: ニュースダイジェストは `content/news-digests/2026-06-20-education-dx-official-news.md` の**1本のみ**。「ニュースまとめ」というセクションを立てるには量が不足。
- カテゴリページ: 記事分布は AI校務改善8 / ICT活用7 / 特別支援教育7 / 教材・支援ツール4 / **助成金・補助金2 / 研修・セミナー2**。`/categories/joseikin` と `/categories/kenshu` は2件しかないアーカイブページで、6カテゴリ構成に対して中身が追いついていない。
- 一方、**記事単体は薄くない**（最小 `kyoiku-dx-kiso.md` 約11,400字、最大 `special-needs-visual-schedule-support.md` 約45,000字）。thin判定の主対象は記事ではなくDB/news/小カテゴリ。

**推奨対策**:
- `/db` はデータを最低50〜100件規模に拡充するか、拡充まで一時的にナビゲーション・sitemapから外す（トップの主要CTAから降格）。
- `/news` はダイジェストを月次で3本以上蓄積するまで sitemap priority を下げ、トップでの露出を控える。
- 2件しかないカテゴリは記事を各5本以上に補強するか、当面「教材・支援ツール」等へ統合。

### 3.2 外部情報のまとめ・独自価値不足 — 該当度: **中〜高**

**根拠**:
- DBアイテムの `source` が組織トップページ（`https://www.mext.go.jp/`、`https://www.nippon-foundation.or.jp/`、`https://elaws.e-gov.go.jp/` 等）で、該当制度の一次情報へ直接届かない。独自の調査データ・比較表・更新監視などの付加価値がない。
- ニュースダイジェスト（`2026-06-20-education-dx-official-news.md`）の要約文に「〜とされています」「〜含まれているとみられます」（laws 33〜37行目）という伝聞表現があり、**一次資料を精読せずに書いた印象**を与える。独自コメント（千冬先生メモ）も「〜かもしれません」調の一般論にとどまる。
- 記事本文（サンプリング5本: `ai-koomu-kaizen-nyumon.md`、`chatgpt-teacher-beginner-guide.md`、`giga-device-lesson-use-guide.md`、`special-needs-parent-collaboration.md`、`kyoiku-dx-kiso.md`）は整理として丁寧だが、内容は文科省ガイドライン等の公開情報＋一般論の再構成が中心。**実際の学級・校務での実施記録、Before/Afterの実データ、スクリーンショット、失敗の実体験**といった「このサイトでしか読めない情報」がない。
- 全30記事で本文中の画像が**0枚**（`![` を含む記事なし）。図表・実物画面がなくテキストのみで、独自制作物の証跡が弱い。

**推奨対策**:
- DBの `source` を制度・ツールの個別ページURLに差し替え、「最終確認日」「申請期限」等の独自メンテ項目を付加する。
- 記事の上位10本に、実際の操作画面（個人情報を含まないもの）・自作ワークシート・実施手順の写真/図解を追加する。
- 「実践してみた」系の一次体験パート（所要時間、つまずいた点、修正した点）を主要記事に追記する。

### 3.3 量産記事構造（似た構成・テンプレ的文章）— 該当度: **高**（最重要因子）

**根拠**:
- **公開日の集中**: 30記事中28本の `publishedAt` が 2026-06-16〜2026-06-27 の12日間に集中。git履歴でも 06-17 に5本以上、06-19 に7本以上のコミットがあり、短期大量公開のパターンがGoogle側から量産サイトと見えやすい。
- **テンプレ構成の反復**: 全記事が「はじめに → 番号付き見出し（1.〜10.前後）→ チェックリスト → よくある失敗 → 関連記事 → まとめ」のほぼ同一骨格。30本中**29本に「関連記事」見出し**、**11本に「〜チェックリスト」見出し**、多数に「よくある失敗」見出しが存在する。
- **定型フレーズの反復**: 「所属校・教育委員会（のガイドライン・方針を確認）」が**30本中28本**に出現。「個別の…判断を代行するものではありません」の免責文が9本で同文リピート。frontmatter の `description` は30本ほぼ全てが「〜を教員向けに（わかりやすく）解説します」という同一構文で終わる（例: `ai-class-newsletter-prompt.md`、`google-forms-school-use-guide.md`、`special-needs-visual-schedule-support.md` ほか）。
- **AI生成の明示と社内実装**: `app/about/page.tsx` に「コンテンツの一部はAIを補助ツールとして作成」と明記。リポジトリには `content_engine/`（コミット「教育DXナビ 投稿運用の半自動化一式」）が存在し、実際に半自動生成運用である。開示自体は誠実だが、出力側のテンプレ均質性が解消されない限り低価値判定の主因になり続ける。
- **日付の整合性**: `joseikin-guide-2025.md`（publishedAt: 2025-04-15）、`tokubetsu-shien-ict.md`（2025-05-20）、`ai-koomu-kaizen-nyumon.md`（2025-06-10）は2025年公開表記だが、git履歴上コンテンツ一式は2026年6月に追加されており、公開日の後付け（バックデート）と受け取られるリスクがある。

**推奨対策**（優先度最上位）:
1. 新規量産を止め、既存記事の**統合・リライト**に切り替える。内容が重複する記事群（例: `school-generative-ai-privacy-security.md` / `education-ai-service-checklist-before-use.md` / `generative-ai-guideline-v2-school-reading.md` のAI安全系3本、`school-training-ict-ai-guide.md` / `generative-ai-school-training-guide.md` の研修系2本、`ict-teaching-tools-selection-guide.md` / `free-ict-tools-safety-checklist.md` / `special-needs-ict-support-tools-checklist.md` のツール選定系3本）は統合候補。
2. 見出し骨格・免責文・description構文を記事ごとに書き分ける（免責は共通コンポーネント化して本文から分離するのも可）。
3. 公開日は実態に合わせ、更新時は「何を更新したか」を本文に明記する。

### 3.4 著者性・E-E-A-T不足 — 該当度: **高**

**根拠**:
- 記事ページ（`app/articles/[slug]/page.tsx`）に表示される書き手情報は `ChifuyuProfileCard`（架空の編集キャラクター「千冬先生＠教育DX」）のみ。キャラクターである旨は誠実に開示されているが（`app/about/page.tsx` 54〜59行、`components/ChifuyuProfileCard.tsx` 79〜81行）、**実在の著者・監修者・経歴の裏付けがゼロ**。
- `app/operator/page.tsx` は「教育現場での実務経験を持つ個人」とするのみで匿名（プライバシー上の理由は明記されており妥当だが、E-E-A-T シグナルとしては弱い）。
- **構造化データが皆無**: `app`/`components`/`lib` に `application/ld+json` の出力が存在しない。Article / Person / Organization / BreadcrumbList いずれも未実装で、著者・発行者情報が機械可読になっていない。
- 特別支援教育・助成金という **YMYL隣接領域**（障害のある子どもへの支援、公的制度・金銭）を扱っているため、著者性の要求水準が通常より高い。

**推奨対策**:
- 実名でなくてよいので、**一貫したペンネーム＋具体的な経歴**（校種・担当領域・経験年数・保有資格の種別）を運営者ページに記載し、各記事に「執筆・編集: ○○（経歴リンク）」を表示する。架空キャラは「案内役」に限定し「著者」とは区別する。
- Article（author/publisher/datePublished/dateModified）+ BreadcrumbList の JSON-LD を実装する。
- 参考文献セクションで文科省資料等の**個別文書URL**を明記する。

### 3.5 ナビゲーション・導線不足 — 該当度: **低**

**根拠**:
- Header / Footer / パンくず（記事・カテゴリ・news全てに実装）/ 関連記事（`getArticlesByCategory` による自動3件 + 本文末の手書きリンク）/ カテゴリ横断リンク（`app/categories/[category]/page.tsx` 68〜78行）/ 404ページの復帰導線（`app/not-found.tsx`）まで整備済み。公開サイトでもフッターにポリシー4ページへのリンクを確認。
- お問い合わせは公開サイトでGoogleフォームへのボタンが機能していることを確認（`NEXT_PUBLIC_CONTACT_FORM_URL` 設定済み）。
- 軽微な問題のみ: (a) 記事本文末の「関連記事」がMarkdown手書きでリンク切れ管理がない、(b) タグは表示のみでタグページが存在しない（`app/articles/[slug]/page.tsx` 89〜95行）、(c) サイト内検索がない、(d) `app/contact/page.tsx` 46〜48行のフォーム未設定時フォールバック文言が「記事のコメント欄等をご利用ください」だがコメント欄は存在しない（現在は非表示分岐のため実害なし）。

**推奨対策**: 優先度低。記事数が増えたらサイト内検索とタグページを検討する程度でよい。

### 3.6 技術的問題（sitemap / noindex / canonical / 重複など）— 該当度: **中**

**根拠**:
- **【要対応】公開サイトの sitemap.xml が古い**: 公開中の `https://edu-ai-platform-delta.vercel.app/sitemap.xml` は43 URLで、`/db`・`/news`・`/news/2026-06-20-education-dx-official-news` を**含まない**。ローカルの `app/sitemap.ts` はこれらを含む（46 URL）ため、**ローカルより古いビルドが本番配信されている**。修正内容が審査に反映されない典型原因。
- noindex問題は**なし**: `app/layout.tsx` 43〜46行で `robots: { index: true, follow: true }`、公開ページのHTMLでも `content="index, follow"` と各ページの canonical 出力を確認（例: `/articles/kyoiku-dx-kiso`）。robots.txt も全許可＋sitemap参照で正常。
- canonical の軽微な漏れ: `app/db/page.tsx` の metadata に `alternates.canonical` がない（他の主要ページは設定済み）。
- **構造化データ未実装**（3.4に同じ、技術面としても不足）。
- AdSenseスクリプト（`ca-pub-3801092904087307`）が `app/layout.tsx` で**全ページ**（privacy / contact / 404含む）に出力される。Auto ads 使用時、ポリシーページや404など「パブリッシャーコンテンツのない画面」への広告表示リスクがある。
- 重複コンテンツ: URLレベルの重複はないが、3.3で挙げたテーマ重複（AI安全系3本・研修系2本・ツール選定系3本）が内容レベルの重複として作用しうる。

**推奨対策**:
- 最新コードを本番へ再デプロイし、sitemap.xml に `/db`・`/news` 系が入ることを確認、Search Console で再送信する。
- `app/db/page.tsx` に `alternates: { canonical: '/db' }` を追加する。
- JSON-LD（Article / BreadcrumbList / Organization）を実装する。
- ポリシーページ・404 では AdSense 広告が出ない設定（Auto adsのページ除外 or 条件付きスクリプト出力）を検討する。

---

## 4. 優先度付き改善提案

| 優先度 | 施策 | 対象 | 期待効果 |
|---|---|---|---|
| P0 | 最新ビルドの再デプロイ＋Search Consoleでsitemap再送信（公開sitemapに/db・/newsが無い問題の解消） | Vercel / `app/sitemap.ts` | 修正が審査に反映される前提条件 |
| P0 | 記事の統合・重複解消（AI安全系3本→1本、研修系2本→1本、ツール選定系3本→1〜2本目安）と、残す記事のテンプレ脱却リライト | `content/articles/*.md` | 量産シグナルの直接除去 |
| P1 | 著者情報の実体化（ペンネーム＋具体的経歴を`/operator`に、各記事に執筆者表記）。千冬先生は「案内役」に限定 | `app/operator/page.tsx`、記事テンプレート | E-E-A-T改善 |
| P1 | 主要10記事への一次体験・画像・図解・自作資料の追加 | `content/articles/*.md`、`public/images` | 独自価値の可視化 |
| P1 | JSON-LD（Article / BreadcrumbList / Organization）実装 | `app/articles/[slug]/page.tsx`、`app/layout.tsx` | 著者・発行者の機械可読化 |
| P2 | `/db` の拡充（50件以上）または一時降格（ナビ・トップCTA・sitemap priorityから外す） | `content/db/*.json`、`app/page.tsx`、`app/sitemap.ts` | thinページ解消 |
| P2 | `/news` ダイジェストの月次蓄積（3本以上になるまで露出抑制） | `content/news-digests/` | thinセクション解消 |
| P2 | 助成金・補助金／研修・セミナーカテゴリの補強（各5本以上）または統合 | `content/articles/`、`lib/categories.ts` | 空疎カテゴリ解消 |
| P3 | `/db` への canonical 追加、ポリシーページ・404でのAdSense非表示化、descriptionの構文書き分け | `app/db/page.tsx`、`app/layout.tsx` | 技術衛生 |
| P3 | DBのsourceを個別ページURL化＋「最終確認日」付与、公開日表記の実態整合 | `content/db/*.json`、frontmatter | 信頼性向上 |

---

## 5. 再審査前チェックリスト

- [ ] 最新ビルドが本番に反映され、`sitemap.xml` に `/db`・`/news`・ニュースダイジェストURLが含まれている
- [ ] Search Console で sitemap を再送信し、主要ページのインデックス状況を確認した
- [ ] テーマ重複記事の統合が完了し、統合元URLは301または明示的な誘導で処理した
- [ ] 全記事の description が同一構文（「〜を教員向けに解説します」）の反復になっていない
- [ ] 記事の見出し骨格が「はじめに→番号見出し→チェックリスト→よくある失敗→まとめ」の一律パターンから記事ごとに分化している
- [ ] 各記事に執筆者表記があり、`/operator` に具体的な経歴（校種・領域・経験年数）が記載されている（実名は不要）
- [ ] 主要記事の半数以上に画像・図解・自作資料など独自制作物が含まれている
- [ ] Article / BreadcrumbList の JSON-LD が記事ページで出力されている
- [ ] `/db` が「全11件」のまま主要導線に残っていない（拡充済み or 降格済み）
- [ ] `/news` が1本のみのまま sitemap priority 0.75 で残っていない
- [ ] `app/db/page.tsx` に canonical が設定されている
- [ ] ポリシーページ・404・お問い合わせで広告が表示されない（Auto ads除外設定 or スクリプト条件出力）
- [ ] 公開日（publishedAt）が実際の公開時期と整合している
- [ ] お問い合わせフォームが本番で機能している（確認済み: Googleフォームへのリンク動作）
- [ ] 再審査申請前に2〜4週間の更新実績（リライト・統合の updatedAt 反映）を作る

---

*本レポートは監査時点のローカルコードと公開サイトのスナップショットに基づく。公開サイトはWebFetch/curlで取得できたため、ローカル・本番の差分（sitemap不整合）も検証済み。*

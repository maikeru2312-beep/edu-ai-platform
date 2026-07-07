# AdSense再審査 準備完了レポート（Gatekeeper）

作成日: 2026-07-08
ブランチ: `feature/digital-products`
関連: [ADSENSE_LOW_VALUE_CONTENT_AUDIT.md](./ADSENSE_LOW_VALUE_CONTENT_AUDIT.md)

## 1. 今回の作業の目的

AdSense「有用性の低いコンテンツ」判定の解消。サイトを“量産まとめサイト”ではなく、
**「特別支援教育の現場で、ICT・生成AIを安全に使うための実務メディア」**として再構成した。
記事の機械的な追加は行わず、既存記事の質と運営の信頼性（E-E-A-T）を強化し、
薄く見えるページ（/db /news）は安全側に倒して noindex + sitemap 除外とした。

## 2. 実施内容と変更ファイル

### 2-1. 主力10記事の質的強化（content/articles/）

各記事に「現場の悩み」「判断軸」「よくある失敗例」「校内で確認する順番」「チェックリスト」
「個人情報・校内ルール・管理職確認の注意」「一次情報の読み方」「独自見解」を、
**記事ごとに構成・見出し・言い回しを変えて**織り込んだ（テンプレ構成の複製を回避）。
全10本の `updatedAt` を `2026-07-08` に更新。

| 記事 | 主な強化点 |
|---|---|
| special-needs-ict-reasonable-accommodation.md | 失敗4パターン、相談の持ちかけ方（担任→コーデ→…→教委）、差別解消法・「教育支援の手引」の読みどころ |
| education-ai-service-checklist-before-use.md | 規約を「探して読む」方法（検索語）、失敗パターン、A4一枚で相談に行く確認フロー |
| generative-ai-guideline-v2-school-reading.md | 原本の読み方（版・目次・チェックリスト）、誤読パターン、自校ルールの確かめる順番 |
| digital-textbook-introduction-school-changes.md | 紙と並行・機能は一つずつの実務見解、校内確認事項の表、初回授業前チェックリスト |
| ai-lesson-preparation-prompt.md | どの作業から任せるかの3判断軸、校務利用/児童生徒利用の区別、確認順 |
| chatgpt-tsuchihyo-shoken.md | AIに任せてよい所見/自分で書く所見の判断軸、校内確認順、入力前・提出前の2段階チェック |
| ai-class-newsletter-prompt.md | 通信特有の匿名化注意（状況描写での特定）、発行決裁・AI利用申告の校内手続き |
| individual-education-plan-writing-guide.md | 「引き継ぎテスト/評価テスト」判断軸、情報収集の確認順、提出前セルフチェック9項目 |
| special-needs-behavior-record-guide.md | 記録の粒度を決める3基準、共有・相談の順番、生成AIへの記録入力禁止の理由の具体化 |
| free-ict-tools-safety-checklist.md | 判断軸（自治体承認リスト起点）、失敗6パターン、規約の探し読み、最低ライン3項目 |

### 2-2. 信頼性（E-E-A-T）ページの強化

- [app/about/page.tsx](../app/about/page.tsx) → 「編集方針・記事公開前の確認プロセス」新設（一次情報照合／個人情報混入なし確認／現場適用の注意明記、AI利用の透明性、医療・法律・行政判断の非代替、誤情報窓口）
- [app/operator/page.tsx](../app/operator/page.tsx) → 実務領域の明示、匿名方針の理由、「記事の編集プロセス」新設
- [app/disclaimer/page.tsx](../app/disclaimer/page.tsx) → 医療・法律・行政判断の非代替を明文化、AI生成コンテンツ項を編集方針と整合
- [app/contact/page.tsx](../app/contact/page.tsx) → 「誤情報・リンク切れのご報告」受付を明記
- [components/EditorialPolicy.tsx](../components/EditorialPolicy.tsx)（新規）→ 全記事ページ末尾に共通の「編集方針・確認プロセス」カードを表示（app/articles/[slug]/page.tsx に挿入）
- app/privacy/page.tsx は監査の結果、既に整合していたため変更なし
- 著者表記は「教育DXナビ編集部（千冬先生＠教育DX）」で統一。実名・勤務先・メールアドレスは非公開のまま

### 2-3. 技術/SEO対応（薄いページの安全側処理）

- /db、/news、/news/[slug]（全リターンパス）に `robots: { index: false, follow: true }` を追加
- app/sitemap.ts から /db・/news・ニュース個別エントリを削除（noindexページのsitemap混入を解消）
- robots.txt は `allow: '/'` のままで正しい（noindexはmetaタグで伝達）→ 変更なし
- カテゴリ: 全6カテゴリに記事あり、空カテゴリなし。sitemapは activeCategories フィルタ済みで整合
- canonical / title / description / OGP: トップ・記事一覧・記事詳細・カテゴリ・信頼性ページすべて設定済みを確認
- 内部リンク: 全30記事の `/articles/xxx` リンク308件を実在slugと突合 → **リンク切れ0件**。`/categories/xxx` 約60件も全て有効

### 2-4. 監査レポート

- [ADSENSE_LOW_VALUE_CONTENT_AUDIT.md](./ADSENSE_LOW_VALUE_CONTENT_AUDIT.md)（新規）: 低価値判定の原因分析。
  主因は「量産記事構造（高）」「著者性・E-E-A-T不足（高）」「薄いページ /db /news（高）」。
  本作業はこの3因子に直接対処した。

## 3. 検証結果

| 項目 | 結果 |
|---|---|
| `npm run lint` | ✅ エラー・警告なし |
| `npm run build` | ✅ 成功（51/51ページ静的生成） |
| `npm run validate`（記事frontmatter・DB JSON） | ✅ 全通過 |
| ビルド後 sitemap.xml | ✅ 43 URL。/db /news /news/* を含まない |
| ビルド後 /db /news /news/* の robots meta | ✅ `noindex, follow` を確認 |
| 記事ページの編集方針カード表示 | ✅ ビルドHTMLで確認 |
| PIIスキャン（差分の追加行） | ✅ 実名・勤務先・自治体名・メールアドレス・秘密情報なし |
| 生成物・不要ファイル混入 | ✅ なし（変更は app/ components/ content/ operations/ のみ。node_modules/.env なし） |

## 4. commit / push

- 変更ファイルは個別に `git add`（`git add .` 不使用）
- commit message: `adsense: strengthen content quality and publisher trust`
- commit hash / push結果: 最終報告参照

## 5. 再審査前に人間が確認する項目

1. **本番への再デプロイ（最重要・P0）**: 監査で、本番の sitemap.xml が古いビルドのまま配信されていることを確認済み。
   本ブランチの変更を main に反映（または既存の運用フローでデプロイ）し、本番で以下を確認する:
   - `/db` `/news` のソースに `noindex, follow` が出ていること
   - `sitemap.xml` に `/db` `/news` が含まれないこと
   - 記事ページ末尾に「編集方針・確認プロセス」カードが表示されること
2. Search Console で sitemap を再送信し、インデックス状況を確認する
3. 強化した10記事を実際に読み、事実誤認・不自然な日本語・現場感覚と合わない記述がないか確認する
   （特に: 通知表所見・支援計画・行動記録の個人情報の扱いに関する記述）
4. /about /operator の運営者記述が実態（実務経験の範囲）と一致しているか確認する
5. 監査レポートのP1以降の提案（重複テーマ記事の統合、公開日の分散が既成事実である点の受容、/db のデータ拡充 or 廃止判断）を次サイクルで検討する
6. 再審査リクエストは、本番反映とSearch Consoleの再クロール後、数日置いてから行うことを推奨

# AdSense 第2段階 再開監査

監査日: 2026-07-23  
リポジトリ: `C:\Project\web\edu-dx-navi`（remote `edu-ai-platform`）  
ブランチ: `main`　HEAD: `5e568488002a22ab0573ad6b2cd74c7ff8a61d64`（第1段階基準と一致）  
作業種別: 読み取り監査＋証拠に基づく検証。コード・記事本文への変更は行っていない。  
総合判定: **第2段階の技術作業は完了。4回目審査は条件付き未準備（運営者確認と `ads.txt` 待ち）。**

## 退避

- 退避先: `C:\Project\_scratch\edu-dx-navi-adsense-resume-20260723-213543\`
- `tracked-changes.patch`（binary、約152KB）／`git-status.txt`／`diff-stat.txt`／`staged-info.txt`（stagedなし）／`untracked-list.txt`（15件）／`untracked/`（本体コピー、構造保持）
- 既存差分・未追跡ファイルは破棄・巻き戻しをしていない。

## 検証サマリ

- 記事: 全30件。公開15 / `published: false` 15（MERGE 11＋UNPUBLISH 4）。分類と一致。
- 公開判定: `lib/articles.ts` の共通関数を一覧・カテゴリ・関連・詳細・静的生成・sitemapで共用。
- 広告: `AdSenseScript` は `app/articles/[slug]/page.tsx` で `getArticle()` 成功後のみ描画。非公開はthrow→`notFound()`。他ページに配線なし。
- 参考資料: `lib/article-references.ts` が公開15記事すべてに固有の一次資料を割当（監査テストで強制）。全12 URLがHTTP 200。
- 主張監査CSV: 45行。VERIFIED 20 / PARTIALLY_VERIFIED 8 / UNVERIFIED 2 / USER_CONFIRMATION_REQUIRED 15。
- 独自成果物5点: 対応記事本文に様式・架空例・チェックリスト・マトリクス・判断表として実在を確認。
- 転送: `middleware.ts` がMERGE 11 slugを301で中核記事へ。転送先は終端200（チェーン・ループなし）。UNPUBLISH 4は転送せず404。
- 内部リンク: 公開→非公開リンク 0件。

## 技術検証（2026-07-23実行）

| 項目 | 結果 |
|---|---|
| `npm run lint` | PASS（警告・エラーなし） |
| `npm run typecheck` | PASS |
| `npm test`（adsense-audit 9件） | PASS 9 / FAIL 0 |
| `npm run validate` | PASS（記事30・DB 11） |
| `npm run build` | PASS（33ページ生成、記事15パス、middleware有効） |

### ローカルルート監査（`next start`, port 3123）

| 検証 | 結果 |
|---|---|
| 公開記事詳細 | 200 |
| MERGE slug（例 `kyoiku-dx-kiso`, `tablet-ict-jugyo-giga`） | 301 → 中核記事 |
| 転送先の終端 | 200（チェーンなし） |
| UNPUBLISH slug（`joseikin-guide-2025` 等） | 404（転送なし） |
| `/db`, `/news`, 存在しない記事 | 404 |
| sitemap.xml | loc 26／article 15、`/db`・`/news`・非公開の混入なし |
| canonical | 記事ごとに正しい絶対URL |
| robots.txt | `Allow: /` ＋ sitemap宣言 |
| 広告コード範囲 | home/一覧/`/db`/404 いずれも `adsbygoogle` 0件 |

注: ローカルビルドには `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT` 未設定のため、公開記事上の広告スクリプト実挿入はローカルでは確認不可。配信ゲート（公開記事詳細のみ）はコードと監査テストで確認済み。本番反映後に実挿入を再確認する。

外部参考資料12 URLはブラウザ相当UAで全て200。第1段階で問題だった `litalico.foundation`（DNS不能）・団体トップ出典はDB撤去済みで公開記事の参考資料には含まれない。

## 要件別ステータス

| requirement | status | evidence | remaining_action | affected_files |
|---|---|---|---|---|
| 公開30→15縮小・可逆停止 | COMPLETED | published:false 15件 | なし | content/articles/*.md |
| 共通公開判定 | COMPLETED | isArticlePublished共用・test合格 | なし | lib/articles.ts |
| 広告を公開記事詳細のみへ限定 | COMPLETED | AdSenseScript配線1箇所・test合格 | 本番で実挿入再確認 | app/articles/[slug]/page.tsx, components/AdSenseScript.tsx |
| /db・/news撤去 | COMPLETED | 404・sitemap非掲載 | なし | app/db, app/news |
| 404一意noindex・広告なし | COMPLETED | test合格・広告0 | なし | app配下 |
| 内部リンク非公開参照解消 | COMPLETED | 公開→非公開 0件 | なし | content/articles/*.md |
| 記事別一次資料表示 | COMPLETED | 15記事割当・12 URL全200 | なし | lib/article-references.ts, components/ArticleReferences.tsx |
| 主張単位監査 | COMPLETED | CSV 45行・4status分類 | 高リスク15件は運営者確認へ集約 | docs/adsense/article-claim-source-audit-20260720.csv |
| MERGE統合＋恒久転送 | COMPLETED | 301・終端200・chainなし | なし | middleware.ts, docs/adsense/article-merge-redirect-map-20260720.csv |
| UNPUBLISH 404/転送なし | COMPLETED | 404確認 | なし | content/articles/*.md |
| 独自成果物5点 | COMPLETED | 記事本文に実在 | 妥当性は運営者確認へ | content/articles/*.md |
| 未確認の実体験・効果表現除去 | COMPLETED | 断定表現削除（report） | 回答後に匿名一般化を最終調整 | content/articles/*.md, app/about, app/operator |
| lint/typecheck/test/validate/build | COMPLETED | 上表 | なし | — |
| 実務経験の運営者確認 | COMPLETED（2026-07-24） | 全15記事の回答受領・反映。経験A/B=13記事に注記、経験C=記事3/5は実経験非掲載 | なし（回答反映済み） | docs/adsense/operator-experience-review-20260720.md, lib/article-experience-notes.ts, content/articles/*.md, app/operator, app/about |
| 正確な `ads.txt` | COMPLETED（設置・ローカル検証） | 運営者提供の行を `public/ads.txt` に設置。ローカルで200/text-plain/内容一致 | 本番HTTP確認は反映後、AdSense認識はPENDING | public/ads.txt |
| Search Console・公開後監査 | IN_PROGRESS（第3段階） | 本番反映・監査を今回実施 | deploy後にHTTP実測 | — |

件数（2026-07-24 ads.txt反映後）: COMPLETED 15 / PARTIAL 0 / IN_PROGRESS 1（本番監査）/ BLOCKED 0。AdSense側のads.txt認識のみPENDING（外部反映待ち）。

## 2026-07-24 追記：運営者確認の反映

運営者本人より全15記事の確認回答を受領し、確認範囲に限定した最小修正を実施。

- 経験A/B（13記事）：`components/ArticleExperienceNote.tsx` ＋ `lib/article-experience-notes.ts` で記事末尾に実務経験注記を表示。効果の実証・具体的な時短時間・全校導入等は断定しない。
- 経験C（記事3・5）：実経験・効果を示唆する表現を公的資料ベースの中立表現へ書き換え、実務経験注記は付けない。
- 各記事の個別修正、公開プロフィール（`/operator`・`/about`）、`article-claim-source-audit-20260720.csv`（FIRSTHAND 15件：13→VERIFIED、2→UNVERIFIED/REWRITE、USER_CONFIRMATION_REQUIRED=0）を更新。
- `ads.txt` は正確なサイト運営者IDが未提供のため引き続き BLOCKED（推測作成しない）。

## 今回新たに実施した作業

コード・記事の変更なし。差分退避、実装・記事・CSV・テスト・ビルド・ローカルルートの実地検証、本監査文書の作成、`fourth-review-readiness.md` の技術ゲート更新のみ。第1段階・第2段階の成果に回帰は検出されず。

## 残作業（第3段階入口）

1. 運営者が `operator-experience-review-20260720.md` に回答。
2. 回答に基づき実務手順・架空例・匿名プロフィール候補を最終調整。
3. AdSense管理画面で正確な `ads.txt` 行を取得・設置。
4. レビュー後に commit / push / deploy（本監査では未実施）。
5. 本番で301・404・sitemap・canonical・robots・広告実挿入・参考資料リンクを再監査し、Search Consoleでクロール反映を確認。

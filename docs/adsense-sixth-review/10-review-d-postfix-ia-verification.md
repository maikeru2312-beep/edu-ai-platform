# Review D（post-fix）— IA / redirect / AdSense配置 / テストハーネスの機械的検証

**判定: PASS_WITH_NONBLOCKING_FINDINGS**

CRITICAL 0 / HIGH 0 / MEDIUM 2 / LOW 6。
AdSense 審査をブロックする欠陥は検出されなかった。指摘はいずれも「配信の確実性」「ゲートの反証可能性」「ハーネスの運用性」に関するもので、公開状態そのものの誤りではない。

---

## 0. 検証の前提と対象

| 項目 | 値 |
|---|---|
| 検証対象コミット | `70ac7cf` (`fix: close 5 HIGH findings from post-fix independent reviews A and B`) |
| ブランチ | `claude/adsense-sixth-review-original-value-e14484` |
| 検証時の作業ツリー | `content` / `lib` / `app` / `scripts` / `middleware.ts` は全て clean。`docs/adsense-sixth-review/06-finding-disposition-ledger.csv` のみ未コミット変更あり（本レビュー開始前から存在。内容は変更していない） |
| 検証日時 | 2026-08-22 16:35〜16:50 JST |

### 検証中にツリーが動いた件（記録）

セッション開始時のスナップショットでは HEAD は `68a14eb` だったが、実際の検証開始時点では `70ac7cf` まで 3 コミット進んでいた（`5d60c33` 15:51、`54909ea` 16:10、`70ac7cf` 16:33）。
本レビューの結論が「途中で書き換わった中間状態」を見ていないことを、以下で確認した。

```
$ git status --porcelain -- content lib app scripts middleware.ts docs
 M docs/adsense-sixth-review/06-finding-disposition-ledger.csv

$ ls -l --time-style=full-iso content/articles/*.md middleware.ts
content/*.md      → 2026-08-22 16:31:30
middleware.ts     → 2026-08-22 15:51:43
```

記事本文・`middleware.ts`・`app`・`lib` は全て 16:31:30 以前に確定しており、以降は変更されていない（git 上も clean）。
本レビューの全コマンドは 16:35 以降に実行しているため、**すべて `70ac7cf` の確定状態に対する測定**である。
16:35:44 に更新された `06-finding-disposition-ledger.csv` は実装者の台帳であり、IA / redirect / AdSense の検証結果には影響しない。

### 方針

`docs/` 配下の記述、コミットメッセージ、テストが緑であることは**根拠として採用していない**。
すべて (a) 実ファイルの再解析、(b) `npm run build` 後に `next start` で起動した実サーバへの HTTP 要求、
(c) プロジェクトのテストとは独立に書き起こしたリンク抽出スクリプト、のいずれかで確認した。

---

## 1. IA

### 1-1. canonical 記事数 = 15 ✅

`content/articles/*.md` 30 件を `gray-matter` で再パースし、`published !== false` を数えた（プロジェクトの `lib/articles.ts` を経由しない独立集計）。

- **公開 15 件 / 未公開 15 件**（実測）

カテゴリ別内訳（実測）:

| カテゴリ | 公開記事数 |
|---|---|
| 特別支援教育 | 6 |
| ICT活用 | 3 |
| AI校務改善 | 3 |
| 教材・支援ツール | 3 |
| 助成金・補助金 | 0 |
| 研修・セミナー | 0 |

### 1-2. sitemap.xml の実物 = 15 ✅

```
$ curl -s http://localhost:3000/sitemap.xml
```

- `<loc>` 総数 = **26**
- うち `/articles/` = **15**（1-1 の 15 件と完全一致）
- 統合した 10 slug、退役した `information-morals-education-themes`、未公開の他 4 件は**いずれも 0 件**
- `/db`・`/news`・`/news/*` は **0 件**
- カテゴリ URL は `tokubetsu-shien` / `ict` / `ai-koomu` / `kyozai` の **4 件のみ**（`joseikin` / `kenshu` は非掲載）

### 1-3. 実在カテゴリのみ ✅

公開記事 0 件の 2 カテゴリが、生成・ナビ・sitemap のいずれにも現れないことを HTTP で確認した。

| URL | 実測 |
|---|---|
| `/categories/tokubetsu-shien` | 200 |
| `/categories/ict` | 200 |
| `/categories/ai-koomu` | 200 |
| `/categories/kyozai` | 200 |
| `/categories/joseikin` | **404** |
| `/categories/kenshu` | **404** |
| `/categories/bogus` | 404 |

`components/Header.tsx:7` が `CATEGORIES.filter(cat => articles.some(...))` で実在カテゴリのみを描画しているため、ナビにも出ない。ビルド出力の `generateStaticParams` も 4 カテゴリのみを生成している。

### 1-4. orphan = 0 ✅

プロジェクトのテストとは独立にリンク抽出スクリプトを書き、公開 15 記事の本文から `](/articles/<slug>)` を全件抽出して被リンク数を数えた。

**総内部リンク数 = 140。orphan（被リンク 0）= 0 件。**

| slug | 被リンク数 |
|---|---|
| ai-koomu-kaizen-nyumon | 25 |
| special-needs-ict-support-tools-checklist | 18 |
| individual-education-plan-writing-guide | 17 |
| free-ict-tools-safety-checklist | 13 |
| special-needs-behavior-record-guide | 13 |
| reasonable-accommodation-school-record | 12 |
| special-needs-parent-collaboration | 10 |
| special-needs-ict-reasonable-accommodation | 9 |
| giga-device-lesson-use-guide | 7 |
| digital-textbook-introduction-school-changes | 4 |
| education-ai-service-checklist-before-use | 4 |
| ai-class-newsletter-prompt | 3 |
| special-needs-visual-schedule-support | 3 |
| chatgpt-tsuchihyo-shoken | 1 |
| google-forms-school-use-guide | 1 |

`chatgpt-tsuchihyo-shoken` と `google-forms-school-use-guide` は被リンク 1 本で、orphan ではないが最も細い。そのリンクが将来消えると即 orphan になるため、運用上の注意点として記録する（現状は基準を満たしているので指摘化はしない。関連して finding L5 で、この 2 記事を使った orphan ゲートの mutation 追加を推奨している）。

### 1-5. 壊れたリンク・未公開へのリンク = 0 ✅

140 本すべてについて着地先を判定した。

| 種別 | 実測 |
|---|---|
| 存在しない slug へのリンク | **0** |
| 未公開記事へのリンク（redirect 無し） | **0** |
| redirect 元 slug へのリンク（301 経由） | **0** |
| 自己リンク | **0** |

記事本文から `/db`・`/news` へのリンクも **0 件**（`grep -rn "](/db\|](/news" content/articles/`）。
公開記事本文が使う内部リンクの宛先は `/articles`・`/categories`・`/contact` の 3 系統のみで、
`/categories` リンクの宛先も実在 4 カテゴリ（`tokubetsu-shien` 6 / `ict` 4 / `ai-koomu` 2 / `kyozai` 1）に限られていた。

### 1-6. 同一リスト内のリンク重複 = 1 件（finding L5）

「同じ記事の本文中に同じ宛先が複数回出る」ことは編集上正常なので、**同一の連続リストブロック内**での重複に絞って判定した。

- 検出 **1 件**: `content/articles/google-forms-school-use-guide.md:16-17`（finding L3）

関連記事欄（`app/articles/[slug]/page.tsx:120-134` が同カテゴリから最大 3 件を描画）については、`.filter((a) => a.slug !== slug)` で自己を除外したうえで一意な slug を並べる実装であり、構造上重複しない。

### 1-7. アンカーテキストと現タイトルの整合 ✅

第6回で複数記事をリタイトルしているため、140 本のアンカー文字列を着地先の現 `title` と突き合わせた。

- **旧タイトルの取り残し = 0 件**
- タイトルを引用した長いアンカー（59 箇所）は、すべて現タイトルの部分文字列として一致
- 一致しなかったのは `chatgpt-tsuchihyo-shoken:48` / `:138` の「校務ゲート1」のみ。これは着地先 `ai-koomu-kaizen-nyumon` が所有する枠組みの**節名を指す意図的な参照**であり（現タイトル「…4つの校務ゲートと判断シート」と整合）、陳腐化したアンカーではない。**指摘化しない。**

---

## 2. redirect

### 2-1. 全 10 件を実 HTTP で検証 ✅

`middleware.ts:6-22` の `ARTICLE_MERGE_REDIRECTS` 全 10 件について、`curl` で 1 ホップ目のステータスと `Location`、および `-L` 追従後の最終ステータス・リダイレクト回数を測定した。

```
$ curl -s -o /dev/null -w "%{http_code} %{redirect_url}" http://localhost:3000/articles/<slug>
$ curl -s -o /dev/null -w "%{http_code} %{num_redirects}" -L http://localhost:3000/articles/<slug>
```

| 元 slug | 1ホップ目 | 着地先 | 追従後 | ホップ数 |
|---|---|---|---|---|
| chatgpt-teacher-beginner-guide | 301 | ai-koomu-kaizen-nyumon | 200 | 1 |
| giga-school-device-troubleshooting | 301 | giga-device-lesson-use-guide | 200 | 1 |
| kyoiku-dx-kiso | 301 | giga-device-lesson-use-guide | 200 | 1 |
| microsoft-copilot-teacher-guide | 301 | education-ai-service-checklist-before-use | 200 | 1 |
| tablet-ict-jugyo-giga | 301 | giga-device-lesson-use-guide | 200 | 1 |
| generative-ai-guideline-v2-school-reading | 301 | ai-koomu-kaizen-nyumon | 200 | 1 |
| school-generative-ai-privacy-security | 301 | ai-koomu-kaizen-nyumon | 200 | 1 |
| ai-lesson-preparation-prompt | 301 | ai-koomu-kaizen-nyumon | 200 | 1 |
| ict-teaching-tools-selection-guide | 301 | special-needs-ict-support-tools-checklist | 200 | 1 |
| tokubetsu-shien-ict | 301 | special-needs-ict-support-tools-checklist | 200 | 1 |

**10/10 が (a) 301 を返し (b) 着地先が実在する公開記事で (c) 1 ホップで 200 に到達。** 多段 redirect は 0 件。

### 2-2. 第6回の統合5件が意図した着地先 ✅

指示書が指定した 5 件が、実 HTTP 上で一字一句意図どおりだった（上表の下 5 行）。

- `generative-ai-guideline-v2-school-reading` → `ai-koomu-kaizen-nyumon` ✅
- `school-generative-ai-privacy-security` → `ai-koomu-kaizen-nyumon` ✅
- `ai-lesson-preparation-prompt` → `ai-koomu-kaizen-nyumon` ✅
- `ict-teaching-tools-selection-guide` → `special-needs-ict-support-tools-checklist` ✅
- `tokubetsu-shien-ict` → `special-needs-ict-support-tools-checklist` ✅

### 2-3. 退役記事は 404、fake redirect 無し ✅

```
/articles/information-morals-education-themes  → 404 (Location ヘッダ無し)
```

`middleware.ts` の `ARTICLE_MERGE_REDIRECTS` に当該 slug のキーが存在しないことをソース上でも確認した。
他の未公開記事も同様に 404 で、301 を持たない。

| URL | 実測 |
|---|---|
| /articles/information-morals-education-themes | **404** |
| /articles/joseikin-guide-2025 | 404 |
| /articles/education-grant-search-guide | 404 |
| /articles/generative-ai-school-training-guide | 404 |
| /articles/school-training-ict-ai-guide | 404 |
| /articles/does-not-exist-xyz | 404 |

### 2-4. `/db` `/news` `/news/[slug]` ✅

| URL | 実測 |
|---|---|
| /db | **404** |
| /news | **404** |
| /news/anything | **404** |

いずれも `notFound()` を直接呼ぶスタブ（`app/db/page.tsx`、`app/news/page.tsx`、`app/news/[slug]/page.tsx`）。
sitemap 非掲載（1-2）、`Header.tsx` / `Footer.tsx` のリンク一覧に不在、記事本文からのリンク 0 件（1-5）を個別に確認済み。

---

## 3. AdSense 配置

### 3-1. 環境変数を実際に入れて再ビルドして確認 ✅

`components/AdSenseScript.tsx:6` が `if (!ADSENSE_CLIENT) return null;` である以上、未設定ビルドでの「出力なし」は無意味な観測なので、**値を入れて再ビルドし直して HTML を実測**した。

```
$ NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-TEST npm run build   # exit 0
$ NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-TEST npx next start -p 3000
$ curl -s http://localhost:3000<path> | grep -c "googlesyndication.com/pagead/js/adsbygoogle.js"
```

**記事詳細ページ 15 件すべてで検出、それ以外はすべて 0。**

| ページ | 検出数 |
|---|---|
| 公開記事詳細 15 件（全件） | **各 1**（＋RSC ペイロード内の同一 1 件） |
| `/` | 0 |
| `/articles` | 0 |
| `/categories/{ict,tokubetsu-shien,ai-koomu,kyozai}` | 0 |
| `/about` | 0 |
| `/operator` | 0 |
| `/privacy` | 0 |
| `/disclaimer` | 0 |
| `/contact` | 0 |
| `/db` | 0 |
| `/news`・`/news/x` | 0 |
| 404 ページ | 0 |

未設定ビルドでは `/privacy` に 1 件ヒットしたが、実体を確認したところ
「当サイトは、記事ページにおいて Google AdSense を利用しています」という**プライバシーポリシー本文の記述**と AdSense ヘルプへの外部リンクであり、スクリプトではない。
記事ページ限定という実装と、この開示文の記述内容は矛盾しない。

### 3-2. 検証後に元の状態へ復旧済み ✅

```
$ npm run build            # 環境変数なし, exit 0
$ grep -rl "ca-pub-TEST" .next     # 0 件
$ grep -c adsbygoogle .next/server/app/articles/ai-koomu-kaizen-nyumon.html   # 0
```

`ca-pub-TEST` はビルド成果物に一切残っていない。起動したサーバは 2 回とも停止済み（ポート 3000 応答なしを確認）。

### 3-3. 編集キャラクターの開示と publisher 帰属 ✅

記事ページの**描画済み HTML** から実文字列を抽出して確認した（ソース読解ではなく出力の確認）。

```
$ curl -s http://localhost:3000/articles/ai-koomu-kaizen-nyumon | grep -o '編集キャラクターです。[^<]*'
編集キャラクターです。記事の執筆・編集の責任は運営者にあります。

$ ... | grep -o 'この記事は教育DXナビ運営者が編集し[^<]*'
この記事は教育DXナビ運営者が編集し、制度・仕様・数値を扱う箇所では、…
```

- 著者位置には `EditorialPolicy`（運営者の責任表明）が先に描画され、`ChifuyuProfileCard variant="compact"` はその後
- 千冬先生は「教育DXナビの案内役」と表示され、同カード内で「編集キャラクターです。記事の執筆・編集の責任は運営者にあります」と明示
- 千冬先生を著者として名乗る記述、`author` メタタグ等での帰属は無し

**矛盾は検出されなかった。**

---

## 4. テストハーネス

### 4-1. 実行結果

| コマンド | 終了コード | 結果 |
|---|---|---|
| `npm test` | 0 | **32 pass / 0 fail** |
| `npm run validate` | 0 | 記事30件・DB 4ファイル11件すべて通過 |
| `npm run audit` | 0 | 上記2つの複合、通過 |
| `npm run typecheck` | 0 | エラーなし |
| `npm run build` | 0 | 記事15 / カテゴリ4 を生成、Middleware 34.8 kB |
| `npm run test:mutation` | 0（※） | **10/10 検出・ツリー完全復元** |
| `npm run lint` | **1** | ESLint 設定衝突で失敗（finding L1） |

※ `test:mutation` は初回実行時、未コミットの台帳が原因で mutation を 1 件も実行せず exit 1 で中断した（finding L2）。
検証のため当該 1 ファイルのみを `git stash push` で退避して再実行し、終了後 `git stash pop` で復帰させ、
**SHA-256 が退避前と完全一致すること**（`f03bf9c5a4c2c77310cf01fe8cf80cbcda2d9eb52655a2b0d44413c0405bf955`）を確認している。実装者の未コミット作業は失われていない。

### 4-2. 内部リンク抽出の正規表現 — 既知の欠陥は閉じている ✅

現在のパターン（`scripts/sixth-review-original-value.test.mjs:158`, `:171`, `:441`）:

```js
/\]\(\/articles\/([a-z0-9-]+)(?:[#?][^)]*)?\)/g
```

文字クラスは `[#?]` であり、以前問題になった `[)#?]`（`)` を含む）ではない。
**「直っている」ことを、旧パターンと現パターンを実データ 15 記事に並走させて実測で確認した。**

| | 抽出できた内部リンク数 |
|---|---|
| 旧パターン `(?:[)#?][^)]*)?` | **74** |
| 現パターン `(?:[#?][^)]*)?` | **140** |
| 差分 | **+66（旧は 47% を取りこぼしていた）** |

旧パターンが取りこぼしていた実例（1マッチが次の `)` まで飲み込み、途中のリンクが消えていた）:

- `special-needs-ict-support-tools-checklist` … `special-needs-visual-schedule-support` 他 4 件を取りこぼし
- `special-needs-ict-reasonable-accommodation` … `giga-device-lesson-use-guide` 他 3 件
- `giga-device-lesson-use-guide` … `education-ai-service-checklist-before-use` 他 2 件

最小再現:

```js
const probe = 'see [a](/articles/foo) and [b](/articles/bar#sec) and [c](/articles/baz?x=1) end';
旧 → ['foo', 'baz']          // bar が消える
現 → ['foo', 'bar', 'baz']   // 正しい
```

さらに、**本レビューが独立に書き起こした抽出器の結果（140 本）とプロジェクトの現パターンの結果（140 本）が完全一致**した。
取りこぼしは起きていない。orphan 判定（1-4）がこの正規表現に依存しているため、これは重要な確認である。

### 4-3. mutation test は実際に 10/10 検出し、ツリーを完全復元する ✅

clean なツリーで実行した結果:

```
✓ 無傷の状態でテストが通ることを確認しました
✓ 検出  旧ポジショニング（収集・整理する情報メディア）を1箇所だけ戻す
✓ 検出  統合した記事を公開へ戻す（sitemap・記事一覧へ復活させる）
✓ 検出  退役した記事に fake redirect を張る
✓ 検出  統合の 301 先を誤らせる
✓ 検出  301 を多段にする
✓ 検出  registry から canonical 記事を1件削除する
✓ 検出  registry の独自価値を一次資料の要約だけにする
✓ 検出  2つの canonical 記事に同じ読者ジョブを設定する
✓ 検出  公開記事から未公開記事へリンクする
✓ 検出  AdSense をサイト全体（layout）へ配信する
✅ 10 件の mutation をすべて検出し、作業ツリーを完全に復元しました
```

実行直後の `git status --porcelain` は**空**（何も残っていない）。復元は完全。
すべて `expect` に指定した想定テストが落ちており、「別のテストがたまたま検出」は 0 件だった。

### 4-4. 反証不能なテストの有無 — 該当あり（finding M2）

32 件のうち大半は、CSV とコード／記事本文を**双方向に**突き合わせており健全である（例: test 7 は registry の slug 集合と公開 slug 集合の完全一致を要求するので、CSV だけ直しても通らない。test 16 は registry の `firsthand_boundary` と `lib/article-experience-notes.ts` の注記有無の一致を要求する）。

一方で、**実装者が書いた CSV を、その CSV 自身の性質だけで検査している**ものが 3 件あり、記事本文を一切変えずに CSV のセル編集だけで通せる。詳細は finding M2。

---

## 5. Finding 一覧

### M1 — MEDIUM: AdSense ローダが SSR HTML に `<script>` として出力されず、preload ヒントのみ

- **対象**: `components/AdSenseScript.tsx:12`（`strategy="afterInteractive"`）
- **問題**: 環境変数を設定してビルドしても、サーバが返す HTML に `<script src="…adsbygoogle.js">` 要素が存在しない。存在するのは `<link rel="preload" as="script">` と RSC フライトペイロード内の文字列のみで、実際の script 要素はハイドレーション後にクライアントが挿入する。

  ```
  $ curl -s http://localhost:3000/articles/ai-koomu-kaizen-nyumon | grep -o '<script[^>]*adsbygoogle[^>]*>'
  （0 件）
  $ ... | grep -c 'rel="preload" href="https://pagead2.googlesyndication.com'
  1
  ```

- **なぜ問題か**: AdSense のサイト確認は、初期 HTML にローダのスニペットがあることを前提にした運用が最も確実である。現状は JavaScript の実行完了に依存しており、審査側のレンダリング挙動という制御できない要因が 1 つ増える。Googlebot は JS を実行するため致命的ではないが、**6 回目の申請**でこの依存を残す利得は小さい。
- **推奨**: `strategy="beforeInteractive"` に変更するか、記事ページの `<head>` に素の `<script async src=… crossorigin="anonymous">` を直接出力する。変更後は本レビューと同じ手順（値を入れて再ビルド → `grep '<script[^>]*adsbygoogle'`）で、script 要素が HTML に出ることを実測して確認すること。

### M2 — MEDIUM: original value / distinctness の受入ゲートが自己申告を自己申告で検査しており反証不能

- **対象**:
  - `scripts/sixth-review-original-value.test.mjs:193-211`（test 8 "every registry entry declares a substantive primary unique value"）
  - `scripts/sixth-review-original-value.test.mjs:226-249`（test 10 "no two canonical articles share the same primary reader job"）
  - `scripts/sixth-review-original-value.test.mjs:253-278`（test 11 "the distinctness matrix covers every pair and leaves no overlap unrepaired"）
  - 参照データ: `docs/adsense-sixth-review/01-canonical-value-registry.csv`、`docs/adsense-sixth-review/02-distinctness-matrix.csv`
- **問題**: これら 3 件は、実装者自身が書いた CSV を、その CSV の**内部的な性質だけ**で検査している。記事本文とは一切照合していない。
  - test 8 の実体は「`primary_unique_value` が 20 文字以上」「`reader_job` が 20 文字以上」「`canonical_asset` が 4 文字以上」「`status` が `CANONICAL`」。**文字数と定数の検査**であり、宣言された独自価値が記事に実在するかは見ていない。
  - test 10 は `reader_job` を助詞除去した指紋で比較する。文字列を言い換えれば衝突を回避できる。
  - test 11 は 105 ペア全行の `verdict` が `OVERLAP_REQUIRES_REPAIR` / `MERGE` でないことを要求する。**CSV のセルに `DISTINCT` と書けば通る。**記事の重複が実際に解消されたかを示す独立した信号が無い。
- **なぜ問題か**: 「独自価値がある」「重複を解消した」という、第6回審査の中心的な主張がまさにこの 3 件で担保されている建て付けになっている。しかし機械的には、記事を 1 文字も変えずに CSV だけ書き換えれば緑にできる。ゲートとして反証不能であり、`npm test` が緑であることは独自性の証拠にならない。mutation test も CSV の削除・値の書き換えを検出するだけで（＝パーサが動いていることの確認）、この反証不能性を解消しない。
- **なお**: これは審査をブロックする欠陥ではない。実際の独自性は Review A / B / C が人手で評価している。問題は「テストが緑だから独自性が担保されている」と後任が読む余地が残っていることである。
- **推奨**: 少なくとも test 11 の `verdict` を計算可能な信号に紐付ける。例えばペア 2 記事の見出し集合の Jaccard 係数や本文 n-gram の重複率に閾値を設け、閾値を超えたペアが `DISTINCT` を名乗っていたら落とす。これにより「CSV に DISTINCT と書く」だけでは通らなくなる。難しければ、当該 3 テストの docstring に「これは宣言の整形式検査であって独自性の証明ではない」と明記し、`04-verification.md` 側でも独自性の根拠が人手レビューにあることを述べる。

### L1 — LOW: `npm run lint` が worktree 内で exit 1（環境起因）

- **対象**: `.eslintrc.json`（worktree 側）と `C:\Project\web\edu-dx-navi\.eslintrc.json`（親チェックアウト側）の衝突
- **問題**: 本 worktree は親チェックアウト配下の `.claude/worktrees/…` にあり、親にも `.eslintrc.json` と `package-lock.json` がある。ESLint が両方を読み込み、以下で失敗する。

  ```
  Plugin "@next/next" was conflicted between ".eslintrc.json » eslint-config-next/core-web-vitals"
  and "..\..\..\.eslintrc.json » eslint-config-next/core-web-vitals".
  LINT_EXIT=1
  ```

- **環境起因であることの確認**: 同一コマンドを親チェックアウト `C:\Project\web\edu-dx-navi` で実行すると **exit 0 / "✔ No ESLint warnings or errors"**。ソース側の lint 違反ではない。
- **なぜ問題か**: 受入手順に含まれる `npm run lint` が、この worktree からは通らない。「lint 緑」を確認したという報告があれば、それは worktree 外で実行したか、実行していないかのいずれかである。
- **推奨**: worktree を親チェックアウトの外（例: `C:\Project\web\_worktrees\…`）に作る。または `next.config.mjs` に `outputFileTracingRoot` を設定し、ESLint 側は `--no-eslintrc` 相当でルート探索を止める。少なくとも受入手順に「lint は親チェックアウトで実行する」と明記する。

### L2 — LOW: `npm run test:mutation` がレビュー文書の作成中は一切実行できない

- **対象**: `scripts/mutation-check.mjs:31`

  ```js
  const status = git('status', '--porcelain', '--', 'content', 'lib', 'app', 'scripts', 'middleware.ts', 'docs');
  ```

- **問題**: clean 判定の対象に `docs` が丸ごと入っている。しかしレビュー成果物（本ファイルを含む）と台帳 `06-finding-disposition-ledger.csv` はすべて `docs/adsense-sixth-review/` に置かれる。実測では、台帳が未コミットなだけで mutation を **1 件も実行せずに** exit 1 で中断した。

  ```
  ✗ working tree が clean ではありません（開始時）:
   M docs/adsense-sixth-review/06-finding-disposition-ledger.csv
  ```

- **なぜ問題か**: 復元に `git checkout` を使う以上 clean 要求自体は正しいが、範囲が広すぎる。mutation が実際に触るのは `components/Footer.tsx` / `content/articles/*.md` 2 件 / `middleware.ts` / `app/layout.tsx` / `01-canonical-value-registry.csv` のみである。現状では「レビューを書きながら mutation を回す」ができず、レビュー中に最も回したいタイミングでゲートが使えない。本レビューでも当該 1 ファイルを stash して退避しなければ検証できなかった。
- **推奨**: clean 判定の pathspec を `MUTATIONS` の `files` の和集合に限定する。`docs` 全体ではなく `docs/adsense-sixth-review/01-canonical-value-registry.csv` だけを対象にすれば、レビュー文書の編集中でも安全に実行できる。

### L3 — LOW: 同一リスト内で同じリンク先が 2 回出る

- **対象**: `content/articles/google-forms-school-use-guide.md:16-17`
- **問題**: 「扱わないもの」の連続する 2 つの箇条書きが、どちらも `/articles/free-ict-tools-safety-checklist` へリンクしている。

  ```
  16: - 外部サービスを学校で使ってよいかの導入前確認 → [無料ICTツールを…](/articles/free-ict-tools-safety-checklist)の Gate 1〜5
  17: - 情報が外部に出るか、終わるときに回収・削除できるか（…） → [無料ICTツールを…](/articles/free-ict-tools-safety-checklist)の Gate 3・Gate 5
  ```

  公開 15 記事の全リストブロックを走査して、これが**唯一の該当箇所**だった。
- **なぜ問題か**: リンク切れでも 301 経由でもなく実害は小さいが、同一リスト内に同じ着地先が並ぶと、読者には 2 つの別ページがあるように見える。委譲先が 1 記事なら 1 項目にまとめたほうが「どこへ行けばよいか」が明確になる。
- **推奨**: 2 項目を 1 項目に統合し、参照する Gate をまとめて示す（例: 「導入前確認と、情報が外部に出るか・回収削除できるか → 同記事の Gate 1〜5」）。または片方をリンクなしの記述に変える。

### L4 — LOW: AdSense の mutation が、守りたい性質より弱いものを壊している

- **対象**: `scripts/mutation-check.mjs:197`
- **問題**: 「AdSense をサイト全体（layout）へ配信する」という mutation の実体は、`app/layout.tsx` に `{/* adsbygoogle */}` という**コメントを 1 行挿入するだけ**である。実際に配信を発生させる `<AdSenseScript />` の挿入ではない。
- **なぜ問題か**: これが証明しているのは「test 14 の `assert.doesNotMatch(read('app/layout.tsx'), /adsbygoogle|AdSenseScript/)` という grep が動く」ことであって、「サイト全体配信が起きたら落ちる」ことではない。もっとも、本物の `<AdSenseScript />` 挿入も同じ正規表現の `AdSenseScript` 側に引っかかるため**カバレッジ自体は足りている**。弱いのは実証の仕方であり、欠陥は残っていない。
- **推奨**: mutation を `'        <GoogleAnalytics />'` → `'        <GoogleAnalytics />\n        <AdSenseScript />'` に変えれば、守りたい性質そのものを壊す mutation になる（`import` が無くても静的 grep のテストは落ちる）。

### L5 — LOW: mutation が 4 つのゲートを一度も検査していない

- **対象**: `scripts/mutation-check.mjs` の `MUTATIONS` 配列（全 10 件）
- **問題**: 以下のテストに対応する mutation が存在しない。つまり「このテストが壊れても気づけるか」が未検証である。
  - `:166` orphan 検出（"no canonical article is orphaned"）
  - `:437` アンカーテキストと現タイトルの整合（"internal link anchor text matches the current title"）
  - 自己リンク検出（`scripts/adsense-audit.test.mjs:83`）
  - `:253` distinctness matrix の verdict（M2 とも関連）
- **なぜ問題か**: orphan とアンカー整合は、まさに今回の大規模再構成（21→15、9記事のリタイトル）で壊れやすかった性質であり、実際に取り残しが発生したと `:439-441` のコメントが述べている。その検出器自体が mutation で検証されていない。既存の mutation「公開記事から未公開記事へリンクする」は被リンク 18 本の記事のリンクを 1 本差し替えるだけなので、orphan 判定は発火しない。
- **推奨**: 最低 2 件追加する。(a) 被リンク 1 本の記事（`chatgpt-tsuchihyo-shoken` または `google-forms-school-use-guide`）への唯一の内部リンクを削除し、orphan テストが落ちることを確認する。(b) いずれかのアンカーテキストを旧タイトル文字列に差し戻し、アンカー整合テストが落ちることを確認する。

### L6 — LOW: `validate.mjs` が最初のエラー以降、成功行を出さなくなる

- **対象**: `scripts/validate.mjs:98`

  ```js
  if (errors === 0) pass(label);
  ```

- **問題**: これはループ内で「これまでに 1 件もエラーが無いとき」に成功表示する分岐なので、いずれかの記事でエラーが出ると、それ以降の記事はすべて検証されているのに `✓` が一切出なくなる。
- **なぜ問題か**: エラー件数と終了コードは正しいので**検証の正しさには影響しない**。ただしエラー発生時の出力が「そこで検証が止まった」ように見え、原因調査を誤らせる。
- **推奨**: 記事ごとのエラー有無を数えて `if (errorsBefore === errors) pass(label);` とする。

---

## 6. 総括

**判定: PASS_WITH_NONBLOCKING_FINDINGS**

指示書が指定した検証項目のうち、**IA・redirect・AdSense 配置に関する必須条件はすべて実測で満たされていた**。

- canonical 15 件、sitemap の実物も 15 件で完全一致。統合・退役 slug と `/db` `/news` は sitemap・ナビ・記事本文のいずれにも存在しない
- 内部リンク 140 本のうち、壊れたリンク 0・未公開へのリンク 0・301 経由 0・自己リンク 0・orphan 0
- リタイトル後の旧アンカー取り残し 0（唯一の不一致は意図的な節名参照）
- redirect 10 件すべてが実 HTTP で 301 → 1 ホップ → 200。第6回の統合 5 件は指定どおりの着地先
- 退役 `information-morals-education-themes` は 404 で fake redirect 無し
- AdSense は環境変数を入れて再ビルドした状態で、記事詳細 15 件のみに出力。他 14 種のページはすべて 0 件
- 編集キャラクター開示と運営者帰属は描画済み HTML 上で矛盾なし
- mutation test は 10/10 を検出し、ツリーを完全復元

**特に確認を要求された「内部リンク抽出の正規表現の取りこぼし」は、確実に閉じている。**
旧パターンが 140 本中 74 本しか拾えていなかった（47% の取りこぼし）のに対し、現パターンは 140 本すべてを拾い、本レビューが独立に実装した抽出器の結果と完全一致した。orphan = 0 という結論はこの正規表現に依存しているため、これが直っていなければ 1-4 の結果自体が信用できなかった。

一方で、**「テストが緑であること」を独自性の証拠として読むべきではない**。M2 のとおり、独自価値と重複解消を担保しているとされる 3 つのゲートは、記事本文を一切変えずに CSV のセル編集だけで通せる構造になっている。第6回審査の中心的な主張がここに置かれていることを踏まえると、この反証不能性は文書化されるべきである（審査自体はブロックしない）。

運用面では、`npm run lint` がこの worktree から通らないこと（L1）と、`npm run test:mutation` がレビュー文書の作成中は実行できないこと（L2）が、受入手順の実効性を下げている。どちらも 1 行の設定変更で解消できる。

**マージ前に対応を推奨する順序**: M1（AdSense を SSR HTML に出す — 6 回目の申請でリスクを 1 つ減らす価値がある）→ L2（mutation を回せるようにする）→ L1（lint を通せるようにする）→ M2（ゲートの位置づけを明記、または計算可能な信号に紐付ける）→ L3〜L6。

---

## 付録: 検証の再現手順

```bash
cd C:/Project/web/edu-dx-navi/.claude/worktrees/adsense-sixth-review-original-value-e14484

# 1) ベースライン
npm run build                       # exit 0
npx next start -p 3000 &

# 2) redirect（10件）
for s in chatgpt-teacher-beginner-guide giga-school-device-troubleshooting kyoiku-dx-kiso \
         microsoft-copilot-teacher-guide tablet-ict-jugyo-giga \
         generative-ai-guideline-v2-school-reading school-generative-ai-privacy-security \
         ai-lesson-preparation-prompt ict-teaching-tools-selection-guide tokubetsu-shien-ict; do
  curl -s -o /dev/null -w "$s hop1=%{http_code} -> %{redirect_url}\n" http://localhost:3000/articles/$s
  curl -s -o /dev/null -w "  follow=%{http_code} hops=%{num_redirects}\n" -L http://localhost:3000/articles/$s
done

# 3) 404 になるべきもの
for u in /articles/information-morals-education-themes /categories/joseikin /categories/kenshu \
         /db /news /news/anything; do
  curl -s -o /dev/null -w "$u %{http_code}\n" http://localhost:3000$u
done

# 4) sitemap
curl -s http://localhost:3000/sitemap.xml | grep -o '<loc>[^<]*</loc>' | sed 's/<[^>]*>//g'

# 5) AdSense（値を入れて再ビルドすること）
kill %1
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-TEST npm run build
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-TEST npx next start -p 3000 &
curl -s http://localhost:3000/articles/ai-koomu-kaizen-nyumon | grep -c googlesyndication   # 期待: 2 (preload + RSC)
curl -s http://localhost:3000/ | grep -c googlesyndication                                   # 期待: 0

# 6) 元に戻す
kill %1
npm run build                       # 環境変数なし
grep -rl ca-pub-TEST .next          # 0 件であること

# 7) ハーネス
npm test && npm run validate && npm run typecheck && npm run build
npm run test:mutation               # docs 配下が clean である必要がある（L2）
npm run lint                        # 親チェックアウトで実行すること（L1）
```

---

*Review D（post-fix, 独立レビュー）。本レビューは実装者の申告・`docs/` の記述・コミットメッセージを根拠として採用しておらず、すべて実ビルド・実 HTTP・独立実装した解析スクリプトによる実測に基づく。検証中にファイルの編集は行っていない（本ファイルの作成を除く）。*

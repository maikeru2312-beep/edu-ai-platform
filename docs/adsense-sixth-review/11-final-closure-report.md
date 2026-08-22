# 第6回審査 — Post-Fix Independent Closure 最終報告

> ファイル名は指示書の `11-final-closure-report.md` に従う。
> なお `11-review-ab-final-confirmation.md` は独立レビュアーが作成した確認レビューの成果物で、別物。

- 判定日: 2026-08-22
- Repository: `https://github.com/maikeru2312-beep/edu-ai-platform.git`
- PR: [#19](https://github.com/maikeru2312-beep/edu-ai-platform/pull/19)（OPEN / base `main` / MERGEABLE / CLEAN）
- Branch: `claude/adsense-sixth-review-original-value-e14484`
- Base HEAD: `1488efb016597aa8dc210478b039276153a41448`（`main` は未変更）

## 判定

**SIXTH_REVIEW_RESTRUCTURE_READY_FOR_OWNER_MERGE**

---

## 1. Owner 判断（3/3 APPROVED）

`05-owner-decisions.md` に記録。以降 `OWNER_DECISION_REQUIRED` の対象として再提起しない。

| # | 内容 | 判断 |
|---|---|---|
| OWNER-1 | KEEP 2記事への限定的な asset 追加 | APPROVED（revert 禁止） |
| OWNER-2 | 公開15記事の `updatedAt` が同一 | APPROVED（日付を人工的に散らさない） |
| OWNER-3 | branch 名 | APPROVED（rename 不要） |

---

## 2. 既知の不整合（テスト件数）の確定

指示書 §4 の不整合を、文章合わせではなく**再実測**で確定した。

| 出典 | 記載 | 実測（HEAD で `npm test`） |
|---|---|---|
| PR #19 body（クロージャ前） | 31 pass（既存12 + 新規19） | 当時は正しかった |
| `04-verification.md`（クロージャ前） | 30 pass（既存12 + 新規18） | **陳腐化していた** |
| **確定値（本クロージャ終了時）** | — | **33 pass（既存12 + 新規21）** |

- 原因: `04-verification.md` は closure commit `5d60c33` より前に書かれ、その後に追加した
  受入ゲートが反映されていなかった。
- 対応: `04-verification.md` を実測値へ更新し、なぜ陳腐化したかを本文に明記した。
  本クロージャでさらにゲートを2件追加したため、最終値は 33 になっている。
- **テスト件数を期待値に合わせるためのテスト追加・削除は行っていない。**
  追加した2件はいずれも独立レビュアーの指摘に対応するもの（アンカー整合、計算可能な distinctness）。

---

## 3. 元の 48 finding の disposition

`06-finding-disposition-ledger.csv`（53行 = 元の48 + post-fix の5）。
`UNREVIEWED` / `TODO` / `UNKNOWN` は0件。

### 元 HIGH 12 件 — 12/12 VERIFIED_CLOSED

**重要**: 前回の報告は「HIGH 12/12 修正済み」としていたが、本クロージャの再検証で
**1件（H4）が実際には未修正**であることが判明した。転記ではなく実ファイルで確認した結果である。

| id | 内容 | 再検証の結果 |
|---|---|---|
| H1 | 所見記事の入力前チェックに承認環境・二次利用確認が無い | 2項目の存在を grep で確認 |
| H2 | 生成AI側に incident 後の手順が無い | 該当節の存在を確認 |
| H3 | 委譲先の節が約束した内容を扱っていない | 実在する節へ差し替え済み |
| **H4** | **保護者同意の委譲先に「保護者」の語が0件** | **未修正だった。本クロージャで free-ict Gate 2 に追加し、出現2件を確認** |
| H5 | `updatedAt` が15件同一 | OWNER-2 の方針で実装済み（About 開示＋homepage 非表示） |
| H6 | 鋳型ゲートが本文を見ていない | 本文ベースのラチェットを追加済み |
| H7 | 記事の著者位置に開示なしの編集キャラクター | compact に開示追加＋描画順変更。rendered HTML で確認 |
| H8 | 「編集部」と「個人運営」の不一致 | 横断 grep で残存0 |
| H9 | 本文の参考資料にレジストリ未登録の資料 | 本文リスト削除、コンポーネントへ一本化 |
| H10 | 旧タイトルのアンカー | 残存0。自動ゲートも追加 |
| H11 | 実在しない節名の参照 | 残存0 |
| H12 | 事業者向け指針を公立学校の根拠として提示 | 残存0。内閣府基本方針を3箇所に明示 |

### 元 MEDIUM 24 件

| disposition | 件数 |
|---|---|
| FIX_BEFORE_MERGE（すべて CLOSED） | 16 |
| SUPERSEDED_BY_HIGH_FIX | 5 |
| ACCEPTED_NONBLOCKING | 3 |
| DEFERRED_POST_ADSENSE | 0 |

### 元 LOW 12 件

| disposition | 件数 |
|---|---|
| FIX_BEFORE_MERGE（すべて CLOSED） | 3 |
| SUPERSEDED_BY_HIGH_FIX | 1 |
| ACCEPTED_NONBLOCKING | 7 |
| DEFERRED_POST_ADSENSE | 1 |

**FIX_BEFORE_MERGE の未処理: 0**

---

## 4. Post-Fix Independent Review

指示書 §7 に従い、**新規の独立レビュアー**が current HEAD を監査した。
過去の finding summary は渡していない。各レビュアーには
「実装者の修正済みという主張は証拠ではなく仮説である」という前提を与えた。
session limit 対策として最大2並列にとどめ、結果は受領のつど即ファイル化した。

| レビュー | 成果物 | 監査対象 | 判定 | C / H / M / L |
|---|---|---|---|---|
| A: Original Value / AdSense | `07-review-a-postfix-original-value.md` | `54909ea` | PASS_WITH_NONBLOCKING_FINDINGS | 0 / 2 / 10 / 9 |
| B: 学校実務 / 安全性 | `08-review-b-postfix-practitioner.md` | `54909ea` | PASS_WITH_NONBLOCKING_FINDINGS | 0 / 3 / 4 / 6 |
| C: 法務 / 一次資料 | `09-review-c-postfix-legal-source.md` | `70ac7cf` | PASS_WITH_NONBLOCKING_FINDINGS | 0 / 1 / 6 / 12 |
| D: IA / redirect / ハーネス | `10-review-d-postfix-ia-verification.md` | `70ac7cf` | PASS_WITH_NONBLOCKING_FINDINGS | 0 / 0 / 2 / 6 |
| 最終確認 A/B lens | `11-review-ab-final-confirmation.md` | `fad8dee` | PASS_WITH_NONBLOCKING_FINDINGS | 0 / 0 / 7 / 7 |
| 最終確認 C/D lens | `12-review-cd-final-confirmation.md` | **`39ecdec`（最終計測）** | PASS_WITH_NONBLOCKING_FINDINGS | 0 / 0 / 2 / 6 |

### 「最後のコード修正より後にレビューが実行されている」ことの担保（§13）

A〜D はそれぞれの指摘に対する修正の**前**に走っているため、そのままでは closure evidence にできない。
そこで修正後の最終状態を、過去の指摘を渡していない新しいレビュアー2名が再監査した。

- **C/D lens の最終確認レビューは、私の並行編集を自ら検知し、全項目を最終コミット
  `39ecdec` の clean tree で計測し直している。** さらに、初回計測で見つけた4件が
  `39ecdec` で既に解消済みであることも確認している（同レビュー内に記録）。
- A/B lens の最終確認レビュー（`fad8dee` 監査）が挙げた MEDIUM 7件のうち、§6 の昇格条件に
  該当する7件を `39ecdec` で修正した。**この修正後に C/D lens の最終計測が行われている。**
- `39ecdec` 以降の変更は本クロージャの最終コミット1件のみで、内容は
  (a) `.eslintrc.json` への `"root": true` 追加（ルール変更なし。lint を exit 0 にする設定解決の修正）、
  (b) 3記事への注記1文の追加（本文の主張は不変）、(c) ドキュメント。
  いずれも機械検証済みで、`app/` `components/` `lib/` `middleware.ts` の挙動を変えていない。

### 新規 finding（post-fix レビュー全体）

| severity | 件数 | 状態 |
|---|---|---|
| CRITICAL | **0** | — |
| HIGH | **0**（最終確認2件はいずれも HIGH 0） | 途中で出た HIGH 6件はすべて修正済み |
| MEDIUM | 21 | 昇格分は修正、残りは disposition 済み |
| LOW | 46 | disposition 済み |

途中で出た HIGH 6件（A:2 / B:3 / C:1）はすべて実ファイルで成立を確認し、修正した。

---

## 5. Final Automated Verification（clean tree, HEAD `39ecdec` + 最終コミット）

| コマンド | 結果 |
|---|---|
| `npm test` | **33 pass / 0 fail**（既存12 + 新規21） |
| `npm run test:mutation` | **10 / 10 検出、作業ツリー完全復元** |
| `npm run audit` | 通過 |
| `npm run validate` | 通過 |
| `npm run lint` | **exit 0 / No ESLint warnings or errors** |
| `npm run typecheck` | 通過 |
| `npm run build` | 成功（静的33ページ） |

### 構造の実測

| 項目 | 実測 |
|---|---|
| published canonical | **15** |
| sitemap の記事 URL | **15**（統合・退役 slug なし） |
| source-summary-only | **0** |
| distinctness `OVERLAP_REQUIRES_REPAIR` | **0** |
| distinctness `MERGE` | **0** |
| published → unpublished リンク | **0** |
| 301 を経由する内部リンク | **0** |
| self link | **0** |
| orphan | **0** |
| registry 行 ↔ canonical | **15 ↔ 15** |
| raw markdown / literal `**` | **0**（15記事の rendered HTML で確認） |
| 重複する `参考資料` H2 | **0** |

### Production-equivalent HTTP smoke（`npm run start`）

- redirect 10件すべて **301 → 200（1ホップ）**
- `/db` `/news` `/news/*` `/articles/information-morals-education-themes` すべて **404**（fake redirect なし）
- homepage / 記事一覧 / About / Operator / Privacy / Disclaimer / Contact / カテゴリ4 すべて **200**
- 記事詳細15本すべて 200・literal `**` 0・`参考資料` H2 は1回
- `/contact` に存在しない機能（コメント欄）への誘導は無い
- AdSense: `ca-pub-TEST` を入れたビルドで**記事詳細15ページのみ**に出力（確認レビューが実測。検証後は環境変数なしで再ビルド済み）

---

## 6. 残る非ブロッキングの積み残し

| 項目 | disposition | 理由 |
|---|---|---|
| hero に権威の証拠が同伴していない | ACCEPTED_NONBLOCKING | 設計判断。運営者情報は Footer / About から到達可能 |
| description が293〜580字で文型が均質 | ACCEPTED_NONBLOCKING | 可読性の問題で、独自価値には影響しない |
| サイト名「教育DXナビ」が汎用的 | ACCEPTED_NONBLOCKING | ブランド・被リンク・Search Console に影響する Owner 判断事項 |
| JSON-LD（構造化データ）が0件 | DEFERRED_POST_ADSENSE | 検索表示の強化であり AdSense の有用性判定の要件ではない |
| 末尾スラッシュ付き旧 URL が 308→301→200 | ACCEPTED_NONBLOCKING | middleware の 301 自体は1ホップ。正規 URL では発生せず、sitemap・内部リンクは末尾スラッシュ無しで統一 |
| AdSense ローダが `afterInteractive` | ACCEPTED_NONBLOCKING（下記の注記あり） | 記事ページ限定配置の要件と両立させるための実装。詳細は §7 |
| 印刷用 CSS（`@media print`）が無い | ACCEPTED_NONBLOCKING | 様式は画面上で記入・複製できる。印刷最適化は改善候補 |
| 本文が薦める公的資料の一部が参考資料欄に無い | ACCEPTED_NONBLOCKING | 両者の役割が違うことを3記事に明記した。未検証の資料をレジストリへ足して見かけを揃えることはしない |

---

## 7. Owner に伝えるべき申請前の確認事項（新たな Owner 判断ではない）

いずれも**実装で解決できない環境・運用側の事項**なので、判断を求めるのではなく確認を依頼する。

1. **`NEXT_PUBLIC_CONTACT_FORM_URL` の本番設定。**
   未設定だと `/contact` は「準備中」だけを表示し、有効な連絡手段がゼロになる。
   About・Operator・全記事末尾の EditorialPolicy がこのページへ誘導しているため、
   申請前に本番の `/contact` を実際に開いて、フォームが表示されることを確認してください。
   （フォールバック文からは、実装の無いコメント欄への誘導を削除済み）
2. **`NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT` の本番設定。**
   未設定だとコンポーネントが `null` を返し、広告コードが一切出力されません。
3. **AdSense ローダの読み込み方式。**
   記事ページ限定で配信するという要件を満たすため `next/script` の `afterInteractive` を
   使っており、SSR HTML には `<link rel="preload">` のみが出て、実 script は
   ハイドレーション後にクライアントが挿入します。`beforeInteractive` で `<head>` に置くには
   root layout へ移す必要があり、その場合「記事ページのみに配信する」という
   第6回の要件と衝突します。現状は要件を優先しています。

---

## 8. 実施していないこと

| 項目 | 状態 |
|---|---|
| PR #19 の merge | **未実施** |
| `main` への push | **未実施**（`main` は `1488efb` のまま） |
| production deploy / Vercel promotion | **未実施** |
| Search Console の操作 | **未実施** |
| AdSense 再審査申請 | **未申請** |

---

## 9. NEXT SINGLE ACTION

```text
Owner reviews PR #19 and decides whether to merge.
```

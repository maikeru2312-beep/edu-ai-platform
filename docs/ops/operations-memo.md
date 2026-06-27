# 教育DXナビ 運用メモ（Phase 5以降の運用フェーズ）

作成日: 2026-06-27
対象サイト: 教育DXナビ（https://edu-ai-platform-delta.vercel.app ）
前提: 記事30本・GA4（G-XCORRZCZM5）/ AdSense（ca-pub-3801092904087307）/ Search Console verification / sitemap / robots / canonical はすべて本番で正常稼働。AdSense審査中。

このメモは「運用フェーズ」の手順書です。**コード・記事・設定ファイルの変更は不要**。Search Console・X・各管理画面での運用作業を中心に整理します。

---

## 1. Search Console で行うこと

> いずれも Google Search Console（対象プロパティ）の管理画面での作業。コード変更は不要。

### 1-1. sitemap.xml の再送信
- 「サイトマップ」→ `sitemap.xml` を送信（既に登録済みなら、最新の取得状況を確認し、必要なら再送信）。
- 送信URL: `https://edu-ai-platform-delta.vercel.app/sitemap.xml`
- ステータスが「成功」、検出URL数が記事30件＋固定/カテゴリ/ニュース分になっているか確認。

### 1-2. 新規4記事のURL検査
「URL検査」に以下を1件ずつ入力し、インデックス状況を確認する。

1. https://edu-ai-platform-delta.vercel.app/articles/generative-ai-guideline-v2-school-reading
2. https://edu-ai-platform-delta.vercel.app/articles/digital-textbook-introduction-school-changes
3. https://edu-ai-platform-delta.vercel.app/articles/special-needs-ict-reasonable-accommodation
4. https://edu-ai-platform-delta.vercel.app/articles/education-ai-service-checklist-before-use

確認ポイント：
- 「URL は Google に登録されていません」の場合は次の登録リクエストへ。
- 「ページの取得」で canonical が自己参照になっているか（別URLに正規化されていないか）。

### 1-3. インデックス登録リクエスト
- 各URL検査画面で「インデックス登録をリクエスト」を実行。
- 一度に大量送信せず、4記事を順に。混雑時はリクエストが受理されないこともあるので、その場合は時間をおいて再試行。
- 即時インデックスは保証されない。数日〜1週間程度様子を見る。

---

## 2. X（旧Twitter）投稿運用

### 2-1. 投稿ストック
- 投稿文10件: [docs/sns/x-posts-edu-dx-reflections-10.md](../sns/x-posts-edu-dx-reflections-10.md)
- Buffer取り込み用CSV: [docs/sns/buffer-x-edu-dx-reflections-10.csv](../sns/buffer-x-edu-dx-reflections-10.csv)
- 記事リンク付き投稿のストック（既存）: [docs/sns/buffer-x-initial-posts-10-simple.csv](../sns/buffer-x-initial-posts-10-simple.csv)

### 2-2. 投稿ペース
- **1日1〜2件**を目安に投稿（連投しすぎない／間隔を空ける）。
- リフレクション系（リンクなし）と記事リンク付きを交互に混ぜると、宣伝色が薄まり読まれやすい。
- 投稿時刻の目安: 朝（7:00前後）と夕方〜夜（18:00前後）。

### 2-3. 投稿後の確認
- 投稿後、**GA4のリアルタイム / 集客レポート**で流入を確認する。
  - GA4 →「リアルタイム」で投稿直後の流入有無
  - GA4 →「集客」→「トラフィック獲得」で参照元（Social / t.co など）と着地ページ
- 反応の良かった投稿文・記事を記録し、次回の投稿に反映。

---

## 3. AdSense審査中に避けること

審査中はサイトの安定性が重要。次の操作は**審査が完了するまで行わない**。

- ❌ 広告コード（AdSenseスクリプト）の変更・移動・削除（`app/layout.tsx` の `adsbygoogle.js` 読み込み）
- ❌ 大規模なデザイン変更・レイアウト刷新
- ❌ 固定ページの削除（privacy / disclaimer / about / contact / operator）
- ❌ `noindex` の付与、`robots.txt`・`sitemap.xml`・`canonical` の不用意な変更
- ❌ Search Console verification メタの編集・削除

OKなこと（審査にプラス）：
- ✅ 良質な記事の追加・内部リンクの自然な改善
- ✅ 誤字修正など軽微なコンテンツ改善
- ✅ X等での地道な集客

---

## 4. 1週間後に確認すること（目安: 2026-07-04 以降）

| 確認先 | 見る項目 |
|---|---|
| GA4 | ページビュー（PV）・ユーザー数・どの記事が見られているか・流入チャネル |
| Search Console | 新規4記事のインデックス状況・「ページ」レポートの登録数・検索クエリの有無・カバレッジのエラー |
| AdSense | 審査ステータス（合格 / 追加対応依頼 / 不合格）。依頼があれば内容を確認 |
| 流入分析 | 流入のある記事を特定し、関連テーマの記事を次に作る判断材料にする |

メモ欄（記入用）:
- GA4 PV/ユーザー数:
- インデックス済み記事数:
- AdSense審査状況:
- 流入上位記事:

---

## 5. 次の記事候補（運用結果を見て優先度を決める）

既存30記事と重複しない角度で。各テーマは「現場が明日確認できる」具体性とチェックリストを意識する。

1. **校務AI活用の具体手順** — 通知文・所見・議事整理など、安全な校務での生成AI活用をステップ・プロンプト例で。既存 `ai-koomu-kaizen-nyumon` / `school-generative-ai-privacy-security` と重複しない「手順」に寄せる。
2. **情報セキュリティ研修** — 校内で行う情報セキュリティ／個人情報研修の設計。既存 `school-training-ict-ai-guide` / `generative-ai-school-training-guide` と差別化し「セキュリティ」に焦点。
3. **保護者向けICT説明** — 端末持ち帰り・データの扱い・家庭での約束ごとを保護者にどう説明するか。保護者会・おたより文例。
4. **特別支援教育におけるAI利用の注意点** — 既存 `special-needs-ict-reasonable-accommodation` の配慮/指導の整理を踏まえ、「AI特有」の注意（実態把握の代替不可・記録の扱い・偏り）に絞る。

> 記事追加時は従来フロー（content/articles に md 追加 → 関連記事相互リンク → validate / build / 内部リンク確認 / sitemap反映）。詳細は [AI_HANDOFF.md](../../AI_HANDOFF.md) を参照。

---

## 参考: 本番確認コマンド（再利用可）

```bash
# 本番トップのGA4 / AdSense / SC / canonical を確認
html=$(curl -fsSL "https://edu-ai-platform-delta.vercel.app/?cb=$(date +%s)")
echo "$html" | grep -o "gtag/js?id=G-[A-Z0-9]*"           # GA4
echo "$html" | grep -o "adsbygoogle.js?client=ca-pub-[0-9]*" # AdSense
echo "$html" | grep -o "google-site-verification[^>]*"     # Search Console
echo "$html" | grep -o "rel=\"canonical\" href=\"[^\"]*\"" # canonical
```

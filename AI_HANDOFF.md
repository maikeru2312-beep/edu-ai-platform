# 教育DXナビ — AI_HANDOFF

次に作業するAI／開発者への引き継ぎメモ。最終更新: 2026-06-27

## このリポジトリの要点

- Next.js 15 (App Router) / TS / Tailwind。コンテンツ駆動の静的サイト。
- 記事は `content/articles/<slug>.md`。frontmatter は `title / description / category / tags / publishedAt / updatedAt`。
  - `category` は `types/index.ts` の `Category` 6種のいずれか（`scripts/validate.mjs` が検証）。
  - slug = ファイル名（英小文字・数字・ハイフンのみ）。
- 記事の読み込み: `lib/articles.ts`（`getAllArticles` / `getArticlesByCategory` / `getArticle`）。
- 内部リンクは本文中に `/articles/<slug>` 形式のMarkdownリンクで記述。記事末に「関連記事」節を置く慣習。
- 記事詳細ページ `app/articles/[slug]/page.tsx` は同カテゴリ記事を自動で関連表示。canonical/OGP/twitter も自動付与。

## 重要な運用ルール（AdSense審査中）

**審査中につき、以下は不用意に変更しない:**
- `app/layout.tsx`（AdSenseスクリプト＝`NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT`、Search Console `verification.google`、metadata/canonical）
- `components/GoogleAnalytics.tsx`、`app/robots.ts`、`app/sitemap.ts`
- 固定ページ（privacy / disclaimer / about / contact / operator）

**記事執筆の方針:**
- 文体は現場教員向けの「ですます調」。独自解説（コピペ禁止、文科省資料・ニュースの転載禁止）。
- 「禁止か活用か」の二択にしない。断定（「絶対安全」等）をしない。
- 公式情報は原本確認を促す注記を入れる。医療・法律・金融の高リスク領域に踏み込まない。
- 各記事に冒頭の免責 blockquote、末尾に「関連記事」節と「まとめ」、`/contact` への導線を置く。

## 作業フロー（記事追加時）

1. `content/articles/<slug>.md` を作成（既存記事のフロントマター＆構成を踏襲）。
2. 関連する既存記事の「関連記事」節へ相互リンクを追加。
3. 検証: `node scripts/validate.mjs` → `npm run build`（型チェック込み）。
4. 内部リンク確認（下記ワンライナー）と sitemap 反映確認。
5. PROJECT_STATUS.md を更新。

### 内部リンク解決チェック（ワンライナー）
```bash
node -e 'const fs=require("fs"),p=require("path"),d="content/articles";const s=new Set(fs.readdirSync(d).filter(f=>f.endsWith(".md")).map(f=>f.replace(".md","")));let b=0;for(const f of fs.readdirSync(d).filter(f=>f.endsWith(".md"))){const t=fs.readFileSync(p.join(d,f),"utf8");const re=/\/articles\/([a-z0-9-]+)/g;let m;while((m=re.exec(t))){if(!s.has(m[1])){console.log("BROKEN",f,"->",m[1]);b++}}}console.log(b?b+" broken":"OK all resolve")'
```

## 既知の注意点

- ~~`npm run lint` は eslintrc 未設定のため対話化~~ → **フェーズ4で解決**。ルート `.eslintrc.json`（`extends: next/core-web-vitals`）を追加し、`npm run lint` は非対話で 0エラー通過。`next build` 内のLintも有効化された。なお `next lint` 自体は Next 16 で廃止予定（deprecation警告のみ・現状エラーなし）。将来は ESLint CLI / flat config への移行が必要。
- ビルドは静的生成（記事はSSG、`generateStaticParams`）。記事追加後は必ず再ビルドで反映確認。

## 直近の作業

> **運用フェーズへ移行**（2026-06-27〜）。コード変更中心の開発は一段落。Search Console 運用・X投稿・本番モニタリングが中心。手順は [docs/ops/operations-memo.md](docs/ops/operations-memo.md)。

### フェーズ5（2026-06-27、GA4本番発火確認）
- ユーザーが Vercel Production に `NEXT_PUBLIC_GA_ID=G-XCORRZCZM5` を設定・再デプロイ。本番をローカルから確認し、**GA4の本番発火を確認（解消）**：トップ・記事サブページとも `googletagmanager.com/gtag/js?id=G-XCORRZCZM5` 出力。AdSense（ca-pub-3801092904087307）・Search Console verification・canonical・robots・sitemap（記事30件）すべて維持、記事表示に影響なし。
- ドキュメント追記のみ（コード・記事・設定ファイルは無変更）。

### フェーズ4（2026-06-27、本番確認 + ESLint）
- 本番（edu-ai-platform-delta.vercel.app）をローカルから確認：トップ正常・記事一覧「全30件」・新規4記事sitemap掲載（2本は200/canonical直接確認）・robots/sitemap正常・AdSense（ca-pub-3801092904087307）・Search Console verification・canonical すべて維持を確認。
- **GA4は本番HTMLに未出力**（Phase 4時点）。`components/GoogleAnalytics.tsx` は `NEXT_PUBLIC_GA_ID` 未設定なら描画しない仕様 → Vercel環境変数未設定が原因（コード無変更）。→ **Phase 5 で `G-XCORRZCZM5` 設定・再デプロイにより発火確認済み**。
- **ESLint非対話化を実装**：原因は設定ファイル皆無で `next lint` が対話化していたこと。ルートに `.eslintrc.json`（`{"extends":"next/core-web-vitals"}`）を追加。`npm run lint` が0エラーで非対話通過、build も通過。最小変更（このファイル追加のみ）。

### フェーズ3（2026-06-27、push後）
- フェーズ1・2の2コミットを `origin/main` へ push 済み（GitHub: maikeru2312-beep/edu-ai-platform、Vercel連携）。
- 新規記事1本追加：[教育AIサービスを学校で使う前に確認したいこと](content/articles/education-ai-service-checklist-before-use.md)（カテゴリ：教材・支援ツール）。AIサービス特有の確認観点＋導入前チェックリスト。free-ict-tools-safety-checklist と差別化。
- 既存5記事へ相互内部リンク追加（free-ict-tools-safety-checklist / school-generative-ai-privacy-security / generative-ai-guideline-v2-school-reading / ai-koomu-kaizen-nyumon / special-needs-ict-reasonable-accommodation）。
- build(51ページ) / validate(記事30) / 内部リンク / sitemap すべて確認済み。今回はコンテンツ記事のみ変更（page.tsx・保護対象は無変更）。
- PROJECT_STATUS.md に「Vercel 本番反映後の確認チェックリスト」を追加。

### フェーズ2（2026-06-27、commit後）
- フェーズ1成果をコミット（`c6f9fd2` Add AdSense review period content updates）。
- 新規記事1本追加：[特別支援教育におけるICT活用と合理的配慮](content/articles/special-needs-ict-reasonable-accommodation.md)（特別支援教育カテゴリ）。合理的配慮と教育課程上の指導・支援の区別＋計画・記録への接続＋チェックリスト。既存4記事と角度で差別化。
- 既存5記事へ相互内部リンク追加。
- トップに「最近更新した記事（updatedAt降順・最大4件）」を追加（`app/page.tsx`）。
- build(51ページ) / validate(記事29) / 内部リンク / sitemap すべて確認済み。

### フェーズ1（2026-06-27）
- 新規記事2本追加（生成AIガイドラインVer.2.0 / デジタル教科書本格導入）。
- 既存7記事へ相互内部リンク追加。
- トップに「特別支援教育 × ICT」導線を追加（`app/page.tsx`）。
- X投稿文10件を `docs/sns/` に保存（md + Buffer CSV）。

詳細は [PROJECT_STATUS.md](PROJECT_STATUS.md)。

## 次の候補タスク

- ~~ESLint 設定の整備（非対話化）~~ → フェーズ4で完了（`.eslintrc.json` 追加）。
- 将来：`next lint`（Next 16で廃止予定）→ ESLint CLI / flat config への移行。
- ~~GA4を使うなら Vercel に `NEXT_PUBLIC_GA_ID` を設定~~ → 設定済み（`G-XCORRZCZM5`、Phase 5で本番発火確認）。GA4測定IDを変更する場合は Vercel 環境変数を更新し再デプロイ。
- 記事一覧（/articles）への更新日表示・ソートの検討。
- 新規テーマ案：校務でのAI活用の具体手順、情報セキュリティ研修、保護者向けICT説明など（既存記事と重複しない角度で）。

## 内部リンク運用メモ
- 既存記事に関連リンクを追加する軽微な編集では、frontmatter の `updatedAt` をあえて据え置いている（更新日のインフレを避けるため）。「最近更新した記事」は実質的な内容更新を反映する想定。方針変更時はこのメモを更新すること。

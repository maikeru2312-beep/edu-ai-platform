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

- `npm run lint` は eslintrc 未設定のため対話プロンプトが出て**非対話実行できない**。CIや自動チェックでは型チェック（`npm run build`）を使うか、ESLint を別途設定する必要がある。整備する場合は審査保護対象の挙動を変えないこと。
- ビルドは静的生成（記事はSSG、`generateStaticParams`）。記事追加後は必ず再ビルドで反映確認。

## 直近の作業

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

- テーマD（教育AIサービス導入チェック記事。free-ict-tools-safety-checklist と差別化）。
- ESLint 設定の整備（非対話化）。
- 記事一覧（/articles）への更新日表示・ソートの検討。

## 内部リンク運用メモ
- 既存記事に関連リンクを追加する軽微な編集では、frontmatter の `updatedAt` をあえて据え置いている（更新日のインフレを避けるため）。「最近更新した記事」は実質的な内容更新を反映する想定。方針変更時はこのメモを更新すること。

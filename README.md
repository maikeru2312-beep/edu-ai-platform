# 教育DXナビ

特別支援教育・ICT活用・AI校務改善・教材・助成金・研修情報を扱う個人運営の教育情報メディアです。

- ログイン機能なし・個人情報収集なし
- 記事（Markdown）と教育情報DB（JSON）でコンテンツを管理
- Vercel でホスティング

## 技術スタック

| 用途 | 採用技術 |
|---|---|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v3 + @tailwindcss/typography |
| 記事フォーマット | Markdown（gray-matter + remark） |
| DBフォーマット | JSON |
| ホスティング | Vercel |

---

## ローカル開発環境のセットアップ

```bash
npm install
npm run dev      # http://localhost:3000
```

---

## 記事の追加方法

### 1. ファイル名の規則

`content/articles/` に `.md` ファイルを作成します。

```
content/articles/tokubetsu-shien-nyumon.md
                 └── 英小文字・数字・ハイフンのみ（URLのslugになります）
```

### 2. フロントマター形式

記事ファイルの先頭に必ず以下の形式で書いてください。

```markdown
---
title: "記事タイトル"
description: "記事の概要（検索結果・OGPに使用）"
category: "特別支援教育"
tags: ["タグ1", "タグ2", "タグ3"]
publishedAt: "2025-06-15"
updatedAt: "2025-06-20"   # 省略可
---

## 本文はここから

Markdownで記述してください。
```

### 3. category の有効値

以下の6つから1つ選んでください。

| 値 | 説明 |
|---|---|
| `特別支援教育` | 障害・発達・合理的配慮など |
| `ICT活用` | タブレット・AAC・EdTechツール |
| `AI校務改善` | AI活用による業務効率化 |
| `教材・支援ツール` | 指導教材・支援グッズ |
| `助成金・補助金` | 申請できる補助金情報 |
| `研修・セミナー` | 教員向け研修・イベント |

---

## 教育情報DBの追加方法

### 1. ファイルの場所

`content/db/` 内の既存JSONファイルに追記するか、新しいJSONファイルを作成します。

```
content/db/
├── grants.json      # 助成金情報
├── ict-tools.json   # ICTツール情報
├── laws.json        # 法令・通知
└── training.json    # 研修情報
```

### 2. JSONの形式

各ファイルはオブジェクトの配列です。

```json
[
  {
    "id": "grant-004",
    "title": "○○財団 教育助成",
    "type": "助成金",
    "category": "特別支援教育",
    "description": "説明文（3〜5行程度）",
    "tags": ["タグ1", "タグ2"],
    "source": "https://example.com",
    "updatedAt": "2025-06-15"
  }
]
```

### 3. 各フィールドの仕様

| フィールド | 必須 | 説明 |
|---|---|---|
| `id` | ✓ | 全ファイルを通じてユニークな文字列 |
| `title` | ✓ | 情報のタイトル |
| `type` | ✓ | 後述の有効値から1つ |
| `category` | ✓ | 記事と同じ6カテゴリから1つ |
| `description` | ✓ | 説明文 |
| `tags` | ✓ | 文字列の配列（空配列可） |
| `source` | — | 一次情報のURL（省略可） |
| `updatedAt` | ✓ | `YYYY-MM-DD` 形式 |

### 4. type の有効値

`法令・通知` / `ツール` / `助成金` / `研修` / `教材` / `研究・報告書`

---

## コンテンツ検証スクリプト

記事・DBを追加したら必ず検証を実行してください。

```bash
npm run validate
```

**検証内容：**

- 記事: フロントマターの必須フィールド・形式・カテゴリ値
- DB: JSON構造・必須フィールド・id重複・型チェック

エラーがあればファイル名と問題箇所を表示します。

---

## Vercelへのデプロイ

### 初回デプロイ

1. このリポジトリをGitHubにpushする
2. [vercel.com](https://vercel.com) でGitHubリポジトリを接続
3. Framework Preset は **Next.js** を選択（自動検出）
4. 環境変数を設定（下記参照）
5. Deploy ボタンをクリック

### 環境変数

Vercelダッシュボードの Settings → Environment Variables で設定してください。

| 変数名 | 説明 | 例 |
|---|---|---|
| `SITE_URL` | 本番サイトのURL（末尾スラッシュなし） | `https://edu-dx-navi.vercel.app` |

### 記事・DB更新後の再デプロイ

GitHubにpushすると Vercel が自動でビルド・デプロイします。

```bash
npm run validate   # コンテンツ検証
npm run build      # ローカルビルド確認（任意）
git add content/
git commit -m "記事追加: ○○の解説"
git push
```

---

## ページ一覧

| URL | 説明 |
|---|---|
| `/` | トップページ |
| `/articles` | 記事一覧 |
| `/articles/[slug]` | 記事詳細 |
| `/categories/[category]` | カテゴリ別記事一覧 |
| `/db` | 教育情報DB一覧 |
| `/privacy` | プライバシーポリシー |
| `/disclaimer` | 免責事項 |

## カテゴリURLスラグ対応表

| カテゴリ | URL |
|---|---|
| 特別支援教育 | `/categories/tokubetsu-shien` |
| ICT活用 | `/categories/ict` |
| AI校務改善 | `/categories/ai-koomu` |
| 教材・支援ツール | `/categories/kyozai` |
| 助成金・補助金 | `/categories/joseikin` |
| 研修・セミナー | `/categories/kenshu` |

---

## テンプレートの使い方

`content/templates/` に記事・DBの追加用テンプレートがあります。

### 記事テンプレート

| ファイル | 向く記事の種類 |
|---|---|
| `ict-practice-template.md` | ICTツール・アプリの実践・活用事例 |
| `news-explain-template.md` | 法令・通知・政策ニュースの解説 |
| `db-guide-template.md` | 助成金・研修・ツールのDB情報を記事で紹介 |

**使い方：**
1. テンプレートをコピーして `content/articles/スラグ名.md` に保存
2. フロントマターを埋める（`【】` の部分を実際の内容に置き換える）
3. HTMLコメント `<!-- ... -->` はすべて削除する
4. `npm run validate` でエラーがないことを確認

### DBテンプレート

| ファイル | 用途 |
|---|---|
| `grant-template.json` | 助成金・補助金の新規エントリ |
| `training-template.json` | 研修・セミナーの新規エントリ |
| `resource-template.json` | ツール・法令・教材・報告書の新規エントリ |

**使い方：**
1. テンプレートのオブジェクトをコピーして `content/db/` の適切なJSONファイルに追記
2. `_usage` / `_valid_types` / `_valid_categories` キーは削除する
3. `id` は既存エントリと重複しないユニークな値にする
4. `npm run validate` でエラーがないことを確認

---

## コンテンツ品質基準

記事・DB情報を追加する際は以下の基準を守ってください。

### 事実確認（必須）

- [ ] 掲載する情報の一次情報源（公式サイト・法令DB）をURLで確認した
- [ ] 助成金・研修の金額・期限・対象要件を公式サイトで確認した
- [ ] 外部リンクのURLが正常にアクセスできることを確認した

### 個人情報・プライバシー（絶対禁止）

- 児童・生徒の氏名・診断名・写真は一切掲載しない
- 特定個人が識別できる事例を掲載しない
- 読者に個人情報の入力を求める仕組みを作らない

### 記事の誠実性

- 「必ず効果がある」「採択される」等の断定表現を使わない
- AI生成テキストをそのまま公開しない（必ず人間が確認・加筆する）
- 情報が古くなった場合は `updatedAt` を更新し、必要に応じて冒頭に注記を入れる

### DB情報の信頼性

- `source` フィールドには必ず公式URLを入れる（個人ブログ・まとめサイトは避ける）
- 変動する情報（助成金の期限・金額）は description に「要公式サイト確認」と明記する
- 架空の情報・推測での記載をしない

---

## 運用ディレクトリ構成

```
content/
├── articles/      # 公開済み記事（Markdown）← ここにコンテンツを追加
├── db/            # 教育情報DB（JSON）← ここにデータを追加
└── templates/     # テンプレート（参照用・公開されない）

planning/          # 企画・計画ドキュメント（参照用・公開されない）
├── initial-articles.md    # 初期記事20本の企画書
└── db-expansion-plan.md   # DB50件拡充計画
```

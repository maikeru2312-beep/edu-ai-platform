# PDF ビルドメモ（商品A 無料PDF）

対象：『学校で生成AIを使う前に確認したい10のチェックリスト』（無料配布版）
最終更新：2026-06-29

## 成果物

| ファイル | 内容 |
|---|---|
| `school-generative-ai-checklist-free.pdf` | 配布用PDF（A4縦・7ページ・ページ番号入り） |
| `school-generative-ai-checklist-free.html` | ビルド中間ファイル（印刷用CSS付きHTML。原本） |
| `PDF_BUILD_NOTES.md` | 本メモ |

原稿（Markdown）：`../free-ai-checklist-draft.md` / `../free-ai-checklist-outline.md`

## ビルド手順（再現方法）

1. **HTML → PDF（レイアウト）**：Microsoft Edge のヘッドレスで印刷出力。
   ```
   msedge --headless --disable-gpu --no-pdf-header-footer \
     --run-all-compositor-stages-before-draw --virtual-time-budget=12000 \
     --print-to-pdf=_raw.pdf  file:///.../school-generative-ai-checklist-free.html
   ```
   - A4・余白・改ページはHTML側の `@page` と `.page { page-break-after: always }` で制御。
2. **ページ番号付与**：PyMuPDF(fitz) で各ページ下中央に `N / 総数` を重ねる（Edgeのheadless print-to-pdfはCSSのページ番号を出力しないため後段で付与）。
3. **目視QA**：fitz で各ページを135dpiのPNGに書き出して確認（中間PNGはリポジトリに含めない）。

ビルドスクリプト（セッション用・リポジトリ外）：scratchpad の `build_pdf.py`。

## 設計上のポイント

- フォント：`Yu Gothic`（日本語）。Windows標準フォントで再現可能。
- チェックボックスは全角 `□`（`- [ ]` は変換ツール依存で崩れるため不採用）。
- 構成（全7ページ）：
  1. 表紙（独立）
  2. はじめに＋3つの前提
  3. チェック①〜③
  4. チェック④〜⑥
  5. チェック⑦〜⑨
  6. チェック⑩＋おわりに（有料導線）
  7. 1ページ印刷用チェックシート（単独印刷用フッター付き）
- 配色は青系1色＋グレーの清潔な実務トーン。過度な装飾なし。

## QA結果（2026-06-29）

| # | 確認 | 結果 |
|---|---|---|
| 1 | 表紙が独立 | ✅ 1ページ目に独立 |
| 2 | 6〜8ページ | ✅ 7ページ |
| 3 | □ が崩れない | ✅ 本文・印刷シートとも正常 |
| 4 | 印刷シートが見やすい | ✅ 罫線枠・日付/目的欄・10項目・フッター明瞭 |
| 5 | 個人情報/AI丸投げ禁止/方針優先の注意 | ✅ 表紙免責・前提1〜3・項目②③・シート脚注に残存 |
| 6 | 有料導線が強すぎない | ✅ 「準備中」基調の控えめなカード2件のみ |
| 7 | 実在児童・勤務校・校内資料の想起 | ✅ なし（すべて一般化・架空） |
| 8 | PDFとして開ける | ✅ fitzで7ページ正常オープン |
| 9 | 各ページ画像化で崩れ確認 | ✅ 見切れ・改ページ崩れなし |

## 再ビルドが必要なとき

原稿（`../free-ai-checklist-draft.md`）を直したら、対応箇所を本 `.html` にも反映し、上記手順で再生成する。HTMLが原本である点に注意（PDFは生成物）。

## 残課題

- 表紙のロゴ画像などビジュアル要素は未挿入（テキストのみ）。必要なら追加。
- 配布手段（note無料記事／自サイト固定ページ、メール登録の要否）は未確定。
- 公開前に人による最終目視（架空事例・断定表現）を実施すること。

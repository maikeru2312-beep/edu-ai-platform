# メディア化 Phase 2: 文章の熱量改善＋独自図解 実施レポート

作成日: 2026-07-09
ブランチ: `release/content-voice-visuals`（main 最新 = AdSense対策マージ後 `5e56848` から分岐）
関連: [ADSENSE_REVIEW_READY_REPORT.md](./ADSENSE_REVIEW_READY_REPORT.md)（Phase 1）

## 1. 目的

AdSense再審査対策（Phase 1）で構造を整えた主力記事について、文章が平坦で量産的に見えないよう、
教育現場の実務者が書いていると伝わる熱量・強弱・判断軸を加える。あわせて必要最小限の独自図解を追加し、
読者理解とサイト独自性を高める。外部フリー素材は使用せず、すべて自作の軽量Reactコンポーネントで実装。

## 2. 対象記事と実施内容

### 2-1. 文章改善の方針（全記事共通）

1. **冒頭の改善** — 一般論・制度説明起点をやめ、現場の迷い・違和感・指が止まる瞬間から始め、「だから何を判断するか」へつなぐ（不安は煽らない）
2. **強い見出し** — 各記事1〜2個、判断軸が伝わる見出しへ転換
3. **editorial voice** — 「本サイトでは〜と考えます」「学校現場では〜が問題になります」等、匿名でも編集方針が伝わる文を各記事3〜5箇所
4. **平坦な箇条書きの削減** — チェック項目に「なぜ確認するのか」を補足、類似表現の連発を語彙分散
5. **安全性** — 所見・支援計画・行動記録の記事で、要配慮個人情報・保護者対応（開示可能性・合意範囲）の注意を明確化。個別事例はすべて架空を維持

### 2-2. 記事別の主な変更

| 記事 | 冒頭 | 強い見出し（例） | 図解 |
|---|---|---|---|
| generative-ai-guideline-v2-school-reading | 職員室で「使っていいんですか」に答えに詰まる場面から | 「便利さより先に、守るべき情報がある」 | AiUseBoundaryDiagram |
| education-ai-service-checklist-before-use | 登録ボタンの手前で指が止まる瞬間から | 「契約する前に、『やめられるか』を確認する」 | PrivacyCheckFlow |
| chatgpt-tsuchihyo-shoken | メモを貼り付ける手前の迷いを「正しい感覚」と肯定 | 「AIに任せてよいのは『表現』まで。『評価』は教師が引き受ける」 | ShokenDraftWorkflow |
| individual-education-plan-writing-guide | 「この子のことを書いた気がしない」という違和感から | 「評価は、きれいな文章より『次の支援につながるか』が大事」 | SupportPlanCycle |
| special-needs-behavior-record-guide | 「悪い記録を集めているようで気が引ける」後ろめたさから | 「行動記録は、子どもを責めるための記録ではない」 | BehaviorRecordThreeLayers |

## 3. 追加した図解（すべて自作・外部素材なし）

| コンポーネント | 内容 |
|---|---|
| components/diagrams/DiagramFigure.tsx | 共通ラッパー（figure / figcaption / role="img" + aria-label で alt 相当を提供） |
| components/diagrams/AiUseBoundaryDiagram.tsx | AIに任せる / 教師が判断 / 校内ルールで確認 の3領域 |
| components/diagrams/PrivacyCheckFlow.tsx | 入力してよい情報かの確認フロー（個人名→要配慮情報→匿名化→校内ルール） |
| components/diagrams/ShokenDraftWorkflow.tsx | 事実メモ→AI下書き→教師修正→校内チェック→通知表（AI関与範囲を色分け） |
| components/diagrams/SupportPlanCycle.tsx | 実態把握→目標→手立て→評価→次の調整の循環 |
| components/diagrams/BehaviorRecordThreeLayers.tsx | 事実 / 解釈 / 次の支援 の3層分離（記入例は架空と明記） |

- Tailwind のみで実装（外部画像・外部フォント・クライアントJSなし。全てサーバーコンポーネント）
- 配色は既存デザイン（white / gray-200 / rounded-xl / blue系）に合わせた落ち着いたトーン
- スマホは縦積み、sm以上で横並び（flex/grid + 矢印の向き切替）でレスポンシブ対応

## 4. 挿入方式（既存レンダリングを壊さない実装）

記事はMarkdown→remark-html（`sanitize: false`）→`dangerouslySetInnerHTML` の構成でMDX非対応のため、
**HTMLコメントマーカー方式**を採用:

- 記事md内に `<!--diagram:キー-->` を1行で記述（remarkがそのまま素通しすることをパイプライン実測で確認済み）
- 新規 [components/ArticleBody.tsx](../components/ArticleBody.tsx) が contentHtml をマーカーで分割し、間に図解コンポーネントを描画
- 未知のキーは無視して本文のみ表示（記事を壊さないフェイルセーフ）
- [app/articles/[slug]/page.tsx](../app/articles/[slug]/page.tsx) は prose の div を `<ArticleBody>` に差し替えたのみ（クラス・構造は維持）

## 5. 表示確認結果（ビルド成果物での実地確認）

| 項目 | 結果 |
|---|---|
| 対象5記事のビルドHTML | ✅ 各記事に図解1つ（role="img"）をレンダリング、マーカー残存 0 |
| figcaption / aria-label | ✅ 出力確認（例:「図：所見づくりの分担フロー」） |
| マーカーなし記事（対照: kyoiku-dx-kiso） | ✅ 従来どおり prose 描画、編集方針カードも維持 |
| sitemap.xml | ✅ 43 URL のまま（Phase 1 の /db /news 除外を維持） |
| /db /news の noindex | ✅ `noindex, follow` 維持 |

## 6. 検証結果

| 項目 | 結果 |
|---|---|
| `npm run lint` | ✅ 0 warnings / 0 errors |
| `npm run build` | ✅ 成功（51/51ページ静的生成） |
| `npm run validate` | ✅ 全通過 |
| PIIスキャン（差分追加行） | ✅ 実名・勤務先・自治体名・メールアドレス・秘密情報なし |
| 混入チェック | ✅ .env / node_modules / 生成物なし（変更は app/ components/ content/ operations/ とドキュメントのみ） |

## 7. 追加リスクがないこと

- 図解は静的なサーバーコンポーネントのみで、クライアントJS・外部リクエスト・外部素材を追加していない（CSP/パフォーマンス影響なし）
- マーカー方式は後方互換（マーカーのない29記事のレンダリング結果は不変）
- SEO設定（sitemap / robots / noindex / canonical / AdSense / GA4 / Search Console verification）には一切触れていない
- 記入例・事例はすべて架空。煽り・断定過多・医療/法律/行政判断の代替表現は追加していない

## 8. 反映前に人間が確認する項目

1. 5記事をプレビューし、図解の見た目（スマホ幅含む）と本文の文脈接続を目視確認
2. editorial voice の記述（「本サイトでは〜と考えます」等）が運営者の実際の立場と一致するか確認
3. main へのマージ → Vercel デプロイ → 本番表示確認

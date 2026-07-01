# スケジュール作成テンプレート（穴埋め式）

最終更新: 2026-07-02 / 担当: コンテンツ班

`POSTING_QUEUE.csv` を次の期間分に補充するときの手順と型です。6カテゴリをバランスよく回すのが基本方針です。

---

## 作り方の手順
1. 期間を決める（3〜4週間分）。
2. 下の「週の型」に沿って、曜日ごとにカテゴリを割り当てる。
3. `X_POSTS/x_posts_by_category.csv` の在庫から本文を選ぶ／新規に書く。
4. 各行の `link` を送客先記事URL（`.../articles/<slug>`）にする。
5. 3〜4週で全6カテゴリが登場し、偏りがないか確認。

## 週の型（例：週6本）
| 曜日 | カテゴリ（回す） |
|------|----------------|
| 月 | AI校務改善 |
| 火 | 特別支援教育 |
| 水 | ICT活用 |
| 木 | 教材・支援ツール／助成金（交互） |
| 金 | PDF導線 or AI校務改善 |
| 土 | 研修・セミナー／特別支援（交互） |

## CSV行の穴埋め型
```
id,scheduled_date,platform,type,theme,body,link,hashtags,status
〈Qxx〉,〈YYYY-MM-DD〉,X,〈article_intro/tip/funnel〉,〈カテゴリ〉,"〈完成文・140字目安〉",https://edu-ai-platform-delta.vercel.app/articles/〈slug〉,〈#タグ2〜3〉,draft
```

## 配分チェック（期間全体で）
- [ ] 6カテゴリすべてが1回以上入っているか
- [ ] AI校務改善／特別支援／ICT が主軸（各多め）になっているか
- [ ] PDF導線が期間に1〜2本入っているか
- [ ] 同じ記事への送客が連日で偏っていないか

## 送客先slug一覧（コピペ用）
- AI校務改善: chatgpt-teacher-beginner-guide / chatgpt-tsuchihyo-shoken / ai-class-newsletter-prompt / ai-koomu-kaizen-nyumon / school-generative-ai-privacy-security
- 特別支援教育: individual-education-plan-writing-guide / reasonable-accommodation-school-record / special-needs-behavior-record-guide / special-needs-visual-schedule-support / special-needs-parent-collaboration
- ICT活用: kyoiku-dx-kiso / giga-device-lesson-use-guide / giga-school-device-troubleshooting / information-morals-education-themes / google-forms-school-use-guide
- 教材・支援ツール: education-ai-service-checklist-before-use / free-ict-tools-safety-checklist / ict-teaching-tools-selection-guide
- 助成金・補助金: joseikin-guide-2025 / education-grant-search-guide
- 研修・セミナー: generative-ai-school-training-guide / school-training-ict-ai-guide

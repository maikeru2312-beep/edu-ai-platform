# 第6回審査 — Owner 判断記録

前回のクロージャで `OWNER_DECISION_REQUIRED` として差し戻した3件について、Owner の判断が示された。
本書はその確定記録である。以降、これら3件を再質問しない。

```text
OWNER-1: APPROVED
OWNER-2: APPROVED
OWNER-3: APPROVED
approved_at: 2026-08-22
```

- Repository: `https://github.com/maikeru2312-beep/edu-ai-platform.git`
- PR: [#19](https://github.com/maikeru2312-beep/edu-ai-platform/pull/19)
- Branch: `claude/adsense-sixth-review-original-value-e14484`
- 判断時点の HEAD: `5d60c334172bc45a7134cce5ba9b0c0482834077`

---

## OWNER-1 — KEEP 2記事への限定的な asset 追加：APPROVED

### 対象

- `reasonable-accommodation-school-record`
- `special-needs-visual-schedule-support`

### 経緯

指示書 §5 は KEEP 11記事について「大規模リライトをしない」としていた。
一方 §10 は「単なる `OFFICIAL_SOURCE_SUMMARY` だけの canonical article は禁止」としていた。

独立プロファイリングの結果、上記2件がこの禁止条件に該当していた。

| slug | 判定 | 資産の状態 |
|---|---|---|
| `reasonable-accommodation-school-record` | OFFICIAL_SOURCE_SUMMARY / 汎用度 HIGH | 「実質 NONE に近い」。手続は parent-collaboration、ICT は ict-reasonable-accommodation、計画は individual-education-plan へ既に明け渡していた |
| `special-needs-visual-schedule-support` | PROCEDURE_GUIDE / 汎用度 HIGH（60〜70%） | 名前のついた再利用資産が無かった |

実装側は §10 を「結果」に対する強い禁止、§5 を「方法」の制約と解釈し、
既存節の格上げと総論の圧縮という最小の追加で、名前のついた再利用資産を1つずつ持たせた。

- `reasonable-accommodation-school-record` → 配慮記録の書き換え表（6欄の空欄様式＋3類型の書き換え対応表＋完全な架空の記入例）
- `special-needs-visual-schedule-support` → 視覚支援の見直し記録シート（9欄。1ツール1枚で時系列に1行ずつ足す）

### Owner 判断

**APPROVED。** 第6回仕様の
`canonical article must not be OFFICIAL_SOURCE_SUMMARY only`
を満たすため、既存内容を基礎とした named practical asset の付与は妥当である。
全面リライトではなく、canonical page として成立させるための限定的補強として扱う。

**revert 禁止。**

---

## OWNER-2 — 公開15記事の `updatedAt` が 2026-08-22 で共通：APPROVED

### 経緯

Post-fix レビュー（Review A）が、公開15記事の `updatedAt` が全件 `2026-08-22` で同一であることを
HIGH として指摘し、「記事ごとに改稿の重さが違うのだから3〜4段階に割れるはず」と提案した。

実装側はこれを採らなかった。今回の再構成では **15記事すべての本文に実際に変更が入っている**
（統合先2件・REPAIR 4件に加え、残る9件も重複ブロックの削除と委譲リンク化を行っている）ため、
日付を人工的に散らすことは事実に反するからである。

代わりに次の3点を実装した。

1. About に「2026年8月22日に全体を見直したため15本すべて同じ日付になっている。以降は
   内容に影響する訂正を行った記事だけ更新する」旨を明記
2. homepage の「最近更新した記事」モジュールは、全記事の `updatedAt` が同一のときは
   何も伝えないため非表示にする（日付に差が生まれたら自動で復活する）
3. 記事ヘッダーの「最終確認」表示自体は変更しない

### Owner 判断

**APPROVED。** 今回15記事すべてに実変更が入っているため、同一日付は事実として正しい。
**日付を人工的に散らしてはならない。** 上記の開示方針を維持する。

---

## OWNER-3 — branch 名：APPROVED

### 経緯

指示書の推奨 branch 名は `fix/adsense-sixth-review-original-value` だったが、
実作業は clean な main（`1488efb`）から分岐済みの worktree branch
`claude/adsense-sixth-review-original-value-e14484` 上で行った。
分岐元・remote・作業内容は指示書の要件と一致しており、相違は branch 名のみ。

### Owner 判断

**APPROVED。** `claude/adsense-sixth-review-original-value-e14484` をそのまま使用する。
**rename 不要。**

---

## 本記録の位置づけ

この3件は Owner 承認済みであり、以降のレビュー・クロージャで
`OWNER_DECISION_REQUIRED` の対象として再提起しない。

`OWNER_DECISION_REQUIRED` を再び使うのは、この3件とは別の、
本当に Owner の判断を要する新しい事項が発生した場合に限る。
実装上の判断を Owner へ差し戻すために使わない。

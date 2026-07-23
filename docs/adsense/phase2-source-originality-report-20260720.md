# AdSense改善 第2段階：出典・統合・独自性レポート

実施日: 2026-07-21  
判定: **条件付き未完了**

## 実施内容

- 公開15記事から高・中リスクの主要主張を45件に分解して監査した。
- 記事slugごとの参考資料データへ移行し、資料名、発行主体、公開・改訂日、URL、確認対象、最終確認日を表示した。
- 文部科学省、個人情報保護委員会、文化庁、国立特別支援教育総合研究所の資料を使用した。
- 未確認の時間短縮、品質向上、現場で一般的、多くの教員などの表現を削除または限定した。
- MERGE 11件の固有価値を5本の中核記事へ統合し、旧slugへ301リダイレクトを設定した。
- UNPUBLISH 4件は無関係な転送をせず404を維持した。
- 実用成果物5点を中核記事内へ追加した。
- about/operatorから未確認の実務経験断定を除き、編集責任と確認可能な方針に整理した。

## 主張監査の集計

| 状態 | 件数 | 扱い |
|---|---:|---|
| VERIFIED | 20 | 一次資料を表示し、表現を維持または限定 |
| PARTIALLY_VERIFIED | 8 | 一次資料で裏づく範囲へ限定 |
| UNVERIFIED | 2 | 効果保証・一般化を削除または書き換え |
| OUTDATED | 0 | 公開15記事の主要監査対象にはなし |
| USER_CONFIRMATION_REQUIRED | 15 | 記事ごとの実務妥当性を確認票へ集約 |

詳細は `article-claim-source-audit-20260720.csv` を参照。

## 追加した独自成果物

1. `special-needs-behavior-record-guide`: ABC行動記録の空欄様式と完全な架空例。
2. `individual-education-plan-writing-guide`: 計画の公開・引継ぎ前チェックリスト。
3. `school-generative-ai-privacy-security`: 入力前匿名化・送信可否と出力後確認の二段階チェック。
4. `ict-teaching-tools-selection-guide`: ICT教材・支援ツール選定マトリクス。
5. `digital-textbook-introduction-school-changes`: 紙とデジタルを使い分ける判断表。

選定理由は、公開15記事の中核テーマに直接対応し、実在事例や効果を創作せず、読者が自分の条件を書き込めるためである。

## 条件付き未完了の理由

- 15記事の実務手順と架空例について運営者確認が未回答。
- 一次資料は主要主張を監査したが、運営者回答後に残す実務経験表現の最終調整が必要。
- 正確な `ads.txt` 行はAdSense管理画面からのユーザー入力待ち。
- 本番反映、Search Console、公開後のHTTP・インデックス監査は未実施。

## 2026-07-24 追記：運営者確認の反映

- 全15記事の実務経験について運営者本人の回答を受領・反映。`USER_CONFIRMATION_REQUIRED` は解消。
- `article-claim-source-audit-20260720.csv` の FIRSTHAND_EXPERIENCE 15件を更新：経験A/B=13件を `VERIFIED`（KEEP）、経験C=記事3・5の2件を `UNVERIFIED`（REWRITE、実経験非掲載）。全体の状態は VERIFIED 33 / PARTIALLY_VERIFIED 8 / UNVERIFIED 4。
- 経験A/B=13記事に実務経験注記（`lib/article-experience-notes.ts`）を追加。効果の実証・具体的な時短時間・全校導入等は断定していない。
- 公開プロフィールを `/operator`（全文）・`/about`（要約）へ反映。
- 残る条件は正確な `ads.txt` 行（AdSense管理画面）と本番反映後の監査のみ。

## 第3段階の入口

1. `operator-experience-review-20260720.md` に回答する。
2. 回答に基づき15記事と匿名プロフィール候補を最終調整する。
3. 正確な `ads.txt` 行を取得する。
4. 変更をレビュー後にcommit・push・deployする。
5. 本番の301、404、sitemap、canonical、robots、広告配信、参考資料リンクを再監査する。
6. Search Consoleでクロール状況を確認し、反映を待ってから再審査可否を判断する。

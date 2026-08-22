# 第6回審査 — 最終確認レビュー（C/D レンズ：法務・一次資料 / IA・redirect・AdSense・テストハーネス）

**判定: PASS_WITH_NONBLOCKING_FINDINGS**

- レビュー実施日: 2026-08-22
- レビュー対象 HEAD: `39ecdec`（`fix: close escalated findings from the final confirmation review (A/B lenses)`）
- 実施者: 独立レビュアー（実装者ではない）。本ファイル1件のみを新規作成し、他のリポジトリファイルは編集していない。
- 立場: docs 配下の記述・コミットメッセージ・テストが緑であることは根拠として採用しない。条文は e-Gov 法令検索 API から原文を取得し、告示・ガイドラインは発行元 PDF/HTML を取得し、ルーティングは `npm run build` + `npm run start` に対する実 HTTP で確認した。

---

## 0. 監査条件に関する重要な注記（先に読むこと）

**監査中に、同じ作業ツリーを別セッションが編集していた。**

- 監査開始時の HEAD は `fad8dee`、作業ツリーは clean だった。この状態で全項目を1周計測した。
- 17:15〜17:18（JST）に、`docs/adsense-sixth-review/11-review-ab-final-confirmation.md`（480行・新規）と
  content 6ファイル・`scripts/sixth-review-original-value.test.mjs` が外部から書き換えられ、
  作業ツリーが dirty になった。17:20 頃に `39ecdec` としてコミットされた。
- 本レビュアーはこれらの変更を一切戻していない（他セッションの作業を破棄しないため）。
- **本書の全数値は、コミット後の `39ecdec`・clean tree に対して計測し直したものである。**
  `fad8dee → 39ecdec` の差分は content 6件 + テスト閾値1件 + docs 1件のみで、
  `app/` `components/` `lib/` `middleware.ts` `next.config.mjs` `package.json` は**バイト単位で不変**
  （`git diff --name-only fad8dee 39ecdec -- app components lib middleware.ts next.config.mjs package.json` が空）。
  したがって AdSense 配信範囲・IA・redirect の計測結果は両 HEAD で同一である。
- 副作用として、初回計測時に検出した2件（`同法第68条` の指示語誤り／`chatgpt-tsuchihyo-shoken` の架空明示欠落）は
  `39ecdec` で既に解消されていた。本書ではそれらを finding として残さず、§4 の「初回計測後に解消済み」に記録する。
- **プロセス上のリスクとして記録する**: 受入ゲート（`npm run test:mutation`）は clean tree を前提に
  `git checkout -- <file>` で復元する。今回は mutation 対象ファイル
  （`components/Footer.tsx` / `app/layout.tsx` / `middleware.ts` /
  `content/articles/school-generative-ai-privacy-security.md` /
  `content/articles/giga-device-lesson-use-guide.md` /
  `docs/adsense-sixth-review/01-canonical-value-registry.csv`）と
  外部セッションの編集ファイルが偶然重ならなかったため実害は出ていないが、
  重なっていれば**他セッションの未コミット編集を無警告で破棄していた**。
  同時編集は避けるか、mutation 実行前に必ず `git status` を確認する運用が要る。

なお、本書自体を作成した時点で `docs/` に untracked ファイルが1件増えるため、
次に `npm run test:mutation` を走らせる者は先に本書をコミットするか stash する必要がある。

---

## 1. 検証の方法

### 1.1 一次資料の取得元（すべて本レビューで実際に取得した）

| 資料 | 取得方法 | 結果 |
|---|---|---|
| 障害を理由とする差別の解消の推進に関する法律 | e-Gov API `/api/1/lawdata/425AC0000000065` | HTTP 200・54,403 bytes・第2条/第6〜11条を抽出 |
| 個人情報の保護に関する法律 | e-Gov API `/api/1/lawdata/415AC0000000057` | HTTP 200・590,804 bytes・第2条/第20条/第27条/第61条/第63条/第64条/第68条/第69条を抽出 |
| 個人情報の保護に関する法律施行令 | e-Gov API `/api/1/lawdata/415CO0000000507` | HTTP 200・第2条を抽出 |
| 学校教育法施行規則 | e-Gov API `/api/1/lawdata/322M40000080011` | HTTP 200・第134条の2/第139条の2/第140条/第141条の2 を抽出 |
| 著作権法 | e-Gov API `/api/1/lawdata/345AC0000000048` | HTTP 200・第35条を抽出 |
| 地方独立行政法人法 | e-Gov API `/api/1/lawdata/415AC0000000118` | HTTP 200・第21条/第68条を抽出 |
| 内閣府「障害を理由とする差別の解消の推進に関する基本方針」（令和5年3月14日閣議決定） | `https://www8.cao.go.jp/shougai/suishin/sabekai/kihonhoushin/r05/txt/honbun.txt`（cp932、20,289字） | HTTP 200 |
| 文科省「所管事業分野における…対応指針」通知・別添 | `https://www.mext.go.jp/content/20240117-mxt_tokubetu02-000033332_1.pdf`（22p）／`_2.pdf`（34p） | HTTP 200 |
| 文科省「初等中等教育段階における生成AIの利活用に関するガイドライン（Ver.2.0）」 | `https://www.mext.go.jp/content/000332373.pdf`（38p・44,152字を pypdf で抽出） | HTTP 200 |

### 1.2 実行したコマンド

```
npm test                # 33 pass / 0 fail
npm run validate        # 通過（記事30件 + DB 4ファイル11件）
npm run typecheck       # 通過（exit 0）
npm run lint            # exit 1（→ Finding M2）
npm run build           # 成功（静的33ページ／記事15ルート／カテゴリ4ルート／middleware 34.8 kB）
npm run test:mutation   # 10 / 10 検出、作業ツリー完全復元
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-TEST npm run build   # AdSense 配信範囲の確認用
npm run build           # 環境変数なしで再ビルド（.next を元に戻した）
npm run start           # localhost:3000 に対する実 HTTP 計測。計測後に停止済み
```

`npm run start` で起動したサーバーは毎回停止した（`port3000=000` を確認）。
`NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT` を付けたビルドの後、環境変数なしで再ビルドし、
`.next/server/app` に `adsbygoogle|pagead2` を含むファイルが残っていないことを確認済み。
最終状態の `git status --porcelain` は空（本書作成前）。

---

## 2. 項目ごとの結論（実測値）

### 法務・一次資料

**① 障害者差別解消法の適用区分 — 適合**

e-Gov 原文で確認した構造:

- 第7条（見出し「行政機関等における障害を理由とする差別の禁止」）第2項 = 行政機関等の合理的配慮義務
- 第8条（見出し「事業者における…」）第2項 = 事業者の合理的配慮義務（両項の文言は同一の「…しなければならない」）
- 第2条第3号「行政機関等」= 国の行政機関、独立行政法人等、地方公共団体、地方独立行政法人
- 第2条第6号「地方独立行政法人」からは **地方独立行政法人法第21条第3号（公営企業型）のみ**が除外される

したがって公立学校・国立大学法人立の学校・**公立大学法人立の学校**はいずれも第7条第2項側、
私立学校（学校法人）は第8条第2項側。これは `reasonable-accommodation-school-record.md:14`
（「国公立学校では…第7条第2項、私立学校等の事業者では第8条第2項です（事業者の義務化は2024年4月1日施行）」）
および `special-needs-ict-reasonable-accommodation.md:62`・`special-needs-parent-collaboration.md:110`
の記述と一致する。改正法（令和3年法律第56号）の施行日が2024-04-01であることは、
文科省対応指針の本文（「令和３年の法改正により、法的義務へと改められた」）および
対応指針の施行日「令和６年４月１日」と整合する。

さらに `special-needs-parent-collaboration.md:282` は、
**国立大学法人立・公立大学法人立の学校が「障害者差別解消法では第7条第2項（行政機関等）／個人情報保護法では第27条（個人情報取扱事業者の側）」と逆転する**
点を明示している。両法の条文を突き合わせた結果、この指摘は正しい
（個情法第2条第11項第3号は別表第二法人を、同項第4号は地独法第21条第2号業務を目的とする法人を「行政機関等」から除くのに対し、
障害者差別解消法第2条第6号は第21条第3号のみを除く）。**この記述は本レビューが確認した範囲でもっとも精度が高い部分の一つである。**

**② 「過重な負担」の判断要素の帰属 — 適合**

内閣府基本方針「（2）過重な負担の基本的な考え方」の原文が挙げる要素は
**事務・事業への影響の程度／実現可能性の程度／費用・負担の程度／事務・事業規模／財政・財務状況**の5つ。
`reasonable-accommodation-school-record.md:137` は
「事務・事業への影響の程度、実現可能性の程度、費用・負担の程度などを考慮して、個別の事案ごとに具体的に判断する（内閣府の基本方針。…）」
と、**法ではなく基本方針に帰属**させたうえで「など」で残りを含意している。
`special-needs-ict-reasonable-accommodation.md:62` も
「**「過重な負担」の判断要素を示しているのは内閣府の基本方針**です」と明示。帰属先は正しい。
なお「負担が過重でないとき」という要件自体は法第7条第2項・第8条第2項に置かれており、本文もそのように書き分けている。

**③ 対応指針（事業者向け）と対応要領（設置者）の区別 — 適合**

文科省通知（5文科初第1788号・令和6年1月17日）原文:

- 「法第 11 条第１項の規定に基づき，…対応指針（平成27年文部科学省告示第180号）の一部を改正し，令和６年４月１日から施行」
- 対象は「学校法人，…学校設置会社，…の事業者」
- 「**各教育委員会及び公立学校，国立大学…は本指針の直接の対象ではありません**」
- 公立側は「法第 10 条第１項の規定に基づき，…都道府県対応要領／市町村対応要領」

別添指針本文も「本指針は，法第11条第1項の規定に基づき，また，…基本方針…に即して，法第8条に規定する事項に関し」と自己定義している。
`special-needs-parent-collaboration.md:114`（「文部科学省の対応指針は私立学校等の事業者向けで、公立学校には設置者が定める対応要領が対応します」）と
`reasonable-accommodation-school-record.md:14`・`:137`・`:160` の書き分けは、いずれもこの区別を正確に反映している。
`lib/article-references.ts:112-113` の `accommodationGuideline.supports` も同旨を明記している。
限定的な留保は Finding L5 を参照。

**④ 個人情報保護法の適用分岐 — 適合**

e-Gov 原文で照合した結果:

| 本文の記述 | 原文 | 判定 |
|---|---|---|
| 第20条第2項 = 要配慮個人情報の取得に原則本人同意 | 「…あらかじめ本人の同意を得ないで、要配慮個人情報を取得してはならない」 | 一致 |
| 第27条第2項 = オプトアウトから要配慮個人情報を除外 | 同項ただし書「…要配慮個人情報又は第二十条第一項の規定に違反して取得されたもの…である場合は、この限りでない」 | 一致 |
| 公立学校（行政機関等）は取得が第64条、目的外の利用・提供が第69条 | 第64条（適正な取得）／第69条（利用及び提供の制限） | 一致（下記の留保あり） |
| 第69条第2項第1号に本人同意の例外 | 「本人の同意があるとき、又は本人に提供するとき。」 | 逐語一致 |
| 第2条第1項第1号／第3項／第5項／第6項／第11項 | 個人情報／要配慮個人情報／仮名加工情報／匿名加工情報／行政機関等 | すべて項番一致 |
| 施行令第2条第1号（障害）・第2号（健康診断等の結果）・第3号（指導・診療・調剤）、病歴は法第2条第3項に直接 | 施行令第2条柱書が「本人の病歴又は犯罪の経歴に該当するものを除く」 | 一致 |
| 第69条第1項・第27条第1項・第27条第1項第2号の引用文 | 逐語一致 | 一致 |

留保: 行政機関等側の第64条は「偽りその他不正の手段により個人情報を取得してはならない」であって、
要配慮個人情報の取得に同意を求める規定ではない（保有そのものの制限は第61条）。
`ai-koomu-kaizen-nyumon.md:80` は「取得は第64条、目的外の利用・提供は第69条の**枠組みで判断します**」と
枠組みの提示にとどめており、同意要件があるとは書いていないため、誤りとまでは言えない。指摘レベルには達しないと判断した。

**⑤ 学校教育法施行規則第134条の2「意向を踏まえつつ」の一貫性 — 適合**

原文第134条の2第2項:
「校長は、前項の規定により個別の教育支援計画を作成するに当たつては、当該児童等**又はその保護者の意向を踏まえつつ**、あらかじめ、関係機関等と当該児童等の支援に関する必要な情報の共有を図らなければならない。」

`special-needs-parent-collaboration.md:247` のブロック引用は**逐語一致**（強調記号を除く）。
第139条の2・第141条の2 の引用文も逐語一致。第140条が小・中・義務教育学校・**高等学校**・中等教育学校を対象とすることも原文どおりで、
`:260` の「第141条の2は高等学校の通級にも及びます」は正しい。

`individual-education-plan-writing-guide.md:35` も
「学校教育法施行規則第134条の2は「意向を踏まえつつ」と定めており、作成そのものに保護者の同意を要件としているわけではありません」
と同じ整理をしており、公開15記事のうち本条に触れる2記事で表現が一貫している。矛盾は検出されなかった。

**⑥ 著作権法第35条 — 適合**

原文第35条第1項は「その授業の過程における利用に供することを目的とする場合には」と定める。
`ai-class-newsletter-prompt.md:178`（「第35条は「授業の過程における利用」を対象とする規定で、保護者向けの学級通信への掲載は授業目的の範囲を超えます」）は正確。
`:180` のガイドライン要約も原文（p.16）と照合して一致:
「教師が、既存の著作物と同一又は類似のものを、学校の HP に掲載することや、保護者向けの学級通信や職員会議・PTA 活動で利用するなどの授業目的の範囲を超えて利用する場合は、授業の過程における利用には当たらず、同条が適用されないため、他の権利制限規定の適用がない場合は著作権侵害となる可能性がある。…生成 AI を利用する場合もこれらの考え方は同様となり」

**⑦ 生成AIガイドライン Ver.2.0 の引用 — 適合**

PDF 全文（38ページ・44,152字）から抽出して照合。

| 本文 | 原文（p.15） | 判定 |
|---|---|---|
| `ai-koomu-kaizen-nyumon.md:62`「**個別契約等に基づき**適切なセキュリティ対策が講じられた環境で運用している場合を除き、成績情報等の重要性の高い情報をプロンプトに入力してはならない」 | 「個別契約等に基づき適切なセキュリティ対策が講じられた環境で生成 AI を運用しているような場合を除き、プロンプトに重要性の高い情報である成績情報等を入力してはならない」 | 一致（語順の整理のみ。**「個別契約等に基づき」は保持されている**） |
| `:33`「私用アカウントや、教育情報セキュリティ管理者の許可を得ていない私用端末を用いてはならない」 | 同文（読点なし） | 一致 |
| `ai-class-newsletter-prompt.md:14`「【学校からの情報発信】の区分に「各種お便り（学年・学級だより、給食だより、保健だより等）・通知文・案内文の**たたき台を作成する**」」 | Box-4 に同文 | 逐語一致 |
| `chatgpt-tsuchihyo-shoken.md:50`「ガイドライン（Ver.2.0）の本文に「所見」という語は出てきません」 | 抽出テキスト中の「所見」出現回数 = **0** | 一致（PDF テキスト抽出に依拠する点は留保） |

**⑧ `lib/article-references.ts` の裏づけ・本文が名指しする資料・URL の生存 — 概ね適合、Finding M1 あり**

- 登録 URL **31本すべてが HTTP 200**（リダイレクト追跡込み、User-Agent 付き GET で実測）。デッドリンク 0。
- 公開15記事すべてに記事固有の参考資料が付いている（`npm test` の該当ゲートとは独立に、`ARTICLE_REFERENCES` のキー集合を目視照合）。
- `supports` に書かれた内容を原典と突き合わせた結果、抽出できた範囲で反証は出なかった。とくに
  - `disabilityBasicPolicy.supports`（過重な負担の判断要素／本人を補佐して行う表明／表明が無い場合の建設的対話） → 基本方針原文で確認
  - `accommodationGuideline.supports`（補佐して行う表明を含む点／法第11条に基づく事業者向け／公立には対応要領） → 対応指針・通知原文で確認
  - `copyrightActWork.supports`（著作権法第2条第1項第1号） → 原文で確認
  - `mextSecurityPolicy.supports`（第2編9.4「約款による外部サービスの利用」／「有償、無償に関わらず」） → 記事本文の対応記述と整合。PDF 全文照合は未実施（留保）
- **未解決**: 本文が名指しする公的資料のうち4箇所が参考資料欄に登場しない（Finding M1）。

**⑨ first-hand experience の境界 — 適合**

`lib/article-experience-notes.ts` は11件（scope A: 6 / B: 5）。公開15記事のうち経験C の4記事
（`digital-textbook-introduction-school-changes` / `ai-class-newsletter-prompt` / `free-ict-tools-safety-checklist` / `google-forms-school-use-guide`）には注記なし。
未公開記事に残存する注記は 0。

個別に本文と突き合わせた結果、**境界の逸脱は検出されなかった**。とくに検査したのは:

- `ai-koomu-kaizen-nyumon` の注記「掲載する5業務で生成AIを利用した経験を示すものではありません」
  → 本文 `:207` に「以下の**5つ**は例示です」とあり、表に通知表所見／学級通信・学年だより等／会議メモ・議事録／指導案・教材案／アンケート・自由記述の整理の5行がある。
  記事タイトルは「4つの校務ゲート」に改題されているが、注記が言う「5業務」は**改題前の遺物ではなく現在の本文の5行を指している**。整合。
- `special-needs-parent-collaboration` の注記「特別支援学校で保護者との面談・相談の場に**同席した**経験があります」
  → 本文は一人称の実施主張を置かず、判断手順と様式のみ。scope B と整合。
- 効果・時短・全校導入・契約担当の主張は注記・本文とも 0。

**⑩ 架空例の明示・効果の未立証な主張 — 概ね適合、Finding L6 あり**

- 「架空」の明示回数（公開15記事）: 最小0（`special-needs-ict-reasonable-accommodation`）〜最大23（`individual-education-plan-writing-guide`）。
  0 の1記事については Finding L6。`chatgpt-tsuchihyo-shoken` は初回計測時 0 だったが `39ecdec` で2箇所追加され解消。
- 効果の未立証な主張: 数値主張（○時間削減／○%改善／残業が○）は**本文・注記とも 0**。
  加えて `ai-koomu-kaizen-nyumon.md:25`・`ai-class-newsletter-prompt.md:25`・`chatgpt-tsuchihyo-shoken.md:12` に
  「効果を測っていない」旨の明示的な打ち消しがある。
- 「これは本サイトの判断です」による自作ルールの明示は `ai-koomu-kaizen-nyumon.md:221` に存在。
  同種の自作ルールで明示が付いていない箇所が1つある（Finding L3）。

### IA / redirect / AdSense

**⑪ canonical 記事数・sitemap・カテゴリ・orphan・リンク — 適合**

| 検査 | 実測値 |
|---|---|
| 記事ファイル総数 | 30 |
| 公開（canonical） | **15** |
| カテゴリ分布 | 特別支援教育 6 / ICT活用 3 / AI校務改善 3 / 教材・支援ツール 3（助成金・補助金 0、研修・セミナー 0） |
| `/sitemap.xml` の `<loc>` 数 | **26**（トップ1 + `/articles` 1 + カテゴリ4 + 記事15 + 固定5）。`/db` `/news` `/news/*` `/categories/joseikin` `/categories/kenshu` は不在 |
| `/articles` の記事リンク | 15（重複除く） |
| トップの記事リンク | 8 |
| 公開記事 → 未公開・不存在記事へのリンク | **0** |
| 自己リンク | **0** |
| 公開記事 → redirect 元へのリンク | **0** |
| orphan（被リンク0の canonical） | **0**（最小の被リンク数は `chatgpt-tsuchihyo-shoken` と `google-forms-school-use-guide` の各1） |
| アンカーテキストと着地先タイトルの不一致（14字以上のアンカー） | **0** |
| 空カテゴリのページ | `/categories/joseikin` `/categories/kenshu` ともに 404 |

`npm test` とは独立に自前スクリプトでリンクグラフを再構築して確認した。
14字未満の短いアンカー（例: `chatgpt-tsuchihyo-shoken.md:138` の `[校務ゲート1](/articles/ai-koomu-kaizen-nyumon)`）は
着地先タイトルの部分文字列ではないが、リンク先記事内の節名を指す意図的な短縮であり、テストも同じ基準で除外している。読者を誤導しない範囲と判断した。

**⑫ middleware の全 redirect（実 HTTP） — 適合**

`npm run start`（HEAD `39ecdec`）に対する実測。10件すべて **301 / 1ホップ / 公開記事へ 200 着地**。

| 旧 slug | 応答 | `Location` | 追跡後 |
|---|---|---|---|
| `chatgpt-teacher-beginner-guide` | 301 | `/articles/ai-koomu-kaizen-nyumon` | 200（1ホップ） |
| `giga-school-device-troubleshooting` | 301 | `/articles/giga-device-lesson-use-guide` | 200（1ホップ） |
| `kyoiku-dx-kiso` | 301 | `/articles/giga-device-lesson-use-guide` | 200（1ホップ） |
| `microsoft-copilot-teacher-guide` | 301 | `/articles/education-ai-service-checklist-before-use` | 200（1ホップ） |
| `tablet-ict-jugyo-giga` | 301 | `/articles/giga-device-lesson-use-guide` | 200（1ホップ） |
| `generative-ai-guideline-v2-school-reading` | 301 | `/articles/ai-koomu-kaizen-nyumon` | 200（1ホップ） |
| `school-generative-ai-privacy-security` | 301 | `/articles/ai-koomu-kaizen-nyumon` | 200（1ホップ） |
| `ai-lesson-preparation-prompt` | 301 | `/articles/ai-koomu-kaizen-nyumon` | 200（1ホップ） |
| `ict-teaching-tools-selection-guide` | 301 | `/articles/special-needs-ict-support-tools-checklist` | 200（1ホップ） |
| `tokubetsu-shien-ict` | 301 | `/articles/special-needs-ict-support-tools-checklist` | 200（1ホップ） |

着地先4件（`ai-koomu-kaizen-nyumon` / `giga-device-lesson-use-guide` / `education-ai-service-checklist-before-use` / `special-needs-ict-support-tools-checklist`）は
いずれも redirect 元ではなく、`published: false` でもない。多段は 0。
クエリ付き（`?x=1`）でも 1ホップ。末尾スラッシュ付きのみ 2ホップ（Finding I4）。

**⑬ 退役 `information-morals-education-themes` — 適合**

`GET /articles/information-morals-education-themes` = **404**。
`middleware.ts` に当該 slug のエントリなし（コメント `:19` で理由も明示）。fake redirect は無い。
同様に 301 を持たない未公開4件（`education-grant-search-guide` / `generative-ai-school-training-guide` / `joseikin-guide-2025` / `school-training-ict-ai-guide`）もすべて 404（Finding I5）。

**⑭ `/db` `/news` — 適合**

| パス | 実測 |
|---|---|
| `/db` | 404 |
| `/db/` | 308 → `/db` → 404（Next の末尾スラッシュ正規化） |
| `/news` | 404 |
| `/news/2026-06-20-education-dx-official-news` | 404 |
| `/news/anything` | 404 |

`app/db/page.tsx` `app/news/page.tsx` `app/news/[slug]/page.tsx` はいずれも `notFound()` を即時に呼ぶだけ。
sitemap（26 loc）に不在。レンダリング済み HTML 26ページ（トップ・一覧・カテゴリ4・固定5・記事15）を横断 grep した結果、
`href="/db…"` `href="/news…"` は **0件**。ナビゲーション（`components/Header.tsx` / `components/Footer.tsx` / `app/page.tsx`）にも無い。

**⑮ AdSense の配信範囲 — 適合**

`NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-TEST npm run build` の生成物 `.next/server/app` 内 HTML **29件**を全数走査:

- `adsbygoogle|pagead2` を含む: **記事詳細15件のみ**
- 含まない: `_not-found.html` / `about.html` / `articles.html` / `categories/*.html`（4） / `contact.html` / **`db.html`** / `disclaimer.html` / `index.html` / **`news.html`** / `operator.html` / `privacy.html`

さらに同じ環境変数付きで `npm run start` し、実行時に確認:

| パス | HTTP | ページ内の AdSense 参照 |
|---|---|---|
| `/articles/ai-koomu-kaizen-nyumon` | 200 | **2** |
| `/articles/information-morals-education-themes` | 404 | 0 |
| `/articles/nonexistent-xyz` | 404 | 0 |
| `/news/anything`, `/db`, `/news`, `/not-a-page` | 404 | 0 |
| `/`, `/articles`, `/about`, `/categories/ict` | 200 | 0 |

`app/articles/[slug]/page.tsx` は `notFound()` を `return` より前で呼ぶため、**解決に失敗した記事詳細では AdSense が出力されない**ことを実行時に確認できた
（`04-verification.md` §6 が「実行時には検証していない」としていた点を、本レビューで実測により埋めた）。

検証後、**環境変数なしで再ビルド**した。再ビルド後の `.next/server/app` に `adsbygoogle|pagead2` を含む HTML は 0件（`page.js` チャンクにも残存なし）。
環境変数なしの `npm run start` で `/articles/ai-koomu-kaizen-nyumon` の AdSense 参照は 0。

### テストハーネス

**⑯ 各コマンドの実行結果（HEAD `39ecdec`）**

| コマンド | 結果 |
|---|---|
| `npm test` | **33 pass / 0 fail / 0 skip**（duration 486ms） |
| `npm run test:mutation` | **10 / 10 検出、作業ツリー完全復元**（開始時・終了時とも clean tree アサーション通過） |
| `npm run validate` | 通過（記事30件・DB 4ファイル11件） |
| `npm run audit` | `npm test && npm run validate` の合成。両者が通るため通過 |
| `npm run typecheck` | 通過（exit 0） |
| `npm run lint` | **exit 1**（→ Finding M2） |
| `npm run build` | 成功。静的33ページ／記事15ルート（SSG）／カテゴリ4ルート（SSG）／middleware 34.8 kB。ただし出力に `⨯ ESLint: Plugin "@next/next" was conflicted…` の1行（→ Finding M2） |

**⑰ mutation の検出力と復元 — 適合**

10件すべて検出。内訳と、それぞれが「テキスト置換で検出しただけ」でないかの確認:

| mutation | 検出 | 備考 |
|---|---|---|
| 旧ポジショニングを1箇所だけ戻す | ✓ | `components/Footer.tsx` の実文言 |
| 統合記事を公開へ戻す | ✓ | frontmatter を実際に反転 |
| 退役記事に fake redirect | ✓ | `middleware.ts` に実エントリ追加 |
| 301 先を誤らせる | ✓ | 実エントリ書換 |
| 301 を多段にする | ✓ | 実エントリ書換 |
| registry から1行削除 | ✓ | CSV 実削除 |
| 独自価値を一次資料要約に | ✓ | CSV 実書換 |
| 2記事に同じ reader job | ✓ | CSV 実書換 |
| 公開記事→未公開記事リンク | ✓ | 本文の実リンク書換 |
| AdSense を layout へ | ✓ | `{/* adsbygoogle */}` の挿入。ゲート側は `/adsbygoogle\|AdSenseScript/` を見るので `<AdSenseScript />` の実挿入も同じテストが落とす。**弱い mutation ではない** |

終了時 `assertCleanTree` 通過。`git status --porcelain` 空。

**⑱ 反証不能な受入ゲートの残存 — 部分的に残存（開示済み）**

| ゲート | 反証可能性 |
|---|---|
| §8「every registry entry declares a substantive primary unique value」 | CSV の整形式検査のみ。**コード中のコメント（`:193-196`）で自ら「独自価値が実在することの証明ではない」と開示している** |
| §10「no two canonical articles share the same primary reader job」 | 同上（`:230-231` で開示） |
| §11「distinctness matrix …」 | 105ペアの網羅と verdict 値域の検査。verdict は実装者が書ける |
| §11b「backed by a computable signal」 | **本文から計算**（見出し Jaccard ≤0.20 / 12-gram 重なり ≤0.12）。CSV から独立。反証可能 |
| §16「firsthand experience claims are not widened」 | registry の `firsthand_boundary` と `lib/article-experience-notes.ts` の**一致**を見る。両方とも実装者が書く。実際の経験の有無は機械検査不能 |
| §18「skeleton does not become more uniform」 | 現状値を上限とするラチェット。**増加方向のみ**検出（設計として明記） |

§11b の導入により「CSV を書き替えるだけで通る」状態は解消されている。
ただし §11b が測るのは**語彙の重なり**であって**読者ジョブの同一性**ではない。
語彙を変えたまま同じ仕事を扱う2記事は §11b を通過しうる。この残余は
コード中で明示されており（「独自性の実質的な根拠は…人手レビューにある」）、隠された自己申告ではない。
§16 は原理的に機械検査できない領域であり、注記本文自体が範囲を限定する書き方になっているため、
「反証不能だが誠実に開示されている」区分と評価した（Finding I1・I2）。

---

## 3. Finding 一覧

### MEDIUM

---

**M1 — 本文が名指しする公的資料4箇所が参考資料欄に登場せず、URL も確認日も無い**

- severity: **MEDIUM**（非ブロッキング）
- 該当箇所:
  - `content/articles/individual-education-plan-writing-guide.md:69` — 「**文部科学省「障害のある子供の教育支援の手引」**：支援計画の位置づけや関係機関との連携の考え方が整理されています」
  - `content/articles/individual-education-plan-writing-guide.md:71` — 「**特別支援学校学習指導要領解説（自立活動編）**：自立活動の6区分の内容に加えて…」
  - `content/articles/special-needs-ict-reasonable-accommodation.md:63` — 「学校教育での具体的な考え方は、文部科学省「障害のある子供の教育支援の手引」が実務に近い資料です」
  - `content/articles/special-needs-behavior-record-guide.md:158` — 「文部科学省「生徒指導提要」令和4年改訂版——チームでの支援やアセスメントの考え方が整理されています」
- 問題: いずれも「**一次資料のどこを開くか**」「**公的資料に立ち返る**」という見出しの下で、読者に開くよう勧めている資料である。
  にもかかわらず `lib/article-references.ts` に対応するエントリが無く、記事下部の参考資料欄にも出ない。
  結果として、リンクも発行年も最終確認日も示されないまま資料名だけが提示される。
  `individual-education-plan-writing-guide.md:68` の学校教育法施行規則や `:70` の参考様式は同じ箇条書きの中で参考資料欄に載っているため、
  **同じリストの中で扱いが割れている**。
- 正しくは: 本文が読者に開くよう勧める公的資料は、他の資料と同様に `ARTICLE_REFERENCES` に登録し、
  URL・発行主体・公開/改訂・確認対象・最終確認を示す。あるいは、参考資料欄に載せない方針であれば
  本文側から「開くべき資料」としての名指しを外し、一般的な言及にとどめる。
- 根拠: `components/ArticleReferences.tsx:12-13` が参考資料欄を「記事中の制度・方針・仕様に関する確認に使用した一次資料です」と定義しており、
  本文で「一次資料」として名指しした資料が欄に無いのは、この自己定義と食い違う。
  また `docs/adsense-sixth-review/04-verification.md` は「本文が名指しする資料が参考資料欄に登場するか」を満たしたとする記述を持たないため、既存レビューでも未カバーと見られる。
- 推奨修正: 3資料を `sources` に追加し、該当3記事の `ARTICLE_REFERENCES` に足す。
  URL の実在は本レビューでは未確認のため、追加時に HTTP 200 と掲載日を確認すること。
  受入ゲートとして「本文中の `文部科学省「…」` パターンが `lib/article-references.ts` に現れる」検査を1本足すと再発を防げる。

---

**M2 — `npm run lint` が exit 1 で失敗し、`npm run build` にも `⨯ ESLint` 行が出る**

- severity: **MEDIUM**（非ブロッキング。サイト出力には影響しない）
- 該当箇所: `.eslintrc.json`（プロジェクト直下、全3行）
- 実測:
  - worktree で `npm run lint` → `Plugin "@next/next" was conflicted between ".eslintrc.json » …" and "..\..\..\.eslintrc.json » …"`、**exit 1**
  - 同じコマンドを親リポジトリ `C:\Project\web\edu-dx-navi` で実行 → `✔ No ESLint warnings or errors`、**exit 0**
  - `npm run build` は成功するが、標準出力に `⨯ ESLint: Plugin "@next/next" was conflicted…` を1行出す
- 問題: worktree が `.claude/worktrees/` 配下、すなわち**親リポジトリの内側**に置かれているため、
  ESLint の設定カスケードが親の `.eslintrc.json` まで遡り、同じプラグインが二重に解決されて衝突する。
  `.eslintrc.json` に `"root": true` が無いことが原因。
  この運用（`.claude/worktrees` 配下でのレビュー）が常用されている以上、環境固有の偶発ではなく再現する構成上の問題である。
  受入コマンド7本のうち1本が常に赤になる状態は、緑/赤の信号としての価値を損なう。
- 正しくは: `.eslintrc.json` を `{ "root": true, "extends": "next/core-web-vitals" }` にする。
- 根拠: ESLint のカスケード仕様（`root: true` に到達するまで祖先ディレクトリの設定を探索する）。
  親リポジトリ直下での実行が緑であることが、原因の切り分けになっている。
- 推奨修正: `"root": true` の1行追加。`docs/adsense-sixth-review/04-verification.md` の
  「`npm run lint` 警告のみ」という記述は現状と食い違う（実際は exit 1）ので、あわせて更新する。

---

### LOW

---

**L1 — 同一 URL の資料2件を React の `key` に使っており、キーが重複する**

- severity: **LOW**
- 該当箇所: `lib/article-references.ts:170` と `:305`（ともに `url: 'https://laws.e-gov.go.jp/law/415AC0000000057'`）／`components/ArticleReferences.tsx:17`（`key={reference.url}`）
- 問題: `personalInfoActDefinitions`（第2条）と `personalInfoAct`（第27条・第69条）は同じ e-Gov の法令 URL を持つ。
  この2件は `ai-koomu-kaizen-nyumon` の参考資料に**同時に**含まれるため、同一ページ内で `key` が重複する。
- 実測: 実際のレンダリング結果では7件すべてが表示されており（本レビューで HTML から抽出して確認）、読者に見える欠落は無い。
  ただし React は重複キーを警告し、将来リストが動的化された場合に再利用の不整合を招きうる。
- 正しくは: `key` に slug 内で一意なもの（`reference.title`、または `sources` のキー名）を使う。
- 根拠: React のリスト描画契約（兄弟間で key は一意）。
- 推奨修正: `key={reference.title}` に変更するか、`ArticleReference` に `id` を追加する。

---

**L2 — 受入ゲートの名前が、そのゲートが実際に検査する内容と逆に読める**

- severity: **LOW**
- 該当箇所: `scripts/adsense-audit.test.mjs:52`
- 問題: テスト名は `404 metadata has one explicit noindex policy` だが、本体は
  `assert.doesNotMatch(source, /robots:/)` を `app/not-found.tsx` `app/layout.tsx` `app/db/page.tsx`
  `app/news/page.tsx` `app/news/[slug]/page.tsx` に対して掛けており、**`robots` メタデータが一切無いこと**を要求している。
  「explicit noindex policy を持つ」という名前とは逆である（実際の noindex ポリシーは HTTP 404 ステータスのみ）。
- 正しくは: 名前を実態に合わせる（例: `404 pages rely on the HTTP status alone and declare no conflicting robots metadata`）。
- 根拠: 同ファイル `:52-61` の本体コード。
- 推奨修正: テスト名の変更のみ。挙動は変えない。

---

**L3 — ガイドラインの2つの別々の記述を「かつ」で結んだ自作ルールに、「本サイトの判断」の明示が無い**

- severity: **LOW**（安全側への逸脱であり、読者に不利益は生じない）
- 該当箇所: `content/articles/ai-koomu-kaizen-nyumon.md:64`
- 問題: 「例外になるのは、**個別契約等に基づき適切なセキュリティ対策が講じられた環境で運用していること**（環境の条件）と、
  **入力した情報が応答結果の出力以外の目的に使われないことを確認していること**（確認の行為）が、いずれも満たされる場合です。どちらか一方では足りません」
  という連言は、ガイドライン Ver.2.0 の p.15 ②（成績情報等の重要性の高い情報）と p.15-16 ③（個人情報）という
  **別々の項目**を統合したもので、原文が「かつ」で結んでいるわけではない。
  直前の段落が「文部科学省のガイドライン（Ver.2.0）は…としています」で始まるため、
  「つまり」で導かれるこの連言もガイドラインの内容と読まれうる。
- 正しくは: 同記事 `:221` が自作ルールに対して「**これは本サイトの判断です**」と明示しているのと同じ扱いにする。
- 根拠: ガイドライン原文 p.15「② 情報セキュリティの確保」と「③ 個人情報やプライバシー、著作権の保護」は独立した項目であり、
  ②は「重要性の高い情報である成績情報等」を、③は「個人情報」を対象としている。
- 推奨修正: `:64` に「2つを合わせて既定値とするのは本サイトの整理です」の一文を足す。内容の変更は不要（原文より厳しい側であり、安全）。

---

**L4 — `04-verification.md` が現在の HEAD・テスト数・AdSense 検証状況と食い違う**

- severity: **LOW**
- 該当箇所: `docs/adsense-sixth-review/04-verification.md:6`（`Base HEAD: 1488efb…`）、§5 の表（`npm test` **31 pass**）、§5 の注（HEAD `5d60c334` で再実測）、§6 末尾（「AdSense の実配信は…**実行時には検証していない**」）、§5 の `npm run lint`「警告のみ」
- 実測との差: 現 HEAD は `39ecdec`。`npm test` は **33 pass**。AdSense の実行時検証は本レビューで実施済み（§2⑮）。`npm run lint` は警告ではなく **exit 1**。
- 問題: 同ドキュメントは §5 で「文章を合わせるのではなく再実測で確定した」と宣言しているが、その後の3コミットで再び陳腐化した。
  「クロージャ時点の実測記録」として参照されると、実態より2件少ないテスト数と、既に埋まった検証ギャップを伝える。
- 正しくは: 最終 HEAD で再実測して更新するか、冒頭に「この記録は `5d60c334` 時点のものであり、以後のコミットは 07〜12 の各レビューが担う」と適用範囲を書く。
- 根拠: 本レビューでの再実測値（§1.2・§2⑯）。
- 推奨修正: `04-verification.md` の §5 表と §6 の AdSense 行を更新し、Base HEAD を明記し直す。

---

**L5 — 「国公立学校については設置者が定める対応要領が…具体化しています」は、公立では努力義務であり不存在もありうる**

- severity: **LOW**（確信度は中。読者を実害に導く可能性は低い）
- 該当箇所: `content/articles/reasonable-accommodation-school-record.md:14`、`content/articles/special-needs-parent-collaboration.md:114`
- 問題: 障害者差別解消法第10条第1項は、地方公共団体等職員対応要領について「定めるよう**努めるものとする**」と定める努力義務であり、
  内閣府基本方針も「地方分権の観点から、対応要領の作成は努力義務とされているが、積極的に取り組むことが望まれる」と述べている。
  本文の断定形は、自治体に必ず対応要領があるかのように読める。
- 正しくは: 「国公立学校については設置者が定める対応要領が（**定められている場合は**）具体化しています」のように留保を付ける。
- 根拠: e-Gov 原文 第10条（「…対応要領を定めるよう**努め**なければならない」）。内閣府基本方針「第1 3（2）基本方針と対応要領・対応指針との関係」。
  なお、国の行政機関・独立行政法人等（国立大学法人立の学校を含む）については第9条第1項で「定めるものとする」であり、こちらは義務。
- 推奨修正: 両箇所に留保を1語足す。両記事とも直後に「自校にどれが当てはまるかは設置形態で変わります」
  「所属校・設置者のルールで確認してください」があるため、実害は限定的。

---

**L6 — `special-needs-ict-reasonable-accommodation` だけ「架空」の明示が0回**

- severity: **LOW**
- 該当箇所: `content/articles/special-needs-ict-reasonable-accommodation.md`（`架空` の出現 **0**。他14記事は2〜23回）
- 問題: 同記事の例（`:35` `:36` `:44` `:45` の「例：板書を読むのが難しい子が…」等）は
  具体的な事例記述ではなく類型の例示であるため、実在事例と誤読される危険は低い。
  ただし、`39ecdec` で `chatgpt-tsuchihyo-shoken` に架空明示が追加された結果、
  **公開15記事のうち本記事だけが架空注記を持たない**状態になった。
  `04-verification.md` §7 の「架空例 すべて「架空」と明示」という記述も、この記事については点検の対象外である。
- 正しくは: 例示が類型にとどまることを1行で示す（「以下は特定の児童生徒の事例ではなく、仕分けの型を示す例です」等）か、
  「架空注記が不要な記事」であることを registry / verification 側に明記して、基準のばらつきを意図的なものとして記録する。
- 根拠: 全公開記事の `架空` 出現回数の実測。
- 推奨修正: 一文の追加。なお受入ゲート `fictionalNotice <= 11`（`scripts/sixth-review-original-value.test.mjs:549`）は上限のラチェットなので、追加しても落ちない。

---

### INFO（修正を要求しないが記録する）

- **I1** — 独自価値・distinctness のゲート（§8・§10・§11）は実装者が書いた CSV の整形式検査であり、単独では反証不能。
  §11b が本文から計算した重なりで裏づけを与えているが、測っているのは語彙の重なりであって読者ジョブの同一性ではない。
  この限界は `scripts/sixth-review-original-value.test.mjs:193-196` `:230-231` `:286-291` で自ら開示されている。
  **隠された自己申告ではないため finding には上げない。**
- **I2** — §16（firsthand experience）は registry の宣言と注記ファイルの一致を見るもので、経験の実在は機械検査できない。
  注記本文が範囲を限定する書き方（「…を示すものではありません」）になっていること、および registry の
  `firsthand_boundary` 欄が根拠を書いていることで補われている。所有者の確認回答が唯一の一次情報である点は変わらない。
- **I3** — `scripts/adsense-audit.test.mjs:89` の `assert.equal(articles.size, 30)` は、
  未公開の下書きを1本置いただけでも落ちる。意図的な固定だが、記事を書き始める作業と衝突する。
- **I4** — 末尾スラッシュ付きの旧 URL（`/articles/kyoiku-dx-kiso/`）は 308 → 301 の 2ホップで着地する（Next.js の既定の正規化）。
  クエリ・フラグメント付きは 1ホップ。外部からの被リンクに末尾スラッシュが含まれる場合のみ影響する。
- **I5** — 301 を持たない未公開記事が退役1件のほかに4件ある
  （`education-grant-search-guide` / `generative-ai-school-training-guide` / `joseikin-guide-2025` / `school-training-ict-ai-guide`。すべて 404 を実測）。
  これは受入ゲート（`adsense-audit.test.mjs:138-141`）が明示的に意図した状態であり、fake redirect を避ける方針と整合する。
- **I6** — 監査中の同時編集（§0）。mutation harness が `git checkout -- <file>` で復元する以上、
  同時編集は他セッションの未コミット作業を破棄しうる。今回は対象ファイルが重ならず実害なし。

---

## 4. 初回計測（`fad8dee`）後に、外部セッションによって解消された事項

参考として記録する。本レビューが `fad8dee` で検出し、`39ecdec` で既に直っていたもの:

| 内容 | `fad8dee` | `39ecdec` |
|---|---|---|
| `special-needs-parent-collaboration.md:276` の指示語 | 「なお**同法**第68条は…」（直前の引用が個情法第2条第11項のため、個情法第68条＝漏えい等の報告と誤読される） | 「なお**地方独立行政法人法**第68条は…」に修正済み。地独法第68条（名称の特例）の原文と一致 |
| `chatgpt-tsuchihyo-shoken.md` の架空明示 | 0回 | 2回（依頼文例と記入例の双方に注記） |
| `chatgpt-tsuchihyo-shoken.md:50` の節名参照 | 「Gate 1 で止まったあと、自校の扱いをどう調べるか」（着地先に同名の見出しなし） | 「校務ゲート1で止まったあと、自校の扱いを調べる」＝ `ai-koomu-kaizen-nyumon.md:115` の見出しと一致 |
| `reasonable-accommodation-school-record.md:51` の節名参照 | 「面談・相談記録シート」 | 「面談1回分の記録シート」＝ `special-needs-parent-collaboration.md:174` の見出しと一致 |
| `special-needs-parent-collaboration.md:297` の節名参照 | 「共有範囲・保管・廃棄をどう決めるか」 | 「この文書を、誰まで共有し・どう保管し・どう捨てるか」＝ `individual-education-plan-writing-guide.md:302` の見出しと一致 |

本レビューで、上記の節名参照4件が実在の見出しに解決することを再確認した。

---

## 5. 総括

**第6回審査の再構成は、審査に出せる状態にある。判定は PASS_WITH_NONBLOCKING_FINDINGS。**

法務・一次資料の側は、本レビューで条文原文・閣議決定・告示・ガイドライン PDF に当たった範囲で
**誤りが1件も出なかった**。とくに次の3点は、二次情報を写した記事では成立しない精度である。

1. 障害者差別解消法（第7条第2項／第8条第2項）と個人情報保護法（第27条／第69条）で、
   国立大学法人立・公立大学法人立の学校の区分が**逆転する**ことを、両法の定義規定に遡って正しく書き分けている。
2. 「過重な負担」の判断要素を法ではなく**内閣府の基本方針**に帰属させ、
   文科省の対応指針が**法第11条に基づく事業者向け**であり公立学校には設置者の対応要領が対応する、という三層を崩さずに保っている。
3. 生成AIガイドライン Ver.2.0 の「**個別契約等に基づき**」を落とさずに引用し、
   「ガイドライン本文に『所見』の語は無い」という**不在の主張**まで検証可能な形で書いている（実際に0件だった）。

IA・redirect・AdSense は、ドキュメントの主張ではなく実 HTTP で確認した。
canonical 15本すべて 200、redirect 10本すべて 301・1ホップ・公開記事へ 200 着地、
退役記事と `/db` `/news` はすべて 404 で fake redirect なし、sitemap は 26 URL で余計な項目なし、
AdSense は `ca-pub-TEST` 付きビルドで**記事詳細15ページにのみ**出力され、404 に落ちた記事詳細では出力されない。
検証後に環境変数なしで再ビルドし、生成物から AdSense 参照が消えていることも確認した。

テストハーネスは実質を伴っている。mutation 10/10 検出・作業ツリー完全復元は、
本レビューが clean tree の状態で自分で実行して確認した。
「実装者が書いた CSV を CSV で検査する」構造は完全には消えていないが、§11b が本文から計算した
重なりの上限を課しており、かつ**残る限界がコード中で明示的に開示されている**。
自己申告を隠して緑にする種類のゲートは検出されなかった。

未解決の指摘は MEDIUM 2件・LOW 6件で、いずれも**審査の可否を左右しない**。
そのうち審査前に直す価値が最も高いのは **M1**（本文が「一次資料に当たれ」と勧める4資料が参考資料欄に無い）である。
これはサイト自身のポジショニング（公的資料と実務手順から整理する）を、
読者から見て一箇所だけ裏切っている形になっているためで、修正コストも小さい。
**M2**（`npm run lint` が exit 1）は出力物には無影響だが、受入コマンド7本のうち1本が
常に赤である状態は次のレビューの信号を鈍らせるので、`"root": true` の1行で解消しておくことを勧める。

最後に、§0 の同時編集について。本レビューは初回計測を `fad8dee` で行い、
途中で外部セッションが同じ作業ツリーを書き換えたため、全項目を `39ecdec` で計測し直した。
本書の数値はすべて `39ecdec`・clean tree のものである。
ただし、レビュー対象が監査中に動くこと自体が受入ゲートの前提（clean tree）を壊しうるため、
最終確認は「コミットを固定してから1名が通す」運用にしたほうがよい。

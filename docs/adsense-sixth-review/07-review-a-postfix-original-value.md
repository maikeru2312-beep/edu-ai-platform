# Review A（再構成後）: Original Value / AdSense / Site Identity

**判定: PASS_WITH_NONBLOCKING_FINDINGS**

ただし条件つきです。「有用性の低いコンテンツ」という不承認理由に対しては、canonical 15本の独自価値は実体として確認できました（後述の実測値）。一方で HIGH 2件（お問い合わせ導線の虚偽記述／同一クラスタ内での法解釈の矛盾）は、審査提出前に潰すべきものです。これらは独自価値の欠如ではなく、サイトの信頼性・整合性の欠陥です。

---

## 監査の方法

実装者の主張（docs/00〜05、コミットメッセージ、01-canonical-value-registry.csv）は仮説として扱い、結論の根拠にしていません。以下はすべて実ファイルを読んで確認した結果です。

### 実際に読んだもの

- **記事本文（全文読了）**: `content/articles/` の canonical 15本すべて。うち 7本（chatgpt-tsuchihyo-shoken / special-needs-ict-reasonable-accommodation / reasonable-accommodation-school-record / digital-textbook-introduction-school-changes / google-forms-school-use-guide / giga-device-lesson-use-guide / special-needs-ict-support-tools-checklist）は本監査担当が直接全文を読み、残り8本は独立した読み手2名に全文を割り当て、行番号・逐語引用つきで報告させたうえで、報告の主要主張（合計12箇所）を本監査担当が実ファイルで再検証しました。再検証の結果、報告のうち1件（visual-schedule の「参考資料節が存在しない」）は誤りと判定し、finding から除外しています（参考資料は `components/ArticleReferences.tsx` がレンダリングするため、本文に無いのは正常）。
- **サイトレベル**: `app/page.tsx` / `app/articles/page.tsx` / `app/categories/[category]/page.tsx` / `app/articles/[slug]/page.tsx` / `app/about/page.tsx` / `app/operator/page.tsx` / `app/contact/page.tsx` / `app/layout.tsx` / `app/not-found.tsx` / `app/sitemap.ts` / `app/robots.ts` / `app/db/page.tsx` / `app/news/page.tsx` / `app/news/[slug]/page.tsx` / `middleware.ts`
- **コンポーネント・ライブラリ**: `components/Header.tsx` / `Footer.tsx` / `ArticleCard.tsx` / `ArticleBody.tsx` / `ArticleReferences.tsx` / `ArticleExperienceNote.tsx` / `EditorialPolicy.tsx` / `ChifuyuProfileCard.tsx` / `AdSenseScript.tsx`、`lib/articles.ts` / `categories.ts` / `site.ts` / `article-references.ts` / `article-experience-notes.ts`
- **検証スクリプト**: `scripts/adsense-audit.test.mjs` / `scripts/sixth-review-original-value.test.mjs`（`npm test` を実行。32件全パスを確認したうえで、主要な gate の実装を読んで「何を検査しているか」を確認）

### 数え方

- **公開本数**: frontmatter を機械的にパースし `published: false` を除外して数えた。`content/articles/*.md` は30本、うち `published: false` が15本、canonical は15本。実装側の判定条件（`lib/articles.ts:19` `article.published !== false`）と一致。
- **記入欄の実数**: 各 Markdown の表について、空セル行（正規表現 `\|( +)\|\s*$`）と `- [ ]` チェックボックスを別々に機械カウントし、そのうえで該当箇所を目視して「本当に埋められる欄か」を判定した。
- **横展開度**: 15本の本文からリンク記法・記号・空白を除去した文字列を12-gram シングルに分解し、全105ペアで Jaccard 系の重なり率（min正規化）を実測。
- **鋳型の反復**: h2/h3 見出し全件を抽出して並べ、冒頭段落の型・上部 blockquote 免責・末尾 関連記事・末尾 お問い合わせ行・適用限界節の有無を1本ずつ数えた。

---

## 監査項目への回答

### 1. 15本それぞれに明確な reader job があるか — 問題なし

15本すべてに、読者が「明日/今日、何を決めるために読むか」が特定できる job があります。見出し構成を全件並べた結果、たとえば `giga-device-lesson-use-guide`（明日の端末授業を止めないための前日確認と切り上げ判断）と `digital-textbook-introduction-school-changes`（教科書という教材に固有の単元導入判定）は、同じ ICT 活用カテゴリでも job が重なりません。「〇〇とは」型の概説記事は canonical に1本も残っていません（`kyoiku-dx-kiso` `tokubetsu-shien-ict` `tablet-ict-jugyo-giga` はいずれも `published: false` かつ 301 済み）。

reader job の重複は実測でも見つかりませんでした（項目5の重なり率を参照）。

### 2. 1ページごとの primary unique value と、registry との一致 — おおむね一致。3件で不一致

registry の canonical_asset 欄の数量主張を本文で1件ずつ照合しました。一致したもの:

| slug | registry の主張 | 本文の実体 |
|---|---|---|
| education-ai-service-checklist-before-use | 21行の記入様式 | L113–133 = **21行**、3列（記入欄／書くこと／記入）で右列が空欄 ✓ |
| google-forms-school-use-guide | フォーム固有判断17項目を3列 | L149–165 = **17行**、「自校での記入」列が空欄 ✓ |
| special-needs-ict-support-tools-checklist | 16行の記入様式 | L174–189 = **16行** ✓ |
| free-ict-tools-safety-checklist | Gate 1〜5 の判定欄と HOLD の期限・代替手段の記入欄 | L307–335 = **29行**、HOLD専用3行を含む ✓ |
| reasonable-accommodation-school-record | 6欄の空欄様式 | L43–50 = **6欄** ✓ |
| special-needs-parent-collaboration | 空欄様式11項目＋保留事項8列 | L184–196 = **11欄**、L204–207 = **8列** ✓ |
| special-needs-behavior-record-guide | 6列の空欄表 | L180–184 = **6列×3行** ✓ |
| giga-device-lesson-use-guide | 授業前チェック表10項目＋切り上げ基準 | L20–31 = **10項目**、L91 に「1人1分／学級3分」の数値基準 ✓ |
| ai-class-newsletter-prompt | AI下書き前シート＋配布前チェックリスト | L231–245 = **15行**、L192–211 = **20項目** ✓ |
| ai-koomu-kaizen-nyumon | 判断シート（止まったゲートと再検討条件の欄つき） | L169–179 = **11行**、当該2欄あり ✓ |

不一致は F-04・F-05・F-06（後述）の3件です。いずれも「registry がそう書いてあるだけで、本文の実体がそれに達していない」型です。

### 3. 一次資料の言い換えだけで成立している記事 — 0本。ただし源泉の記載密度に大きなばらつき

15本すべてについて、本文の行範囲を「公的資料の言い換え」と「本サイト固有の判断・様式・架空例」に分けて見積もりました。言い換え比率の高い順:

| slug | 公的資料の言い換え | 本サイト固有 |
|---|---|---|
| individual-education-plan-writing-guide | 約40%（L27–102 手引・参考様式・施行規則、L247–270、L302–346） | 約60%（引き継ぎテスト／評価テストの2判定、通し文例、失敗集、チェックリスト） |
| special-needs-behavior-record-guide | 約35%（L24–32、L72–109 の ABC・setting event は定番教材、L154–162 は生徒指導提要／NISE） | 約65%（3基準の粒度決め、共有・相談の順番、空欄様式） |
| special-needs-ict-reasonable-accommodation | 約45%（L27–64 は差別解消法・手引の整理） | 約55%（評価場面の重なり判定表、相談が止まる型） |
| special-needs-parent-collaboration | 約30%（法令の**逐語引用**。施行規則134条の2/139条の2/141条の2、個情法69条・27条・2条11項） | 約65%（担任裁量3条件、⑨段階フロー、記録シート） |
| ai-koomu-kaizen-nyumon | 約12%（個情法2条各項・20条・27条・64条・69条、文科省GL Ver.2.0） | 約85%（4ゲート、原本の読み順、判断シート） |
| free-ict-tools-safety-checklist | 約10%（教育情報セキュリティポリシーGL を**URL・逐語引用つき**で参照） | 約88%（5ゲート、USE/HOLD/DO NOT USE の3値設計） |
| ai-class-newsletter-prompt | 約6% | 約90% |
| special-needs-visual-schedule-support | 約5%（本文に法令・公的資料の参照が実質ゼロ） | 約95% |
| education-ai-service-checklist-before-use | **0%**（本文に一次資料の名指しが1件も無い） | 約95% |

「言い換えだけで成立している記事」は1本もありません。最も比率の高い `individual-education-plan-writing-guide` でも、独自の2判定（引き継ぎテスト／評価テスト）が L106–113 で定義され、L145 / L184 / L425–431 / L508 / L520 で本文全体を貫いており、要約記事にはなっていません。

逆方向の問題（F-09）として、`education-ai-service-checklist-before-use` は本文に一次資料の名指しがゼロなのに、`lib/article-references.ts:336` が3資料の参考資料ブロックをレンダリングします。読者は「どの主張がどの資料に基づくか」を追跡できません。

### 4. utility asset が名ばかりでないか — 15本中12本は実体あり。3本が不足

空セルの機械カウントと目視の結果:

| 実際に埋められる欄がある | 12本 | ai-class-newsletter-prompt(15+20) / ai-koomu-kaizen-nyumon(11) / digital-textbook(13) / education-ai-service(21) / free-ict-tools(29) / giga-device(□チェック10+7) / google-forms(17) / individual-education-plan(チェック15) / reasonable-accommodation(6) / special-needs-behavior-record(6列×3行) / special-needs-ict-support-tools(16) / special-needs-parent-collaboration(11+8列×2行) |
| 記入欄が存在しない | 3本 | chatgpt-tsuchihyo-shoken / special-needs-ict-reasonable-accommodation / special-needs-visual-schedule-support（「空欄様式」の見出しだが空欄なし） |

記入例の機能:

| 判定まで通した完全な架空例 | 11本 |
| 部分的（1行のみ／自明な結果） | 2本（special-needs-behavior-record-guide、ai-koomu-kaizen-nyumon） |
| 架空記入例なし | 2本（chatgpt-tsuchihyo-shoken、special-needs-ict-reasonable-accommodation） |

質の高い側は本物です。`free-ict-tools-safety-checklist` L343–389 は29行を全部埋めたうえで判定を **HOLD** で終わらせ、`education-ai-service-checklist-before-use` L150–178 は21行を埋めて **保留** で終わります。どちらも「様式が3値判定を持つ意味」を例で証明しています。`ai-class-newsletter-prompt` L249–320 は、わざと指示に反した AI 出力（L298–302）を置いて1箇所ずつ判定させる5段構成で、記入例が「体裁の見本」ではなく「作業の実演」になっています。

### 5. 同じテンプレートの横展開に見えないか — 見えない。実測で裏づけ

**本文の重なり（実測）**: 15本105ペアの12-gram 重なり率は最大 **4.06%**（education-ai-service ↔ free-ict-tools）、2位 3.23%、3位 3.19%。上位14ペアすべてが 4.1% 未満です。文章レベルの使い回しは事実上ありません。

**見出し骨格（実測）**: h2 の本数は 6〜16 でばらつき（chatgpt-tsuchihyo-shoken の6本から individual-education-plan の16本まで）、見出し文言に共通の型はありません。`## はじめに` `## まとめ` は canonical 15本中 **0本**、「Nつのポイント／N選/Nつのコツ」型の見出しも **0本**。

**反復要素（実測）**:

| 要素 | 15本中 |
|---|---|
| 上部 blockquote 免責 | 8本（7本は平文で書くか、そもそも置かない） |
| 末尾 `## 関連記事` | 7本（+ `## あわせて読む記事` 1本、`**関連記事**` 1本、無し6本） |
| 末尾「ご意見・ご要望は[お問い合わせページ]」 | 4本 |
| 適用限界系の節 | 8本（見出し文言は `この記事の適用限界` `この手順では決まらないこと` `このシートで決まらないこと` `掲載内容の前提` `この記事が扱う範囲` の5種に分散） |
| 「本サイト作成の参考様式」注記 | 12本 |
| 「完全な架空」注記 | 10本 |

冒頭は9本が h2 見出し始まり、6本が平文の場面描写始まりです。ただし15本すべてが「現場で迷う場面 → この記事はその1点だけを扱うと宣言 → 他は別記事へ委譲」という同じ修辞の運びを取ります。これは意図的な編集ボイスと読めるレベルで、テンプレート横展開とは別物です（F-14 に LOW として記載）。

「本サイト作成の参考様式」と「完全な架空」の反復は、様式・架空例を持つ記事に**必要な**注記なので、減らす対象ではありません。

### 6. generic SEO guide cluster に見えないか — カード一覧では見えない。ただし1記事に旧型の残骸

`app/articles/page.tsx` は `ArticleCard` を15枚並べ、各カードはタイトル・description 冒頭2行・タグ3件・公開日を出します。15枚のタイトルを実際に並べると、`〜とは`／`〜まとめ`／`おすすめ〇選`／`徹底解説` は **0件**。全15本が「〜する手順」「〜を決める」「〜の書き方」「〜の判断」型で、動詞で終わります。description 内の常套句も、canonical 15本では「わかりやすく解説します」が **0件**（非公開15本には残存するが配信されない）。

例外は F-07。`giga-device-lesson-use-guide` L190–239（248行中約50行 ≒ 20%）の「端末を使う場面と使わない場面」「児童生徒と決めておく約束」は、一斉／個別／協働という定番3分類の箇条書きで、どの GIGA 解説サイトにもある内容です。同記事 L10 の自己宣言「端末の活用例そのものより、授業を止めないための段取りに重心を置いています」とも噛み合っていません。

### 7. homepage / About / category / 記事群が同じ specialty を示しているか — おおむね一致。ブランド周りに旧ポジショニングの残り

一致している側:

- `app/layout.tsx:10` タグライン「特別支援教育と学校実務の判断ガイド」
- `app/page.tsx:42` h1「特別支援教育と学校実務の判断を、現場で使える形に。」、L152 に「このサイトの中心：特別支援教育の学校実務」セクション
- `app/about/page.tsx:22` 「特別支援教育を中心とした学校実務」、L34「ニュースの速報や、他サイトの情報をまとめ直した記事は扱いません。記事数を増やすことも目的にしていません。」
- `app/operator/page.tsx:21` 同旨
- `components/Footer.tsx:15` 同旨
- `lib/categories.ts` の `CATEGORY_DESCRIPTIONS` は4カテゴリすべて「何を決めるための区分か」で書かれ、category ページ L89 とホーム L64 に「いずれも『特別支援教育を含む学校実務での判断』を扱う区分です」を明示

記事分布も裏づけています: 特別支援教育6本 / ICT活用3本 / AI校務改善3本 / 教材・支援ツール3本。特別支援教育が最大クラスタで、ICT・AI 側の記事も `special-needs-*` 記事へ繋がっています。

一致していない側は F-13（サイト名「教育DXナビ」と編集キャラクター千冬先生の紹介文が、旧来の広い「教育DX」フレーミングのまま）。LOW。

### 8. 「情報収集・まとめサイト」に見える表現 — 実質的に除去済み

canonical 15本の全文検索:

| 語 | 出現 |
|---|---|
| まとめ記事 | 1件（digital-textbook L152。「まとめ記事やSNSの情報だけで判断せず」＝まとめサイトを否定する文脈） |
| 網羅 | 1件（giga-device L192。「網羅的な一覧ではなく」＝否定文脈） |
| おすすめ | 1件（individual-education-plan） |
| 情報をまとめ／わかりやすく解説／徹底解説／ランキング／最新情報をお届け | **0件** |

サイトレベルでも、`app/db` `app/news` `app/news/[slug]` はいずれも `notFound()` を返すだけの stub になっており（`app/db/page.tsx:9` ほか）、Header / Footer / homepage からリンクもなく、`app/sitemap.ts` にも含まれていません。`content/db/*.json` と `content/news-digests/` はリポジトリに残っていますが配信経路がありません。

### 9. fictional examples / worksheets が実際に original value になっているか — 11本は yes、4本は不足

項目4の内訳のとおりです。original value として機能している例を具体的に挙げると:

- `special-needs-parent-collaboration` L211–236: 11欄と8列追跡表を両方埋めたうえで、L236 でその記入例を記事自身の「担任裁量3条件」に照らし直し、「担任がその場で合意したのは『課題の提示のしかた』だけ」と検算しています。記入例が判断ルールの実演になっている唯一の例。
- `special-needs-visual-schedule-support` L254–284: 同じ架空事例で1回目と2回目の記入を並べ、「2回分を並べると、位置を変えたことが効いたのか読み取れます」（L284）と時系列の意味を示しています。様式そのものは空欄でないのに、記入例だけは設計意図を示せている。
- `giga-device-lesson-use-guide` L147–186: 前日→当日→授業後を通した架空1時間で、「学級全体で止まっていた時間は3分に届かなかった」（L172）と、記事が定めた切り上げ基準を例の中で適用しています。

不足側は F-04・F-05・F-06・F-08。

### 10. AdSense 審査面で低価値判定につながりそうな site-level weakness — 独自価値では無い。導線と整合性に2件

構造面は健全です。

- `app/articles/[slug]/page.tsx:70` により AdSense スクリプトは解決済み記事詳細にのみ出力。`app/layout.tsx` には無く、404・db・news には載りません（`components/AdSenseScript.tsx` は env 未設定なら出力なし）。
- ポリシーページは実体があります: privacy 184行 / disclaimer 160行 / operator 147行 / about 161行。
- `app/sitemap.ts` は `getAllArticles()` 経由なので非公開記事が混入しません。`generateStaticParams` は `getPublishedArticleSlugs()`、`getArticle()` は非公開 slug で throw → `notFound()`。
- 統合した旧 slug 11本は `middleware.ts` で1ホップ301。`npm test` の32件（`scripts/adsense-audit.test.mjs` / `scripts/sixth-review-original-value.test.mjs`）は全パス。

弱点は F-01（お問い合わせ導線）と F-11（301 の無い404が5本）です。加えて F-12 として、受け入れ gate の一部が registry を registry 自身の記述で検査しており、本文の実体を保証していない点を挙げます。

---

## Finding 一覧

### F-01 — HIGH — お問い合わせページのフォールバック文が存在しない機能を案内している

- **対象**: `app/contact/page.tsx:44–48`
- **問題**: `NEXT_PUBLIC_CONTACT_FORM_URL` が未設定のとき、唯一の連絡手段案内として「お問い合わせ窓口の準備を進めています。お急ぎの場合は、サイト内各記事のコメント欄等をご利用ください。」が表示される。`app`・`components`・`lib` 全体を検索したところ、コメント機能はどこにも実装されていない（当該文字列以外に `comment` の実装は0件）。
- **なぜ問題か**: About（L98, L144）、operator（L107, L126–134）、`components/EditorialPolicy.tsx:19` の3系統が「誤りは問い合わせページから知らせてほしい」と読者に案内している。その着地点が「準備中」かつ存在しない機能への誘導では、訂正受付の運用が実在しないことになる。AdSense はサイト運営者への連絡手段の有無を見る。env が本番で未設定なら、有効な連絡手段がゼロの状態で申請することになる。
- **推奨する修正**: (a) 本番の `NEXT_PUBLIC_CONTACT_FORM_URL` が設定済みであることを申請前に実機で確認する。(b) 未設定時のフォールバック文から「コメント欄」の記述を削除し、実在する代替手段（連絡先メールアドレス等）を書くか、フォールバック自体を許容しない設計にする。

### F-02 — HIGH — 同一クラスタ内の2記事が、保護者の同意/合意について逆の指導をしている

- **対象**: `content/articles/individual-education-plan-writing-guide.md:35` と `content/articles/special-needs-parent-collaboration.md:250`
- **問題**: IEP 記事は「学校では学級担任や特別支援教育コーディネーターが中心となり、**保護者との合意をもとに作成します**」と書く。保護者面談記事は学校教育法施行規則第134条の2を逐語引用（L246–248）したうえで「条文は『**意向を踏まえつつ**』であり、『同意を得て』とは書かれていません」「面談の場で『同意をいただいたので共有します』と単純化して説明しないほうが安全です」（L250）と、まさにその言い方を戒めている。2記事は相互リンクしており（面談記事 L298 → IEP 記事）、同じ特別支援教育カテゴリに並ぶ。
- **なぜ問題か**: サイトの中核主張は「公的資料と実務上の確認手順を照合している」（about L28, operator L27, EditorialPolicy L8–10）。その照合が効いていれば起きない矛盾が、最も専門性を主張しているカテゴリの中で起きている。読者が両方読むと、どちらに従えばよいか判断できない。
- **推奨する修正**: IEP L35 を条文の文言に合わせる（「本人・保護者の意向を踏まえて作成します。個人情報の共有について同意が必要かどうかは設置形態により別の法令で決まります」等）。あわせて面談記事側の該当節へ内部リンクを張り、どちらが根拠を持つかを明示する。

### F-03 — MEDIUM — `ai-koomu-kaizen-nyumon` が `free-ict-tools-safety-checklist` に「相談の順番の整理がある」と案内しているが、リンク先はそれを明示的に拒否している

- **対象**: `content/articles/ai-koomu-kaizen-nyumon.md:142` と `content/articles/free-ict-tools-safety-checklist.md:121, 123`
- **問題**: 前者は「誰にどの順で相談するかは[無料ICTツールを授業で使う前の確認手順]に整理があります」と書く。後者は「**全国共通の確認順序はありません。**」（L121）「この記事では、確認の順番を『まずICT担当、次に管理職、次に教育委員会』のように固定しません。」（L123）と、順番を示さないことを明言している。
- **なぜ問題か**: 記事間の委譲（このサイトが重複排除の手段として全面採用している設計）が、着地先で果たされていない。委譲先が空振りする例が1件でもあると、他の委譲リンクの信頼性も落ちる。canonical 15本は内部リンクの委譲を多用しているため、影響範囲が広い。
- **推奨する修正**: ai-koomu L142 の文言を「所属校・設置者が定めた確認経路に乗せる考え方は〜にあります」に直すか、順番を示している別の記事（`special-needs-behavior-record-guide` の「共有・相談の順番」L127–138）へ張り替える。

### F-04 — MEDIUM — `chatgpt-tsuchihyo-shoken` の canonical asset に記入欄も架空記入例も無い（registry の主張と不一致）

- **対象**: `content/articles/chatgpt-tsuchihyo-shoken.md:122–152`、`docs/adsense-sixth-review/01-canonical-value-registry.csv` の当該行
- **問題**: registry は canonical_asset を「所見AI利用メモ（本サイト作成の参考様式・**誰に使うかの判定表**＋入力前チェック＋提出前チェック）」と主張。本文 L130–132 の「判定表」は、ヘッダ行1本と、各列に何を書くかを説明する凡例行1本だけの2行表で、記入できる空セルは1つもない。空セル行の機械カウントは **0**。また同記事は canonical 15本で唯一「架空」の語が **0回**で、記入例が存在しない。
- **なぜ問題か**: 記事の独自価値は3軸の選別ルール（L20–34）にあり、それ自体は本文にある。しかし registry が「判定表」を canonical asset と名指ししている以上、実体が凡例だけなのは自己申告と実体の乖離である。他の様式持ち記事（21欄・29欄・17欄）と並べたときに、この記事だけ utility asset が名ばかりに見える。
- **推奨する修正**: 5列×3行程度の空欄行を追加し、3軸すべてが判定に効いた架空の記入例（少なくとも「使わない」に落ちる1件を含む）を置く。それをしないなら registry の canonical_asset から「判定表」を外し、「3軸の選別ルール」を asset として記述し直す。

### F-05 — MEDIUM — `special-needs-ict-reasonable-accommodation` も記入欄・架空例なし（registry の「判定表」は参照表）

- **対象**: `content/articles/special-needs-ict-reasonable-accommodation.md:90–95`、registry 当該行
- **問題**: registry は「評価場面で使ってよいかの仕分け表（重なり・一貫性・根拠の三つの問い＋**4列の判定表**）」と主張。L90–95 の表は4列4行だが全セルが記入済みの参照表で、読者が埋める欄はない。空セル行 **0**、「架空」の語 **0回**。checkbox は L128–137 に7項目あるが、これは自己点検リストであって様式ではない。
- **なぜ問題か**: F-04 と同型。加えて本記事は「公的資料の言い換え」比率が15本で最も高い部類（L27–64 が差別解消法・内閣府基本方針・手引の整理で、記事全体の約45%）。独自要素が参照表1枚と定性的な観察に留まると、「一次資料の要約＋所感」という見え方に近づく。
- **なぜ致命的でないか**: L90–95 の「その方法が肩代わりすること／重なりが起きやすい評価の例」という軸の切り方自体は他所で見ない整理で、L99 の「入試・検定は各実施機関の要項」までの落とし方も実務的。独自価値は存在する。
- **推奨する修正**: 「この子・この評価場面で三つの問いを通す」記入欄（4〜6行）と、重なりありで結論が変わる架空例を1件追加する。
- **付随（LOW）**: L95 の行は列見出しと噛み合っていない。「重なりが起きやすい評価の例」列に「重なりは生じにくい」という**答え**が入り、「起きにくい評価の例」列に「多くの評価」が入っている。表の読み方が1行だけ崩れる。

### F-06 — MEDIUM — `special-needs-visual-schedule-support` の「空欄様式」に空欄が1つも無い

- **対象**: `content/articles/special-needs-visual-schedule-support.md:227–239`
- **問題**: `### 空欄様式` という見出しの下の表は `| 欄 | 記入内容 |` の2列で、右列は全9行が記入指示文で埋まっている（例 L232「実物／写真／絵・シンボル／文字／デジタル／組み合わせ」、L239「次に確かめる日付。空欄にしない」）。空セルは **0**。同じサイト内の `special-needs-parent-collaboration.md:184–196` は同一形状の2列表で右列を空にしており、様式としての作りが揃っていない。
- **なぜ問題か**: 見出しが内容と矛盾している。読者が印刷して使えると期待して開くと使えない。registry は「見直し記録シート（本サイト作成の参考様式・**9欄**）」と主張しており、欄数は合うが「様式」としての実体が伴っていない。
- **なぜ致命的でないか**: L254–282 の記入例は9欄すべてを埋め、さらに2回目（時系列の続き）まで置いており、この記事の独自価値（変更履歴を1行ずつ足す設計）は記入例側で証明されている。
- **推奨する修正**: 3列化（欄／記入内容の説明／記入）するか、`special-needs-parent-collaboration` と同じく右列を空にして、説明文は表の外へ出す。

### F-07 — MEDIUM — `giga-device-lesson-use-guide` の末尾約20%が汎用 GIGA 解説の残骸で、記事自身の宣言と矛盾する

- **対象**: `content/articles/giga-device-lesson-use-guide.md:190–239`
- **問題**: 「一斉授業で使う／個別学習で使う／協働学習で使う／端末を使わない方がよい場面」（L194–223）と「児童生徒と決めておく約束」（L227–239）は、どの GIGA 解説記事にもある定番の箇条書き。記事全体248行のうち約50行（20%）。L10 は「端末の活用例そのものより、授業を止めないための段取りに重心を置いています」と宣言しており、L192 も「活用の網羅的な一覧ではなく」と予防線を張っているが、内容自体は網羅型の一覧そのもの。
- **なぜ問題か**: 監査項目6（generic SEO guide cluster に見えないか）に対する canonical 15本中で唯一の実質的な反例。統合元の `tablet-ict-jugyo-giga` `kyoiku-dx-kiso` `giga-school-device-troubleshooting`（いずれも本記事へ301）から持ち越された汎用パートに見える。審査担当がこの1記事を開いたときに、前半（前日確認10項目・切り上げ基準・16行のトラブル判断表）の独自性が薄まる。
- **推奨する修正**: L190–239 を削除するか、前半のチェック表が想定する場面の説明として3〜5行に圧縮する。「児童生徒と決めておく約束」は L39–44 の「当日の合図」節と役割が重なっているので統合できる。

### F-08 — MEDIUM — `ai-koomu-kaizen-nyumon` の記入例が、記事自身が「この様式の目的」と呼ぶ2欄を空で通している

- **対象**: `content/articles/ai-koomu-kaizen-nyumon.md:181, 197, 198`
- **問題**: L181 は「下から3行が、この様式の目的です。**止まった記録が残らないと、同じ業務のたびに同じ迷いを最初からやり直す**ことになります」と書く。しかし唯一の記入例（L189–199）は「止まったゲートと、その理由」=「（なし）」、「保留にした場合の再検討条件」=「（該当なし）」で終わる。判定は「利用する」。
- **なぜ問題か**: registry がこの記事の primary_unique_value を「使わない判断を成果として記録させる」と主張している、まさにその点が例で示されていない。同じ設計思想を持つ姉妹記事（`free-ict-tools` は HOLD で終わる例、`education-ai-service` は保留で終わる例）と比べて、この記事の例だけが自明な成功例になっている。
- **推奨する修正**: 「校務ゲート1が分からないまま止まった」または「ゲート2で保留」の記入例を1枚追加する。L201 が「『判定：保留』で止まった枚数も同じように残します」と述べているので、その1枚を実際に出せばよい。

### F-09 — MEDIUM — 参考資料ブロックが、本文が一度も参照していない資料を「確認に使用した一次資料」として提示している

- **対象**: `lib/article-references.ts:336`（education-ai-service-checklist-before-use）、同 `319–324`（ai-class-newsletter-prompt）、`components/ArticleReferences.tsx:13`
- **問題**: `ArticleReferences` は「記事中の制度・方針・仕様に関する確認に使用した一次資料です」という前置きで資料を並べる。しかし `education-ai-service-checklist-before-use` の本文198行には、文部科学省GL・個人情報保護委員会・文化庁・著作権法・個人情報保護法のいずれの名指しも、外部URLも **1件も無い**（「文部科学省・教育委員会等が定める公式様式ではありません」L107 と「著作権法上どう扱われるか」L187 の2箇所は、いずれも参照ではなく否定・委譲の文脈）。それでも3資料が参考資料として表示される。`ai-class-newsletter-prompt` も同様に、本文が著作権法35条と文科省GLしか挙げないのに、個人情報保護委員会と文化庁の資料が並ぶ。
- **なぜ問題か**: 本文中の主張（「二次利用の既定値」「生成物の権利」など）を、読者がどの資料で検証できるかが分からない。E-E-A-T の観点では、資料リストが本文と接続していないと権威づけの形だけになる。とくに `education-ai-service-checklist-before-use` は本文の独自比率が15本で最も高い（≒95%）反面、根拠の追跡可能性が最も低い記事になっている。
- **推奨する修正**: 本文の該当箇所に一次資料の名指しを入れる（例: 二次利用と既定値の節に個情委の注意喚起、生成物の権利の節に文化庁の考え方）。それができない資料は参考資料の割り当てから外す。

### F-10 — MEDIUM — `special-needs-parent-collaboration` の「同法第68条」が指す法律が取り違えられている

- **対象**: `content/articles/special-needs-parent-collaboration.md:276`
- **問題**: 表の当該セルは「…いずれも第2条第11項により『行政機関等』から除かれます（＝個人情報取扱事業者の側）。**なお同法第68条**は『一般地方独立行政法人で第二十一条第二号に掲げる業務を行うもの』を公立大学法人と定義しています」と書く。直前の第2条第11項は個人情報保護法の条文なので、「同法」は個人情報保護法に係る。しかし引用されている定義（公立大学法人＝一般地方独立行政法人で第21条第2号の業務を行うもの）は**地方独立行政法人法第68条**の文言であり、個人情報保護法第68条は別内容。
- **なぜ問題か**: この記事は逐語引用と条番号の精度を売りにしている節（L240–296）で、法令の取り違えが1件でもあると節全体の信頼性が下がる。国立・公立大学法人立の附属校という、まさに読者が自校の該当を確かめる箇所である。
- **推奨する修正**: 「同法」を「地方独立行政法人法」に置き換える。
- **付随（LOW）**: 同記事 L110 の「（2024年4月1日施行の改正により、努力義務から義務になりました）」が、第7条第2項（行政機関等。2016年から義務）の引用ブロックの直後に置かれており、どちらの規定への注記か誤読されうる。

### F-11 — MEDIUM — 以前公開されていた5本の URL が、301 も無く404になる

- **対象**: `middleware.ts:5–20`
- **問題**: `published: false` の15本のうち、リダイレクト先を持たないのは `education-grant-search-guide` / `generative-ai-school-training-guide` / `information-morals-education-themes` / `joseikin-guide-2025` / `school-training-ict-ai-guide` の5本。コード上で意図が明記されているのは `information-morals-education-themes` の1本だけ（L19）。残り4本（助成金2本・研修2本）は無言で404になる。
- **なぜ問題か**: これらはインデックス済みだった可能性が高い URL であり、5回の申請歴の中でクロールされている。リダイレクト先の妥当性を検討した形跡がコードに無いため、意図的な整理なのか漏れなのかが判別できない。助成金・研修は canonical に対応記事が無いカテゴリなので、意図的なら意図的とコメントで残すべき。
- **推奨する修正**: 4本それぞれについて、着地させるべき canonical があるかを判断し、無いなら `information-morals-education-themes` と同様に「意味的に正しい統合先が無いため 301 を張らない（404）」というコメントを追加する。

### F-12 — MEDIUM — 受け入れ gate の一部が registry を registry 自身の記述で検査しており、本文の実体を保証していない

- **対象**: `scripts/sixth-review-original-value.test.mjs:193–223`
- **問題**: 「no canonical article exists purely as an official-source summary」（L213–223）は、registry の `primary_unique_value_type` 列が許可リストの8値のいずれかであることだけを検査する。CSV に `OFFICIAL_SOURCE_SUMMARY` と書かなければ必ず通る。「every registry entry declares a substantive primary unique value」（L193–210）も、列の存在・空でないこと・文字数下限（20字／4字）だけを見る。本文は一切読まない。
- **なぜ問題か**: テスト名が主張している内容（「一次資料の要約だけの記事は無い」「実質的な独自価値を宣言している」）と、実装が保証している内容（「CSVの列が埋まっている」）の間に開きがある。32件全パスという結果が、独自価値の実在の証拠として読まれると危険。本監査で実際に見つかった F-04・F-05・F-06 は、いずれも registry が canonical asset を宣言しているのに本文の実体が伴わない型で、この gate 群では検出できない。
- **なぜ CRITICAL でないか**: 同ファイルの他の gate（301の1ホップ性、非公開記事へのリンク、アンカーテキストとタイトルの一致、実務経験注記の範囲）は実ファイルを読んでおり、有効に機能している。
- **推奨する修正**: registry の `canonical_asset` が数量（「21行」「17項目」「6欄」等）を主張している場合、その数を本文の表・チェックボックスから抽出して照合する gate を追加する。少なくとも「canonical_asset に『様式』『シート』『空欄』を含む記事は、本文に空セル行または `- [ ]` を1件以上持つ」を検査すれば F-04・F-05・F-06 は落ちる。

### F-13 — LOW — サイト名と編集キャラクターの紹介文が、旧来の広い「教育DX」ポジショニングのまま

- **対象**: `components/Header.tsx:14` / `components/Footer.tsx:12`（「📚 教育DXナビ」）、`components/ChifuyuProfileCard.tsx:67`、`app/page.tsx:89`、`app/about/page.tsx:107`
- **問題**: 本文・About・operator・カテゴリ説明が「特別支援教育を中心とした学校実務」に統一されているのに対し、ブランド名は「教育DXナビ」、千冬先生の紹介は「ICT活用・生成AI・校務改善・特別支援教育について、学校現場で安全に使うための視点を**やさしく整理します**」（ChifuyuProfileCard L67）。ホームの「千冬先生からのひとこと」（page.tsx L89）も「ICTや生成AIは、使うこと自体が目的ではありません」という一般論で、特別支援教育の専門性を示していない。
- **なぜ問題か**: 全ページの header/footer に出るブランド要素なので、専門性の第一印象を左右する。「やさしく整理します」は、まさに本サイトが否定している概説サイトの語り口。
- **推奨する修正**: サイト名の変更はコスト・被リンクの観点で避けてよい。ChifuyuProfileCard の紹介文とホームのひとことを、特別支援教育の学校実務に触れる文に差し替える（例: 記録・計画・面談の場面で何を確認するか）。

### F-14 — LOW — 15本すべてが同じ修辞の運びで始まる

- **対象**: canonical 15本の冒頭（各ファイル L10–30 付近）
- **問題**: 見出し文言も本文も重なっていない（項目5の実測どおり）が、15本すべてが「現場で迷う場面の描写 → この記事はこの1点だけを扱うと宣言 → 他は別記事へ委譲」という同じ順序を取る。委譲宣言の語（「だけを扱」「は扱いません」「別記事へ」「へ委ね」「引き受けない」）は冒頭30行に高頻度で現れる。
- **なぜ問題か**: 1本ずつ読む分には意図的な編集ボイスだが、記事一覧から連続して3〜4本開くと同型に見える。重複排除の設計を優先した結果の副作用。
- **なぜ LOW か**: 本文の実測重なり率が最大4.06%であり、鋳型の使い回しとは質が違う。除去よりも、冒頭の入り方を数本だけ変える程度で十分。
- **推奨する修正**: 委譲の宣言を冒頭から記事中盤（該当トピックに触れる箇所）へ移す記事を4〜5本つくる。

### F-15 — LOW — 記事ページに `関連記事` の h2 が2回出る

- **対象**: `app/articles/[slug]/page.tsx:122` と、本文に `## 関連記事` を持つ canonical 7本（chatgpt-tsuchihyo-shoken / digital-textbook-introduction-school-changes / education-ai-service-checklist-before-use / giga-device-lesson-use-guide / special-needs-behavior-record-guide / special-needs-ict-reasonable-accommodation / special-needs-visual-schedule-support）
- **問題**: テンプレートが同カテゴリ3本の `<h2>関連記事</h2>` aside を自動描画する。本文側にも同名 h2 を置いている7本では、1ページに同じ見出しが2回、別内容で並ぶ。
- **なぜ問題か**: 見出し構造の重複は読みにくく、機械的に生成されたページに見える。`scripts/sixth-review-original-value.test.mjs:478` は本文の `## 参考資料` について同じ問題を検査して0件に抑えているのに、`## 関連記事` は対象外になっている。
- **推奨する修正**: 本文の `## 関連記事` を削除してテンプレート側に一本化するか、本文側の見出しを内容に即した文言（例: `## この判断の次に読む記事`）へ変える。同 gate に `bodyRelatedArticles` の検査を追加する。

### F-16 — LOW — `special-needs-behavior-record-guide` が「必須」と書いた2欄を、配布する様式が持っていない

- **対象**: `content/articles/special-needs-behavior-record-guide.md:54–66, 90, 180`
- **問題**: L54–66 は記録様式に最低限入れる項目として7つを挙げ、そこに「記録者」と「うまくいった場面・落ち着いていた場面を書く欄」が含まれる。L90 は「本サイトの様式に『うまくいった場面の欄』を置いているのは、この不足を見落とさないためです」と明言する。しかし L180 の実際の様式は6列で、その2欄がない。
- **なぜ問題か**: 記事内で自分の様式について事実と異なる説明をしている。L68 は「そこから欄を減らして自分の学級用に調整してください」と述べるが、L90 の「置いている」という記述はそれでは説明できない。
- **推奨する修正**: 様式に2列を足すか、L90 の文を「置くことを勧めています」に直す。

### F-17 — LOW — registry の項目数・区分名が本文と合わない（individual-education-plan-writing-guide）

- **対象**: `docs/adsense-sixth-review/01-canonical-value-registry.csv` 該当行、`content/articles/individual-education-plan-writing-guide.md:495–529`
- **問題**: registry は「実態把握/目標/手立て/評価/引継ぎの**5区分14項目**」と書く。本文は 実態把握3 / 目標3 / 手立て3 / 評価・引き継ぎ3 / **取り扱い**3 = **15項目**。区分数は合うが、5番目の名称が違い、項目数が1件ずれる。
- **なぜ問題か**: 単独では軽微だが、registry の数量記述が本文の検算に耐えない例が1件でもあると、他の数量記述（21行・17項目・29行等、本監査で照合済み）の信頼も相対的に下がる。F-12 と同じ根（自己申告の未検算）。
- **推奨する修正**: registry を「実態把握/目標/手立て/評価・引き継ぎ/取り扱いの5区分15項目」に修正する。

### F-18 — LOW — 他記事の節を「」つきで引いているが、その見出しが存在しない

- **対象**: `content/articles/special-needs-parent-collaboration.md:298`、`content/articles/special-needs-behavior-record-guide.md:142`
- **問題**: 前者は IEP 記事の「共有範囲・保管・廃棄をどう決めるか」を引くが、実際の見出しは「この文書を、誰まで共有し・どう保管し・どう捨てるか」（IEP L302）。後者は同記事の「個人情報の項」を引くが、その名前の見出しは無い。
- **なぜ問題か**: リンク自体は生きているので読者は辿り着けるが、鉤括弧つきの節名が実在しないと、記事のリタイトル時に取り残された参照に見える。既存の gate（`internal link anchor text matches the current title of its target`）は記事タイトルは検査するが節見出しは対象外。
- **推奨する修正**: 節名を現行見出しに合わせる。gate に「本文中の鉤括弧つき節参照が、リンク先の見出しに実在するか」の検査を足すと再発を防げる。

### F-19 — LOW — About が、まだ配信されていない広告を「掲載しています」と現在形で書いている

- **対象**: `app/about/page.tsx:115`
- **問題**: 「当サイトでは、記事ページにおいて Google AdSense による広告を掲載しています。」と断定。実装上は `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT` 未設定なら `components/AdSenseScript.tsx:6` が `null` を返し、広告は1つも出ない。5回不承認の状態では広告配信は開始していない。
- **なぜ問題か**: ポリシーページの記述が事実と異なる。審査時に「掲載しています」と書かれたページと、広告が出ていない実ページの食い違いを見られる。
- **推奨する修正**: 「掲載する予定です／掲載する場合があります」に直すか、承認後に現在形へ変える運用にする。

### F-20 — LOW — 記事の「最終確認」日と参考資料の「最終確認」日が1か月ずれている

- **対象**: `lib/article-references.ts:10`（`const checkedAt = '2026-07-21'`）、`app/articles/[slug]/page.tsx:94`、canonical 15本の frontmatter `updatedAt: "2026-08-22"`
- **問題**: 記事ヘッダは全15本が「最終確認: 2026-08-22」を表示する一方、同じページ下部の参考資料は多くが「最終確認 2026-07-21」を表示する。一部の資料だけ `2026-08-10` の個別確認日を持つ。
- **なぜ問題か**: about L89–93 は「2026年8月22日に掲載記事の全体を見直しました」「以降は、内容に影響する訂正を行った記事だけ日付を更新します」と説明している。その全体見直しで一次資料の再確認をしていないことが、同じページ上で読み取れる。
- **推奨する修正**: 8月22日の見直しで一次資料も再確認したなら `checkedAt` を更新する。していないなら、記事側の日付ラベルを「本文最終確認」等に変えて、資料の確認日と区別する。

### F-21 — LOW — 到達不能な2カテゴリの説明文が残っている

- **対象**: `lib/categories.ts:38–40`
- **問題**: `助成金・補助金` と `研修・セミナー` の `CATEGORY_DESCRIPTIONS` に「現在この区分の公開記事はありません」という文が入っているが、`app/categories/[category]/page.tsx:57` は記事0件で `notFound()` を返し、`generateStaticParams`（L16–18）も対象外にするため、この文は誰にも表示されない。
- **なぜ問題か**: 実害はないが、この2区分に記事を戻す予定があるのかどうかが判断できない状態でコードに残っている。`CATEGORIES` 配列（L4–11）に6区分が残っているため、将来 `published: true` に戻した記事が意図せずカテゴリを復活させうる。
- **推奨する修正**: 意図（将来復活させる／させない）をコメントで明示するか、2区分を `CATEGORIES` から外す。

---

## 総括

**独自価値については、実体があります。** 15本の本文重なり率は最大4.06%、`## はじめに`／`## まとめ`／「Nつのポイント」型の見出しは0本、「わかりやすく解説」等の概説サイト語彙も0件。12本が実際に埋められる記入欄を持ち（21行・29行・17行・16行など）、11本が判定まで通した完全な架空記入例を持ちます。`free-ict-tools-safety-checklist` の HOLD で終わる29行の記入例、`education-ai-service-checklist-before-use` の保留で終わる21行の記入例、`ai-class-newsletter-prompt` の失敗する AI 出力を1箇所ずつ判定させる5段構成は、いずれも「様式を置いただけ」ではなく、様式の設計意図を例で証明しています。一次資料の言い換えだけで成立している記事は1本もありません（最大でも約45%）。「有用性の低いコンテンツ」という指摘に対する反証としては、十分な水準にあると判断します。

**残っている問題は、独自価値の欠如ではなく、精度と整合性の欠陥です。** 最も重いのは F-02（同じカテゴリの相互リンクした2記事が、保護者の同意/合意について逆の指導をしている）で、これはサイトが最も強く主張している「公的資料と実務上の確認手順の照合」が効いていない実例です。次いで F-01（訂正受付の導線が、存在しないコメント欄を案内している）。この2件は、専門性と運営体制を示すために置いた仕組みが、その仕組み自身の中で破綻している型なので、審査以前に潰すべきです。

**registry は、本監査の範囲では概ね実体を伴っていました。** 10本の数量主張（21行/17項目/16行/29行/6欄/11欄+8列/6列/10項目/15行+20項目/11行）を本文で照合し、すべて一致しました。不一致は3本（F-04・F-05・F-06、いずれも「様式・判定表」を名乗るものに記入欄が無い）と、1本の項目数ずれ（F-17）です。ただし `scripts/sixth-review-original-value.test.mjs` の独自価値系 gate は registry の列を registry の記述で検査しており（F-12）、32件全パスという結果は独自価値の実在の証拠にはなりません。本監査の結論は、テストの結果ではなく本文の読解に基づいています。

**generic SEO guide への回帰は、1記事1箇所だけ残っています。** `giga-device-lesson-use-guide` L190–239（記事の約20%）が、統合元の汎用 GIGA 解説から持ち越された一斉/個別/協働の定番リストです。ここだけが、記事一覧から開いたときに旧来の量産記事に見える箇所です。

審査提出前に F-01・F-02 を、可能なら F-03・F-07 まで処理することを推奨します。F-04・F-05・F-06 は「registry の主張を実体に合わせる」か「実体を registry に合わせる」かのどちらかを選べば済み、審査を止める性質のものではありません。

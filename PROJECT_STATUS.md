# 教育DXナビ — PROJECT_STATUS

最終更新: 2026-06-27（フェーズ3）

## 概要

- サイト名: 教育DXナビ
- 技術構成: Next.js 15 / React 19 / TypeScript / Tailwind CSS / Vercel
- 公開URL（フォールバック）: https://edu-ai-platform-delta.vercel.app
- コンテンツ: `content/articles/*.md`（gray-matter フロントマター）+ `content/db/*.json`（教育情報DB）+ `content/news-digests/*.md`
- 現在の状況: **Google AdSense 審査中**（2026-06-19頃〜）。審査中はAdSense/GA4/Search Console/robots/sitemap/canonicalを不用意に変更しない方針。

## コンテンツ現況（2026-06-27 時点）

- 記事: **30本**（フェーズ1で+2本、フェーズ2で+1本、フェーズ3で+1本）
- 教育情報DB: 11件（grants 3 / ict-tools 3 / laws 3 / training 2）
- ニュースダイジェスト: 1本
- カテゴリ: 特別支援教育 / ICT活用 / AI校務改善 / 教材・支援ツール / 助成金・補助金 / 研修・セミナー

## 2026-06-27 フェーズ3（push後の追加改善）

### push
- フェーズ1・2の2コミット（`c6f9fd2` / `973468a`）を `origin/main`（GitHub: maikeru2312-beep/edu-ai-platform）へ push 済み。Vercel連携で本番反映想定。

### 新規記事 1本（テーマD）
- [教育AIサービスを学校で使う前に確認したいこと｜個人情報・規約・安全性のチェックリスト](content/articles/education-ai-service-checklist-before-use.md)
  - カテゴリ: 教材・支援ツール / slug: `education-ai-service-checklist-before-use`
  - 特定サービスの宣伝・企業発表紹介にせず、導入前に教員・管理職が確認すべき観点を整理。**AIサービス特有の確認事項**（入力データの保存・学習利用とオプトアウト／生成物の著作権と責任／AIの誤り・偏りと説明責任／管理者設定・利用範囲／年齢制限と保護者説明／無料・有料プラン差）に寄せ、導入前チェックリストを掲載。
  - `free-ict-tools-safety-checklist`（一般ツールの安全確認）と重複しないよう、一般論はそちらへ委ね、AI固有の層に絞って差別化。

### 内部リンク改善
- 新規記事 → free-ict-tools-safety-checklist / school-generative-ai-privacy-security / generative-ai-guideline-v2-school-reading / ai-koomu-kaizen-nyumon / special-needs-ict-reasonable-accommodation
- 上記5記事の関連記事欄から新規記事への戻りリンクを追加。

### 品質確認（フェーズ3）
| 項目 | 結果 |
|---|---|
| `node scripts/validate.mjs` | ✅ 通過（記事30 / DB 11） |
| 内部リンク解決チェック | ✅ 破損0（30記事すべて解決） |
| `npm run build` | ✅ 成功（51ページ生成、新規記事もSSG） |
| sitemap.xml への反映 | ✅ 新規記事反映（記事30件） |
| AdSense / GA4 / Search Console / robots / canonical / 固定ページ / page.tsx | ✅ 変更なし（git status で確認、今回はコンテンツ記事のみ変更） |
| `npm run lint` | ⚠ 未設定（前回同様。別フェーズで対応） |

---

## 2026-06-27 フェーズ2（コミット後の追加改善）

### コミット
- フェーズ1の成果を `Add AdSense review period content updates`（commit `c6f9fd2`）としてコミット済み。

### 新規記事 1本
- [特別支援教育におけるICT活用と合理的配慮｜現場で確認したい視点](content/articles/special-needs-ict-reasonable-accommodation.md)
  - カテゴリ: 特別支援教育 / slug: `special-needs-ict-reasonable-accommodation`
  - ICTを「できないことの補助」だけでなく「分かる・選べる・伝えられる場面を増やす支援」として整理。**合理的配慮（アクセス保障）と教育課程上の指導・支援（自立活動など）を分けて考える**ことを核に、個別の教育支援計画・個別の指導計画・記録への位置づけと、明日から使えるチェックリストを掲載。
  - 既存の tokubetsu-shien-ict（ツール入門）/ special-needs-ict-support-tools-checklist（目的別ツール選定）/ reasonable-accommodation-school-record（申請・記録の手続き）/ free-ict-tools-safety-checklist（安全確認）と重複しないよう、「配慮と指導の区別・計画と記録への接続」という概念整理の角度で差別化。

### 内部リンク改善（既存5記事に相互リンク追加）
- 新規記事 → tokubetsu-shien-ict / special-needs-ict-support-tools-checklist / reasonable-accommodation-school-record / individual-education-plan-writing-guide / free-ict-tools-safety-checklist / giga-device-lesson-use-guide
- 既存5記事（tokubetsu-shien-ict / reasonable-accommodation-school-record / individual-education-plan-writing-guide / free-ict-tools-safety-checklist / giga-device-lesson-use-guide）の関連記事欄から新規記事への戻りリンクを追加。

### トップページ導線
- `app/page.tsx` に「最近更新した記事」コンパクト節（updatedAt降順で最大4件、テキストリスト）を追加。既存節・デザインは維持。

### 品質確認（フェーズ2）
| 項目 | 結果 |
|---|---|
| `node scripts/validate.mjs` | ✅ 通過（記事29 / DB 11） |
| 内部リンク解決チェック | ✅ 破損0（29記事すべて解決） |
| `npm run build` | ✅ 成功（51ページ生成、新規記事もSSG） |
| sitemap.xml への反映 | ✅ 新規記事反映（記事29件） |
| AdSense / GA4 / Search Console / robots / canonical / 固定ページ | ✅ 変更なし（git status で保護対象に変更なしを確認） |
| `npm run lint` | ⚠ 未設定（前回同様。次回改善案として継続記録） |

---

## 2026-06-27 フェーズ1（AdSense審査中の品質改善フェーズ）

### 新規記事 2本
1. [生成AIガイドラインVer.2.0を学校現場向けに読む：先生が押さえたい5つの視点](content/articles/generative-ai-guideline-v2-school-reading.md)
   - カテゴリ: AI校務改善 / slug: `generative-ai-guideline-v2-school-reading`
   - 文科省ガイドラインを「禁止リストではなく考え方の整理」として読む5視点（説明責任／個人情報／著作権／情報活用能力／安全な校務支援から）。原本確認を促す注記つき。
2. [デジタル教科書の本格導入で学校現場は何が変わるか：紙との使い分けと特別支援の視点](content/articles/digital-textbook-introduction-school-changes.md)
   - カテゴリ: ICT活用 / slug: `digital-textbook-introduction-school-changes`
   - 「紙かデジタルか」の二択にせず、発達段階・読みやすさ・操作性・集中・書き込み・家庭環境の6観点で使い分け。特別支援・合理的配慮の視点を含む。

### 内部リンク改善（既存記事7本に相互リンク追加）
- 生成AIガイドライン記事へ ← school-generative-ai-privacy-security / chatgpt-teacher-beginner-guide / generative-ai-school-training-guide / ai-koomu-kaizen-nyumon
- デジタル教科書記事へ ← tokubetsu-shien-ict / reasonable-accommodation-school-record / giga-device-lesson-use-guide
- 新規記事側からも既存記事へ自然なリンクを本文・関連記事に設置済み。

### トップページ導線
- `app/page.tsx` に「特別支援教育 × ICT」ピックアップ節を追加（特別支援教育カテゴリの最新3本＋カテゴリページへの導線）。既存の最新記事・DB新着・ニュース節は維持。

### SNS運用メモ
- `docs/sns/x-posts-edu-dx-reflections-10.md`（Markdown）
- `docs/sns/buffer-x-edu-dx-reflections-10.csv`（Buffer取り込み用、リンクなしリフレクション10件）

## 品質確認結果（2026-06-27）

| 項目 | 結果 |
|---|---|
| `node scripts/validate.mjs` | ✅ 通過（記事28 / DB 11） |
| 内部リンク（/articles/）解決チェック | ✅ 全リンク解決（破損0） |
| `npm run build` | ✅ 成功（49ページ生成、新規2記事もSSG） |
| 型チェック（build内） | ✅ エラーなし |
| sitemap.xml への新規記事反映 | ✅ 2本とも `.next` プリレンダーに反映（記事28件） |
| `npm run lint` | ⚠ 未設定（eslintrc不在で対話プロンプト化。今回は構成変更を避け未実行。build内型チェックで代替） |
| AdSense / GA4 / Search Console / robots / canonical | ✅ 変更なし（git diff で layout.tsx・GoogleAnalytics.tsx・robots.ts・sitemap.ts は無変更を確認） |

## Vercel 本番反映後の確認チェックリスト

push後、Vercel の自動デプロイ完了を待ってから本番URL（https://edu-ai-platform-delta.vercel.app ）で確認する。

**デプロイ成否**
- [ ] Vercel ダッシュボードで対象コミットのデプロイが Ready（ビルド失敗なし）
- [ ] 本番トップページが表示される

**新規記事の反映**
- [ ] `/articles/education-ai-service-checklist-before-use` が表示される（フェーズ3）
- [ ] `/articles/special-needs-ict-reasonable-accommodation` が表示される（フェーズ2）
- [ ] `/articles/generative-ai-guideline-v2-school-reading` / `/articles/digital-textbook-introduction-school-changes`（フェーズ1）
- [ ] 各記事の title / description / OGP / canonical が正しい（ページソースで確認）
- [ ] 記事一覧 `/articles`・該当カテゴリページに新規記事が出る
- [ ] トップの「最近更新した記事」「特別支援教育 × ICT」節が表示される

**サイトマップ・クロール**
- [ ] `/sitemap.xml` に新規記事30件が含まれる
- [ ] `/robots.txt` が想定どおり（sitemap参照・index許可）
- [ ] 内部リンクの遷移（新旧記事の相互リンク）が本番で切れていない

**審査保護対象に意図しない変更がないか**
- [ ] AdSense スクリプトがトップ/記事で従来どおり読み込まれる（`pagead2.googlesyndication.com`）
- [ ] GA4 が従来どおり発火する
- [ ] Search Console の `verification.google` メタが残っている
- [ ] canonical が各ページで正しい

**運用**
- [ ] Search Console で sitemap 再送信／新規URLのインデックス状況を後日確認
- [ ] 体感パフォーマンス・崩れがないか主要ページを目視

## 触っていないファイル（審査保護対象）
- `app/layout.tsx`（AdSenseスクリプト、Search Console verification、canonical/metadata）
- `components/GoogleAnalytics.tsx`
- `app/robots.ts` / `app/sitemap.ts`（sitemapは記事追加で自動反映、コードは無変更）
- `app/privacy` / `app/disclaimer` / `app/about` / `app/contact` / `app/operator`

## 次にやること（候補）
- ~~テーマC「特別支援教育におけるICT活用と合理的配慮」~~ → フェーズ2で実装済み
- ~~トップに「最近更新した記事（updatedAt順）」~~ → フェーズ2で実装済み
- ~~テーマD「教育AIサービスを学校で使う前に確認したいこと」~~ → フェーズ3で実装済み
- ESLint設定の整備（`next lint` 非対話化、または ESLint CLI へ移行）← 未対応の最優先候補
- 記事一覧ページ（/articles）側にも更新日表示やソートを検討
- 内部リンクを既存記事に追加した際、updatedAt をあえて据え置いている点の運用方針（軽微変更は更新日を変えない）を継続するか検討

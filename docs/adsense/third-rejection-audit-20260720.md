# Google AdSense 3回目不承認後のサイト監査

監査日: 2026-07-20  
対象: 教育DXナビ（`https://edu-ai-platform-delta.vercel.app`）  
判定通知: 「有用性の低いコンテンツ」

## 結論

3回目不承認の直接の判定ロジックはGoogleから開示されていないため断定できない。ただし、コードとコンテンツには低価値サイトと評価され得る問題が同時に存在した。

第一段階では記事を増やさず、公開記事を30件から15件へ縮小した。広告は公開継続記事の本文が正常に取得できた場合だけ読み込む。DBとニュースはソースを残し、導線・sitemapから外して直接アクセスも404とした。

一方、公開継続候補15件のMarkdown本文には外部出典URLがなかった。表示時に関連する文部科学省の一次資料を明示したが、記事内の個別主張と出典の対応確認は第2段階の必須作業である。現時点を再審査申請可能とは判定しない。

## 監査で確認した事実

### 公開構造と広告

- `app/layout.tsx` でAdSenseを読み込んでいたため、トップ、一覧、カテゴリ、固定ページ、DB、ニュース、404を含む全ルートが対象だった。
- `/db` と `/news` はnoindexだったが、トップ、ヘッダー、フッターからリンクされていた。
- 404は共通metadataの `index: true` を継承し、ページ固有の一意なnoindex指定がなかった。
- `/ads.txt` は存在しない。Publisher ID以外のアカウント情報を確認できないため、`DIRECT` 等は推測して追加しなかった。
- Search Console所有権確認metaは保持した。

### 記事

- Markdown記事は30件。
- 公開日は2026-06-19が12件、2026-06-17が7件で、短期間に集中していた。
- 一般論、注意事項、チェックリスト、まとめ、関連記事という類似構成が多い。
- `joseikin-guide-2025` は年度が古く、制度情報の継続確認が必要だった。
- 公開継続候補15件の本文に外部URLは0件だった。
- 公開継続記事から公開停止記事への内部リンクが31件あり、公開継続記事へ付け替えた。

### DB・外部リンク

抽出できた外部URLは記事・DB合計11件。HTTP取得では9件が応答し、次の2件に問題があった。

- `https://litalico.foundation/`: DNS解決不能。掲載された助成制度の存在を確認できない。
- `https://openai.com`: 自動取得はHTTP 403。リンク切れとは断定しない。

内容面では、日本財団の助成情報、特別支援教育就学奨励費、研修・法令の一部が団体または省庁トップへリンクしている。Microsoft Immersive Readerは旧OneNote Learning Tools URLで、現行資料との対応確認が必要である。制度名・金額・対象・URLは推測修正せず、DB全体を公開対象から外した。

## robots・canonical・sitemap

- canonicalはトップ、一覧、カテゴリ、記事、固定ページでルート別に設定済み。
- sitemapは共通の公開記事取得関数を参照し、公開停止記事を除外。
- 記事が0件になる助成金・研修カテゴリは、静的生成・一覧導線・sitemapから除外し、直接アクセスは404。
- `/db`、`/news`、ニュース詳細はsitemapに含めず、直接アクセスも404/noindex。
- 404はHTTP 404を維持し、Next.jsが404へ自動付与する一意な `noindex` を使用。

## 4分類

### KEEP_AND_STRENGTHEN（15）

- `ai-lesson-preparation-prompt`
- `chatgpt-tsuchihyo-shoken`
- `digital-textbook-introduction-school-changes`
- `education-ai-service-checklist-before-use`
- `generative-ai-guideline-v2-school-reading`
- `giga-device-lesson-use-guide`
- `ict-teaching-tools-selection-guide`
- `individual-education-plan-writing-guide`
- `reasonable-accommodation-school-record`
- `school-generative-ai-privacy-security`
- `special-needs-behavior-record-guide`
- `special-needs-ict-reasonable-accommodation`
- `special-needs-ict-support-tools-checklist`
- `special-needs-visual-schedule-support`
- `tokubetsu-shien-ict`

### MERGE（11）

- `ai-class-newsletter-prompt`
- `ai-koomu-kaizen-nyumon`
- `chatgpt-teacher-beginner-guide`
- `free-ict-tools-safety-checklist`
- `giga-school-device-troubleshooting`
- `google-forms-school-use-guide`
- `information-morals-education-themes`
- `kyoiku-dx-kiso`
- `microsoft-copilot-teacher-guide`
- `special-needs-parent-collaboration`
- `tablet-ict-jugyo-giga`

### UNPUBLISH（4）

- `education-grant-search-guide`
- `generative-ai-school-training-guide`
- `joseikin-guide-2025`
- `school-training-ict-ai-guide`

### USER_REVIEW（0）

分類としてのUSER_REVIEWは0件。実体験の有無は全30件で確認不能のため、CSVの `firsthand_evidence` は `USER INPUT REQUIRED` とした。

## 推測される不承認要因

以下は監査事実からの推測であり、Googleの判断の断定ではない。

1. 短期間に類似構造の記事が集中し、サイト固有の成果物や経験との対応が弱い。
2. 本文の主張を直接裏づける出典URLがなく、専門性・信頼性を確認しにくい。
3. noindexの薄いDB・ニュース、一覧、固定ページ、404まで広告コードを配信し、広告対象が広すぎた。
4. 古い助成金記事、確認不能なDB項目、団体トップへの出典が信頼性を下げた可能性がある。
5. 公開記事同士の主題重複が大きく、検索者ごとの明確な価値差を示しにくかった。

## USER INPUT REQUIRED

- 運営者が実際に経験した業務・教材作成・校内手順の範囲。学校名、自治体名、児童生徒情報は不要。
- 中核記事の例・様式について、運営者が実務上妥当と確認できるか。
- Publisher ID以外のAdSenseアカウント情報。`ads.txt` の正確な行は管理画面から取得する。
- 各記事の個別主張と一次資料の対応を運営者が最終確認した日。

記事別指標は `content-inventory-20260720.csv` を参照。

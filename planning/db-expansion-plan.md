# 教育情報DB 50件拡充計画

## 現状と目標

| 情報タイプ | 現在 | 目標 | 追加数 |
|---|---|---|---|
| 法令・通知 | 3 | 10 | +7 |
| ツール | 3 | 12 | +9 |
| 助成金 | 3 | 8 | +5 |
| 研修 | 2 | 8 | +6 |
| 教材 | 0 | 7 | +7 |
| 研究・報告書 | 0 | 5 | +5 |
| **合計** | **11** | **50** | **+39** |

**データ品質の原則**
- 架空の金額・期限・公募情報は一切作らない
- すべてのエントリに公式ソースURL（source フィールド）を付与する
- 情報が変動する助成金・研修は description に「要公式サイト確認」を明記する
- 入力後は必ず `npm run validate` を実行してからコミットする

---

## 法令・通知（現在3件 → 目標10件）

追加すべきエントリの方針と出典元。**具体的な記載内容は公式サイト確認後に入力すること。**

| 追加優先度 | タイトル案 | 出典元 | ファイル |
|---|---|---|---|
| ★★★ | 特別支援教育の推進について（2007年文科省通知） | https://www.mext.go.jp/ | laws.json |
| ★★★ | インクルーシブ教育システム構築に関する特別委員会報告（中教審） | https://www.mext.go.jp/ | laws.json |
| ★★★ | 文部科学省「生成AIの利用に関する暫定的なガイドライン」 | https://www.mext.go.jp/ | laws.json |
| ★★ | 特別支援学校幼稚部教育要領（最新版） | https://www.mext.go.jp/ | laws.json |
| ★★ | 特別支援学校学習指導要領解説（各障害種） | https://www.mext.go.jp/ | laws.json |
| ★★ | 学校教育法第81条（通級指導・特別支援学級の根拠規定） | https://elaws.e-gov.go.jp/ | laws.json |
| ★ | 教育データ利活用ロードマップ（文科省） | https://www.mext.go.jp/ | laws.json |

**入力時の留意点**
- 法令は e-Gov 法令データベース（https://elaws.e-gov.go.jp/）が一次情報
- 文科省通知は発出年月日・通知番号を description に含める
- category は原則「特別支援教育」、AI関連ガイドラインは「AI校務改善」

---

## ツール（現在3件 → 目標12件）

| 追加優先度 | タイトル案 | 出典元 | ファイル |
|---|---|---|---|
| ★★★ | Microsoft Immersive Reader 以外の読み上げ拡張（Claro SpeakPDF等） | 各社公式サイト | ict-tools.json |
| ★★★ | 文字起こしツール（notta・Otter.ai等）の教育利用 | 各社公式サイト | ict-tools.json |
| ★★★ | NHK for School（授業動画・特別支援対応コンテンツ） | https://www.nhk.or.jp/school/ | ict-tools.json |
| ★★★ | 音声教材センター BEAT（発達障害向けデジタル教材） | https://www.beat.to/ | ict-tools.json |
| ★★ | Grid3（コミュニケーションエイドソフト） | https://www.thinksmartbox.com/ | ict-tools.json |
| ★★ | Tobii Eye Tracker（視線入力デバイス） | https://www.tobii.com/ | ict-tools.json |
| ★★ | Voice Dream Reader（読み上げアプリ） | 各ストア公式ページ | ict-tools.json |
| ★★ | Canva for Education（教材作成ツール） | https://www.canva.com/education/ | ict-tools.json |
| ★ | Chat-E（教育向けAIチャット）等の学校向けAIツール | 各社公式サイト | ict-tools.json |

**入力時の留意点**
- 価格・プランは変動するため description に金額は書かず「無料プランあり」等にとどめる
- iOS/Android/Windows等の対応OSを description に含める
- source は App Store/Google Play ではなく開発元公式サイトを優先

---

## 助成金（現在3件 → 目標8件）

**重要：助成金情報は公募期間外は「今年度の公募は終了」等の状態になる。description には時期限定の情報を書かず、制度の性質・対象・規模感を書く。**

| 追加優先度 | タイトル案 | 問い合わせ先（要公式確認） | ファイル |
|---|---|---|---|
| ★★★ | 公益財団法人 日本財団 障害福祉助成 | https://www.nippon-foundation.or.jp/ | grants.json |
| ★★★ | 公益財団法人 東京コミュニティ財団 | https://www.tcf.or.jp/ | grants.json |
| ★★ | SOMPOホールディングス 福祉助成 | 公式サイトで要確認 | grants.json |
| ★★ | 公益財団法人 損保ジャパン日本興亜福祉財団 | https://sjnkwf.org/ | grants.json |
| ★ | 公益財団法人 ベネッセこども基金 | https://benesse-kodomokikin.or.jp/ | grants.json |

**入力時の絶対ルール**
1. 金額は「上限〇〇万円（要公式確認）」または description に書かない
2. 申請締め切りは「例年〇月頃（要公式確認）」にとどめる
3. 架空の公募情報・架空の採択事例を作らない
4. すべて公式サイトで確認してから source に URL を入れる

---

## 研修（現在2件 → 目標8件）

| 追加優先度 | タイトル案 | 出典元 | ファイル |
|---|---|---|---|
| ★★★ | 都道府県立特別支援教育センター研修（各都道府県） | 各都道府県教育委員会公式サイト | training.json |
| ★★★ | 日本LD学会 年次大会・研修会 | https://www.jald.or.jp/ | training.json |
| ★★ | 日本特殊教育学会 年次大会 | https://www.jase.jp/ | training.json |
| ★★ | 放送大学 特別支援教育関連科目（免許法認定通信教育） | https://www.ouj.ac.jp/ | training.json |
| ★★ | 文部科学省主催 インクルーシブ教育システム推進セミナー | https://www.mext.go.jp/ | training.json |
| ★ | 発達障害情報・支援センター オンライン研修 | https://www.rehab.go.jp/ddis/ | training.json |

**入力時の留意点**
- 都道府県センターは「各都道府県の特別支援教育センター」として1エントリにまとめ、調べ方を description に書く
- 学会の年次大会は「例年〇月頃開催」にとどめ、具体的な日程は source（公式サイト）参照とする

---

## 教材（現在0件 → 目標7件）

| 追加優先度 | タイトル案 | 出典元 | ファイル |
|---|---|---|---|
| ★★★ | 文部科学省 特別支援教育の充実ポータルサイト | https://www.mext.go.jp/ | 新規: materials.json |
| ★★★ | NHK for School 特別支援教育向けコンテンツ | https://www.nhk.or.jp/school/ | materials.json |
| ★★★ | 国立特別支援教育総合研究所（NISE）教材データベース | https://www.nise.go.jp/ | materials.json |
| ★★ | 全国障害者問題研究会（全障研）の教育実践資料 | https://www.nginet.or.jp/ | materials.json |
| ★★ | 学術変換協議会 BEAT（発達障害向け音声教材） | https://www.beat.to/ | materials.json |
| ★ | 肢体不自由教育情報センター 指導教材・実践事例 | 公式サイト要確認 | materials.json |
| ★ | 全国視覚障害教育研究会 資料・教材 | 公式サイト要確認 | materials.json |

---

## 研究・報告書（現在0件 → 目標5件）

| 追加優先度 | タイトル案 | 出典元 | ファイル |
|---|---|---|---|
| ★★★ | NISE 研究紀要・成果報告書（発達障害分野） | https://www.nise.go.jp/ | 新規: reports.json |
| ★★★ | 文部科学省 特別支援教育に関する調査（最新版） | https://www.mext.go.jp/ | reports.json |
| ★★ | 内閣府 障害者白書（最新版） | https://www8.cao.go.jp/shougai/ | reports.json |
| ★★ | 国立障害者リハビリテーションセンター 発達障害情報・支援センター 報告書 | https://www.rehab.go.jp/ddis/ | reports.json |
| ★ | 文部科学省 通常の学級に在籍する発達障害の可能性のある特別な教育的支援を必要とする児童生徒に関する調査 | https://www.mext.go.jp/ | reports.json |

---

## 追加作業の進め方

### 1件追加するたびに行う手順

```bash
# 1. 公式サイトで情報を確認
# 2. 該当JSONファイルを編集してエントリを追加
# 3. 検証を実行
npm run validate

# 4. エラーがなければコミット
git add content/db/
git commit -m "db: 〇〇を追加（法令/ツール/助成金/研修/教材）"
```

### 新規JSONファイルを追加する場合

`content/db/materials.json` や `content/db/reports.json` を新規作成する際は、
`content/templates/resource-template.json` を参考に空の配列 `[]` から始める。

```bash
# 新規ファイルは空配列で初期化してから追記
echo '[]' > content/db/materials.json
```

### バッチ追加の推奨順序

1. **法令・通知**: 変動が少なく事実確認しやすい → 最初に整備
2. **ツール**: 公式サイトで情報が明確 → 次に整備
3. **研修**: 時期変動があるが機関情報は安定 → 中盤
4. **教材**: 機関サイトの探索が必要 → 中盤
5. **助成金**: 公募状況の変動が大きい → 後半（随時更新前提）
6. **研究・報告書**: 報告書PDFを確認してから → 後半

---

## メンテナンス方針

- **助成金**: 採択後・公募終了後は description を更新し updatedAt を変更する
- **ツール**: 半年に1回、サービス終了・URL変更がないか確認する
- **法令**: 改正があれば速やかに更新し、記事側にも改正注記を入れる
- **研究・報告書**: 新しい調査が公開されたら旧版と差し替えるか、新規追加する

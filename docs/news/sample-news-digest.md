# ニュースまとめ サンプルテンプレート

このファイルは運用サンプルです。実際に公開するには content/news-digests/ に移動し、
実在の出典URLと独自コメントを入れてください。

---

## frontmatter 例

```yaml
---
title: "教育DX・生成AIニュースまとめ YYYY年M月D日"
description: "教育DX、生成AI、ICT活用、校務改善、特別支援教育に関するニュースを、学校現場の視点で整理します。"
slug: "YYYY-MM-DD-education-dx-news"
publishedAt: "YYYY-MM-DD"
updatedAt: "YYYY-MM-DD"
draft: true
topics:
  - "教育DX"
  - "生成AI"
  - "ICT活用"
items:
  - title: "（実在のニュース見出しを入れる）"
    source: "（出典メディア名）"
    url: "https://（実在する出典URLを入れる）"
    publishedAt: "YYYY-MM-DD"
    topic: "生成AI"
    summary: "元記事本文のコピーではなく、教育現場向けに独自の言葉で1〜2文で整理する。"
    schoolPoint: "学校現場で確認したいポイントを1〜2文で整理する。"
    chifuyuNote: "千冬先生メモとして、無理なく読める短いコメントを入れる。"
---
```

---

## 本文例

今週の教育DX・生成AI・ICT活用に関する動きを、学校現場で確認しやすいように整理します。
元記事の本文は転載せず、出典リンクと独自コメントで紹介します。

---

## 公開前チェックリスト

- [ ] 出典URLが実在・アクセス可能か確認した
- [ ] summary は元記事本文のコピーではない
- [ ] 個人情報・学校名・自治体名が含まれていない
- [ ] 医療・法律・行政判断を断定していない
- [ ] draft: false に変更した（公開する場合のみ）
- [ ] content/news-digests/ に移動した

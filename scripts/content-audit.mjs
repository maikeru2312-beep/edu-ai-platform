// LEGACY: 2026-07-20 時点の AdSense 監査判断をハードコードした履歴用スクリプトです。
// - 現在のリポジトリ状態の判定には使用しません（現在の source of truth は
//   npm test / npm run validate、つまり scripts/adsense-audit.test.mjs と scripts/validate.mjs）。
// - docs/adsense/*-20260720.csv は当時の監査記録なので、現在値で再生成しません。
//   出力先を明示した場合のみ書き出します:
//     AUDIT_LEGACY_OUT_DIR=<書き出し先> node scripts/content-audit.mjs
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const dir = path.join(root, 'content/articles');
const outDir = process.env.AUDIT_LEGACY_OUT_DIR;
if (!outDir) {
  console.error('scripts/content-audit.mjs は 2026-07-20 時点の履歴用スクリプトです。');
  console.error('docs/adsense の監査記録を現在値で上書きしないため、既定では書き出しません。');
  console.error('現在の状態を検証するには npm run audit を使用してください。');
  console.error('履歴スクリプトの出力を確認する場合: AUDIT_LEGACY_OUT_DIR=<dir> node scripts/content-audit.mjs');
  process.exit(2);
}
const output = path.join(outDir, 'content-inventory-20260720.csv');
const sourcePattern = /https?:\/\/[^\s)"'>]+/g;
const markdownPattern = /[#>*_`[\]()|~-]/g;

const decisions = {
  'ai-class-newsletter-prompt': ['MERGE', 'AI校務プロンプト', 'ai-lesson-preparation-promptへ成果物例を統合'],
  'ai-koomu-kaizen-nyumon': ['MERGE', '生成AI入門', '一般論が中心のため中核記事へ統合'],
  'chatgpt-teacher-beginner-guide': ['MERGE', '生成AI入門', 'サービス入門と安全確認の記事群で重複'],
  'education-grant-search-guide': ['UNPUBLISH', '助成金', '中核3領域外で継続的な制度確認が必要'],
  'free-ict-tools-safety-checklist': ['MERGE', 'ツール安全確認', 'education-ai-service-checklist-before-useと重複'],
  'generative-ai-school-training-guide': ['UNPUBLISH', '研修', '研修情報の継続更新と独自性を担保できない'],
  'giga-school-device-troubleshooting': ['MERGE', 'GIGA端末', '一般的Q&Aで一次情報との対応が弱い'],
  'google-forms-school-use-guide': ['MERGE', 'ICTツール操作', 'サービス固有仕様の継続更新が必要'],
  'information-morals-education-themes': ['MERGE', 'ICT安全', '安全確認・個人情報記事と論点が重複'],
  'joseikin-guide-2025': ['UNPUBLISH', '助成金', '年度が古く制度情報の正確性を維持できない'],
  'kyoiku-dx-kiso': ['MERGE', '教育DX入門', '一般的な基礎説明で中核記事との重複が大きい'],
  'microsoft-copilot-teacher-guide': ['MERGE', '生成AI入門', 'サービス仕様依存で安全確認記事と重複'],
  'school-training-ict-ai-guide': ['UNPUBLISH', '研修', '研修記事間の重複が大きく中核3領域外'],
  'special-needs-parent-collaboration': ['MERGE', '合理的配慮と記録', '合理的配慮・計画記事へ統合可能'],
  'tablet-ict-jugyo-giga': ['MERGE', 'GIGA端末', 'giga-device-lesson-use-guideと主題が重複'],
};

const keepReasons = {
  'individual-education-plan-writing-guide': ['個別計画', '記入手順と改善例を持つ中核記事'],
  'special-needs-behavior-record-guide': ['行動記録', 'ABC記録様式を持つ中核記事'],
  'chatgpt-tsuchihyo-shoken': ['AI校務プロンプト', '匿名化と教員確認を伴う具体手順'],
  'education-ai-service-checklist-before-use': ['ツール安全確認', '導入前チェックリストという実用品'],
  'ai-lesson-preparation-prompt': ['AI校務プロンプト', '授業準備の具体的な入力・確認手順'],
  'digital-textbook-introduction-school-changes': ['デジタル教科書', '紙との使い分けを特別支援の観点で整理'],
  'special-needs-ict-reasonable-accommodation': ['合理的配慮と記録', '配慮と指導を区別する中核解説'],
  'reasonable-accommodation-school-record': ['合理的配慮と記録', '申請・合意形成・記録の具体手順'],
  'special-needs-visual-schedule-support': ['視覚支援', '支援手順と様式に展開できる具体性'],
  'ict-teaching-tools-selection-guide': ['教材選定', '選定観点を比較できる実用記事'],
  'school-generative-ai-privacy-security': ['ツール安全確認', '学校の個人情報・安全確認に焦点'],
  'generative-ai-guideline-v2-school-reading': ['生成AIガイドライン', '公式ガイドラインを学校向けに整理'],
  'giga-device-lesson-use-guide': ['GIGA端末', '授業場面別の選択基準を持つ'],
  'special-needs-ict-support-tools-checklist': ['教材選定', '目的別チェックリストを持つ'],
  'tokubetsu-shien-ict': ['特別支援ICT', '特別支援教育×ICTの入口となる中核記事'],
};

const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });
const csv = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
const rows = [];

for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.md')).sort()) {
  const slug = file.replace(/\.md$/, '');
  const parsed = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
  const plain = parsed.content.replace(sourcePattern, ' ').replace(markdownPattern, ' ');
  const wordCount = [...segmenter.segment(plain)].filter((item) => item.isWordLike).length;
  const sources = new Set(parsed.content.match(sourcePattern) ?? []);
  const [recommendation, overlap, reason] = decisions[slug]
    ?? ['KEEP_AND_STRENGTHEN', ...keepReasons[slug]];
  rows.push([
    slug,
    parsed.data.title,
    parsed.data.category,
    parsed.data.publishedAt,
    parsed.data.updatedAt ?? '',
    wordCount,
    sources.size,
    0,
    overlap,
    'USER INPUT REQUIRED',
    /チェックリスト|記入例|テンプレート|プロンプト|様式|Before|After/i.test(parsed.content) ? 'あり' : 'なし',
    parsed.data.published === false ? 'UNPUBLISHED' : 'PUBLISHED',
    recommendation,
    reason,
  ]);
}

const header = [
  'slug', 'title', 'category', 'published_at', 'updated_at', 'word_count',
  'source_count', 'broken_links', 'overlap_group', 'firsthand_evidence',
  'utility_asset', 'current_status', 'recommendation', 'reason',
];
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, [header, ...rows].map((row) => row.map(csv).join(',')).join('\n') + '\n');
console.log(`Wrote ${rows.length} rows to ${path.relative(root, output)}`);

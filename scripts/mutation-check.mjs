#!/usr/bin/env node
/**
 * 受入ゲートの mutation test。
 *
 * 「テストが通っている」ことと「テストが壊れたら落ちる」ことは別である。
 * 本スクリプトは、第6回審査で守りたい性質をわざと1つずつ壊し、
 * 対応するテストが実際に FAIL することを確認したうえで、完全に復元する。
 *
 * 使い方: npm run test:mutation
 *
 * 前提: working tree が clean であること（復元に git checkout を使うため）。
 * 途中で異常終了した場合も、finally で必ず復元を試みる。
 */

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const TEST_FILES = ['scripts/adsense-audit.test.mjs', 'scripts/sixth-review-original-value.test.mjs'];

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

function git(...args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' });
}

function assertCleanTree(when) {
  const status = git('status', '--porcelain', '--', 'content', 'lib', 'app', 'scripts', 'middleware.ts', 'docs');
  if (status.trim() !== '') {
    console.error(red(`\n✗ working tree が clean ではありません（${when}）:\n${status}`));
    console.error('  mutation test は git checkout で復元するため、clean な状態から実行してください。');
    process.exit(1);
  }
}

/** 対象テストを実行し、FAIL したかどうかを返す。 */
function testsFail() {
  const result = spawnSync(process.execPath, ['--test', ...TEST_FILES], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return { failed: result.status !== 0, output: (result.stdout ?? '') + (result.stderr ?? '') };
}

function patch(file, from, to) {
  const abs = path.join(root, file);
  const original = fs.readFileSync(abs, 'utf8');
  const normalized = original.replace(/\r\n/g, '\n');
  const needle = from.replace(/\r\n/g, '\n');
  if (!normalized.includes(needle)) {
    throw new Error(`mutation の対象が見つかりません: ${file} :: ${needle.slice(0, 70)}`);
  }
  const mutated = normalized.replace(needle, to.replace(/\r\n/g, '\n'));
  fs.writeFileSync(abs, original.includes('\r\n') ? mutated.replace(/\n/g, '\r\n') : mutated);
}

/**
 * 各 mutation は「守りたい性質」を1つだけ壊す。
 * expect には、その性質を守っているテスト名の一部を書く（そのテストが落ちたことまで確認する）。
 */
const MUTATIONS = [
  {
    name: '旧ポジショニング（収集・整理する情報メディア）を1箇所だけ戻す',
    files: ['components/Footer.tsx'],
    expect: 'aggregator-era positioning',
    apply: () =>
      patch(
        'components/Footer.tsx',
        '特別支援教育を中心とした学校実務で、ICT・生成AI・支援・記録を',
        '特別支援教育・ICT活用・AI校務改善に関する情報を収集・整理し、',
      ),
  },
  {
    name: '統合した記事を公開へ戻す（sitemap・記事一覧へ復活させる）',
    files: ['content/articles/school-generative-ai-privacy-security.md'],
    expect: 'merged and retired articles are unpublished',
    apply: () =>
      patch('content/articles/school-generative-ai-privacy-security.md', 'published: false', 'published: true'),
  },
  {
    name: '退役した記事に fake redirect を張る（意味的な統合先が無いのに 301 する）',
    files: ['middleware.ts'],
    expect: 'retired',
    apply: () =>
      patch(
        'middleware.ts',
        "  'tokubetsu-shien-ict': 'special-needs-ict-support-tools-checklist',",
        "  'tokubetsu-shien-ict': 'special-needs-ict-support-tools-checklist',\n"
        + "  'information-morals-education-themes': 'giga-device-lesson-use-guide',",
      ),
  },
  {
    name: '統合の 301 先を誤らせる（読者意図と違う記事へ送る）',
    files: ['middleware.ts'],
    expect: 'redirect to their exact intended target',
    apply: () =>
      patch(
        'middleware.ts',
        "  'tokubetsu-shien-ict': 'special-needs-ict-support-tools-checklist',",
        "  'tokubetsu-shien-ict': 'giga-device-lesson-use-guide',",
      ),
  },
  {
    name: '301 を多段にする（redirect 元へ redirect する）',
    files: ['middleware.ts'],
    expect: 'one hop',
    apply: () =>
      patch(
        'middleware.ts',
        "  'ai-lesson-preparation-prompt': 'ai-koomu-kaizen-nyumon',",
        "  'ai-lesson-preparation-prompt': 'tokubetsu-shien-ict',",
      ),
  },
  {
    name: 'registry から canonical 記事を1件削除する',
    files: ['docs/adsense-sixth-review/01-canonical-value-registry.csv'],
    expect: 'registry entry',
    apply: () => {
      const file = 'docs/adsense-sixth-review/01-canonical-value-registry.csv';
      const abs = path.join(root, file);
      const lines = fs.readFileSync(abs, 'utf8').split(/\r?\n/);
      const idx = lines.findIndex((l) => l.startsWith(String.fromCharCode(34) + 'google-forms-school-use-guide' + String.fromCharCode(34)));
      if (idx === -1) throw new Error('registry 行が見つかりません');
      lines.splice(idx, 1);
      fs.writeFileSync(abs, lines.join('\r\n'));
    },
  },
  {
    name: 'registry の独自価値を一次資料の要約だけにする',
    files: ['docs/adsense-sixth-review/01-canonical-value-registry.csv'],
    expect: 'official-source summary',
    apply: () => {
      const file = 'docs/adsense-sixth-review/01-canonical-value-registry.csv';
      const abs = path.join(root, file);
      const text = fs.readFileSync(abs, 'utf8');
      // CSV は全フィールドが引用符つき。3列目（primary_unique_value_type）だけを置き換える。
      const mutated = text.replace(
        /^("google-forms-school-use-guide","[^\n]*?"),"(?:OPERATOR_DECISION_RULE|PROCEDURE_GUIDE|DECISION_MATRIX|WORKSHEET_FORM|WORKED_EXAMPLE|FIRSTHAND_PRACTICE_BOUNDARY|ORIGINAL_COMPARATIVE_ANALYSIS|ORIGINAL_SYNTHESIS_WITH_DECISION_LOGIC)",/m,
        '$1,"OFFICIAL_SOURCE_SUMMARY",',
      );
      if (mutated === text) throw new Error('value type の書き換えに失敗しました');
      fs.writeFileSync(abs, mutated);
    },
  },
  {
    name: '2つの canonical 記事に同じ読者ジョブを設定する',
    files: ['docs/adsense-sixth-review/01-canonical-value-registry.csv'],
    expect: 'same primary reader job',
    apply: () => {
      const file = 'docs/adsense-sixth-review/01-canonical-value-registry.csv';
      const abs = path.join(root, file);
      const lines = fs.readFileSync(abs, 'utf8').split(/\r?\n/);
      const parse = (line) => {
        const out = []; let cur = ''; let q = false;
        for (let i = 0; i < line.length; i += 1) {
          const c = line[i];
          if (q) { if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i += 1; } else q = false; } else cur += c; continue; }
          if (c === '"') { q = true; continue; }
          if (c === ',') { out.push(cur); cur = ''; continue; }
          cur += c;
        }
        out.push(cur); return out;
      };
      const a = lines.findIndex((l) => l.startsWith(String.fromCharCode(34) + 'google-forms-school-use-guide' + String.fromCharCode(34)));
      const b = lines.findIndex((l) => l.startsWith(String.fromCharCode(34) + 'free-ict-tools-safety-checklist' + String.fromCharCode(34)));
      if (a === -1 || b === -1) throw new Error('registry 行が見つかりません');
      const rowA = parse(lines[a]);
      const rowB = parse(lines[b]);
      rowB[1] = rowA[1]; // reader_job を複製する
      lines[b] = rowB.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',');
      fs.writeFileSync(abs, lines.join('\r\n'));
    },
  },
  {
    name: '公開記事から未公開記事へリンクする',
    files: ['content/articles/giga-device-lesson-use-guide.md'],
    expect: 'link to unpublished',
    apply: () =>
      patch(
        'content/articles/giga-device-lesson-use-guide.md',
        '](/articles/special-needs-ict-support-tools-checklist)',
        '](/articles/tokubetsu-shien-ict)',
      ),
  },
  {
    name: 'AdSense をサイト全体（layout）へ配信する',
    files: ['app/layout.tsx'],
    expect: 'AdSense',
    apply: () =>
      patch(
        'app/layout.tsx',
        '        <GoogleAnalytics />',
        '        <GoogleAnalytics />\n        {/* adsbygoogle */}',
      ),
  },
];

console.log('\n\x1b[1m🧬 受入ゲートの mutation test\x1b[0m');
console.log('─'.repeat(64));

assertCleanTree('開始時');

// 前提: 無傷の状態ではテストが通ること。
{
  const { failed, output } = testsFail();
  if (failed) {
    console.error(red('✗ mutation を適用する前からテストが FAIL しています。先にそちらを直してください。'));
    console.error(output.split('\n').filter((l) => /✖|Error/.test(l)).slice(0, 20).join('\n'));
    process.exit(1);
  }
  console.log(green('✓') + ' 無傷の状態でテストが通ることを確認しました');
}

let survived = 0;
const results = [];

for (const mutation of MUTATIONS) {
  let applied = false;
  try {
    mutation.apply();
    applied = true;
    const { failed, output } = testsFail();
    const named = failed && new RegExp(mutation.expect.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(output);
    if (failed && named) {
      console.log(`${green('✓ 検出')} ${mutation.name}`);
      results.push({ mutation: mutation.name, detected: true });
    } else if (failed) {
      console.log(`${green('✓ 検出')} ${mutation.name} ${dim('(別のテストが検出)')}`);
      results.push({ mutation: mutation.name, detected: true, byExpectedTest: false });
    } else {
      console.log(`${red('✗ 素通り')} ${mutation.name}`);
      console.log(dim(`    この変更を検出するテストがありません（期待していたテスト: ${mutation.expect}）`));
      survived += 1;
      results.push({ mutation: mutation.name, detected: false });
    }
  } catch (error) {
    console.log(`${red('✗ 適用失敗')} ${mutation.name}: ${error.message}`);
    survived += 1;
    results.push({ mutation: mutation.name, detected: false, error: error.message });
  } finally {
    if (applied || mutation.files) {
      try {
        git('checkout', '--', ...mutation.files);
      } catch (error) {
        console.error(red(`  復元に失敗しました: ${mutation.files.join(', ')} — ${error.message}`));
      }
    }
  }
}

// 変異が残っていないことを確認する。
assertCleanTree('終了時');
{
  const { failed } = testsFail();
  if (failed) {
    console.error(red('✗ 復元後にテストが FAIL しています。作業ツリーを確認してください。'));
    process.exit(1);
  }
}

console.log('─'.repeat(64));
if (survived === 0) {
  console.log(green(`✅ ${MUTATIONS.length} 件の mutation をすべて検出し、作業ツリーを完全に復元しました\n`));
  process.exit(0);
}
console.error(red(`❌ ${survived} / ${MUTATIONS.length} 件の mutation が素通りしました。ゲートを追加してください。\n`));
process.exit(1);

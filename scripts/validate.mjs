#!/usr/bin/env node
/**
 * コンテンツ検証スクリプト
 * 記事フロントマターとDB JSONの整合性を確認します。
 * 使用方法: npm run validate
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const VALID_CATEGORIES = [
  '特別支援教育',
  'ICT活用',
  'AI校務改善',
  '教材・支援ツール',
  '助成金・補助金',
  '研修・セミナー',
];

const VALID_DB_TYPES = [
  '法令・通知',
  'ツール',
  '助成金',
  '研修',
  '教材',
  '研究・報告書',
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

let errors = 0;

function fail(label, msg) {
  console.error(`  \x1b[31m✗\x1b[0m [${label}] ${msg}`);
  errors++;
}

function pass(msg) {
  console.log(`  \x1b[32m✓\x1b[0m ${msg}`);
}

// ─── 記事フロントマターの検証 ───────────────────────────────────────────
console.log('\n\x1b[1m📄 記事フロントマターの検証\x1b[0m');
console.log('─'.repeat(50));

const articlesDir = path.join(ROOT, 'content/articles');

if (!fs.existsSync(articlesDir)) {
  console.log('  ⚠ content/articles ディレクトリが存在しません');
} else {
  const mdFiles = fs.readdirSync(articlesDir).filter((f) => f.endsWith('.md'));

  if (mdFiles.length === 0) {
    console.log('  ⚠ 記事ファイルがありません');
  }

  for (const file of mdFiles) {
    const filePath = path.join(articlesDir, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    const label = `articles/${file}`;

    // slug（ファイル名）の形式チェック
    const slug = file.replace('.md', '');
    if (!/^[a-z0-9-]+$/.test(slug)) {
      fail(label, `ファイル名は英小文字・数字・ハイフンのみ使用可能です（現在: "${slug}"）`);
    }

    // 必須フィールド
    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
      fail(label, 'title が未設定または空文字です');
    }
    if (!data.description || typeof data.description !== 'string' || data.description.trim() === '') {
      fail(label, 'description が未設定または空文字です');
    }
    if (!VALID_CATEGORIES.includes(data.category)) {
      fail(label, `category "${data.category}" は無効です\n    有効値: ${VALID_CATEGORIES.join(' / ')}`);
    }
    if (!Array.isArray(data.tags) || data.tags.length === 0) {
      fail(label, 'tags が未設定または空配列です（1つ以上必要）');
    } else if (!data.tags.every((t) => typeof t === 'string')) {
      fail(label, 'tags の各要素は文字列である必要があります');
    }
    if (!data.publishedAt) {
      fail(label, 'publishedAt が未設定です（例: "2025-06-15"）');
    } else if (!DATE_RE.test(String(data.publishedAt))) {
      fail(label, `publishedAt "${data.publishedAt}" は YYYY-MM-DD 形式で指定してください`);
    }
    if (data.updatedAt !== undefined && !DATE_RE.test(String(data.updatedAt))) {
      fail(label, `updatedAt "${data.updatedAt}" は YYYY-MM-DD 形式で指定してください`);
    }

    if (errors === 0) pass(label);
  }

  pass(`${mdFiles.length} 件の記事ファイルをチェックしました`);
}

// ─── DB JSON の検証 ──────────────────────────────────────────────────────
console.log('\n\x1b[1m🗄️  教育情報DB JSONの検証\x1b[0m');
console.log('─'.repeat(50));

const dbDir = path.join(ROOT, 'content/db');
const seenIds = new Set();
let totalItems = 0;

if (!fs.existsSync(dbDir)) {
  console.log('  ⚠ content/db ディレクトリが存在しません');
} else {
  const jsonFiles = fs.readdirSync(dbDir).filter((f) => f.endsWith('.json'));

  if (jsonFiles.length === 0) {
    console.log('  ⚠ JSON ファイルがありません');
  }

  for (const file of jsonFiles) {
    const filePath = path.join(dbDir, file);
    let items;

    try {
      items = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      fail(`db/${file}`, `JSON パースエラー: ${e.message}`);
      continue;
    }

    if (!Array.isArray(items)) {
      fail(`db/${file}`, 'ファイルのルートが配列ではありません');
      continue;
    }

    for (const item of items) {
      const label = `db/${file}[${item.id ?? '(id未設定)'}]`;
      totalItems++;

      // id
      if (!item.id || typeof item.id !== 'string') {
        fail(label, 'id が未設定または文字列ではありません');
      } else if (seenIds.has(item.id)) {
        fail(label, `id "${item.id}" が重複しています（別のファイルで既出）`);
      } else {
        seenIds.add(item.id);
      }

      // title
      if (!item.title || typeof item.title !== 'string' || item.title.trim() === '') {
        fail(label, 'title が未設定または空文字です');
      }

      // type
      if (!VALID_DB_TYPES.includes(item.type)) {
        fail(label, `type "${item.type}" は無効です\n    有効値: ${VALID_DB_TYPES.join(' / ')}`);
      }

      // category
      if (!VALID_CATEGORIES.includes(item.category)) {
        fail(label, `category "${item.category}" は無効です\n    有効値: ${VALID_CATEGORIES.join(' / ')}`);
      }

      // description
      if (!item.description || typeof item.description !== 'string' || item.description.trim() === '') {
        fail(label, 'description が未設定または空文字です');
      }

      // tags
      if (!Array.isArray(item.tags)) {
        fail(label, 'tags が配列ではありません');
      }

      // updatedAt
      if (!item.updatedAt) {
        fail(label, 'updatedAt が未設定です（例: "2025-06-15"）');
      } else if (!DATE_RE.test(String(item.updatedAt))) {
        fail(label, `updatedAt "${item.updatedAt}" は YYYY-MM-DD 形式で指定してください`);
      }

      // source（任意）
      if (item.source !== undefined && (typeof item.source !== 'string' || item.source.trim() === '')) {
        fail(label, 'source を設定する場合は空でない文字列にしてください');
      }
    }

    pass(`db/${file} — ${items.length} 件`);
  }

  pass(`${jsonFiles.length} ファイル / 計 ${totalItems} 件をチェックしました`);
}

// ─── 結果 ────────────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(50));
if (errors === 0) {
  console.log('\x1b[32m✅ すべての検証に通過しました\x1b[0m\n');
  process.exit(0);
} else {
  console.error(`\x1b[31m❌ ${errors} 件のエラーが見つかりました。上記を修正してください。\x1b[0m\n`);
  process.exit(1);
}

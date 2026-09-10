#!/usr/bin/env node
/**
 * 参考資料（lib/article-references.ts）に登録した外部URLの死活確認。
 *
 * 記事の信頼性は「一次資料に読者が実際に飛べること」に依存するが、
 * 文部科学省等のURLは告知なく変わる。checkedAt を手で更新する運用だけでは
 * リンク切れに気づけないので、定期的に（少なくとも記事追加・更新のたびに）これを回す。
 *
 * 使い方: npm run refs:check
 *   - 200〜399 を OK とし、それ以外・タイムアウト・接続失敗を BROKEN として exit 1。
 *   - HEAD を拒否するサーバーがあるため、HEAD が 4xx/5xx なら GET で再確認する。
 *   - リダイレクト先が別ホストに変わった場合は WARN として表示する（内容が変わっている可能性）。
 */

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'lib/article-references.ts'), 'utf8');
const urls = [...new Set([...source.matchAll(/url: '([^']+)'/g)].map((m) => m[1]))].sort();

const UA = 'Mozilla/5.0 (compatible; edu-dx-navi-refcheck/1.0)';
const TIMEOUT_MS = 25000;

async function probe(url, method) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { method, redirect: 'follow', headers: { 'user-agent': UA }, signal: controller.signal });
    return { status: res.status, finalUrl: res.url };
  } catch (error) {
    return { status: 0, finalUrl: url, error: error.name === 'AbortError' ? 'timeout' : String(error.message ?? error) };
  } finally {
    clearTimeout(timer);
  }
}

async function check(url) {
  let r = await probe(url, 'HEAD');
  if (r.status === 0 || r.status >= 400) r = await probe(url, 'GET');
  return r;
}

const results = [];
// 同時実行は控えめに（公的機関のサーバーに負荷をかけない）
const queue = [...urls];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const url = queue.shift();
    const r = await check(url);
    results.push({ url, ...r });
  }
}));
results.sort((a, b) => a.url.localeCompare(b.url));

let broken = 0;
let warned = 0;
for (const r of results) {
  const ok = r.status >= 200 && r.status < 400;
  const hostChanged = ok && new URL(r.finalUrl).host !== new URL(r.url).host;
  const mark = ok ? (hostChanged ? 'WARN ' : 'ok   ') : 'BROKEN';
  if (!ok) broken += 1;
  if (hostChanged) warned += 1;
  console.log(`${mark} ${String(r.status).padStart(3)}  ${r.url}${hostChanged ? `  -> ${r.finalUrl}` : ''}${r.error ? `  [${r.error}]` : ''}`);
}
console.log(`\n${results.length} URLs: broken=${broken}, host-changed=${warned}`);
process.exit(broken > 0 ? 1 : 0);

// 記事の見出しから、URL フラグメントに使う id を作る。
//
// 記事本文（Markdown）と /resources のリンク先が同じ関数を使うことで、
// 「一覧のアンカーが記事の見出しと食い違う」状態を作れないようにする。
// 見出し文言を変えたらアンカーも変わる（＝リンクが切れる）ので、
// scripts/adsense-audit.test.mjs の broken anchor 検査で落とす。
//
// 日本語をそのまま id に残す。href 側で encodeURIComponent するため、
// ブラウザはフラグメントをデコードして id と照合できる。

export function headingId(text: string): string {
  return text
    // Markdown の装飾・リンクを落として、読者に見える文字だけにする
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .trim()
    // 空白は連結。属性値・URL で扱いにくい記号は落とす
    .replace(/\s+/g, '-')
    .replace(/["'<>#%{}|\\^~[\]]/g, '');
}

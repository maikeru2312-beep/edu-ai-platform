import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📚</span>
              <span className="font-bold text-white text-lg">教育DXナビ</span>
            </div>
            <p className="text-sm leading-relaxed">
              特別支援教育・ICT活用・AI校務改善に関する情報を収集・整理し、
              教育現場のDXを支援する個人運営の情報メディアです。
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">コンテンツ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/articles" className="hover:text-white transition-colors">
                  記事一覧
                </Link>
              </li>
              <li>
                <Link href="/db" className="hover:text-white transition-colors">
                  教育情報DB
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">サイト情報</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  このサイトについて
                </Link>
              </li>
              <li>
                <Link href="/operator" className="hover:text-white transition-colors">
                  運営者情報
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">
                  免責事項
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              © {year} 教育DXナビ — 個人運営の教育情報サイト。勤務先・自治体・学校を代表するものではありません。
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

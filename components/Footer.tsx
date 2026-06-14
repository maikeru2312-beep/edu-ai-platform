import Link from 'next/link';

export default function Footer() {
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
            <h3 className="text-white font-semibold mb-3 text-sm">カテゴリ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categories/tokubetsu-shien" className="hover:text-white transition-colors">
                  特別支援教育
                </Link>
              </li>
              <li>
                <Link href="/categories/ict" className="hover:text-white transition-colors">
                  ICT活用
                </Link>
              </li>
              <li>
                <Link href="/categories/ai-koomu" className="hover:text-white transition-colors">
                  AI校務改善
                </Link>
              </li>
              <li>
                <Link href="/categories/joseikin" className="hover:text-white transition-colors">
                  助成金・補助金
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              © 2025 教育DXナビ.
              掲載情報の正確性には万全を期していますが、利用の際は必ず一次情報をご確認ください。
            </p>
            <div className="flex items-center gap-4 whitespace-nowrap">
              <Link href="/privacy" className="hover:text-white transition-colors">
                プライバシーポリシー
              </Link>
              <Link href="/disclaimer" className="hover:text-white transition-colors">
                免責事項
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

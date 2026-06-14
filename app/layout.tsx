import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: '教育DXナビ | 特別支援教育・ICT・AI校務改善の情報メディア',
    template: '%s | 教育DXナビ',
  },
  description:
    '特別支援教育、ICT活用、AI校務改善、教材・助成金・研修情報を分かりやすく届ける教育情報メディア。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

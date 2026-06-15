import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://edu-ai-platform-delta.vercel.app';
const SITE_NAME = '教育DXナビ';
const SITE_DESCRIPTION =
  '教員向けに、ICT活用・校務効率化・生成AI活用・特別支援教育の実践知をわかりやすく整理するサイト。';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | 教員向けICT活用・校務効率化・生成AI活用情報`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: SITE_NAME,
    title: `${SITE_NAME} | 教員向けICT活用・校務効率化・生成AI活用情報`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | 教員向けICT活用・校務効率化・生成AI活用情報`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'yaStdF17kEUufx3_NTiTUuTYpRB1wilz2R8Vxssyf-I',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

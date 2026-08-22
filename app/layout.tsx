import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { getSiteUrl } from '@/lib/site';

const SITE_URL = getSiteUrl();
const SITE_NAME = '教育DXナビ';
const SITE_TAGLINE = '特別支援教育と学校実務の判断ガイド';
const SITE_DESCRIPTION =
  '特別支援教育を中心とした学校実務で、ICT・生成AI・支援・記録をどう判断し実行するかを、'
  + '公的資料と実務上の確認手順から整理する教員向けサイト。計画・記録・面談・支援ツール選定・'
  + '校務での生成AI利用について、確認手順と判断の様式を掲載しています。';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: '教育DXナビ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/opengraph-image`],
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

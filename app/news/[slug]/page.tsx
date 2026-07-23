import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'ページが見つかりません',
};

export default function NewsDetailPage() {
  notFound();
}

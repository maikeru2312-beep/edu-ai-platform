'use client';

import Image from 'next/image';

type Props = {
  variant?: 'compact' | 'full';
};

const AVATAR_PATH = '/images/chifuyu/chifuyu-avatar.png';
const X_URL = process.env.NEXT_PUBLIC_X_PROFILE_URL ?? '';

export default function ChifuyuProfileCard({ variant = 'full' }: Props) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-blue-200 shrink-0 flex items-center justify-center">
          <Image
            src={AVATAR_PATH}
            alt="教育DXナビの案内役、千冬先生のイラスト"
            width={48}
            height={48}
            className="object-cover w-full h-full"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">千冬先生＠教育DX</p>
          <p className="text-xs text-gray-500 leading-tight">教育DXナビの案内役</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-blue-200 shrink-0 flex items-center justify-center">
          <Image
            src={AVATAR_PATH}
            alt="教育DXナビの案内役、千冬先生のイラスト"
            width={64}
            height={64}
            className="object-cover w-full h-full"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-lg leading-tight">千冬先生＠教育DX</p>
          <p className="text-sm text-blue-600 font-medium mt-0.5">教育DXナビの案内役</p>
          <p className="text-sm text-gray-700 mt-3 leading-relaxed">
            ICT活用・生成AI・校務改善・特別支援教育について、学校現場で安全に使うための視点をやさしく整理します。
          </p>
          {X_URL && (
            <a
              href={X_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X（旧Twitter）で見る
            </a>
          )}
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-400 leading-relaxed border-t border-blue-100 pt-3">
        ※ 千冬先生は、教育DXナビの編集キャラクターです。実在の学校・自治体・教員個人を代表するものではありません。
      </p>
    </div>
  );
}

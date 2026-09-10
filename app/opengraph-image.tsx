import { ImageResponse } from 'next/og';
import { getSiteUrl } from '@/lib/site';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = '教育DXナビ | 特別支援教育と学校実務の判断ガイド';

// サイトの自己定義（app/layout.tsx の SITE_TAGLINE / SITE_DESCRIPTION、About の「扱うテーマ」）と
// 同じ言葉で描く。旧来の「教員向け ICT・AI・特別支援の実践知」や、実際には使っていないドメイン表記は置かない。
const TOPICS = ['特別支援教育の学校実務', 'ICT・支援技術の判断', '生成AIと校務'];

export default function Image() {
  const host = new URL(getSiteUrl()).host;
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1a2744',
          padding: '60px 80px',
          position: 'relative',
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1200px', height: '8px', backgroundColor: '#3b82f6', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '1200px', height: '8px', backgroundColor: '#3b82f6', display: 'flex' }} />
        <div style={{ position: 'absolute', top: '60px', left: '76px', width: '4px', height: '510px', backgroundColor: '#3b82f6', display: 'flex' }} />

        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '28px', marginTop: '96px' }}>
          <div style={{ fontSize: '84px', fontWeight: 700, color: '#ffffff', letterSpacing: '4px', display: 'flex' }}>
            教育DXナビ
          </div>
          <div style={{ fontSize: '34px', color: '#93c5fd', letterSpacing: '3px', marginTop: '18px', display: 'flex' }}>
            特別支援教育と学校実務の判断ガイド
          </div>

          <div style={{ width: '792px', height: '2px', backgroundColor: '#3b82f6', opacity: 0.5, marginTop: '34px', display: 'flex' }} />

          <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginTop: '28px' }}>
            {TOPICS.map((topic) => (
              <div
                key={topic}
                style={{
                  display: 'flex',
                  padding: '10px 26px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(59,130,246,0.25)',
                  border: '1px solid #3b82f6',
                }}
              >
                <span style={{ fontSize: '20px', fontWeight: 600, color: '#93c5fd' }}>{topic}</span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '22px', color: '#cbd5e1', letterSpacing: '1px', marginTop: '40px', display: 'flex' }}>
            公的資料と確認手順をつなぎ、判断・計画・記録・見直しに使える形に整理します
          </div>

          <div style={{ fontSize: '18px', color: '#64748b', letterSpacing: '1px', marginTop: '20px', display: 'flex' }}>
            {host}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

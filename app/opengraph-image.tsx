import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = '教育DXナビ';

export default function Image() {
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
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1200px',
            height: '8px',
            backgroundColor: '#3b82f6',
            display: 'flex',
          }}
        />
        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '1200px',
            height: '8px',
            backgroundColor: '#3b82f6',
            display: 'flex',
          }}
        />
        {/* Left accent bar */}
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '76px',
            width: '4px',
            height: '510px',
            backgroundColor: '#3b82f6',
            display: 'flex',
          }}
        />

        {/* Main content area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '28px',
            marginTop: '120px',
          }}
        >
          {/* Title */}
          <div
            style={{
              fontSize: '78px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '2px',
              display: 'flex',
            }}
          >
            EduDX NAVI
          </div>
          {/* Japanese subtitle */}
          <div
            style={{
              fontSize: '32px',
              color: '#93c5fd',
              letterSpacing: '6px',
              marginTop: '10px',
              display: 'flex',
            }}
          >
            教育DXナビ
          </div>

          {/* Divider */}
          <div
            style={{
              width: '792px',
              height: '2px',
              backgroundColor: '#3b82f6',
              opacity: 0.5,
              marginTop: '30px',
              display: 'flex',
            }}
          />

          {/* Tags row */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '20px',
              marginTop: '25px',
            }}
          >
            <div
              style={{
                display: 'flex',
                padding: '10px 30px',
                borderRadius: '6px',
                backgroundColor: 'rgba(59,130,246,0.25)',
                border: '1px solid #3b82f6',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 600, color: '#93c5fd' }}>
                ICT活用
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                padding: '10px 30px',
                borderRadius: '6px',
                backgroundColor: 'rgba(59,130,246,0.25)',
                border: '1px solid #3b82f6',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 600, color: '#93c5fd' }}>
                AI校務改善
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                padding: '10px 30px',
                borderRadius: '6px',
                backgroundColor: 'rgba(59,130,246,0.25)',
                border: '1px solid #3b82f6',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 600, color: '#93c5fd' }}>
                特別支援教育
              </span>
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '22px',
              color: '#cbd5e1',
              letterSpacing: '1px',
              marginTop: '40px',
              display: 'flex',
            }}
          >
            教員向け ICT・AI・特別支援の実践知
          </div>

          {/* URL */}
          <div
            style={{
              fontSize: '18px',
              color: '#64748b',
              letterSpacing: '1px',
              marginTop: '20px',
              display: 'flex',
            }}
          >
            edu-dx-navi.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

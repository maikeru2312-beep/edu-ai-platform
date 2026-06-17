export const runtime = 'edge';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#1a2744"/>
  <rect x="0" y="0" width="1200" height="8" fill="#3b82f6"/>
  <rect x="0" y="622" width="1200" height="8" fill="#3b82f6"/>
  <rect x="80" y="60" width="4" height="510" fill="#3b82f6"/>
  <circle cx="1050" cy="315" r="200" fill="#3b82f6" fill-opacity="0.08"/>
  <circle cx="1050" cy="315" r="140" fill="#3b82f6" fill-opacity="0.06"/>
  <text x="108" y="290" font-family="Arial, Helvetica, sans-serif" font-size="78" font-weight="700" fill="#ffffff" letter-spacing="2">EduDX NAVI</text>
  <text x="112" y="350" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="400" fill="#93c5fd" letter-spacing="6">&#x6559;&#x80B2;DX&#x30CA;&#x30D3;</text>
  <line x1="108" y1="380" x2="900" y2="380" stroke="#3b82f6" stroke-width="1.5" opacity="0.5"/>
  <rect x="108" y="405" width="220" height="48" rx="6" fill="#3b82f6" fill-opacity="0.25" stroke="#3b82f6" stroke-width="1"/>
  <text x="218" y="435" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="600" fill="#93c5fd" text-anchor="middle">ICT in Education</text>
  <rect x="348" y="405" width="240" height="48" rx="6" fill="#3b82f6" fill-opacity="0.25" stroke="#3b82f6" stroke-width="1"/>
  <text x="468" y="435" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="600" fill="#93c5fd" text-anchor="middle">AI School Support</text>
  <rect x="608" y="405" width="280" height="48" rx="6" fill="#3b82f6" fill-opacity="0.25" stroke="#3b82f6" stroke-width="1"/>
  <text x="748" y="435" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="600" fill="#93c5fd" text-anchor="middle">Special Ed. Support</text>
  <text x="108" y="520" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#cbd5e1" letter-spacing="1">For Teachers - Practical knowledge for Digital Transformation</text>
  <text x="108" y="568" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#64748b" letter-spacing="1">edu-dx-navi.com</text>
</svg>`,
    {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
      },
    },
  );
}

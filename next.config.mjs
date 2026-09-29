/** @type {import('next').NextConfig} */
const specialOrigin = 'https://special-support-navi.vercel.app';
const b1Slugs = [
  'special-needs-behavior-record-guide',
  'special-needs-ict-support-tools-checklist',
  'special-needs-visual-schedule-support',
];

const nextConfig = {
  async redirects() {
    return [
      ...b1Slugs.map((slug) => ({
        source: `/articles/${slug}`,
        destination: `${specialOrigin}/articles/${slug}`,
        permanent: true,
      })),
      // Existing merged aliases must also reach the final owner in one hop.
      ...['ict-teaching-tools-selection-guide', 'tokubetsu-shien-ict'].map((slug) => ({
        source: `/articles/${slug}`,
        destination: `${specialOrigin}/articles/special-needs-ict-support-tools-checklist`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;

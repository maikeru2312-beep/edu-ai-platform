import { NextRequest, NextResponse } from 'next/server';

// 統合した旧 slug から、読者の意図に最も近い canonical 記事への 301。
// 1 slug につき 1 つの着地先だけを持ち、着地先は別の redirect 元であってはならない（1 ホップ）。
export const ARTICLE_MERGE_REDIRECTS: Record<string, string> = {
  // 第3〜5回審査で統合したもの
  'chatgpt-teacher-beginner-guide': 'ai-koomu-kaizen-nyumon',
  'giga-school-device-troubleshooting': 'giga-device-lesson-use-guide',
  'kyoiku-dx-kiso': 'giga-device-lesson-use-guide',
  'microsoft-copilot-teacher-guide': 'education-ai-service-checklist-before-use',
  'tablet-ict-jugyo-giga': 'giga-device-lesson-use-guide',
  // 第6回審査で統合したもの（校務での生成AI判断は判断ガイドへ集約）
  'generative-ai-guideline-v2-school-reading': 'ai-koomu-kaizen-nyumon',
  'school-generative-ai-privacy-security': 'ai-koomu-kaizen-nyumon',
  'ai-lesson-preparation-prompt': 'ai-koomu-kaizen-nyumon',
  // 第6回審査で統合したもの（支援ツールの選定は特別支援の選定ガイドへ集約）
  'ict-teaching-tools-selection-guide': 'special-needs-ict-support-tools-checklist',
  'tokubetsu-shien-ict': 'special-needs-ict-support-tools-checklist',
  // information-morals-education-themes は意味的に正しい統合先が無いため 301 を張らない（404）。
};

export function middleware(request: NextRequest) {
  const slug = request.nextUrl.pathname.replace(/^\/articles\//, '');
  const target = ARTICLE_MERGE_REDIRECTS[slug];
  if (!target) return NextResponse.next();

  return NextResponse.redirect(new URL(`/articles/${target}`, request.url), 301);
}

export const config = {
  matcher: '/articles/:slug',
};

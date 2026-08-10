import { NextRequest, NextResponse } from 'next/server';

export const ARTICLE_MERGE_REDIRECTS: Record<string, string> = {
  'chatgpt-teacher-beginner-guide': 'ai-koomu-kaizen-nyumon',
  'giga-school-device-troubleshooting': 'giga-device-lesson-use-guide',
  'kyoiku-dx-kiso': 'giga-device-lesson-use-guide',
  'microsoft-copilot-teacher-guide': 'education-ai-service-checklist-before-use',
  'tablet-ict-jugyo-giga': 'giga-device-lesson-use-guide',
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

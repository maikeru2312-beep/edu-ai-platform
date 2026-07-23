import { NextRequest, NextResponse } from 'next/server';

export const ARTICLE_MERGE_REDIRECTS: Record<string, string> = {
  'ai-class-newsletter-prompt': 'ai-lesson-preparation-prompt',
  'ai-koomu-kaizen-nyumon': 'ai-lesson-preparation-prompt',
  'chatgpt-teacher-beginner-guide': 'school-generative-ai-privacy-security',
  'free-ict-tools-safety-checklist': 'ict-teaching-tools-selection-guide',
  'giga-school-device-troubleshooting': 'giga-device-lesson-use-guide',
  'google-forms-school-use-guide': 'giga-device-lesson-use-guide',
  'information-morals-education-themes': 'school-generative-ai-privacy-security',
  'kyoiku-dx-kiso': 'giga-device-lesson-use-guide',
  'microsoft-copilot-teacher-guide': 'education-ai-service-checklist-before-use',
  'special-needs-parent-collaboration': 'reasonable-accommodation-school-record',
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

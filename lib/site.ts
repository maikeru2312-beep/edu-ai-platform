const FALLBACK_URL = 'https://edu-ai-platform-delta.vercel.app';

/**
 * Returns a validated, trailing-slash-free site URL.
 * Falls back to FALLBACK_URL if the env var is absent, empty, or not a valid URL.
 */
export function getSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? '').trim();
  if (!raw) return FALLBACK_URL;
  try {
    const url = new URL(raw);
    return url.origin; // scheme + host, no trailing slash
  } catch {
    return FALLBACK_URL;
  }
}

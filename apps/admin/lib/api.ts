/**
 * Admin app API client helpers.
 *
 * Why this file exists:
 * - apps/admin/next.config.js already declares `/api/:path*` and `/uploads/:path*`
 *   rewrites that proxy to the backend at http://localhost:8000.
 * - Using relative URLs (no host) lets the browser send requests to the same
 *   origin (localhost:3001), so they hit those rewrites and avoid CORS preflights.
 * - If `NEXT_PUBLIC_API_URL` is set, requests go directly to that host (useful
 *   for SSR/production where the rewrite proxy is not desirable).
 *
 * The previous version of this file used `process.env.NEXT_PUBLIC_API_URL ||
 * 'http://localhost:8000'`, which broke locally when the env var was unset:
 * the browser hit the API on a different origin and got blocked by CORS,
 * surfacing as the cryptic "failed to fetch" error.
 */

export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  // Prefer relative URLs so requests stay same-origin and benefit from
  // the Next.js rewrites in next.config.js (CORS-safe).
  return fromEnv && fromEnv.length > 0 ? fromEnv : '';
}

/**
 * Build a fully-qualified API URL.
 *
 * @example
 *   getApiUrl('/api/inquiries?page=1')        // '/api/inquiries?page=1'
 *   getApiUrl('api/inquiries')                 // '/api/inquiries'
 *   getApiUrl('https://api.foo.com/inquiries')// 'https://api.foo.com/inquiries'
 */
export function getApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = getApiBaseUrl();
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}
/**
 * API Configuration
 * Centralized API URL configuration for the frontend.
 *
 * Resolution order:
 *  1. If NEXT_PUBLIC_API_URL is set (production), use it as the base so the
 *     browser hits the backend directly at its public origin. This works
 *     because production CORS allows the web origin.
 *  2. Otherwise (development) return a relative path so requests go through
 *     the Next.js dev rewrite to http://localhost:8000.
 *
 * Why the two-mode split:
 *  - In dev, the Next.js dev server runs the rewrites from next.config.js
 *    so we never need CORS preflights.
 *  - In prod we cannot rely on rewrites (they would require a Node server
 *    rather than the standalone output), so we send the request to the
 *    dedicated API host.
 */
export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.replace(/^\//, '');
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv && fromEnv.length > 0) {
    const base = fromEnv.replace(/\/+$/, '');
    return `${base}/api/${cleanEndpoint}`;
  }
  return `/api/${cleanEndpoint}`;
}

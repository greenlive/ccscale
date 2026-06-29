import { NextRequest, NextResponse } from 'next/server';

/**
 * Admin route protection.
 *
 * Guard against unauthenticated visitors reaching protected pages.
 * The presence of the `cc_access` cookie set by the backend on login is
 * treated as "user has a session"; full JWT verification happens
 * server-side in JwtAuthGuard on every API call. If the access token is
 * missing or expired, the next API call returns 401 and the client
 * redirects to /login.
 *
 * Public paths (no cookie required):
 *   - /login
 *   - /api/*           (rewritten to backend; the backend enforces auth itself)
 *   - /_next/*         (Next.js internal assets)
 *   - /favicon.ico, static files
 */
const PUBLIC_PATHS = new Set<string>(['/login']);

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith('/api/')) return true;
  if (pathname.startsWith('/_next/')) return true;
  if (pathname === '/favicon.ico') return true;
  return false;
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const access = request.cookies.get('cc_access')?.value;
  if (access && access.length > 0) {
    return NextResponse.next();
  }

  // Preserve where the user was trying to go so we can bounce them back
  // after a successful login.
  const loginUrl = new URL('/login', request.url);
  if (pathname !== '/') {
    loginUrl.searchParams.set('redirect', pathname + search);
  }
  return NextResponse.redirect(loginUrl);
}

// Run on all routes except Next.js internals and static files (those
// exclusions are handled by the matcher below).
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)'],
};

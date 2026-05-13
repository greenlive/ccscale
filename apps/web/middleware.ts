import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    '/',
    '/(zh|en)/:path*',
    // Exclude API and static routes from locale middleware to avoid
    // rewriting /api/* paths (Next.js rewrites proxy these to the backend)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};

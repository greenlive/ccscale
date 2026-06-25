import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing, type Locale } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Type-safe guard against the readonly `locales` tuple.
function isLocale(value: string | undefined): value is Locale {
  return !!value && (routing.locales as readonly string[]).includes(value);
}

function detectLocaleFromHeader(req: NextRequest): Locale | null {
  const accept = req.headers.get("accept-language");
  if (!accept) return null;
  const langs = accept
    .split(",")
    .map((part) => {
      const [tag, ...rest] = part.trim().split(";");
      const qMatch = rest.find((r) => r.startsWith("q="));
      const q = qMatch ? parseFloat(qMatch.split("=")[1]) : 1;
      return { tag: tag.toLowerCase(), q };
    })
    .sort((a, b) => b.q - a.q);
  for (const { tag } of langs) {
    if (isLocale(tag)) return tag;
    const family = tag.split("-")[0];
    if (isLocale(family)) return family;
  }
  return null;
}

// Generate a 16-byte base64 nonce. Used to allow only THIS request's
// inline scripts (Next.js bootstrap, hydration, etc.) without
// enabling global 'unsafe-inline'.
function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // base64 without padding (URL-safe)
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

const CSP_HEADER = (
  nonce: string,
  isDev: boolean,
) => {
  // When nonce is enabled, we still need 'unsafe-inline' as a fallback for
  // third-party scripts (Turnstile, GA4) and CSS that some browsers apply
  // before nonce is set. We aim to remove 'unsafe-inline' for production
  // scripts by next iteration; styles stay 'unsafe-inline' because Next.js
  // emits critical CSS via <style> tags.
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'unsafe-inline'", // fallback: Next.js inline <script> and third-party
    "https://challenges.cloudflare.com",
    "https://*.googletagmanager.com",
    "https://*.google-analytics.com",
    "https://*.cloudflareinsights.com",
  ];
  if (isDev) {
    // webpack HMR uses eval in dev
    scriptSrc.push("'unsafe-eval'");
  }
  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://media.ccscale.com https://*.ccscale.com https://*.google-analytics.com https://*.googletagmanager.com",
    "media-src 'self' https://media.ccscale.com blob:",
    "connect-src 'self' https://api.ccscale.com https://*.ccscale.com https://challenges.cloudflare.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.sentry.io wss:",
    "frame-src 'self' https://challenges.cloudflare.com https://www.google.com https://www.youtube.com",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self' https://api.ccscale.com",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
};

export default function middleware(req: NextRequest) {
  const isDev = process.env.NODE_ENV !== "production";
  const nonce = generateNonce();

  // Smart redirect on root path
  const { pathname } = req.nextUrl;
  if (pathname === "/") {
    const detected = detectLocaleFromHeader(req);
    const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
    const preferred: Locale | null = isLocale(cookieLocale) ? cookieLocale : detected;

    if (preferred && preferred !== routing.defaultLocale) {
      const url = req.nextUrl.clone();
      url.pathname = `/${preferred}`;
      const res = NextResponse.redirect(url);
      res.cookies.set("NEXT_LOCALE", preferred, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        sameSite: "lax",
      });
      return res;
    }
  }

  // Run next-intl middleware (handles locale rewriting).
  const response = intlMiddleware(req as unknown as Parameters<typeof intlMiddleware>[0]);

  // Inject CSP header. The nonce allows per-request inline scripts; the
  // 'unsafe-inline' fallback remains for Next.js bootstrap and third-party
  // scripts (Turnstile, GA4) that do not receive the nonce. This is the
  // "nonce + unsafe-inline" hybrid recommended for Next.js apps; see
  // https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
  response.headers.set("Content-Security-Policy", CSP_HEADER(nonce, isDev));
  response.headers.set("x-nonce", nonce);

  return response;
}

// For downstream server components to read the nonce:
// The `x-nonce` request header is set on the REWRITTEN request so that
// headers() in server components returns it.
export const config = {
  matcher: [
    "/",
    "/(zh|en)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
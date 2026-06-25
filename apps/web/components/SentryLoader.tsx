'use client';

import Script from 'next/script';
import { useEffect } from 'react';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const SENTRY_ENV = process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.NODE_ENV;

declare global {
  interface Window {
    Sentry?: any;
  }
}

/**
 * SentryErrorMonitor
 *
 * Loads Sentry Browser SDK from CDN (no npm dependency) with:
 *  - Auto error capture
 *  - Performance tracing (10% sample in prod, 100% in dev)
 *  - Session replay (10% in prod, 100% on errors)
 *  - Custom tags (locale, theme, etc.)
 *
 * Requires:
 *   NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
 *   NEXT_PUBLIC_SENTRY_ENV=production
 *
 * Optional:
 *   NEXT_PUBLIC_SENTRY_RELEASE=cc-scale-web@1.0.0  (for source map lookup)
 *   NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1
 */
export function SentryErrorMonitor() {
  useEffect(() => {
    if (!SENTRY_DSN || !window.Sentry) return;
    const Sentry = window.Sentry;

    // Set user context once theme/locale are known
    try {
      const locale = document.documentElement.lang || 'en';
      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      Sentry.setTag('locale', locale);
      Sentry.setTag('theme', theme);
    } catch {}

    // Tag session as production for filtering in Sentry dashboard
    Sentry.setTag('app', 'cc-scale-web');
  }, []);

  if (!SENTRY_DSN) return null;

  const tracesSampleRate = Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.1);
  const replaysSessionSampleRate = Number(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? 0.1);
  const replaysOnErrorSampleRate = Number(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE ?? 1.0);
  const release = process.env.NEXT_PUBLIC_SENTRY_RELEASE;

  return (
    <>
      <Script
        src="https://browser.sentry-cdn.com/8.40.0/bundle.tracing.replay.min.js"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        onLoad={() => {
          if (!window.Sentry) return;
          window.Sentry.init({
            dsn: SENTRY_DSN,
            environment: SENTRY_ENV,
            release,
            // Performance Monitoring
            tracesSampleRate,
            // Session Replay
            replaysSessionSampleRate,
            replaysOnErrorSampleRate,
            integrations: [
              window.Sentry.replayIntegration({
                maskAllText: true,
                blockAllMedia: true,
              }),
            ],
            // Don't send PII; we already strip landing page
            beforeSend(event: any) {
              // Filter out known noisy errors
              if (event.exception?.values?.[0]?.type === 'AbortError') return null;
              if (event.message?.includes('Failed to fetch') && event.message?.includes('rsc')) return null;
              return event;
            },
          });
        }}
      />
    </>
  );
}

/**
 * Helper to manually capture an exception (for non-thrown errors).
 * Always safe to call — returns silently if Sentry not loaded.
 */
export function captureException(error: unknown, context?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.Sentry?.captureException) {
    if (context) window.Sentry.setContext('extra', context);
    window.Sentry.captureException(error);
  } else {
    console.error('[Sentry fallback]', error, context);
  }
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (typeof window !== 'undefined' && window.Sentry?.captureMessage) {
    window.Sentry.captureMessage(message, level);
  }
}
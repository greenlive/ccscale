'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Google Analytics 4 — page-view tracker.
 * Uses next/script with afterInteractive so it never blocks LCP.
 */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    window.gtag?.('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [pathname, searchParams]);

  return null;
}

/**
 * GoogleAnalytics
 * - Loads GA4 via <Script strategy="afterInteractive">
 * - Loads GTM container if configured (preferred for production)
 * - Auto-tracks page views on route change
 *
 * Required env:
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 *   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX (optional, recommended)
 */
export function GoogleAnalytics() {
  // No IDs configured — render nothing (avoids 404 in console)
  if (!GA_MEASUREMENT_ID && !GTM_ID) return null;

  return (
    <>
      {GTM_ID && (
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}

      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              send_page_view: false, // we send manually via PageViewTracker
              cookie_flags: 'SameSite=None;Secure',
            });`}
          </Script>
        </>
      )}

      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}

/**
 * Event tracking helpers — call from any client component
 */
export const trackEvent = {
  inquirySubmitted: (params: { hasItems: boolean; country?: string }) => {
    window.gtag?.('event', 'inquiry_submitted', {
      has_items: params.hasItems,
      country: params.country,
    });
  },
  inquiryFailed: (reason: string) => {
    window.gtag?.('event', 'inquiry_failed', { reason });
  },
  productView: (slug: string, name: string) => {
    window.gtag?.('event', 'view_item', {
      items: [{ item_id: slug, item_name: name }],
    });
  },
  addToCart: (slug: string, name: string, price: number) => {
    window.gtag?.('event', 'add_to_cart', {
      items: [{ item_id: slug, item_name: name, price }],
    });
  },
  search: (query: string, resultCount: number) => {
    window.gtag?.('event', 'search', {
      search_term: query,
      result_count: resultCount,
    });
  },
  languageSwitch: (from: string, to: string) => {
    window.gtag?.('event', 'language_switch', { from, to });
  },
  themeToggle: (mode: string) => {
    window.gtag?.('event', 'theme_toggle', { mode });
  },
  outboundLink: (url: string) => {
    window.gtag?.('event', 'click', {
      event_category: 'outbound',
      event_label: url,
      transport_type: 'beacon',
    });
  },
};
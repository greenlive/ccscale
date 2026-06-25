'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { inject } from '@vercel/analytics';
import { getSessionId, getStoredTrackingData, saveTrackingData } from '@/lib/utils/tracking';

/**
 * Analytics tracker with Vercel Analytics integration
 * - Uses @vercel/analytics for core web vitals and page views
 * - Custom tracking for UTM and session data
 * - Lazy-loaded to avoid blocking critical path
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionCreated = useRef(false);
  const sessionId = useRef<string>('');
  const pendingFlush = useRef<NodeJS.Timeout | null>(null);

  // Initialize Vercel Analytics
  useEffect(() => {
    // Inject Vercel Analytics script
    const injectAnalytics = async () => {
      try {
        inject();
      } catch (error) {
        console.warn('Vercel Analytics injection failed:', error);
      }
    };
    injectAnalytics();
  }, []);

  // Persist UTM data and create session
  useEffect(() => {
    // Persist UTM data on first paint
    saveTrackingData();

    // Defer analytics session creation to idle time
    const runWhenIdle = (cb: () => void) => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(cb, { timeout: 4000 });
      } else {
        setTimeout(cb, 1500);
      }
    };

    runWhenIdle(() => {
      if (sessionCreated.current) return;
      const sid = getSessionId();
      sessionId.current = sid;
      sessionCreated.current = true;

      const trackingData = getStoredTrackingData();
      // Use sendBeacon if available
      const payload = JSON.stringify({
        sessionId: sid,
        userAgent: navigator.userAgent,
        landingPage: window.location.href,
        utmSource: trackingData.utmSource,
        utmMedium: trackingData.utmMedium,
        utmCampaign: trackingData.utmCampaign,
        utmContent: trackingData.utmContent,
        utmTerm: trackingData.utmTerm,
        trafficSource: trackingData.trafficSource,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/session', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('/api/analytics/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    });
  }, []);

  // Track page views for custom analytics
  useEffect(() => {
    if (!sessionId.current) return;
    
    // Debounce page view events
    if (pendingFlush.current) clearTimeout(pendingFlush.current);
    pendingFlush.current = setTimeout(() => {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      const payload = JSON.stringify({
        sessionId: sessionId.current,
        eventType: 'PAGE_VIEW',
        pageUrl: url,
      });
      
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/event', new Blob([payload], { type: 'application/json' }));
      } else {
        fetch('/api/analytics/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    }, 300);

    return () => {
      if (pendingFlush.current) clearTimeout(pendingFlush.current);
    };
  }, [pathname, searchParams]);

  return null;
}  
export default AnalyticsTracker; 

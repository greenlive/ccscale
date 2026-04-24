'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getSessionId, getStoredTrackingData, saveTrackingData } from '@/lib/utils/tracking';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionCreated = useRef(false);
  const sessionId = useRef<string>('');

  useEffect(() => {
    // Save UTM data from URL to localStorage when page loads
    saveTrackingData();

    // Create or get session ID
    const sid = getSessionId();
    sessionId.current = sid;

    if (!sessionCreated.current) {
      sessionCreated.current = true;

      // Get UTM tracking data
      const trackingData = getStoredTrackingData();

      // Report new session with UTM data
      fetch(`${API_URL}/api/analytics/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(document.referrer ? { 'Referer': document.referrer } : {}),
        },
        body: JSON.stringify({
          sessionId: sid,
          userAgent: navigator.userAgent,
          landingPage: window.location.href,
          // UTM tracking data
          utmSource: trackingData.utmSource,
          utmMedium: trackingData.utmMedium,
          utmCampaign: trackingData.utmCampaign,
          utmContent: trackingData.utmContent,
          utmTerm: trackingData.utmTerm,
          trafficSource: trackingData.trafficSource,
        }),
      }).catch(() => {
        // silently ignore analytics errors
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sessionId.current) return;

    // Report page view event on each route change
    fetch(`${API_URL}/api/analytics/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionId.current,
        eventType: 'PAGE_VIEW',
        pageUrl: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
      }),
    }).catch(() => {
      // silently ignore analytics errors
    });
  }, [pathname, searchParams]);

  return null;
}

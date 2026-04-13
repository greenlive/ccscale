'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getSessionId } from '@/lib/utils/tracking';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const sessionCreated = useRef(false);
  const sessionId = useRef<string>('');

  useEffect(() => {
    // Create or get session ID
    const sid = getSessionId();
    sessionId.current = sid;

    if (!sessionCreated.current) {
      sessionCreated.current = true;

      // Report new session
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
        }),
      }).catch(() => {
        // silently ignore analytics errors
      });
    }
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
        pageUrl: pathname,
      }),
    }).catch(() => {
      // silently ignore analytics errors
    });
  }, [pathname]);

  return null;
}

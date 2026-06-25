'use client';

import { useReportWebVitals } from 'next/web-vitals'

/**
 * Web Vitals enhanced reporter with detailed analytics
 * Features:
 * - Reports Core Web Vitals metrics (LCP, FID, INP, CLS, TTFB, FCP)
 * - Sends to /api/analytics/vitals using sendBeacon for reliability
 * - Includes user session context (device type, viewport, connection)
 * - Logs to console in development mode
 * - Supports debugging via URL param ?webvitals=debug
 */
export function WebVitals() {
  useReportWebVitals((metric: { id: string; name: string; value: number; rating?: string; delta: number; navigationType?: string; entries: PerformanceEntry[]; }) => {
    // Skip metrics with no value
    if (!metric.value || metric.value === 0) return;

    const isDebugMode = typeof window !== 'undefined' && 
      new URLSearchParams(window.location.search).has('webvitals');

    const payload = {
      // Core metric data
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: metric.navigationType,
      
      // Page context
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      
      // User agent context
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      deviceType: getDeviceType(),
      connectionType: getConnectionType(),
      
      // Viewport context
      viewport: {
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
      },
      
      // Timing context
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
    };

    // Log in debug mode
    if (isDebugMode) {
      console.group('[WebVitals]');
      console.log('Value:', metric.value);
      console.log('Rating:', metric.rating);
      console.log('Delta:', metric.delta);
      console.log('Payload:', payload);
      console.groupEnd();
    }

    // Send to analytics endpoint using sendBeacon for reliability
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/vitals', blob);
    }

    // Also try fetch as fallback for larger payloads
    if (typeof fetch !== 'undefined') {
      fetch('/api/analytics/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Silently fail - we don't want to affect user experience
      });
    }
  });

  return null;
}

// Helper: Detect device type from user agent
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  if (typeof window === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|android|windows phone/i.test(ua)) return 'mobile';
  return 'desktop';
}

// Helper: Get network connection type
function getConnectionType(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
  
  if (!connection) return 'unknown';
  return connection.effectiveType || connection.type || 'unknown';
}

// Helper: Get or create session ID
function getSessionId(): string {
  if (typeof sessionStorage === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('wv_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-`;
    sessionStorage.setItem('wv_session_id', sessionId);
  }
  return sessionId;
}

export default WebVitals;

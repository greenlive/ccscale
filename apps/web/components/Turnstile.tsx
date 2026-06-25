'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
        },
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

interface TurnstileProps {
  siteKey: string | undefined;
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

/**
 * Cloudflare Turnstile widget. The script is loaded on demand to keep
 * the main bundle small. If `siteKey` is missing (development), we fall
 * back to a no-op so the form remains usable.
 */
export function Turnstile({ siteKey, onVerify, onExpire }: TurnstileProps) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!siteKey) return;
    if (typeof window === 'undefined') return;
    if (window.turnstile) {
      setScriptReady(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile]');
    if (existing) {
      existing.addEventListener('load', () => setScriptReady(true), { once: true });
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
    s.async = true;
    s.defer = true;
    s.dataset.turnstile = 'true';
    (window as any).onTurnstileLoad = () => setScriptReady(true);
    document.head.appendChild(s);
  }, [siteKey]);

  useEffect(() => {
    if (!siteKey || !scriptReady || !ref.current || !window.turnstile) return;
    if (widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(ref.current, {
      sitekey: siteKey,
      callback: onVerify,
      'expired-callback': () => {
        onExpire?.();
      },
      theme: 'auto',
    });
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.reset(widgetIdRef.current); } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, scriptReady, onVerify, onExpire]);

  if (!siteKey) return null;
  return <div ref={ref} className="cf-turnstile" data-testid="cf-turnstile" />;
}

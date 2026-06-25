'use client';

import { useEffect } from 'react';

/**
 * Service Worker Registration
 * Registers /sw.js in production only. In dev, the SW would interfere with HMR.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        // Check for updates every page load
        registration.update().catch(() => {});

        // Listen for waiting worker → activate it without forcing reload
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available — could show a toast here
              console.info('[SW] New version available, will activate on next page load');
            }
          });
        });
      } catch (err) {
        console.warn('[SW] Registration failed:', err);
      }
    };

    // Register after page load so it doesn't block first paint
    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }
  }, []);

  return null;
}
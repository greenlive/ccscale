/**
 * CC Scale Service Worker
 *
 * Strategy:
 *  - Static assets (JS/CSS/IMG/fonts): StaleWhileRevalidate
 *  - API GET requests: NetworkFirst with 5s timeout, fall back to cache
 *  - API POST (inquiries): NetworkOnly — never cache writes
 *  - HTML pages: NetworkFirst with cache fallback (offline support)
 *
 * The workbox-free approach keeps the SW small and lets us fine-tune.
 */

const VERSION = 'cc-scale-v1.0.0';
const STATIC_CACHE = `${VERSION}-static`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const OFFLINE_URL = '/offline';

const PRECACHE_URLS = [
  '/',
  '/en',
  '/zh',
  '/offline',
  '/manifest.webmanifest',
  '/apple-touch-icon.svg',
  '/favicon.svg',
  '/logo.svg',
  '/og-image.svg',
  '/images/hero-bg.svg',
  '/images/placeholder.svg',
];

// ---------- Install: precache shell ----------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[SW] Some precache items failed (this is OK in dev):', err);
      })
    )
  );
  self.skipWaiting();
});

// ---------- Activate: cleanup old caches ----------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// ---------- Fetch: routing ----------
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-http(s) and POST/PUT/DELETE (only cache GET)
  if (!url.protocol.startsWith('http')) return;
  if (request.method !== 'GET') return;

  // API: NetworkFirst with timeout
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/uploads/')) {
    event.respondWith(networkFirst(request, 5000));
    return;
  }

  // Static assets by extension: StaleWhileRevalidate
  if (/\.(js|css|svg|png|jpg|jpeg|webp|avif|woff2?|ico)$/i.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // HTML pages: NetworkFirst with offline fallback
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstWithOffline(request));
    return;
  }

  // Default: try network, fall back to cache
  event.respondWith(networkFirst(request, 3000));
});

// ---------- Strategies ----------
async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.status === 200) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || networkPromise;
}

async function networkFirst(request, timeoutMs) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), timeoutMs)
      ),
    ]);
    if (response && response.status === 200) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error('Network failed and no cache available');
  }
}

async function networkFirstWithOffline(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    const offlinePage = await cache.match(OFFLINE_URL);
    if (offlinePage) return offlinePage;
    return new Response(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title></head><body style="font-family:system-ui;padding:2rem;text-align:center;"><h1>You are offline</h1><p>Please check your network connection.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// ---------- Messages: skipWaiting support ----------
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
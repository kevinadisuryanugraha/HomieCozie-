/**
 * Homie Cozie Coffee & Kitchen — Production Service Worker
 * Network-First for HTML/Navigation, Cache-First for Hashed Assets, Offline Fallback
 */

const CACHE_NAME = 'homie-cozie-cache-v2';
const STATIC_FALLBACK = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/logo_homie_cozie.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_FALLBACK);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = req.url;

  // Ignore non-GET, API, WebSocket, PDF, or heavy audit reports
  if (
    req.method !== 'GET' ||
    url.includes('/api/') ||
    url.includes(':8080') ||
    url.includes(':8000') ||
    url.endsWith('.pdf') ||
    url.endsWith('.zip') ||
    url.includes('PENTEST') ||
    url.includes('PERFORMANCE')
  ) {
    return;
  }

  // 1. Navigation / HTML Requests: Network-First (Ensures latest JS bundles are always used)
  if (req.mode === 'navigate' || url.endsWith('/') || url.endsWith('/index.html')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // 2. Static Hashed Assets (/assets/): Cache-First
  if (url.includes('/assets/')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((networkRes) => {
          if (networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        });
      })
    );
    return;
  }

  // 3. Other Static Assets (Images, Manifest): Stale-While-Revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

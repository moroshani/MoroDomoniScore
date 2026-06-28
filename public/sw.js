const CACHE_VERSION = 'v12';
const STATIC_CACHE = `domino-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `domino-runtime-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  OFFLINE_URL,
  '/fonts/YekanBakh-VF.woff2',
  '/fonts/YekanBakh-VF.woff',
  '/icons/domino-logo.svg',
  '/screenshots/screenshot-1.png',
  '/screenshots/screenshot-2.png',
  '/sounds/domino-clack.mp3'
];

const MAX_AGE = {
  assets: 60 * 60 * 24 * 30,
  fonts: 60 * 60 * 24 * 30,
  pages: 60 * 60
};

const MAX_ENTRIES = {
  runtime: 80,
  static: 40
};

const trimCache = async (cacheName, maxEntries) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  const excess = keys.length - maxEntries;
  for (let i = 0; i < excess; i += 1) {
    await cache.delete(keys[i]);
  }
};

const withTimestamp = (response) => {
  if (response.type === 'opaque') return response;
  const headers = new Headers(response.headers);
  headers.set('sw-cache-time', Date.now().toString());
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};

const getCacheAgeSeconds = (response) => {
  if (!response) return null;
  const timestamp = response.headers.get('sw-cache-time');
  if (!timestamp) return null;
  const ageMs = Date.now() - Number(timestamp);
  return Number.isFinite(ageMs) ? Math.max(0, ageMs / 1000) : null;
};

const fetchAndCache = async (request, cacheName) => {
  const response = await fetch(request);
  if (response && response.ok) {
    const cache = await caches.open(cacheName);
    const cacheResponse = withTimestamp(response.clone());
    await cache.put(request, cacheResponse);
    if (cacheName === RUNTIME_CACHE) {
      await trimCache(cacheName, MAX_ENTRIES.runtime);
    }
  }
  return response;
};

const cacheFirst = async (request, cacheName, maxAgeSeconds) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const age = getCacheAgeSeconds(cached);
  if (cached && (age === null || age < maxAgeSeconds)) return cached;
  return fetchAndCache(request, cacheName);
};

const staleWhileRevalidate = async (request, cacheName, maxAgeSeconds) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const age = getCacheAgeSeconds(cached);
  if (cached && (age === null || age < maxAgeSeconds)) {
    if (age === null || age > maxAgeSeconds / 2) {
      fetchAndCache(request, cacheName).catch(() => {});
    }
    return cached;
  }
  return fetchAndCache(request, cacheName);
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => trimCache(STATIC_CACHE, MAX_ENTRIES.static))
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await caches.keys().then((keys) => Promise.all(
        keys.filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      ));
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable().catch(() => {});
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/')) return;
  if (url.pathname.startsWith('/ws')) return;

  if (url.origin === self.location.origin && url.pathname.startsWith('/fonts/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE, MAX_AGE.fonts));
    return;
  }

  if (url.origin === self.location.origin && url.pathname.startsWith('/assets/')) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE, MAX_AGE.assets));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preload = await event.preloadResponse;
          if (preload) {
            const cache = await caches.open(STATIC_CACHE);
            await cache.put(request, withTimestamp(preload.clone()));
            return preload;
          }
          return await fetchAndCache(request, STATIC_CACHE);
        } catch (error) {
          const cache = await caches.open(STATIC_CACHE);
          return (await cache.match(request)) || (await cache.match(OFFLINE_URL)) || Response.error();
        }
      })()
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE, MAX_AGE.pages));
  }
});

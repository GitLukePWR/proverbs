/*
 * Wize offline cache. Same-origin GET requests are served from cache while a
 * fresh copy is fetched in the background (stale-while-revalidate), so the app
 * keeps working offline after the first visit. Journal data lives in
 * localStorage and is never touched by this worker.
 */
const CACHE = 'wize-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(['./', './index.html'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request, { ignoreSearch: request.mode === 'navigate' });
      const network = fetch(request)
        .then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        })
        .catch(() => undefined);
      if (cached) {
        event.waitUntil(network);
        return cached;
      }
      const fresh = await network;
      if (fresh) return fresh;
      if (request.mode === 'navigate') {
        const shell = await cache.match('./index.html');
        if (shell) return shell;
      }
      return new Response('Offline', { status: 503, statusText: 'Offline' });
    }),
  );
});

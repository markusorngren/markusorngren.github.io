const CACHE_NAME = 'mouse-tracker-v67'; // Bumpad version för uppdatering
const MAP_CACHE = 'mouse-map-tiles-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './icon-192.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME && key !== MAP_CACHE).map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  if (url.hostname.includes('tile.openstreetmap.org')) {
    e.respondWith(
      caches.match(e.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(e.request).then(networkResponse => {
          return caches.open(MAP_CACHE).then(cache => {
            cache.put(e.request, networkResponse.clone());
            return networkResponse;
          });
        }).catch(() => {
          return new Response('', { status: 408, statusText: 'Request Timeout' });
        });
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(res => {
      if (res) return res;
      return fetch(e.request).catch((err) => {
        console.warn("Offline-läge aktivt, nätverksanrop misslyckades:", err);
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    const versionNumber = CACHE_NAME.split('-').pop(); 
    event.ports[0].postMessage({ version: versionNumber });
  }

});


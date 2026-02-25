const CACHE_NAME = 'mouse-tracker-v68'; 
const MAP_CACHE = 'mouse-map-tiles-v1';

const ASSETS = [
  './',
  './index.html',
  './style.css',   // Ny
  './script.js',  // Ny
  './manifest.json',
  './icon.png',
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
        }).catch(() => new Response('', { status: 408 }));
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
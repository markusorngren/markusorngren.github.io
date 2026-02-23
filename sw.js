const CACHE_NAME = 'mouse-tracker-v66'; // Uppdaterad version för att tvinga fram update
const MAP_CACHE = 'mouse-map-tiles-v1'; // Ny cache för kartplattor
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Installation - Cachear alla grundfiler
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Aktivering - Rensar gamla cachar
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME && key !== MAP_CACHE).map(key => caches.delete(key))
      );
    })
  );
});

// Fetch - Hanterar offline-läge och dynamisk cachning
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Cachning av kartplattor: spara plattorna dynamiskt när vi besöker dem
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
          // Returnera ingenting om vi är offline och plattan inte finns sparad
          return new Response('', { status: 408, statusText: 'Request Timeout' });
        });
      })
    );
    return;
  }

  // För appens filer (HTML, CSS, JS)
  e.respondWith(
    caches.match(e.request).then(res => {
      if (res) return res;
      return fetch(e.request).catch((err) => {
        console.warn("Offline-läge aktivt, nätverksanrop misslyckades:", err);
      });
    })
  );
});

// Lyssnar på meddelanden från index.html för att visa versionen i appen
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    const versionNumber = CACHE_NAME.split('-').pop(); 
    event.ports[0].postMessage({ version: versionNumber });
  }
});
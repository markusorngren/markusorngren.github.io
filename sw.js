const CACHE_NAME = 'mouse-tracker-v19'; // Ändra detta nummer varje gång du gör stora ändringar!
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Installerar och sparar filer i cachen
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Tvingar den nya versionen att ta över direkt
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Rensar gamla cachar när en ny version aktiveras
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Hämtar filer
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

// Lyssnar efter meddelanden från appen för att skicka versionsnummer
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    // Tar bort prefixet så bara "v14" (eller vad man skrivit) skickas
    const versionNumber = CACHE_NAME.replace('mouse-tracker-', '');
    event.ports[0].postMessage({
      version: versionNumber
    });
  }
});
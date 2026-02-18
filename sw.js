const CACHE_NAME = 'mouse-tracker-v54'; // Uppdaterad version för att tvinga fram update
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Installation - Cachear alla filer
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
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Fetch - Serverar från cache om det går
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});

// Lyssnar på meddelanden från index.html för att visa versionen i appen
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    const versionNumber = CACHE_NAME.split('-').pop(); 
    event.ports[0].postMessage({ version: versionNumber });
  }

});
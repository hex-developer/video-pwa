const CACHE_NAME = 'pwa-video-player-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/scripts/main.js',
  '/styles/main.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});


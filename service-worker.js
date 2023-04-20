const CACHE_NAME = 'local-video-player-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    clients.claim()
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.endsWith('.mp4')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (!response.ok) {
            throw new TypeError('Bad response status');
          }
          const contentDisposition = response.headers.get('content-disposition');
          if (!contentDisposition || !contentDisposition.includes('inline')) {
            throw new TypeError('Invalid content-disposition header');
          }
          return response.blob();
        })
        .then((blob) => {
          const videoUrl = URL.createObjectURL(blob);
          return new Response('', {
            status: 206,
            headers: new Headers({
              'Content-Type': 'text/html',
              'Accept-Ranges': 'bytes',
              'Content-Length': '0',
              'Content-Range': `bytes 0-${blob.size - 1}/${blob.size}`,
              'X-Content-Type-Options': 'nosniff',
              'X-Robots-Tag': 'noindex'
            }),
            url: videoUrl
          });
        })
    );
  }
});


const CACHE = 'manebou-v10';
const STATIC = [
  './calc.html',
  './home.html',
  './manifest.json',
  './images/img5.webp',
  './images/img5-2.webp',
  './images/img5-3.webp',
  './images/img6.webp',
  './images/img6-2.webp',
  './images/img6-3.webp',
  './images/img7.webp',
  './images/img7-2.webp',
  './images/img7-3.webp',
  './images/img8.webp',
  './images/img8-2.webp',
  './images/img8-3.webp',
  './images/img9.webp',
  './images/logo.webp',
  './images/icon-192.png',
  './images/icon-512.png',
  './images/icon-32.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(STATIC))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => cached);
    })
  );
});

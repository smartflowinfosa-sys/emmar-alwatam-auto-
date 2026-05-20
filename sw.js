const CACHE_NAME = 'emaar-v2'; // تغيير الاسم هنا يجبر الآيفون على التحديث
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './logo-192.png',
  './logo-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // تفعيل النسخة الجديدة فوراً دون انتظار
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // تنظيف وحذف الكاش القديم v1
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

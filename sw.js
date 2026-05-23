const CACHE_NAME = 'emaar-v4';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './app-icon.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); 
          }
        })
      );
    }).then(() => self.clients.claim()) // إجبار التطبيق على السيطرة الفورية
  );
});

// الاستراتيجية الذكية: الإنترنت أولاً (Network First)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // إذا كان هناك إنترنت، اجلب التحديث الجديد من Vercel واحفظه
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // إذا لم يكن هناك إنترنت، افتح النسخة المخزنة في الجوال
        return caches.match(event.request);
      })
  );
});

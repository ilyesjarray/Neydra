const CACHE_NAME = 'neydra-cache-v3';
const LOCKED_PAGES = ['/welcome/pae', '/welcome/ail', '/welcome/nlp'];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        '/welcome',
        '/welcome/home',
        '/styles.css',
        '/js/subscriptions.js',
        '/assets/icon.png',
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  const requestURL = new URL(event.request.url);
  const pathname = requestURL.pathname;

  // Network First Strategy
  event.respondWith(
    fetch(event.request).then(function(response) {
      if (response && response.status === 200 && response.type === 'basic') {
        let responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
      }
      return response;
    }).catch(function() {
      return caches.match(event.request).then(function(response) {
        if (response) return response;
        if (LOCKED_PAGES.some(function(p) { return pathname.startsWith(p); })) {
          return caches.match('/welcome/home');
        }
      });
    })
  );
});

self.addEventListener('push', function(event) {
  var options = {
    body: event.data ? event.data.text() : 'NEYDRA Update',
    icon: '/assets/icon.png',
    badge: '/assets/icon.png'
  };
  event.waitUntil(
    self.registration.showNotification('[NEYDRA] Market Alert', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/welcome/home')
  );
});

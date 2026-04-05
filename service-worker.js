const LOCKED_PAGES = ['/welcome/pae', '/welcome/ail', '/welcome/nlp'];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('neydra-cache-v2').then(function(cache) {
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

self.addEventListener('fetch', function(event) {
  const requestURL = new URL(event.request.url);
  const pathname = requestURL.pathname;

  // Check if accessing a locked page
  if (LOCKED_PAGES.some(function(p) { return pathname.startsWith(p); })) {
    // Intercept and verify authorization
    event.respondWith(
      fetch(event.request).then(function(response) {
        // If user is not authorized, redirect to home
        if (response.status === 403) {
          return fetch('/welcome/home');
        }
        return response;
      }).catch(function() {
        // Offline - try cache
        return caches.match(event.request).then(function(response) {
          return response || fetch('/welcome/home');
        });
      })
    );
  } else {
    // Normal cache strategy for public pages
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
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

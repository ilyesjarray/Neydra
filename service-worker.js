const LOCKED_PAGES = ['PAE.html', 'AIL.html', 'RT-NLP-SA.html'];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches. open('neydra-cache-v1').then(function(cache) {
      return cache. addAll([
        '/',
        '/index.html',
        '/home.html',
        '/styles.css',
        '/js/subscriptions.js',
        '/assets/icon.png',
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  const requestURL = new URL(event.request. url);
  const page = requestURL.pathname. split('/').pop();

  // Check if accessing a locked page
  if (LOCKED_PAGES.includes(page)) {
    // Intercept and verify authorization
    event.respondWith(
      fetch(event.request).then(function(response) {
        // If user is not authorized, redirect to home
        if (response.status === 403) {
          return fetch('/home.html');
        }
        return response;
      }).catch(function() {
        // Offline - try cache
        return caches.match(event.request).then(function(response) {
          return response || fetch('/home.html');
        });
      })
    );
  } else {
    // Normal cache strategy for public pages
    event.respondWith(
      caches.match(event. request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener('push', function(event) {
  var options = {
    body: event. data ?  event.data.text() : 'NEYDRA Update',
    icon: 'assets/icon.png',
    badge: 'assets/icon.png'
  };
  event.waitUntil(
    self.registration.showNotification('[NEYDRA] Market Alert', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/home.html')
  );
});

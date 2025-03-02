self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('my-cache').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/assets/icon.png',
        // Add other assets you want to cache
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('sync', function(event) {
  if (event.tag === 'my-background-sync') {
    event.waitUntil(doSomeBackgroundSync());
  }
});

self.addEventListener('push', function(event) {
  var options = {
    body: event.data ? event.data.text() : 'Default body',
    icon: 'assets/icon.png',
    badge: 'assets/icon.png'
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});

async function doSomeBackgroundSync() {
  // Implement your background sync logic here
  console.log('Background sync logic');
}

// Listen to notification click event
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

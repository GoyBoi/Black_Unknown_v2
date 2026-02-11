// Service Worker for MMWAFRIKA PRIDE PWA

const CACHE_NAME = 'mmwafrika-pride-v1';
const STATIC_CACHE_NAME = 'static-v1';
const IMAGES_CACHE_NAME = 'images-v1';
const API_CACHE_NAME = 'api-v1';

const staticUrlsToCache = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Opened static cache');
        return cache.addAll(staticUrlsToCache);
      })
      .then(() => {
        console.log('Service Worker installed');
        return self.skipWaiting(); // Activate immediately
      })
  );
});

// Fetch event - serve cached resources when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Handle different types of requests differently
  if (request.destination === 'image') {
    // Cache images separately
    event.respondWith(
      caches.open(IMAGES_CACHE_NAME)
        .then(cache => cache.match(request))
        .then(response => {
          if (response) {
            return response;
          }
          
          // Clone the request to fetch from network
          const fetchRequest = request.clone();
          
          return fetch(fetchRequest).then(
            networkResponse => {
              if (!networkResponse || networkResponse.status !== 200 || request.method !== 'GET') {
                return networkResponse;
              }
              
              // Clone the response to store in cache
              const responseToCache = networkResponse.clone();
              
              caches.open(IMAGES_CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseToCache);
                });
              
              return networkResponse;
            }
          );
        })
    );
  } else if (request.url.includes('/api/')) {
    // Cache API responses
    event.respondWith(
      caches.open(API_CACHE_NAME)
        .then(cache => cache.match(request))
        .then(response => {
          // Fetch from network in the background and update cache
          const fetchRequest = request.clone();
          fetch(fetchRequest).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              cache.put(request, responseToCache);
            }
          });
          
          // Return cached response if available, otherwise network
          return response || fetch(request);
        })
    );
  } else {
    // Handle other requests (HTML, CSS, JS)
    event.respondWith(
      caches.open(STATIC_CACHE_NAME)
        .then(cache => cache.match(request))
        .then(response => {
          if (response) {
            return response;
          }
          
          // Try network, fall back to offline page
          return fetch(request).then(
            networkResponse => {
              if (!networkResponse || networkResponse.status !== 200 || request.method !== 'GET') {
                return networkResponse;
              }
              
              const responseToCache = networkResponse.clone();
              
              caches.open(STATIC_CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseToCache);
                });
              
              return networkResponse;
            }
          ).catch(() => {
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/offline');
            }
            // For other requests, return error
            return new Response('Network Error', {
              status: 408,
              headers: { 'Content-Type': 'text/html' }
            });
          });
        })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          const validCacheNames = [STATIC_CACHE_NAME, IMAGES_CACHE_NAME, API_CACHE_NAME];
          if (!validCacheNames.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      ).then(() => {
        console.log('Service Worker activated and old caches cleaned up');
        return clients.claim(); // Take control of all clients
      });
    })
  );
});

// Handle push notifications (future enhancement)
self.addEventListener('push', (event) => {
  console.log('Received a push notification', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('MMWAFRIKA PRIDE', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
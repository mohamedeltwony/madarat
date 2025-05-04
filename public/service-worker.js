// Service Worker for Madarat Alkon website
// Version 1.0.0

const CACHE_NAME = 'madarat-cache-v1';

// Assets to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/offline',
  '/images/pattern.png',
  '/images/hero-background.jpg',
  '/images/world-map.png',
  '/images/icons/favicon.ico',
  '/fonts/tajawal-v9-arabic-regular.woff2',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME;
            })
            .map((cacheName) => {
              console.log('Service Worker: Clearing old cache', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - Network first with cache fallback strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) {
    // For WordPress API requests, use a different strategy
    if (url.origin.includes('madaratalkon.com')) {
      return handleApiRequest(event);
    }
    return;
  }

  // Handle page navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If navigation fails, serve the offline page
          return caches.match('/offline');
        })
    );
    return;
  }

  // For other requests, try network first, then cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache the response for future
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseClone);
          });
        
        return response;
      })
      .catch(() => {
        // If network fetch fails, try to serve from cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // For images, return a placeholder if available
            if (event.request.destination === 'image') {
              return caches.match('/images/placeholder.png')
                .then((placeholderResponse) => {
                  if (placeholderResponse) {
                    return placeholderResponse;
                  }
                  // If even placeholder isn't available, return nothing
                  return new Response('Image not available', {
                    status: 404,
                    headers: { 'Content-Type': 'text/plain' },
                  });
                });
            }
            
            // For other resources, just return a basic error
            return new Response('Resource not available offline', {
              status: 404,
              headers: { 'Content-Type': 'text/plain' },
            });
          });
      })
  );
});

// Handle WordPress API requests - Cache then network strategy
function handleApiRequest(event) {
  event.respondWith(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // First try from cache
        return cache.match(event.request)
          .then((cachedResponse) => {
            // Create a promise for the network request
            const fetchPromise = fetch(event.request)
              .then((networkResponse) => {
                // Cache the newest version of the API response
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              })
              .catch((error) => {
                console.error('Service Worker: API fetch failed', error);
                // If network fails and we don't have a cached response, throw
                if (!cachedResponse) {
                  throw error;
                }
                return cachedResponse;
              });
            
            // Return cached response immediately if available, otherwise wait for fetch
            return cachedResponse || fetchPromise;
          });
      })
  );
} 
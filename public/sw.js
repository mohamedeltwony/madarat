// Service Worker for Madarat Alkon website
// Version 1.0.0
// Client-side only implementation

// Check if we're in a service worker context
if (typeof self !== 'undefined' && 'ServiceWorkerGlobalScope' in self) {
  const CACHE_NAME = 'madarat-v1.0.0';
  const STATIC_CACHE = 'madarat-static-v1.0.0';
  const DYNAMIC_CACHE = 'madarat-dynamic-v1.0.0';
  const IMAGE_CACHE = 'madarat-images-v1.0.0';

  // Assets to cache immediately
  const STATIC_ASSETS = [
    '/',
    '/offline',
    '/favicon.png',
    '/logo.png',
    '/site.webmanifest',
    '/images/icons/apple-touch-icon.png',
  ];

  // Cache strategies
  const CACHE_STRATEGIES = {
    // Cache first for static assets
    CACHE_FIRST: 'cache-first',
    // Network first for dynamic content
    NETWORK_FIRST: 'network-first',
    // Stale while revalidate for images
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  };

  // Install event - cache static assets
  self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
      Promise.all([
        caches.open(STATIC_CACHE).then((cache) => {
          console.log('Caching static assets');
          return cache.addAll(STATIC_ASSETS);
        }),
        self.skipWaiting()
      ])
    );
  });

  // Activate event - clean up old caches
  self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
      Promise.all([
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheName !== STATIC_CACHE && 
                  cacheName !== DYNAMIC_CACHE && 
                  cacheName !== IMAGE_CACHE) {
                console.log('Deleting old cache:', cacheName);
                return caches.delete(cacheName);
              }
            })
          );
        }),
        self.clients.claim()
      ])
    );
  });

  // Fetch event - implement caching strategies
  self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
      return;
    }

    // Skip external requests (except for specific domains)
    if (url.origin !== self.location.origin && 
        !url.hostname.includes('madaratalkon.com') &&
        !url.hostname.includes('fonts.googleapis.com') &&
        !url.hostname.includes('fonts.gstatic.com')) {
      return;
    }

    // Handle different types of requests
    if (isStaticAsset(request)) {
      event.respondWith(handleStaticAsset(request));
    } else if (isImage(request)) {
      event.respondWith(handleImage(request));
    } else if (isAPIRequest(request)) {
      event.respondWith(handleAPIRequest(request));
    } else if (isPageRequest(request)) {
      event.respondWith(handlePageRequest(request));
    } else {
      event.respondWith(handleDefault(request));
    }
  });

  // Check if request is for static assets
  function isStaticAsset(request) {
    const url = new URL(request.url);
    return url.pathname.match(/\.(js|css|woff2|woff|ttf|eot)$/) ||
           url.pathname.startsWith('/_next/static/');
  }

  // Check if request is for images
  function isImage(request) {
    const url = new URL(request.url);
    return url.pathname.match(/\.(png|jpg|jpeg|gif|webp|avif|svg|ico)$/);
  }

  // Check if request is for API
  function isAPIRequest(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith('/api/') ||
           url.hostname.includes('madaratalkon.com');
  }

  // Check if request is for pages
  function isPageRequest(request) {
    const url = new URL(request.url);
    return request.headers.get('accept')?.includes('text/html');
  }

  // Handle static assets with cache-first strategy
  async function handleStaticAsset(request) {
    try {
      const cache = await caches.open(STATIC_CACHE);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (error) {
      console.error('Static asset fetch failed:', error);
      return new Response('Asset not available', { status: 404 });
    }
  }

  // Handle images with stale-while-revalidate strategy
  async function handleImage(request) {
    try {
      const cache = await caches.open(IMAGE_CACHE);
      const cachedResponse = await cache.match(request);
      
      // Return cached version immediately if available
      if (cachedResponse) {
        // Update cache in background
        fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
        }).catch(() => {
          // Ignore network errors for background updates
        });
        
        return cachedResponse;
      }
      
      // If not cached, fetch from network
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (error) {
      console.error('Image fetch failed:', error);
      // Return a placeholder image or error response
      return new Response('Image not available', { status: 404 });
    }
  }

  // Handle API requests with network-first strategy
  async function handleAPIRequest(request) {
    try {
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (error) {
      console.error('API fetch failed:', error);
      
      // Try to return cached version
      const cache = await caches.open(DYNAMIC_CACHE);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return new Response(JSON.stringify({ error: 'Network unavailable' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Handle page requests with network-first strategy
  async function handlePageRequest(request) {
    try {
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch (error) {
      console.error('Page fetch failed:', error);
      
      // Try to return cached version
      const cache = await caches.open(DYNAMIC_CACHE);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Return offline page
      const offlineCache = await caches.open(STATIC_CACHE);
      const offlinePage = await offlineCache.match('/offline');
      
      if (offlinePage) {
        return offlinePage;
      }
      
      return new Response('Page not available offline', { status: 404 });
    }
  }

  // Handle default requests
  async function handleDefault(request) {
    try {
      return await fetch(request);
    } catch (error) {
      console.error('Default fetch failed:', error);
      return new Response('Resource not available', { status: 404 });
    }
  }

  // Background sync for failed requests
  self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
      event.waitUntil(doBackgroundSync());
    }
  });

  async function doBackgroundSync() {
    // Implement background sync logic here
    console.log('Background sync triggered');
  }

  // Push notification handling
  self.addEventListener('push', (event) => {
    if (event.data) {
      const data = event.data.json();
      
      const options = {
        body: data.body,
        icon: '/images/icons/apple-touch-icon.png',
        badge: '/favicon.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: data.primaryKey || 1
        },
        actions: [
          {
            action: 'explore',
            title: 'استكشف الآن',
            icon: '/images/icons/apple-touch-icon.png'
          },
          {
            action: 'close',
            title: 'إغلاق',
            icon: '/images/icons/apple-touch-icon.png'
          }
        ]
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    }
  });

  // Notification click handling
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
      event.waitUntil(
        clients.openWindow('/')
      );
    }
  });

  // Message handling for cache updates
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_UPDATE') {
      event.waitUntil(updateCache());
    }
  });

  async function updateCache() {
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(STATIC_ASSETS);
    console.log('Cache updated');
  }
} 
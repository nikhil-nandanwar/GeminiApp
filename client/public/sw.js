// Service Worker for caching and offline support
const CACHE_NAME = 'gemini-chat-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Assets to cache on install
const CACHE_ON_INSTALL = [
  ...STATIC_CACHE_URLS
];

// Network-first resources (API calls, dynamic content)
const NETWORK_FIRST = [
  '/api/',
  'https://generativelanguage.googleapis.com/'
];

// Cache-first resources (static assets)
const CACHE_FIRST = [
  '/assets/',
  '/static/',
  '.js',
  '.css',
  '.woff',
  '.woff2',
  '.png',
  '.jpg',
  '.jpeg',
  '.svg',
  '.webp',
  '.avif'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching essential files');
        return cache.addAll(CACHE_ON_INSTALL);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Network-first strategy for API calls
  if (NETWORK_FIRST.some(pattern => url.pathname.includes(pattern) || url.href.includes(pattern))) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Cache-first strategy for static assets
  if (CACHE_FIRST.some(pattern => url.pathname.includes(pattern) || url.pathname.endsWith(pattern))) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // Stale-while-revalidate for HTML pages
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  
  // Default: network with cache fallback
  event.respondWith(networkWithCacheFallback(request));
});

// Network-first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback if available
    return new Response('Offline', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

// Cache-first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache and network failed:', request.url);
    return new Response('Resource not available', { 
      status: 404, 
      statusText: 'Not Found' 
    });
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Network with cache fallback
async function networkWithCacheFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

// Handle background sync (for future offline functionality)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    // Implement background sync logic here
  }
});

// Handle push notifications (for future notification functionality)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  // Implement push notification logic here
});
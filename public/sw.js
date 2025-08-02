// =============================================================================
// PRODIGES AGENCY - SERVICE WORKER
// Advanced caching strategies for optimal performance
// =============================================================================

const CACHE_NAME = 'prodiges-v1.0.0';
const STATIC_CACHE_NAME = 'prodiges-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'prodiges-dynamic-v1.0.0';
const IMAGES_CACHE_NAME = 'prodiges-images-v1.0.0';

// Cache duration configurations
const CACHE_DURATION = {
  STATIC: 365 * 24 * 60 * 60 * 1000, // 1 year
  DYNAMIC: 7 * 24 * 60 * 60 * 1000,  // 1 week
  IMAGES: 30 * 24 * 60 * 60 * 1000,  // 1 month
  API: 5 * 60 * 1000                 // 5 minutes
};

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/globals.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Routes that should be cached with different strategies
const CACHE_STRATEGIES = {
  static: [
    /\/_next\/static\//,
    /\.(?:css|js|woff|woff2|ttf|otf)$/,
    /\/icons\//
  ],
  dynamic: [
    /^\/$/,
    /^\/\w+$/
  ],
  images: [
    /\.(?:png|jpg|jpeg|webp|avif|gif|svg)$/
  ],
  api: [
    /^\/api\//,
    /^https:\/\/api\./
  ]
};

// =============================================================================
// SERVICE WORKER EVENTS
// =============================================================================

// Install Event
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker');
  
  event.waitUntil(
    Promise.all([
      // Pre-cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[SW] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      cleanOldCaches(),
      // Claim all clients
      self.clients.claim()
    ])
  );
});

// Fetch Event - Main caching logic
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests from certain domains
  if (shouldSkipRequest(url)) {
    return;
  }

  // Determine cache strategy based on request
  const strategy = getCacheStrategy(url, request);
  
  event.respondWith(
    handleRequest(request, strategy)
  );
});

// Background Sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-form') {
    event.waitUntil(processOfflineFormSubmissions());
  }
});

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: data.data,
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// =============================================================================
// CACHING STRATEGIES
// =============================================================================

async function handleRequest(request, strategy) {
  switch (strategy) {
    case 'static':
      return cacheFirst(request, STATIC_CACHE_NAME);
    
    case 'dynamic':
      return staleWhileRevalidate(request, DYNAMIC_CACHE_NAME);
    
    case 'images':
      return cacheFirst(request, IMAGES_CACHE_NAME);
    
    case 'api':
      return networkFirst(request, DYNAMIC_CACHE_NAME);
    
    default:
      return networkFirst(request, DYNAMIC_CACHE_NAME);
  }
}

// Cache First Strategy - Best for static assets
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Check if cache is still valid
      if (isCacheValid(cachedResponse, getCacheDuration(cacheName))) {
        return cachedResponse;
      }
    }

    // Fetch from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return cached version if network fails
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback
    return getOfflineFallback(request);
  }
}

// Network First Strategy - Best for API calls
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return getOfflineFallback(request);
  }
}

// Stale While Revalidate - Best for dynamic content
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Start fetch in background
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, but we might have cache
    return cachedResponse;
  });

  // Return cache immediately if available, otherwise wait for network
  return cachedResponse || await fetchPromise;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function getCacheStrategy(url, request) {
  // Check each strategy pattern
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    for (const pattern of patterns) {
      if (pattern.test(url.pathname) || pattern.test(url.href)) {
        return strategy;
      }
    }
  }
  
  // Default strategy based on request type
  if (request.destination === 'image') return 'images';
  if (request.destination === 'script' || request.destination === 'style') return 'static';
  
  return 'dynamic';
}

function shouldSkipRequest(url) {
  // Skip analytics and tracking requests
  const skipDomains = [
    'google-analytics.com',
    'googletagmanager.com',
    'doubleclick.net',
    'facebook.com',
    'twitter.com'
  ];
  
  return skipDomains.some(domain => url.hostname.includes(domain));
}

function getCacheDuration(cacheName) {
  if (cacheName.includes('static')) return CACHE_DURATION.STATIC;
  if (cacheName.includes('images')) return CACHE_DURATION.IMAGES;
  if (cacheName.includes('dynamic')) return CACHE_DURATION.DYNAMIC;
  return CACHE_DURATION.API;
}

function isCacheValid(response, duration) {
  const cachedAt = response.headers.get('sw-cached-at');
  if (!cachedAt) return false;
  
  const age = Date.now() - parseInt(cachedAt);
  return age < duration;
}

async function cleanOldCaches() {
  const cacheNames = await caches.keys();
  const currentCaches = [CACHE_NAME, STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, IMAGES_CACHE_NAME];
  
  const deletePromises = cacheNames
    .filter(cacheName => !currentCaches.includes(cacheName))
    .map(cacheName => {
      console.log('[SW] Deleting old cache:', cacheName);
      return caches.delete(cacheName);
    });
  
  return Promise.all(deletePromises);
}

function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // Return appropriate offline fallback
  if (request.destination === 'document') {
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hors ligne - Prodiges Agency</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui, sans-serif; padding: 2rem; text-align: center; }
            .offline { max-width: 500px; margin: 0 auto; }
            .icon { font-size: 4rem; margin-bottom: 1rem; }
            h1 { color: #5B4FE9; margin-bottom: 1rem; }
            p { color: #666; line-height: 1.6; }
            .retry { background: #5B4FE9; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; cursor: pointer; margin-top: 1rem; }
          </style>
        </head>
        <body>
          <div class="offline">
            <div class="icon">📱</div>
            <h1>Vous êtes hors ligne</h1>
            <p>Il semble que vous n'ayez pas de connexion internet. Cette page sera disponible dès que vous serez reconnecté.</p>
            <button class="retry" onclick="window.location.reload()">Réessayer</button>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  if (request.destination === 'image') {
    // Return placeholder image
    return new Response(`
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="sans-serif" font-size="18" fill="#666">
          Image non disponible
        </text>
      </svg>
    `, {
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
  
  return new Response('Contenu non disponible hors ligne', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' }
  });
}

// =============================================================================
// BACKGROUND SYNC FOR OFFLINE FORMS
// =============================================================================

async function processOfflineFormSubmissions() {
  try {
    const cache = await caches.open('offline-forms');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
          console.log('[SW] Successfully synced offline form submission');
        }
      } catch (error) {
        console.log('[SW] Failed to sync form submission:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Error processing offline forms:', error);
  }
}

// =============================================================================
// PERFORMANCE MONITORING
// =============================================================================

// Track cache hit rates
let cacheHits = 0;
let cacheMisses = 0;

function trackCachePerformance(hit) {
  if (hit) {
    cacheHits++;
  } else {
    cacheMisses++;
  }
  
  // Report metrics every 100 requests
  if ((cacheHits + cacheMisses) % 100 === 0) {
    const hitRate = (cacheHits / (cacheHits + cacheMisses)) * 100;
    console.log(`[SW] Cache hit rate: ${hitRate.toFixed(2)}%`);
    
    // Send to analytics if available
    if (self.clients) {
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'CACHE_METRICS',
            hitRate: hitRate,
            totalRequests: cacheHits + cacheMisses
          });
        });
      });
    }
  }
}

console.log('[SW] Prodiges Agency Service Worker loaded successfully');
// ZAFIRO Service Worker v2026-07-19
// Strategy: HTML = network-first, assets = cache-first with versioned cache

const SW_VERSION = '2026-07-19-v2'
const CACHE_NAME = `zafiro-static-v2-${SW_VERSION}`
const MAX_CACHE_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

// URLs that must NEVER be cached (always go to network)
const NEVER_CACHE = [
  '/',
  '/_not-found',
  '/about',
  '/admin',
  '/auth/login',
  '/auth/register',
  '/auth/recover',
  '/auth/verify',
  '/eliana',
  '/mi-perfil',
  '/offline',
  '/os',
  '/zafiro/biblioteca',
]

// Detect if a request is for an HTML document
function isDocument(request) {
  return request.mode === 'navigate' ||
    (request.method === 'GET' && request.headers.get('Accept')?.includes('text/html'))
}

// Detect if a request is for a hashed static asset (Next.js appends content hash)
function isHashedAsset(url) {
  // Next.js appends content hash in brackets: [name].[hash].js
  const pathname = new URL(url).pathname
  return /[_.][a-f0-9]{8,}\.(js|css|woff2?|png|jpg|webp|svg)$/i.test(pathname) ||
    pathname.startsWith('/_next/static/')
}

// Install: pre-cache shell assets, skip waiting
self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([
        '/offline',
        '/icons/icon-192.svg',
        '/icons/icon-512.svg',
      ]).catch(() => { /* non-critical */ })
    )
  )
})

// Activate: remove old caches, claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('zafiro-') && k !== CACHE_NAME)
          .map((k) => {
            return caches.delete(k)
          })
      )
    ).then(() => self.clients.claim())
  )
})

// Fetch: network-first for HTML and API, cache-first for hashed assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return

  const path = url.pathname

  // API calls: network-first
  if (path.startsWith('/api/')) {
    event.respondWith(networkFirst(request))
    return
  }

  // HTML documents: network-first (NEVER serve stale HTML)
  if (isDocument(request)) {
    event.respondWith(networkFirst(request))
    return
  }

  // Never-cache paths: network-first
  if (NEVER_CACHE.includes(path)) {
    event.respondWith(networkFirst(request))
    return
  }

  // Hashed assets (JS/CSS with content hash): cache-first (immutable)
  if (isHashedAsset(url)) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Everything else: network-first
  event.respondWith(networkFirst(request))
})

async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (err) {
    const cached = await caches.match(request)
    if (cached) return cached
    // If navigating and offline, serve offline page
    if (isDocument(request)) {
      return caches.match('/offline')
    }
    return new Response('Offline', { status: 503 })
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) {
    // Check age for non-hashed items
    const cachedTime = cached.headers.get('x-cache-time')
    if (cachedTime) {
      const age = Date.now() - parseInt(cachedTime, 10)
      if (age > MAX_CACHE_AGE_MS) {
        // Cache expired, try network
        try {
          const response = await fetch(request)
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME)
            cache.put(request, response.clone())
          }
          return response
        } catch {
          return cached // serve stale if network fails
        }
      }
    }
    return cached
  }
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return caches.match('/offline')
  }
}

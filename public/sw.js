// ZAFIRO Service Worker v2026-07-20
// Strategy: HTML = network-first, assets = cache-first with versioned cache
// Push notifications + offline fallback

const SW_VERSION = '2026-07-20-v3'
const CACHE_NAME = `zafiro-static-v3-${SW_VERSION}`
const MAX_CACHE_AGE_MS = 7 * 24 * 60 * 60 * 1000

const NEVER_CACHE = [
  '/', '/_not-found', '/about', '/admin', '/auth/login', '/auth/register',
  '/auth/recover', '/auth/verify', '/eliana', '/mi-perfil', '/offline', '/os',
  '/zafiro/biblioteca',
]

function isDocument(request) {
  return request.mode === 'navigate' ||
    (request.method === 'GET' && request.headers.get('Accept')?.includes('text/html'))
}

function isHashedAsset(url) {
  const pathname = new URL(url).pathname
  return /[_.][a-f0-9]{8,}\.(js|css|woff2?|png|jpg|webp|svg)$/i.test(pathname) ||
    pathname.startsWith('/_next/static/')
}

// Install
self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(['/offline', '/icons/icon-192.svg', '/icons/icon-512.svg'])
        .catch(() => {})
    )
  )
})

// Activate: remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter(k => k.startsWith('zafiro-') && k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

// Push notification
self.addEventListener('push', (event) => {
  if (!event.data) return
  try {
    const data = event.data.json()
    self.registration.showNotification(data.title || 'ZAFIRO', {
      body: data.message || '',
      icon: '/icons/icon-192.svg',
      badge: '/icons/icon-192.svg',
      tag: data.tag || 'default',
      data: { url: data.url || '/' },
      vibrate: [200, 100, 200],
    })
  } catch {}
})

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const existing = windowClients.find(c => c.url.includes(url))
      if (existing) { existing.focus(); return }
      clients.openWindow(url)
    })
  )
})

// Fetch: network-first for HTML/API, cache-first for hashed assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  const path = url.pathname

  if (path.startsWith('/api/')) {
    event.respondWith(networkFirst(request))
    return
  }

  if (isDocument(request)) {
    event.respondWith(networkFirst(request))
    return
  }

  if (NEVER_CACHE.includes(path)) {
    event.respondWith(networkFirst(request))
    return
  }

  if (isHashedAsset(url)) {
    event.respondWith(cacheFirst(request))
    return
  }

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
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    if (isDocument(request)) return caches.match('/offline')
    return new Response('Offline', { status: 503 })
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) {
    const cachedTime = cached.headers.get('x-cache-time')
    if (cachedTime) {
      const age = Date.now() - parseInt(cachedTime, 10)
      if (age > MAX_CACHE_AGE_MS) {
        try {
          const response = await fetch(request)
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME)
            cache.put(request, response.clone())
          }
          return response
        } catch { return cached }
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

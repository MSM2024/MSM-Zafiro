'use client'

export interface CachedEntry<T = unknown> {
  data: T
  cachedAt: string
  expiresAt: string
  version: number
  etag?: string
  stale: boolean
}

interface CacheConfig {
  ttlMs: number
  maxEntries: number
  version: number
}

const CACHE_PREFIX = 'zafiro_cache_'
const DEFAULT_TTL_MS = 5 * 60 * 1000
const MAX_ENTRIES = 200
const CACHE_VERSION = 1

const CACHE_CONFIGS: Record<string, CacheConfig> = {
  profile: { ttlMs: 10 * 60 * 1000, maxEntries: 50, version: 1 },
  catalog: { ttlMs: 15 * 60 * 1000, maxEntries: 30, version: 1 },
  feed: { ttlMs: 5 * 60 * 1000, maxEntries: 20, version: 1 },
  static: { ttlMs: 60 * 60 * 1000, maxEntries: 100, version: 1 },
  api: { ttlMs: 2 * 60 * 1000, maxEntries: 100, version: 1 },
}

function getConfig(key: string): CacheConfig {
  for (const [prefix, config] of Object.entries(CACHE_CONFIGS)) {
    if (key.startsWith(prefix)) return config
  }
  return { ttlMs: DEFAULT_TTL_MS, maxEntries: MAX_ENTRIES, version: CACHE_VERSION }
}

function storageKey(key: string): string {
  return `${CACHE_PREFIX}${key}`
}

function getAllKeys(): string[] {
  if (typeof window === 'undefined') return []
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k?.startsWith(CACHE_PREFIX)) keys.push(k)
  }
  return keys
}

export function cacheGet<T>(key: string): { data: T; stale: boolean } | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(storageKey(key))
    if (!raw) return null
    const entry: CachedEntry<T> = JSON.parse(raw)
    const now = Date.now()
    const exp = new Date(entry.expiresAt).getTime()
    if (now > exp) {
      if (entry.stale) return { data: entry.data, stale: true }
      return null
    }
    return { data: entry.data, stale: false }
  } catch { return null }
}

export function cacheSet<T>(key: string, data: T, ttlMs?: number, stale = true): void {
  if (typeof window === 'undefined') return
  try {
    const config = getConfig(key)
    const effectiveTtl = ttlMs || config.ttlMs
    const entry: CachedEntry<T> = {
      data,
      cachedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + effectiveTtl).toISOString(),
      version: config.version,
      stale,
    }

    const keys = getAllKeys()
    if (keys.length >= MAX_ENTRIES) {
      const oldest = keys.sort((a, b) => {
        const aRaw = localStorage.getItem(a)
        const bRaw = localStorage.getItem(b)
        if (!aRaw || !bRaw) return 0
        try {
          return new Date(JSON.parse(aRaw).cachedAt).getTime() - new Date(JSON.parse(bRaw).cachedAt).getTime()
        } catch { return 0 }
      })[0]
      if (oldest) localStorage.removeItem(oldest)
    }

    localStorage.setItem(storageKey(key), JSON.stringify(entry))
  } catch { /* silent */ }
}

export function cacheInvalidate(key: string): void {
  if (typeof window === 'undefined') return
  try { localStorage.removeItem(storageKey(key)) } catch { /* silent */ }
}

export function cacheInvalidateByPrefix(prefix: string): void {
  if (typeof window === 'undefined') return
  const keys = getAllKeys()
  keys.forEach(k => {
    const cacheKey = k.substring(CACHE_PREFIX.length)
    if (cacheKey.startsWith(prefix)) localStorage.removeItem(k)
  })
}

export function cacheClear(): void {
  if (typeof window === 'undefined') return
  const keys = getAllKeys()
  keys.forEach(k => localStorage.removeItem(k))
}

export async function cacheFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs?: number,
  stale = true,
): Promise<T> {
  const cached = cacheGet<T>(key)
  if (cached && !cached.stale) return cached.data
  if (cached && cached.stale) {
    fetcher().then(fresh => cacheSet(key, fresh, ttlMs, stale)).catch(() => {})
    return cached.data
  }
  const fresh = await fetcher()
  cacheSet(key, fresh, ttlMs, stale)
  return fresh
}

export function getCacheStats(): { totalEntries: number; totalSizeKB: number; keys: string[] } {
  if (typeof window === 'undefined') return { totalEntries: 0, totalSizeKB: 0, keys: [] }
  const keys = getAllKeys()
  let totalBytes = 0
  keys.forEach(k => {
    const raw = localStorage.getItem(k)
    if (raw) totalBytes += raw.length * 2
  })
  return { totalEntries: keys.length, totalSizeKB: Math.round(totalBytes / 1024), keys: keys.map(k => k.substring(CACHE_PREFIX.length)) }
}

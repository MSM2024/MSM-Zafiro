'use client'

const RATE_LIMIT_KEY = 'zafiro_rate_limits'

interface RateEntry {
  count: number
  resetAt: number
}

function getStore(): Record<string, RateEntry> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}')
  } catch { return {} }
}

function saveStore(store: Record<string, RateEntry>) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(store))
  }
}

export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 900000,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const store = getStore()
  const entry = store[key]

  if (!entry || now >= entry.resetAt) {
    store[key] = { count: 1, resetAt: now + windowMs }
    saveStore(store)
    return { allowed: true, remaining: maxAttempts - 1, resetAt: now + windowMs }
  }

  entry.count++
  const allowed = entry.count <= maxAttempts
  store[key] = entry
  saveStore(store)

  return {
    allowed,
    remaining: Math.max(0, maxAttempts - entry.count),
    resetAt: entry.resetAt,
  }
}

export function resetRateLimit(key: string) {
  const store = getStore()
  delete store[key]
  saveStore(store)
}

export function getRateLimitStatus(key: string): { count: number; resetAt: number } | null {
  const store = getStore()
  const entry = store[key]
  if (!entry) return null
  return { count: entry.count, resetAt: entry.resetAt }
}

export function clearExpiredRateLimits() {
  const now = Date.now()
  const store = getStore()
  let changed = false
  for (const k of Object.keys(store)) {
    if (now >= store[k].resetAt) {
      delete store[k]
      changed = true
    }
  }
  if (changed) saveStore(store)
}

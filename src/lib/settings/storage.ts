import type { UserPreferences } from './types'
import { defaultPreferences } from './defaults'

const PREFS_KEY = 'zafiro_preferences'
const SYNC_QUEUE_KEY = 'zafiro_preferences_sync_queue'
const EVENT_PREFS_CHANGED = 'zafiro-preferences-changed'

function notify() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_PREFS_CHANGED))
  }
}

export function onPreferencesChanged(cb: () => void) {
  if (typeof window === 'undefined') return () => {}
  const handler = () => cb()
  window.addEventListener(EVENT_PREFS_CHANGED, handler)
  return () => window.removeEventListener(EVENT_PREFS_CHANGED, handler)
}

export function loadPreferences(userId: string): UserPreferences {
  if (typeof window === 'undefined') return defaultPreferences(userId)
  try {
    const all = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}')
    return all[userId] ? { ...defaultPreferences(userId), ...all[userId], userId } : defaultPreferences(userId)
  } catch {
    return defaultPreferences(userId)
  }
}

export function savePreferences(prefs: UserPreferences): void {
  if (typeof window === 'undefined') return
  prefs.updatedAt = new Date().toISOString()
  try {
    const all = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}')
    all[prefs.userId] = prefs
    localStorage.setItem(PREFS_KEY, JSON.stringify(all))
    notify()
  } catch { /* silent */ }
}

export function savePreferenceField<K extends keyof UserPreferences>(
  userId: string, field: K, value: UserPreferences[K]
): UserPreferences {
  const prefs = loadPreferences(userId)
  prefs[field] = value
  prefs.updatedAt = new Date().toISOString()
  savePreferences(prefs)
  return prefs
}

export function getAllPreferences(): Record<string, UserPreferences> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) || '{}')
  } catch { return {} }
}

export function enqueueSync(userId: string): void {
  if (typeof window === 'undefined') return
  try {
    const queue = JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]')
    queue.push({ userId, timestamp: new Date().toISOString(), operationId: `sync_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` })
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue))
  } catch { /* silent */ }
}

export function getSyncQueue(): { userId: string; timestamp: string; operationId: string }[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]')
  } catch { return [] }
}

export function clearSyncQueue(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SYNC_QUEUE_KEY)
}

export function clearAllPreferences(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(PREFS_KEY)
  localStorage.removeItem(SYNC_QUEUE_KEY)
  notify()
}

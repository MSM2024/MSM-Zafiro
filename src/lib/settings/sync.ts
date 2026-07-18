import type { UserPreferences } from './types'
import { loadPreferences, savePreferences, enqueueSync, clearSyncQueue } from './storage'
import { getSession } from '@/lib/auth'

export async function syncPreferencesToBackend(userId: string): Promise<{ ok: boolean; error?: string }> {
  const prefs = loadPreferences(userId)
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'preferences',
        userId,
        data: prefs,
        timestamp: new Date().toISOString(),
      }),
    })
    if (!res.ok) {
      enqueueSync(userId)
      return { ok: false, error: 'Error del servidor' }
    }
    clearSyncQueue()
    return { ok: true }
  } catch {
    enqueueSync(userId)
    return { ok: false, error: 'Sin conexión — pendiente de sincronización' }
  }
}

export async function pullPreferencesFromBackend(userId: string): Promise<UserPreferences | null> {
  try {
    const res = await fetch(`/api/sync?type=preferences&userId=${encodeURIComponent(userId)}`)
    if (!res.ok) return null
    const data = await res.json()
    if (data?.preferences) {
      savePreferences({ ...data.preferences, userId })
      return data.preferences
    }
    return null
  } catch {
    return null
  }
}

export function getCurrentUserId(): string {
  const session = getSession()
  return session?.id || session?.email || 'anonymous'
}

export function getOfflineStatus(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine
}

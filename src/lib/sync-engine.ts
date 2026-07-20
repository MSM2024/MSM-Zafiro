'use client'

import {
  getPendingItems, getFailedItems, markSyncing, markConfirmed, markFailed,
  getSyncStatus, retryOperation, type QueueItem, type SyncStatus,
} from '@/lib/offline-queue'

export type SyncHandler = (item: QueueItem) => Promise<boolean>

const handlers = new Map<string, SyncHandler>()

export function registerSyncHandler(entity: string, handler: SyncHandler) {
  handlers.set(entity, handler)
}

export function unregisterSyncHandler(entity: string) {
  handlers.delete(entity)
}

export async function processQueue(onProgress?: (current: number, total: number) => void): Promise<{ success: number; failed: number }> {
  const items = getPendingItems()
  let success = 0
  let failed = 0

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const handler = handlers.get(item.entity)
    if (!handler) {
      markFailed(item.id, `No sync handler registered for entity: ${item.entity}`)
      failed++
      continue
    }

    markSyncing(item.id)
    try {
      const result = await handler(item)
      if (result) {
        markConfirmed(item.id)
        success++
      } else {
        markFailed(item.id, "Handler returned false")
        failed++
      }
    } catch (err) {
      markFailed(item.id, err instanceof Error ? err.message : "Unknown error")
      failed++
    }

    if (onProgress) onProgress(i + 1, items.length)
  }

  return { success, failed }
}

export async function retryFailed(onProgress?: (current: number, total: number) => void): Promise<{ success: number; failed: number }> {
  const items = getFailedItems()
  let success = 0
  let failed = 0

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    retryOperation(item.id)
    const handler = handlers.get(item.entity)
    if (!handler) { failed++; continue }

    markSyncing(item.id)
    try {
      const result = await handler(item)
      if (result) { markConfirmed(item.id); success++ }
      else { markFailed(item.id, "Retry failed"); failed++ }
    } catch (err) {
      markFailed(item.id, err instanceof Error ? err.message : "Retry error")
      failed++
    }
    if (onProgress) onProgress(i + 1, items.length)
  }

  return { success, failed }
}

export function getSyncEngineStatus(): SyncStatus & { registeredHandlers: string[] } {
  return {
    ...getSyncStatus(),
    registeredHandlers: Array.from(handlers.keys()),
  }
}

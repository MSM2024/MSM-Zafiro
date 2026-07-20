'use client'

export type OpStatus = "local" | "pending" | "syncing" | "confirmed" | "failed"
export type OpType = "create" | "update" | "delete"
export type ConflictStrategy = "local_wins" | "remote_wins" | "manual"

export interface QueueItem {
  id: string
  type: OpType
  entity: string
  entityId: string
  data: any
  previousData?: any
  status: OpStatus
  retryCount: number
  maxRetries: number
  error?: string
  conflictStrategy: ConflictStrategy
  createdAt: string
  lastAttempt?: string
  confirmedAt?: string
}

export interface SyncStatus {
  queueLength: number
  pendingCount: number
  failedCount: number
  confirmedCount: number
  lastSyncTime?: string
  isOnline: boolean
}

const QUEUE_KEY = "zafiro_offline_queue"
const SYNC_META_KEY = "zafiro_sync_meta"

function getQueue(): QueueItem[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]") }
  catch { return [] }
}

function saveQueue(q: QueueItem[]) { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)) }

function getSyncMeta(): { lastSyncTime?: string } {
  if (typeof window === "undefined") return {}
  try { return JSON.parse(localStorage.getItem(SYNC_META_KEY) || "{}") }
  catch { return {} }
}

function saveSyncMeta(m: { lastSyncTime?: string }) { localStorage.setItem(SYNC_META_KEY, JSON.stringify(m)) }

function genId(): string { return `op_${Date.now()}_${Math.random().toString(36).slice(2, 8)}` }

export function enqueueOperation(input: {
  type: OpType
  entity: string
  entityId: string
  data: any
  previousData?: any
  conflictStrategy?: ConflictStrategy
  maxRetries?: number
}): QueueItem {
  const item: QueueItem = {
    id: genId(),
    type: input.type,
    entity: input.entity,
    entityId: input.entityId,
    data: input.data,
    previousData: input.previousData,
    status: "local",
    retryCount: 0,
    maxRetries: input.maxRetries ?? 3,
    conflictStrategy: input.conflictStrategy ?? "local_wins",
    createdAt: new Date().toISOString(),
  }
  const queue = getQueue()
  queue.push(item)
  saveQueue(queue)
  return item
}

export function markPending(id: string) {
  const queue = getQueue()
  const item = queue.find(i => i.id === id)
  if (item) { item.status = "pending"; saveQueue(queue) }
}

export function markSyncing(id: string) {
  const queue = getQueue()
  const item = queue.find(i => i.id === id)
  if (item) { item.status = "syncing"; item.lastAttempt = new Date().toISOString(); saveQueue(queue) }
}

export function markConfirmed(id: string) {
  const queue = getQueue()
  const item = queue.find(i => i.id === id)
  if (item) {
    item.status = "confirmed"
    item.confirmedAt = new Date().toISOString()
    saveQueue(queue)
    saveSyncMeta({ lastSyncTime: new Date().toISOString() })
  }
}

export function markFailed(id: string, error: string) {
  const queue = getQueue()
  const item = queue.find(i => i.id === id)
  if (item) { item.status = "failed"; item.error = error; item.lastAttempt = new Date().toISOString(); saveQueue(queue) }
}

export function retryOperation(id: string) {
  const queue = getQueue()
  const item = queue.find(i => i.id === id)
  if (item && item.status === "failed") {
    item.status = "pending"
    item.retryCount += 1
    item.error = undefined
    saveQueue(queue)
  }
}

export function retryAllFailed() {
  const queue = getQueue()
  let changed = false
  queue.forEach(i => {
    if (i.status === "failed" && i.retryCount < i.maxRetries) {
      i.status = "pending"; i.error = undefined; changed = true
    }
  })
  if (changed) saveQueue(queue)
}

export function getPendingItems(): QueueItem[] {
  return getQueue().filter(i => i.status === "local" || i.status === "pending")
}

export function getFailedItems(): QueueItem[] {
  return getQueue().filter(i => i.status === "failed")
}

export function getConfirmedItems(): QueueItem[] {
  return getQueue().filter(i => i.status === "confirmed")
}

export function getItemsByEntity(entity: string, entityId: string): QueueItem[] {
  return getQueue().filter(i => i.entity === entity && i.entityId === entityId)
}

export function clearConfirmed() {
  const queue = getQueue().filter(i => i.status !== "confirmed")
  saveQueue(queue)
}

export function getSyncStatus(): SyncStatus {
  const queue = getQueue()
  const meta = getSyncMeta()
  return {
    queueLength: queue.length,
    pendingCount: queue.filter(i => i.status === "local" || i.status === "pending").length,
    failedCount: queue.filter(i => i.status === "failed").length,
    confirmedCount: queue.filter(i => i.status === "confirmed").length,
    lastSyncTime: meta.lastSyncTime,
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  }
}

export function cleanupOldOperations(maxAgeDays: number = 30) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - maxAgeDays)
  const queue = getQueue().filter(i => {
    if (i.status === "confirmed" && i.confirmedAt) {
      return new Date(i.confirmedAt) > cutoff
    }
    return true
  })
  saveQueue(queue)
}

export function detectConflicts(entity: string, entityId: string, localVersion: number, remoteVersion: number): boolean {
  return localVersion !== remoteVersion
}

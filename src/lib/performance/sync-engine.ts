'use client'

export type SyncStatus = 'GUARDADO' | 'PENDIENTE' | 'SINCRONIZANDO' | 'SINCRONIZADO' | 'REQUIERE_REVISION'

export interface SyncOperation {
  operationId: string
  idempotencyKey: string
  type: string
  payload: unknown
  version: number
  timestamp: string
  actorId: string
  deviceId: string
  checksum: string
  status: SyncStatus
  retries: number
  lastError?: string
}

const QUEUE_KEY = 'zafiro_sync_queue'
const MAX_RETRIES = 5

function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server'
  let id = localStorage.getItem('zafiro_device_id')
  if (!id) {
    id = `device-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    localStorage.setItem('zafiro_device_id', id)
  }
  return id
}

function getActorId(): string {
  if (typeof window === 'undefined') return 'anonymous'
  try {
    const session = JSON.parse(localStorage.getItem('zafiro_session') || '{}')
    return session.email || 'anonymous'
  } catch { return 'anonymous' }
}

function computeChecksum(payload: unknown): string {
  const str = JSON.stringify(payload)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return `cs-${Math.abs(hash).toString(16)}`
}

function getQueue(): SyncOperation[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveQueue(queue: SyncOperation[]): void {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(queue)) } catch { /* silent */ }
}

export function enqueueOperation(type: string, payload: unknown): SyncOperation {
  const op: SyncOperation = {
    operationId: `op-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    idempotencyKey: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    payload,
    version: 1,
    timestamp: new Date().toISOString(),
    actorId: getActorId(),
    deviceId: getDeviceId(),
    checksum: computeChecksum(payload),
    status: 'PENDIENTE',
    retries: 0,
  }

  const queue = getQueue()
  queue.push(op)
  saveQueue(queue)
  return op
}

export function getPendingOperations(): SyncOperation[] {
  return getQueue().filter(op => op.status === 'PENDIENTE' || op.status === 'REQUIERE_REVISION')
}

export function getAllOperations(): SyncOperation[] {
  return getQueue()
}

export function updateOperationStatus(operationId: string, status: SyncStatus, error?: string): void {
  const queue = getQueue()
  const op = queue.find(o => o.operationId === operationId)
  if (!op) return
  op.status = status
  op.lastError = error
  if (status === 'SINCRONIZANDO') op.retries++
  saveQueue(queue)
}

export function clearSyncedOperations(): void {
  const queue = getQueue().filter(op => op.status !== 'SINCRONIZADO')
  saveQueue(queue)
}

export async function processSyncQueue(syncFn: (op: SyncOperation) => Promise<boolean>): Promise<{ synced: number; failed: number }> {
  const pending = getPendingOperations()
  let synced = 0
  let failed = 0

  for (const op of pending) {
    if (op.retries >= MAX_RETRIES) {
      updateOperationStatus(op.operationId, 'REQUIERE_REVISION', 'Máximo de reintentos alcanzado')
      failed++
      continue
    }

    updateOperationStatus(op.operationId, 'SINCRONIZANDO')
    try {
      const success = await syncFn(op)
      if (success) {
        updateOperationStatus(op.operationId, 'SINCRONIZADO')
        synced++
      } else {
        updateOperationStatus(op.operationId, 'PENDIENTE', 'Error de sincronización')
        failed++
      }
    } catch (err) {
      updateOperationStatus(op.operationId, 'PENDIENTE', err instanceof Error ? err.message : 'Error desconocido')
      failed++
    }
  }

  return { synced, failed }
}

export function getSyncStats(): { total: number; pending: number; synced: number; failed: number } {
  const queue = getQueue()
  return {
    total: queue.length,
    pending: queue.filter(o => o.status === 'PENDIENTE').length,
    synced: queue.filter(o => o.status === 'SINCRONIZADO').length,
    failed: queue.filter(o => o.status === 'REQUIERE_REVISION').length,
  }
}

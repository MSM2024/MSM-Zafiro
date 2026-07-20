import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  enqueueOperation, markPending, markSyncing, markConfirmed, markFailed,
  retryOperation, retryAllFailed, getPendingItems, getFailedItems,
  getConfirmedItems, getSyncStatus, clearConfirmed, cleanupOldOperations,
  detectConflicts, getItemsByEntity
} from '../offline-queue'

beforeEach(() => { localStorage.clear() })

describe('offline-queue', () => {
  it('enqueues an operation with correct defaults', () => {
    const op = enqueueOperation({ type: 'create', entity: 'post', entityId: 'p1', data: { text: 'hello' } })
    expect(op.status).toBe('local')
    expect(op.retryCount).toBe(0)
    expect(op.maxRetries).toBe(3)
    expect(op.conflictStrategy).toBe('local_wins')
    expect(op.id).toContain('op_')
  })

  it('markPending changes status', () => {
    const op = enqueueOperation({ type: 'update', entity: 'post', entityId: 'p1', data: {} })
    markPending(op.id)
    const pending = getPendingItems()
    expect(pending).toHaveLength(1)
    expect(pending[0].status).toBe('pending')
  })

  it('markConfirmed updates status and meta', () => {
    const op = enqueueOperation({ type: 'create', entity: 'post', entityId: 'p1', data: {} })
    markConfirmed(op.id)
    const confirmed = getConfirmedItems()
    expect(confirmed).toHaveLength(1)
    expect(confirmed[0].status).toBe('confirmed')
    expect(confirmed[0].confirmedAt).toBeDefined()
    const sync = getSyncStatus()
    expect(sync.lastSyncTime).toBeDefined()
  })

  it('markFailed sets error', () => {
    const op = enqueueOperation({ type: 'create', entity: 'post', entityId: 'p1', data: {} })
    markFailed(op.id, 'Network error')
    const failed = getFailedItems()
    expect(failed).toHaveLength(1)
    expect(failed[0].error).toBe('Network error')
  })

  it('retryOperation resets failed to pending', () => {
    const op = enqueueOperation({ type: 'create', entity: 'post', entityId: 'p1', data: {} })
    markFailed(op.id, 'err')
    retryOperation(op.id)
    const pending = getPendingItems()
    expect(pending).toHaveLength(1)
    expect(pending[0].status).toBe('pending')
    expect(pending[0].retryCount).toBe(1)
  })

  it('retryAllFailed retries eligible items and skips exhausted', () => {
    const op1 = enqueueOperation({ type: 'create', entity: 'post', entityId: 'p1', data: {}, maxRetries: 0 })
    const op2 = enqueueOperation({ type: 'create', entity: 'post', entityId: 'p2', data: {} })
    markFailed(op1.id, 'err')
    markFailed(op2.id, 'err')
    retryAllFailed()
    const pending = getPendingItems()
    expect(pending).toHaveLength(1)
    expect(pending[0].id).toBe(op2.id)
  })

  it('getSyncStatus returns correct counts', () => {
    enqueueOperation({ type: 'create', entity: 'post', entityId: 'p1', data: {} })
    enqueueOperation({ type: 'update', entity: 'post', entityId: 'p2', data: {} })
    const sync = getSyncStatus()
    expect(sync.queueLength).toBe(2)
    expect(sync.pendingCount).toBe(2)
    expect(sync.failedCount).toBe(0)
    expect(sync.confirmedCount).toBe(0)
  })

  it('clearConfirmed removes confirmed items', () => {
    const op = enqueueOperation({ type: 'create', entity: 'post', entityId: 'p1', data: {} })
    markConfirmed(op.id)
    clearConfirmed()
    expect(getSyncStatus().queueLength).toBe(0)
  })

  it('cleanupOldOperations removes old confirmed items', () => {
    const op = enqueueOperation({ type: 'create', entity: 'post', entityId: 'p1', data: {} })
    markConfirmed(op.id)
    const oldDate = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
    const stored = JSON.parse(localStorage.getItem('zafiro_offline_queue') || '[]')
    stored[0].confirmedAt = oldDate
    localStorage.setItem('zafiro_offline_queue', JSON.stringify(stored))
    cleanupOldOperations(30)
    expect(getSyncStatus().queueLength).toBe(0)
  })

  it('detectConflicts returns true when versions differ', () => {
    expect(detectConflicts('post', 'p1', 1, 2)).toBe(true)
    expect(detectConflicts('post', 'p1', 1, 1)).toBe(false)
  })

  it('getItemsByEntity filters correctly', () => {
    enqueueOperation({ type: 'create', entity: 'post', entityId: 'p1', data: {} })
    enqueueOperation({ type: 'create', entity: 'message', entityId: 'm1', data: {} })
    const items = getItemsByEntity('post', 'p1')
    expect(items).toHaveLength(1)
    expect(items[0].entity).toBe('post')
  })
})

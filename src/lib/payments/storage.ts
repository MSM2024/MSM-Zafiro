import type { PaymentMethod } from './config'

export type PaymentStatus = 'PENDING' | 'CONFIRMED' | 'VERIFIED' | 'EXPIRED'

export interface PaymentRecord {
  id: string
  method: PaymentMethod
  amount?: string
  transactionHash?: string
  status: PaymentStatus
  createdAt: string
  confirmedAt?: string
  notes?: string
}

const STORAGE_KEY = 'zafiro_payment_history'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function getPaymentHistory(): PaymentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function savePaymentRecord(record: Omit<PaymentRecord, 'id' | 'createdAt' | 'status'>): PaymentRecord {
  const newRecord: PaymentRecord = {
    ...record,
    id: generateId(),
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  }

  const history = getPaymentHistory()
  history.push(newRecord)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  return newRecord
}

export function confirmPayment(id: string, transactionHash?: string): PaymentRecord | null {
  const history = getPaymentHistory()
  const index = history.findIndex(r => r.id === id)
  if (index === -1) return null

  history[index] = {
    ...history[index],
    status: 'CONFIRMED',
    confirmedAt: new Date().toISOString(),
    transactionHash: transactionHash || history[index].transactionHash,
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  return history[index]
}

export function verifyPayment(id: string): PaymentRecord | null {
  const history = getPaymentHistory()
  const index = history.findIndex(r => r.id === id)
  if (index === -1) return null

  history[index].status = 'VERIFIED'
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  return history[index]
}

export function getLastPayment(method?: PaymentMethod): PaymentRecord | undefined {
  const history = getPaymentHistory()
  const filtered = method ? history.filter(r => r.method === method) : history
  return filtered[filtered.length - 1]
}

export function clearExpiredPayments(): void {
  const history = getPaymentHistory()
  const now = Date.now()
  const kept = history.filter(r => {
    if (r.status === 'PENDING') {
      const age = now - new Date(r.createdAt).getTime()
      return age < 86400000
    }
    return true
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(kept))
}

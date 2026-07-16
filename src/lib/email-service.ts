'use client'

const OUTBOX_KEY = 'zafiro_email_outbox'

export interface EmailMessage {
  id: string
  to: string
  subject: string
  body: string
  sentAt: string
  read: boolean
  type: 'recovery' | 'welcome' | 'rating_request' | 'rating_receipt' | 'quality_report'
  metadata?: Record<string, string>
}

export function sendEmail(to: string, subject: string, body: string, type: EmailMessage['type'] = 'recovery', metadata?: Record<string, string>): EmailMessage {
  const outbox = getOutbox()
  const email: EmailMessage = {
    id: `email_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    to,
    subject,
    body,
    sentAt: new Date().toISOString(),
    read: false,
    type,
    metadata,
  }
  outbox.push(email)
  localStorage.setItem(OUTBOX_KEY, JSON.stringify(outbox))
  return email
}

export function getOutbox(): EmailMessage[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]') } catch { return [] }
}

export function markAsRead(id: string): void {
  const outbox = getOutbox()
  const found = outbox.find(e => e.id === id)
  if (found) { found.read = true; localStorage.setItem(OUTBOX_KEY, JSON.stringify(outbox)) }
}

export function getEmailsByType(type: EmailMessage['type']): EmailMessage[] {
  return getOutbox().filter(e => e.type === type)
}

export function clearOutbox(): void {
  localStorage.removeItem(OUTBOX_KEY)
}

// Cortafuegos OWNER — STORE_ONLY para entrenamiento del propietario
// Frecuencia 369

import { isOwnerEmail } from '@/lib/owner'
import { getSession } from '@/lib/auth'
import { classifyIntent, type Intent } from './intent-classifier'
import { recordOwnerAudit } from '@/lib/owner'

const STORE_KEY = 'zafiro_owner_training_store'

export interface StoredTraining {
  id: string
  type: Intent
  content: string
  receivedAt: string
  processed: boolean
}

export function isOwnerSession(): boolean {
  const session = getSession()
  return !!session && isOwnerEmail(session.email)
}

export function evaluateOwnerMessage(message: string): {
  blocked: boolean
  intent: Intent
  response?: string
} {
  if (!isOwnerSession()) {
    return { blocked: false, intent: 'chat_normal' }
  }

  const intent = classifyIntent(message, true)

  // Training content → STORE_ONLY
  if (intent === 'training_json' || intent === 'training_code' || intent === 'training_link') {
    storeTraining(intent, message)
    recordOwnerAudit('TRAINING_STORED', { intent, length: message.length })
    return {
      blocked: true,
      intent,
      response: '✅ Entrenamiento almacenado. No se procesará como respuesta pública.',
    }
  }

  // Financial query → confirm only
  if (intent === 'financial') {
    return {
      blocked: true,
      intent,
      response: '⚠️ Las operaciones financieras requieren autorización humana directa. No puedo ejecutar esta solicitud sin confirmación explícita.',
    }
  }

  return { blocked: false, intent }
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function storeTraining(type: Intent, content: string): void {
  if (typeof window === 'undefined') return
  const stored: StoredTraining[] = JSON.parse(localStorage.getItem(STORE_KEY) || '[]')
  stored.push({
    id: generateId(),
    type,
    content: content.slice(0, 5000), // cap at 5k chars
    receivedAt: new Date().toISOString(),
    processed: false,
  })
  // Keep last 100 entries
  if (stored.length > 100) stored.splice(0, stored.length - 100)
  localStorage.setItem(STORE_KEY, JSON.stringify(stored))
}

export function getStoredTraining(): StoredTraining[] {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem(STORE_KEY) || '[]')
}

export function markTrainingProcessed(id: string): void {
  if (typeof window === 'undefined') return
  const stored = getStoredTraining()
  const entry = stored.find(s => s.id === id)
  if (entry) {
    entry.processed = true
    localStorage.setItem(STORE_KEY, JSON.stringify(stored))
  }
}

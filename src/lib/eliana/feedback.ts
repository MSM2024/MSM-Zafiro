// Sistema de Feedback — Me gusta, Mejorar, Copiar, Escuchar, Enviar
// Frecuencia 369

const FEEDBACK_KEY = 'zafiro_eliana_feedback'
const RULES_KEY = 'zafiro_eliana_rules'

export type FeedbackAction = 'like' | 'improve' | 'copy' | 'listen' | 'send'

export interface FeedbackEntry {
  id: string
  messageId: string
  action: FeedbackAction
  messageText: string
  responseText: string
  timestamp: string
  comment?: string
}

export interface ActiveRule {
  id: string
  pattern: string
  rule: string
  source: 'feedback' | 'error' | 'manual'
  active: boolean
  createdAt: string
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function loadFeedback(): FeedbackEntry[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]')
  } catch {
    return []
  }
}

function saveFeedback(feedback: FeedbackEntry[]): void {
  if (typeof window === 'undefined') return
  if (feedback.length > 1000) feedback.splice(0, feedback.length - 1000)
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback))
}

function loadRules(): ActiveRule[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(RULES_KEY) || '[]')
  } catch {
    return []
  }
}

function saveRules(rules: ActiveRule[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(RULES_KEY, JSON.stringify(rules))
}

export function recordFeedback(
  messageId: string,
  action: FeedbackAction,
  messageText: string,
  responseText: string,
  comment?: string
): void {
  const entry: FeedbackEntry = {
    id: generateId(),
    messageId,
    action,
    messageText: messageText.slice(0, 500),
    responseText: responseText.slice(0, 500),
    timestamp: new Date().toISOString(),
    comment,
  }

  const feedback = loadFeedback()
  feedback.push(entry)
  saveFeedback(feedback)

  // Convert error feedback to active rules
  if (action === 'improve' && comment) {
    addRuleFromFeedback(comment)
  }
}

function addRuleFromFeedback(comment: string): void {
  const lower = comment.toLowerCase()

  // Detect patterns in feedback comments and create rules
  const patterns: Array<{ trigger: string; rule: string }> = [
    { trigger: 'no entendí', rule: 'Si el usuario indica que no entendió, reformular con lenguaje más simple.' },
    { trigger: 'no era lo que pregunté', rule: 'Verificar que la respuesta corresponda exactamente a la pregunta.' },
    { trigger: 'demasiado largo', rule: 'Respuestas concisas de máximo 3 párrafos.' },
    { trigger: 'no funciona', rule: 'Cuando algo no funciona, ofrecer alternativas y escalar si es necesario.' },
    { trigger: 'error', rule: 'Ante reportes de error, verificar el estado del sistema antes de responder.' },
  ]

  for (const p of patterns) {
    if (lower.includes(p.trigger)) {
      const existing = loadRules()
      if (!existing.some(r => r.rule === p.rule)) {
        existing.push({
          id: generateId(),
          pattern: p.trigger,
          rule: p.rule,
          source: 'feedback',
          active: true,
          createdAt: new Date().toISOString(),
        })
        saveRules(existing)
      }
    }
  }
}

export function getFeedbackStats(): { total: number; likes: number; improve: number } {
  const feedback = loadFeedback()
  return {
    total: feedback.length,
    likes: feedback.filter(f => f.action === 'like').length,
    improve: feedback.filter(f => f.action === 'improve').length,
  }
}

export function getRecentFeedback(limit = 20): FeedbackEntry[] {
  return loadFeedback().reverse().slice(0, limit)
}

export function getActiveRules(): ActiveRule[] {
  return loadRules().filter(r => r.active)
}

export function addManualRule(pattern: string, rule: string): void {
  const rules = loadRules()
  rules.push({
    id: generateId(),
    pattern,
    rule,
    source: 'manual',
    active: true,
    createdAt: new Date().toISOString(),
  })
  saveRules(rules)
}

export function toggleRule(id: string): void {
  const rules = loadRules()
  const rule = rules.find(r => r.id === id)
  if (rule) {
    rule.active = !rule.active
    saveRules(rules)
  }
}

export function getRulesContext(): string {
  const rules = getActiveRules()
  if (rules.length === 0) return ''
  return rules.map(r => `- Regla: ${r.rule} (fuente: ${r.source})`).join('\n')
}

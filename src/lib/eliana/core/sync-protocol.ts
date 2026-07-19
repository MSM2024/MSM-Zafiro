// Sync Protocol — Flujo de 7 pasos para la programación centralizada de IA
// Frecuencia 369
// Don Miguel define → ELIANA clasifica → OpenCode/Codex implementa → ZAFIRO guarda → IA consultan → feedback → consolida

import { addRule, updateRule, type CentralRule, type RuleSource, type RuleScope } from './rules-engine'
import { recordAction, updateAgentStatus, type AgentId } from './agent-registry'
import { classifyIntent } from '../intent-classifier'

export type SyncStep =
  | '01_don_miguel'     // Define visión, regla o corrección
  | '02_eliana_clasifica' // Clasifica la instrucción
  | '03_implementa'       // OpenCode/Codex convierte en código, estructura o migración
  | '04_zafiro_guarda'    // ZAFIRO guarda en conocimiento central versionado
  | '05_ia_consultan'     // Todas las IA autorizadas consultan la regla activa
  | '06_feedback'         // Cada respuesta genera feedback, auditoría y aprendizaje
  | '07_consolida'        // ELIANA consolida el aprendizaje y evita repetir errores

export interface SyncEvent {
  id: string
  step: SyncStep
  description: string
  agentId: AgentId
  timestamp: string
  status: 'in_progress' | 'completed' | 'failed'
  details?: string
  ruleId?: string
}

const SYNC_KEY = 'zafiro_core_sync_events'

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function loadEvents(): SyncEvent[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(SYNC_KEY) || '[]')
  } catch {
    return []
  }
}

function saveEvents(events: SyncEvent[]): void {
  if (typeof window === 'undefined') return
  if (events.length > 1000) events.splice(0, events.length - 1000)
  localStorage.setItem(SYNC_KEY, JSON.stringify(events))
}

function createEvent(step: SyncStep, description: string, agentId: AgentId, ruleId?: string): SyncEvent {
  return {
    id: generateId(),
    step,
    description,
    agentId,
    timestamp: new Date().toISOString(),
    status: 'completed',
    ruleId,
  }
}

export function executeSyncFlow(
  instruction: string,
  source: RuleSource,
  agentId: AgentId
): { success: boolean; rule?: CentralRule; events: SyncEvent[] } {
  const events: SyncEvent[] = []

  // Step 1: Don Miguel define
  events.push(createEvent('01_don_miguel', `Instrucción recibida: "${instruction.slice(0, 100)}..."`, agentId))

  // Step 2: ELIANA clasifica
  const isOwner = true // Sync flow only triggered by owner
  const intent = classifyIntent(instruction, isOwner)
  events.push(createEvent('02_eliana_clasifica', `Intención detectada: ${intent}`, 'eliana'))

  if (intent === 'training_json' || intent === 'training_code' || intent === 'training_link') {
    // Step 3: Implementa
    const scope: RuleScope[] = ['all_agents']
    const rule = addRule(`Corrección: ${instruction.slice(0, 50)}...`, instruction, source, scope, [intent])
    events.push(createEvent('03_implementa', `Regla creada: ${rule.id} v${rule.version}`, agentId, rule.id))

    // Step 4: ZAFIRO guarda
    events.push(createEvent('04_zafiro_guarda', `Regla ${rule.id} guardada en base central`, 'eliana', rule.id))

    // Record action
    recordAction(agentId, 'sync_flow', instruction, `Regla ${rule.id} creada`, intent, true, `Nueva regla: ${rule.rule.slice(0, 100)}`)

    events.push(createEvent('05_ia_consultan', `Regla ${rule.id} disponible para todos los agentes`, 'eliana', rule.id))
    events.push(createEvent('06_feedback', 'Pendiente de feedback del usuario', 'eliana', rule.id))
    events.push(createEvent('07_consolida', `Regla ${rule.id} consolidada en base central`, 'eliana', rule.id))

    return { success: true, rule, events }
  }

  // Non-training instruction
  recordAction(agentId, 'sync_flow_received', instruction, 'Clasificado como: ' + intent, intent, true)
  events.push(createEvent('03_implementa', `Instrucción clasificada como "${intent}" — requiere implementación manual`, agentId))
  events.push(createEvent('07_consolida', `Flujo completado para instrucción de tipo ${intent}`, agentId))

  return { success: true, events }
}

export function getSyncHistory(limit = 20): SyncEvent[] {
  return loadEvents().reverse().slice(0, limit)
}

export function getSyncSummary(): string {
  const events = loadEvents()
  const byStep: Record<string, number> = {}
  for (const e of events) {
    byStep[e.step] = (byStep[e.step] || 0) + 1
  }
  const steps = Object.entries(byStep)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([step, count]) => `  ${step}: ${count} eventos`)
    .join('\n')
  return `🔄 ${events.length} eventos de sincronización\n${steps}`
}

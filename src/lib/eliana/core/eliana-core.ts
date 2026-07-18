// ELIANA CORE v1.1.0 — Orquestador Central con Response Router
// Frecuencia 369

import { getActiveRulesForAgent, formatRulesForPrompt, getRulesSummary } from './rules-engine'
import { getAgents, getAgent, recordAction, getAgentSummary, type AgentId } from './agent-registry'
import { executeSyncFlow, getSyncSummary } from './sync-protocol'
import { getDomainStatusSummary } from '../knowledge/knowledge-registry'
import { getFeedbackStats } from '../feedback'
import { formatLegalForPrompt } from '../../legal/terms-engine'
import { filterResponseText } from '../response-filter'
import { generateCorrelationId, createTraceStep, persistTrace } from '../correlation'
import { routeResponse, type RoutedResponse, type AnswerType } from './response-router'
import type { Intent } from '../intent-classifier'

export type { RoutedResponse, AnswerType }

export interface CoreQueryResult {
  text: string
  intent: Intent
  sources: string[]
  confidence: 'high' | 'medium' | 'low'
  provider: string
  model: string
  remesas: boolean
  knowledgeUsed: boolean
  rulesApplied: string[]
  correlationId: string
}

export interface CoreStatus {
  version: string
  lastSync: string
  rules: string
  agents: string
  sync: string
  domains: string
  feedback: string
  projects: string[]
  uptime: string
}

const CORE_VERSION = '1.1.0'
const CORE_STARTED = Date.now()
const PROJECTS = [
  'MSM MY STORE', 'ZAFIRO', 'ELIANA', 'CAJEROS MSM', 'MSM PAYMENTS',
  'MSM WALLET', 'MSM COINS', 'MENTE MAESTRA', 'LA SUIZA DE CUBA',
  'VILLA ESPERANZA', 'ALBUM DE LA VIDA', 'WHATSAPP BUSINESS', 'META AI',
]

export function getCoreStatus(): CoreStatus {
  const uptime = Math.floor((Date.now() - CORE_STARTED) / 1000)
  return {
    version: CORE_VERSION,
    lastSync: new Date().toISOString(),
    rules: getRulesSummary(),
    agents: getAgentSummary(),
    sync: getSyncSummary(),
    domains: getDomainStatusSummary(),
    feedback: `✅ ${getFeedbackStats().total} feedbacks | 👍 ${getFeedbackStats().likes} likes`,
    projects: PROJECTS,
    uptime: `${uptime}s`,
  }
}

export function processQuery(
  message: string,
  agentId: AgentId = 'eliana',
  session?: { email?: string },
): CoreQueryResult {
  const rules = getActiveRulesForAgent(agentId)
  const routed = routeResponse(message, session)

  const correlationId = routed.correlationId

  recordAction(agentId, 'process_query', message, routed.text.slice(0, 100), routed.intent, routed.confidence !== 'low')

  return {
    text: routed.text,
    intent: routed.intent,
    sources: routed.sources,
    confidence: routed.confidence,
    provider: routed.provider,
    model: routed.model,
    remesas: routed.intent === 'remesas',
    knowledgeUsed: routed.knowledgeUsed,
    rulesApplied: rules.map(r => r.id),
    correlationId,
  }
}

export function getProjectsStatus(): Array<{ name: string; status: string }> {
  return PROJECTS.map(name => ({ name, status: 'sincronizado' }))
}

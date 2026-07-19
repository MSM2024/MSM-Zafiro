// Agent Registry — Registro central de todas las IA conectadas al ecosistema
// Frecuencia 369
// Cada IA registra qué recibió, qué respondió, qué ejecutó y qué aprendió

export type AgentId = 'opencode' | 'codex' | 'eliana' | 'whatsapp' | 'meta' | 'chatgpt' | 'custom'

export interface AIAgent {
  id: AgentId
  name: string
  description: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync: string
  version: string
  capabilities: string[]
}

export interface AgentAction {
  id: string
  agentId: AgentId
  action: string
  input: string
  output: string
  intent: string
  timestamp: string
  duration: number
  success: boolean
  learning?: string
}

const AGENTS_KEY = 'zafiro_core_agents'
const ACTIONS_KEY = 'zafiro_core_actions'

const DEFAULT_AGENTS: AIAgent[] = [
  {
    id: 'opencode',
    name: 'OpenCode',
    description: 'Asistente principal de desarrollo — implementa código, estructura y migraciones',
    status: 'connected',
    lastSync: new Date().toISOString(),
    version: '1.0.0',
    capabilities: ['escribir_codigo', 'analizar_repositorio', 'crear_migraciones', 'auditar'],
  },
  {
    id: 'codex',
    name: 'Codex',
    description: 'Documentación y reglas del proyecto — mantiene AGENTS.md y documentación técnica',
    status: 'connected',
    lastSync: new Date().toISOString(),
    version: '1.0.0',
    capabilities: ['documentar', 'versionar_reglas', 'guiar_desarrollo'],
  },
  {
    id: 'eliana',
    name: 'ELIANA',
    description: 'Núcleo sintético de ZAFIRO — orquestadora central de conocimiento y respuestas',
    status: 'connected',
    lastSync: new Date().toISOString(),
    version: '1.0.0',
    capabilities: ['chat', 'conocimiento', 'intencion', 'firewall', 'feedback', 'rag'],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp AI',
    description: 'Asistente para WhatsApp Business — integración con webhook y API de Meta',
    status: 'disconnected',
    lastSync: '',
    version: '0.0.0',
    capabilities: ['mensajes', 'webhook', 'plantillas'],
  },
  {
    id: 'meta',
    name: 'Meta Business Agent',
    description: 'Agente de negocio para Meta — publicidad, engagement, automatización',
    status: 'disconnected',
    lastSync: '',
    version: '0.0.0',
    capabilities: ['publicidad', 'analytics', 'automation'],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT Custom GPT',
    description: 'Instancia personalizada de ChatGPT con conocimiento del ecosistema MSM',
    status: 'disconnected',
    lastSync: '',
    version: '0.0.0',
    capabilities: ['conversacion', 'conocimiento', 'plugins'],
  },
]

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function loadAgents(): AIAgent[] {
  if (typeof window === 'undefined') return DEFAULT_AGENTS
  try {
    const stored = JSON.parse(localStorage.getItem(AGENTS_KEY) || '[]') as AIAgent[]
    const merged = [...DEFAULT_AGENTS]
    for (const sa of stored) {
      const idx = merged.findIndex(da => da.id === sa.id)
      if (idx >= 0) merged[idx] = { ...merged[idx], ...sa, id: sa.id }
      else merged.push(sa)
    }
    return merged
  } catch {
    return DEFAULT_AGENTS
  }
}

function saveAgents(agents: AIAgent[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(AGENTS_KEY, JSON.stringify(agents))
}

function loadActions(): AgentAction[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(ACTIONS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveActions(actions: AgentAction[]): void {
  if (typeof window === 'undefined') return
  if (actions.length > 5000) actions.splice(0, actions.length - 5000)
  localStorage.setItem(ACTIONS_KEY, JSON.stringify(actions))
}

export function getAgents(): AIAgent[] {
  return loadAgents()
}

export function getAgent(id: AgentId): AIAgent | undefined {
  return loadAgents().find(a => a.id === id)
}

export function updateAgentStatus(id: AgentId, status: AIAgent['status']): void {
  const agents = loadAgents()
  const agent = agents.find(a => a.id === id)
  if (agent) {
    agent.status = status
    agent.lastSync = new Date().toISOString()
    saveAgents(agents)
  }
}

export function recordAction(
  agentId: AgentId,
  action: string,
  input: string,
  output: string,
  intent: string,
  success: boolean,
  learning?: string
): AgentAction {
  const record: AgentAction = {
    id: generateId(),
    agentId,
    action,
    input: input.slice(0, 500),
    output: output.slice(0, 500),
    intent,
    timestamp: new Date().toISOString(),
    duration: 0,
    success,
    learning,
  }
  const actions = loadActions()
  actions.push(record)
  saveActions(actions)

  // Update agent's last sync
  updateAgentStatus(agentId, 'connected')
  return record
}

export function getAgentActions(agentId: AgentId, limit = 20): AgentAction[] {
  return loadActions()
    .filter(a => a.agentId === agentId)
    .reverse()
    .slice(0, limit)
}

export function getAllActions(limit = 50): AgentAction[] {
  return loadActions().reverse().slice(0, limit)
}

export function getAgentSummary(): string {
  const agents = getAgents()
  const connected = agents.filter(a => a.status === 'connected').length
  const total = agents.length
  const actions = loadActions()
  return `🤖 ${connected}/${total} agentes conectados | 📝 ${actions.length} acciones registradas`
}

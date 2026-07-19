// Rules Engine Central — Fuente única de verdad para todas las IA del ecosistema
// Frecuencia 369-777
// Toda regla es versionada, auditada, y consultable por OpenCode, Codex, WhatsApp, Meta y futuras integraciones

export type RuleSource = 'don_miguel' | 'feedback' | 'codex' | 'system' | 'audit'
export type RuleScope = 'all_agents' | 'opencode' | 'codex' | 'eliana' | 'whatsapp' | 'meta'
export type RuleStatus = 'active' | 'pending_validation' | 'archived' | 'draft'

export interface CentralRule {
  id: string
  version: number
  title: string
  rule: string
  source: RuleSource
  scope: RuleScope[]
  status: RuleStatus
  createdAt: string
  updatedAt: string
  supersedes?: string
  tags: string[]
}

const RULES_KEY = 'zafiro_central_rules'

// Reglas fundacionales — se siembran al iniciar
const FOUNDATIONAL_RULES: CentralRule[] = [
  {
    id: 'core-001',
    version: 1,
    title: 'Regla Madre — No genérico',
    rule: 'ELIANA no debe responder con frases genéricas repetidas como "refine su pregunta" cuando exista información disponible. Debe buscar, comprender y responder directamente.',
    source: 'don_miguel',
    scope: ['all_agents'],
    status: 'active',
    createdAt: '2026-07-17T00:00:00.000Z',
    updatedAt: '2026-07-17T00:00:00.000Z',
    tags: ['madre', 'generico', 'calidad'],
  },
  {
    id: 'core-002',
    version: 1,
    title: 'STORE_ONLY — Entrenamiento del propietario',
    rule: 'Cuando Don Miguel envía JSON, código, plantillas o enlaces de entrenamiento, las IA deben almacenar sin procesar como respuesta pública. Responder solo: "✅ Almacenado. Entrenamiento recibido."',
    source: 'don_miguel',
    scope: ['all_agents'],
    status: 'active',
    createdAt: '2026-07-17T00:00:00.000Z',
    updatedAt: '2026-07-17T00:00:00.000Z',
    tags: ['owner', 'store_only', 'seguridad'],
  },
  {
    id: 'core-003',
    version: 1,
    title: 'No inventar datos del sistema',
    rule: 'Ninguna IA debe inventar datos técnicos, tasas, saldos, inventarios ni estados del sistema. Si no tiene acceso al dato exacto, debe indicarlo claramente y ofrecer alternativas.',
    source: 'don_miguel',
    scope: ['all_agents'],
    status: 'active',
    createdAt: '2026-07-17T00:00:00.000Z',
    updatedAt: '2026-07-17T00:00:00.000Z',
    tags: ['veracidad', 'datos', 'precision'],
  },
  {
    id: 'core-004',
    version: 1,
    title: 'Remesas — Protocolo obligatorio',
    rule: 'Cuando el usuario escriba "Remesas", la IA debe explicar servicios disponibles y solicitar: moneda, cantidad, origen, destino, método y receptor. Nunca responder con mensaje vacío de refinamiento.',
    source: 'don_miguel',
    scope: ['all_agents'],
    status: 'active',
    createdAt: '2026-07-17T00:00:00.000Z',
    updatedAt: '2026-07-17T00:00:00.000Z',
    tags: ['remesas', 'protocolo', 'servicio'],
  },
  {
    id: 'core-005',
    version: 1,
    title: 'Auditoría obligatoria',
    rule: 'Toda acción de IA debe ser registrada: qué recibió, qué respondió, qué ejecutó y qué aprendió. El log debe incluir timestamp, agente, intención y resultado.',
    source: 'system',
    scope: ['all_agents'],
    status: 'active',
    createdAt: '2026-07-17T00:00:00.000Z',
    updatedAt: '2026-07-17T00:00:00.000Z',
    tags: ['auditoria', 'log', 'transparencia'],
  },
  {
    id: 'core-006',
    version: 1,
    title: 'Correcciones → Reglas activas',
    rule: 'Las correcciones de Don Miguel se convierten en reglas activas después de validación. El feedback "Mejorar" con comentario genera automáticamente una regla pendiente de validación.',
    source: 'don_miguel',
    scope: ['all_agents'],
    status: 'active',
    createdAt: '2026-07-17T00:00:00.000Z',
    updatedAt: '2026-07-17T00:00:00.000Z',
    tags: ['aprendizaje', 'feedback', 'reglas'],
  },
  {
    id: 'core-007',
    version: 1,
    title: 'Fuente única de reglas',
    rule: 'Todas las IA conectadas al ecosistema MSM deben leer reglas desde la fuente central versionada (ELIANA_CORE). Ninguna IA debe tener reglas sueltas, duplicadas o sin control de versión.',
    source: 'system',
    scope: ['all_agents'],
    status: 'active',
    createdAt: '2026-07-17T00:00:00.000Z',
    updatedAt: '2026-07-17T00:00:00.000Z',
    tags: ['centralizacion', 'reglas', 'versionado'],
  },
  {
    id: 'core-008',
    version: 1,
    title: 'Sincronización 369',
    rule: 'Ningún cambio se declara sincronizado hasta que tenga: persistencia en base central, pruebas de funcionamiento, y verificación real por el propietario o su delegado autorizado.',
    source: 'system',
    scope: ['all_agents'],
    status: 'active',
    createdAt: '2026-07-17T00:00:00.000Z',
    updatedAt: '2026-07-17T00:00:00.000Z',
    tags: ['sincronizacion', '369', 'verificacion'],
  },
  {
    id: 'core-009',
    version: 1,
    title: '777 — Sello simbólico',
    rule: '777 es un sello simbólico de auditoría, excelencia y verificación. No sustituye seguridad técnica, legal, criptografía ni pruebas reales. Solo identifica eventos importantes del ecosistema ZAFIRO.',
    source: 'system',
    scope: ['all_agents'],
    status: 'active',
    createdAt: '2026-07-17T00:00:00.000Z',
    updatedAt: '2026-07-17T00:00:00.000Z',
    tags: ['777', 'sello', 'simbolico'],
  },
]

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function loadRules(): CentralRule[] {
  if (typeof window === 'undefined') return FOUNDATIONAL_RULES
  try {
    const stored = JSON.parse(localStorage.getItem(RULES_KEY) || '[]') as CentralRule[]
    // Merge with foundational rules (foundational always exist)
    const merged = [...FOUNDATIONAL_RULES]
    for (const sr of stored) {
      const existingIdx = merged.findIndex(fr => fr.id === sr.id)
      if (existingIdx >= 0) {
        merged[existingIdx] = sr // stored version wins (may have updates)
      } else {
        merged.push(sr)
      }
    }
    return merged
  } catch {
    return FOUNDATIONAL_RULES
  }
}

function saveRules(rules: CentralRule[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(RULES_KEY, JSON.stringify(rules))
}

export function getActiveRulesForAgent(agentId: string): CentralRule[] {
  const all = loadRules()
  return all.filter(r => r.status === 'active' && (r.scope.includes('all_agents') || r.scope.includes(agentId as RuleScope)))
}

export function getAllRules(): CentralRule[] {
  return loadRules()
}

export function addRule(
  title: string,
  rule: string,
  source: RuleSource,
  scope: RuleScope[] = ['all_agents'],
  tags: string[] = []
): CentralRule {
  const all = loadRules()
  const newRule: CentralRule = {
    id: `rule-${generateId().slice(0, 8)}`,
    version: 1,
    title,
    rule,
    source,
    scope,
    status: source === 'don_miguel' ? 'active' : 'pending_validation',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags,
  }
  all.push(newRule)
  saveRules(all)
  return newRule
}

export function updateRule(id: string, updates: Partial<CentralRule>): CentralRule | null {
  const all = loadRules()
  const idx = all.findIndex(r => r.id === id)
  if (idx < 0) return null
  all[idx] = { ...all[idx], ...updates, version: all[idx].version + 1, updatedAt: new Date().toISOString() }
  saveRules(all)
  return all[idx]
}

export function formatRulesForPrompt(agentId: string): string {
  const rules = getActiveRulesForAgent(agentId)
  if (rules.length === 0) return ''
  return rules.map(r => `[${r.id} v${r.version}] ${r.rule}`).join('\n')
}

export function getRulesSummary(): string {
  const all = loadRules()
  const active = all.filter(r => r.status === 'active')
  const pending = all.filter(r => r.status === 'pending_validation')
  return `📋 ${all.length} reglas totales | ✅ ${active.length} activas | ⏳ ${pending.length} pendientes`
}

export function getRuleById(id: string): CentralRule | undefined {
  return loadRules().find(r => r.id === id)
}

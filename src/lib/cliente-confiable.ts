export type TrustLevel = 'BASIC' | 'VERIFIED' | 'TRUSTED' | 'VIP' | 'RESTRICTED'

export interface ClienteConfiable {
  id: string
  name: string
  phone: string
  email: string
  country: string
  trustLevel: TrustLevel
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  documentNumber?: string
  documentType?: 'CC' | 'PASSPORT' | 'OTHER'
  operationCount: number
  totalVolumeUsd: number
  consentGranted: boolean
  consentDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface MemoriaEternaEntry {
  id: string
  clientId: string
  type: 'operation' | 'note' | 'contact' | 'risk_update' | 'level_change' | 'consent'
  description: string
  date: string
  metadata?: Record<string, string>
}

const CLIENTS_KEY = 'zafiro_trusted_clients'
const MEMORIA_KEY = 'zafiro_memoria_eterna'

function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback } catch { return fallback }
}

function lsSet<T>(key: string, data: T): void { localStorage.setItem(key, JSON.stringify(data)) }

export function getClients(): ClienteConfiable[] {
  return lsGet<ClienteConfiable[]>(CLIENTS_KEY, [])
}

export function addClient(c: ClienteConfiable): void {
  const list = getClients()
  list.push(c)
  lsSet(CLIENTS_KEY, list)
  addMemoriaEntry(c.id, { type: 'consent', description: `Cliente creado: ${c.name} — Nivel: ${c.trustLevel}` })
}

export function updateClientLevel(id: string, level: TrustLevel): void {
  const list = getClients()
  const c = list.find(x => x.id === id)
  if (c) {
    const prev = c.trustLevel
    c.trustLevel = level
    c.updatedAt = new Date().toISOString()
    lsSet(CLIENTS_KEY, list)
    addMemoriaEntry(id, { type: 'level_change', description: `Nivel cambiado: ${prev} → ${level}` })
  }
}

export function updateClientRisk(id: string, risk: 'LOW' | 'MEDIUM' | 'HIGH'): void {
  const list = getClients()
  const c = list.find(x => x.id === id)
  if (c) {
    const prev = c.riskLevel
    c.riskLevel = risk
    c.updatedAt = new Date().toISOString()
    lsSet(CLIENTS_KEY, list)
    addMemoriaEntry(id, { type: 'risk_update', description: `Riesgo actualizado: ${prev} → ${risk}` })
  }
}

export function getMemoriaEntries(clientId: string): MemoriaEternaEntry[] {
  const all = lsGet<MemoriaEternaEntry[]>(MEMORIA_KEY, [])
  return all.filter(e => e.clientId === clientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function addMemoriaEntry(clientId: string, data: Partial<MemoriaEternaEntry>): void {
  const all = lsGet<MemoriaEternaEntry[]>(MEMORIA_KEY, [])
  all.push({
    id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    clientId,
    type: data.type || 'note',
    description: data.description || '',
    date: new Date().toISOString(),
    metadata: data.metadata,
  })
  if (all.length > 500) all.splice(0, all.length - 500)
  lsSet(MEMORIA_KEY, all)
}

export function deleteMemoriaEntry(id: string): void {
  const all = lsGet<MemoriaEternaEntry[]>(MEMORIA_KEY, [])
  lsSet(MEMORIA_KEY, all.filter(e => e.id !== id))
}

export function exportClientData(id: string): ClienteConfiable | null {
  const client = getClients().find(c => c.id === id)
  if (!client) return null
  return client
}

export function getClientStats() {
  const clients = getClients()
  return {
    total: clients.length,
    basic: clients.filter(c => c.trustLevel === 'BASIC').length,
    verified: clients.filter(c => c.trustLevel === 'VERIFIED').length,
    trusted: clients.filter(c => c.trustLevel === 'TRUSTED').length,
    vip: clients.filter(c => c.trustLevel === 'VIP').length,
    restricted: clients.filter(c => c.trustLevel === 'RESTRICTED').length,
    highRisk: clients.filter(c => c.riskLevel === 'HIGH').length,
    consentPct: clients.length > 0 ? Math.round((clients.filter(c => c.consentGranted).length / clients.length) * 100) : 0,
  }
}

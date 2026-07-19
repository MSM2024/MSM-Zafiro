export type FundingSource = 'donation' | 'investment' | 'sponsorship' | 'commitment' | 'internal'
export type FundingStatus = 'confirmed' | 'pending' | 'cancelled' | 'disputed'

export interface FundingCampaign {
  id: string
  name: string
  description: string
  goalUsd: number
  raisedUsd: number
  startDate: string
  endDate?: string
  status: 'active' | 'paused' | 'completed' | 'cancelled'
}

export interface FundingContribution {
  id: string
  campaignId: string
  donorName: string
  amountUsd: number
  currency: 'USD' | 'PTS' | 'Crypto' | 'Other'
  source: FundingSource
  status: FundingStatus
  date: string
  verifiedAt?: string
  verifiedBy?: string
  receiptUrl?: string
  notes?: string
}

export interface FundingExpense {
  id: string
  description: string
  amountUsd: number
  phaseId: string
  category: string
  receiptUrl: string
  approvedBy: string
  date: string
  notes?: string
}

export interface FundingAllocation {
  id: string
  phaseId: string
  amountUsd: number
  description: string
  date: string
}

const STORAGE_KEYS = {
  campaigns: 'zafiro_funding_campaigns',
  contributions: 'zafiro_funding_contributions',
  expenses: 'zafiro_funding_expenses',
  allocations: 'zafiro_funding_allocations',
  audit: 'zafiro_funding_audit',
}

function getStore<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : fallback
}

function setStore<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data))
}

interface AuditEntry { id: string; action: string; detail: string; userId?: string; timestamp: string }

function audit(action: string, detail: string, userId?: string): void {
  const log = getStore<AuditEntry[]>(STORAGE_KEYS.audit, [])
  log.push({ id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, action, detail, userId, timestamp: new Date().toISOString() })
  if (log.length > 1000) log.splice(0, log.length - 1000)
  setStore(STORAGE_KEYS.audit, log)
}

const DEFAULT_CAMPAIGNS: FundingCampaign[] = [
  { id: 'camp-villa', name: 'Villa Esperanza — Fondo General', description: 'Fondo principal para la construcción del hospital holístico.', goalUsd: 5000000, raisedUsd: 0, startDate: '2026-07-01', status: 'active' },
  { id: 'camp-villa-azul', name: 'Villa Azul', description: 'Construcción de la villa principal con piscina infinita.', goalUsd: 1500000, raisedUsd: 0, startDate: '2026-07-01', status: 'active' },
  { id: 'camp-cabanas', name: 'Cabañas de Lujo', description: 'Construcción de 10 cabañas de lujo.', goalUsd: 1200000, raisedUsd: 0, startDate: '2026-07-01', status: 'active' },
  { id: 'camp-santuario', name: 'Santuario Sagrado', description: 'Espacio espiritual y meditación.', goalUsd: 800000, raisedUsd: 0, startDate: '2026-07-01', status: 'active' },
]

export function getCampaigns(): FundingCampaign[] {
  const stored = getStore<FundingCampaign[]>(STORAGE_KEYS.campaigns, [])
  if (stored.length === 0) {
    setStore(STORAGE_KEYS.campaigns, DEFAULT_CAMPAIGNS)
    return DEFAULT_CAMPAIGNS
  }
  return stored
}

export function getContributions(): FundingContribution[] {
  return getStore<FundingContribution[]>(STORAGE_KEYS.contributions, [])
}

export function addContribution(c: FundingContribution): void {
  const list = getContributions()
  list.push(c)
  setStore(STORAGE_KEYS.contributions, list)
  recalcCampaign(c.campaignId)
  audit('contribution.add', `${c.donorName} — $${c.amountUsd} ${c.source}`, c.verifiedBy)
}

function recalcCampaign(campaignId: string): void {
  const campaigns = getCampaigns()
  const contributions = getContributions()
  const camp = campaigns.find(c => c.id === campaignId)
  if (camp) {
    camp.raisedUsd = contributions.filter(c => c.campaignId === campaignId && c.status === 'confirmed').reduce((s, c) => s + c.amountUsd, 0)
    setStore(STORAGE_KEYS.campaigns, campaigns)
  }
}

export function verifyContribution(id: string, verifiedBy: string): void {
  const list = getContributions()
  const c = list.find(c => c.id === id)
  if (c) {
    c.status = 'confirmed'
    c.verifiedAt = new Date().toISOString()
    c.verifiedBy = verifiedBy
    setStore(STORAGE_KEYS.contributions, list)
    recalcCampaign(c.campaignId)
    audit('contribution.verify', `${c.donorName} — $${c.amountUsd} verificada por ${verifiedBy}`, verifiedBy)
  }
}

export function getExpenses(): FundingExpense[] {
  return getStore<FundingExpense[]>(STORAGE_KEYS.expenses, [])
}

export function addExpense(e: FundingExpense): void {
  const list = getExpenses()
  list.push(e)
  setStore(STORAGE_KEYS.expenses, list)
  audit('expense.add', `${e.description} — $${e.amountUsd}`, e.approvedBy)
}

export function getAllocations(): FundingAllocation[] {
  return getStore<FundingAllocation[]>(STORAGE_KEYS.allocations, [])
}

export function getAuditLog(): AuditEntry[] {
  return getStore<AuditEntry[]>(STORAGE_KEYS.audit, [])
}

export function getFinancialSummary() {
  const campaigns = getCampaigns()
  const contributions = getContributions()
  const expenses = getExpenses()

  const totalGoal = campaigns.reduce((s, c) => s + c.goalUsd, 0)
  const totalRaised = contributions.filter(c => c.status === 'confirmed').reduce((s, c) => s + c.amountUsd, 0)
  const totalPending = contributions.filter(c => c.status === 'pending').reduce((s, c) => s + c.amountUsd, 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.amountUsd, 0)
  const totalAllocated = getStore<FundingAllocation[]>(STORAGE_KEYS.allocations, []).reduce((s, a) => s + a.amountUsd, 0)

  return {
    totalGoal,
    totalRaised,
    totalPending,
    totalExpenses,
    totalAllocated,
    available: totalRaised - totalExpenses,
    donorCount: new Set(contributions.filter(c => c.status === 'confirmed').map(c => c.donorName)).size,
    campaignCount: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
  }
}

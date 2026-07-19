// Memberships — Sistema de membresías persistido
// Frecuencia 369
// Regla madre: ninguna membresía se considera activa por UI o mensaje de IA
// Solo después de webhook Stripe verificado + actualización en base de datos

import { getPlanById, type Plan } from './plans'

export type MembershipStatus = 'NONE' | 'PENDING_PAYMENT' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED' | 'LIFETIME'
export type BillingInterval = 'month' | 'annual' | 'lifetime'

export interface UserMembership {
  id: string
  profileId: string
  planId: string
  status: MembershipStatus
  billingInterval: BillingInterval
  currentPeriodStart: string
  currentPeriodEnd: string | null
  canceledAt: string | null
  activatedByWebhookAt: string | null
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  createdAt: string
  updatedAt: string
}

export interface MembershipEvent {
  id: string
  profileId: string
  eventType: string
  eventData: Record<string, unknown>
  source: 'stripe_webhook' | 'api' | 'admin' | 'frontend' | 'system'
  stripeEventId: string | null
  idempotencyKey: string | null
  createdAt: string
}

const MEMBERSHIPS_KEY = 'zafiro_user_memberships'
const EVENTS_KEY = 'zafiro_membership_events'
const CUSTOMERS_KEY = 'zafiro_stripe_customers'

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function loadMemberships(): UserMembership[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(MEMBERSHIPS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveMemberships(memberships: UserMembership[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(MEMBERSHIPS_KEY, JSON.stringify(memberships))
}

function loadEvents(): MembershipEvent[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveEvents(events: MembershipEvent[]): void {
  if (typeof window === 'undefined') return
  if (events.length > 5000) events.splice(0, events.length - 5000)
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
}

function recordEvent(
  profileId: string,
  eventType: string,
  eventData: Record<string, unknown>,
  source: MembershipEvent['source'],
  stripeEventId?: string,
  idempotencyKey?: string,
): MembershipEvent {
  const event: MembershipEvent = {
    id: generateId(),
    profileId,
    eventType,
    eventData,
    source,
    stripeEventId: stripeEventId || null,
    idempotencyKey: idempotencyKey || null,
    createdAt: new Date().toISOString(),
  }
  const events = loadEvents()
  events.push(event)
  saveEvents(events)
  return event
}

export function getUserMembership(profileId: string): UserMembership | null {
  return loadMemberships().find(m => m.profileId === profileId) || null
}

export function getMembershipByProfileId(profileId: string): UserMembership | null {
  return getUserMembership(profileId)
}

export function getActiveMembership(profileId: string): UserMembership | null {
  const membership = getUserMembership(profileId)
  if (!membership) return null
  if (membership.status === 'ACTIVE' || membership.status === 'LIFETIME') return membership
  // Check if period expired
  if (membership.currentPeriodEnd && new Date(membership.currentPeriodEnd) < new Date()) {
    updateMembershipStatus(profileId, 'EXPIRED', 'system')
    return null
  }
  return null
}

export function createPendingMembership(
  profileId: string,
  planId: string,
  billingInterval: BillingInterval,
): UserMembership {
  // Cancel existing pending
  const existing = loadMemberships().filter(m => m.profileId === profileId)
  for (const ex of existing) {
    if (ex.status === 'PENDING_PAYMENT') {
      ex.status = 'CANCELED'
    }
  }
  saveMemberships(existing)

  const now = new Date().toISOString()
  const membership: UserMembership = {
    id: generateId(),
    profileId,
    planId,
    status: 'PENDING_PAYMENT',
    billingInterval,
    currentPeriodStart: now,
    currentPeriodEnd: null,
    canceledAt: null,
    activatedByWebhookAt: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    createdAt: now,
    updatedAt: now,
  }

  const memberships = loadMemberships()
  memberships.push(membership)
  saveMemberships(memberships)

  recordEvent(profileId, 'MEMBERSHIP_PENDING', { planId, billingInterval }, 'frontend')
  return membership
}

export function activateMembership(
  profileId: string,
  planId: string,
  billingInterval: BillingInterval,
  stripeSubscriptionId: string,
  stripeCustomerId: string,
  idempotencyKey?: string,
): UserMembership | null {
  // Idempotency check
  if (idempotencyKey) {
    const existing = loadEvents().find(e => e.idempotencyKey === idempotencyKey)
    if (existing) return getUserMembership(profileId)
  }

  const plan = getPlanById(planId)
  if (!plan) return null

  const now = new Date()
  const periodEnd = new Date(now)
  if (billingInterval === 'annual') {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1)
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1)
  }

  let membership = loadMemberships().find(m => m.profileId === profileId)

  if (membership) {
    membership.planId = planId
    membership.status = 'ACTIVE'
    membership.billingInterval = billingInterval
    membership.currentPeriodStart = now.toISOString()
    membership.currentPeriodEnd = periodEnd.toISOString()
    membership.activatedByWebhookAt = now.toISOString()
    membership.stripeSubscriptionId = stripeSubscriptionId
    membership.stripeCustomerId = stripeCustomerId
    membership.updatedAt = now.toISOString()
  } else {
    membership = {
      id: generateId(),
      profileId,
      planId,
      status: 'ACTIVE',
      billingInterval,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      canceledAt: null,
      activatedByWebhookAt: now.toISOString(),
      stripeCustomerId,
      stripeSubscriptionId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }
    const memberships = loadMemberships()
    memberships.push(membership)
    saveMemberships(memberships)
  }

  saveMemberships(loadMemberships())

  recordEvent(profileId, 'MEMBERSHIP_ACTIVATED', {
    planId,
    billingInterval,
    stripeSubscriptionId,
    stripeCustomerId,
  }, 'stripe_webhook', undefined, idempotencyKey || undefined)

  return membership
}

export function updateMembershipStatus(
  profileId: string,
  status: MembershipStatus,
  source: MembershipEvent['source'],
): UserMembership | null {
  const membership = loadMemberships().find(m => m.profileId === profileId)
  if (!membership) return null

  membership.status = status
  membership.updatedAt = new Date().toISOString()

  if (status === 'CANCELED') {
    membership.canceledAt = new Date().toISOString()
  }

  saveMemberships(loadMemberships())

  recordEvent(profileId, `MEMBERSHIP_${status}`, { previousStatus: membership.status }, source)
  return membership
}

export function cancelMembership(profileId: string, source: MembershipEvent['source']): UserMembership | null {
  return updateMembershipStatus(profileId, 'CANCELED', source)
}

export function expireMembership(profileId: string): UserMembership | null {
  return updateMembershipStatus(profileId, 'EXPIRED', 'system')
}

export function getMembershipEvents(profileId: string, limit = 20): MembershipEvent[] {
  return loadEvents()
    .filter(e => e.profileId === profileId)
    .reverse()
    .slice(0, limit)
}

export function getAllMemberships(): UserMembership[] {
  return loadMemberships()
}

export function getMembershipStatusLabel(status: MembershipStatus): string {
  const labels: Record<MembershipStatus, string> = {
    NONE: 'Sin membresía',
    PENDING_PAYMENT: 'Pago pendiente de confirmación',
    ACTIVE: 'Membresía activa',
    PAST_DUE: 'Pago vencido',
    CANCELED: 'Cancelada',
    EXPIRED: 'Expirada',
    LIFETIME: 'Membresía vitalicia',
  }
  return labels[status]
}

export function isMembershipActive(status: MembershipStatus): boolean {
  return status === 'ACTIVE' || status === 'LIFETIME'
}

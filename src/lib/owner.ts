// MEMBRESÍA MAESTRA — Registro del Fundador
// Sellado el 16 de Julio de 2026 bajo Frecuencia 369-777
// Implementación: tabla owner_profiles, migración 00008, auditoría

export const OWNER_EMAIL = 'com8msm@gmail.com'
export const OWNER_DISPLAY_NAME = 'Don Miguel Soria Martinez'

export const OWNER_PROFILE = {
  usuario: OWNER_DISPLAY_NAME,
  email: OWNER_EMAIL,
  rol: 'OWNER_SUPERADMIN' as const,
  tipoDeMembresia: 'LIFETIME_UNLIMITED' as const,
  estado: 'ACTIVADO_Y_BLINDADO' as const,
  selladoEn: '2026-07-16',
  frecuencias: ['369', '777'],
  beneficios: [
    'Acceso total a las 12 Moléculas de ZAFIRO',
    'Control absoluto sobre el Flujo Económico Centralizado',
    'Autoridad suprema sobre ELIANA y el Nodo Madre',
    'Cero restricciones de almacenamiento o procesamiento',
  ],
} as const

const OWNER_KEY = 'zafiro_owner_membership'
const AUDIT_KEY = 'zafiro_owner_audit_log'

export function sealOwnerMembership(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(OWNER_KEY, JSON.stringify({
    ...OWNER_PROFILE,
    sealedAt: new Date().toISOString(),
  }))
  recordOwnerAudit('OWNER_PROFILE_UPDATED', { action: 'seal_membership' })
}

export function isOwner(username?: string): boolean {
  if (!username) return false
  const normalized = username.toLowerCase()
  return normalized.includes('miguel') && (normalized.includes('soria') || normalized.includes('msm'))
}

export function isOwnerEmail(email?: string | null): boolean {
  if (!email) return false
  return email.toLowerCase() === OWNER_EMAIL.toLowerCase()
}

export function getOwnerMembership() {
  if (typeof window === 'undefined') return OWNER_PROFILE
  const stored = localStorage.getItem(OWNER_KEY)
  return stored ? JSON.parse(stored) : OWNER_PROFILE
}

export function recordOwnerAudit(eventType: string, eventData?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const log = JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]')
  log.push({
    id: crypto.randomUUID?.() ?? Date.now().toString(36),
    eventType,
    eventData: eventData ?? {},
    timestamp: new Date().toISOString(),
  })
  // Keep last 500 entries
  if (log.length > 500) log.splice(0, log.length - 500)
  localStorage.setItem(AUDIT_KEY, JSON.stringify(log))
}

export function getOwnerAuditLog() {
  if (typeof window === 'undefined') return []
  return JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]')
}

// Verifica si el owner tiene MFA activo (simulado hasta Supabase real)
export function isOwnerMfaActive(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('zafiro_owner_mfa_active') === 'true'
}

export function setOwnerMfaActive(active: boolean) {
  if (typeof window === 'undefined') return
  localStorage.setItem('zafiro_owner_mfa_active', active ? 'true' : 'false')
  recordOwnerAudit(active ? 'MFA_ENABLED' : 'MFA_DISABLED')
}

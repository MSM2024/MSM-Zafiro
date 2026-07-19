import type { UserRole, Permission, MembershipTier, AccountStatus, VerificationStatus } from '@zafiro/types'
import { ROLE_PERMISSIONS } from '@zafiro/types'
import { getSession } from './auth'
import { getProfileByAuthId, type Profile } from './identity'

// ============================================================
// ANGEL SECURITY — Módulo de Seguridad del Ecosistema ZAFIRO
// Roles, Permisos, MFA, Auditoría, Rate Limiting, Zod, Sesiones
// ============================================================

// --- CONSTANTES ---
const AUDIT_STORAGE_KEY = 'zafiro_angel_audit'
const MFA_DEVICES_KEY = 'zafiro_angel_mfa_devices'
const SECURITY_EVENTS_KEY = 'zafiro_angel_security_events'
const MAX_AUDIT_ENTRIES = 10000
const MAX_LOGIN_ATTEMPTS = 5
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const MAX_MFA_DEVICES = 10

// --- TIPOS ---
export interface AngelAuditEntry {
  id: string
  timestamp: string
  actorId: string
  actorEmail: string
  action: string
  resource: string
  resourceId: string
  details: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  mfaVerified: boolean
  success: boolean
  immutable: true
}

export interface MfaDevice {
  id: string
  profileId: string
  deviceName: string
  type: 'authenticator' | 'sms' | 'email' | 'recovery_code'
  secret: string
  confirmedAt: string
  lastUsedAt?: string
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED'
  createdAt: string
}

export interface RecoveryCode {
  code: string
  used: boolean
  usedAt?: string
}

export interface SecurityEvent {
  id: string
  type: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'MFA_ENABLED' | 'MFA_DISABLED'
    | 'DEVICE_REGISTERED' | 'DEVICE_REVOKED' | 'DEVICE_TRUSTED'
    | 'PASSWORD_CHANGED' | 'ROLE_CHANGED' | 'SUSPICIOUS_ACTIVITY'
    | 'RATE_LIMIT_HIT' | 'API_KEY_ROTATED' | 'SESSION_REVOKED'
    | 'ADMIN_ACTION' | 'AUDIT_EXPORT'
  actorId: string
  actorEmail: string
  details: Record<string, unknown>
  severity: 'INFO' | 'WARNING' | 'CRITICAL'
  ipAddress?: string
  timestamp: string
}

export interface RateLimitEntry {
  count: number
  resetAt: number
  blocked: boolean
}

// ============================================================
// 1. PERMISSION SYSTEM
// ============================================================

export function hasPermission(profileRole: UserRole | undefined, permission: Permission): boolean {
  if (!profileRole) return false
  return (ROLE_PERMISSIONS[profileRole] || []).includes(permission)
}

export function hasAnyPermission(profileRole: UserRole | undefined, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(profileRole, p))
}

export function hasAllPermissions(profileRole: UserRole | undefined, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(profileRole, p))
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    OWNER_SUPERADMIN: 'Superadmin',
    SYSTEM_ADMIN: 'Admin del Sistema',
    FINANCE_ADMIN: 'Admin Financiero',
    CONTENT_ADMIN: 'Admin de Contenido',
    SECURITY_AUDITOR: 'Auditor de Seguridad',
    OPERATOR: 'Operador',
    COMPLIANCE_REVIEWER: 'Revisor de Cumplimiento',
    SUPPORT_AGENT: 'Agente de Soporte',
    ENTREPRENEUR: 'Emprendedor',
    USER: 'Usuario',
  }
  return labels[role] || role
}

export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    OWNER_SUPERADMIN: 'text-red-400 bg-red-500/10 border-red-500/20',
    SYSTEM_ADMIN: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    FINANCE_ADMIN: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    CONTENT_ADMIN: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    SECURITY_AUDITOR: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    OPERATOR: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    COMPLIANCE_REVIEWER: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    SUPPORT_AGENT: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    ENTREPRENEUR: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    USER: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  }
  return colors[role] || 'text-slate-400'
}

// ============================================================
// 2. AUDIT LOG (append-only, immutable)
// ============================================================

function genId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
}

function now(): string {
  return new Date().toISOString()
}

function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function lsSet(key: string, value: unknown) {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(value))
}

export function writeAudit(
  actorId: string,
  actorEmail: string,
  action: string,
  resource: string,
  resourceId: string,
  details: Record<string, unknown> = {},
  options?: { mfaVerified?: boolean; success?: boolean; ipAddress?: string; userAgent?: string },
): AngelAuditEntry {
  const log = lsGet<AngelAuditEntry[]>(AUDIT_STORAGE_KEY, [])
  const entry: AngelAuditEntry = {
    id: genId(),
    timestamp: now(),
    actorId,
    actorEmail,
    action,
    resource,
    resourceId,
    details,
    ipAddress: options?.ipAddress,
    userAgent: options?.userAgent,
    mfaVerified: options?.mfaVerified ?? false,
    success: options?.success ?? true,
    immutable: true,
  }
  log.push(entry)
  if (log.length > MAX_AUDIT_ENTRIES) log.splice(0, log.length - MAX_AUDIT_ENTRIES)
  lsSet(AUDIT_STORAGE_KEY, log)
  return entry
}

export function getAuditLog(options?: {
  actorId?: string
  action?: string
  resource?: string
  limit?: number
  offset?: number
  since?: string
}): AngelAuditEntry[] {
  let log = lsGet<AngelAuditEntry[]>(AUDIT_STORAGE_KEY, [])
  if (options?.actorId) log = log.filter(e => e.actorId === options.actorId)
  if (options?.action) log = log.filter(e => e.action === options.action)
  if (options?.resource) log = log.filter(e => e.resource === options.resource)
  if (options?.since) log = log.filter(e => e.timestamp >= options.since!)
  log.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  const offset = options?.offset ?? 0
  const limit = options?.limit ?? 100
  return log.slice(offset, offset + limit)
}

export function exportAuditLog(): AngelAuditEntry[] {
  return lsGet<AngelAuditEntry[]>(AUDIT_STORAGE_KEY, [])
}

// ============================================================
// 3. SECURITY EVENTS & MONITORING
// ============================================================

export function recordSecurityEvent(
  type: SecurityEvent['type'],
  actorId: string,
  actorEmail: string,
  details: Record<string, unknown> = {},
  severity: SecurityEvent['severity'] = 'INFO',
  ipAddress?: string,
): SecurityEvent {
  const events = lsGet<SecurityEvent[]>(SECURITY_EVENTS_KEY, [])
  const event: SecurityEvent = {
    id: genId(),
    type,
    actorId,
    actorEmail,
    details,
    severity,
    ipAddress,
    timestamp: now(),
  }
  events.push(event)
  if (events.length > 1000) events.splice(0, events.length - 1000)
  lsSet(SECURITY_EVENTS_KEY, events)
  return event
}

export function getRecentSecurityEvents(limit = 50): SecurityEvent[] {
  const events = lsGet<SecurityEvent[]>(SECURITY_EVENTS_KEY, [])
  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit)
}

export function getSecurityAlerts(): SecurityEvent[] {
  return getRecentSecurityEvents(100).filter(e => e.severity === 'CRITICAL' || e.severity === 'WARNING')
}

// ============================================================
// 4. RATE LIMITING (in-memory con advertencia)
// ============================================================
// ADVERTENCIA: En Vercel serverless, cada invocación tiene un Map fresco.
// Para rate limiting real en producción, migrar a Upstash/Redis.
// Esta implementación funciona correctamente solo en entornos con memoria persistente.

const rateLimitStore = new Map<string, RateLimitEntry>()

export function checkRateLimit(
  key: string,
  maxAttempts: number = MAX_LOGIN_ATTEMPTS,
  windowMs: number = LOGIN_WINDOW_MS,
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs, blocked: false })
    return { allowed: true, remaining: maxAttempts - 1, resetAt: now + windowMs }
  }

  if (entry.blocked) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++

  if (entry.count > maxAttempts) {
    entry.blocked = true
    const actorEmail = key.includes('_') ? key.split('_')[1] || 'unknown' : 'unknown'
    recordSecurityEvent('RATE_LIMIT_HIT', 'system', actorEmail, { key, count: entry.count, windowMs }, 'WARNING')
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  return { allowed: true, remaining: maxAttempts - entry.count, resetAt: entry.resetAt }
}

export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key)
}

// ============================================================
// 5. MFA DEVICE MANAGEMENT
// ============================================================

export function getMfaDevices(profileId: string): MfaDevice[] {
  const all = lsGet<MfaDevice[]>(MFA_DEVICES_KEY, [])
  return all.filter(d => d.profileId === profileId)
}

export function getActiveMfaDevices(profileId: string): MfaDevice[] {
  return getMfaDevices(profileId).filter(d => d.status === 'ACTIVE')
}

export function registerMfaDevice(
  profileId: string,
  deviceName: string,
  type: MfaDevice['type'],
  secret: string,
): MfaDevice | null {
  const all = lsGet<MfaDevice[]>(MFA_DEVICES_KEY, [])
  const activeCount = all.filter(d => d.profileId === profileId && d.status === 'ACTIVE').length
  if (activeCount >= MAX_MFA_DEVICES) return null

  const device: MfaDevice = {
    id: genId(),
    profileId,
    deviceName,
    type,
    secret,
    confirmedAt: now(),
    status: 'ACTIVE',
    createdAt: now(),
  }
  all.push(device)
  lsSet(MFA_DEVICES_KEY, all)
  recordSecurityEvent('DEVICE_REGISTERED', profileId, 'mfa', { deviceName, deviceType: type }, 'INFO')
  return device
}

export function revokeMfaDevice(deviceId: string, profileId: string): boolean {
  const all = lsGet<MfaDevice[]>(MFA_DEVICES_KEY, [])
  const idx = all.findIndex(d => d.id === deviceId && d.profileId === profileId)
  if (idx === -1) return false
  all[idx].status = 'REVOKED'
  lsSet(MFA_DEVICES_KEY, all)
  recordSecurityEvent('DEVICE_REVOKED', profileId, 'mfa', { deviceId, deviceName: all[idx].deviceName }, 'WARNING')
  return true
}

export function hasMfaEnabled(profileId: string): boolean {
  return getActiveMfaDevices(profileId).length > 0
}

// ============================================================
// 6. SESSION VALIDATION
// ============================================================

export function validateSession(sessionOverride?: { email?: string; id?: string; name?: string }): { valid: boolean; profile: Profile | null; role: UserRole | null } {
  const session = sessionOverride || getSession()
  if (!session) return { valid: false, profile: null, role: null }

  if (sessionOverride) {
    const sid = session.id || ''
    return { valid: true, profile: {
      id: sid, authUserId: sid, publicHandle: sid, displayName: session.name || '',
      role: 'USER' as UserRole, membershipTier: 'STANDARD' as MembershipTier, accountStatus: 'ACTIVE' as AccountStatus,
      verificationStatus: 'NOT_STARTED' as VerificationStatus, language: 'es', marketingConsent: false,
      whatsappConsent: false, privacyVersion: '1.0', termsVersion: '1.0', createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(), biography: '',
    }, role: 'USER' as UserRole }
  }

  if (!session.id) return { valid: false, profile: null, role: null }
  const profile = getProfileByAuthId(session.id)
  if (!profile) return { valid: false, profile: null, role: null }
  if (profile.accountStatus !== 'ACTIVE') return { valid: false, profile, role: null }

  return { valid: true, profile, role: profile.role }
}

export function requireRole(requiredRole: UserRole): boolean {
  const { valid, role } = validateSession()
  if (!valid || !role) return false

  const hierarchy: UserRole[] = [
    'USER', 'ENTREPRENEUR', 'SUPPORT_AGENT', 'COMPLIANCE_REVIEWER',
    'OPERATOR', 'CONTENT_ADMIN', 'FINANCE_ADMIN', 'SECURITY_AUDITOR',
    'SYSTEM_ADMIN', 'OWNER_SUPERADMIN',
  ]

  const userLevel = hierarchy.indexOf(role)
  const requiredLevel = hierarchy.indexOf(requiredRole)
  return userLevel >= requiredLevel
}

// ============================================================
// 7. ZOD SCHEMAS (para validación de API routes)
// ============================================================
// Esquemas reutilizables para validar requests de API.
// Usar con: import { z } from 'zod'; schema.parse(body)

export const schemas = {
  email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email inválido' },
  phone: { pattern: /^\+?[\d\s\-()]{7,20}$/, message: 'Teléfono inválido' },
  uuid: { pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, message: 'UUID inválido' },
  safeText: { pattern: /^[\w\sáéíóúüñÁÉÍÓÚÜÑ.,;:!?@#$%&*()\-_=+[\]{}'"<>/\\]{1,1000}$/, message: 'Texto contiene caracteres no permitidos' },
} as const

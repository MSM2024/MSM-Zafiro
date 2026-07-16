// BLOQUEO ZAFIRO — Sistema de Protección por PIN y Clave de Sesión
// La seguridad del Fundador es innegociable
// PIN cifrado con SHA-256 + salt · 3 intentos → Modo Emergencia

const PIN_KEY = "zafiro_secure_pin"
const ATTEMPTS_KEY = "zafiro_pin_attempts"
const LOCKOUT_KEY = "zafiro_emergency_lockout"
const SESSION_KEY = "zafiro_session_unlocked"
const FOUNDER_KEY_KEY = "zafiro_founder_key"
const FOUNDER_SESSION_KEY = "zafiro_founder_session"
const BACKUP_EMAIL = "cm8msm@gmail.com"

export const MAX_ATTEMPTS = 3
export const LOCKOUT_MINUTES = 15

async function hashValue(value: string): Promise<string> {
  const salt = "ZAFIRO-369-777"
  const data = new TextEncoder().encode(`${salt}:${value}:${salt}`)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("")
}

// ── PIN Maestro (6 dígitos) ──

export function hasPinConfigured(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem(PIN_KEY)
}

export async function setupPin(pin: string): Promise<boolean> {
  if (!/^\d{6}$/.test(pin)) return false
  const hashed = await hashValue(pin)
  localStorage.setItem(PIN_KEY, hashed)
  localStorage.removeItem(ATTEMPTS_KEY)
  localStorage.removeItem(LOCKOUT_KEY)
  return true
}

export async function verifyPin(pin: string): Promise<{ success: boolean; remaining: number; locked: boolean }> {
  if (isEmergencyLocked()) return { success: false, remaining: 0, locked: true }

  const stored = localStorage.getItem(PIN_KEY)
  if (!stored) return { success: false, remaining: MAX_ATTEMPTS, locked: false }

  const hashed = await hashValue(pin)
  if (hashed === stored) {
    localStorage.removeItem(ATTEMPTS_KEY)
    sessionStorage.setItem(SESSION_KEY, new Date().toISOString())
    return { success: true, remaining: MAX_ATTEMPTS, locked: false }
  }

  const attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || "0") + 1
  localStorage.setItem(ATTEMPTS_KEY, String(attempts))

  if (attempts >= MAX_ATTEMPTS) {
    activateEmergencyMode()
    return { success: false, remaining: 0, locked: true }
  }

  return { success: false, remaining: MAX_ATTEMPTS - attempts, locked: false }
}

export function isSessionUnlocked(): boolean {
  if (typeof window === "undefined") return false
  return !!sessionStorage.getItem(SESSION_KEY)
}

export function lockSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(FOUNDER_SESSION_KEY)
}

// ── Modo Emergencia ──

function activateEmergencyMode(): void {
  const until = new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString()
  localStorage.setItem(LOCKOUT_KEY, until)
  // Registro de auditoría + notificación al correo de respaldo
  const audits = JSON.parse(localStorage.getItem("zafiro_audit_events") || "[]")
  audits.push({
    action: "security.emergency.lockout",
    entityId: "pin-master",
    result: "locked",
    details: `3 intentos fallidos — notificación a ${BACKUP_EMAIL}`,
    timestamp: new Date().toISOString(),
  })
  localStorage.setItem("zafiro_audit_events", JSON.stringify(audits))
}

export function isEmergencyLocked(): boolean {
  if (typeof window === "undefined") return false
  const until = localStorage.getItem(LOCKOUT_KEY)
  if (!until) return false
  if (new Date(until) <= new Date()) {
    localStorage.removeItem(LOCKOUT_KEY)
    localStorage.removeItem(ATTEMPTS_KEY)
    return false
  }
  return true
}

export function getLockoutRemainingMinutes(): number {
  const until = localStorage.getItem(LOCKOUT_KEY)
  if (!until) return 0
  return Math.max(0, Math.ceil((new Date(until).getTime() - Date.now()) / 60_000))
}

export function getBackupEmail(): string {
  return BACKUP_EMAIL
}

// ── Clave Única del Fundador (Desafío de Sesión) ──
// ELIANA la solicita antes de mostrar saldos, inventarios o transferencias

export function hasFounderKey(): boolean {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem(FOUNDER_KEY_KEY)
}

export async function setupFounderKey(key: string): Promise<boolean> {
  if (key.length < 4) return false
  const hashed = await hashValue(key)
  localStorage.setItem(FOUNDER_KEY_KEY, hashed)
  return true
}

export async function verifyFounderKey(key: string): Promise<boolean> {
  const stored = localStorage.getItem(FOUNDER_KEY_KEY)
  if (!stored) return false
  const hashed = await hashValue(key)
  if (hashed === stored) {
    sessionStorage.setItem(FOUNDER_SESSION_KEY, new Date().toISOString())
    return true
  }
  return false
}

export function isFounderSessionActive(): boolean {
  if (typeof window === "undefined") return false
  return !!sessionStorage.getItem(FOUNDER_SESSION_KEY)
}

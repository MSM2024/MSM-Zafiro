const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const USERNAME_RE = /^[a-zA-Z0-9_]{3,30}$/
const URL_RE = /^https?:\/\/.+/
const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/

export interface ValidationResult {
  ok: boolean
  errors: Record<string, string>
}

export function validateProfile(fields: Record<string, string>): ValidationResult {
  const errors: Record<string, string> = {}
  if (!fields.name?.trim()) errors.name = 'El nombre es obligatorio'
  if (fields.name?.length > 100) errors.name = 'Máximo 100 caracteres'
  if (fields.username && !USERNAME_RE.test(fields.username)) errors.username = 'Solo letras, números y guión bajo (3-30 caracteres)'
  if (fields.email && !EMAIL_RE.test(fields.email)) errors.email = 'Correo inválido'
  if (fields.website && !URL_RE.test(fields.website)) errors.website = 'Debe ser una URL válida (https://...)'
  if (fields.bioShort?.length > 500) errors.bioShort = 'Máximo 500 caracteres'
  if (fields.location?.length > 100) errors.location = 'Máximo 100 caracteres'
  return { ok: Object.keys(errors).length === 0, errors }
}

export function validateHexColor(color: string): { ok: boolean; adjusted?: string } {
  if (!HEX_COLOR_RE.test(color)) return { ok: false }
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  if (luminance > 0.85) {
    return { ok: true, adjusted: darken(color, 0.5) }
  }
  return { ok: true }
}

export function validatePassword(password: string): ValidationResult {
  const errors: Record<string, string> = {}
  if (password.length < 8) errors.password = 'Mínimo 8 caracteres'
  if (!/[A-Z]/.test(password)) errors.password = 'Debe contener una mayúscula'
  if (!/[0-9]/.test(password)) errors.password = 'Debe contener un número'
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.password = 'Debe contener un símbolo'
  return { ok: Object.keys(errors).length === 0, errors }
}

function darken(hex: string, amount: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - Math.round(255 * amount))
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - Math.round(255 * amount))
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - Math.round(255 * amount))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#0a0a0a' : '#ffffff'
}

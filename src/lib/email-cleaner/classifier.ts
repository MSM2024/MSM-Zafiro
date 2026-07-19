import type { ClassificationCondition, RiskLevel, SuggestedAction } from './types'

export interface ClassificationResult {
  isSpam: boolean
  riskLevel: RiskLevel
  reasons: string[]
  suggestedAction: SuggestedAction
  label?: string
}

const SUSPICIOUS_DOMAINS = [
  'tempmail', 'throwaway', 'mailinator', 'guerrillamail',
  '10minutemail', 'sharklasers', 'yopmail',
]

const SUSPICIOUS_PATTERNS = [
  { field: 'subject' as const, pattern: /gana dinero/i, reason: 'Lenguaje de ganancias rápidas' },
  { field: 'subject' as const, pattern: /heredero|herencia|premio|loteria/i, reason: 'Herencia o premio sospechoso' },
  { field: 'subject' as const, pattern: /urgente|inmediato|acción requerida|verificación necesaria/i, reason: 'Lenguaje de urgencia' },
  { field: 'subject' as const, pattern: /contraseña|password|clave|seguridad.*cuenta/i, reason: 'Solicitud de credenciales' },
  { field: 'subject' as const, pattern: /código|2fa|verificación.*identidad/i, reason: 'Solicitud de códigos de seguridad' },
  { field: 'body' as const, pattern: /haz clic aquí|click here|accede ahora/i, reason: 'Enlace engañoso' },
  { field: 'body' as const, pattern: /factura.*pendiente|deuda|pago.*atrasado/i, reason: 'Falsa factura o deuda' },
  { field: 'body' as const, pattern: /inversión.*garantizada|rendimiento.*seguro/i, reason: 'Promesa financiera falsa' },
]

export function classifyEmail(
  from: string,
  subject: string,
  bodyPreview: string,
  hasAttachment: boolean,
  attachmentType?: string,
  gmailMarkedSpam?: boolean,
): ClassificationResult {
  const reasons: string[] = []
  let riskLevel: RiskLevel = 'low'
  let isSpam = false

  if (gmailMarkedSpam) {
    reasons.push('Gmail ya lo marcó como spam')
    isSpam = true
    riskLevel = 'high'
  }

  const domain = from.split('@')[1]?.toLowerCase() || ''
  if (SUSPICIOUS_DOMAINS.some(d => domain.includes(d))) {
    reasons.push(`Dominio sospechoso: ${domain}`)
    isSpam = true
    riskLevel = 'high'
  }

  for (const { field, pattern, reason } of SUSPICIOUS_PATTERNS) {
    const text = field === 'subject' ? subject : bodyPreview
    if (pattern.test(text)) {
      reasons.push(reason)
      isSpam = true
    }
  }

  if (hasAttachment) {
    const ext = attachmentType?.toLowerCase() || ''
    if (['.exe', '.bat', '.cmd', '.scr', '.js', '.vbs', '.ps1'].some(e => ext.endsWith(e))) {
      reasons.push('Archivo adjunto ejecutable')
      isSpam = true
      riskLevel = 'high'
    }
    if (['.zip', '.rar', '.7z'].some(e => ext.endsWith(e)) && !domain.includes('google.com') && !domain.includes('microsoft.com')) {
      reasons.push('Archivo comprimido de remitente desconocido')
      isSpam = true
      riskLevel = 'high'
    }
  }

  if (reasons.length >= 3) riskLevel = 'high'
  else if (reasons.length >= 1) riskLevel = riskLevel === 'low' ? 'medium' : riskLevel

  const suggestedAction: SuggestedAction = isSpam ? 'SPAM' : 'LABEL'

  return {
    isSpam,
    riskLevel,
    reasons: reasons.length > 0 ? reasons : ['No se detectaron señales de spam'],
    suggestedAction,
    label: isSpam ? 'ZAFIRO_SPAM_REVISAR' : undefined,
  }
}

export function meetsCondition(msg: { from: string; subject: string; date: string; sizeKB: number }, condition: ClassificationCondition): boolean {
  const { field, operator, value } = condition
  switch (field) {
    case 'from':
      if (operator === 'contains') return msg.from.toLowerCase().includes(value.toLowerCase())
      if (operator === 'equals') return msg.from.toLowerCase() === value.toLowerCase()
      return false
    case 'subject':
      if (operator === 'contains') return msg.subject.toLowerCase().includes(value.toLowerCase())
      if (operator === 'regex') {
        try { return new RegExp(value, 'i').test(msg.subject) } catch { return false }
      }
      return false
    case 'domain': {
      const domain = msg.from.split('@')[1]?.toLowerCase() || ''
      if (operator === 'contains') return domain.includes(value.toLowerCase())
      if (operator === 'equals') return domain === value.toLowerCase()
      return false
    }
    case 'date': {
      if (operator === 'older_than_days') {
        const days = parseInt(value)
        if (isNaN(days)) return false
        const age = (Date.now() - new Date(msg.date).getTime()) / (1000 * 60 * 60 * 24)
        return age > days
      }
      return false
    }
    case 'size': {
      if (operator === 'larger_than_mb') {
        const mb = parseInt(value)
        if (isNaN(mb)) return false
        return msg.sizeKB > mb * 1024
      }
      return false
    }
    default:
      return false
  }
}

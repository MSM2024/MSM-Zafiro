import { sanitizeOutput, stripMarkdownHeaders } from '../security/prompt-injection-guard'

export interface ValidationResult {
  valid: boolean
  text: string
  issues: string[]
  hasInternalHeaders: boolean
  hasRawDocuments: boolean
}

const INTERNAL_HEADER_PATTERNS = [
  /^##\s+(CONOCIMIENTO|SISTEMA|INSTRUCCIONES?|REGLAS?|PROMPT)/i,
  /^##\s+CONOCIMIENTO\s+(AUTORIZADO|ZAFIRO)/i,
  /^##\s+Q&A/i,
  /^#+\s+[A-Z\s]{10,}/,
]

const RAW_DOCUMENT_PATTERNS = [
  /^#+\s+(INTRODUCCI[OÓ]N|DESCRIPCI[OÓ]N|CARACTER[IÍ]STICAS|BENEFICIOS|REQUISITOS|PASOS?)/i,
  /📖\s+\w+/,
  /fuente:\s*\w+/i,
  /categor[ií]a:\s*\w+/i,
]

export function validateResponse(text: string): ValidationResult {
  const issues: string[] = []

  const hasInternalHeaders = INTERNAL_HEADER_PATTERNS.some(p => p.test(text))
  if (hasInternalHeaders) issues.push('Contiene encabezados internos')

  const hasRawDocuments = RAW_DOCUMENT_PATTERNS.some(p => p.test(text))
  if (hasRawDocuments) issues.push('Contiene fragmentos de documentos sin sintetizar')

  const cleaned = sanitizeOutput(text)
  const stripped = stripMarkdownHeaders(cleaned)

  return {
    valid: !hasInternalHeaders && !hasRawDocuments,
    text: stripped,
    issues,
    hasInternalHeaders,
    hasRawDocuments,
  }
}

export function validateResponseForSecrets(text: string): string {
  const secretPatterns = [
    /sk_live_[a-zA-Z0-9]+/g,
    /sk_test_[a-zA-Z0-9]+/g,
    /pk_live_[a-zA-Z0-9]+/g,
    /pk_test_[a-zA-Z0-9]+/g,
    /ghp_[a-zA-Z0-9]{36}/g,
    /gho_[a-zA-Z0-9]{36}/g,
    /xox[baprs]-\d+-[a-zA-Z0-9-]+/g,
    /AIza[0-9A-Za-z_-]{35}/g,
    /AKIA[0-9A-Z]{16}/g,
    /-----BEGIN (RSA |EC )?PRIVATE KEY-----/g,
    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g,
  ]

  let cleaned = text
  for (const pattern of secretPatterns) {
    cleaned = cleaned.replace(pattern, '[REDACTADO]')
  }

  return cleaned
}

export function validateFinancialData(text: string): boolean {
  const moneyPattern = /\$\s?\d{2,}(?:[.,]\d{3})*(?:[.,]\d{2})?/g
  const matches = text.match(moneyPattern)
  if (!matches) return true

  const mentionsDisconnected = /(?:simulad[ao]|ejemplo|hipot[ée]tic[ao]|estimad[ao]|aproximadamente)/i.test(text)
  return mentionsDisconnected
}

export function ensureNaturalLanguage(text: string, minLength: number = 15): string {
  const cleaned = sanitizeOutput(text)
  const stripped = stripMarkdownHeaders(cleaned)

  if (stripped.length < minLength) return text

  if (stripped.startsWith('#')) {
    const lines = stripped.split('\n').filter(l => !/^#/.test(l)).join('\n').trim()
    return lines || stripped
  }

  return stripped
}

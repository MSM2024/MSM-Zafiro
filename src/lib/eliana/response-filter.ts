// Filtro de Respuesta — Bloquea spam financiero, autogenerado y contenido no autorizado
// Frecuencia 369-777

const FINANCIAL_BLOCKLIST = [
  /reporte\s*de\s*liquidaci[oó]n/i,
  /tasa\s*aplicada/i,
  /tasa.*630/i,
  /441[.,]000/i,
  /conversi[oó]n\s*a\s*cup/i,
  /operaci[oó]n\s*[123]/i,
  /total.*final/i,
  /total.*cup/i,
  /venta\s*de\s*usdt/i,
  /compra\s*de\s*usdt/i,
  /balance.*disponible/i,
  /saldo.*actual.*cup/i,
]

const FORBIDDEN_PAIRS = [
  ['zelle', 'reporte'],
  ['zelle', 'total'],
  ['630', 'cup'],
  ['cup', 'operacion'],
  ['441', '000'],
  ['liquidacion', 'zelle'],
  ['operacion', '1', '2', '3'],
]

function hasForbiddenPair(text: string): boolean {
  const lower = text.toLowerCase()
  for (const pair of FORBIDDEN_PAIRS) {
    const allPresent = pair.every(word => lower.includes(word))
    if (allPresent) return true
  }
  return false
}

function hasBlocklistedPattern(text: string): boolean {
  return FINANCIAL_BLOCKLIST.some(pattern => pattern.test(text))
}

function hasFinancialReportStructure(text: string): boolean {
  const lower = text.toLowerCase()
  const moneyIndicators = ['$', 'usd', 'cup', 'eur', 'mlc', 'usdt']
  const reportKeywords = ['total', 'subtotal', 'suma', 'balance', 'importe', 'monto', 'saldo']
  const lineItems = ['operacion', 'item', 'concepto', 'detalle', 'producto', 'servicio']
  const moneyFound = moneyIndicators.some(ind => lower.includes(ind))
  const reportFound = reportKeywords.some(kw => lower.includes(kw))
  const lineFound = lineItems.some(li => lower.includes(li))
  const hasNumbers = /\d+[.,]\d+/.test(text)
  return (moneyFound && reportFound && lineFound && hasNumbers) || (moneyFound && reportFound && hasNumbers)
}

export interface FilterResult {
  blocked: boolean
  reason?: string
  originalText: string
  filteredText: string
}

export function filterResponse(text: string): FilterResult {
  if (!text || !text.trim()) {
    return { blocked: false, originalText: text, filteredText: text }
  }

  // Check blocklist patterns
  if (hasBlocklistedPattern(text)) {
    return {
      blocked: true,
      reason: 'financial_blocklist',
      originalText: text,
      filteredText: '⚠️ Esta respuesta fue bloqueada por contener patrones financieros no autorizados.',
    }
  }

  // Check forbidden pairs
  if (hasForbiddenPair(text)) {
    return {
      blocked: true,
      reason: 'forbidden_pair',
      originalText: text,
      filteredText: '⚠️ Esta respuesta fue bloqueada por contener combinaciones financieras no autorizadas.',
    }
  }

  // Check for auto-generated report structure
  if (hasFinancialReportStructure(text)) {
    return {
      blocked: true,
      reason: 'auto_report',
      originalText: text,
      filteredText: '⚠️ Esta respuesta fue bloqueada por contener estructura de reporte financiero no solicitado.',
    }
  }

  return { blocked: false, originalText: text, filteredText: text }
}

export function isSelfMessage(senderId: string, recipientId: string): boolean {
  return senderId === recipientId
}

export function filterResponseText(text: string): string {
  const result = filterResponse(text)
  return result.filteredText
}

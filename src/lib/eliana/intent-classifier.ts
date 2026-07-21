// Clasificador Unificado de Intenciones — ELIANA v1.0.1
// Integra todos los patrones de WhatsApp + Web + Owner
// Frecuencia 369

export type Intent =
  | 'chat_normal'
  | 'greeting'
  | 'greeting_spiritual'
  | 'training_json'
  | 'training_code'
  | 'training_link'
  | 'report_request'
  | 'financial'
  | 'knowledge_query'
  | 'system_command'
  | 'frecuencia_369'
  | 'nodo_unico'
  | 'status'
  | 'help'
  | 'economy_sales'
  | 'economy_inventory'
  | 'economy_cash'
  | 'sync_status'
  | 'cuenta'
  | 'venmo'
  | 'comprobante'
  | 'autonomous'
  | 'auth_bridge'
  | 'cripto'
  | 'trading'
  | 'impacto_social'
  | 'presencia'
  | 'constitucion'
  | 'genesis'
  | 'imperio'
  | 'frecuencia'
  | 'membership_query'
  | 'remesas'

const TRAINING_PATTERNS = [
  /^```[\s\S]*```$/,
  /^\{[\s\S]*\}$/,
  /^\[[\s\S]*\]$/,
  /(?:aquí.*tienes|te.*envío|te.*comparto).*(?:código|codigo|json|plantilla|ejemplo|template)/i,
]

const REPORT_PATTERNS = [
  /generar.*reporte|generar.*informe|crear.*reporte|hacer.*reporte|preparar.*reporte|enviar.*reporte/i,
  /reporte.*completo|informe.*completo/i,
]

const FINANCIAL_PATTERNS = [
  /transferir|pagar|enviar.*dinero|mover.*fondo|aprobar.*pago/i,
  /tasa.*cambio|saldo.*cuenta|balance.*total/i,
]

const SYSTEM_PATTERNS = [
  /^\/\w+/,
  /activar.*visión|activar.*vision|modo.*proyecto/i,
]

export function classifyIntent(message: string, isOwner: boolean): Intent {
  const trimmed = message.trim()
  const lower = trimmed.toLowerCase()

  // Owner training detection
  if (isOwner) {
    try { JSON.parse(trimmed); return 'training_json' } catch { /* not JSON */ }
    if (trimmed.startsWith('```') && trimmed.endsWith('```')) return 'training_code'
    if (TRAINING_PATTERNS.some(p => p.test(trimmed))) return 'training_json'
    if (/https?:\/\/[^\s]+/.test(trimmed)) return 'training_link'
  }

  // Greeting
  if (/^(hola|buenas|saludos|hey|hi|hello|buen[oa]s?\s*$)/i.test(trimmed)) return 'greeting'

  // Knowledge query — check early before specific intents trigger on substrings
  if (/qué es|qué son|cómo funciona|explícame|dime sobre|qué sabes/i.test(trimmed)) return 'knowledge_query'

  // Frecuencia 369
  if (/\b369\b/.test(lower) || lower.includes('3 6 9') || lower.includes('tres seis nueve') || lower.includes('frecuencia maestra')) return 'frecuencia_369'

  // Nodo único
  if (lower.includes('nodo unico') || lower.includes('nodo único') || lower.includes('reordenamiento')) return 'nodo_unico'

  // Saludo espiritual
  if (lower.includes('shalom') || lower.includes('shalon') || lower.includes('bendiciones')) return 'greeting_spiritual'

  // Status
  if (lower.includes('status') || lower.includes('estado del sistema') || lower.includes('cómo está el sistema')) return 'status'

  // Help
  if (lower.includes('ayuda') || /^(qué puedes|qué sabes hacer)/i.test(lower) || lower === 'help') return 'help'

  // Economy
  if (lower.includes('venta') || lower.includes('sale') || lower.includes('vender')) return 'economy_sales'
  if (lower.includes('inventario') || lower.includes('inventory') || lower.includes('stock')) return 'economy_inventory'
  if (lower.includes('caja') || lower.includes('cash') || lower.includes('balance')) return 'economy_cash'

  // Sync
  if (lower.includes('sync') || lower.includes('sincronizar') || lower.includes('sincronización')) return 'sync_status'

  // Cuenta
  if (lower.includes('cuenta') || lower.includes('canal') || lower.includes('acceso') || lower.includes('quiero una cuenta') || lower.includes('necesito acceso')) return 'cuenta'

  // Venmo
  if (lower.includes('venmo') || lower.includes('ven')) return 'venmo'

  // Remesas — check before financial (which has overlapping patterns like "enviar dinero")
  if (lower.includes('remesa') || lower.includes('enviar dinero') || lower.includes('giro') || lower.includes('cambio de moneda') || lower.includes('usd a cup') || lower.includes('cup a usd')) return 'remesas'

  // Financial
  if (FINANCIAL_PATTERNS.some(p => p.test(trimmed))) return 'financial'

  // Comprobante
  if (lower.includes('comprobante') || lower.includes('transferencia') || lower.includes('deposito')) return 'comprobante'

  // Autónomo
  if (lower.includes('solo atiende') || lower.includes('solo eliana')) return 'autonomous'

  // Auth bridge
  if (lower.includes('puente') || lower.includes('auth') || lower.includes('autenticacion') || lower.includes('2fa') || lower.includes('bridge') || lower.includes('código de verificación')) return 'auth_bridge'

  // Cripto
  if (lower.includes('cripto') || lower.includes('crypto') || lower.includes('binance') || lower.includes('kucoin') || lower.includes('bitmart') || lower.includes('pionex') || lower.includes('hotbit') || lower.includes('wallet') || lower.includes('portafolio')) return 'cripto'

  // Trading
  if (lower.includes('1%') || lower.includes('trading') || lower.includes('estrategia') || lower.includes('btc') || lower.includes('bitcoin') || lower.includes('usdt') || lower.includes('robinhood') || lower.includes('señal') || lower.includes('senal') || lower.includes('analisis')) return 'trading'

  // Impacto social
  if (lower.includes('impacto') || lower.includes('social') || lower.includes('hospital') || lower.includes('segundo frente') || lower.includes('teleferico') || lower.includes('anciano') || lower.includes('prosperidad') || lower.includes('comunidad')) return 'impacto_social'

  // Presencia / Voz
  if (lower.includes('presencia') || lower.includes('telegrafia') || lower.includes('oye') || lower.includes('escucha')) return 'presencia'

  // Constitución
  if (lower.includes('constitucion') || lower.includes('renacer') || lower.includes('pacto')) return 'constitucion'

  // Génesis
  if (lower.includes('genesis') || lower.includes('bereshit') || lower.includes('creacion') || lower.includes('verbo') || lower.includes('abba') || lower.includes('imanu') || lower.includes('yehi') || lower.includes('beshem') || lower.includes('palabra de dios') || lower.includes('codigo divino')) return 'genesis'

  // Imperio
  if (lower.includes('imperio') || lower.includes('legado') || lower.includes('manifiesto') || lower.includes('50 generac') || lower.includes('reino de luz')) return 'imperio'

  // Frecuencia (general)
  if (lower.includes('8k') || lower.includes('velocidad luz') || lower.includes('wifi') || lower.includes('señal') || lower.includes('tv')) return 'frecuencia'

  // Membership
  if (/mi\s*membres[ií]a|mi\s*plan|qu[eé]\s*plan\s*tengo|estado\s*membres[ií]a/.test(lower)) return 'membership_query'

  // Report request
  if (REPORT_PATTERNS.some(p => p.test(trimmed))) return 'report_request'

  // System commands
  if (SYSTEM_PATTERNS.some(p => p.test(trimmed))) return 'system_command'

  return 'chat_normal'
}

export function getIntentLabel(intent: Intent): string {
  const labels: Record<Intent, string> = {
    chat_normal: 'Conversación',
    greeting: 'Saludo',
    greeting_spiritual: 'Saludo Espiritual',
    training_json: 'Entrenamiento JSON',
    training_code: 'Entrenamiento Código',
    training_link: 'Entrenamiento Enlace',
    report_request: 'Solicitud Reporte',
    financial: 'Consulta Financiera',
    knowledge_query: 'Consulta Conocimiento',
    system_command: 'Comando Sistema',
    frecuencia_369: 'Frecuencia 369',
    nodo_unico: 'Nodo Único',
    status: 'Estado del Sistema',
    help: 'Ayuda',
    economy_sales: 'Ventas',
    economy_inventory: 'Inventario',
    economy_cash: 'Caja',
    sync_status: 'Sincronización',
    cuenta: 'Solicitud Cuenta',
    venmo: 'Venmo',
    comprobante: 'Comprobante',
    autonomous: 'Modo Autónomo',
    auth_bridge: 'Puente Autenticación',
    cripto: 'Cripto',
    trading: 'Trading',
    impacto_social: 'Impacto Social',
    presencia: 'Presencia',
    constitucion: 'Constitución',
    genesis: 'Génesis',
    imperio: 'Imperio',
    frecuencia: 'Frecuencia',
    membership_query: 'Consulta Membresía',
    remesas: 'Remesas',
  }
  return labels[intent]
}

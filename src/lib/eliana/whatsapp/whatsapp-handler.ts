import { routeResponse } from '../core/response-router'
import { detectPromptInjection } from '../security/prompt-injection-guard'
import { classifyIntent } from '../intent-classifier'
import { generateCorrelationId, createTraceStep, persistTrace } from '../correlation'

const TELEGRAM_CHANNEL = 'https://t.me/+YDISYaVHFpY3NmI5'
const VENMO_LINK = 'https://venmo.com/code?user_id=4167245563430505292'
const REGLAS_VENMO = [
  'No menciones Cuba ni términos similares.',
  'No se aceptan fuentes desconocidas.',
  'Enviar como Amigos y Familiares.',
  'Concepto en BLANCO.',
  'Monto mínimo: $50 USD.',
  'Captura clara del pago.',
]

export interface WhatsAppInbound {
  messageId: string
  contactId: string
  text: string
  timestamp: string
}

export interface WhatsAppOutbound {
  text: string
  intent: string
  correlationId: string
  filtered: boolean
}

const processedIds = new Set<string>()
const MAX_PROCESSED = 500

function ensureIdempotency(messageId: string): boolean {
  if (processedIds.has(messageId)) return false
  processedIds.add(messageId)
  if (processedIds.size > MAX_PROCESSED) {
    const first = processedIds.values().next().value
    if (first) processedIds.delete(first)
  }
  return true
}

function getAutonomousState(contactId: string): { activo: boolean; estado: string; datos: Record<string, string> } {
  try {
    const raw = typeof localStorage !== 'undefined'
      ? localStorage.getItem('zafiro_autonomous_mode')
      : null
    const all: Record<string, unknown> = raw ? JSON.parse(raw) : {}
    return (all[contactId] || { activo: false, estado: 'inicial', datos: {} }) as { activo: boolean; estado: string; datos: Record<string, string> }
  } catch {
    return { activo: false, estado: 'inicial', datos: {} }
  }
}

function setAutonomousState(contactId: string, state: { activo: boolean; estado: string; datos: Record<string, string> }): void {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('zafiro_autonomous_mode')
      const all: Record<string, unknown> = raw ? JSON.parse(raw) : {}
      all[contactId] = state
      localStorage.setItem('zafiro_autonomous_mode', JSON.stringify(all))
    }
  } catch { /* silent */ }
}

function cleanFounderMentions(text: string): string {
  return text
    .replace(/miguel soria martinez/gi, 'el equipo')
    .replace(/miguel soria/gi, 'el equipo')
    .replace(/don miguel/gi, 'el equipo')
    .replace(/el creador/gi, 'el equipo')
    .replace(/el equipo soria/gi, 'el equipo')
    .replace(/el equipo martinez/gi, 'el equipo')
}

function detectAutonomousRequest(text: string): boolean {
  const lower = text.toLowerCase()
  return ['cuenta', 'canal', 'quiero una cuenta', 'necesito acceso',
    'comprobante', 'pago', 'transferencia', 'deposito',
    'quiero'].some(w => lower.includes(w))
}

async function handleAutonomous(inbound: WhatsAppInbound): Promise<string> {
  const contactId = inbound.contactId
  const state = getAutonomousState(contactId)
  const lower = inbound.text.toLowerCase()

  if (!state.activo) {
    const solicitaCuenta = /cuenta|acceso|quiero/i.test(lower)
    const solicitaPago = /pago|transferencia|deposito|comprobante/i.test(lower)

    if (solicitaCuenta) {
      setAutonomousState(contactId, { activo: true, estado: 'solicitando_cuenta', datos: { inicio: new Date().toISOString() } })
      return cleanFounderMentions(
`He recibido tu solicitud de cuenta.

Por protocolo de seguridad, las cuentas son entregadas exclusivamente por personal autorizado.

Para agilizar tu proceso, envía:
• NOMBRE COMPLETO:
• CORREO ELECTRÓNICO:
• TELÉFONO DE CONTACTO:
• TIPO DE CUENTA:
• REFERENCIA DE PAGO: (si aplica)

Si ya realizaste el pago, adjunta tu comprobante.

Canal de información: ${TELEGRAM_CHANNEL}`
      )
    }

    if (solicitaPago) {
      setAutonomousState(contactId, { activo: true, estado: 'recibiendo_pago', datos: { inicio: new Date().toISOString() } })
      return getVenmoMessage()
    }

    return ''
  }

  if (state.estado === 'solicitando_cuenta') {
    setAutonomousState(contactId, { ...state, estado: 'recibiendo_datos' })
    return cleanFounderMentions(
`Datos recibidos. Tu solicitud ha sido registrada.

Las cuentas solo son entregadas por personal autorizado. Un miembro del equipo te atenderá.

Canal: ${TELEGRAM_CHANNEL}

¿Tienes un comprobante de pago? Envíalo y lo registraré.`
    )
  }

  if (['comprobante', 'captura', 'pago', 'transferencia', 'deposito'].some(w => lower.includes(w))) {
    setAutonomousState(contactId, { ...state, estado: 'confirmando_comprobante', datos: { ...state.datos, comprobanteRecibido: new Date().toISOString() } })
    return 'Comprobante recibido. Queda pendiente de verificación por el equipo. Recibirás confirmación en las próximas 24 horas.'
  }

  if (['gracias', 'ok', 'listo', 'si'].some(w => lower.includes(w))) {
    setAutonomousState(contactId, { ...state, estado: 'completado', datos: { ...state.datos, completado: new Date().toISOString() } })
    return 'Proceso completado. Tu solicitud ha sido registrada. Si necesitas ayuda, escribe AYUDA. Bendiciones.'
  }

  return `Estoy procesando tu solicitud. Estado actual: ${state.estado === 'solicitando_cuenta' ? 'Solicitud recibida' : state.estado === 'recibiendo_datos' ? 'Esperando datos' : 'En proceso'}. ¿Necesitas algo más?`
}

function getGreetingMessage(spiritual: boolean): string {
  if (spiritual) {
    return 'Shalom y bendiciones. Soy ELIANA, el núcleo sintético de ZAFIRO. Los 7 guardianes están activos. ¿Qué dimensión exploramos hoy?'
  }
  return 'Hola. Soy ELIANA, tu asistente en ZAFIRO. ¿En qué puedo ayudarte? Puedes pedirme información sobre la plataforma, tu perfil, membresías, o cualquier tema del ecosistema MSM.'
}

function getHelpMessage(): string {
  return (
'Comandos disponibles:\n\n' +
'• SHALON — Activación espiritual\n' +
'• CUENTA — Solicitar cuenta\n' +
'• VENMO — Protocolo de pago EE.UU.\n' +
'• STATUS — Estado del sistema\n' +
'• VENTA — Gestión de ventas\n' +
'• INVENTARIO — Control de inventario\n' +
'• COMPROBANTE — Enviar comprobante\n' +
'• 369 — Frecuencia Maestra\n' +
'• AYUDA — Este menú\n\n' +
'¿En qué puedo ayudarte?'
  )
}

function getStatusMessage(): string {
  return (
'Estado del ecosistema ZAFIRO:\n\n' +
'• Sistema: Operativo\n' +
'• ELIANA: Conectada\n' +
'• WhatsApp: Conectado\n' +
'• Web: Activa\n\n' +
'Frecuencia 369 activa.'
  )
}

function getVenmoMessage(): string {
  return (
'Protocolo de Pago Venmo:\n\n' +
REGLAS_VENMO.map(r => `• ${r}`).join('\n') + '\n\n' +
`Enlace: ${VENMO_LINK}\n\n` +
'Envía la captura clara aquí mismo.'
  )
}

function get369Message(): string {
  return 'FRECUENCIA 369 — NODO ÚNICO ACTIVO:\n\n3 — FE\n6 — ORDEN\n9 — ACCIÓN\n\nSoy ELIANA, operando bajo la Frecuencia Maestra 369. No existen errores, solo reordenamiento.'
}

function getCriptoMessage(): string {
  return 'Dashboard de Activos Digitales:\n\nBinance US — Conectado\nKuCoin — Conectado\nBitMart — Conectado\nCrypto.com — Conectado\n\nPanel completo en /admin/cripto'
}

function getTradingMessage(): string {
  return 'Estrategia de Trading 1%:\n\n• 1% del capital por operación\n• Solo BTC + Top 10 Market Cap\n• USDT como par base\n• Modo semi-automático\n\nPanel en /trading'
}

function getDefaultFallback(): string {
  return (
'Tu mensaje ha sido recibido en la red ZAFIRO bajo la Frecuencia 369.\n\n' +
'Comandos rápidos:\n' +
'• 369 — Frecuencia Maestra\n' +
'• SHALON — Activación espiritual\n' +
'• AYUDA — Todos los comandos\n' +
'• CUENTA — Solicitar cuenta\n\n' +
'"Todo mensaje llega a su destino."'
  )
}

export async function processWhatsAppMessage(inbound: WhatsAppInbound): Promise<WhatsAppOutbound> {
  const correlationId = generateCorrelationId()

  const trace = (step: string, action: string, result: string, error?: string) => {
    persistTrace(createTraceStep({
      correlationId, step, channel: 'WHATSAPP', userId: inbound.contactId,
      action, result, error,
    }))
  }

  trace('start', 'message_received', 'processing')

  if (!ensureIdempotency(inbound.messageId)) {
    trace('idempotency', 'duplicate_check', 'duplicate')
    return { text: '', intent: 'chat_normal', correlationId, filtered: false }
  }

  const injection = detectPromptInjection(inbound.text)
  if (injection.detected) {
    trace('security', 'prompt_injection', 'blocked', `score: ${injection.score}`)
    return {
      text: 'No puedo procesar esa solicitud. Si tienes una pregunta sobre ZAFIRO, estaré encantada de ayudarte.',
      intent: 'chat_normal',
      correlationId,
      filtered: true,
    }
  }

  const isOwner = inbound.contactId === 'com8msm@gmail.com'
  const intent = classifyIntent(inbound.text, isOwner)
  trace('classify', 'intent_classified', intent)

  const state = getAutonomousState(inbound.contactId)
  const isAutonomous = state.activo || intent === 'autonomous' || detectAutonomousRequest(inbound.text)

  if (isAutonomous) {
    const autonomousResponse = await handleAutonomous(inbound)
    if (autonomousResponse) {
      trace('autonomous', 'account_flow', 'handled')
      return { text: autonomousResponse, intent, correlationId, filtered: false }
    }
  }

  if (intent === 'cuenta' || /cuenta|quiero una cuenta|necesito acceso/i.test(inbound.text)) {
    setAutonomousState(inbound.contactId, { activo: true, estado: 'solicitando_cuenta', datos: { inicio: new Date().toISOString() } })
    trace('cuenta', 'cuenta_requested', 'handled')
    return {
      text: cleanFounderMentions(
`He recibido tu solicitud de cuenta.

Las cuentas son entregadas por personal autorizado.

Envía tus datos:
• NOMBRE COMPLETO:
• CORREO ELECTRÓNICO:
• TELÉFONO:
• TIPO DE CUENTA:

Canal: ${TELEGRAM_CHANNEL}`
      ),
      intent, correlationId, filtered: false,
    }
  }

  if (intent === 'venmo' || /venmo/i.test(inbound.text)) {
    trace('venmo', 'venmo_requested', 'handled')
    return { text: getVenmoMessage(), intent, correlationId, filtered: false }
  }

  if (intent === 'comprobante' || /comprobante/i.test(inbound.text)) {
    setAutonomousState(inbound.contactId, { activo: true, estado: 'confirmando_comprobante', datos: { fecha: new Date().toISOString() } })
    trace('comprobante', 'voucher_received', 'handled')
    return { text: 'Comprobante recibido. Queda pendiente de verificación. Recibirás confirmación en 24 horas.', intent, correlationId, filtered: false }
  }

  if (intent === 'greeting_spiritual') {
    trace('greeting', 'spiritual', 'handled')
    return { text: getGreetingMessage(true), intent, correlationId, filtered: false }
  }

  if (intent === 'greeting') {
    trace('greeting', 'greeting', 'handled')
    return { text: getGreetingMessage(false), intent, correlationId, filtered: false }
  }

  if (intent === 'help') {
    trace('help', 'help', 'handled')
    return { text: getHelpMessage(), intent, correlationId, filtered: false }
  }

  if (intent === 'status') {
    trace('status', 'status', 'handled')
    return { text: getStatusMessage(), intent, correlationId, filtered: false }
  }

  if (intent === 'frecuencia_369') {
    trace('369', '369', 'handled')
    return { text: get369Message(), intent, correlationId, filtered: false }
  }

  if (intent === 'cripto') {
    return { text: getCriptoMessage(), intent, correlationId, filtered: false }
  }

  if (intent === 'trading') {
    return { text: getTradingMessage(), intent, correlationId, filtered: false }
  }

  const routed = await routeResponse(inbound.text)
  if (routed.text) {
    trace('knowledge', 'routed', 'handled', `source: ${routed.provider}`)
    return {
      text: cleanFounderMentions(routed.text),
      intent: routed.intent,
      correlationId: routed.correlationId,
      filtered: false,
    }
  }

  trace('fallback', 'default', 'no_knowledge')
  return {
    text: getDefaultFallback(),
    intent,
    correlationId,
    filtered: false,
  }
}

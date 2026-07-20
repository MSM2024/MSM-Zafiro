import { detectPromptInjection, sanitizeOutput } from '../security/prompt-injection-guard'
import { validateResponse, validateResponseForSecrets, ensureNaturalLanguage } from './answer-validator'
import { selectSource, type SourceType } from './source-selector'
import { buildContext, buildConversationHistory, getUserSummary } from './context-builder'
import { callAIWithFallback, getAvailableProviders, getProviderNotConfiguredMessage } from './fallback-manager'
import { ragQuery } from '../knowledge/rag-engine'
import { classifyIntent, getIntentLabel } from '../intent-classifier'
import { isOwnerSession, evaluateOwnerMessage } from '../owner-firewall'
import { getActiveMembership, getUserMembership } from '@/lib/memberships'
import { getProfiles } from '@/lib/profile'
import { isRemesasQuery, getRemesasResponse } from '../remesas'
import { generateCorrelationId, createTraceStep, persistTrace } from '../correlation'
import { recordAction } from './agent-registry'
import type { Intent } from '../intent-classifier'

export type AnswerType =
  | 'ANSWERED'
  | 'CLARIFICATION_REQUIRED'
  | 'AUTHORIZATION_REQUIRED'
  | 'HUMAN_REVIEW_REQUIRED'
  | 'CURRENT_DATA_REQUIRED'
  | 'TEMPORARILY_UNAVAILABLE'

export interface RoutedResponse {
  text: string
  intent: Intent
  answerType: AnswerType
  sources: string[]
  confidence: 'high' | 'medium' | 'low'
  provider: string
  model: string
  knowledgeUsed: boolean
  correlationId: string
}

export async function routeResponse(
  message: string,
  session?: { email?: string; name?: string },
  history?: Array<{ role: string; text: string }>
): Promise<RoutedResponse> {
  const correlationId = generateCorrelationId()
  const email = session?.email || 'anonymous'
  const isOwner = email === 'com8msm@gmail.com'
  const intent = classifyIntent(message, isOwner)
  const availableProviders = getAvailableProviders()

  const trace = (step: string, action: string, result: string, error?: string) => {
    persistTrace(createTraceStep({
      correlationId, step, channel: 'web', userId: email,
      action, result, error,
    }))
  }

  trace('router', 'classify_intent', intent)

  // 1. Security: prompt injection check
  const injection = detectPromptInjection(message)
  if (injection.detected) {
    trace('security', 'prompt_injection_detected', 'blocked', `score: ${injection.score}`)
    recordAction('eliana', 'prompt_injection_blocked', message, '', intent, false, 'Prompt injection detectado')
    return {
      text: 'No puedo procesar esa solicitud. Si tienes una pregunta sobre ZAFIRO, estaré encantada de ayudarte.',
      intent, answerType: 'AUTHORIZATION_REQUIRED', sources: ['prompt-injection-guard'],
      confidence: 'high', provider: 'system', model: 'guard', knowledgeUsed: false, correlationId,
    }
  }

  // 2. Owner firewall
  if (isOwner) {
    const firewall = evaluateOwnerMessage(message)
    if (firewall.blocked) {
      trace('firewall', 'owner_firewall', 'blocked', intent)
      recordAction('eliana', 'firewall_blocked', message, firewall.response || '', intent, true)
      return {
        text: firewall.response || '', intent, answerType: 'AUTHORIZATION_REQUIRED',
        sources: ['owner-firewall'], confidence: 'high', provider: 'system', model: 'firewall',
        knowledgeUsed: false, correlationId,
      }
    }
  }

  // 3. Membership query
  if (intent === 'membership_query' && session?.email) {
    const allProfiles = getProfiles()
    const profile = Object.values(allProfiles).find(p => (p as { email?: string }).email === session.email) as { userId?: string } | undefined
    const profileId = profile?.userId || session.email
    const active = getActiveMembership(profileId)
    const anyMem = getUserMembership(profileId)
    const plan = anyMem?.planId?.toUpperCase() || 'GRATIS'

    let text: string
    if (active) {
      text = `Tu membresía **${plan}** está activa. ${active.currentPeriodEnd ? `Válida hasta ${new Date(active.currentPeriodEnd).toLocaleDateString()}.` : ''}${active.status === 'LIFETIME' ? ' Eres OWNER_SUPERADMIN con membresía vitalicia.' : ''}`
    } else if (anyMem?.status === 'PENDING_PAYMENT') {
      text = `Tu membresía **${plan}** tiene un pago pendiente. Stripe aún no ha confirmado el pago. Si el problema persiste, contacta a soporte.`
    } else if (anyMem?.status === 'PAST_DUE') {
      text = `Tu membresía **${plan}** tiene un pago vencido. Actualiza tu método de pago en el portal de Stripe.`
    } else {
      text = `Actualmente tienes el plan **Gratis**. Puedes ver los planes disponibles en /zafiro/membresias.`
    }
    trace('membership', 'membership_query', 'handled')
    recordAction('eliana', 'membership_query', message, text, intent, true)
    return { text, intent, answerType: 'ANSWERED', sources: ['memberships'], confidence: 'high', provider: 'system', model: 'membership', knowledgeUsed: true, correlationId }
  }

  // 4. Remesas
  if (intent === 'remesas' || isRemesasQuery(message)) {
    const remesasResponse = getRemesasResponse(message)
    if (remesasResponse) {
      trace('remesas', 'remesas_query', 'handled')
      recordAction('eliana', 'remesas_query', message, remesasResponse.slice(0, 100), intent, true)
      return { text: remesasResponse, intent, answerType: 'ANSWERED', sources: ['remesas-handler'], confidence: 'high', provider: 'system', model: 'remesas', knowledgeUsed: false, correlationId }
    }
  }

  // 5. Greeting
  if (intent === 'greeting' || intent === 'greeting_spiritual') {
    const spiritual = intent === 'greeting_spiritual'
    const text = spiritual
      ? 'Shalom y bendiciones. Soy ELIANA, el núcleo sintético de ZAFIRO. ¿En qué puedo iluminar tu camino hoy?'
      : '¡Hola! Soy ELIANA, tu asistente en ZAFIRO. ¿En qué puedo ayudarte? Puedes preguntarme sobre la plataforma, tu perfil, membresías, o cualquier tema del ecosistema MSM.'
    trace('greeting', 'greeting', 'handled')
    return { text, intent, answerType: 'ANSWERED', sources: ['eliana'], confidence: 'high', provider: 'system', model: 'greeting', knowledgeUsed: false, correlationId }
  }

  // 6. Help
  if (intent === 'help') {
    const text = 'Puedo ayudarte con:\n\n• Información sobre ZAFIRO y el ecosistema MSM\n• Consultas sobre tu perfil y membresía\n• Navegación dentro de la plataforma\n• Explicaciones sobre gemología, economía y más\n• Soporte técnico básico\n\n¿Sobre qué tema te gustaría saber más?'
    trace('help', 'help', 'handled')
    return { text, intent, answerType: 'ANSWERED', sources: ['eliana'], confidence: 'high', provider: 'system', model: 'help', knowledgeUsed: false, correlationId }
  }

  // 7. RAG Knowledge — synthesize via AI when available
  const sourceSelection = selectSource(message, intent, isOwner, availableProviders)
  const ragResult = ragQuery(message)

  if (ragResult.found) {
    trace('knowledge', 'rag_query', 'found', `sources: ${ragResult.sources.length}`)

    if (availableProviders.length > 0) {
      return await synthesizeWithAI(message, ragResult.response, ragResult.sources, intent, history, session, correlationId)
    }

    const naturalResponse = synthesizeKnowledgeLocally(ragResult.response, message)
    recordAction('eliana', 'knowledge_query', message, naturalResponse.slice(0, 100), intent, true)
    return {
      text: naturalResponse, intent, answerType: 'ANSWERED',
      sources: ragResult.sources, confidence: ragResult.confidence,
      provider: 'knowledge', model: 'rag-local', knowledgeUsed: true, correlationId,
    }
  }

  // 8. AI provider fallback
  if (availableProviders.length > 0) {
    trace('ai', 'ai_provider', 'querying')
    const ctx = buildContext(session)
    const convHistory = buildConversationHistory(history || [])
    const userSummary = getUserSummary(email)
    const knowledgeContext = `Usuario: ${ctx.userName}\n${userSummary ? `Perfil:\n${userSummary}\n` : ''}${ctx.rulesContext ? `Reglas: ${ctx.rulesContext}\n` : ''}`

    return await synthesizeWithAI(message, '', [], intent, history, session, correlationId, knowledgeContext)
  }

  // 9. Need clarification
  if (sourceSelection.needClarification) {
    trace('clarification', 'clarification', 'requested')
    return {
      text: '¿Podrías darme más detalles sobre lo que necesitas saber? Así puedo ofrecerte una respuesta más precisa.',
      intent, answerType: 'CLARIFICATION_REQUIRED', sources: [],
      confidence: 'low', provider: 'local', model: 'clarification', knowledgeUsed: false, correlationId,
    }
  }

  // 10. Need human review
  if (sourceSelection.needHumanReview) {
    trace('human_review', 'human_review', 'requested')
    return {
      text: 'Esta consulta requiere revisión por un administrador. Te recomiendo contactar con soporte para obtener asistencia personalizada.',
      intent, answerType: 'HUMAN_REVIEW_REQUIRED', sources: [],
      confidence: 'low', provider: 'local', model: 'human-review', knowledgeUsed: false, correlationId,
    }
  }

  // 11. No knowledge, no providers configured
  const providerMsg = availableProviders.length === 0 ? getProviderNotConfiguredMessage() : ''
  const text = providerMsg
    ? `${providerMsg}\n\nSobre tu pregunta específica, no tengo información en mi base de conocimiento actual. ¿Puedo ayudarte con otro tema?`
    : 'No tengo información específica sobre esa consulta en mi base de conocimiento actual. ¿Puedo ayudarte con otro tema del ecosistema MSM?'

  trace('knowledge', 'no_knowledge', 'empty')
  recordAction('eliana', 'no_knowledge', message, 'Sin conocimiento directo', intent, false, 'Necesita cargarse en base de conocimiento')
  return { text, intent, answerType: 'ANSWERED', sources: [], confidence: 'low', provider: 'local', model: 'no-knowledge', knowledgeUsed: false, correlationId }
}

async function synthesizeWithAI(
  message: string,
  ragResponse: string,
  ragSources: string[],
  intent: Intent,
  history: Array<{ role: string; text: string }> | undefined,
  session: { email?: string; name?: string } | undefined,
  correlationId: string,
  extraContext?: string
): Promise<RoutedResponse> {
  const ctx = buildContext(session)
  const convHistory = buildConversationHistory(history || [])
  const userSummary = getUserSummary(session?.email || '')

  const knowledgeContext = ragResponse
    ? `Información relevante de la base de conocimiento de ZAFIRO:\n${ragResponse}`
    : extraContext || ''

  const systemPrompt = `${ctx.systemPrompt}\n\n${userSummary ? `Datos del usuario:\n${userSummary}` : ''}\n\n${knowledgeContext}\n\nInstrucciones:\n- Responde directamente la pregunta del usuario.\n- Usa la información proporcionada solo cuando sea pertinente.\n- Si no tienes información suficiente, dilo con claridad.\n- No menciones que tienes acceso a un contexto interno.\n- No muestres encabezados de documentos ni etiquetas técnicas.\n- Usa español por defecto, respeta el idioma del usuario.\n- Párrafos cortos, lenguaje claro.`

  const aiResult = await callAIWithFallback(message, convHistory, systemPrompt)
  if (aiResult.text) {
    const validated = validateResponse(aiResult.text)
    const cleanText = ensureNaturalLanguage(validateResponseForSecrets(validated.text))
    recordAction('eliana', 'ai_response', message, cleanText.slice(0, 100), intent, true)
    return {
      text: cleanText,
      intent,
      answerType: 'ANSWERED',
      sources: ragSources,
      confidence: 'high',
      provider: aiResult.provider || 'ai',
      model: aiResult.model || 'provider',
      knowledgeUsed: true,
      correlationId,
    }
  }

  const fallbackText = ragResponse
    ? synthesizeKnowledgeLocally(ragResponse, message)
    : 'Estoy procesando tu consulta. Déjame consultar la información disponible para darte una respuesta completa.'

  return {
    text: fallbackText,
    intent,
    answerType: 'ANSWERED',
    sources: ragSources,
    confidence: ragSources.length > 0 ? 'medium' : 'low',
    provider: 'knowledge',
    model: 'rag-local',
    knowledgeUsed: true,
    correlationId,
  }
}

function synthesizeKnowledgeLocally(rawKnowledge: string, originalQuery: string): string {
  let clean = sanitizeOutput(rawKnowledge)
  clean = clean.replace(/^#+\s*/gm, '')

  const queryLower = originalQuery.toLowerCase()

  if (clean.length > 600) {
    const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean]
    const relevant = sentences.filter(s => {
      const words = queryLower.split(/\s+/).filter(w => w.length > 3)
      return words.length === 0 || words.some(w => s.toLowerCase().includes(w))
    })
    if (relevant.length > 0) {
      clean = relevant.join(' ')
    }
    if (clean.length > 800) {
      clean = clean.slice(0, 800).replace(/[^.!?]*$/, '')
    }
  }

  if (/qué es|qué son/i.test(queryLower) && !/es un|es una|se refiere/i.test(clean)) {
    const lines = clean.split('\n').filter(l => l.trim().length > 0)
    if (lines.length > 0) {
      clean = lines[0]
      if (lines.length > 1) clean += ' ' + lines.slice(1, 3).join(' ')
    }
  }

  return clean.trim()
}

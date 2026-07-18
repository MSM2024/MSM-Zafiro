import { callAI } from '@/lib/ai/providers'

export interface ProviderStatus {
  primaryAvailable: boolean
  fallbackAvailable: boolean
  activeProvider: string
  activeModel: string
}

export function getProviderStatus(): ProviderStatus {
  const hasGemini = !!process.env.GEMINI_API_KEY
  const hasOpenAI = !!process.env.OPENAI_API_KEY
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY

  return {
    primaryAvailable: hasGemini || hasOpenAI,
    fallbackAvailable: hasAnthropic || hasOpenAI || hasGemini,
    activeProvider: hasGemini ? 'Gemini' : hasOpenAI ? 'OpenAI' : hasAnthropic ? 'Anthropic' : 'none',
    activeModel: hasGemini ? 'gemini-1.5-flash' : hasOpenAI ? 'gpt-4o-mini' : hasAnthropic ? 'claude-3-haiku' : 'local',
  }
}

export function getAvailableProviders(): string[] {
  const providers: string[] = []
  if (process.env.GEMINI_API_KEY) providers.push('Gemini')
  if (process.env.OPENAI_API_KEY) providers.push('OpenAI')
  if (process.env.ANTHROPIC_API_KEY) providers.push('Anthropic')
  return providers
}

export async function callAIWithFallback(
  message: string,
  history: Array<{ role: string; text: string }>,
  systemPrompt: string,
  knowledgeContext?: string
): Promise<{ text: string; provider: string; model: string }> {
  const enhancedPrompt = knowledgeContext
    ? `${systemPrompt}\n\nInformación relevante:\n${knowledgeContext}\n\nResponde en lenguaje natural usando esta información cuando sea pertinente. No menciones que tienes un contexto interno.`
    : systemPrompt

  const result = await callAI(message, history, enhancedPrompt)
  return result
}

export function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase()

  if (/hola|buenas|saludos|hey|hi|hello/i.test(lower)) {
    return '¡Hola! Soy ELIANA, tu asistente en ZAFIRO. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre la plataforma, tu perfil, membresías, o cualquier tema del ecosistema MSM.'
  }

  if (/gracias|thanks|thank you/i.test(lower)) {
    return '¡De nada! Estoy aquí para lo que necesites dentro de ZAFIRO. Si tienes más preguntas, no dudes en escribirme.'
  }

  if (/adi[oó]s|bye|chao|hasta luego/i.test(lower)) {
    return 'Hasta luego. Recuerda que estoy disponible cuando me necesites en ZAFIRO. ¡Cuídate!'
  }

  return ''
}

export function getProviderNotConfiguredMessage(): string {
  return 'Proveedor externo pendiente de configuración. Puedo ayudarte con información general sobre ZAFIRO y el ecosistema MSM basada en mi conocimiento local.'
}

import { ragQuery } from '../knowledge/rag-engine'
import { classifyIntent } from '../intent-classifier'
import { isOwnerSession } from '../owner-firewall'

export type SourceType = 'knowledge' | 'ai_provider' | 'external_search' | 'clarification' | 'human_review'

export interface SourceSelection {
  source: SourceType
  needClarification: boolean
  needHumanReview: boolean
  needExternalData: boolean
  confidence: number
  provider?: string
  ragFound: boolean
  queryType: string
}

const CLARIFICATION_PATTERNS = [
  /qué\s*es/i,
  /cómo\s*funciona/i,
  /expl[ií]came/i,
  /dime\s*sobre/i,
  /qu[eé]\s*sabes/i,
]

const HUMAN_REVIEW_PATTERNS = [
  /eliminar\s*cuenta/i,
  /borrar\s*mi\s*cuenta/i,
  /cancelar\s*pago/i,
  /reembolso/i,
  /disputa/i,
  /violaci[oó]n/i,
  /abuso/i,
  /demanda/i,
  /legal/i,
  /abogado/i,
]

const EXTERNAL_DATA_PATTERNS = [
  /inventario/i,
  /pedido/i,
  /saldo/i,
  /estado\s*de\s*mi/i,
  /mis\s*(pedidos?|compras?|ventas?)/i,
  /cu[áa]nto\s*tengo/i,
]

export function selectSource(
  message: string,
  intent: string,
  isOwner: boolean,
  availableProviders: string[]
): SourceSelection {
  const rag = ragQuery(message)
  const lower = message.toLowerCase()

  const needHumanReview = HUMAN_REVIEW_PATTERNS.some(p => p.test(message))
  const needExternalData = EXTERNAL_DATA_PATTERNS.some(p => p.test(message))
  const needClarification = !rag.found && CLARIFICATION_PATTERNS.some(p => p.test(message))

  let source: SourceType = 'knowledge'
  let confidence = 0

  if (rag.found) {
    source = 'knowledge'
    confidence = rag.confidence === 'high' ? 0.9 : rag.confidence === 'medium' ? 0.7 : 0.5
  } else if (availableProviders.length > 0) {
    source = 'ai_provider'
    confidence = 0.6
  } else if (needClarification) {
    source = 'clarification'
    confidence = 0.4
  } else {
    source = 'human_review'
    confidence = 0.3
  }

  if (needHumanReview && source !== 'knowledge') {
    source = 'human_review'
    confidence = Math.min(confidence, 0.5)
  }

  return {
    source,
    needClarification,
    needHumanReview,
    needExternalData,
    confidence,
    provider: source === 'ai_provider' ? availableProviders[0] : undefined,
    ragFound: rag.found,
    queryType: intent,
  }
}

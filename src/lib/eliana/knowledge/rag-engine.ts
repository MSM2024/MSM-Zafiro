// RAG Engine — Pipeline completo: clasificar, buscar, priorizar, responder
// Frecuencia 369-777
// Implementa la regla madre: nunca responder con frases genéricas si hay información disponible

import { DOMAIN_ENTRIES, type DomainEntry } from './domain-data'
import { getDomains, getSourcePriorityWeight, isDomainCovered, type SourcePriority } from './knowledge-registry'
import { queryKnowledge, formatKnowledgeContext, getDocuments, type KnowledgeDocument } from './retrieval'
import { getActiveRules } from '../feedback'

export interface RAGResult {
  found: boolean
  response: string
  sources: string[]
  domain?: string
  confidence: 'high' | 'medium' | 'low'
}

function findDomainEntries(query: string): DomainEntry[] {
  const lower = query.toLowerCase()
  const words = lower.split(/\s+/).filter(w => w.length > 2)

  const scored = DOMAIN_ENTRIES.map(entry => {
    let score = 0

    // Title match
    if (entry.title.toLowerCase().includes(lower)) score += 15

    // Domain match
    if (entry.domain && lower.includes(entry.domain.replace(/_/g, ' '))) score += 10

    // Tag matches
    for (const tag of entry.tags) {
      if (lower.includes(tag.toLowerCase())) score += 5
    }

    // Keyword matches in content
    for (const word of words) {
      if (entry.content.toLowerCase().includes(word)) score += 2
    }

    // Priority boost
    score += entry.priority * 0.5

    return { entry, score }
  })

  return scored
    .filter(s => s.score > 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.entry)
}

function findKnowledgeDocs(query: string): KnowledgeDocument[] {
  const docs = getDocuments()
  const lower = query.toLowerCase()
  const words = lower.split(/\s+/).filter(w => w.length > 2)

  const scored = docs.map(doc => {
    let score = 0

    if (doc.title.toLowerCase().includes(lower)) score += 10
    if (doc.category && lower.includes(doc.category.toLowerCase())) score += 5

    for (const word of words) {
      if (doc.title.toLowerCase().includes(word)) score += 3
      if (doc.content.toLowerCase().includes(word)) score += 1
    }

    return { doc, score }
  })

  return scored
    .filter(s => s.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.doc)
}

function formatResponse(entries: DomainEntry[], docs: KnowledgeDocument[], query: string): RAGResult {
  const seen = new Set<string>()
  const sources: string[] = []
  const parts: string[] = []

  // Add domain entries (higher priority)
  for (const entry of entries) {
    if (seen.size >= 3) break
    const key = entry.title
    if (seen.has(key)) continue
    seen.add(key)

    parts.push(entry.content)
    sources.push(`${entry.title} (fuente: ${entry.source})`)
  }

  // Add retrieval chunks
  if (docs.length > 0 && seen.size < 3) {
    for (const doc of docs) {
      if (seen.size >= 3) break
      const key = doc.title
      if (seen.has(key)) continue
      seen.add(key)

      const snippet = doc.content.length > 500 ? doc.content.slice(0, 500) + '...' : doc.content
      parts.push(snippet)
      sources.push(`${doc.title} (categoría: ${doc.category})`)
    }
  }

  if (parts.length === 0) {
    return { found: false, response: '', sources: [], confidence: 'low' }
  }

  const response = parts.join('\n\n')
  const confidence = sources.length >= 2 ? 'high' : sources.length === 1 ? 'medium' : 'low'

  return { found: true, response, sources, confidence }
}

export function ragQuery(query: string): RAGResult {
  if (!query || query.trim().length < 2) {
    return { found: false, response: '', sources: [], confidence: 'low' }
  }

  const domainEntries = findDomainEntries(query)
  const knowledgeDocs = findKnowledgeDocs(query)
  const coverage = isDomainCovered(query)

  // Apply source priority ordering
  const result = formatResponse(domainEntries, knowledgeDocs, query)

  if (!result.found) {
    // Check if the domain is known but has no data yet
    if (coverage.covered && coverage.domain) {
      const domain = coverage.domain
      if (domain.status === 'partial') {
        return {
          found: true,
          response: `Tengo información parcial sobre ${domain.name}. Actualmente hay ${domain.docCount} documentos cargados en esta categoría. ¿Hay algo específico que quieras saber?`,
          sources: [`Dominio: ${domain.name} (${domain.status})`],
          domain: domain.id,
          confidence: 'low',
        }
      }
      if (domain.status === 'missing') {
        return {
          found: true,
          response: `El dominio ${domain.name} está identificado pero el conocimiento específico aún no ha sido cargado en mi base. Está en mi lista de prioridades. ¿Puedo ayudarte con otro tema del ecosistema MSM?`,
          sources: [`Dominio: ${domain.name} (no cargado)`],
          domain: domain.id,
          confidence: 'low',
        }
      }
    }

    return { found: false, response: '', sources: [], confidence: 'low' }
  }

  return { ...result, domain: coverage.domain?.id }
}

export function buildEnhancedKnowledgeContext(query: string): string {
  const rag = ragQuery(query)
  if (!rag.found) return ''

  const rules = getActiveRules()
  const rulesContext = rules.length > 0
    ? `\n\nReglas activas desde feedback:\n${rules.map(r => `- ${r.rule}`).join('\n')}`
    : ''

  const sourceLines = rag.sources.map(s => `  📖 ${s}`).join('\n')

  return `## CONOCIMIENTO AUTORIZADO\n\n${rag.response}\n\n## FUENTES\n${sourceLines}${rulesContext}`
}

export function hasKnowledgeFor(query: string): boolean {
  return ragQuery(query).found
}

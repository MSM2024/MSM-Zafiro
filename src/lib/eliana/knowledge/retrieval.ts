// Retrieval de Conocimiento — Búsqueda y recuperación de chunks
// Almacenamiento local con estructura por categorías

import { chunkText, searchChunks, type KnowledgeChunk } from './chunker'

const CHUNKS_KEY = 'zafiro_eliana_knowledge_chunks'
const DOCUMENTS_KEY = 'zafiro_eliana_knowledge_docs'

export interface KnowledgeDocument {
  id: string
  title: string
  category: string
  content: string
  chunkCount: number
  version: number
  createdAt: string
  updatedAt: string
}

const CATEGORIES = [
  'MSM', 'ZAFIRO', 'CAJEROS', 'MENTE_MAESTRA',
  'LA_SUIZA', 'VILLA_ESPERANZA', 'ECONOMIA', 'WHATSAPP',
] as const

export type KnowledgeCategory = typeof CATEGORIES[number]

function loadChunks(): KnowledgeChunk[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(CHUNKS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveChunks(chunks: KnowledgeChunk[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CHUNKS_KEY, JSON.stringify(chunks))
}

function loadDocuments(): KnowledgeDocument[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(DOCUMENTS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveDocuments(docs: KnowledgeDocument[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(docs))
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function addKnowledgeDocument(
  title: string,
  content: string,
  category: KnowledgeCategory
): { document: KnowledgeDocument; chunks: KnowledgeChunk[] } {
  const docId = generateId()
  const now = new Date().toISOString()

  const chunks = chunkText(content, title, category, docId)
  const document: KnowledgeDocument = {
    id: docId,
    title,
    category,
    content,
    chunkCount: chunks.length,
    version: 1,
    createdAt: now,
    updatedAt: now,
  }

  const existingDocs = loadDocuments()
  existingDocs.push(document)
  saveDocuments(existingDocs)

  const existingChunks = loadChunks()
  existingChunks.push(...chunks)
  saveChunks(existingChunks)

  return { document, chunks }
}

export function getDocuments(): KnowledgeDocument[] {
  return loadDocuments()
}

export function getDocumentsByCategory(category: KnowledgeCategory): KnowledgeDocument[] {
  return loadDocuments().filter(d => d.category === category)
}

export function getChunksByDocument(docId: string): KnowledgeChunk[] {
  return loadChunks().filter(c => c.documentId === docId)
}

export function getAllChunks(): KnowledgeChunk[] {
  return loadChunks()
}

export function queryKnowledge(query: string, maxResults = 5): KnowledgeChunk[] {
  const chunks = loadChunks()
  if (chunks.length === 0) return []
  return searchChunks(query, chunks, maxResults)
}

export function formatKnowledgeContext(query: string): string {
  const results = queryKnowledge(query)
  if (results.length === 0) return ''

  const groupedByCategory: Record<string, string[]> = {}
  for (const r of results) {
    const cat = r.category || 'General'
    if (!groupedByCategory[cat]) groupedByCategory[cat] = []
    const line = `[${r.title}] ${r.content.slice(0, 500)}`
    if (!groupedByCategory[cat].includes(line)) {
      groupedByCategory[cat].push(line)
    }
  }

  return Object.entries(groupedByCategory)
    .map(([cat, lines]) => `--- ${cat} ---\n${lines.join('\n\n')}`)
    .join('\n\n')
}

export function deleteDocument(docId: string): void {
  let docs = loadDocuments()
  docs = docs.filter(d => d.id !== docId)
  saveDocuments(docs)

  let chunks = loadChunks()
  chunks = chunks.filter(c => c.documentId !== docId)
  saveChunks(chunks)
}

export function getCategories(): typeof CATEGORIES {
  return CATEGORIES
}

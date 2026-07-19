// Chunker de Conocimiento — Divide textos largos en chunks < 1800 caracteres
// para almacenamiento y búsqueda por embeddings

export interface KnowledgeChunk {
  id: string
  documentId: string
  title: string
  category: string
  content: string
  index: number
  totalChunks: number
  createdAt: string
}

const MAX_CHUNK_LENGTH = 1800
const OVERLAP_CHARS = 100

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function chunkText(text: string, title: string, category: string, documentId?: string): KnowledgeChunk[] {
  const docId = documentId || generateId()
  const chunks: KnowledgeChunk[] = []
  const now = new Date().toISOString()

  let start = 0
  let index = 0

  while (start < text.length) {
    let end = Math.min(start + MAX_CHUNK_LENGTH, text.length)

    // Try to break at a sentence boundary
    if (end < text.length) {
      const searchEnd = Math.min(end + 200, text.length)
      const afterText = text.slice(end, searchEnd)
      const sentenceBreak = afterText.search(/[.!?\n]+\s*/)
      if (sentenceBreak !== -1 && sentenceBreak < 150) {
        end += sentenceBreak + 1
      } else {
        // Fallback: break at word boundary
        const searchBack = text.slice(Math.max(0, end - 60), end)
        const wordBreak = searchBack.lastIndexOf(' ')
        if (wordBreak !== -1 && wordBreak > 20) {
          end = Math.max(0, end - 60) + wordBreak
        }
      }
    }

    chunks.push({
      id: generateId(),
      documentId: docId,
      title,
      category,
      content: text.slice(start, end).trim(),
      index,
      totalChunks: 0, // updated below
      createdAt: now,
    })

    index++
    start = Math.max(0, end - OVERLAP_CHARS)
  }

  // Update totalChunks
  for (const chunk of chunks) {
    chunk.totalChunks = chunks.length
  }

  return chunks
}

// Simple keyword-based relevance (embeddings stub until Supabase vector store)
export function searchChunks(
  query: string,
  chunks: KnowledgeChunk[],
  maxResults = 5
): KnowledgeChunk[] {
  const lowerQuery = query.toLowerCase()
  const keywords = lowerQuery.split(/\s+/).filter(w => w.length > 3)

  const scored = chunks.map(chunk => {
    const lowerContent = chunk.content.toLowerCase()
    let score = 0

    // Title match
    if (chunk.title.toLowerCase().includes(lowerQuery)) score += 5

    // Keyword matches
    for (const keyword of keywords) {
      const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      const matches = lowerContent.match(regex)
      if (matches) score += matches.length
    }

    // Exact phrase boost
    if (lowerContent.includes(lowerQuery)) score += 10

    // Category boost
    if (chunk.category.toLowerCase().includes(lowerQuery)) score += 3

    return { chunk, score }
  })

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(s => s.chunk)
}

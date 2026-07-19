'use client'

import type { Book, Chapter } from './types'
import { getChapters } from './storage'
import { chunkText } from '../eliana/knowledge/chunker'
import { addKnowledgeDocument } from '../eliana/knowledge/retrieval'

export function syncBookToEliana(book: Book) {
  const chapters = getChapters(book.id)

  const fullContent = chapters
    .map(ch => `## Capítulo ${ch.index}: ${ch.title}\n\n${ch.content}`)
    .join('\n\n')

  addKnowledgeDocument(
    book.title,
    fullContent,
    'ZAFIRO',
  )

  addKnowledgeDocument(
    `${book.title} — Metadata`,
    `Título: ${book.title}\nAutor: ${book.authorName}\nPublicado: ${book.publishedAt || 'No publicado'}\nCapítulos: ${book.chapterCount}\nDerechos: ${book.copyright}`,
    'ZAFIRO',
  )
}

export function syncChapterToEliana(book: Book, chapter: Chapter) {
  const fullContent = `## ${book.title} — Capítulo ${chapter.index}: ${chapter.title}\n\n${chapter.content}`
  addKnowledgeDocument(
    `${book.title} — Capítulo ${chapter.index}`,
    fullContent,
    'ZAFIRO',
  )
}

export function removeBookFromEliana(bookTitle: string) {
  try {
    const key = 'zafiro_eliana_knowledge_docs'
    const raw = localStorage.getItem(key)
    if (!raw) return
    const docs = JSON.parse(raw)
    const filtered = docs.filter((d: any) => !d.title.startsWith(bookTitle))
    localStorage.setItem(key, JSON.stringify(filtered))

    const chunksKey = 'zafiro_eliana_knowledge_chunks'
    const chunksRaw = localStorage.getItem(chunksKey)
    if (!chunksRaw) return
    const chunks = JSON.parse(chunksRaw)
    const filteredChunks = chunks.filter((c: any) => !c.documentId?.startsWith(bookTitle))
    localStorage.setItem(chunksKey, JSON.stringify(filteredChunks))
  } catch { /* silent */ }
}

'use client'

import type { Book, Chapter, BookStatus } from './types'
import { chunkText } from '../eliana/knowledge/chunker'
import { genId, now } from './helpers'
import { addBook, addChapters, updateBook, recordAuditEvent } from './storage'

export interface ImportResult {
  book: Book
  chapters: Chapter[]
  preview: {
    title: string
    chapterCount: number
    wordCount: number
    lines: string[]
  }
}

function detectTitle(content: string): string {
  const lines = content.split('\n').filter(l => l.trim())
  if (lines.length === 0) return 'Libro sin título'

  const firstLine = lines[0].trim()
  if (firstLine.startsWith('# ')) return firstLine.slice(2).trim()
  if (firstLine.startsWith('#')) return firstLine.slice(1).trim()

  const titleLine = lines.find(l =>
    l.trim().startsWith('TÍTULO:') || l.trim().startsWith('TITULO:') ||
    l.trim().startsWith('Title:') || l.trim().startsWith('title:')
  )
  if (titleLine) return titleLine.split(':').slice(1).join(':').trim()

  return lines[0].trim().slice(0, 100)
}

function detectChapters(content: string): { title: string; body: string }[] {
  const chapterRegex = /^#{1,3}\s+(?:Cap[íi]tulo|Chapter)\s+\d+/gim
  const numericRegex = /^(?:Cap[íi]tulo|Chapter)\s+\d+/gim
  const lines = content.split('\n')
  const chapters: { title: string; body: string }[] = []
  let currentTitle = 'Introducción'
  let currentBody: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (chapterRegex.test(line) || numericRegex.test(line)) {
      if (currentBody.length > 0 || chapters.length > 0) {
        chapters.push({ title: currentTitle, body: currentBody.join('\n').trim() })
        currentBody = []
      }
      currentTitle = line.replace(/^#+\s*/g, '').trim()
      continue
    }

    const hashes = line.match(/^#{1,3}\s+(.+)/)
    if (hashes && chapters.length > 0) {
      if (currentBody.length > 0) {
        chapters.push({ title: currentTitle, body: currentBody.join('\n').trim() })
        currentBody = []
      }
      currentTitle = hashes[1].trim()
      continue
    }

    if (line.trim() || currentBody.length > 0) {
      currentBody.push(line)
    }
  }

  if (currentBody.length > 0) {
    chapters.push({ title: currentTitle, body: currentBody.join('\n').trim() })
  }

  return chapters.length > 0 ? chapters : [{ title: 'Contenido', body: content.trim() }]
}

export function importBookFromText(
  title: string,
  content: string,
  authorName: string = 'Don Miguel Soria Martínez',
): ImportResult {
  const detectedTitle = detectTitle(content)
  const rawChapters = detectChapters(content)
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length

  const book: Book = {
    id: genId(),
    title: title || detectedTitle,
    authorName,
    description: rawChapters.length > 0
      ? rawChapters[0].body.slice(0, 300).replace(/\n/g, ' ')
      : 'Sin descripción',
    biography: '',
    coverColor: '#00D9FF',
    format: 'txt',
    status: 'SUBIDO',
    chapterCount: rawChapters.length,
    currentChapterIndex: 0,
    copyright: `© ${new Date().getFullYear()} ${authorName}. Todos los derechos reservados.`,
    rightsReserved: true,
    wordCount,
    tags: [],
    createdAt: now(),
    updatedAt: now(),
  }

  const chapters: Chapter[] = rawChapters.map((ch, i) => ({
    id: genId(),
    bookId: book.id,
    index: i + 1,
    title: ch.title,
    content: ch.body,
    wordCount: ch.body.split(/\s+/).filter(w => w.length > 0).length,
    createdAt: now(),
  }))

  addBook(book)
  addChapters(chapters)
  updateBook(book.id, { chapterCount: chapters.length })
  recordAuditEvent('LIBRO_SUBIDO', book.id, `${chapters.length} capítulos, ${wordCount} palabras`)

  return {
    book,
    chapters,
    preview: {
      title: book.title,
      chapterCount: chapters.length,
      wordCount,
      lines: content.split('\n').slice(0, 50).filter(l => l.trim()),
    },
  }
}

export function advanceBookStatus(bookId: string): BookStatus | null {
  const { getBook, updateBook } = require('./storage')
  const book = getBook(bookId)
  if (!book) return null

  const flow: BookStatus[] = ['SUBIDO', 'VALIDADO', 'ESTRUCTURADO', 'EN_REVISION', 'APROBADO', 'PUBLICADO']
  const currentIdx = flow.indexOf(book.status)
  if (currentIdx === -1 || currentIdx >= flow.length - 1) return null

  const nextStatus = flow[currentIdx + 1]
  const updates: Partial<Book> = { status: nextStatus }
  if (nextStatus === 'PUBLICADO') updates.publishedAt = new Date().toISOString()

  updateBook(bookId, updates)
  recordAuditEvent(`LIBRO_${nextStatus}`, bookId, `Desde ${book.status}`)
  return nextStatus
}

export function archiveBook(bookId: string) {
  updateBook(bookId, { status: 'ARCHIVADO' })
  recordAuditEvent('LIBRO_ARCHIVADO', bookId)
}

export function publishBook(bookId: string) {
  updateBook(bookId, { status: 'PUBLICADO', publishedAt: new Date().toISOString() })
  recordAuditEvent('LIBRO_PUBLICADO', bookId)
}

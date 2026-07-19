'use client'

import type { Book, Chapter, Bookmark, ReadingNote, ReadingProgress, BookStatus } from './types'
import { genId, now, lsGet, lsSet } from './helpers'

const BOOKS_KEY = 'zafiro_biblioteca_libros'
const CHAPTERS_KEY = 'zafiro_biblioteca_capitulos'
const BOOKMARKS_KEY = 'zafiro_biblioteca_marcadores'
const NOTES_KEY = 'zafiro_biblioteca_notas'
const PROGRESS_KEY = 'zafiro_biblioteca_progreso'

function genOperationId(): string {
  return `op_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function getBooks(): Book[] {
  return lsGet<Book[]>(BOOKS_KEY, [])
}

export function saveBooks(books: Book[]) {
  lsSet(BOOKS_KEY, books)
}

export function getBook(bookId: string): Book | undefined {
  return getBooks().find(b => b.id === bookId)
}

export function addBook(book: Book): Book {
  const books = getBooks()
  books.push(book)
  saveBooks(books)
  return book
}

export function updateBook(bookId: string, updates: Partial<Book>): Book | undefined {
  const books = getBooks()
  const idx = books.findIndex(b => b.id === bookId)
  if (idx === -1) return undefined
  books[idx] = { ...books[idx], ...updates, updatedAt: now() }
  saveBooks(books)
  return books[idx]
}

export function deleteBook(bookId: string) {
  const books = getBooks().filter(b => b.id !== bookId)
  saveBooks(books)
  const chapters = getChapters().filter(c => c.bookId !== bookId)
  saveChapters(chapters)
  const marks = getBookmarks().filter(m => m.bookId !== bookId)
  saveBookmarks(marks)
  const notes = getNotes().filter(n => n.bookId !== bookId)
  saveNotes(notes)
}

export function getChapters(bookId?: string): Chapter[] {
  const all = lsGet<Chapter[]>(CHAPTERS_KEY, [])
  return bookId ? all.filter(c => c.bookId === bookId).sort((a, b) => a.index - b.index) : all
}

export function saveChapters(chapters: Chapter[]) {
  lsSet(CHAPTERS_KEY, chapters)
}

export function getChapter(chapterId: string): Chapter | undefined {
  return getChapters().find(c => c.id === chapterId)
}

export function addChapter(chapter: Chapter) {
  const chapters = getChapters()
  chapters.push(chapter)
  saveChapters(chapters)
}

export function addChapters(chapters: Chapter[]) {
  const existing = getChapters()
  existing.push(...chapters)
  saveChapters(existing)
}

export function updateChapter(chapterId: string, updates: Partial<Chapter>) {
  const chapters = getChapters()
  const idx = chapters.findIndex(c => c.id === chapterId)
  if (idx === -1) return
  chapters[idx] = { ...chapters[idx], ...updates }
  saveChapters(chapters)
}

export function getBookmarks(bookId?: string): Bookmark[] {
  const all = lsGet<Bookmark[]>(BOOKMARKS_KEY, [])
  return bookId ? all.filter(m => m.bookId === bookId) : all
}

export function saveBookmarks(marks: Bookmark[]) {
  lsSet(BOOKMARKS_KEY, marks)
}

export function addBookmark(bookmark: Bookmark) {
  const marks = getBookmarks()
  marks.push(bookmark)
  saveBookmarks(marks)
}

export function removeBookmark(markId: string) {
  saveBookmarks(getBookmarks().filter(m => m.id !== markId))
}

export function getNotes(bookId?: string): ReadingNote[] {
  const all = lsGet<ReadingNote[]>(NOTES_KEY, [])
  return bookId ? all.filter(n => n.bookId === bookId) : all
}

export function saveNotes(notes: ReadingNote[]) {
  lsSet(NOTES_KEY, notes)
}

export function addNote(note: ReadingNote) {
  const notes = getNotes()
  notes.push(note)
  saveNotes(notes)
}

export function removeNote(noteId: string) {
  saveNotes(getNotes().filter(n => n.id !== noteId))
}

export function getProgress(bookId: string): ReadingProgress | undefined {
  const all = lsGet<Record<string, ReadingProgress>>(PROGRESS_KEY, {})
  return all[bookId]
}

export function saveProgress(bookId: string, progress: ReadingProgress) {
  const all = lsGet<Record<string, ReadingProgress>>(PROGRESS_KEY, {})
  all[bookId] = progress
  lsSet(PROGRESS_KEY, all)
}

export function recordAuditEvent(eventType: string, bookId: string, detail?: string) {
  try {
    const key = 'zafiro_v2_events'
    const events = lsGet<any[]>(key, [])
    events.push({
      id: genId(),
      entityType: 'biblioteca_libro',
      entityId: bookId,
      eventType,
      metadata: detail ? { detail } : {},
      operationId: genOperationId(),
      createdAt: now(),
    })
    if (events.length > 500) events.splice(0, events.length - 500)
    lsSet(key, events)
  } catch { /* silent */ }
}

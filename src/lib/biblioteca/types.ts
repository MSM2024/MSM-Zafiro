'use client'

export type BookStatus = 'SUBIDO' | 'VALIDADO' | 'ESTRUCTURADO' | 'EN_REVISION' | 'APROBADO' | 'PUBLICADO' | 'ARCHIVADO'
export type BookFormat = 'txt' | 'md' | 'pdf' | 'docx' | 'epub'

export interface Book {
  id: string
  title: string
  subtitle?: string
  authorName: string
  description: string
  biography: string
  coverColor: string
  isbn?: string
  format: BookFormat
  status: BookStatus
  chapterCount: number
  currentChapterIndex: number
  copyright: string
  rightsReserved: boolean
  hashSha256?: string
  wordCount: number
  tags: string[]
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface Chapter {
  id: string
  bookId: string
  index: number
  title: string
  content: string
  wordCount: number
  createdAt: string
}

export interface Bookmark {
  id: string
  bookId: string
  chapterId: string
  chapterIndex: number
  label: string
  location: number
  createdAt: string
}

export interface ReadingNote {
  id: string
  bookId: string
  chapterId: string
  chapterIndex: number
  text: string
  location: number
  color: string
  createdAt: string
}

export interface ReadingProgress {
  bookId: string
  currentChapterId: string
  currentChapterIndex: number
  scrollPosition: number
  completedChapters: string[]
  lastReadAt: string
  totalReadingTimeMs: number
}

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  SUBIDO: 'Subido',
  VALIDADO: 'Validado',
  ESTRUCTURADO: 'Estructurado',
  EN_REVISION: 'En Revisión',
  APROBADO: 'Aprobado',
  PUBLICADO: 'Publicado',
  ARCHIVADO: 'Archivado',
}

export const BOOK_STATUS_COLORS: Record<BookStatus, string> = {
  SUBIDO: 'text-slate-400',
  VALIDADO: 'text-blue-400',
  ESTRUCTURADO: 'text-cyan-400',
  EN_REVISION: 'text-amber-400',
  APROBADO: 'text-emerald-400',
  PUBLICADO: 'text-[#00D9FF]',
  ARCHIVADO: 'text-slate-600',
}

export const BOOK_STATUS_BG: Record<BookStatus, string> = {
  SUBIDO: 'bg-slate-500/10 border-slate-500/20',
  VALIDADO: 'bg-blue-500/10 border-blue-500/20',
  ESTRUCTURADO: 'bg-cyan-500/10 border-cyan-500/20',
  EN_REVISION: 'bg-amber-500/10 border-amber-500/20',
  APROBADO: 'bg-emerald-500/10 border-emerald-500/20',
  PUBLICADO: 'bg-[#00D9FF]/10 border-[#00D9FF]/20',
  ARCHIVADO: 'bg-slate-600/10 border-slate-600/20',
}

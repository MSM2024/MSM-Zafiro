'use client'

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "motion/react"
import {
  ArrowLeft, BookOpen, ChevronLeft, ChevronRight, BookmarkIcon, BookMarked,
  Headphones, Pause, Play, FileText, CheckCircle, AlertTriangle,
  Plus, X, MessageSquareText, Eye, Archive, Loader2, Share2, Search
} from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import { isOwnerEmail } from "@/lib/owner"
import {
  getBook, getChapters, getChapter, addBookmark, removeBookmark,
  getBookmarks, addNote, removeNote, getNotes, getProgress, saveProgress,
  updateBook, updateChapter, recordAuditEvent,
} from "@/lib/biblioteca/storage"
import { publishBook, archiveBook, advanceBookStatus } from "@/lib/biblioteca/importador"
import { syncBookToEliana } from "@/lib/biblioteca/eliana-bridge"
import type { Book, Chapter, Bookmark, ReadingNote, ReadingProgress, BookStatus } from "@/lib/biblioteca/types"
import { BOOK_STATUS_LABELS, BOOK_STATUS_COLORS, BOOK_STATUS_BG } from "@/lib/biblioteca/types"

export default function BookReaderPage() {
  const params = useParams()
  const bookId = params.bookId as string
  const router = useRouter()
  const contentRef = useRef<HTMLDivElement>(null)

  const [book, setBook] = useState<Book | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null)
  const [chapterIdx, setChapterIdx] = useState(0)
  const [marks, setMarks] = useState<Bookmark[]>([])
  const [notes, setNotes] = useState<ReadingNote[]>([])
  const [progress, setProgress] = useState<ReadingProgress | null>(null)
  const [session, setSession] = useState<any>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showNotes, setShowNotes] = useState(false)
  const [showMarks, setShowMarks] = useState(false)
  const [newNoteText, setNewNoteText] = useState("")
  const [newMarkLabel, setNewMarkLabel] = useState("")
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [audioPaused, setAudioPaused] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const refresh = useCallback(() => {
    const b = getBook(bookId)
    const chs = getChapters(bookId)
    setBook(b || null)
    setChapters(chs)
    setMarks(getBookmarks(bookId))
    setNotes(getNotes(bookId))
    setProgress(getProgress(bookId) || null)
    if (b) {
      const idx = b.currentChapterIndex || 0
      setChapterIdx(Math.min(idx, chs.length - 1))
      setCurrentChapter(chs[Math.min(idx, chs.length - 1)] || null)
    }
  }, [bookId])

  useEffect(() => {
    const s = getSession()
    if (!s) { router.replace("/auth/login"); return }
    setSession(s)
    setIsOwner(isOwnerEmail(s.email))
    refresh()
    setLoading(false)
  }, [router, refresh])

  const goToChapter = (idx: number) => {
    if (idx < 0 || idx >= chapters.length) return
    setChapterIdx(idx)
    setCurrentChapter(chapters[idx])
    const p: ReadingProgress = {
      bookId,
      currentChapterId: chapters[idx].id,
      currentChapterIndex: idx,
      scrollPosition: 0,
      completedChapters: progress?.completedChapters || [],
      lastReadAt: new Date().toISOString(),
      totalReadingTimeMs: (progress?.totalReadingTimeMs || 0) + 1000,
    }
    saveProgress(bookId, p)
    setProgress(p)
    if (contentRef.current) contentRef.current.scrollTop = 0
  }

  const markComplete = () => {
    if (!currentChapter || !progress) return
    const completed = progress.completedChapters.includes(currentChapter.id)
      ? progress.completedChapters
      : [...progress.completedChapters, currentChapter.id]
    const p: ReadingProgress = { ...progress, completedChapters: completed, lastReadAt: new Date().toISOString() }
    saveProgress(bookId, p)
    setProgress(p)
  }

  const toggleBookmark = () => {
    if (!currentChapter) return
    const existing = marks.find(m => m.chapterId === currentChapter.id)
    if (existing) {
      removeBookmark(existing.id)
      setMarks(getBookmarks(bookId))
      return
    }
    const mark: Bookmark = {
      id: crypto.randomUUID(),
      bookId,
      chapterId: currentChapter.id,
      chapterIndex: chapterIdx,
      label: newMarkLabel || `Capítulo ${chapterIdx + 1}`,
      location: 0,
      createdAt: new Date().toISOString(),
    }
    addBookmark(mark)
    setMarks(getBookmarks(bookId))
    setNewMarkLabel("")
  }

  const addNewNote = () => {
    if (!currentChapter || !newNoteText.trim()) return
    const note: ReadingNote = {
      id: crypto.randomUUID(),
      bookId,
      chapterId: currentChapter.id,
      chapterIndex: chapterIdx,
      text: newNoteText.trim(),
      location: 0,
      color: '#FFD700',
      createdAt: new Date().toISOString(),
    }
    addNote(note)
    setNotes(getNotes(bookId))
    setNewNoteText("")
  }

  const toggleAudio = () => {
    if (!currentChapter) return
    if (audioPlaying && !audioPaused) {
      speechSynthesis.pause()
      setAudioPaused(true)
      return
    }
    if (audioPaused) {
      speechSynthesis.resume()
      setAudioPaused(false)
      return
    }
    speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(currentChapter.content)
    utterance.lang = 'es-ES'
    utterance.rate = 0.9
    utterance.onend = () => { setAudioPlaying(false); setAudioPaused(false) }
    utteranceRef.current = utterance
    speechSynthesis.speak(utterance)
    setAudioPlaying(true)
    setAudioPaused(false)
  }

  const advance = (status: BookStatus) => {
    updateBook(bookId, { status })
    if (status === 'PUBLICADO') {
      const b = getBook(bookId)
      if (b) { updateBook(bookId, { publishedAt: new Date().toISOString() }); syncBookToEliana(b) }
    }
    recordAuditEvent(`LIBRO_${status}`, bookId)
    refresh()
  }

  useEffect(() => {
    return () => { speechSynthesis.cancel() }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00D9FF] animate-spin" />
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500">Libro no encontrado</p>
          <button onClick={() => router.push("/zafiro/biblioteca")} className="text-[#00D9FF] text-sm mt-2 hover:underline">
            Volver a biblioteca
          </button>
        </div>
      </div>
    )
  }

  const completedCount = progress?.completedChapters.length || 0
  const totalChapters = chapters.length

  return (
    <div className="min-h-screen bg-[#050816]">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-[#050816]/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push("/zafiro/biblioteca")} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <BookOpen className="w-4 h-4 text-[#00D9FF]" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{book.title}</p>
            <p className="text-[10px] text-slate-500">
              Capítulo {chapterIdx + 1} de {totalChapters} · {completedCount} completados
            </p>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${BOOK_STATUS_BG[book.status]} ${BOOK_STATUS_COLORS[book.status]}`}>
            {BOOK_STATUS_LABELS[book.status]}
          </span>

          <button onClick={() => setShowMarks(!showMarks)} className={`p-2 rounded-lg transition-all ${showMarks ? 'bg-[#00D9FF]/10 text-[#00D9FF]' : 'text-slate-400 hover:text-white'}`}>
            <BookMarked className="w-4 h-4" />
          </button>
          <button onClick={() => setShowNotes(!showNotes)} className={`p-2 rounded-lg transition-all ${showNotes ? 'bg-[#00D9FF]/10 text-[#00D9FF]' : 'text-slate-400 hover:text-white'}`}>
            <MessageSquareText className="w-4 h-4" />
          </button>
          <button onClick={toggleAudio} className={`p-2 rounded-lg transition-all ${audioPlaying ? 'bg-[#00D9FF]/10 text-[#00D9FF]' : 'text-slate-400 hover:text-white'}`}>
            {audioPlaying && !audioPaused ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar: Chapter list */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="sticky top-20">
            <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Contenido</p>
            <div className="space-y-1 max-h-[70vh] overflow-y-auto">
              {chapters.map((ch, i) => (
                <button
                  key={ch.id}
                  onClick={() => goToChapter(i)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-all ${
                    i === chapterIdx
                      ? 'bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20'
                      : progress?.completedChapters.includes(ch.id)
                        ? 'text-emerald-400 hover:bg-slate-800/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                  }`}
                >
                  <span className="text-[10px] opacity-60">#{i + 1}</span>{' '}
                  {ch.title.slice(0, 40)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div ref={contentRef} className="max-w-3xl mx-auto">
            {currentChapter && (
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  Capítulo {chapterIdx + 1}: {currentChapter.title}
                </h2>
                <p className="text-[10px] text-slate-500 mb-6">
                  {currentChapter.wordCount.toLocaleString()} palabras
                </p>

                <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap font-sans text-sm">
                  {currentChapter.content}
                </div>

                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-800">
                  <button
                    onClick={() => goToChapter(chapterIdx - 1)}
                    disabled={chapterIdx === 0}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                  </button>

                  <button onClick={markComplete} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all ${
                    progress?.completedChapters.includes(currentChapter.id)
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white'
                  }`}>
                    <CheckCircle className="w-3.5 h-3.5" />
                    {progress?.completedChapters.includes(currentChapter.id) ? 'Completado' : 'Marcar completo'}
                  </button>

                  <button onClick={toggleBookmark} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all ${
                    marks.find(m => m.chapterId === currentChapter.id)
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white'
                  }`}>
                    <BookmarkIcon className="w-3.5 h-3.5" />
                    {marks.find(m => m.chapterId === currentChapter.id) ? 'Marcado' : 'Marcador'}
                  </button>

                  <button
                    onClick={() => goToChapter(chapterIdx + 1)}
                    disabled={chapterIdx >= chapters.length - 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white disabled:opacity-30 transition-all ml-auto"
                  >
                    Siguiente <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        {(showNotes || showMarks) && (
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-20 bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              {showMarks && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-3">Marcadores</p>
                  {marks.length === 0 && <p className="text-[10px] text-slate-600">Sin marcadores</p>}
                  <div className="space-y-2 max-h-60 overflow-y-auto mb-3">
                    {marks.map(m => (
                      <div key={m.id} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                        <span className="text-xs text-slate-300 truncate">{m.label}</span>
                        <button onClick={() => { removeBookmark(m.id); setMarks(getBookmarks(bookId)) }} className="text-slate-500 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newMarkLabel}
                      onChange={e => setNewMarkLabel(e.target.value)}
                      placeholder="Nombre del marcador..."
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white placeholder-slate-600"
                    />
                    <button onClick={toggleBookmark} className="p-1.5 bg-[#00D9FF]/10 rounded-lg text-[#00D9FF]">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {showNotes && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-3">Notas</p>
                  {notes.length === 0 && <p className="text-[10px] text-slate-600">Sin notas</p>}
                  <div className="space-y-2 max-h-60 overflow-y-auto mb-3">
                    {notes.map(n => (
                      <div key={n.id} className="p-2 bg-slate-800/30 rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[11px] text-slate-300 flex-1">{n.text}</p>
                          <button onClick={() => { removeNote(n.id); setNotes(getNotes(bookId)) }} className="text-slate-500 hover:text-red-400 shrink-0">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[9px] text-slate-600 mt-1">Cap. {n.chapterIndex + 1}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={newNoteText}
                      onChange={e => setNewNoteText(e.target.value)}
                      placeholder="Escribe una nota..."
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white placeholder-slate-600"
                    />
                    <button onClick={addNewNote} className="p-1.5 bg-[#00D9FF]/10 rounded-lg text-[#00D9FF]">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar: Owner controls */}
      {isOwner && (
        <div className="sticky bottom-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
            <span className="text-[10px] text-slate-500 font-mono">Admin</span>
            {book.status === 'SUBIDO' && (
              <button onClick={() => advance('VALIDADO')} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold hover:bg-blue-500/20 transition-all">
                Validar
              </button>
            )}
            {book.status === 'VALIDADO' && (
              <button onClick={() => advance('ESTRUCTURADO')} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold hover:bg-cyan-500/20 transition-all">
                Estructurar
              </button>
            )}
            {book.status === 'ESTRUCTURADO' && (
              <button onClick={() => advance('EN_REVISION')} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold hover:bg-amber-500/20 transition-all">
                Enviar a revisión
              </button>
            )}
            {book.status === 'EN_REVISION' && (
              <button onClick={() => advance('APROBADO')} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold hover:bg-emerald-500/20 transition-all">
                Aprobar
              </button>
            )}
            {book.status === 'APROBADO' && (
              <button onClick={() => advance('PUBLICADO')} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20 text-[10px] font-bold hover:bg-[#00D9FF]/20 transition-all">
                <Eye className="w-3 h-3" /> Publicar
              </button>
            )}
            {book.status === 'PUBLICADO' && (
              <button onClick={() => advance('ARCHIVADO')} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-500/10 text-slate-400 border border-slate-500/20 text-[10px] font-bold hover:bg-slate-500/20 transition-all">
                <Archive className="w-3 h-3" /> Archivar
              </button>
            )}
            {book.status !== 'PUBLICADO' && book.status !== 'ARCHIVADO' && (
              <button onClick={() => advance('PUBLICADO')} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20 text-[10px] font-bold hover:bg-[#00D9FF]/20 transition-all ml-auto">
                <Eye className="w-3 h-3" /> Publicar ahora
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile chapter selector */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 px-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {chapters.map((ch, i) => (
            <button
              key={ch.id}
              onClick={() => goToChapter(i)}
              className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-mono transition-all ${
                i === chapterIdx
                  ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30'
                  : 'bg-slate-800/50 text-slate-500 border border-slate-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

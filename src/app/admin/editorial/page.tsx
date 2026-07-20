'use client'

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { usePageTitle } from "@/lib/usePageTitle"
import {
  getDevocionales, addDevocional, updateDevocional, deleteDevocional,
  getWriters, addWriter, updateWriter, deleteWriter,
  getEditorialStats, seedEditorial,
  type Devocional, type Writer, type EditorialStats,
} from "@/lib/editorial"
import { getBooks, addBook, updateBook, deleteBook } from "@/lib/biblioteca/storage"
import type { Book, BookStatus } from "@/lib/biblioteca/types"
import { BOOK_STATUS_LABELS } from "@/lib/biblioteca/types"
import { isOwnerEmail } from "@/lib/owner"
import { getSession } from "@/lib/auth"
import {
  BookOpen, Sparkles, Users, PenLine, Plus, X, Star, Trash2,
  Check, AlertCircle, ArrowLeft, Library,
} from "lucide-react"

type Tab = "devocionales" | "writers" | "books" | "stats"

interface LocalSession { name: string; email: string }

export default function AdminEditorialPage() {
  usePageTitle("Admin Editorial — ZAFIRO")
  const [tab, setTab] = useState<Tab>("stats")
  const [session, setSession] = useState<LocalSession | null>(null)
  const [stats, setStats] = useState<EditorialStats>({ totalBooks: 0, totalDevocionales: 0, totalWriters: 0, totalReaders: 0, publishedThisMonth: 0 })
  const [devs, setDevs] = useState<Devocional[]>([])
  const [writers, setWriters] = useState<Writer[]>([])
  const [msg, setMsg] = useState("")
  const [msgType, setMsgType] = useState<"ok" | "err">("ok")

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formTitle, setFormTitle] = useState("")
  const [formContent, setFormContent] = useState("")
  const [formVerse, setFormVerse] = useState("")
  const [formVerseRef, setFormVerseRef] = useState("")
  const [formAuthor, setFormAuthor] = useState("")
  const [formDate, setFormDate] = useState("")
  const [formTags, setFormTags] = useState("")
  const [formMinutes, setFormMinutes] = useState(3)

  const [wName, setWName] = useState("")
  const [wBio, setWBio] = useState("")
  const [wEmail, setWEmail] = useState("")
  const [wSpecialties, setWSpecialties] = useState("")

  const [books, setBooks] = useState<Book[]>([])
  const [showBookForm, setShowBookForm] = useState(false)
  const [editingBook, setEditingBook] = useState<string | null>(null)
  const [bookTitle, setBookTitle] = useState("")
  const [bookAuthor, setBookAuthor] = useState("")
  const [bookDesc, setBookDesc] = useState("")
  const [bookStatus, setBookStatus] = useState<BookStatus>("PUBLICADO")
  const [bookTags, setBookTags] = useState("")

  const [editingWriter, setEditingWriter] = useState<string | null>(null)
  const [weName, setWeName] = useState("")
  const [weBio, setWeBio] = useState("")
  const [weEmail, setWeEmail] = useState("")
  const [weSpecialties, setWeSpecialties] = useState("")

  const refresh = useCallback(() => {
    setDevs(getDevocionales())
    setWriters(getWriters())
    setStats(getEditorialStats())
    setBooks(getBooks())
  }, [])

  useEffect(() => {
    seedEditorial()
    setSession(getSession())
    refresh()
  }, [refresh])

  const isOwner = session ? isOwnerEmail(session.email) : false

  const resetForm = () => {
    setFormTitle(""); setFormContent(""); setFormVerse(""); setFormVerseRef("")
    setFormAuthor(""); setFormDate(""); setFormTags(""); setFormMinutes(3)
    setEditingId(null); setShowForm(false)
  }

  const handleEditDev = (d: Devocional) => {
    setEditingId(d.id); setShowForm(true)
    setFormTitle(d.title); setFormContent(d.content); setFormVerse(d.verse)
    setFormVerseRef(d.verseRef); setFormAuthor(d.author); setFormDate(d.date)
    setFormTags(d.tags.join(", ")); setFormMinutes(d.readingTimeMinutes)
  }

  const handleSaveDev = () => {
    if (!formTitle.trim() || !formContent.trim()) {
      setMsg("Título y contenido son obligatorios"); setMsgType("err")
      return
    }
    const data = {
      title: formTitle, content: formContent, verse: formVerse, verseRef: formVerseRef,
      author: formAuthor || "Don Miguel Soria Martínez",
      date: formDate || new Date().toISOString().slice(0, 10),
      tags: formTags.split(",").map(t => t.trim()).filter(Boolean),
      readingTimeMinutes: formMinutes,
      featured: false,
    }
    if (editingId) {
      updateDevocional(editingId, data)
      setMsg("Devocional actualizado")
    } else {
      addDevocional(data)
      setMsg("Devocional creado")
    }
    setMsgType("ok")
    resetForm()
    refresh()
    setTimeout(() => setMsg(""), 2000)
  }

  const handleDeleteDev = (id: string) => {
    if (!confirm("¿Eliminar este devocional?")) return
    deleteDevocional(id)
    setMsg("Devocional eliminado")
    setMsgType("ok")
    refresh()
    setTimeout(() => setMsg(""), 2000)
  }

  const handleToggleFeatured = (id: string) => {
    const d = devs.find(x => x.id === id)
    if (d) {
      updateDevocional(id, { featured: !d.featured })
      refresh()
    }
  }

  const handleSaveWriter = () => {
    if (!wName.trim()) { setMsg("Nombre del escritor requerido"); setMsgType("err"); return }
    addWriter({ name: wName, bio: wBio, email: wEmail, avatar: "", specialties: wSpecialties.split(",").map(s => s.trim()).filter(Boolean), booksPublished: 0, socialLinks: [], verified: false })
    setMsg("Escritor añadido"); setMsgType("ok")
    setWName(""); setWBio(""); setWEmail(""); setWSpecialties("")
    refresh()
    setTimeout(() => setMsg(""), 2000)
  }

  const handleEditWriter = (w: Writer) => {
    setEditingWriter(w.id)
    setWeName(w.name)
    setWeBio(w.bio)
    setWeEmail(w.email)
    setWeSpecialties(w.specialties.join(", "))
  }

  const handleSaveWriterEdit = () => {
    if (!editingWriter || !weName.trim()) { setMsg("Nombre requerido"); setMsgType("err"); return }
    updateWriter(editingWriter, {
      name: weName, bio: weBio, email: weEmail,
      specialties: weSpecialties.split(",").map(s => s.trim()).filter(Boolean),
    })
    setEditingWriter(null)
    setWeName(""); setWeBio(""); setWeEmail(""); setWeSpecialties("")
    setMsg("Escritor actualizado"); setMsgType("ok")
    refresh()
    setTimeout(() => setMsg(""), 2000)
  }

  const handleDeleteWriter = (id: string) => {
    if (!confirm("¿Eliminar este escritor?")) return
    deleteWriter(id)
    setMsg("Escritor eliminado"); setMsgType("ok")
    refresh()
    setTimeout(() => setMsg(""), 2000)
  }

  const handleSaveBook = () => {
    if (!bookTitle.trim() || !bookAuthor.trim()) {
      setMsg("Título y autor son obligatorios"); setMsgType("err")
      return
    }
    const now = new Date().toISOString()
    const bookData: Book = {
      id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: bookTitle,
      authorName: bookAuthor,
      description: bookDesc,
      biography: "",
      coverColor: "#1e293b",
      format: "txt",
      status: bookStatus,
      chapterCount: 0,
      currentChapterIndex: 0,
      copyright: "",
      rightsReserved: true,
      wordCount: 0,
      tags: bookTags.split(",").map(t => t.trim()).filter(Boolean),
      publishedAt: bookStatus === "PUBLICADO" ? now : undefined,
      createdAt: now,
      updatedAt: now,
    }
    if (editingBook) {
      updateBook(editingBook, {
        title: bookTitle, authorName: bookAuthor, description: bookDesc,
        status: bookStatus, tags: bookTags.split(",").map(t => t.trim()).filter(Boolean),
      })
      setMsg("Libro actualizado")
    } else {
      addBook(bookData)
      setMsg("Libro creado")
    }
    setMsgType("ok")
    setShowBookForm(false)
    setEditingBook(null)
    setBookTitle(""); setBookAuthor(""); setBookDesc(""); setBookTags(""); setBookStatus("PUBLICADO")
    refresh()
    setTimeout(() => setMsg(""), 2000)
  }

  const handleDeleteBook = (id: string) => {
    if (!confirm("¿Eliminar este libro?")) return
    deleteBook(id)
    setMsg("Libro eliminado"); setMsgType("ok")
    refresh()
    setTimeout(() => setMsg(""), 2000)
  }

  const handleEditBook = (b: Book) => {
    setEditingBook(b.id)
    setBookTitle(b.title)
    setBookAuthor(b.authorName)
    setBookDesc(b.description)
    setBookStatus(b.status)
    setBookTags(b.tags.join(", "))
    setShowBookForm(true)
  }

  const resetBookForm = () => {
    setShowBookForm(false)
    setEditingBook(null)
    setBookTitle(""); setBookAuthor(""); setBookDesc(""); setBookTags(""); setBookStatus("PUBLICADO")
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <p className="text-sm text-red-400">Acceso no autorizado</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/editorial"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> MSM Editorial
        </Link>

        <h1 className="text-xl font-black mb-6">Admin Editorial</h1>

        {/* Tab nav */}
        <nav className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {[
            { id: "stats" as Tab, label: "Estadísticas", icon: BookOpen },
            { id: "books" as Tab, label: "Libros", icon: Library },
            { id: "devocionales" as Tab, label: "Devocionales", icon: Sparkles },
            { id: "writers" as Tab, label: "Escritores", icon: Users },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                tab === t.id
                  ? "bg-gradient-to-r from-amber-400/15 to-amber-600/10 text-amber-400 border border-amber-400/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/40"
              }`}>
              <t.icon className="w-3 h-3" /> {t.label}
            </button>
          ))}
        </nav>

        {msg && (
          <div className={`flex items-center gap-2 p-2 rounded-xl mb-4 text-[10px] ${
            msgType === "ok" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300" : "bg-red-500/10 border border-red-500/20 text-red-300"
          }`}>
            {msgType === "ok" ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {msg}
          </div>
        )}

        {/* Stats Tab */}
        {tab === "stats" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
                <BookOpen className="w-4 h-4 text-amber-400 mb-2" />
                <p className="text-lg font-black">{stats.totalBooks}</p>
                <p className="text-[9px] text-slate-500">Libros</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
                <Sparkles className="w-4 h-4 text-[#00D9FF] mb-2" />
                <p className="text-lg font-black">{stats.totalDevocionales}</p>
                <p className="text-[9px] text-slate-500">Devocionales</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
                <Users className="w-4 h-4 text-purple-400 mb-2" />
                <p className="text-lg font-black">{stats.totalWriters}</p>
                <p className="text-[9px] text-slate-500">Escritores</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
                <PenLine className="w-4 h-4 text-emerald-400 mb-2" />
                <p className="text-lg font-black">{stats.publishedThisMonth}</p>
                <p className="text-[9px] text-slate-500">Este mes</p>
              </div>
            </div>
            <Link href="/zafiro/biblioteca"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 hover:bg-blue-500/20 transition-all">
              <BookOpen className="w-4 h-4" /> Gestionar Biblioteca
            </Link>
          </div>
        )}

        {/* Books Tab */}
        {tab === "books" && (
          <div>
            {!showBookForm ? (
              <button onClick={() => { resetBookForm(); setShowBookForm(true) }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 hover:bg-blue-500/20 transition-all mb-4 cursor-pointer">
                <Plus className="w-3 h-3" /> Nuevo Libro
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-blue-500/20 mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">{editingBook ? "Editar" : "Nuevo"} Libro</h3>
                  <button onClick={resetBookForm} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <input value={bookTitle} onChange={e => setBookTitle(e.target.value)} placeholder="Título del libro" className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none focus:border-blue-500/30" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={bookAuthor} onChange={e => setBookAuthor(e.target.value)} placeholder="Autor" className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none focus:border-blue-500/30" />
                  <select value={bookStatus} onChange={e => setBookStatus(e.target.value as BookStatus)} className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none focus:border-blue-500/30">
                    {(["SUBIDO", "VALIDADO", "ESTRUCTURADO", "EN_REVISION", "APROBADO", "PUBLICADO", "ARCHIVADO"] as BookStatus[]).map(s => (
                      <option key={s} value={s}>{BOOK_STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
                <textarea value={bookDesc} onChange={e => setBookDesc(e.target.value)} placeholder="Descripción" rows={3} className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none focus:border-blue-500/30 resize-none" />
                <input value={bookTags} onChange={e => setBookTags(e.target.value)} placeholder="Tags (fe, liderazgo, ...)" className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none focus:border-blue-500/30" />
                <button onClick={handleSaveBook}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-[10px] font-bold text-white hover:opacity-95 transition-all cursor-pointer">
                  {editingBook ? "Actualizar" : "Crear"} Libro
                </button>
              </div>
            )}

            <div className="space-y-2">
              {books.map(b => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{b.title}</p>
                    <p className="text-[8px] text-slate-500">{b.authorName} · {BOOK_STATUS_LABELS[b.status]} · {b.tags.join(", ")}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleEditBook(b)} title="Editar"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#00D9FF] hover:bg-slate-800/50 cursor-pointer transition-all">
                      <PenLine className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDeleteBook(b.id)} title="Eliminar"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-all">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {books.length === 0 && (
                <p className="text-[10px] text-slate-500 text-center py-8">No hay libros. Crea el primero.</p>
              )}
            </div>
          </div>
        )}

        {/* Devocionales Tab */}
        {tab === "devocionales" && (
          <div>
            {!showForm ? (
              <button onClick={() => { resetForm(); setShowForm(true) }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400 hover:bg-amber-500/20 transition-all mb-4 cursor-pointer">
                <Plus className="w-3 h-3" /> Nuevo Devocional
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-amber-500/20 mb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white">{editingId ? "Editar" : "Nuevo"} Devocional</h3>
                  <button onClick={resetForm} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Título" className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none focus:border-amber-500/30" />
                <textarea value={formContent} onChange={e => setFormContent(e.target.value)} placeholder="Contenido del devocional..." rows={5} className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none focus:border-amber-500/30 resize-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={formVerse} onChange={e => setFormVerse(e.target.value)} placeholder="Versículo" className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none focus:border-amber-500/30" />
                  <input value={formVerseRef} onChange={e => setFormVerseRef(e.target.value)} placeholder="Referencia (ej. Mateo 17:20)" className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none focus:border-amber-500/30" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input value={formAuthor} onChange={e => setFormAuthor(e.target.value)} placeholder="Autor" className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none focus:border-amber-500/30" />
                  <input value={formDate} onChange={e => setFormDate(e.target.value)} type="date" className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none focus:border-amber-500/30" />
                  <input value={formTags} onChange={e => setFormTags(e.target.value)} placeholder="Tags (fe, esperanza, ...)" className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none focus:border-amber-500/30" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] text-slate-500">Minutos de lectura:</span>
                  <input type="number" value={formMinutes} onChange={e => setFormMinutes(Number(e.target.value))} min={1} max={30} className="w-16 py-1 px-2 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none text-center" />
                </div>
                <button onClick={handleSaveDev}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-[10px] font-bold text-white hover:opacity-95 transition-all cursor-pointer">
                  {editingId ? "Actualizar" : "Publicar"} Devocional
                </button>
              </div>
            )}

            <div className="space-y-2">
              {devs.map(d => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white truncate">{d.title}</p>
                      {d.featured && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                    </div>
                    <p className="text-[8px] text-slate-500">{d.date} · {d.readingTimeMinutes} min · {d.tags.join(", ")}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleToggleFeatured(d.id)} title="Destacar"
                      className={`p-1.5 rounded-lg cursor-pointer transition-all ${d.featured ? "text-amber-400 bg-amber-500/10" : "text-slate-500 hover:text-amber-400"}`}>
                      <Star className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleEditDev(d)} title="Editar"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#00D9FF] hover:bg-slate-800/50 cursor-pointer transition-all">
                      <PenLine className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDeleteDev(d.id)} title="Eliminar"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-all">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {devs.length === 0 && (
                <p className="text-[10px] text-slate-500 text-center py-8">No hay devocionales. Crea el primero.</p>
              )}
            </div>
          </div>
        )}

        {/* Writers Tab */}
        {tab === "writers" && (
          <div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 mb-4 space-y-3">
              <h3 className="text-xs font-bold text-white">Añadir Escritor</h3>
              <input value={wName} onChange={e => setWName(e.target.value)} placeholder="Nombre" className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none" />
              <textarea value={wBio} onChange={e => setWBio(e.target.value)} placeholder="Biografía" rows={2} className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <input value={wEmail} onChange={e => setWEmail(e.target.value)} placeholder="Email" className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none" />
                <input value={wSpecialties} onChange={e => setWSpecialties(e.target.value)} placeholder="Especialidades (fe, tech, ...)" className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none" />
              </div>
              <button onClick={handleSaveWriter}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-[10px] font-bold text-white hover:opacity-95 transition-all cursor-pointer">
                <Plus className="w-3 h-3 inline mr-1" /> Añadir Escritor
              </button>
            </div>

            {/* Edit Writer Modal */}
            {editingWriter && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="w-full max-w-md mx-4 rounded-2xl bg-slate-900 border border-slate-700/60 p-6">
                  <h3 className="text-sm font-bold text-white mb-4">Editar Escritor</h3>
                  <div className="space-y-3">
                    <input value={weName} onChange={e => setWeName(e.target.value)} placeholder="Nombre" className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none" />
                    <textarea value={weBio} onChange={e => setWeBio(e.target.value)} placeholder="Biografía" rows={2} className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none resize-none" />
                    <div className="grid grid-cols-2 gap-3">
                      <input value={weEmail} onChange={e => setWeEmail(e.target.value)} placeholder="Email" className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none" />
                      <input value={weSpecialties} onChange={e => setWeSpecialties(e.target.value)} placeholder="Especialidades (fe, tech, ...)" className="w-full py-1.5 px-3 rounded-lg text-[11px] bg-slate-800/50 border border-slate-700/60 text-white outline-none" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setEditingWriter(null)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[10px] text-slate-400 hover:text-white transition-all cursor-pointer">Cancelar</button>
                    <button onClick={handleSaveWriterEdit}
                      className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-[10px] font-bold text-white hover:opacity-90 transition-all cursor-pointer">Guardar</button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {writers.map(w => (
                <div key={w.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {w.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white">{w.name}</p>
                    <p className="text-[8px] text-slate-500">{w.specialties.join(", ")} · {w.booksPublished} libro{w.booksPublished !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleEditWriter(w)} title="Editar"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#00D9FF] hover:bg-slate-800/50 cursor-pointer transition-all">
                      <PenLine className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDeleteWriter(w.id)} title="Eliminar"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-all">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

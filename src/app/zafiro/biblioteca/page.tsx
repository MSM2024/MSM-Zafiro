'use client'

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { BookOpen, Upload, Plus, ArrowLeft, Loader2, FileText, CheckCircle, AlertTriangle } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import { bootstrapOwnerProfile } from "@/lib/identity"
import { isOwnerEmail } from "@/lib/owner"
import { getBooks } from "@/lib/biblioteca/storage"
import { importBookFromText, publishBook, archiveBook } from "@/lib/biblioteca/importador"
import { syncBookToEliana } from "@/lib/biblioteca/eliana-bridge"
import { seedDeCeroADuenoDigital } from "@/lib/biblioteca/seed-cero-a-dueno"
import BookCard from "@/components/biblioteca/BookCard"
import type { Book } from "@/lib/biblioteca/types"

export default function BibliotecaPage() {
  usePageTitle("Biblioteca ZAFIRO — Admin")
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [preview, setPreview] = useState<{ title: string; lines: string[]; chapterCount: number; wordCount: number } | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [fileName, setFileName] = useState("")

  const refresh = useCallback(() => {
    seedDeCeroADuenoDigital(true)
    setBooks(getBooks())
  }, [])

  useEffect(() => {
    const s = getSession()
    if (!s) { router.replace("/auth/login"); return }
    if (!isOwnerEmail(s.email)) { router.replace("/"); return }
    setSession(s)
    bootstrapOwnerProfile()
    refresh()
    setLoading(false)
  }, [router, refresh])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setImporting(true)
    try {
      const text = await file.text()
      const result = importBookFromText(file.name.replace(/\.(txt|md)$/i, ''), text)
      setPreview({
        title: result.preview.title,
        lines: result.preview.lines.slice(0, 20),
        chapterCount: result.preview.chapterCount,
        wordCount: result.preview.wordCount,
      })
    } catch (err: any) {
      alert("Error al importar: " + err.message)
    } finally {
      setImporting(false)
    }
  }

  const confirmImport = () => {
    setShowImport(false)
    setPreview(null)
    setFileName("")
    refresh()
  }

  const handlePublish = (book: Book) => {
    publishBook(book.id)
    syncBookToEliana(book)
    refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00D9FF] animate-spin" />
      </div>
    )
  }

  const publishedBooks = books.filter(b => b.status === 'PUBLICADO')
  const draftBooks = books.filter(b => b.status !== 'PUBLICADO' && b.status !== 'ARCHIVADO')
  const archivedBooks = books.filter(b => b.status === 'ARCHIVADO')

  return (
    <div className="min-h-screen bg-[#050816]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.push("/zafiro/perfil")} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9FF] to-cyan-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Biblioteca ZAFIRO</h1>
            <p className="text-[10px] font-mono text-slate-500">Gestión de libros y obras</p>
          </div>
          <button
            onClick={() => setShowImport(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[#00D9FF] text-xs font-bold hover:bg-[#00D9FF]/20 transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            Importar libro
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500">Total obras</p>
            <p className="text-2xl font-bold text-white">{books.length}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500">Publicadas</p>
            <p className="text-2xl font-bold text-[#00D9FF]">{publishedBooks.length}</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-500">En revisión</p>
            <p className="text-2xl font-bold text-amber-400">{draftBooks.length}</p>
          </div>
        </div>

        {showImport && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8"
          >
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#00D9FF]" />
              Importar nuevo libro
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Formatos aceptados: .txt, .md. El contenido se estructurará automáticamente en capítulos.
            </p>

            {!preview ? (
              <label className="block w-full p-8 border-2 border-dashed border-slate-700 rounded-xl text-center cursor-pointer hover:border-[#00D9FF]/30 transition-all">
                <input type="file" accept=".txt,.md" onChange={handleFile} className="hidden" />
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">
                  {importing ? 'Importando...' : 'Selecciona un archivo .txt o .md'}
                </p>
                <p className="text-[10px] text-slate-600 mt-1">
                  El libro se importa como BORRADOR. Solo tú puedes verlo hasta que lo publiques.
                </p>
              </label>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4 p-3 bg-slate-800/30 rounded-lg">
                  <FileText className="w-5 h-5 text-[#00D9FF]" />
                  <div>
                    <p className="text-sm font-semibold text-white">{preview.title}</p>
                    <p className="text-[10px] text-slate-500">
                      {preview.chapterCount} capítulos · {preview.wordCount.toLocaleString()} palabras
                    </p>
                  </div>
                </div>
                <div className="max-h-40 overflow-y-auto bg-slate-950/50 rounded-lg p-3 mb-4 font-mono text-[10px] text-slate-400 leading-relaxed">
                  {preview.lines.map((line, i) => (
                    <div key={i} className="truncate">{line || '\u00A0'}</div>
                  ))}
                  {preview.lines.length >= 20 && <div className="text-slate-600">... más contenido</div>}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={confirmImport}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[#00D9FF] text-xs font-bold hover:bg-[#00D9FF]/20 transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Confirmar importación
                  </button>
                  <button
                    onClick={() => { setShowImport(false); setPreview(null) }}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {publishedBooks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Obras publicadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {publishedBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}

        {draftBooks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Borradores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {draftBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}

        {archivedBooks.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-500 mb-4 flex items-center gap-2">
              Archivados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {archivedBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}

        {books.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 text-sm">No hay libros en la biblioteca</p>
            <p className="text-xs text-slate-600 mt-1">Importa tu primer libro para comenzar</p>
          </div>
        )}
      </div>
    </div>
  )
}

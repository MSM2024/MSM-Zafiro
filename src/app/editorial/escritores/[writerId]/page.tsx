'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookOpen, PenLine, Sparkles, Globe, CheckCircle, ShoppingCart } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getWriters, getDevocionales, syncBookToMarketplace, getBookMarketplaceProduct } from "@/lib/editorial"
import { getBooks } from "@/lib/biblioteca/storage"
import type { Writer } from "@/lib/editorial/types"
import type { Product } from "@/lib/marketplace"
import type { Book } from "@/lib/biblioteca/types"
import DevocionalCard from "@/components/editorial/DevocionalCard"

export default function WriterProfilePage() {
  const params = useParams()
  const [writer, setWriter] = useState<Writer | undefined>(undefined)
  const [books, setBooks] = useState<Book[]>([])
  const [devs, setDevs] = useState<ReturnType<typeof getDevocionales>>([])
  const [productMap, setProductMap] = useState<Record<string, Product>>({})

  useEffect(() => {
    const w = getWriters().find(x => x.id === params.writerId)
    setWriter(w)
    if (w) {
      const allBooks = getBooks().filter(b => b.status === "PUBLICADO" || b.status === "APROBADO")
      const filtered = allBooks.filter(b => b.authorName.toLowerCase().includes(w.name.toLowerCase()))
      setBooks(filtered)
      setDevs(getDevocionales().filter(d => d.author === w.name))
      const map: Record<string, Product> = {}
      for (const book of filtered) {
        syncBookToMarketplace(book)
        const prod = getBookMarketplaceProduct(book.id)
        if (prod) map[book.id] = prod
      }
      setProductMap(map)
    }
  }, [params.writerId])

  usePageTitle(writer ? `${writer.name} — MSM Editorial` : "Escritor — MSM Editorial")

  if (!writer) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <p className="text-sm text-slate-500">Escritor no encontrado</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/editorial/escritores"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Todos los Escritores
        </Link>

        <div className="flex items-start gap-5 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-2xl font-bold text-white shrink-0">
            {writer.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black text-white">{writer.name}</h1>
              {writer.verified && <CheckCircle className="w-5 h-5 text-emerald-400 fill-current" />}
            </div>
            <p className="text-sm text-slate-400 mb-3">{writer.bio}</p>
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-indigo-400" />{books.length} libro{books.length !== 1 ? "s" : ""}</span>
              <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-400" />{devs.length} devocional{devs.length !== 1 ? "es" : ""}</span>
              <span className="flex items-center gap-1"><PenLine className="w-3 h-3 text-purple-400" />{writer.specialties.join(", ")}</span>
            </div>
            <div className="flex items-center gap-3 mt-3">
              {writer.socialLinks.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[9px] text-[#00D9FF] hover:underline">
                  <Globe className="w-3 h-3" />{l.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Books */}
        {books.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" /> Obras Publicadas
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {books.map(book => {
                const prod = productMap[book.id]
                return (
                  <div key={book.id}
                    className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-[#00D9FF]/30 transition-all group">
                    <Link href={`/zafiro/biblioteca/${book.id}`} className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0"
                        style={{ backgroundColor: book.coverColor + "20", color: book.coverColor }}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-white group-hover:text-[#00D9FF] transition-colors">{book.title}</h3>
                        <p className="text-[9px] text-slate-500">{book.chapterCount} capítulos · {book.wordCount.toLocaleString()} palabras</p>
                      </div>
                    </Link>
                    {prod && (
                      <Link href={`/marketplace/${prod.id}`}
                        className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-400 hover:bg-amber-500/20 transition-all">
                        <ShoppingCart className="w-3 h-3" /> ${prod.price.toFixed(2)}
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Devocionales */}
        {devs.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Devocionales
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {devs.map(d => <DevocionalCard key={d.id} devocional={d} compact />)}
            </div>
          </div>
        )}

        {books.length === 0 && devs.length === 0 && (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-500">Este escritor no tiene obras publicadas aún.</p>
          </div>
        )}
      </div>
    </div>
  )
}

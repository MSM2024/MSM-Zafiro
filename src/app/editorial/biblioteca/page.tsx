'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Search, BookMarked, FileText, ShoppingCart } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getBooks } from "@/lib/biblioteca/storage"
import { syncBookToMarketplace, getBookMarketplaceProduct } from "@/lib/editorial"
import type { Book } from "@/lib/biblioteca/types"
import type { Product } from "@/lib/marketplace"

export default function EditorialBibliotecaPage() {
  usePageTitle("Biblioteca — MSM Editorial")
  const [books, setBooks] = useState<Book[]>([])
  const [search, setSearch] = useState("")
  const [productMap, setProductMap] = useState<Record<string, Product>>({})

  useEffect(() => {
    const all = getBooks()
    const published = all.filter(b => b.status === "PUBLICADO" || b.status === "APROBADO")
    setBooks(published)

    const map: Record<string, Product> = {}
    for (const book of published) {
      syncBookToMarketplace(book)
      const prod = getBookMarketplaceProduct(book.id)
      if (prod) map[book.id] = prod
    }
    setProductMap(map)
  }, [])

  const filtered = search
    ? books.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.authorName.toLowerCase().includes(search.toLowerCase()) ||
        b.tags.some(t => t.includes(search.toLowerCase())))
    : books

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/editorial"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> MSM Editorial
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
            <BookMarked className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black">Biblioteca Pública</h1>
            <p className="text-[9px] font-mono text-slate-500">{books.length} obras publicadas — Imperio MSM</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por título, autor o etiqueta..."
            className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-900/50 border border-slate-800/60 text-xs text-white outline-none focus:border-[#00D9FF]/30 transition-all" />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500">{books.length === 0 ? "No hay obras publicadas aún." : "No se encontraron resultados."}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(book => {
              const prod = productMap[book.id]
              return (
                <div key={book.id}
                  className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-5 hover:border-[#00D9FF]/30 transition-all h-full flex flex-col">
                  <Link href={`/zafiro/biblioteca/${book.id}`} className="flex-1 group">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                      style={{ backgroundColor: book.coverColor + "20", color: book.coverColor }}>
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#00D9FF] transition-colors line-clamp-2 mb-1">
                      {book.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 mb-1">{book.authorName}</p>
                    <p className="text-[9px] text-slate-500 line-clamp-2 mb-3">{book.description.slice(0, 100)}</p>
                    <div className="flex items-center gap-3 text-[9px] text-slate-500">
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{book.chapterCount} cap.</span>
                      <span>{book.wordCount.toLocaleString()} palabras</span>
                    </div>
                  </Link>
                  {prod && (
                    <Link href={`/marketplace/${prod.id}`}
                      className="mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400 hover:bg-amber-500/20 transition-all">
                      <ShoppingCart className="w-3 h-3" /> Comprar ${prod.price.toFixed(2)}
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from "react"
import { usePageTitle } from "@/lib/usePageTitle"
import { Search, ArrowRight } from "lucide-react"
import Link from "next/link"
import { crossPillarSearch, type SearchResult } from "@/lib/search"
import { PILLAR_LABELS, getPillarColor } from "@/lib/notifications"

export default function OsSearchPage() {
  usePageTitle("ZAFIRO OS — Buscar")
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    if (query.trim()) {
      setResults(crossPillarSearch(query))
    } else {
      setResults([])
    }
  }, [query])

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = []
    acc[r.category].push(r)
    return acc
  }, {})

  return (
    <div className="min-h-full p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9FF] to-blue-600 flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Búsqueda Global</h1>
            <p className="text-xs text-slate-400">Busca en los 4 pilares del Imperio MSM</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Buscar productos, libros, devocionales, escritores, perfiles, sellos..."
            autoFocus
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/60 border border-slate-700 text-white text-base placeholder:text-slate-600 focus:outline-none focus:border-[#00D9FF]/50 transition-all" />
        </div>

        {query.trim() && results.length === 0 && (
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800/60 text-center">
            <Search className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No se encontraron resultados para &ldquo;{query}&rdquo;</p>
          </div>
        )}

        {Object.keys(grouped).length > 0 && (
          <div className="space-y-6">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">{category} ({items.length})</h3>
                <div className="space-y-1">
                  {items.map(item => {
                    const colorClass = getPillarColor(item.pillar)
                    return (
                      <Link key={item.id} href={item.href}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 hover:border-[#00D9FF]/30 transition-all group">
                        <span className="text-xl">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-[8px] font-mono px-1 py-px rounded ${colorClass}`}>
                              {PILLAR_LABELS[item.pillar] || item.pillar}
                            </span>
                            <p className="text-sm font-medium text-white group-hover:text-[#00D9FF] transition-colors truncate">{item.title}</p>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate">{item.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-[#00D9FF] transition-colors shrink-0" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {!query.trim() && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Productos", icon: "🛒", desc: "Marketplace activos" },
              { label: "Libros", icon: "📖", desc: "Biblioteca pública" },
              { label: "Devocionales", icon: "✨", desc: "Reflexiones diarias" },
              { label: "Escritores", icon: "✍️", desc: "Autores del Imperio" },
              { label: "Perfiles", icon: "👤", desc: "Miembros ZAFIRO" },
              { label: "Sellos", icon: "🔏", desc: "150 Sellos de Salmos" },
              { label: "Navegación", icon: "🧭", desc: "Páginas y secciones" },
              { label: "Imperio MSM", icon: "👑", desc: "Centro de Mando" },
            ].map(s => (
              <div key={s.label} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 text-center">
                <span className="text-2xl block mb-1">{s.icon}</span>
                <p className="text-xs font-bold text-white">{s.label}</p>
                <p className="text-[8px] text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

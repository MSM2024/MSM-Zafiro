'use client'

import { useState } from "react"
import { usePageTitle } from "@/lib/usePageTitle"
import { Search, ArrowRight, Diamond, MessageCircle, ShoppingBag, BookOpen, DollarSign, Globe, Users, FileText } from "lucide-react"
import Link from "next/link"

const SEARCH_ITEMS = [
  { label: "Mi Perfil", href: "/zafiro/perfil", icon: Diamond, category: "Identidad" },
  { label: "ELIANA", href: "/eliana", icon: MessageCircle, category: "Asistente" },
  { label: "Marketplace", href: "https://msmmystore.com", icon: ShoppingBag, category: "Comercio" },
  { label: "Editorial", href: "/ecosystem", icon: BookOpen, category: "Conocimiento" },
  { label: "Economía", href: "/economia", icon: DollarSign, category: "Operativa" },
  { label: "Universo", href: "/universo", icon: Globe, category: "Comunidad" },
  { label: "Familia", href: "/familia", icon: Users, category: "Social" },
  { label: "La Mente Maestra", href: "/transforma-tu-vida-con-la-mente-maestra", icon: Diamond, category: "Programas" },
  { label: "Términos y Condiciones", href: "/terms", icon: FileText, category: "Legal" },
  { label: "Política de Privacidad", href: "/privacy", icon: FileText, category: "Legal" },
]

export default function OsSearchPage() {
  usePageTitle("ZAFIRO OS — Buscar")
  const [query, setQuery] = useState("")

  const filtered = query.trim()
    ? SEARCH_ITEMS.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
    : []

  return (
    <div className="min-h-full p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9FF] to-blue-600 flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Buscar</h1>
            <p className="text-xs text-slate-400">Encuentra lo que necesitas en ZAFIRO</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Escribe para buscar..."
            autoFocus
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/60 border border-slate-700 text-white text-base placeholder:text-slate-600 focus:outline-none focus:border-[#00D9FF]/50 transition-all" />
        </div>

        {query.trim() && (
          <div className="space-y-1">
            {filtered.length === 0 ? (
              <div className="p-8 rounded-2xl glass text-center">
                <p className="text-sm text-slate-500">No se encontraron resultados para &ldquo;{query}&rdquo;</p>
              </div>
            ) : (
              filtered.map((item, i) => {
                const Icon = item.icon
                return (
                  <Link key={i} href={item.href}
                    className="flex items-center gap-4 p-4 rounded-2xl glass glass-hover group">
                    <Icon className="w-5 h-5 text-[#00D9FF]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white group-hover:text-[#00D9FF] transition-colors">{item.label}</p>
                      <p className="text-[10px] text-slate-500">{item.category}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-[#00D9FF] transition-colors" />
                  </Link>
                )
              })
            )}
          </div>
        )}

        {!query.trim() && (
          <div className="p-8 rounded-2xl glass text-center">
            <Search className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Escribe para buscar en todas las secciones de ZAFIRO</p>
          </div>
        )}
      </div>
    </div>
  )
}

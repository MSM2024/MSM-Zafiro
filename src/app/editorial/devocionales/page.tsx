'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Sparkles, Search, BookOpen } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getDevocionales, seedEditorial } from "@/lib/editorial"
import type { Devocional } from "@/lib/editorial/types"
import DevocionalCard from "@/components/editorial/DevocionalCard"

export default function DevocionalesPage() {
  usePageTitle("Devocionales — MSM Editorial")
  const [devs, setDevs] = useState<Devocional[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    seedEditorial()
    setDevs(getDevocionales())
  }, [])

  const filtered = search
    ? devs.filter(d =>
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.content.toLowerCase().includes(search.toLowerCase()) ||
        d.tags.some(t => t.includes(search.toLowerCase())))
    : devs

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/editorial"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> MSM Editorial
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black">Devocionales</h1>
            <p className="text-[9px] font-mono text-slate-500">{devs.length} reflexiones — Imperio MSM</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar devocionales..."
            className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-900/50 border border-slate-800/60 text-xs text-white outline-none focus:border-[#00D9FF]/30 transition-all" />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No se encontraron devocionales</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {filtered.map(d => <DevocionalCard key={d.id} devocional={d} />)}
          </div>
        )}
      </div>
    </div>
  )
}

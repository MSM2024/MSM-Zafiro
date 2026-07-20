'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Users, PenLine, BookOpen, Search } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getWriters, getDevocionales } from "@/lib/editorial"
import { getBooks } from "@/lib/biblioteca/storage"
import type { Writer } from "@/lib/editorial/types"

export default function EscritoresPage() {
  usePageTitle("Escritores — MSM Editorial")
  const [writers, setWriters] = useState<Writer[]>([])
  const [bookCounts, setBookCounts] = useState<Record<string, number>>({})
  const [devCounts, setDevCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const w = getWriters()
    setWriters(w)

    const books = getBooks().filter(b => b.status === "PUBLICADO")
    const devs = getDevocionales()

    const bc: Record<string, number> = {}
    const dc: Record<string, number> = {}
    for (const wr of w) {
      bc[wr.id] = books.filter(b => b.authorName.toLowerCase().includes(wr.name.toLowerCase())).length
      dc[wr.id] = devs.filter(d => d.author === wr.name).length
    }
    setBookCounts(bc)
    setDevCounts(dc)
  }, [])

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/editorial"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> MSM Editorial
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
            <PenLine className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black">Escritores</h1>
            <p className="text-[9px] font-mono text-slate-500">{writers.length} autores del Imperio MSM</p>
          </div>
        </div>

        {writers.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
            <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No hay escritores registrados.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {writers.map(w => (
              <Link key={w.id} href={`/editorial/escritores/${w.id}`}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 hover:border-[#00D9FF]/30 transition-all group">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-lg font-bold text-white shrink-0">
                  {w.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white group-hover:text-[#00D9FF] transition-colors">{w.name}</h3>
                    {w.verified && <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">VERIFICADO</span>}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mb-2">{w.bio}</p>
                  <div className="flex items-center gap-3 text-[9px] text-slate-500">
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{bookCounts[w.id] || 0} libros</span>
                    <span className="flex items-center gap-1"><PenLine className="w-3 h-3" />{devCounts[w.id] || 0} devocionales</span>
                    <span className="text-slate-600">{w.specialties.slice(0, 3).join(", ")}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

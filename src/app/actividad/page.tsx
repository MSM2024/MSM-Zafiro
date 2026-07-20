'use client'

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Filter, Search, Calendar } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getAllActivityEvents, getPillarActivityIcon, getPillarActivityColor, type ActivityEvent } from "@/lib/activity-timeline"

const PILLAR_OPTIONS = [
  { id: "", label: "Todos", color: "text-white" },
  { id: "marketplace", label: "Marketplace", color: "text-amber-400" },
  { id: "editorial", label: "Editorial", color: "text-blue-400" },
  { id: "economy", label: "Economía", color: "text-emerald-400" },
  { id: "identity", label: "Identidad", color: "text-purple-400" },
  { id: "sellos", label: "Sellos", color: "text-rose-400" },
]

export default function ActividadPage() {
  usePageTitle("Actividad del Ecosistema — ZAFIRO")
  const [events, setEvents] = useState<ActivityEvent[]>([])
  const [filter, setFilter] = useState("")
  const [search, setSearch] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const all = getAllActivityEvents()
    setEvents(all)
    setLoaded(true)
  }, [])

  const filtered = useMemo(() => {
    let e = events
    if (filter) e = e.filter(ev => ev.pillar === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      e = e.filter(ev => ev.summary.toLowerCase().includes(q) || ev.type.toLowerCase().includes(q))
    }
    if (fromDate) e = e.filter(ev => new Date(ev.timestamp) >= new Date(fromDate))
    if (toDate) {
      const end = new Date(toDate)
      end.setDate(end.getDate() + 1)
      e = e.filter(ev => new Date(ev.timestamp) < end)
    }
    return e
  }, [events, filter, search, fromDate, toDate])

  function timeAgo(ts: string): string {
    const diff = Date.now() - new Date(ts).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "ahora"
    if (mins < 60) return `hace ${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `hace ${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `hace ${days}d`
    return new Date(ts).toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Actividad del Ecosistema</h1>
            <p className="text-sm text-slate-400">Eventos de los 5 pilares en orden cronológico</p>
          </div>
        </div>

        {/* Search + Date filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar en actividad..."
              className="w-full bg-slate-900/60 border border-slate-800/60 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF]/50" />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
              <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                className="bg-slate-900/60 border border-slate-800/60 rounded-lg pl-7 pr-2 py-2 text-[10px] text-white focus:outline-none focus:border-[#00D9FF]/50 [color-scheme:dark]" />
            </div>
            <span className="text-[10px] text-slate-500 self-center">→</span>
            <div className="relative">
              <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
              <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                className="bg-slate-900/60 border border-slate-800/60 rounded-lg pl-7 pr-2 py-2 text-[10px] text-white focus:outline-none focus:border-[#00D9FF]/50 [color-scheme:dark]" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {PILLAR_OPTIONS.map(o => (
            <button key={o.id} onClick={() => setFilter(o.id)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                filter === o.id
                  ? "bg-slate-800/60 border border-slate-600/40 text-white"
                  : "text-slate-400 hover:text-white bg-slate-900/40 border border-slate-800/40"
              }`}>
              {o.id ? getPillarActivityIcon(o.id) + " " : ""}{o.label}
            </button>
          ))}
        </div>

        {!loaded ? (
          <div className="text-center py-12">
            <div className="w-6 h-6 rounded-full border-2 border-[#00D9FF] border-t-transparent animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800/60 p-12 text-center">
            <p className="text-sm text-slate-500">No hay actividad para este filtro</p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 mb-3">{filtered.length} eventos encontrados</p>
            {filtered.map((e) => (
              <div key={e.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/40 hover:border-slate-700/60 transition-all">
                <span className="text-base mt-0.5">{getPillarActivityIcon(e.pillar)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase ${getPillarActivityColor(e.pillar)}`}>{e.type}</span>
                    <span className="text-[8px] text-slate-600">{timeAgo(e.timestamp)}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{e.summary}</p>
                </div>
                {e.link && (
                  <Link href={e.link}
                    className="text-[9px] text-[#00D9FF] hover:underline shrink-0 mt-1">
                    Ver →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

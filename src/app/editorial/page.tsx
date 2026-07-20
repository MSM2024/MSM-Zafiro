'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, Users, Sparkles, ArrowRight, Clock, Star, PenLine, BookMarked, TrendingUp } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getFeaturedDevocional, getDevocionales, getWriters, getEditorialStats, seedEditorial, type EditorialStats } from "@/lib/editorial"
import DevocionalCard from "@/components/editorial/DevocionalCard"

export default function EditorialPage() {
  usePageTitle("MSM Editorial — ZAFIRO")
  const [stats, setStats] = useState<EditorialStats>({ totalBooks: 0, totalDevocionales: 0, totalWriters: 0, totalReaders: 0, publishedThisMonth: 0 })
  const [featuredDev, setFeaturedDev] = useState<ReturnType<typeof getFeaturedDevocional>>(undefined)
  const [recentDevs, setRecentDevs] = useState<ReturnType<typeof getDevocionales>>([])
  const [writers, setWriters] = useState<ReturnType<typeof getWriters>>([])

  useEffect(() => {
    seedEditorial()
    setStats(getEditorialStats())
    setFeaturedDev(getFeaturedDevocional())
    const all = getDevocionales()
    setRecentDevs(all.slice(0, 4))
    setWriters(getWriters().slice(0, 3))
  }, [])

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black">MSM Editorial</h1>
              <p className="text-[9px] font-mono text-slate-500">Conocimiento que transforma — <Link href="/imperio" className="text-amber-400 hover:underline">👑 Imperio MSM</Link></p>
            </div>
          </div>
          <Link href="/admin/editorial"
            className="px-3 py-1.5 rounded-xl bg-slate-900/50 border border-slate-800/60 text-[9px] font-bold text-slate-400 hover:text-white hover:border-[#00D9FF]/30 transition-all">
            Admin Editorial
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <BookMarked className="w-4 h-4 text-amber-400 mb-2" />
            <p className="text-lg font-black">{stats.totalBooks}</p>
            <p className="text-[9px] text-slate-500">Libros publicados</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <Sparkles className="w-4 h-4 text-[#00D9FF] mb-2" />
            <p className="text-lg font-black">{stats.totalDevocionales}</p>
            <p className="text-[9px] text-slate-500">Devocionales</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <PenLine className="w-4 h-4 text-purple-400 mb-2" />
            <p className="text-lg font-black">{stats.totalWriters}</p>
            <p className="text-[9px] text-slate-500">Escritores</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <TrendingUp className="w-4 h-4 text-emerald-400 mb-2" />
            <p className="text-lg font-black">{stats.publishedThisMonth}</p>
            <p className="text-[9px] text-slate-500">Publicados este mes</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Featured Devocional */}
          <div className="md:col-span-2 space-y-6">
            {featuredDev && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/20">
                <div className="flex items-center gap-2 text-[9px] font-mono text-amber-400 mb-3">
                  <Star className="w-3 h-3 fill-amber-400" />
                  Devocional Destacado
                </div>
                <h2 className="text-lg font-black text-white mb-2">{featuredDev.title}</h2>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-3 line-clamp-4">{featuredDev.content}</p>
                <div className="flex items-center gap-4 text-[9px] text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featuredDev.readingTimeMinutes} min</span>
                  <span className="text-amber-400/60">{featuredDev.verseRef}</span>
                </div>
                <Link href={`/editorial/devocionales/${featuredDev.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400 hover:bg-amber-500/20 transition-all">
                  Leer Devocional <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {/* Recent Devocionales */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-white">Devocionales Recientes</h2>
                <Link href="/editorial/devocionales"
                  className="text-[9px] font-mono text-[#00D9FF] hover:underline">
                  Ver todos ({stats.totalDevocionales})
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {recentDevs.map(d => <DevocionalCard key={d.id} devocional={d} compact />)}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Biblioteca Pública */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-transparent border border-indigo-500/20">
              <BookMarked className="w-5 h-5 text-indigo-400 mb-2" />
              <h3 className="text-sm font-bold text-white mb-1">Biblioteca Pública</h3>
              <p className="text-[9px] text-slate-400 mb-3">Catálogo de obras publicadas del Imperio MSM.</p>
              <Link href="/editorial/biblioteca"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-bold text-indigo-400 hover:bg-indigo-500/20 transition-all">
                Explorar Catálogo <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Writers */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Users className="w-4 h-4 text-purple-400" /> Escritores
                </div>
                <Link href="/editorial/escritores" className="text-[9px] font-mono text-[#00D9FF] hover:underline">
                  Ver todos
                </Link>
              </div>
              {writers.map(w => (
                <Link key={w.id} href={`/editorial/escritores/${w.id}`}
                  className="flex items-center gap-2 mb-2 last:mb-0 group">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-[8px] font-bold text-white">
                    {w.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white group-hover:text-[#00D9FF] transition-colors">{w.name}</p>
                    <p className="text-[7px] text-slate-500">{w.booksPublished} libro{w.booksPublished !== 1 ? "s" : ""}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Sellos */}
            <Link href="/sellos/hoy"
              className="block p-4 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20 text-center">
              <span className="text-2xl block mb-1">🕊️</span>
              <p className="text-[10px] font-bold text-emerald-400">Sello del Día</p>
              <p className="text-[8px] text-slate-500">Reflexión diaria sellada con Firma 369</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

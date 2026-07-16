'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'motion/react'
import { BookOpen, Sparkles, TrendingUp, Heart, Bookmark, Shuffle, Sun, Search, ArrowRight, Star, CheckCircle, Gem, Quote } from 'lucide-react'
import Link from 'next/link'
import SealVisualGrid from '@/components/sellos/SealVisualGrid'
import SealCard from '@/components/sellos/SealCard'
import { getPublishedSeals, getProgress, getFavorites, toggleFavorite, getCompletionStats, SEED_SEALS, getSealByNumber, markSealProgress as markProgress, type Seal } from '@/lib/seals-data'
import { usePageTitle } from '@/lib/usePageTitle'

export default function SellosPage() {
  usePageTitle('Los 150 Sellos de los Salmos — ZAFIRO')
  const [seals, setSeals] = useState<Seal[]>([])
  const [progress, setProgress] = useState(getProgress())
  const [favorites, setFavs] = useState(getFavorites())
  const [showIntro, setShowIntro] = useState(true)
  const [search, setSearch] = useState('')
  const [filterTheme, setFilterTheme] = useState('')
  const stats = useMemo(() => getCompletionStats(), [progress, favorites])

  useEffect(() => {
    setSeals(getPublishedSeals())
    const hasProgress = getProgress().length > 0
    if (hasProgress) setShowIntro(false)
  }, [])

  const refresh = () => {
    setProgress(getProgress())
    setFavs(getFavorites())
  }

  const handleToggleFav = (id: number) => {
    toggleFavorite(id)
    refresh()
  }

  const filtered = useMemo(() => {
    let list = seals
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(s => s.versiculo.toLowerCase().includes(q) || s.tema.toLowerCase().includes(q) || s.reflexion.toLowerCase().includes(q))
    }
    if (filterTheme) list = list.filter(s => s.tema === filterTheme)
    return list.sort((a, b) => a.orden - b.orden)
  }, [seals, search, filterTheme])

  const lastSeal = useMemo(() => {
    const p = getProgress().filter(x => x.status === 'reading' || x.status === 'completed')
    if (p.length === 0) return null
    const last = p.reduce((a, b) => {
      const dateA = a.openedAt ? new Date(a.openedAt).getTime() : 0
      const dateB = b.openedAt ? new Date(b.openedAt).getTime() : 0
      return dateA > dateB ? a : b
    })
    return getSealByNumber(last.sealId)
  }, [progress])

  const themes = [...new Set(seals.map(s => s.tema))]

  if (showIntro) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <div className="max-w-3xl mx-auto px-4 py-20 md:py-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-[#00D9FF]/20 border border-amber-500/30 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-amber-400" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-300 via-white to-[#00D9FF] bg-clip-text text-transparent">
              LOS 150 SELLOS<br />DE LOS SALMOS
            </h1>
            <p className="text-lg text-zinc-400 mb-2">150 declaraciones finales — 150 semillas de fe</p>
            <p className="text-sm text-zinc-500 mb-8">Una guía para el alma</p>

            <p className="text-zinc-400 leading-relaxed mb-10 max-w-xl mx-auto">
              Cada Salmo termina con una última declaración. Ese versículo final es un sello espiritual que contiene
              una promesa, una advertencia, una bendición o una enseñanza. Aquí podrás recorrerlos como una escuela de fe,
              abrir uno cada día o permitir que una página te encuentre en el momento presente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/sellos/1" onClick={() => { setShowIntro(false); markProgress(1, 'reading') }}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 transition-all">
                <BookOpen className="w-5 h-5" /> COMENZAR POR EL SELLO 1
              </Link>
              <Link href="/sellos/hoy"
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl border border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF]/10 transition-all">
                <Sun className="w-5 h-5" /> ABRIR EL SELLO DE HOY
              </Link>
              <Link href="/sellos/aleatorio"
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl border border-zinc-600 text-zinc-300 hover:bg-zinc-800 transition-all">
                <Shuffle className="w-5 h-5" /> ABRIR UN SELLO AL AZAR
              </Link>
            </div>

            <p className="text-xs text-zinc-600 italic">
              Una obra de Miguel Soria Martínez &middot; Integrada en ZAFIRO &middot; Con ELIANA como guía inteligente
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-amber-400" />
              150 Sellos de los Salmos
            </h1>
            <p className="text-sm text-zinc-500 mt-1">Cada Salmo termina con un sello — cada sello puede abrir una puerta</p>
          </div>
          <Link href="/sellos/aleatorio" className="flex items-center gap-2 text-sm text-[#00D9FF] hover:text-white border border-[#00D9FF]/30 px-4 py-2 rounded-xl hover:bg-[#00D9FF]/10 transition-all">
            <Shuffle className="w-4 h-4" /> Aleatorio
          </Link>
        </motion.div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            { label: 'Progreso', value: `${stats.percent}%`, icon: TrendingUp, color: 'text-emerald-400' },
            { label: 'Completados', value: `${stats.completed}/${stats.total}`, icon: CheckCircle, color: 'text-amber-400' },
            { label: 'Favoritos', value: stats.favorites, icon: Heart, color: 'text-pink-400' },
            { label: 'Notas', value: stats.journalCount, icon: Bookmark, color: 'text-[#00D9FF]' },
            { label: 'Leyendo', value: stats.reading, icon: BookOpen, color: 'text-purple-400' },
          ].map((s, i) => (
            <div key={s.label} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-center">
              <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Continue last seal */}
        {lastSeal && (
          <Link href={`/sellos/${lastSeal.numero}`}
            className="block mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-[#00D9FF]/10 border border-amber-500/20 hover:border-amber-500/40 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400">Continuar leyendo</span>
                <p className="text-sm font-semibold mt-1">Sello #{lastSeal.numero} — {lastSeal.tema}</p>
                <p className="text-xs text-zinc-500 italic truncate max-w-md">{lastSeal.versiculo}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        )}

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por versículo, tema o reflexión..."
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#00D9FF]/50"
            />
          </div>
          <select value={filterTheme} onChange={e => setFilterTheme(e.target.value)}
            className="bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-300 focus:outline-none focus:border-[#00D9FF]/50">
            <option value="">Todos los temas</option>
            {themes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {filtered.map(seal => (
              <Link key={seal.numero} href={`/sellos/${seal.numero}`}>
                <SealCard seal={seal} isFav={favorites.includes(seal.numero)} onToggleFav={() => handleToggleFav(seal.numero)} />
              </Link>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p>No se encontraron sellos con ese criterio.</p>
          </div>
        )}

        {/* Mapa visual */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Gem className="w-5 h-5 text-[#00D9FF]" /> Mapa de los 150 Sellos
          </h2>
          <SealVisualGrid progress={progress} favorites={favorites} onSelect={num => window.location.href = `/sellos/${num}`} />
          <div className="flex gap-4 mt-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-zinc-900/40 border border-zinc-700/40" /> No leído</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#00D9FF]/10 border border-[#00D9FF]/60" /> Leyendo</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500/10 border border-amber-500/60" /> Completado</span>
          </div>
        </div>
      </div>
    </div>
  )
}



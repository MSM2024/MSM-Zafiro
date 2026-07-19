'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getVillaPhases, getVillaFinancialSummary, getVillaProgress, VILLA_CABINS } from '@/lib/villa-esperanza'
import { Heart, Building2, TreePine, Church, DollarSign, ArrowRight, CheckCircle, Clock, AlertTriangle, BedDouble, MapPin } from 'lucide-react'
import type { VillaPhase } from '@/lib/villa-esperanza'

const modules = [
  { href: '/villa-esperanza/villa-azul', icon: Building2, title: 'Villa Azul', desc: 'Arquitectura, planos y estado de construcción de la villa principal con piscina infinita.', color: 'text-[#00D9FF]' },
  { href: '/villa-esperanza/cabanas', icon: BedDouble, title: 'Cabañas de Lujo', desc: 'Catálogo de cabañas, disponibilidad, reservas y galería.', color: 'text-emerald-400' },
  { href: '/villa-esperanza/santuario', icon: Church, title: 'Santuario Sagrado', desc: 'Espacio espiritual, agenda de actividades y normas de convivencia.', color: 'text-amber-400' },
  { href: '/villa-esperanza/arbol-de-la-vida', icon: TreePine, title: 'Árbol de la Vida', desc: 'Árbol genealógico, memorial familiar y legado.', color: 'text-purple-400' },
  { href: '/villa-esperanza/financiamiento', icon: DollarSign, title: 'Financiamiento', desc: 'Meta de $5M, donaciones, inversiones y transparencia financiera.', color: 'text-rose-400' },
]

export default function VillaEsperanzaPage() {
  usePageTitle('Villa Esperanza — ZAFIRO')
  const [phases] = useState(() => getVillaPhases())
  const [financial] = useState(() => getVillaFinancialSummary())
  const [progress] = useState(() => getVillaProgress())

  const pct = financial ? Math.min(100, Math.round((financial.raisedUsd / financial.goalUsd) * 100)) : 0

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00D9FF]/5 via-transparent to-[#050816]" />
        <div className="relative z-10 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Heart className="w-12 h-12 text-[#00D9FF] mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#00D9FF] via-emerald-400 to-amber-400 bg-clip-text text-transparent">
              Villa Esperanza
            </h1>
            <p className="text-lg text-slate-300 mt-3 max-w-2xl mx-auto">
              Hospital Holístico — Cuba. Un espacio de sanación, conexión y transformación.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-slate-400">
              <MapPin className="w-4 h-4" />
              <span>Las Siete Vueltas, Cuba</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-20 space-y-8 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-[#00D9FF]">${financial?.raisedUsd.toLocaleString() || '0'}</p>
            <p className="text-xs text-slate-400">Recaudado</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-400">${financial?.goalUsd.toLocaleString() || '5,000,000'}</p>
            <p className="text-xs text-slate-400">Meta Total</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{progress?.phaseCount || 0}</p>
            <p className="text-xs text-slate-400">Fases del Proyecto</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-purple-400">{financial?.donorCount || 0}</p>
            <p className="text-xs text-slate-400">Donantes</p>
          </motion.div>
        </div>

        <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Progreso Financiero</h2>
            <span className="text-xs text-slate-400">{pct}%</span>
          </div>
          <div className="w-full h-2 bg-[#1A1B3A] rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full bg-gradient-to-r from-[#00D9FF] to-purple-400 rounded-full" />
          </div>
          <p className="text-xs text-slate-500 mt-2">${financial?.committedUsd.toLocaleString() || '0'} comprometidos adicionales</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => (
            <Link key={m.href} href={m.href}>
              <motion.div whileHover={{ scale: 1.02 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5 hover:border-[#00D9FF]/30 transition-all h-full">
                <m.icon className={`w-8 h-8 ${m.color} mb-3`} />
                <h3 className="text-sm font-semibold text-white mb-1">{m.title}</h3>
                <p className="text-xs text-slate-400">{m.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00D9FF]" /> Fases del Proyecto
          </h2>
          <div className="space-y-3">
            {phases.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-[#1A1B3A]/50 last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  {p.status === 'completed' ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> :
                   p.status === 'in_progress' ? <Clock className="w-4 h-4 text-[#00D9FF] flex-shrink-0" /> :
                   <AlertTriangle className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">${p.budget.toLocaleString()} · {p.milestones.length} hitos</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${
                  p.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                  p.status === 'in_progress' ? 'bg-[#00D9FF]/10 text-[#00D9FF]' :
                  'bg-slate-500/10 text-slate-400'
                }`}>{p.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-emerald-400" /> Cabañas Disponibles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VILLA_CABINS.filter(c => c.available).slice(0, 4).map(c => (
              <div key={c.id} className="bg-[#050816] rounded-lg p-3 border border-[#1A1B3A]">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-white">{c.name}</p>
                  <span className="text-xs text-emerald-400">${c.price}/noche</span>
                </div>
                <p className="text-xs text-slate-400">{c.capacity} personas · {c.amenities.slice(0, 3).join(', ')}</p>
              </div>
            ))}
          </div>
          <Link href="/villa-esperanza/cabanas" className="flex items-center gap-1 text-xs text-[#00D9FF] mt-3 hover:underline">
            Ver todas las cabañas <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}

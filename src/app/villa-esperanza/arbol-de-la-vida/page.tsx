'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { usePageTitle } from '@/lib/usePageTitle'
import { ArrowLeft, TreePine, Users, Heart, BookOpen, Share2, Star } from 'lucide-react'

const legacyNodes = [
  { name: 'Miguel Soria Martínez', relation: 'Fundador', era: '1986 — presente', icon: Star, color: 'text-[#00D9FF]' },
  { name: 'Familia Soria', relation: 'Linaje', era: 'Generaciones', icon: Users, color: 'text-emerald-400' },
  { name: 'Familia Martínez', relation: 'Linaje', era: 'Generaciones', icon: Users, color: 'text-amber-400' },
  { name: 'Encuentro 2026', relation: 'Reunión Familiar', era: '16 de agosto de 2026', icon: Heart, color: 'text-rose-400' },
]

export default function ArbolDeLaVidaPage() {
  usePageTitle('Árbol de la Vida — Villa Esperanza')

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/villa-esperanza" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3 h-3" /> Volver a Villa Esperanza
        </Link>

        <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <TreePine className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Árbol de la Vida</h1>
              <p className="text-xs text-slate-400">Memorial familiar y legado genealógico</p>
            </div>
          </div>

          <div className="flex items-center justify-center py-12 mb-6">
            <div className="relative">
              <TreePine className="w-32 h-32 text-purple-400/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Heart className="w-8 h-8 text-[#00D9FF]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {legacyNodes.map(n => (
              <motion.div key={n.name} whileHover={{ scale: 1.02 }}
                className="bg-[#050816] border border-[#1A1B3A] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <n.icon className={`w-4 h-4 ${n.color}`} />
                  <span className="text-sm font-medium text-white">{n.name}</span>
                </div>
                <p className="text-xs text-slate-400">{n.relation}</p>
                <p className="text-[10px] text-slate-500">{n.era}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/familia" className="bg-[#050816] border border-[#1A1B3A] rounded-lg p-3 text-center hover:border-purple-400/30 transition-all">
              <Users className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <p className="text-xs text-slate-300">Árbol Familiar</p>
            </Link>
            <Link href="/familia/galeria" className="bg-[#050816] border border-[#1A1B3A] rounded-lg p-3 text-center hover:border-purple-400/30 transition-all">
              <Heart className="w-5 h-5 text-rose-400 mx-auto mb-1" />
              <p className="text-xs text-slate-300">Galería</p>
            </Link>
            <Link href="/familia/cronologia" className="bg-[#050816] border border-[#1A1B3A] rounded-lg p-3 text-center hover:border-purple-400/30 transition-all">
              <BookOpen className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <p className="text-xs text-slate-300">Cronología</p>
            </Link>
            <Link href="/familia/invitacion" className="bg-[#050816] border border-[#1A1B3A] rounded-lg p-3 text-center hover:border-purple-400/30 transition-all">
              <Share2 className="w-5 h-5 text-[#00D9FF] mx-auto mb-1" />
              <p className="text-xs text-slate-300">Invitación</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

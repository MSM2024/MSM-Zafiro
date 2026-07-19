'use client'

import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { SANCTUARY_INFO } from '@/lib/villa-esperanza'
import { ArrowLeft, Church, Clock, BookOpen, Heart, Sun, Star, Moon as MoonIcon, SunDim } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const timeIcons: Record<string, LucideIcon> = {
  '06:00': Sun, '07:00': Sun, '09:00': SunDim,
  '12:00': SunDim, '15:00': Star, '18:00': MoonIcon, '20:00': MoonIcon,
}

export default function SantuarioPage() {
  usePageTitle('Santuario Sagrado — Villa Esperanza')

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/villa-esperanza" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3 h-3" /> Volver a Villa Esperanza
        </Link>

        <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Church className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Santuario Sagrado</h1>
              <p className="text-xs text-slate-400">El corazón espiritual de Villa Esperanza</p>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">{SANCTUARY_INFO.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" /> Normas de Convivencia
              </h2>
              <div className="space-y-2">
                {SANCTUARY_INFO.norms.map((n, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-[#050816] rounded-lg px-3 py-2">
                    <Heart className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                    {n}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" /> Agenda de Actividades
              </h2>
              <div className="space-y-2">
                {SANCTUARY_INFO.schedule.map((s, i) => {
                  const Icon = timeIcons[s.time] || Clock
                  return (
                    <div key={i} className="flex items-center gap-3 text-xs bg-[#050816] rounded-lg px-3 py-2">
                      <Icon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span className="text-slate-500 w-10">{s.time}</span>
                      <span className="text-slate-300">{s.activity}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-[#050816] rounded-lg p-4 border border-[#1A1B3A]">
            <h2 className="text-sm font-semibold text-white mb-2">Historia del Lugar</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{SANCTUARY_INFO.history}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { getVillaPhases } from '@/lib/villa-esperanza'
import { ArrowLeft, Building2, Waves, BedDouble, Users, FileText, DollarSign, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import type { VillaPhase } from '@/lib/villa-esperanza'

export default function VillaAzulPage() {
  usePageTitle('Villa Azul — Villa Esperanza')
  const [phase] = useState(() => getVillaPhases().find(p => p.id === 'phase-2'))

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/villa-esperanza" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3 h-3" /> Volver a Villa Esperanza
        </Link>

        <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-[#00D9FF]" />
            <div>
              <h1 className="text-xl font-bold text-white">Villa Azul</h1>
              <p className="text-xs text-slate-400">La villa principal con piscina infinita y vista panorámica</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-[#050816] rounded-lg p-3 text-center border border-[#1A1B3A]">
              <BedDouble className="w-4 h-4 text-[#00D9FF] mx-auto mb-1" />
              <p className="text-sm font-bold text-white">8</p>
              <p className="text-[10px] text-slate-400">Habitaciones</p>
            </div>
            <div className="bg-[#050816] rounded-lg p-3 text-center border border-[#1A1B3A]">
              <Waves className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">1</p>
              <p className="text-[10px] text-slate-400">Piscina Infinita</p>
            </div>
            <div className="bg-[#050816] rounded-lg p-3 text-center border border-[#1A1B3A]">
              <Users className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">16</p>
              <p className="text-[10px] text-slate-400">Capacidad Máxima</p>
            </div>
            <div className="bg-[#050816] rounded-lg p-3 text-center border border-[#1A1B3A]">
              <DollarSign className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">$1.5M</p>
              <p className="text-[10px] text-slate-400">Presupuesto</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-white mb-2">Áreas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {['Habitaciones principales', 'Suite presidencial', 'Piscina infinita', 'Terraza panorámica', 'Salón de eventos', 'Comedor principal', 'Cocina industrial', 'Área de spa', 'Gimnasio', 'Biblioteca'].map(a => (
                  <div key={a} className="flex items-center gap-2 text-xs text-slate-300 bg-[#050816] rounded-lg px-3 py-2">
                    <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {phase && (
              <div>
                <h2 className="text-sm font-semibold text-white mb-2">Estado de Construcción</h2>
                <div className="bg-[#050816] rounded-lg p-4 border border-[#1A1B3A]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">{phase.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${phase.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {phase.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{phase.description}</p>
                  <div className="space-y-2">
                    {phase.milestones.map((m: { id: string; name: string; status: string; targetDate: string }) => (
                      <div key={m.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {m.status === 'completed' ? <CheckCircle className="w-3 h-3 text-emerald-400" /> :
                           m.status === 'in_progress' ? <Clock className="w-3 h-3 text-[#00D9FF]" /> :
                           <AlertTriangle className="w-3 h-3 text-slate-500" />}
                          <span className="text-slate-300">{m.name}</span>
                        </div>
                        <span className="text-slate-500">{m.targetDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-sm font-semibold text-white mb-2">Planos y Renders</h2>
              <div className="grid grid-cols-2 gap-3">
                {['Planta Baja', 'Segundo Piso', 'Vista Frontal', 'Piscina'].map(p => (
                  <div key={p} className="bg-[#050816] border border-[#1A1B3A] rounded-lg p-8 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">{p}</p>
                      <p className="text-[10px] text-slate-600">Render próximamente</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

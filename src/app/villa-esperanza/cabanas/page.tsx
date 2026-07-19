'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getVillaCabins } from '@/lib/villa-esperanza'
import { ArrowLeft, BedDouble, Users, Wifi, CheckCircle, XCircle, Sparkles, Flame, Waves, Star, Moon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const amenityIcons: Record<string, LucideIcon> = {
  Jacuzzi: Sparkles, WiFi: Wifi, 'Aire acondicionado': BedDouble,
  'Cocina equipada': BedDouble, Terraza: Star, Fogata: Flame,
  Parrilla: Flame, Estacionamiento: BedDouble, 'Piscina privada': Waves,
  Galería: Star, 'Cielo abierto': Moon, Minibar: Sparkles,
  Piscina: Waves, 'Juegos infantiles': BedDouble, 'Cocina completa': BedDouble,
}

export default function CabanasPage() {
  usePageTitle('Cabañas de Lujo — Villa Esperanza')
  const cabins = getVillaCabins()

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/villa-esperanza" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3 h-3" /> Volver a Villa Esperanza
        </Link>

        <div className="flex items-center gap-3">
          <BedDouble className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-xl font-bold text-white">Cabañas de Lujo</h1>
            <p className="text-xs text-slate-400">{cabins.length} cabañas en Villa Esperanza</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cabins.map(c => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-[#00D9FF]/5 to-emerald-400/5 flex items-center justify-center border-b border-[#1A1B3A]">
                <BedDouble className="w-10 h-10 text-slate-600" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">{c.name}</h3>
                  <div className="flex items-center gap-1">
                    {c.available ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                    <span className={`text-[10px] ${c.available ? 'text-emerald-400' : 'text-red-400'}`}>{c.available ? 'Disponible' : 'Reservada'}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-3">{c.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.capacity} pers.</span>
                  <span className="flex items-center gap-1"><span className="text-emerald-400 font-semibold">${c.price}</span>/noche</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {c.amenities.map(a => {
                    const Icon = amenityIcons[a] ?? Sparkles
                    return (
                      <span key={a} className="flex items-center gap-1 text-[10px] text-slate-400 bg-[#050816] px-2 py-1 rounded-full">
                        <Icon className="w-2.5 h-2.5" />{a}
                      </span>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

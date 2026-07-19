'use client'

import { motion } from "motion/react"
import { Globe } from "lucide-react"
import type { AudienceSegment } from "@/lib/followers/types"

interface Props {
  segments: AudienceSegment[]
}

export default function WorldFollowerMap({ segments }: Props) {
  const sorted = [...segments].sort((a, b) => b.percentage - a.percentage)
  const topSegments = sorted.slice(0, 8)

  return (
    <div className="p-5 rounded-2xl glass">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-4 h-4 text-[#00D9FF]" />
        <h3 className="text-sm font-bold text-white">Distribución por país</h3>
      </div>

      <div className="space-y-2">
        {topSegments.map((seg, i) => (
          <div key={seg.id}>
            <div className="flex justify-between text-xs mb-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 w-4">{i + 1}.</span>
                <span className="text-slate-300">{seg.country}</span>
                {i === 0 && <span className="text-[8px] text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded-full">PRINCIPAL</span>}
              </div>
              <span className="text-white font-medium">{seg.percentage}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${seg.percentage}%` }}
                transition={{ duration: 1, delay: i * 0.08, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-[#00D9FF] to-violet-500"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Ciudad principal</span>
          <span className="text-white font-medium">{topSegments[0]?.city || '—'}</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-slate-500">Países detectados</span>
          <span className="text-white font-medium">{segments.length}</span>
        </div>
      </div>
    </div>
  )
}

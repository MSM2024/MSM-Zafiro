'use client'

import { useState } from "react"
import { motion } from "motion/react"
import { Target, TrendingUp, Plus, CheckCircle, PauseCircle, Clock } from "lucide-react"
import type { GrowthTarget, ProjectionScenario } from "@/lib/followers/types"

interface Props {
  targets: GrowthTarget[]
  totalFollowers: number
  onAddTarget?: () => void
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

const STATUS_CONFIG = {
  ACTIVE: { icon: TrendingUp, color: 'text-emerald-400', label: 'ACTIVA' },
  ACHIEVED: { icon: CheckCircle, color: 'text-[#00D9FF]', label: 'LOGRADA' },
  PAUSED: { icon: PauseCircle, color: 'text-amber-400', label: 'PAUSADA' },
  EXPIRED: { icon: Clock, color: 'text-slate-500', label: 'VENCIDA' },
}

const SCENARIOS: { id: ProjectionScenario; label: string; multiplier: number; color: string }[] = [
  { id: 'conservador', label: 'Conservador', multiplier: 0.8, color: 'text-amber-400' },
  { id: 'esperado', label: 'Esperado', multiplier: 1.0, color: 'text-emerald-400' },
  { id: 'acelerado', label: 'Acelerado', multiplier: 1.5, color: 'text-[#00D9FF]' },
]

export default function TargetProjection({ targets, totalFollowers, onAddTarget }: Props) {
  const [scenario, setScenario] = useState<ProjectionScenario>('esperado')

  const currentScenario = SCENARIOS.find(s => s.id === scenario)!
  const projected = Math.round(totalFollowers * currentScenario.multiplier)

  const activeTarget = targets.find(t => t.status === 'ACTIVE')
  const achievedTargets = targets.filter(t => t.status === 'ACHIEVED').length

  return (
    <div className="p-5 rounded-2xl glass">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#00D9FF]" />
          <h3 className="text-sm font-bold text-white">Metas y Proyección</h3>
        </div>
        <button onClick={onAddTarget} className="p-1.5 rounded-lg bg-[#00D9FF]/10 text-[#00D9FF] hover:bg-[#00D9FF]/20 transition-all">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-1 mb-4 p-0.5 rounded-lg bg-slate-900/60">
        {SCENARIOS.map(s => (
          <button key={s.id} onClick={() => setScenario(s.id)}
            className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
              scenario === s.id ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center mb-4">
        <p className="text-[10px] text-slate-500 uppercase">Proyección {currentScenario.label}</p>
        <p className="text-3xl font-black text-white mt-1">{formatCount(projected)}</p>
        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">PROYECCIÓN</span>
      </div>

      <div className="space-y-2">
        {targets.length === 0 ? (
          <div className="text-center py-3">
            <p className="text-[10px] text-slate-600">No hay metas creadas</p>
          </div>
        ) : (
          targets.slice(0, 4).map(target => {
            const sc = STATUS_CONFIG[target.status]
            const Icon = sc.icon
            const progress = target.currentFollowers > 0
              ? Math.min(100, Math.round((target.currentFollowers / target.targetFollowers) * 100))
              : 0
            return (
              <div key={target.id} className="p-3 rounded-xl bg-slate-900/40">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3 h-3 ${sc.color}`} />
                    <span className="text-xs text-slate-300">{target.platform === 'all' ? 'Todas las plataformas' : target.platform}</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full bg-slate-800 ${sc.color}`}>{sc.label}</span>
                </div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-slate-500">{formatCount(target.currentFollowers)}</span>
                  <span className="text-[#00D9FF] font-medium">META {formatCount(target.targetFollowers)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-[#00D9FF] to-violet-500"
                  />
                </div>
                <p className="text-[9px] text-slate-600 mt-1">{progress}% completado</p>
              </div>
            )
          })
        )}
      </div>

      {achievedTargets > 0 && (
        <p className="text-[10px] text-slate-600 mt-3 text-center">{achievedTargets} meta{achievedTargets !== 1 ? 's' : ''} alcanzada{achievedTargets !== 1 ? 's' : ''}</p>
      )}
    </div>
  )
}

'use client'

import { motion } from "motion/react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { FollowersDashboard } from "@/lib/followers/types"

interface Props {
  dashboard: FollowersDashboard
}

export default function GrowthTimeline({ dashboard }: Props) {
  const periods = [
    { label: 'Hoy', value: dashboard.followersToday, color: 'text-[#00D9FF]' },
    { label: 'Esta semana', value: dashboard.followersThisWeek, color: 'text-emerald-400' },
    { label: 'Este mes', value: dashboard.followersThisMonth, color: 'text-violet-400' },
  ]

  const maxValue = Math.max(...periods.map(p => p.value), 1)

  return (
    <div className="p-5 rounded-2xl glass">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        {dashboard.trend === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-400" /> :
         dashboard.trend === 'down' ? <TrendingDown className="w-4 h-4 text-red-400" /> :
         <Minus className="w-4 h-4 text-slate-400" />}
        Crecimiento
        <span className={`text-[10px] font-normal ml-auto ${dashboard.trend === 'up' ? 'text-emerald-400' : dashboard.trend === 'down' ? 'text-red-400' : 'text-slate-400'}`}>
          {dashboard.monthlyGrowthPercent >= 0 ? '+' : ''}{dashboard.monthlyGrowthPercent}%
        </span>
      </h3>

      <div className="space-y-3">
        {periods.map((p, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">{p.label}</span>
              <span className={`font-bold ${p.color}`}>+{p.value.toLocaleString()}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(p.value / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  i === 0 ? 'bg-gradient-to-r from-[#00D9FF] to-blue-500' :
                  i === 1 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
                  'bg-gradient-to-r from-violet-400 to-purple-500'
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Total seguidores</span>
          <span className="text-white font-bold">{dashboard.totalFollowers.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-slate-500">Alcance total</span>
          <span className="text-white font-bold">{dashboard.reach.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-slate-500">Usuarios activos</span>
          <span className="text-white font-bold">{dashboard.activeUsers.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

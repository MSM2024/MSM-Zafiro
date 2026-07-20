'use client'

import Link from "next/link"
import { Trophy } from "lucide-react"
import { getLeaderboard, type LeaderboardItem } from "@/lib/leaderboard"
import { PILLAR_LABELS, getPillarColor } from "@/lib/notifications"

interface Props {
  max?: number
  title?: string
}

export function CrossPillarLeaderboard({ max = 10, title = "Top del Imperio MSM" }: Props) {
  const items = getLeaderboard().slice(0, max)

  return (
    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4 text-amber-400" />
        <h3 className="text-xs font-bold text-white">{title}</h3>
      </div>
      <div className="space-y-1">
        {items.map((item, i) => {
          const colorClass = getPillarColor(item.pillar)
          const rankColors = ["text-amber-400", "text-slate-300", "text-amber-600", "text-slate-500", "text-slate-500"]
          return (
            <Link key={`${item.pillar}_${item.rank}`} href={item.href}
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800/40 transition-all group">
              <span className={`w-5 text-center text-xs font-black ${rankColors[i] || 'text-slate-600'}`}>
                {i + 1}
              </span>
              <span className="text-sm">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-white group-hover:text-[#00D9FF] transition-colors truncate">{item.label}</p>
                <p className="text-[8px] text-slate-500">{item.value}</p>
              </div>
              <span className={`text-[7px] font-mono px-1 py-px rounded ${colorClass}`}>
                {PILLAR_LABELS[item.pillar] || item.pillar}
              </span>
            </Link>
          )
        })}
        {items.length === 0 && (
          <p className="text-[10px] text-slate-500 text-center py-4">Aún no hay datos suficientes.</p>
        )}
      </div>
    </div>
  )
}

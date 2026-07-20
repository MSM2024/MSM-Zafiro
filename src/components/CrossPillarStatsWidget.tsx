'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { getCrossPillarStats, type CrossPillarStats } from "@/lib/cross-pillar-stats"

const PILLAR_CONFIG: Record<string, { label: string; color: string; href: string; icon: string }> = {
  identity: { label: "Identidad", color: "text-purple-400 border-purple-500/30", href: "/admin/usuarios", icon: "👤" },
  marketplace: { label: "Marketplace", color: "text-emerald-400 border-emerald-500/30", href: "/marketplace", icon: "🏪" },
  editorial: { label: "Editorial", color: "text-blue-400 border-blue-500/30", href: "/editorial", icon: "📖" },
  economy: { label: "Economía", color: "text-amber-400 border-amber-500/30", href: "/admin/ledger", icon: "💰" },
  sellos: { label: "Sellos", color: "text-rose-400 border-rose-500/30", href: "/sellos", icon: "🔮" },
}

export default function CrossPillarStatsWidget() {
  const [stats, setStats] = useState<CrossPillarStats | null>(null)

  useEffect(() => {
    setStats(getCrossPillarStats())
  }, [])

  if (!stats) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
      {Object.entries(PILLAR_CONFIG).map(([key, cfg]) => {
        const s = stats[key as keyof CrossPillarStats] as Record<string, number>
        const entries = Object.entries(s)
        return (
          <Link key={key} href={cfg.href}
            className={`rounded-xl border bg-slate-900/40 p-3 hover:brightness-110 transition-all ${cfg.color}`}>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm">{cfg.icon}</span>
              <span className={`text-[9px] font-bold uppercase tracking-wider ${cfg.color.split(" ")[0]}`}>{cfg.label}</span>
            </div>
            <div className="space-y-0.5">
              {entries.map(([k, v]) => (
                <div key={k} className="flex justify-between text-[10px]">
                  <span className="text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-white font-bold">{typeof v === 'number' ? v.toLocaleString() : v}</span>
                </div>
              ))}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

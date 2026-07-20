'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { getActivityTimeline, getPillarActivityIcon, getPillarActivityColor, type ActivityEvent } from "@/lib/activity-timeline"
import { ExternalLink } from "lucide-react"

export function ActivityTimeline({ max = 15, pillarFilter }: { max?: number; pillarFilter?: string }) {
  const [events, setEvents] = useState<ActivityEvent[]>([])

  useEffect(() => {
    setEvents(getActivityTimeline(max, pillarFilter))
  }, [max, pillarFilter])

  if (events.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/50 border border-slate-800/60 p-6 text-center">
        <p className="text-xs text-slate-500">No hay actividad reciente</p>
      </div>
    )
  }

  function timeAgo(ts: string): string {
    const diff = Date.now() - new Date(ts).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "ahora"
    if (mins < 60) return `hace ${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `hace ${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `hace ${days}d`
    return new Date(ts).toLocaleDateString()
  }

  return (
    <div className="rounded-2xl bg-slate-900/50 border border-slate-800/60 p-4">
      <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Actividad Reciente
      </h3>
      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {events.map((e) => (
          <div key={e.id} className="flex items-start gap-2 py-1.5 border-b border-slate-800/30 last:border-0">
            <span className="text-xs mt-0.5">{getPillarActivityIcon(e.pillar)}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] font-bold uppercase ${getPillarActivityColor(e.pillar)}`}>{e.type}</span>
                <span className="text-[7px] text-slate-600">{timeAgo(e.timestamp)}</span>
              </div>
              <p className="text-[10px] text-slate-300 truncate">{e.summary}</p>
            </div>
            {e.link && (
              <Link href={e.link} className="text-slate-600 hover:text-[#00D9FF] transition-colors shrink-0 mt-0.5">
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

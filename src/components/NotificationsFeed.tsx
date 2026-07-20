'use client'

import Link from "next/link"
import { Bell, ExternalLink } from "lucide-react"
import {
  getAllNotifications,
  PILLAR_LABELS,
  getPillarColor,
  type AppNotification,
} from "@/lib/notifications"

interface Props {
  max?: number
  showViewAll?: boolean
  title?: string
}

export function NotificationsFeed({ max = 5, showViewAll = true, title = "Notificaciones del Imperio" }: Props) {
  const notifications = getAllNotifications().slice(0, max)

  if (notifications.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-4 h-4 text-[#00D9FF]" />
          <h3 className="text-xs font-bold text-white">{title}</h3>
        </div>
        <p className="text-[10px] text-slate-500 text-center py-4">No hay notificaciones recientes.</p>
        {showViewAll && (
          <Link href="/os/notifications" className="block text-[8px] text-[#00D9FF] hover:underline text-center mt-1">
            Ver todas →
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#00D9FF]" />
          <h3 className="text-xs font-bold text-white">{title}</h3>
        </div>
        {showViewAll && (
          <Link href="/os/notifications" className="text-[8px] text-[#00D9FF] hover:underline">Ver todas</Link>
        )}
      </div>
      <div className="space-y-1.5">
        {notifications.map(n => {
          const colorClass = getPillarColor(n.pillar)
          return (
            <Link key={n.id} href={n.actionUrl || "/os/notifications"}
              className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-slate-800/40 transition-all group">
              <span className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${n.read ? 'bg-slate-600' : 'bg-[#00D9FF]'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[7px] font-mono px-1 py-0.5 rounded ${colorClass}`}>
                    {PILLAR_LABELS[n.pillar] || n.pillar}
                  </span>
                  <p className={`text-[10px] ${n.read ? 'text-slate-500' : 'text-white font-medium'}`}>{n.title}</p>
                </div>
                <p className="text-[9px] text-slate-500 truncate">{n.message}</p>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

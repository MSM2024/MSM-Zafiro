'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePageTitle } from "@/lib/usePageTitle"
import { Bell, X, ExternalLink, ShoppingBag, BookOpen, PiggyBank, User, Stamp } from "lucide-react"
import {
  getAllNotifications,
  markNotificationRead,
  markAllRead,
  deleteNotification,
  PILLAR_LABELS,
  getPillarColor,
  type AppNotification,
} from "@/lib/notifications"

const PILLAR_ICONS: Record<string, typeof Bell> = {
  marketplace: ShoppingBag,
  editorial: BookOpen,
  economy: PiggyBank,
  identity: User,
  sellos: Stamp,
  system: Bell,
}

export default function OsNotificationsPage() {
  usePageTitle("ZAFIRO OS — Notificaciones")
  const [notifications, setNotifications] = useState<AppNotification[]>([])

  const refresh = () => setNotifications(getAllNotifications())

  useEffect(() => { refresh() }, [])

  const handleMarkRead = (id: string) => {
    markNotificationRead(id)
    refresh()
  }

  const handleMarkAllRead = () => {
    markAllRead()
    refresh()
  }

  const handleDelete = (id: string) => {
    deleteNotification(id)
    refresh()
  }

  const unread = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-full p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Centro de Notificaciones</h1>
              <p className="text-xs text-slate-400">{unread} sin leer · {notifications.length} total — Imperio MSM</p>
            </div>
          </div>
          <div className="flex gap-2">
            {unread > 0 && (
              <button onClick={handleMarkAllRead}
                className="px-3 py-1.5 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] text-xs font-medium hover:bg-[#00D9FF]/20 transition-all">
                Marcar todo leído
              </button>
            )}
            <button onClick={refresh}
              className="px-3 py-1.5 rounded-xl bg-slate-800/60 text-slate-400 text-xs font-medium hover:bg-slate-700/60 transition-all">
              Actualizar
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {notifications.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800/60 text-center">
              <Bell className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No hay notificaciones del Imperio</p>
            </div>
          ) : (
            notifications.map(n => {
              const Icon = PILLAR_ICONS[n.pillar] || Bell
              const colorClass = getPillarColor(n.pillar)
              const content = (
                <div className={`p-4 rounded-2xl border transition-all ${n.read ? 'border-slate-800/60 opacity-60' : 'border-slate-700/60'} ${!n.read ? 'cursor-pointer' : ''}`}
                  onClick={() => !n.read && handleMarkRead(n.id)}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${colorClass}`}>
                          {PILLAR_LABELS[n.pillar] || n.pillar}
                        </span>
                        <p className={`text-sm ${n.read ? 'text-slate-400' : 'text-white font-medium'}`}>{n.title}</p>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-slate-600 mt-1">{new Date(n.timestamp).toLocaleString('es-ES')}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {n.actionUrl && (
                        <Link href={n.actionUrl} onClick={e => e.stopPropagation()}
                          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-[#00D9FF] transition-all">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(n.id) }}
                        className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-red-400 transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
              return n.actionUrl ? (
                <Link key={n.id} href={n.actionUrl} className="block group">
                  {content}
                </Link>
              ) : (
                <div key={n.id}>{content}</div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

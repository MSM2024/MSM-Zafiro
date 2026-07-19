'use client'

import { useState } from "react"
import { usePageTitle } from "@/lib/usePageTitle"
import { Bell, CheckCircle, AlertTriangle, Info, X, Trash2, Diamond } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'system'
  read: boolean
  timestamp: string
}

const INITIAL: Notification[] = [
  { id: '1', title: 'Bienvenido a ZAFIRO OS', message: 'Tu universo digital está listo. Explora las aplicaciones y descubre todo lo que ZAFIRO tiene para ti.', type: 'info', read: false, timestamp: '2026-07-18T17:00:00Z' },
  { id: '2', title: 'Membresía activa', message: 'Tu membresía LIFETIME_UNLIMITED está activa. Disfruta de todos los beneficios.', type: 'success', read: false, timestamp: '2026-07-18T16:00:00Z' },
  { id: '3', title: 'Actualización disponible', message: 'Nuevas funciones disponibles en ZAFIRO OS. Revisa el panel de novedades.', type: 'system', read: true, timestamp: '2026-07-17T10:00:00Z' },
]

const typeStyles: Record<string, string> = {
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  warning: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  system: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
}

const typeIcons: Record<string, typeof Bell> = {
  info: Info, success: CheckCircle, warning: AlertTriangle, system: Diamond,
}

export default function OsNotificationsPage() {
  usePageTitle("ZAFIRO OS — Notificaciones")
  const [notifications, setNotifications] = useState(INITIAL)

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const deleteNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
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
              <h1 className="text-xl font-black text-white">Notificaciones</h1>
              <p className="text-xs text-slate-400">{unread} sin leer · {notifications.length} total</p>
            </div>
          </div>
          {unread > 0 && (
            <button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
              className="px-3 py-1.5 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] text-xs font-medium hover:bg-[#00D9FF]/20 transition-all">
              Marcar todo leído
            </button>
          )}
        </div>

        <div className="space-y-2">
          {notifications.length === 0 ? (
            <div className="p-8 rounded-2xl glass text-center">
              <Bell className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No hay notificaciones</p>
            </div>
          ) : (
            notifications.map(n => {
              const Icon = typeIcons[n.type] || Bell
              return (
                <div key={n.id}
                  className={`p-4 rounded-2xl glass border transition-all ${n.read ? 'border-slate-800/60 opacity-60' : 'border-slate-700/60'} ${!n.read ? 'cursor-pointer' : ''}`}
                  onClick={() => !n.read && markRead(n.id)}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${typeStyles[n.type]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm ${n.read ? 'text-slate-400' : 'text-white font-medium'}`}>{n.title}</p>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                      <p className="text-[10px] text-slate-600 mt-1">{new Date(n.timestamp).toLocaleString('es-ES')}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteNotif(n.id) }}
                      className="p-1 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

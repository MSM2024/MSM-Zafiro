'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  MessageCircle,
  ThumbsUp,
  Award,
  UserPlus,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Bell,
  CheckCheck,
} from 'lucide-react'

interface Notification {
  id: string
  type: 'answer' | 'vote' | 'badge' | 'follow' | 'ai_response' | 'accepted' | 'mention'
  title: string
  body: string
  time: string
  read: boolean
  href: string
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'answer',
    title: 'Nueva respuesta',
    body: 'Dr. Carlos Ruiz respondió a tu pregunta sobre RAG con PostgreSQL',
    time: '2 min',
    read: false,
    href: '/question/0',
  },
  {
    id: '2',
    type: 'ai_response',
    title: 'ELIANA completó su respuesta',
    body: 'Tu pregunta sobre computación cuántica ya tiene una respuesta de IA',
    time: '15 min',
    read: false,
    href: '/question/1',
  },
  {
    id: '3',
    type: 'accepted',
    title: 'Respuesta aceptada',
    body: 'Tu respuesta en "Mejores prácticas para fine-tuning" fue aceptada',
    time: '1h',
    read: false,
    href: '/question/2',
  },
  {
    id: '4',
    type: 'badge',
    title: 'Insignia desbloqueada',
    body: 'Has obtenido la insignia "Colaborador" por 10 respuestas',
    time: '3h',
    read: true,
    href: '/profile',
  },
  {
    id: '5',
    type: 'vote',
    title: 'Votos recibidos',
    body: 'Tu respuesta en "¿Qué es Mixture of Experts?" recibió 12 votos positivos',
    time: '5h',
    read: true,
    href: '/question/3',
  },
  {
    id: '6',
    type: 'follow',
    title: 'Nuevo seguidor',
    body: 'Elena Gómez comenzó a seguirte',
    time: '1d',
    read: true,
    href: '/profile',
  },
  {
    id: '7',
    type: 'mention',
    title: 'Mención',
    body: 'Miguel Torres te mencionó en "IA Research Circle"',
    time: '2d',
    read: true,
    href: '/communities/0',
  },
]

const ICONS: Record<string, { icon: typeof MessageCircle; color: string }> = {
  answer: { icon: MessageCircle, color: 'text-indigo-400 bg-indigo-500/20' },
  vote: { icon: ThumbsUp, color: 'text-emerald-400 bg-emerald-500/20' },
  badge: { icon: Award, color: 'text-amber-400 bg-amber-500/20' },
  follow: { icon: UserPlus, color: 'text-cyan-400 bg-cyan-500/20' },
  ai_response: { icon: Sparkles, color: 'text-purple-400 bg-purple-500/20' },
  accepted: { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/20' },
  mention: { icon: Bookmark, color: 'text-rose-400 bg-rose-500/20' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070314] via-[#0a0420] to-[#070314]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-white/60 hover:text-white/90 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Bell className="w-6 h-6 text-indigo-400" />
              Notificaciones
              {unreadCount > 0 && (
                <span className="text-sm font-normal px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                  {unreadCount} nuevas
                </span>
              )}
            </h1>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Marcar todas leídas
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              filter === 'all'
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              filter === 'unread'
                ? 'bg-white/10 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            No leídas
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">
              {filter === 'unread' ? 'No tienes notificaciones sin leer' : 'No hay notificaciones'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((notification) => {
              const config = ICONS[notification.type] || ICONS.answer
              const Icon = config.icon
              return (
                <Link
                  key={notification.id}
                  href={notification.href}
                  onClick={() => markRead(notification.id)}
                  className={`block rounded-xl border p-4 transition-all hover:bg-white/[0.03] ${
                    notification.read
                      ? 'bg-white/[0.02] border-white/5'
                      : 'bg-indigo-500/[0.03] border-indigo-500/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-sm ${notification.read ? 'text-white/60' : 'text-white font-medium'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-white/40 mt-0.5">{notification.body}</p>
                        </div>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-white/30 mt-2">{notification.time}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

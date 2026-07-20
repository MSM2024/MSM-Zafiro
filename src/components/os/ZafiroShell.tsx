'use client'

import { useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Search, Grid3X3, Bell, User, Settings, ChevronRight, Command } from "lucide-react"
import { getAllNotifications } from "@/lib/notifications"
import type { BroadcastMessage } from "@/lib/broadcast"
import { useBadgeChecker } from "@/hooks/useBadgeChecker"
import { NewBadgesAlert } from "@/components/BadgesDisplay"

interface Props {
  children: ReactNode
}

interface AppEntry {
  id: string
  name: string
  icon: string
  route: string
}

const QUICK_APPS: AppEntry[] = [
  { id: 'profile', name: 'Mi Perfil', icon: '👤', route: '/zafiro/perfil' },
  { id: 'eliana', name: 'ELIANA', icon: '💎', route: '/eliana' },
  { id: 'marketplace', name: 'Marketplace', icon: '🏪', route: 'https://msmmystore.com' },
  { id: 'editorial', name: 'Editorial', icon: '📖', route: '/editorial' },
  { id: 'economia', name: 'Economía', icon: '💰', route: '/economia' },
  { id: 'comunidad', name: 'Comunidad', icon: '🌐', route: '/universo' },
  { id: 'familia', name: 'Familia', icon: '👨‍👩‍👧‍👦', route: '/familia' },
  { id: 'mensajes', name: 'Mensajes', icon: '💬', route: '/messages' },
  { id: 'archivos', name: 'Archivos', icon: '📁', route: '/dashboard' },
  { id: 'cinema', name: 'Holo Cinema', icon: '🎬', route: '/holo-cinema' },
]

function NotificationBell() {
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    const update = () => {
      const all = getAllNotifications()
      setUnread(all.filter(n => !n.read).length)
    }
    update()
    const interval = setInterval(update, 10000)
    try {
      const { onBroadcastMessage } = require("@/lib/broadcast")
      const unsub = onBroadcastMessage((msg: BroadcastMessage) => {
        if (msg.type === "notification:new" || msg.type === "data:changed") {
          update()
        }
      })
      return () => { clearInterval(interval); unsub() }
    } catch {
      return () => clearInterval(interval)
    }
  }, [])

  return (
    <Link href="/os/notifications" className="relative w-8 h-8 rounded-lg bg-slate-900/60 flex items-center justify-center hover:bg-slate-800/60 transition-all group">
      <Bell className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#00D9FF] text-[9px] font-bold text-white flex items-center justify-center">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </Link>
  )
}

export default function ZafiroShell({ children }: Props) {
  const [launcherOpen, setLauncherOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const newBadges = useBadgeChecker()

  return (
    <div className="min-h-screen bg-[#050816] flex flex-col">
      <NewBadgesAlert newBadges={newBadges} />
      <header className="h-12 bg-[#0A0B1A]/90 backdrop-blur-xl border-b border-slate-800/50 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setLauncherOpen(!launcherOpen)}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D9FF]/20 to-violet-600/20 flex items-center justify-center hover:from-[#00D9FF]/30 hover:to-violet-600/30 transition-all">
            <Grid3X3 className="w-4 h-4 text-[#00D9FF]" />
          </button>
          <div className="h-5 w-px bg-slate-800" />
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar en ZAFIRO..."
              className="w-64 pl-9 pr-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#00D9FF]/30 transition-colors" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <Link href="/settings" className="w-8 h-8 rounded-lg bg-slate-900/60 flex items-center justify-center hover:bg-slate-800/60 transition-all">
            <Settings className="w-4 h-4 text-slate-400" />
          </Link>
          <div className="h-5 w-px bg-slate-800" />
          <button className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D9FF] to-violet-600 flex items-center justify-center text-xs font-bold text-white">
            MS
          </button>
        </div>
      </header>

      <main className="flex-1 relative">
        {children}
      </main>

      <footer className="h-16 bg-[#0A0B1A]/90 backdrop-blur-xl border-t border-slate-800/50 flex items-center justify-center px-4 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto max-w-full">
          {QUICK_APPS.slice(0, 8).map(app => (
            <a key={app.id} href={app.route}
              className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl hover:bg-slate-800/40 transition-all min-w-[60px]">
              <span className="text-lg">{app.icon}</span>
              <span className="text-[8px] text-slate-400 truncate max-w-[60px]">{app.name}</span>
            </a>
          ))}
          <div className="h-8 w-px bg-slate-800 mx-1" />
          <button onClick={() => setLauncherOpen(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl hover:bg-slate-800/40 transition-all">
            <Command className="w-4 h-4 text-slate-400" />
            <span className="text-[8px] text-slate-400">Apps</span>
          </button>
        </div>
      </footer>

      {launcherOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setLauncherOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-[#0A0B1A]/95 border border-slate-800/60 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[70vh] overflow-y-auto shadow-2xl shadow-black/50"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D9FF] to-violet-600 flex items-center justify-center">
                <Grid3X3 className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-white">Todas las Aplicaciones</h2>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {QUICK_APPS.map(app => (
                <a key={app.id} href={app.route}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-800/40 transition-all group"
                  onClick={() => setLauncherOpen(false)}>
                  <span className="text-2xl group-hover:scale-110 transition-transform">{app.icon}</span>
                  <span className="text-[10px] text-slate-400 text-center group-hover:text-white transition-colors">{app.name}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

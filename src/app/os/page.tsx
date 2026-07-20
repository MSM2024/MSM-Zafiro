'use client'

import { useState, useEffect, useCallback } from "react"
import { motion } from "motion/react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import { getProfiles } from "@/lib/identity"
import { getActiveProducts, getOrders } from "@/lib/marketplace"
import { getLedgerEntries, getNodeBalance } from "@/lib/ledger"
import { getDevocionales, getEditorialStats } from "@/lib/editorial"
import { getBooks } from "@/lib/biblioteca/storage"
import { getAllNotifications, PILLAR_LABELS, getPillarColor } from "@/lib/notifications"
import type { AppNotification } from "@/lib/notifications"
import { NotificationsFeed } from "@/components/NotificationsFeed"
import { CrossPillarLeaderboard } from "@/components/CrossPillarLeaderboard"
import CrossPillarStatsWidget from "@/components/CrossPillarStatsWidget"
import { ActivityTimeline } from "@/components/ActivityTimeline"
import type { BroadcastMessage } from "@/lib/broadcast"
import Link from "next/link"
import {
  Diamond, MessageCircle, ShoppingBag, BookOpen, DollarSign, Globe, Users,
  FolderOpen, Film, Settings, Bell, Search, Command, Gem, Crown,
  TrendingUp, Sparkles, BarChart3, Package, Wallet, Activity, ExternalLink,
} from "lucide-react"

export default function OsHomePage() {
  usePageTitle("ZAFIRO OS — Inicio")
  const [session, setSession] = useState(getSession())
  const [greeting, setGreeting] = useState("Bienvenido")
  const [liveStats, setLiveStats] = useState({
    usuarios: 0, productos: 0, pedidos: 0, ledgerEntries: 0,
    libros: 0, devocionales: 0, bpaBalance: 0,
  })
  const [notifications, setNotifications] = useState<AppNotification[]>([])

  const refresh = useCallback(() => {
    const s = getSession()
    setSession(s)
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Buenos días")
    else if (hour < 18) setGreeting("Buenas tardes")
    else setGreeting("Buenas noches")

    const profiles = getProfiles()
    const products = getActiveProducts()
    const orders = getOrders()
    const entries = getLedgerEntries()
    const books = getBooks().filter(b => b.status === "PUBLICADO")
    const devs = getDevocionales()
    const nodeBal = getNodeBalance("GENERAL")
    setLiveStats({
      usuarios: profiles.length,
      productos: products.length,
      pedidos: orders.length,
      ledgerEntries: entries.length,
      libros: books.length,
      devocionales: devs.length,
      bpaBalance: typeof nodeBal.USD === "number" ? nodeBal.USD : 0,
    })
    setNotifications(getAllNotifications().slice(0, 5))
  }, [])

  useEffect(() => {
    refresh()
    try {
      const { onBroadcastMessage } = require("@/lib/broadcast")
      return onBroadcastMessage((msg: BroadcastMessage) => {
        if (msg.type === "data:changed") refresh()
      })
    } catch { return }
  }, [refresh])

  const pillars = [
    { name: "Marketplace", icon: ShoppingBag, href: "/marketplace", color: "from-amber-400 to-amber-600", stat: `${liveStats.productos} prod.`, bg: "bg-amber-500/5 border-amber-500/20" },
    { name: "Economía", icon: DollarSign, href: "/economia", color: "from-emerald-400 to-emerald-600", stat: `${liveStats.ledgerEntries} mov.`, bg: "bg-emerald-500/5 border-emerald-500/20" },
    { name: "Editorial", icon: BookOpen, href: "/editorial", color: "from-indigo-400 to-indigo-600", stat: `${liveStats.libros} libros`, bg: "bg-indigo-500/5 border-indigo-500/20" },
    { name: "Imperio", icon: Crown, href: "/imperio", color: "from-amber-400 to-amber-600", stat: "Centro de Mando", bg: "bg-amber-500/10 border-amber-500/30" },
  ]

  const apps = [
    { name: "Mi Perfil", icon: Gem, href: "/profile-page", color: "from-[#00D9FF] to-blue-600" },
    { name: "ELIANA", icon: MessageCircle, href: "/eliana", color: "from-violet-500 to-purple-600" },
    { name: "Marketplace", icon: ShoppingBag, href: "/marketplace", color: "from-emerald-500 to-teal-600" },
    { name: "Editorial", icon: BookOpen, href: "/editorial", color: "from-amber-500 to-orange-600" },
    { name: "Economía", icon: DollarSign, href: "/economia", color: "from-green-500 to-emerald-600" },
    { name: "Universo", icon: Globe, href: "/universo", color: "from-cyan-500 to-blue-600" },
    { name: "Familia", icon: Users, href: "/familia", color: "from-pink-500 to-rose-600" },
    { name: "Admin", icon: Crown, href: "/admin", color: "from-red-500 to-red-600" },
    { name: "Holo Cinema", icon: Film, href: "/holo-cinema", color: "from-purple-500 to-pink-600" },
    { name: "Config", icon: Settings, href: "/settings", color: "from-slate-500 to-slate-600" },
  ]

  return (
    <div className="min-h-full p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-black text-white">
            {greeting}, {session?.name || "Usuario"}
          </h1>
          <p className="text-sm text-slate-400">ZAFIRO OS — Imperio MSM conectado por <span className="text-[#00D9FF]">ELIANA</span></p>
        </motion.div>

        {/* Cross-pillar live stats */}
        <div className="mb-6">
          <CrossPillarStatsWidget />
        </div>

        {/* Pillar Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {pillars.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <Link href={p.href}
                  className={`flex items-center gap-3 p-3 rounded-xl ${p.bg} hover:opacity-90 transition-all`}>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{p.name}</p>
                    <p className="text-[8px] text-slate-500">{p.stat}</p>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Apps Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Command className="w-4 h-4 text-[#00D9FF]" /> Aplicaciones
          </h2>
          <div className="grid grid-cols-5 md:grid-cols-5 gap-3">
            {apps.map((app, i) => {
              const Icon = app.icon
              return (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * i }}>
                  <Link href={app.href}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 hover:border-[#00D9FF]/30 transition-all text-center group">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors">{app.name}</span>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Notifications Feed + Leaderboard + Activity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <NotificationsFeed max={5} />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <CrossPillarLeaderboard max={8} />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <ActivityTimeline max={8} />
            <div className="mt-2 text-center">
              <Link href="/actividad" className="text-[9px] text-slate-500 hover:text-[#00D9FF] transition-colors">
                📋 Ver toda la actividad
              </Link>
            </div>
          </motion.div>
        </div>
        <div className="mt-4 text-center">
          <Link href="/imperio" className="text-[9px] text-amber-400 hover:underline">
            👑 Centro de Mando del Imperio MSM
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import Link from "next/link"
import { Diamond, MessageCircle, ShoppingBag, BookOpen, DollarSign, Globe, Users, FolderOpen, Film, Settings, Bell, Search, Command } from "lucide-react"

interface QuickWidget {
  title: string
  value: string
  icon: typeof Diamond
  color: string
}

export default function OsHomePage() {
  usePageTitle("ZAFIRO OS — Inicio")
  const [session, setSession] = useState(getSession())
  const [greeting, setGreeting] = useState("Bienvenido")

  useEffect(() => {
    const s = getSession()
    setSession(s)
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Buenos días")
    else if (hour < 18) setGreeting("Buenas tardes")
    else setGreeting("Buenas noches")
  }, [])

  const widgets: QuickWidget[] = [
    { title: "Membresía", value: "LIFETIME", icon: Diamond, color: "text-[#00D9FF]" },
    { title: "Mensajes", value: "3", icon: MessageCircle, color: "text-emerald-400" },
    { title: "Notificaciones", value: "5", icon: Bell, color: "text-amber-400" },
    { title: "Pedidos", value: "0", icon: ShoppingBag, color: "text-violet-400" },
  ]

  const apps = [
    { name: "Mi Perfil", icon: Diamond, href: "/zafiro/perfil", color: "from-[#00D9FF] to-blue-600" },
    { name: "ELIANA", icon: MessageCircle, href: "/eliana", color: "from-violet-500 to-purple-600" },
    { name: "Marketplace", icon: ShoppingBag, href: "https://msmmystore.com", color: "from-emerald-500 to-teal-600", external: true },
    { name: "Editorial", icon: BookOpen, href: "/ecosystem", color: "from-amber-500 to-orange-600" },
    { name: "Economía", icon: DollarSign, href: "/economia", color: "from-green-500 to-emerald-600" },
    { name: "Universo", icon: Globe, href: "/universo", color: "from-cyan-500 to-blue-600" },
    { name: "Familia", icon: Users, href: "/familia", color: "from-pink-500 to-rose-600" },
    { name: "Archivos", icon: FolderOpen, href: "/dashboard", color: "from-indigo-500 to-violet-600" },
    { name: "Holo Cinema", icon: Film, href: "/holo-cinema", color: "from-purple-500 to-pink-600" },
    { name: "Configuración", icon: Settings, href: "/settings", color: "from-slate-500 to-slate-600" },
  ]

  return (
    <div className="min-h-full p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-black text-white">
            {greeting}, {session?.name || "Usuario"}
          </h1>
          <p className="text-sm text-slate-400">ZAFIRO OS — Tu universo digital</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {widgets.map((w, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="p-4 rounded-2xl glass text-center">
              <w.icon className={`w-5 h-5 ${w.color} mx-auto mb-1.5`} />
              <p className="text-lg font-black text-white">{w.value}</p>
              <p className="text-[10px] text-slate-400">{w.title}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Command className="w-4 h-4 text-[#00D9FF]" /> Aplicaciones
          </h2>
          <div className="grid grid-cols-5 md:grid-cols-5 gap-3">
            {apps.map((app, i) => {
              const Icon = app.icon
              const Tag = app.external ? 'a' : Link
              const props = app.external ? { href: app.href, target: "_blank", rel: "noopener noreferrer" } : { href: app.href }
              return (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * i }}>
                  <Tag {...props}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl glass glass-hover text-center group">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] text-slate-400 group-hover:text-white transition-colors">{app.name}</span>
                  </Tag>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8">
          <div className="p-5 rounded-2xl glass border border-slate-800/60">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-[#00D9FF]" />
              <h2 className="text-sm font-bold text-white">Búsqueda Rápida</h2>
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Buscar en ZAFIRO..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#00D9FF]/50" />
              <button className="px-4 py-2.5 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] hover:bg-[#00D9FF]/20 text-sm font-medium transition-all">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo } from "react"
import Link from "next/link"
import { usePageTitle } from "@/lib/usePageTitle"
import { getProfiles } from "@/lib/identity"
import { getLedgerEntries, getNodeBalance, getDailyCloses } from "@/lib/ledger"
import { getProducts, getOrders } from "@/lib/marketplace"
import { getBalance } from "@/lib/bpa-mirror"
import { getConfig, getHistorialOperaciones } from "@/lib/trading-strategy"
import { getRates } from "@/lib/tasas"
import { getEditorialStats } from "@/lib/editorial"
import {
  Crown, ShoppingCart, BookOpen, DollarSign, TrendingUp,
  Users, Package, Landmark, Globe, BarChart3, ArrowUpRight,
  ExternalLink, Gem, Shield, Zap, Cpu, Activity, Sparkles, Bell,
} from "lucide-react"
import { NotificationsFeed } from "@/components/NotificationsFeed"
import { CrossPillarLeaderboard } from "@/components/CrossPillarLeaderboard"
import { ActivityTimeline } from "@/components/ActivityTimeline"

const PILLARS = [
  {
    id: "identidad", title: "ZAFIRO Identity", desc: "Perfiles, VIP, KYC — La identidad del Imperio",
    icon: Gem, href: "/profile-page", color: "from-[#00D9FF] to-blue-600", links: [
      { label: "Mi Perfil", href: "/profile-page" }, { label: "VIP", href: "/vip" },
      { label: "KYC", href: "/kyc/inicio" }, { label: "Usuarios", href: "/admin/usuarios" },
    ]
  },
  {
    id: "marketplace", title: "MSM Marketplace", desc: "Catálogo, pedidos, inventario — El comercio del Imperio",
    icon: ShoppingCart, href: "/marketplace", color: "from-amber-400 to-amber-600", links: [
      { label: "Catálogo", href: "/marketplace" }, { label: "Mis Pedidos", href: "/marketplace/orders" },
      { label: "Admin", href: "/admin/marketplace" }, { label: "Pagar", href: "/pagar" },
    ]
  },
  {
    id: "economia", title: "MSM Economía", desc: "Ledger, BPA, Tasas — La contabilidad del Imperio",
    icon: DollarSign, href: "/economia", color: "from-emerald-400 to-emerald-600", links: [
      { label: "Dashboard", href: "/economia" }, { label: "Ledger", href: "/admin/ledger" },
      { label: "BPA Mirror", href: "/admin/bpa" }, { label: "Tasas Cuba", href: "/admin/tasas" },
    ]
  },
  {
    id: "trading", title: "MSM Trading", desc: "Estrategia 1%, señales, operaciones — El crecimiento del Imperio",
    icon: TrendingUp, href: "/trading", color: "from-purple-400 to-purple-600", links: [
      { label: "Trading", href: "/trading" }, { label: "Financiamiento", href: "/admin/financiamiento" },
    ]
  },
  {
    id: "editorial", title: "MSM Editorial", desc: "Biblioteca, libros, devocionales — La sabiduría del Imperio",
    icon: BookOpen, href: "/editorial", color: "from-indigo-400 to-indigo-600", links: [
      { label: "Portal Editorial", href: "/editorial" }, { label: "Devocionales", href: "/editorial/devocionales" },
      { label: "Biblioteca", href: "/zafiro/biblioteca" }, { label: "Admin", href: "/admin/editorial" },
    ]
  },
]

export default function ImperioPage() {
  usePageTitle("Imperio MSM — ZAFIRO")
  const [profiles] = useState(getProfiles())
  const [entries] = useState(getLedgerEntries())
  const [products] = useState(getProducts())
  const [orders] = useState(getOrders())
  const [bpa] = useState(getBalance())
  const [tradingCfg] = useState(getConfig())
  const [tradingOps] = useState(getHistorialOperaciones())
  const [rates] = useState(getRates())
  const [balanceByNode] = useState(() => {
    const b: Record<string, any> = {}
    ;["CAJA_ROCIO", "LIQUIDACION_VIP", "FONDO_MSM", "GENERAL"].forEach(n => { b[n] = getNodeBalance(n as any) })
    return b
  })
  const [closes] = useState(getDailyCloses())
  const [editorialStats] = useState(getEditorialStats())

  const stats = useMemo(() => ({
    usuarios: profiles.length,
    productos: products.filter(p => p.status === "active").length,
    pedidos: orders.length,
    ledgerEntries: entries.length,
    ledgerPending: entries.filter(e => e.status === "PENDIENTE").length,
    bpaCup: bpa.cup,
    bpaMlc: bpa.mlc,
    tradingCapital: tradingCfg.capitalTotalUSD,
    tradingOps: tradingOps.length,
    tradingWinRate: tradingOps.length > 0 ? Math.round((tradingOps.filter(o => o.resultadoUSD && o.resultadoUSD > 0).length / tradingOps.length) * 100) : 0,
    closesCount: closes.length,
    totalSales: orders.reduce((s, o) => s + o.total, 0),
    usdRate: rates.find(r => r.source === "elTOQUE" && r.rateType === "REFERENCE" && r.baseCurrency === "USD" && r.status === "APPROVED")?.rate || 660,
    libros: editorialStats.totalBooks,
    devocionales: editorialStats.totalDevocionales,
    escritores: editorialStats.totalWriters,
  }), [profiles, products, orders, entries, bpa, tradingCfg, tradingOps, closes, rates, editorialStats])

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto px-4 py-12 relative">
          <div className="flex items-center gap-4 mb-2">
            <Crown className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-3xl font-black">Imperio MSM</h1>
              <p className="text-xs text-slate-400">Conectado por <span className="text-[#00D9FF]">ELIANA</span> &middot; zafiro.msmmystore.com</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-3 max-w-2xl">
            Centro de comando del Imperio MSM &mdash; 5 pilares, datos en vivo, visi&oacute;n unificada.
            Cada m&oacute;dulo reporta en tiempo real al Ledger Maestro.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {[
            { label: "Usuarios", value: stats.usuarios, icon: Users, color: "text-[#00D9FF]" },
            { label: "Productos", value: stats.productos, icon: Package, color: "text-amber-400" },
            { label: "Pedidos", value: stats.pedidos, icon: ShoppingCart, color: "text-emerald-400" },
            { label: "Ledger", value: stats.ledgerEntries, icon: BarChart3, color: "text-cyan-400" },
            { label: "Trading", value: `$${stats.tradingCapital.toLocaleString()}`, icon: TrendingUp, color: "text-purple-400" },
            { label: "Win Rate", value: `${stats.tradingWinRate}%`, icon: Activity, color: stats.tradingWinRate >= 50 ? "text-emerald-400" : "text-red-400" },
            { label: "Ventas", value: `$${stats.totalSales.toFixed(0)}`, icon: DollarSign, color: "text-emerald-400" },
            { label: "BPA", value: `$${stats.bpaCup.toLocaleString()}`, icon: Landmark, color: "text-blue-400" },
            { label: "Libros", value: stats.libros, icon: BookOpen, color: "text-indigo-400" },
            { label: "Devocionales", value: stats.devocionales, icon: Sparkles, color: "text-amber-400" },
            { label: "Escritores", value: stats.escritores, icon: Users, color: "text-purple-400" },
          ].map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="p-2 rounded-xl bg-slate-900/50 border border-slate-800/60 text-center">
                <Icon className={`w-3 h-3 ${s.color} mx-auto mb-1`} />
                <p className="text-sm font-black">{s.value}</p>
                <p className="text-[7px] text-slate-500">{s.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* 5 Pillars */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="grid md:grid-cols-5 gap-3">
          {PILLARS.map(p => {
            const Icon = p.icon
            return (
              <div key={p.id} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 hover:border-amber-500/20 transition-all group">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{p.title}</h3>
                <p className="text-[8px] text-slate-500 mt-1 mb-3">{p.desc}</p>
                <div className="space-y-1">
                  {p.links.map(l => (
                    <Link key={l.href} href={l.href}
                      className="flex items-center gap-1.5 text-[9px] text-slate-400 hover:text-white transition-colors group/link">
                      <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Node balances + Quick actions + Notifications + Leaderboard */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Node balances */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <h3 className="text-[10px] font-bold text-cyan-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <Cpu className="w-3 h-3" /> Nodos del Ledger
            </h3>
            {["CAJA_ROCIO", "LIQUIDACION_VIP", "FONDO_MSM", "GENERAL"].map(n => {
              const bal = balanceByNode[n] || {}
              const hasBalance = Object.keys(bal).length > 0
              return (
                <div key={n} className="flex justify-between items-center py-1.5 border-b border-slate-800/30 last:border-0 text-[9px]">
                  <span className="text-slate-400">{n.replace(/_/g, " ")}</span>
                  <span className="font-mono text-white">
                    {hasBalance ? Object.entries(bal).map(([c, v]) => `${c}: $${(v as number).toFixed(0)}`).join(" | ") : "—"}
                  </span>
                </div>
              )
            })}
            <Link href="/economia" className="mt-3 block text-[8px] text-[#00D9FF] hover:underline text-center">
              Ver dashboard completo →
            </Link>
          </div>

          {/* Quick actions */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <h3 className="text-[10px] font-bold text-amber-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
              <Zap className="w-3 h-3" /> Acciones Rápidas
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Ir al Catálogo", icon: ShoppingCart, href: "/marketplace", color: "text-amber-400" },
                { label: "Ledger Maestro", icon: DollarSign, href: "/admin/ledger", color: "text-emerald-400" },
                { label: "Economía", icon: BarChart3, href: "/economia", color: "text-cyan-400" },
                { label: "Trading", icon: TrendingUp, href: "/trading", color: "text-purple-400" },
                { label: "Editorial", icon: BookOpen, href: "/editorial", color: "text-indigo-400" },
                { label: "Mi Perfil", icon: Users, href: "/profile-page", color: "text-[#00D9FF]" },
                { label: "Admin", icon: Shield, href: "/admin", color: "text-red-400" },
                { label: "Notificaciones", icon: Bell, href: "/os/notifications", color: "text-amber-400" },
              ].map(a => {
                const Icon = a.icon
                return (
                  <Link key={a.href} href={a.href}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-all group">
                    <Icon className={`w-3.5 h-3.5 ${a.color}`} />
                    <span className="text-[9px] text-slate-400 group-hover:text-white transition-colors">{a.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <NotificationsFeed max={5} />

          {/* Activity Timeline */}
          <ActivityTimeline max={12} />
          <Link href="/actividad" className="mt-2 flex items-center justify-center gap-1 text-[9px] text-slate-500 hover:text-[#00D9FF] transition-colors">
            <ExternalLink className="w-3 h-3" /> Ver toda la actividad
          </Link>
        </div>
      </div>

      {/* Ecosystem integration */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/5 via-slate-900/50 to-transparent border border-amber-500/10">
          <div className="flex items-start gap-4">
            <Globe className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-bold text-amber-300 mb-2">Ecosistema MSM — Integración Total</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
                <Link href="/ecosystem" className="text-slate-400 hover:text-white transition-colors">🌐 Ecosistema completo</Link>
                <Link href="/universo" className="text-slate-400 hover:text-white transition-colors">🌌 Universo Digital</Link>
                <Link href="/familia" className="text-slate-400 hover:text-white transition-colors">👨‍👩‍👧‍👦 Nube Familiar</Link>
                <a href="https://msmmystore.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">🏪 msmmystore.com</a>
                <Link href="/villa-esperanza" className="text-slate-400 hover:text-white transition-colors">🏘️ Villa Esperanza</Link>
                <Link href="/admin/logistica" className="text-slate-400 hover:text-white transition-colors">📦 Logística Contenedores</Link>
                <Link href="/campanas/zafiro-369-777" className="text-slate-400 hover:text-white transition-colors">📢 Campaña 369-777</Link>
                <Link href="/holo-cinema" className="text-slate-400 hover:text-white transition-colors">🎬 Holo Cinema</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manifiesto link */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <Link href="/" className="block p-4 rounded-2xl bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/10 text-center group hover:from-amber-500/10 transition-all">
          <p className="text-[9px] text-amber-400/60 uppercase tracking-widest">El Fundador</p>
          <p className="text-sm font-bold text-amber-300 mt-1 group-hover:text-amber-200 transition-colors">
            &ldquo;50 generaciones. Un imperio de luz. Matem&aacute;ticas de Dios.&rdquo;
          </p>
          <p className="text-[8px] text-slate-600 mt-1">— Don Miguel Soria Mart&iacute;nez</p>
        </Link>
      </div>
    </div>
  )
}

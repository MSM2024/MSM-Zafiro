'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getProfiles, getIdentityStats } from '@/lib/identity'
import { getActiveProducts, getOrders, getProductsByCategory } from '@/lib/marketplace'
import { getLedgerEntries, getNodeBalance, getDailyCloses } from '@/lib/ledger'
import { getDevocionales, getWriters, getEditorialStats } from '@/lib/editorial'
import { getBooks } from '@/lib/biblioteca/storage'
import { getBalance } from '@/lib/bpa-mirror'
import { getPublishedSeals } from '@/lib/seals-data'
import {
  Globe, Shield, Users, AlertTriangle, CheckCircle, XCircle,
  ShoppingCart, BookOpen, DollarSign, Crown, BarChart3, Gem,
  TrendingUp, Sparkles, Package, Wallet, Activity, ArrowUpRight, Bell, ExternalLink,
  Stamp, Download, HeartHandshake, BarChartHorizontal,
} from 'lucide-react'
import { getAllNotifications, PILLAR_LABELS, getPillarColor } from '@/lib/notifications'
import type { AppNotification } from '@/lib/notifications'
import { ActivityTimeline } from '@/components/ActivityTimeline'

const PILLARS = [
  { key: "zafiro", label: "ZAFIRO Identity", icon: Gem, href: "/admin", color: "from-[#00D9FF] to-blue-600" },
  { key: "marketplace", label: "Marketplace", icon: ShoppingCart, href: "/admin/marketplace", color: "from-amber-400 to-amber-600" },
  { key: "editorial", label: "Editorial", icon: BookOpen, href: "/admin/editorial", color: "from-indigo-400 to-indigo-600" },
  { key: "economy", label: "Economía", icon: DollarSign, href: "/admin/ledger", color: "from-emerald-400 to-emerald-600" },
  { key: "sellos", label: "Sellos 369", icon: Stamp, href: "/admin/sellos", color: "from-purple-400 to-purple-600" },
]

const HEALTH_KEY = "zafiro_health_snapshot"

function getHealthChecks(stats: ReturnType<typeof computeStats>) {
  return [
    { label: "Identidad", ok: stats.usuarios > 0, detail: `${stats.usuarios} usuarios` },
    { label: "Marketplace", ok: stats.productos > 0, detail: `${stats.productos} productos` },
    { label: "Editorial", ok: stats.libros > 0, detail: `${stats.libros} libros` },
    { label: "Economía", ok: stats.ledgerEntries > 0, detail: `${stats.ledgerEntries} movimientos` },
    { label: "Sellos", ok: stats.sellos > 0, detail: `${stats.sellos} sellos` },
    { label: "KYC", ok: stats.kycAprobados > 0, detail: `${stats.kycAprobados} aprobados` },
    { label: "Ventas", ok: stats.ventas > 0, detail: `$${stats.ventas.toFixed(0)}` },
    { label: "Ledger", ok: stats.ledgerPending === 0, detail: `${stats.ledgerPending} pendientes` },
  ]
}

function computeStats(): {
  usuarios: number; vip: number; kycAprobados: number; productos: number;
  pedidos: number; ventas: number; ledgerEntries: number; ledgerPending: number;
  bpaCup: number; libros: number; devocionales: number; escritores: number;
  sellos: number; orderStatusCounts: Record<string, number>;
  productCategoryCounts: Record<string, number>;
  revenueByDay: { date: string; total: number }[];
  entryTypes: Record<string, number>;
} {
  const idStats = getIdentityStats()
  const profiles = getProfiles()
  const products = getActiveProducts()
  const orders = getOrders()
  const entries = getLedgerEntries()
  const bpa = getBalance()
  const books = getBooks().filter(b => b.status === "PUBLICADO")
  const devs = getDevocionales()
  const writers = getWriters()
  const seals = getPublishedSeals()
  const sales = orders.reduce((s, o) => s + o.total, 0)
  const orderStatusCounts: Record<string, number> = {}
  orders.forEach(o => { orderStatusCounts[o.status] = (orderStatusCounts[o.status] || 0) + 1 })
  const productCategoryCounts: Record<string, number> = {}
  products.forEach(p => { productCategoryCounts[p.category] = (productCategoryCounts[p.category] || 0) + 1 })
  const revenueByDay: { date: string; total: number }[] = []
  const dayMap: Record<string, number> = {}
  orders.filter(o => o.status === 'delivered' || o.status === 'confirmed').forEach(o => {
    const day = o.createdAt?.slice(0, 10) || 'unknown'
    dayMap[day] = (dayMap[day] || 0) + o.total
  })
  Object.entries(dayMap).sort().slice(-7).forEach(([date, total]) => revenueByDay.push({ date, total }))
  const entryTypes = entries.reduce((acc, e) => {
    const t = (e as any).type || e.direction || 'other'
    acc[t] = (acc[t] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  return {
    usuarios: profiles.length,
    vip: idStats?.vip || 0,
    kycAprobados: idStats?.kycApproved || 0,
    productos: products.length,
    pedidos: orders.length,
    ventas: sales,
    ledgerEntries: entries.length,
    ledgerPending: entries.filter(e => e.status === "PENDIENTE").length,
    bpaCup: bpa.cup,
    libros: books.length,
    devocionales: devs.length,
    escritores: writers.length,
    sellos: seals.length,
    orderStatusCounts,
    productCategoryCounts,
    revenueByDay,
    entryTypes,
  }
}

function diffTrend(current: number, prev: number): { icon: string; color: string; text: string } {
  if (prev === 0) return { icon: "—", color: "text-slate-500", text: "nuevo" }
  const pct = ((current - prev) / prev * 100).toFixed(1)
  if (current > prev) return { icon: "▲", color: "text-emerald-400", text: `+${pct}%` }
  if (current < prev) return { icon: "▼", color: "text-red-400", text: `${pct}%` }
  return { icon: "—", color: "text-slate-500", text: "0%" }
}

export default function Dashboard360Page() {
  usePageTitle('Dashboard 360 — ZAFIRO')

  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [stats, setStats] = useState(computeStats())
  const [prevStats, setPrevStats] = useState<Record<string, number> | null>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HEALTH_KEY)
      if (raw) setPrevStats(JSON.parse(raw))
    } catch { /* */ }
    const snap: Record<string, number> = {}
    const s = computeStats()
    for (const [k, v] of Object.entries(s)) {
      if (typeof v === 'number') snap[k] = v
    }
    localStorage.setItem(HEALTH_KEY, JSON.stringify(snap))
    setStats(s)
    setNotifications(getAllNotifications().slice(0, 6))
  }, [])

  const health = getHealthChecks(stats)
  const healthyCount = health.filter(h => h.ok).length
  const trend = (key: string) => {
    const current = (stats as any)[key]
    if (typeof current !== 'number') return null
    return prevStats ? diffTrend(current, prevStats[key] ?? 0) : null
  }

  const handleExport = () => {
    setExporting(true)
    const rows = [
      ["Metric", "Value", "Health"],
      ...health.map(h => [h.label, h.detail, h.ok ? "OK" : "ALERT"]),
    ]
    const csv = rows.map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = `dashboard-360-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
    URL.revokeObjectURL(url)
    setTimeout(() => setExporting(false), 1000)
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00D9FF] to-purple-400 bg-clip-text text-transparent">
              Dashboard 360
            </h1>
            <p className="text-sm text-slate-400 mt-1">Imperio MSM — Los 5 Pilares en Tiempo Real</p>
          </div>
          <button onClick={handleExport} disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] bg-slate-800/50 border border-slate-700/50 hover:border-[#00D9FF]/30 text-slate-400 hover:text-white transition-all cursor-pointer">
            <Download className="w-3 h-3" /> {exporting ? "Exportando..." : "Exportar CSV"}
          </button>
        </div>

        {/* 5 Pillar Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {PILLARS.map(p => {
            const Icon = p.icon
            const vals: Record<string, { v: string; sub: string }> = {
              zafiro: { v: String(stats.usuarios), sub: `${stats.vip} VIP · ${stats.kycAprobados} KYC` },
              marketplace: { v: String(stats.productos), sub: `${stats.pedidos} pedidos · $${stats.ventas.toFixed(0)}` },
              editorial: { v: String(stats.libros), sub: `${stats.devocionales} devs · ${stats.escritores} escritores` },
              economy: { v: String(stats.ledgerEntries), sub: `${stats.ledgerPending} pend. · BPA $${stats.bpaCup.toLocaleString()}` },
              sellos: { v: String(stats.sellos), sub: "sellos publicados" },
            }
            const v = vals[p.key]
            return (
              <Link key={p.key} href={p.href}
                className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-amber-500/20 transition-all group">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">{p.label}</span>
                </div>
                <p className="text-xl font-black text-white">{v.v}</p>
                <p className="text-[9px] text-slate-500">{v.sub}</p>
              </Link>
            )
          })}
        </div>

        {/* Health Monitor */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Health Monitor</h2>
            </div>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
              healthyCount === health.length ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
            }`}>
              {healthyCount}/{health.length} saludables
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {health.map(h => (
              <div key={h.label} className={`p-2 rounded-lg text-center border ${
                h.ok ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"
              }`}>
                {h.ok
                  ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-0.5" />
                  : <XCircle className="w-3.5 h-3.5 text-red-400 mx-auto mb-0.5" />
                }
                <p className="text-[9px] font-medium text-white">{h.label}</p>
                <p className="text-[7px] text-slate-500 truncate">{h.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-pillar metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Usuarios", key: "usuarios" as const, icon: Users, color: "text-[#00D9FF]" },
            { label: "Pedidos", key: "pedidos" as const, icon: Package, color: "text-amber-400" },
            { label: "Ledger", key: "ledgerEntries" as const, icon: BarChart3, color: "text-emerald-400" },
            { label: "Sellos", key: "sellos" as const, icon: Stamp, color: "text-purple-400" },
            { label: "Ventas", key: "ventas" as const, icon: Wallet, color: "text-emerald-400" },
            { label: "BPA CUP", key: "bpaCup" as const, icon: DollarSign, color: "text-blue-400" },
            { label: "Devocionales", key: "devocionales" as const, icon: Sparkles, color: "text-amber-400" },
            { label: "Escritores", key: "escritores" as const, icon: Users, color: "text-purple-400" },
          ].map((s, i) => {
            const Icon = s.icon
            const t = trend(s.key)
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 text-center relative">
                <Icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                <p className="text-base font-black text-white">{stats[s.key]?.toLocaleString?.() ?? stats[s.key]}</p>
                <p className="text-[8px] text-slate-500">{s.label}</p>
                {t && <span className={`absolute top-1 right-1.5 text-[7px] font-mono ${t.color}`}>{t.icon}{t.text}</span>}
              </motion.div>
            )
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              <h2 className="text-xs font-bold text-white">Pedidos por Estado</h2>
            </div>
            <div className="space-y-1.5">
              {Object.entries(stats.orderStatusCounts).length === 0 ? (
                <p className="text-[10px] text-slate-500 text-center py-4">Sin datos</p>
              ) : (
                Object.entries(stats.orderStatusCounts)
                  .sort((a, b) => b[1] - a[1]).map(([status, count]) => {
                    const maxCount = Math.max(...Object.values(stats.orderStatusCounts))
                    const pct = maxCount > 0 ? (count / maxCount) * 100 : 0
                    const barColor: Record<string, string> = {
                      pending: 'bg-amber-500/60', confirmed: 'bg-blue-500/60',
                      processing: 'bg-purple-500/60', shipped: 'bg-cyan-500/60',
                      delivered: 'bg-emerald-500/60', cancelled: 'bg-red-500/60',
                      refunded: 'bg-orange-500/60',
                    }
                    return (
                      <div key={status} className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-400 w-16 truncate capitalize">{status}</span>
                        <div className="flex-1 h-3 rounded-full bg-slate-800 overflow-hidden">
                          <div className={`h-full rounded-full ${barColor[status] || 'bg-slate-600'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[9px] text-slate-300 w-5 text-right">{count}</span>
                      </div>
                    )
                  })
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
            className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-3.5 h-3.5 text-[#00D9FF]" />
              <h2 className="text-xs font-bold text-white">Productos por Categoría</h2>
            </div>
            <div className="space-y-1.5">
              {Object.entries(stats.productCategoryCounts).length === 0 ? (
                <p className="text-[10px] text-slate-500 text-center py-4">Sin datos</p>
              ) : (
                Object.entries(stats.productCategoryCounts)
                  .sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                    const total = Object.values(stats.productCategoryCounts).reduce((s, v) => s + v, 0)
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0
                    const colors: Record<string, string> = {
                      digital: 'bg-blue-500/60', physical: 'bg-emerald-500/60',
                      service: 'bg-purple-500/60', membership: 'bg-amber-500/60',
                      merchandise: 'bg-cyan-500/60',
                    }
                    return (
                      <div key={cat} className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-400 w-14 truncate capitalize">{cat}</span>
                        <div className="flex-1 h-3 rounded-full bg-slate-800 overflow-hidden">
                          <div className={`h-full rounded-full ${colors[cat] || 'bg-slate-600'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[9px] text-slate-300 w-8 text-right">{pct}%</span>
                      </div>
                    )
                  })
              )}
            </div>
          </motion.div>

          {stats.revenueByDay.length > 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <h2 className="text-xs font-bold text-white">Ingresos (últimos {stats.revenueByDay.length} días)</h2>
              </div>
              <div className="flex items-end gap-1 h-24 px-1">
                {(() => {
                  const maxRev = Math.max(...stats.revenueByDay.map(d => d.total))
                  return stats.revenueByDay.map((d, i) => {
                    const h = maxRev > 0 ? (d.total / maxRev) * 100 : 0
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                        <span className="text-[7px] text-slate-500">${d.total.toFixed(0)}</span>
                        <div className="w-full rounded-sm bg-emerald-500/40 hover:bg-emerald-500/60 transition-all"
                          style={{ height: `${Math.max(h, 2)}%` }} />
                        <span className="text-[6px] text-slate-600">{d.date.slice(5)}</span>
                      </div>
                    )
                  })
                })()}
              </div>
            </motion.div>
          )}
        </div>

        {/* Notifications + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#00D9FF]" /> Notificaciones del Imperio
              </h2>
              <Link href="/os/notifications" className="text-[9px] text-[#00D9FF] hover:underline">Ver todas</Link>
            </div>
            {notifications.length === 0 ? (
              <div className="space-y-2 text-[10px] text-slate-500">
                <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{stats.pedidos} pedidos creados en el Marketplace</p>
                <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />{stats.ledgerEntries} movimientos en el Ledger Maestro</p>
                <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />{stats.usuarios} perfiles registrados en ZAFIRO</p>
                <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-400" />{stats.libros} libros publicados en MSM Editorial</p>
                <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />{stats.devocionales} devocionales escritos</p>
                <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />{stats.escritores} escritores en el Imperio</p>
                <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-pink-400" />{stats.sellos} sellos publicados</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map(n => {
                  const colorClass = getPillarColor(n.pillar)
                  return (
                    <Link key={n.id} href={n.actionUrl || "#"}
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
                      <ExternalLink className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-all" />
                    </Link>
                  )
                })}
              </div>
            )}
            <Link href="/imperio" className="mt-4 flex items-center gap-1.5 text-[10px] text-amber-400 hover:underline">
              <ArrowUpRight className="w-3 h-3" /> Centro de Mando Completo
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ActivityTimeline max={10} />
            <Link href="/actividad" className="mt-2 flex items-center justify-center gap-1 text-[9px] text-slate-500 hover:text-[#00D9FF] transition-colors">
              <ExternalLink className="w-3 h-3" /> Ver toda la actividad
            </Link>
          </motion.div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Ir al Marketplace", href: "/marketplace", icon: ShoppingCart, color: "from-amber-400 to-amber-600" },
            { label: "Panel Económico", href: "/economia", icon: DollarSign, color: "from-emerald-400 to-emerald-600" },
            { label: "Portal Editorial", href: "/editorial", icon: BookOpen, color: "from-indigo-400 to-indigo-600" },
            { label: "Sellos 369", href: "/sellos", icon: Stamp, color: "from-purple-400 to-purple-600" },
            { label: "Centro de Mando", href: "/imperio", icon: Crown, color: "from-amber-400 to-amber-600" },
          ].map((q, i) => {
            const Icon = q.icon
            return (
              <Link key={i} href={q.href}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-amber-500/20 transition-all group">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${q.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-bold text-white group-hover:text-amber-400 transition-colors">{q.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

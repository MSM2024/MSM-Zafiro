'use client'

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import {
  DollarSign, TrendingUp, ShoppingCart, X, Check, AlertCircle,
  Landmark, Banknote, BarChart3, Wallet, ArrowUpRight, ArrowDownRight,
  Plus, FileCheck, Fingerprint, RefreshCw, FileText, Building2, Globe,
  Sigma, Coins, Send, History, Zap, Shield,
} from "lucide-react"
import {
  getLedgerEntries, addLedgerEntry, validateEntry, syncEntry,
  distributeEntry, executeDailyClose, getNodeBalance, getDailyCloses,
  type LedgerEntry, type LedgerNode, type Currency, type PaymentMethod,
} from "@/lib/ledger"
import {
  getBalance as getBPABalance, getTransfers, addTransfer,
  getDailyUsage, getMonthlyUsage, BPA_LIMITS,
} from "@/lib/bpa-mirror"
import { getRates, calculateMSM } from "@/lib/tasas"
import { getConfig, getHistorialOperaciones, getResumenTrading } from "@/lib/trading-strategy"
import { sign369, getFirmas, type Firma369 } from "@/lib/firma-369"
import { getSession } from "@/lib/auth"

const MONEDA_OPTS: Currency[] = ["USD", "EUR", "CUP", "MLC", "USDT"]
const METODO_OPTS: PaymentMethod[] = ["ZELLE", "IBAN", "CASH", "USDT", "VENMO", "OTRO"]
const NODO_OPTS: LedgerNode[] = ["CAJA_ROCIO", "LIQUIDACION_VIP", "FONDO_MSM", "GENERAL"]

const NODO_LABELS: Record<string, string> = {
  CAJA_ROCIO: "Caja Rocío",
  LIQUIDACION_VIP: "Liquidación VIP",
  FONDO_MSM: "Fondo MSM",
  GENERAL: "General",
}

const STATUS_COLORS: Record<string, string> = {
  PENDIENTE: "text-yellow-400 border-yellow-500/20 bg-yellow-500/10",
  VALIDADO: "text-blue-400 border-blue-500/20 bg-blue-500/10",
  SINCRONIZADO: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
  DISTRIBUIDO: "text-purple-400 border-purple-500/20 bg-purple-500/10",
  CERRADO: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  RECHAZADO: "text-red-400 border-red-500/20 bg-red-500/10",
}

export default function EconomiaPanel() {
  const [tab, setTab] = useState("dashboard")
  const [entries, setEntries] = useState<LedgerEntry[]>([])
  const [balances, setBalances] = useState<Record<string, Record<string, number>>>({})
  const [closes, setCloses] = useState(getDailyCloses())
  const [bpaBal, setBpaBal] = useState(getBPABalance())
  const [bpaTransfers, setBpaTransfers] = useState(getTransfers())
  const [rates, setRates] = useState(getRates())
  const [tradingOps] = useState(getHistorialOperaciones())
  const [tradingCfg] = useState(getConfig())
  const [firmas, setFirmas] = useState<Firma369[]>([])
  const [session, setSession] = useState(() => getSession())

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<Currency>("USD")
  const [method, setMethod] = useState<PaymentMethod>("CASH")
  const [concept, setConcept] = useState("")
  const [direction, setDirection] = useState<"ENTRADA" | "SALIDA">("ENTRADA")
  const [node, setNode] = useState<LedgerNode>("GENERAL")
  const [sender, setSender] = useState("")

  const [msg, setMsg] = useState("")
  const [msgType, setMsgType] = useState<"ok" | "error">("ok")
  const [closing, setClosing] = useState(false)

  const refresh = () => {
    setEntries(getLedgerEntries())
    const b: Record<string, Record<string, number>> = {}
    NODO_OPTS.forEach(n => { b[n] = getNodeBalance(n) })
    setBalances(b)
    setCloses(getDailyCloses())
    setBpaBal(getBPABalance())
    setBpaTransfers(getTransfers())
    setRates(getRates())
    setFirmas(getFirmas())
  }

  useEffect(() => { refresh(); setSession(getSession()) }, [])

  const totalBalance = useMemo(() => {
    const acc: Record<string, number> = {}
    Object.values(balances).forEach(nodeBal => {
      Object.entries(nodeBal).forEach(([cur, val]) => {
        acc[cur] = (acc[cur] || 0) + val
      })
    })
    return acc
  }, [balances])

  const pendingEntries = entries.filter(e => e.status === "PENDIENTE")
  const usdRate = rates.find(r => r.source === "elTOQUE" && r.rateType === "REFERENCE" && r.baseCurrency === "USD" && r.status === "APPROVED")

  const createEntry = () => {
    const amt = parseFloat(amount)
    if (!amt || !concept) return
    const entry = addLedgerEntry({
      amount: amt,
      currency,
      method,
      senderName: sender || undefined,
      concept,
      direction,
      node,
    })
    setMsg(`Entrada creada: ${entry.id} — $${amt} ${currency}`)
    setMsgType("ok")
    setAmount(""); setConcept(""); setSender(""); setShowForm(false)
    refresh()
    setTimeout(() => setMsg(""), 3000)
  }

  const handleValidate = (id: string) => {
    const entry = validateEntry(id, session?.id || "owner", `voucher-${Date.now()}`)
    if (entry) { setMsg("Validado + Seal 369"); setMsgType("ok"); refresh(); setTimeout(() => setMsg(""), 2000) }
  }

  const handleSync = (id: string) => {
    const entry = syncEntry(id)
    if (entry) { setMsg("Sincronizado al Ledger Maestro"); setMsgType("ok"); refresh(); setTimeout(() => setMsg(""), 2000) }
  }

  const handleDistribute = (id: string, n: LedgerNode) => {
    const entry = distributeEntry(id, n)
    if (entry) { setMsg(`Distribuido a ${NODO_LABELS[n]}`); setMsgType("ok"); refresh(); setTimeout(() => setMsg(""), 2000) }
  }

  const handleDailyClose = async () => {
    setClosing(true)
    const close = executeDailyClose(session?.id || "owner")
    const content = `Cierre Diario MSM ${close.date}: Entradas=${JSON.stringify(close.totalEntradas)}, Salidas=${JSON.stringify(close.totalSalidas)}, Entries=${close.entriesCount}`
    await sign369("Cierre Diario MSM", session?.email || "owner", content, "ZAFIRO OS")
    setMsg(`Cierre diario ejecutado — Seal ${close.seal}`)
    setMsgType("ok")
    refresh()
    setClosing(false)
    setTimeout(() => setMsg(""), 3000)
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black">MSM Economía</h1>
          <p className="text-[9px] font-mono text-slate-500">Imperio MSM — Ledger Maestro · BPA · Tasas · Trading — <Link href="/imperio" className="text-amber-400 hover:underline">👑 Centro de Mando</Link></p>
        </div>
      </div>

      {msg && (
        <div className={`flex items-center gap-2 p-2 rounded-xl mb-4 text-[10px] ${
          msgType === "ok" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300" : "bg-red-500/10 border border-red-500/20 text-red-300"
        }`}>
          {msgType === "ok" ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          {msg}
        </div>
      )}

      {/* Nav */}
      <nav className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {[
          { id: "dashboard", label: "Dashboard", icon: BarChart3 },
          { id: "operaciones", label: "Operaciones", icon: ShoppingCart },
          { id: "bpa", label: "BPA Mirror", icon: Landmark },
          { id: "tasas", label: "Tasas Cuba", icon: Globe },
          { id: "trading", label: "Trading", icon: TrendingUp },
          { id: "firmas", label: "Firmas 369", icon: Fingerprint },
          { id: "cierres", label: "Cierres", icon: FileCheck },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              tab === t.id
                ? "bg-gradient-to-r from-emerald-400/15 to-emerald-600/10 text-emerald-400 border border-emerald-400/20"
                : "text-slate-400 hover:text-white hover:bg-slate-900/40"
            }`}>
            <t.icon className="w-3 h-3" /> {t.label}
          </button>
        ))}
      </nav>

      {/* ===== DASHBOARD ===== */}
      {tab === "dashboard" && (
        <div>
          {/* Top metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <BarChart3 className="w-4 h-4 text-emerald-400 mb-2" />
              <p className="text-lg font-black">{entries.length}</p>
              <p className="text-[9px] text-slate-500">Operaciones totales</p>
              <p className="text-[7px] text-slate-600 mt-1">Ledger Maestro</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <AlertCircle className="w-4 h-4 text-amber-400 mb-2" />
              <p className="text-lg font-black">{pendingEntries.length}</p>
              <p className="text-[9px] text-slate-500">Pendientes validar</p>
              <p className="text-[7px] text-slate-600 mt-1">Ledger Maestro</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <Landmark className="w-4 h-4 text-blue-400 mb-2" />
              <p className="text-lg font-black">${bpaBal.cup.toLocaleString()}</p>
              <p className="text-[9px] text-slate-500">BPA CUP</p>
              <p className="text-[7px] text-slate-600 mt-1">Banco Popular</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <Coins className="w-4 h-4 text-purple-400 mb-2" />
              <p className="text-lg font-black">${bpaBal.mlc.toLocaleString()}</p>
              <p className="text-[9px] text-slate-500">BPA MLC</p>
              <p className="text-[7px] text-slate-600 mt-1">Banco Popular</p>
            </div>
          </div>

          {/* Node balances */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 mb-6">
            <h3 className="text-xs font-bold text-white mb-3">Balances por Nodo</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {NODO_OPTS.map(n => {
                const bal = balances[n] || {}
                const hasBalance = Object.keys(bal).length > 0
                return (
                  <div key={n} className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                    <p className="text-[9px] font-bold text-slate-400 mb-1.5">{NODO_LABELS[n]}</p>
                    {hasBalance ? Object.entries(bal).map(([cur, val]) => (
                      <div key={cur} className="flex justify-between text-[10px] font-mono">
                        <span className="text-slate-500">{cur}:</span>
                        <span className={val >= 0 ? "text-emerald-400" : "text-red-400"}>
                          {val >= 0 ? "+" : ""}${val.toFixed(2)}
                        </span>
                      </div>
                    )) : (
                      <p className="text-[9px] text-slate-600">Sin movimientos</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent ledger entries */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 mb-6">
            <h3 className="text-xs font-bold text-white mb-3">Movimientos Recientes</h3>
            {entries.length === 0 ? (
              <p className="text-[10px] text-slate-500">No hay movimientos en el Ledger.</p>
            ) : (
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {entries.slice(0, 10).map(e => (
                  <div key={e.id} className="flex items-center justify-between py-1.5 border-b border-slate-800/30 last:border-0">
                    <div className="flex items-center gap-2 text-[10px]">
                      {e.direction === "ENTRADA"
                        ? <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                        : <ArrowDownRight className="w-3 h-3 text-red-400" />
                      }
                      <span className="text-white font-medium">${e.amount.toFixed(2)} {e.currency}</span>
                      <span className="text-slate-500 truncate max-w-[120px]">{e.concept}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[7px] px-1.5 py-0.5 rounded-full border ${STATUS_COLORS[e.status] || "text-slate-500"}`}>
                        {e.status}
                      </span>
                      {e.seal369 && <span className="text-[7px] text-amber-400">369</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BPA usage + Trading summary */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <h4 className="text-[10px] font-bold text-blue-400 mb-2 flex items-center gap-1.5">
                <Landmark className="w-3 h-3" /> BPA Mirror — Límites
              </h4>
              <div className="space-y-2 text-[9px]">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Diario ({getDailyUsage().toLocaleString()} / ${BPA_LIMITS.dailyCUP.toLocaleString()} CUP)</span>
                    <span className={getDailyUsage() > BPA_LIMITS.dailyCUP * 0.8 ? "text-red-400" : "text-emerald-400"}>
                      {Math.round((getDailyUsage() / BPA_LIMITS.dailyCUP) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${
                      getDailyUsage() > BPA_LIMITS.dailyCUP * 0.8 ? "bg-red-500" : "bg-emerald-500"
                    }`} style={{ width: `${Math.min(100, (getDailyUsage() / BPA_LIMITS.dailyCUP) * 100)}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Mensual ({getMonthlyUsage().toLocaleString()} / ${BPA_LIMITS.monthlyCUP.toLocaleString()} CUP)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${Math.min(100, (getMonthlyUsage() / BPA_LIMITS.monthlyCUP) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <h4 className="text-[10px] font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" /> Trading 1%
              </h4>
              <div className="text-[9px] space-y-1">
                <div className="flex justify-between"><span className="text-slate-400">Capital:</span><span>${tradingCfg.capitalTotalUSD.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Riesgo/Op:</span><span>{tradingCfg.riesgoPorOperacion * 100}%</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Operaciones:</span><span>{tradingOps.length}</span></div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Win Rate:</span>
                  <span className="text-emerald-400">
                    {tradingOps.length > 0
                      ? Math.round((tradingOps.filter(o => o.resultadoUSD && o.resultadoUSD > 0).length / tradingOps.length) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rate reference */}
          {usdRate && (
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <p className="text-[8px] text-amber-500/70">
                Referencia USD/CUP: {(usdRate as { rate: number }).rate} (elTOQUE) &middot;
                MSM calc: $1 USD = {(usdRate as { rate: number }).rate} CUP
              </p>
            </div>
          )}
        </div>
      )}

      {/* ===== OPERACIONES ===== */}
      {tab === "operaciones" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold">Ledger Maestro</h2>
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer">
              <Plus className="w-3 h-3" /> Nueva Operación
            </button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <label className="text-[8px] font-bold text-slate-400 uppercase">Monto</label>
                    <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)}
                      className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-[8px] font-bold text-slate-400 uppercase">Moneda</label>
                    <select value={currency} onChange={e => setCurrency(e.target.value as Currency)}
                      className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none cursor-pointer">
                      {MONEDA_OPTS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] font-bold text-slate-400 uppercase">Método</label>
                    <select value={method} onChange={e => setMethod(e.target.value as PaymentMethod)}
                      className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none cursor-pointer">
                      {METODO_OPTS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] font-bold text-slate-400 uppercase">Dirección</label>
                    <select value={direction} onChange={e => setDirection(e.target.value as "ENTRADA" | "SALIDA")}
                      className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none cursor-pointer">
                      <option value="ENTRADA">Entrada</option>
                      <option value="SALIDA">Salida</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] font-bold text-slate-400 uppercase">Nodo</label>
                    <select value={node} onChange={e => setNode(e.target.value as LedgerNode)}
                      className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none cursor-pointer">
                      {NODO_OPTS.map(n => <option key={n} value={n}>{NODO_LABELS[n]}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[8px] font-bold text-slate-400 uppercase">Concepto</label>
                    <input value={concept} onChange={e => setConcept(e.target.value)}
                      className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none" placeholder="Ej: Venta de productos" />
                  </div>
                  <div>
                    <label className="text-[8px] font-bold text-slate-400 uppercase">Remitente (opcional)</label>
                    <input value={sender} onChange={e => setSender(e.target.value)}
                      className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none" />
                  </div>
                </div>
                <button onClick={createEntry}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer">
                  <Plus className="w-3 h-3 inline mr-1" /> Crear Entrada en Ledger
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Entries table */}
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-700/30">
                    <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Monto</th>
                    <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Concepto</th>
                    <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Dir</th>
                    <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Nodo</th>
                    <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Estado</th>
                    <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">369</th>
                    <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.length === 0 ? (
                    <tr><td colSpan={7} className="px-3 py-6 text-[10px] text-slate-500 text-center">Ledger vacío</td></tr>
                  ) : entries.map(e => (
                    <tr key={e.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                      <td className="px-3 py-2 text-[10px] font-mono text-white">${e.amount.toFixed(2)} {e.currency}</td>
                      <td className="px-3 py-2 text-[9px] text-slate-400 max-w-[140px] truncate">{e.concept}</td>
                      <td className="px-3 py-2">
                        {e.direction === "ENTRADA"
                          ? <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                          : <ArrowDownRight className="w-3 h-3 text-red-400" />
                        }
                      </td>
                      <td className="px-3 py-2 text-[8px] font-mono text-slate-500">{e.node}</td>
                      <td className="px-3 py-2">
                        <span className={`text-[7px] px-1.5 py-0.5 rounded-full border ${STATUS_COLORS[e.status] || "text-slate-500"}`}>
                          {e.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-[9px]">{e.seal369 ? <Check className="w-3 h-3 text-amber-400" /> : <X className="w-3 h-3 text-slate-600" />}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1">
                          {e.status === "PENDIENTE" && (
                            <button onClick={() => handleValidate(e.id)}
                              className="px-2 py-0.5 rounded text-[7px] bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 cursor-pointer">Validar</button>
                          )}
                          {e.status === "VALIDADO" && (
                            <button onClick={() => handleSync(e.id)}
                              className="px-2 py-0.5 rounded text-[7px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 cursor-pointer">Sync</button>
                          )}
                          {e.status === "SINCRONIZADO" && (
                            <select onChange={v => handleDistribute(e.id, v.target.value as LedgerNode)} defaultValue=""
                              className="px-1 py-0.5 rounded text-[7px] bg-purple-500/10 text-purple-400 border border-purple-500/20 outline-none cursor-pointer">
                              <option value="" disabled>Distribuir</option>
                              {NODO_OPTS.filter(n => n !== e.node).map(n => <option key={n} value={n}>{NODO_LABELS[n]}</option>)}
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Daily Close */}
          <div className="mt-4 p-3 rounded-xl bg-slate-900/30 border border-slate-800/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <FileCheck className="w-3 h-3" />
                Cierre diario: sella todas las entradas DISTRIBUIDAS de hoy
              </div>
              <button onClick={handleDailyClose} disabled={closing}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1">
                {closing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                Ejecutar Cierre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== BPA MIRROR ===== */}
      {tab === "bpa" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
              <Landmark className="w-3 h-3 text-blue-400" /> BPA Mirror
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 text-center">
                <p className="text-[8px] text-slate-400">CUP</p>
                <p className="text-lg font-black text-white">${bpaBal.cup.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/30 text-center">
                <p className="text-[8px] text-slate-400">MLC</p>
                <p className="text-lg font-black text-white">${bpaBal.mlc.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-[8px] text-slate-500">
              Última actualización: {bpaBal.lastUpdated ? new Date(bpaBal.lastUpdated).toLocaleString("es-ES") : "—"}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
              <Send className="w-3 h-3 text-blue-400" /> Transferencias recientes
            </h3>
            {bpaTransfers.length === 0 ? (
              <p className="text-[10px] text-slate-500">Sin transferencias registradas.</p>
            ) : (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {bpaTransfers.slice(0, 8).map(t => (
                  <div key={t.id} className="flex justify-between items-center py-1.5 border-b border-slate-800/30 last:border-0 text-[9px]">
                    <div>
                      <span className="text-white font-medium">{t.amount.toLocaleString()} {t.currency}</span>
                      <span className="text-slate-500 ml-1">→ {t.recipient}</span>
                    </div>
                    <span className="text-[7px] text-slate-600">{t.voucherCode}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== TASAS CUBA ===== */}
      {tab === "tasas" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-cyan-400" /> Tasas de Cambio Cuba
            </h3>
            <div className="space-y-1">
              {rates.filter(r => r.status === "APPROVED").slice(0, 8).map(r => (
                <div key={r.id} className="flex justify-between items-center py-1.5 border-b border-slate-800/30 last:border-0 text-[9px]">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{r.source}</span>
                    <span className="text-white font-medium">{r.baseCurrency}/{r.quoteCurrency}</span>
                    <span className={`text-[7px] px-1 rounded ${
                      r.rateType === "BUY" ? "text-emerald-400 bg-emerald-500/10" :
                      r.rateType === "SELL" ? "text-red-400 bg-red-500/10" : "text-slate-400 bg-slate-500/10"
                    }`}>{r.rateType}</span>
                  </div>
                  <span className="font-mono text-white">${r.rate.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
              <Sigma className="w-3 h-3 text-emerald-400" /> Calculadora MSM
            </h3>
            <MSMCalculator rates={rates} />
          </div>
        </div>
      )}

      {/* ===== TRADING ===== */}
      {tab === "trading" && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <h3 className="text-xs font-bold text-white mb-3">Configuración</h3>
            <div className="text-[10px] space-y-1.5">
              <div className="flex justify-between"><span className="text-slate-400">Capital:</span><span>${tradingCfg.capitalTotalUSD.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Riesgo:</span><span>{tradingCfg.riesgoPorOperacion * 100}%</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Par base:</span><span>{tradingCfg.parBase}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Modo:</span><span className="capitalize">{tradingCfg.modo}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Por operación:</span><span className="text-emerald-400">${(tradingCfg.capitalTotalUSD * tradingCfg.riesgoPorOperacion).toFixed(2)}</span></div>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <h3 className="text-xs font-bold text-white mb-3">Operaciones</h3>
            {tradingOps.length === 0 ? (
              <p className="text-[10px] text-slate-500">Sin operaciones registradas.</p>
            ) : (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {tradingOps.slice(0, 6).map(op => (
                  <div key={op.id} className="flex justify-between items-center py-1 text-[9px] border-b border-slate-800/30 last:border-0">
                    <span className="text-white">{op.activo} {op.tipo === "compra" ? "🟢" : "🔴"}</span>
                    <span className={op.resultadoUSD && op.resultadoUSD > 0 ? "text-emerald-400" : "text-red-400"}>
                      {op.resultadoUSD ? `${op.resultadoUSD >= 0 ? "+" : ""}$${op.resultadoUSD.toFixed(2)}` : "abierta"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
            <h3 className="text-xs font-bold text-white mb-3">Resumen</h3>
            <pre className="text-[7px] text-slate-400 whitespace-pre-wrap font-mono">{getResumenTrading()}</pre>
          </div>
        </div>
      )}

      {/* ===== FIRMAS 369 ===== */}
      {tab === "firmas" && (
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
          <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
            <Fingerprint className="w-3 h-3 text-amber-400" /> Firmas Digitales 369-777
          </h3>
          {firmas.length === 0 ? (
            <p className="text-[10px] text-slate-500">No hay firmas registradas. Las operaciones del Ledger se firman automáticamente al validar.</p>
          ) : (
            <div className="space-y-2">
              {firmas.slice(0, 10).map(f => (
                <div key={f.id} className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-white">{f.documentTitle}</p>
                      <p className="text-[8px] text-slate-500">{f.signerName} · {new Date(f.signedAt).toLocaleString("es-ES")}</p>
                    </div>
                    <div className="flex gap-1">
                      {f.seals.map(s => <span key={s} className="text-[7px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">{s}</span>)}
                    </div>
                  </div>
                  <p className="text-[7px] text-slate-600 mt-1 font-mono truncate">Hash: {f.contentHash.slice(0, 24)}...</p>
                  {f.latitude && f.longitude && (
                    <p className="text-[7px] text-slate-600">📍 {f.latitude.toFixed(4)}, {f.longitude.toFixed(4)}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== CIERRES ===== */}
      {tab === "cierres" && (
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
          <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
            <FileCheck className="w-3 h-3 text-emerald-400" /> Cierres Diarios
          </h3>
          {closes.length === 0 ? (
            <p className="text-[10px] text-slate-500">No hay cierres ejecutados.</p>
          ) : (
            <div className="space-y-2">
              {closes.slice(0, 10).map(c => (
                <div key={c.id} className="p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-bold text-white">Cierre {new Date(c.date).toLocaleDateString("es-ES")}</p>
                    <span className="text-[7px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">{c.seal}</span>
                  </div>
                  <div className="text-[8px] text-slate-400 space-y-0.5">
                    <p>Entradas: {Object.entries(c.totalEntradas).map(([cur, val]) => `${cur}: $${val.toFixed(2)}`).join(", ") || "—"}</p>
                    <p>Salidas: {Object.entries(c.totalSalidas).map(([cur, val]) => `${cur}: $${val.toFixed(2)}`).join(", ") || "—"}</p>
                    <p>{c.entriesCount} entries · Cerrado por: {c.closedBy.slice(0, 12)}...</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function MSMCalculator({ rates }: { rates: any[] }) {
  const [monto, setMonto] = useState("100")
  const [tasaCliente, setTasaCliente] = useState("660")
  const [tasaProv, setTasaProv] = useState("589")
  const [comisiones, setComisiones] = useState("0")
  const [costos, setCostos] = useState("0")

  const result = calculateMSM(
    parseFloat(monto) || 0,
    parseFloat(tasaCliente) || 0,
    parseFloat(tasaProv) || 0,
    parseFloat(comisiones) || 0,
    parseFloat(costos) || 0,
  )

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[7px] text-slate-400">Monto USD</label>
          <input value={monto} onChange={e => setMonto(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none" />
        </div>
        <div>
          <label className="text-[7px] text-slate-400">Tasa Cliente</label>
          <input value={tasaCliente} onChange={e => setTasaCliente(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[7px] text-slate-400">Tasa Prov</label>
          <input value={tasaProv} onChange={e => setTasaProv(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none" />
        </div>
        <div>
          <label className="text-[7px] text-slate-400">Comisiones</label>
          <input value={comisiones} onChange={e => setComisiones(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none" />
        </div>
        <div>
          <label className="text-[7px] text-slate-400">Costos Op.</label>
          <input value={costos} onChange={e => setCostos(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] text-white outline-none" />
        </div>
      </div>
      <div className="p-2 rounded-lg bg-slate-800/30 border border-slate-700/30">
        <div className="flex justify-between text-[9px]"><span className="text-slate-400">Monto CUP:</span><span className="text-white font-mono">${result.montoCUP.toFixed(2)}</span></div>
        <div className="flex justify-between text-[9px]"><span className="text-slate-400">Ganancia Bruta:</span><span className="text-emerald-400 font-mono">${result.gananciaBruta.toFixed(2)}</span></div>
        <div className="flex justify-between text-[9px]"><span className="text-slate-400">Ganancia Neta:</span><span className="text-emerald-400 font-mono font-bold">${result.gananciaNeta.toFixed(2)}</span></div>
      </div>
    </div>
  )
}

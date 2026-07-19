'use client'

import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getLedgerEntries, addLedgerEntry, validateEntry, syncEntry, distributeEntry, executeDailyClose, getDailyCloses, getNodeBalance } from '@/lib/ledger'
import type { LedgerEntry, LedgerNode, DailyClose } from '@/lib/ledger'
import { DollarSign, Plus, Send, CheckCircle, ArrowRight, TrendingUp, TrendingDown, Shield, Clock, XCircle, Search } from 'lucide-react'

const nodeColors: Record<LedgerNode, string> = {
  CAJA_ROCIO: 'text-rose-400',
  LIQUIDACION_VIP: 'text-purple-400',
  FONDO_MSM: 'text-emerald-400',
  GENERAL: 'text-[#00D9FF]',
}

const statusColors: Record<string, string> = {
  PENDIENTE: 'bg-amber-500/10 text-amber-400',
  VALIDADO: 'bg-blue-500/10 text-blue-400',
  SINCRONIZADO: 'bg-[#00D9FF]/10 text-[#00D9FF]',
  DISTRIBUIDO: 'bg-purple-500/10 text-purple-400',
  CERRADO: 'bg-emerald-500/10 text-emerald-400',
  RECHAZADO: 'bg-red-500/10 text-red-400',
}

const FLOW_STEPS = ['Entrada', 'Validación', 'Sincronización', 'Distribución', 'Cierre']

export default function LedgerPage() {
  usePageTitle('Ledger Maestro — Admin ZAFIRO')

  const [entries, setEntries] = useState<LedgerEntry[]>(() => getLedgerEntries())
  const [balances] = useState(() => ({ CAJA_ROCIO: getNodeBalance('CAJA_ROCIO'), LIQUIDACION_VIP: getNodeBalance('LIQUIDACION_VIP'), FONDO_MSM: getNodeBalance('FONDO_MSM'), GENERAL: getNodeBalance('GENERAL') }))
  const [closes] = useState(() => getDailyCloses())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [f, setF] = useState({ amount: '', currency: 'USD', method: 'ZELLE', direction: 'ENTRADA', concept: '', node: 'GENERAL', senderName: '', reference: '' })

  const refresh = useCallback(() => {
    setEntries(getLedgerEntries())
  }, [])

  const filtered = entries.filter(e =>
    (statusFilter === 'all' || e.status === statusFilter) &&
    (!search || e.concept.toLowerCase().includes(search.toLowerCase()) || e.senderName?.toLowerCase().includes(search.toLowerCase()) || e.id.includes(search))
  )

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    addLedgerEntry({
      amount: Number(f.amount), currency: f.currency as any, method: f.method as any,
      direction: f.direction as any, concept: f.concept, node: f.node as any,
      senderName: f.senderName || undefined, reference: f.reference || undefined,
    })
    setF({ amount: '', currency: 'USD', method: 'ZELLE', direction: 'ENTRADA', concept: '', node: 'GENERAL', senderName: '', reference: '' })
    setShowForm(false)
    refresh()
  }

  const totalEntradas = entries.filter(e => e.direction === 'ENTRADA').reduce((s, e) => s + e.amount, 0)
  const totalSalidas = entries.filter(e => e.direction === 'SALIDA').reduce((s, e) => s + e.amount, 0)

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-[#00D9FF] bg-clip-text text-transparent">
              Ledger Maestro
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Flujo económico centralizado — Liquidación Auditada</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-colors">
            <Plus className="w-3 h-3" /> Nueva Operación
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3">
            <p className="text-[10px] text-slate-400">Entradas</p>
            <p className="text-lg font-bold text-emerald-400">${totalEntradas.toLocaleString()}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3">
            <p className="text-[10px] text-slate-400">Salidas</p>
            <p className="text-lg font-bold text-red-400">${totalSalidas.toLocaleString()}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3">
            <p className="text-[10px] text-slate-400">Operaciones</p>
            <p className="text-lg font-bold text-white">{entries.length}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3">
            <p className="text-[10px] text-slate-400">Pendientes</p>
            <p className="text-lg font-bold text-amber-400">{entries.filter(e => e.status === 'PENDIENTE').length}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3">
            <p className="text-[10px] text-slate-400">Cerradas hoy</p>
            <p className="text-lg font-bold text-[#00D9FF]">{closes.filter(c => c.date === new Date().toISOString().slice(0, 10)).length}</p>
          </motion.div>
        </div>

        <div className="flex gap-1 border-b border-[#1A1B3A]">
          {['all', 'PENDIENTE', 'VALIDADO', 'SINCRONIZADO', 'DISTRIBUIDO', 'CERRADO'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs font-medium border-b-2 -mb-px ${statusFilter === s ? 'text-[#00D9FF] border-[#00D9FF]' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
              {s === 'all' ? 'Todas' : s}</button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por concepto, remitente o ID..."
            className="w-full bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400/50" />
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
            <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h3 className="text-sm font-semibold text-white mb-4">Nueva Operación</h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <input type="number" placeholder="Monto" value={f.amount} onChange={e => setF(p => ({ ...p, amount: e.target.value }))} required
                  className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400/50" />
                <div className="grid grid-cols-2 gap-2">
                  <select value={f.currency} onChange={e => setF(p => ({ ...p, currency: e.target.value }))}
                    className="bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                    <option value="USD">USD</option><option value="EUR">EUR</option><option value="CUP">CUP</option><option value="MLC">MLC</option><option value="USDT">USDT</option>
                  </select>
                  <select value={f.method} onChange={e => setF(p => ({ ...p, method: e.target.value }))}
                    className="bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                    <option value="ZELLE">ZELLE</option><option value="IBAN">IBAN</option><option value="CASH">CASH</option><option value="USDT">USDT</option><option value="VENMO">VENMO</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select value={f.direction} onChange={e => setF(p => ({ ...p, direction: e.target.value }))}
                    className="bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                    <option value="ENTRADA">ENTRADA</option><option value="SALIDA">SALIDA</option>
                  </select>
                  <select value={f.node} onChange={e => setF(p => ({ ...p, node: e.target.value }))}
                    className="bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                    <option value="GENERAL">GENERAL</option><option value="CAJA_ROCIO">CAJA_ROCIO</option>
                    <option value="LIQUIDACION_VIP">LIQUIDACION_VIP</option><option value="FONDO_MSM">FONDO_MSM</option>
                  </select>
                </div>
                <input placeholder="Concepto" value={f.concept} onChange={e => setF(p => ({ ...p, concept: e.target.value }))} required
                  className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none" />
                <input placeholder="Remitente (opcional)" value={f.senderName} onChange={e => setF(p => ({ ...p, senderName: e.target.value }))}
                  className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none" />
                <button type="submit" className="w-full bg-emerald-500/10 text-emerald-400 text-xs px-4 py-2 rounded-lg hover:bg-emerald-500/20 transition-colors">
                  Registrar Operación
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">Sin operaciones registradas</p>
          ) : (
            <div className="divide-y divide-[#1A1B3A]">
              {filtered.map(e => (
                <div key={e.id} className="p-4 hover:bg-[#050816] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {e.direction === 'ENTRADA' ? <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <TrendingDown className="w-4 h-4 text-red-400 flex-shrink-0" />}
                      <span className="text-sm font-medium text-white truncate">{e.concept}</span>
                    </div>
                    <span className={`text-xs font-semibold flex-shrink-0 ${e.direction === 'ENTRADA' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {e.direction === 'ENTRADA' ? '+' : '-'}${e.amount} {e.currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-slate-500 min-w-0">
                      <span className={`${nodeColors[e.node as LedgerNode] || 'text-slate-400'}`}>{e.node}</span>
                      <span>·</span>
                      <span>{e.method}</span>
                      {e.senderName && <><span>·</span><span className="truncate">{e.senderName}</span></>}
                      <span>·</span>
                      <span>{new Date(e.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColors[e.status]}`}>{e.status}</span>
                      {e.status === 'PENDIENTE' && (
                        <button onClick={() => { validateEntry(e.id, 'admin'); refresh() }}
                          className="text-[10px] text-blue-400 hover:underline">Validar</button>
                      )}
                      {e.status === 'VALIDADO' && (
                        <button onClick={() => { syncEntry(e.id); refresh() }}
                          className="text-[10px] text-[#00D9FF] hover:underline">Sincronizar</button>
                      )}
                      {e.status === 'SINCRONIZADO' && (
                        <button onClick={() => { distributeEntry(e.id, e.node as LedgerNode); refresh() }}
                          className="text-[10px] text-purple-400 hover:underline">Distribuir</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Saldos por Nodo</h2>
            <div className="space-y-3">
              {(Object.entries(balances) as [LedgerNode, Record<string, number>][]).map(([node, b]) => {
                const total = Object.values(b).reduce((s, v) => s + v, 0)
                return (
                  <div key={node} className="flex items-center justify-between py-2 border-b border-[#1A1B3A]/50 last:border-0">
                    <span className={`text-xs font-medium ${nodeColors[node]}`}>{node}</span>
                    <div className="text-right">
                      <span className="text-xs text-white">${total.toLocaleString()}</span>
                      {Object.entries(b).map(([cur, amt]) => (
                        <span key={cur} className="text-[10px] text-slate-500 ml-2">({amt} {cur})</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Cierres Diarios</h2>
            {closes.length === 0 ? <p className="text-xs text-slate-500">Sin cierres</p> : (
              <div className="space-y-2">
                {closes.slice(0, 10).map(c => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-[#1A1B3A]/50 last:border-0 text-xs">
                    <div>
                      <p className="text-slate-300">{c.date}</p>
                      <p className="text-[10px] text-slate-500">{c.entriesCount} ops · {c.closedBy}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400">+${Object.values(c.totalEntradas).reduce((s, v) => s + v, 0).toLocaleString()}</p>
                      <p className="text-red-400">-${Object.values(c.totalSalidas).reduce((s, v) => s + v, 0).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => { executeDailyClose('admin'); refresh() }}
              className="flex items-center gap-1 text-xs bg-[#00D9FF]/10 text-[#00D9FF] px-3 py-1.5 rounded-lg hover:bg-[#00D9FF]/20 transition-colors mt-3">
              <Clock className="w-3 h-3" /> Ejecutar Cierre Diario
            </button>
          </div>
        </div>

        <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
          <h2 className="text-xs font-semibold text-white mb-3">Flujo de Operación</h2>
          <div className="flex items-center gap-0">
            {FLOW_STEPS.map((step, i) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex-1 text-center text-[10px] px-2 py-1.5 rounded ${i < 2 ? 'bg-[#00D9FF]/10 text-[#00D9FF]' : 'bg-[#1A1B3A] text-slate-500'}`}>
                  {step}
                </div>
                {i < FLOW_STEPS.length - 1 && <ArrowRight className="w-3 h-3 text-slate-600 mx-1 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

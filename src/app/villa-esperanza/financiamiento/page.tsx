'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getVillaFinancialSummary, addVillaContribution, getVillaContributions } from '@/lib/villa-esperanza'
import type { VillaContribution } from '@/lib/villa-esperanza'
import { ArrowLeft, DollarSign, Heart, CheckCircle, AlertTriangle, Plus, Send, Shield } from 'lucide-react'

export default function FinanciamientoPage() {
  usePageTitle('Financiamiento — Villa Esperanza')
  const [financial, setFinancial] = useState(() => getVillaFinancialSummary())
  const [contributions, setContributions] = useState<VillaContribution[]>(() => getVillaContributions())
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ donor: '', amount: '', type: 'donation' as const })

  const pct = financial ? Math.min(100, Math.round((financial.raisedUsd / financial.goalUsd) * 100)) : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const c: VillaContribution = {
      id: `c-${Date.now()}`,
      donor: form.donor,
      amount: Number(form.amount),
      currency: 'USD',
      date: new Date().toISOString(),
      type: form.type,
      verified: false,
    }
    addVillaContribution(c)
    setContributions(getVillaContributions())
    setFinancial(getVillaFinancialSummary())
    setForm({ donor: '', amount: '', type: 'donation' })
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/villa-esperanza" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3 h-3" /> Volver a Villa Esperanza
        </Link>

        <div className="flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-rose-400" />
          <div>
            <h1 className="text-xl font-bold text-white">Financiamiento</h1>
            <p className="text-xs text-slate-400">Meta: $5,000,000 USD — Transparencia total</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Meta Total</p>
            <p className="text-xl font-bold text-white">${financial?.goalUsd.toLocaleString() || '5,000,000'}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Recaudado</p>
            <p className="text-xl font-bold text-emerald-400">${financial?.raisedUsd.toLocaleString() || '0'}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Comprometido</p>
            <p className="text-xl font-bold text-amber-400">${financial?.committedUsd.toLocaleString() || '0'}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Donantes</p>
            <p className="text-xl font-bold text-purple-400">{financial?.donorCount || 0}</p>
          </motion.div>
        </div>

        <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Progreso</h2>
            <span className="text-xs text-slate-400">{pct}%</span>
          </div>
          <div className="w-full h-3 bg-[#1A1B3A] rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
              className="h-full bg-gradient-to-r from-rose-400 to-purple-400 rounded-full" />
          </div>
        </div>

        <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" /> Registro de Aportes
            </h2>
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1 text-xs bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-lg hover:bg-rose-500/20 transition-colors">
              <Plus className="w-3 h-3" /> Registrar
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-[#050816] rounded-lg p-4 mb-4 border border-[#1A1B3A] space-y-3">
              <input placeholder="Nombre del donante" value={form.donor} onChange={e => setForm(p => ({ ...p, donor: e.target.value }))}
                className="w-full bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-400/50" />
              <input type="number" placeholder="Monto USD" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                className="w-full bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-400/50" />
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))}
                className="w-full bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400/50">
                <option value="donation">Donación</option>
                <option value="commitment">Compromiso</option>
                <option value="investment">Inversión</option>
              </select>
              <button type="submit" className="flex items-center gap-1 text-xs bg-rose-500/10 text-rose-400 px-4 py-2 rounded-lg hover:bg-rose-500/20 transition-colors">
                <Send className="w-3 h-3" /> Registrar Aporte
              </button>
            </form>
          )}

          {contributions.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No hay aportes registrados. Usa el manifiesto para registrar el primero.</p>
          ) : (
            <div className="space-y-2">
              {contributions.slice().reverse().map(c => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-[#1A1B3A]/50 last:border-0 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    {c.verified ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                    <span className="text-slate-300 truncate">{c.donor}</span>
                    <span className="text-[10px] text-slate-500">({c.type})</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-emerald-400 font-semibold">${c.amount}</span>
                    <span className="text-slate-500">{new Date(c.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-400">Regla de Transparencia</p>
              <p className="text-[10px] text-amber-400/60 mt-1">
                No mostrar como fondos disponibles hasta existir evidencia bancaria, contratos o compromisos verificados.
                Los aportes marcados con {<AlertTriangle className="w-2.5 h-2.5 inline" />} no están verificados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import { getCampaigns, getContributions, getFinancialSummary, getExpenses, getAllocations, getAuditLog, addContribution, verifyContribution, addExpense } from '@/lib/financiamiento'
import type { FundingCampaign, FundingContribution, FundingExpense, FundingAllocation } from '@/lib/financiamiento'
import { DollarSign, Plus, Send, CheckCircle, AlertTriangle, TrendingUp, FileText, Search, Shield } from 'lucide-react'

export default function AdminFinanciamientoPage() {
  usePageTitle('Financiamiento — Admin ZAFIRO')
  const router = useRouter()

  const [summary, setSummary] = useState(() => getFinancialSummary())
  const [campaigns, setCampaigns] = useState<FundingCampaign[]>(() => getCampaigns())
  const [contributions, setContributions] = useState<FundingContribution[]>(() => getContributions())
  const [expenses, setExpenses] = useState<FundingExpense[]>(() => getExpenses())
  const [allocations, setAllocations] = useState<FundingAllocation[]>(() => getAllocations())
  const [auditLog, setAuditLog] = useState(() => getAuditLog())
  const [tab, setTab] = useState('overview')
  const [showContributionForm, setShowContributionForm] = useState(false)
  const [cf, setCf] = useState({ donorName: '', amountUsd: '', source: 'donation', campaignId: 'camp-villa' })

  const refresh = () => {
    setSummary(getFinancialSummary())
    setCampaigns(getCampaigns())
    setContributions(getContributions())
    setExpenses(getExpenses())
    setAllocations(getAllocations())
    setAuditLog(getAuditLog())
  }

  const handleContribution = (e: React.FormEvent) => {
    e.preventDefault()
    addContribution({
      id: `c-${Date.now()}`,
      campaignId: cf.campaignId,
      donorName: cf.donorName,
      amountUsd: Number(cf.amountUsd),
      currency: 'USD',
      source: cf.source as any,
      status: 'pending',
      date: new Date().toISOString(),
    })
    setCf({ donorName: '', amountUsd: '', source: 'donation', campaignId: 'camp-villa' })
    setShowContributionForm(false)
    refresh()
  }

  const pct = summary ? Math.min(100, Math.round((summary.totalRaised / summary.totalGoal) * 100)) : 0

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
              Motor de Financiamiento
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Gestión de fondos, donaciones e inversiones del ecosistema MSM</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowContributionForm(!showContributionForm)}
              className="flex items-center gap-1 text-xs bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-lg hover:bg-rose-500/20 transition-colors">
              <Plus className="w-3 h-3" /> Registrar Aporte
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Meta Total</p>
            <p className="text-xl font-bold text-white">${summary?.totalGoal.toLocaleString() || '0'}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Confirmado</p>
            <p className="text-xl font-bold text-emerald-400">${summary?.totalRaised.toLocaleString() || '0'}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Pendiente</p>
            <p className="text-xl font-bold text-amber-400">${summary?.totalPending.toLocaleString() || '0'}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Disponible</p>
            <p className="text-xl font-bold text-[#00D9FF]">${summary?.available.toLocaleString() || '0'}</p>
          </motion.div>
        </div>

        <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Progreso Global</h2>
            <span className="text-xs text-slate-400">{pct}%</span>
          </div>
          <div className="w-full h-3 bg-[#1A1B3A] rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
              className="h-full bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 rounded-full" />
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
            <span>${summary?.totalExpenses.toLocaleString() || '0'} gastado</span>
            <span>${summary?.totalAllocated.toLocaleString() || '0'} asignado</span>
            <span>{summary?.donorCount || 0} donantes</span>
            <span>{summary?.activeCampaigns || 0} campañas activas</span>
          </div>
        </div>

        <div className="flex gap-1 border-b border-[#1A1B3A] mb-2">
          {['overview', 'campaigns', 'contributions', 'expenses', 'audit'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${tab === t ? 'text-[#00D9FF] border-[#00D9FF]' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
              {t === 'overview' ? 'Resumen' : t === 'campaigns' ? 'Campañas' : t === 'contributions' ? 'Aportes' : t === 'expenses' ? 'Gastos' : 'Auditoría'}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Distribución por Campaña</h3>
              <div className="space-y-3">
                {campaigns.map(c => {
                  const cpct = c.goalUsd > 0 ? Math.round((c.raisedUsd / c.goalUsd) * 100) : 0
                  return (
                    <div key={c.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">{c.name}</span>
                        <span className="text-slate-400">${c.raisedUsd.toLocaleString()} / ${c.goalUsd.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#1A1B3A] rounded-full overflow-hidden">
                        <div className="h-full bg-rose-400 rounded-full" style={{ width: `${cpct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Gastos por Fase</h3>
              {expenses.length === 0 ? <p className="text-xs text-slate-500">Sin gastos registrados</p> : (
                <div className="space-y-2">
                  {expenses.slice().reverse().slice(0, 5).map(e => (
                    <div key={e.id} className="flex justify-between text-xs py-1.5 border-b border-[#1A1B3A]/50 last:border-0">
                      <span className="text-slate-300 truncate">{e.description}</span>
                      <span className="text-red-400 font-medium">-${e.amountUsd}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'contributions' && (
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            {showContributionForm && (
              <form onSubmit={handleContribution} className="bg-[#050816] rounded-lg p-4 mb-4 border border-[#1A1B3A] space-y-3">
                <input placeholder="Nombre del donante" value={cf.donorName} onChange={e => setCf(p => ({ ...p, donorName: e.target.value }))}
                  className="w-full bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-400/50" />
                <input type="number" placeholder="Monto USD" value={cf.amountUsd} onChange={e => setCf(p => ({ ...p, amountUsd: e.target.value }))}
                  className="w-full bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-400/50" />
                <select value={cf.source} onChange={e => setCf(p => ({ ...p, source: e.target.value }))}
                  className="w-full bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400/50">
                  <option value="donation">Donación</option>
                  <option value="investment">Inversión</option>
                  <option value="sponsorship">Patrocinio</option>
                  <option value="commitment">Compromiso</option>
                </select>
                <select value={cf.campaignId} onChange={e => setCf(p => ({ ...p, campaignId: e.target.value }))}
                  className="w-full bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400/50">
                  {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button type="submit" className="flex items-center gap-1 text-xs bg-rose-500/10 text-rose-400 px-4 py-2 rounded-lg hover:bg-rose-500/20 transition-colors">
                  <Send className="w-3 h-3" /> Registrar
                </button>
              </form>
            )}
            <div className="space-y-2">
              {contributions.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">Sin aportes registrados</p>
              ) : (
                contributions.slice().reverse().map(c => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-[#1A1B3A]/50 last:border-0 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      {c.status === 'confirmed' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> :
                       c.status === 'pending' ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" /> :
                       <Shield className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                      <span className="text-slate-300 truncate">{c.donorName}</span>
                      <span className="text-[10px] text-slate-500">({c.source})</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-emerald-400 font-semibold">${c.amountUsd}</span>
                      <span className="text-slate-500">{new Date(c.date).toLocaleDateString()}</span>
                      {c.status === 'pending' && (
                        <button onClick={() => { verifyContribution(c.id, 'admin'); refresh() }}
                          className="text-[10px] text-[#00D9FF] hover:underline">Verificar</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'campaigns' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map(c => {
              const cpct = c.goalUsd > 0 ? Math.round((c.raisedUsd / c.goalUsd) * 100) : 0
              return (
                <div key={c.id} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-white">{c.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>{c.status}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{c.description}</p>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">${c.raisedUsd.toLocaleString()} de ${c.goalUsd.toLocaleString()}</span>
                    <span className="text-slate-500">{cpct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1A1B3A] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-400 to-amber-400 rounded-full" style={{ width: `${cpct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'expenses' && (
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            {expenses.length === 0 ? <p className="text-xs text-slate-500 text-center py-4">Sin gastos registrados</p> : (
              <div className="space-y-2">
                {expenses.slice().reverse().map(e => (
                  <div key={e.id} className="flex items-center justify-between py-2 border-b border-[#1A1B3A]/50 last:border-0 text-xs">
                    <div>
                      <p className="text-slate-300">{e.description}</p>
                      <p className="text-[10px] text-slate-500">{e.category} · {new Date(e.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-medium">-${e.amountUsd}</p>
                      <p className="text-[10px] text-slate-500">{e.approvedBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'audit' && (
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            {auditLog.length === 0 ? <p className="text-xs text-slate-500 text-center py-4">Sin eventos de auditoría</p> : (
              <div className="space-y-1.5">
                {auditLog.slice().reverse().map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between py-1.5 border-b border-[#1A1B3A]/50 last:border-0 text-[11px]">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-3 h-3 text-slate-500 flex-shrink-0" />
                      <span className="text-slate-300 truncate">{a.detail}</span>
                    </div>
                    <span className="text-slate-500 flex-shrink-0 ml-2">{new Date(a.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-amber-400">Reglas del Motor de Financiamiento</p>
              <ul className="text-[10px] text-amber-400/60 mt-1 space-y-0.5">
                <li>• No prometer retorno financiero sin estructura legal</li>
                <li>• Separar donación, aporte, inversión y patrocinio</li>
                <li>• Toda entrada debe tener fuente — toda salida debe tener comprobante</li>
                <li>• No contar promesas como dinero recibido</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

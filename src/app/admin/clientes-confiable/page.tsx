'use client'

import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getClients, getClientStats, getMemoriaEntries, addClient, updateClientLevel, updateClientRisk, addMemoriaEntry, exportClientData } from '@/lib/cliente-confiable'
import type { ClienteConfiable, TrustLevel, MemoriaEternaEntry } from '@/lib/cliente-confiable'
import { Shield, Users, Plus, Search, Download, AlertTriangle, CheckCircle, XCircle, UserPlus, Eye, ChevronDown, FileText } from 'lucide-react'

const levelColors: Record<TrustLevel, string> = {
  BASIC: 'bg-slate-500/10 text-slate-400',
  VERIFIED: 'bg-blue-500/10 text-blue-400',
  TRUSTED: 'bg-emerald-500/10 text-emerald-400',
  VIP: 'bg-purple-500/10 text-purple-400',
  RESTRICTED: 'bg-red-500/10 text-red-400',
}

const riskColors = { LOW: 'text-emerald-400', MEDIUM: 'text-amber-400', HIGH: 'text-red-400' }

export default function ClientesConfiablePage() {
  usePageTitle('Clientes Confiables — Admin ZAFIRO')

  const [clients, setClients] = useState<ClienteConfiable[]>(() => getClients())
  const [stats] = useState(() => getClientStats())
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [memoria, setMemoria] = useState<MemoriaEternaEntry[]>(() => getMemoriaEntries(selected || ''))
  const [showForm, setShowForm] = useState(false)
  const [f, setF] = useState({ name: '', phone: '', email: '', country: 'Cuba', trustLevel: 'BASIC' as TrustLevel })

  const refresh = useCallback(() => { setClients(getClients()) }, [])

  const filtered = clients.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  )

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    addClient({
      id: `cli-${Date.now()}`, name: f.name, phone: f.phone, email: f.email, country: f.country,
      trustLevel: f.trustLevel, riskLevel: 'LOW', operationCount: 0, totalVolumeUsd: 0,
      consentGranted: true, consentDate: new Date().toISOString(),
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    })
    setF({ name: '', phone: '', email: '', country: 'Cuba', trustLevel: 'BASIC' })
    setShowForm(false)
    refresh()
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Cliente Confiable
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Protocolo de identificación, riesgo y confianza</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-colors">
            <UserPlus className="w-3 h-3" /> Nuevo Cliente
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
            <p className="text-xs text-slate-400">Total Clientes</p>
            <p className="text-xl font-bold text-white">{stats?.total || 0}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
            <p className="text-xs text-slate-400">Verificados+Trusted+VIP</p>
            <p className="text-xl font-bold text-emerald-400">{(stats?.verified || 0) + (stats?.trusted || 0) + (stats?.vip || 0)}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
            <p className="text-xs text-slate-400">Alto Riesgo</p>
            <p className="text-xl font-bold text-red-400">{stats?.highRisk || 0}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
            <p className="text-xs text-slate-400">Consentimiento</p>
            <p className="text-xl font-bold text-[#00D9FF]">{stats?.consentPct || 0}%</p>
          </motion.div>
        </div>

        <div className="flex gap-1 border-b border-[#1A1B3A]">
          <button onClick={() => setSelected(null)}
            className={`px-3 py-2 text-xs font-medium border-b-2 -mb-px ${!selected ? 'text-[#00D9FF] border-[#00D9FF]' : 'text-slate-500 border-transparent hover:text-slate-300'}`}>
            Lista de Clientes
          </button>
        </div>

        {!selected ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, email o teléfono..."
                className="w-full bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50" />
            </div>

            <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl overflow-hidden">
              {filtered.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">No hay clientes registrados</p>
              ) : (
                <div className="divide-y divide-[#1A1B3A]">
                  {filtered.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-4 hover:bg-[#050816] transition-colors cursor-pointer" onClick={() => { setSelected(c.id); setMemoria(getMemoriaEntries(c.id)) }}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {c.name.charAt(0)}{c.name.split(' ')[1]?.charAt(0) || ''}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.email} · {c.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${riskColors[c.riskLevel]} bg-opacity-10`}>{c.riskLevel}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${levelColors[c.trustLevel]}`}>{c.trustLevel}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <ClientDetail clientId={selected} onBack={() => setSelected(null)} />
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
            <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h3 className="text-sm font-semibold text-white mb-4">Nuevo Cliente Confiable</h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <input placeholder="Nombre completo" value={f.name} onChange={e => setF(p => ({ ...p, name: e.target.value }))} required
                  className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400/50" />
                <input placeholder="Teléfono" value={f.phone} onChange={e => setF(p => ({ ...p, phone: e.target.value }))} required
                  className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400/50" />
                <input placeholder="Email" type="email" value={f.email} onChange={e => setF(p => ({ ...p, email: e.target.value }))} required
                  className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400/50" />
                <select value={f.country} onChange={e => setF(p => ({ ...p, country: e.target.value }))}
                  className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400/50">
                  <option value="Cuba">Cuba</option>
                  <option value="USA">USA</option>
                  <option value="Panama">Panamá</option>
                  <option value="Mexico">México</option>
                  <option value="Other">Otro</option>
                </select>
                <select value={f.trustLevel} onChange={e => setF(p => ({ ...p, trustLevel: e.target.value as TrustLevel }))}
                  className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400/50">
                  <option value="BASIC">BASIC</option>
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="TRUSTED">TRUSTED</option>
                  <option value="VIP">VIP</option>
                </select>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-emerald-500/10 text-emerald-400 text-xs px-4 py-2 rounded-lg hover:bg-emerald-500/20 transition-colors">
                    Crear Cliente
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-slate-500/10 text-slate-400 text-xs px-4 py-2 rounded-lg hover:bg-slate-500/20 transition-colors">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ClientDetail({ clientId, onBack }: { clientId: string; onBack: () => void }) {
  const [client, setClient] = useState<ClienteConfiable | null>(() => getClients().find(x => x.id === clientId) || null)
  const [memoria, setMemoria] = useState<MemoriaEternaEntry[]>(() => getMemoriaEntries(clientId))
  const [note, setNote] = useState('')

  const refresh = () => {
    setClient(getClients().find(x => x.id === clientId) || null)
    setMemoria(getMemoriaEntries(clientId))
  }

  if (!client) return <div className="text-xs text-slate-500 py-8 text-center">Cliente no encontrado</div>

  const handleExport = () => {
    const data = exportClientData(clientId)
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `cliente-${client.id}.json`; a.click()
      URL.revokeObjectURL(url)
    }
  }

  const addNote = () => {
    if (!note.trim()) return
    addMemoriaEntry(clientId, { type: 'note', description: note.trim() })
    setNote('')
    refresh()
  }

  return (
    <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5 space-y-4">
      <button onClick={onBack} className="text-xs text-slate-400 hover:text-white transition-colors">← Volver a lista</button>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center text-sm font-bold text-white">
            {client.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">{client.name}</h2>
            <p className="text-xs text-slate-400">{client.email} · {client.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="flex items-center gap-1 text-[10px] text-slate-400 px-2 py-1 rounded hover:bg-[#1A1B3A] transition-colors">
            <Download className="w-3 h-3" /> Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="bg-[#050816] rounded-lg p-3">
          <p className="text-[10px] text-slate-500">Nivel</p>
          <p className={`text-xs font-semibold mt-0.5 ${levelColors[client.trustLevel].split(' ')[1]}`}>{client.trustLevel}</p>
        </div>
        <div className="bg-[#050816] rounded-lg p-3">
          <p className="text-[10px] text-slate-500">Riesgo</p>
          <p className={`text-xs font-semibold mt-0.5 ${riskColors[client.riskLevel]}`}>{client.riskLevel}</p>
        </div>
        <div className="bg-[#050816] rounded-lg p-3">
          <p className="text-[10px] text-slate-500">Operaciones</p>
          <p className="text-xs font-semibold text-white mt-0.5">{client.operationCount}</p>
        </div>
        <div className="bg-[#050816] rounded-lg p-3">
          <p className="text-[10px] text-slate-500">Volumen</p>
          <p className="text-xs font-semibold text-white mt-0.5">${client.totalVolumeUsd.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {(['BASIC', 'VERIFIED', 'TRUSTED', 'VIP', 'RESTRICTED'] as TrustLevel[]).map(l => (
          <button key={l} onClick={() => { updateClientLevel(clientId, l); refresh() }}
            className={`text-[10px] px-2 py-1 rounded-full transition-colors ${client.trustLevel === l ? levelColors[l] : 'bg-[#050816] text-slate-500 hover:text-slate-300'}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1">
        {(['LOW', 'MEDIUM', 'HIGH'] as const).map(r => (
          <button key={r} onClick={() => { updateClientRisk(clientId, r); refresh() }}
            className={`text-[10px] px-2 py-1 rounded-full transition-colors ${client.riskLevel === r ? `bg-${r === 'LOW' ? 'emerald' : r === 'MEDIUM' ? 'amber' : 'red'}-500/10 ${riskColors[r]}` : 'bg-[#050816] text-slate-500 hover:text-slate-300'}`}>
            {r}
          </button>
        ))}
      </div>

      <div>
        <h3 className="text-xs font-semibold text-white mb-2 flex items-center gap-1">
          <FileText className="w-3 h-3 text-amber-400" /> Memoria Eterna
        </h3>
        <div className="flex gap-2 mb-3">
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Agregar nota a la memoria..."
            className="flex-1 bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50"
            onKeyDown={e => e.key === 'Enter' && addNote()} />
          <button onClick={addNote} className="text-xs bg-amber-500/10 text-amber-400 px-3 rounded-lg hover:bg-amber-500/20">Agregar</button>
        </div>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {memoria.length === 0 ? <p className="text-[10px] text-slate-500">Sin entradas en la memoria</p> : (
            memoria.map(e => (
              <div key={e.id} className="flex items-start gap-2 text-[11px] py-1 border-b border-[#1A1B3A]/50 last:border-0">
                <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${
                  e.type === 'level_change' ? 'bg-purple-400' :
                  e.type === 'risk_update' ? 'bg-red-400' :
                  e.type === 'consent' ? 'bg-blue-400' : 'bg-slate-500'
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-slate-300 truncate">{e.description}</p>
                  <p className="text-[10px] text-slate-500">{new Date(e.date).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

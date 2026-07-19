'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users, CheckCircle, XCircle, Trash2, Download, RefreshCw, Diamond, Search, Mail, Calendar } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import GlassCard from "@/components/ui/GlassCard"

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  source: string
  consent: boolean
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'dismissed'
  createdAt: string
  notes?: string
}

const LEADS_KEY = 'zafiro_mente_maestra_leads'

function loadLeads(): Lead[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LEADS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Lead[]
  } catch { return [] }
}

function saveLeads(leads: Lead[]): void {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(LEADS_KEY, JSON.stringify(leads)) } catch { /* silent */ }
}

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-[#00D9FF]/10 text-[#00D9FF]',
  contacted: 'bg-amber-500/10 text-amber-400',
  qualified: 'bg-emerald-500/10 text-emerald-400',
  converted: 'bg-violet-500/10 text-violet-400',
  dismissed: 'bg-slate-800 text-slate-500',
}

export default function MenteMaestraLeadsPage() {
  usePageTitle("Admin — Leads La Mente Maestra")
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    const session = getSession()
    if (!session || session.email !== 'msmmystore@gmail.com') {
      router.replace('/')
    } else {
      setAuthorized(true)
      setLeads(loadLeads())
    }
  }, [router])

  const updateStatus = (id: string, status: Lead['status']) => {
    setLeads(prev => {
      const next = prev.map(l => l.id === id ? { ...l, status } : l)
      saveLeads(next)
      return next
    })
  }

  const deleteLead = (id: string) => {
    setLeads(prev => {
      const next = prev.filter(l => l.id !== id)
      saveLeads(next)
      return next
    })
  }

  const exportCSV = () => {
    const header = 'Nombre,Email,Teléfono,Origen,Consentimiento,Estado,Creado,Notas'
    const rows = leads.map(l =>
      `"${l.name}","${l.email}","${l.phone}","${l.source}","${l.consent}","${l.status}","${l.createdAt}","${l.notes || ''}"`
    ).join('\n')
    const blob = new Blob([`${header}\n${rows}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `mente-maestra-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  const filtered = leads.filter(l => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false
    if (search.trim() && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.email.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const counts: Record<string, number> = { all: leads.length }
  for (const s of ['new', 'contacted', 'qualified', 'converted', 'dismissed'] as const) {
    counts[s] = leads.filter(l => l.status === s).length
  }

  if (!authorized) return null

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a Admin
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00D9FF] to-violet-600 flex items-center justify-center shadow-lg shadow-[#00D9FF]/20">
              <Diamond className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">La Mente Maestra — Leads</h1>
              <p className="text-sm text-slate-400">{leads.length} leads capturados</p>
            </div>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-all">
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
          {[
            { key: 'all', label: 'Todos', count: counts.all, color: 'text-white' },
            { key: 'new', label: 'Nuevos', count: counts.new || 0, color: 'text-[#00D9FF]' },
            { key: 'contacted', label: 'Contactados', count: counts.contacted || 0, color: 'text-amber-400' },
            { key: 'qualified', label: 'Calificados', count: counts.qualified || 0, color: 'text-emerald-400' },
            { key: 'converted', label: 'Convertidos', count: counts.converted || 0, color: 'text-violet-400' },
            { key: 'dismissed', label: 'Descartados', count: counts.dismissed || 0, color: 'text-slate-500' },
          ].map(({ key, label, count, color }) => (
            <button key={key} onClick={() => setStatusFilter(key)}
              className={`p-3 rounded-xl text-center transition-all ${statusFilter === key ? 'glass border border-slate-700/60' : 'bg-slate-900/40 hover:bg-slate-800/60 border border-transparent'}`}>
              <p className={`text-lg font-black ${color}`}>{count}</p>
              <p className="text-[10px] text-slate-500">{label}</p>
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#00D9FF]/50" />
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 rounded-2xl glass text-center">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No hay leads que coincidan con los filtros.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(lead => (
              <GlassCard key={lead.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-white">{lead.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_STYLES[lead.status]}`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(lead.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {lead.status === 'new' && (
                      <button onClick={() => updateStatus(lead.id, 'contacted')} className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all" title="Marcar contactado">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {lead.status === 'contacted' && (
                      <button onClick={() => updateStatus(lead.id, 'qualified')} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all" title="Calificar">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {(lead.status === 'new' || lead.status === 'contacted') && (
                      <button onClick={() => updateStatus(lead.id, 'dismissed')} className="p-2 rounded-lg bg-slate-800 text-slate-500 hover:text-red-400 transition-all" title="Descartar">
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => deleteLead(lead.id)} className="p-2 rounded-lg bg-slate-800 text-slate-500 hover:text-red-400 transition-all" title="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

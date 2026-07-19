'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Megaphone, Eye, MousePointerClick, TrendingUp, Plus, ExternalLink, BarChart3 } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import GlassCard from "@/components/ui/GlassCard"

interface Campaign {
  id: string
  title: string
  slug: string
  status: 'active' | 'draft' | 'ended'
  views: number
  clicks: number
  leads: number
  createdAt: string
  cta: string
  url: string
}

const CAMPAIGNS_KEY = 'zafiro_campaigns'

function loadCampaigns(): Campaign[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CAMPAIGNS_KEY)
    if (raw) return JSON.parse(raw) as Campaign[]
  } catch { /* silent */ }
  return [
    {
      id: 'camp-369-777',
      title: 'ZAFIRO 369/777',
      slug: 'zafiro-369-777',
      status: 'active',
      views: 0,
      clicks: 0,
      leads: 0,
      createdAt: '2026-07-18T00:00:00Z',
      cta: 'Únete a la Revolución',
      url: '/campanas/zafiro-369-777',
    },
    {
      id: 'camp-mente-maestra',
      title: 'La Mente Maestra',
      slug: 'transforma-tu-vida-con-la-mente-maestra',
      status: 'active',
      views: 0,
      clicks: 0,
      leads: 0,
      createdAt: '2026-07-17T00:00:00Z',
      cta: 'Transforma tu vida',
      url: '/transforma-tu-vida-con-la-mente-maestra',
    },
  ]
}

function saveCampaigns(campaigns: Campaign[]): void {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns)) } catch { /* silent */ }
}

export default function CampanasAdminPage() {
  usePageTitle("Admin — Campañas")
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', slug: '', cta: '', url: '' })

  useEffect(() => {
    const session = getSession()
    if (!session || session.email !== 'msmmystore@gmail.com') {
      router.replace('/')
    } else {
      setAuthorized(true)
      setCampaigns(loadCampaigns())
    }
  }, [router])

  const startEdit = (c: Campaign) => {
    setEditing(c.id)
    setEditForm({ title: c.title, slug: c.slug, cta: c.cta, url: c.url })
  }

  const saveEdit = (id: string) => {
    setCampaigns(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...editForm } : c)
      saveCampaigns(next)
      return next
    })
    setEditing(null)
  }

  const toggleStatus = (id: string) => {
    setCampaigns(prev => {
      const next = prev.map(c => {
        if (c.id !== id) return c
        const statusCycle: Campaign['status'][] = ['active', 'draft', 'ended']
        const idx = statusCycle.indexOf(c.status)
        return { ...c, status: statusCycle[(idx + 1) % 3] }
      })
      saveCampaigns(next)
      return next
    })
  }

  const incrementViews = (id: string) => {
    setCampaigns(prev => {
      const next = prev.map(c => c.id === id ? { ...c, views: c.views + 1 } : c)
      saveCampaigns(next)
      return next
    })
  }

  const totalViews = campaigns.reduce((a, c) => a + c.views, 0)
  const totalClicks = campaigns.reduce((a, c) => a + c.clicks, 0)
  const totalLeads = campaigns.reduce((a, c) => a + c.leads, 0)

  if (!authorized) return null

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a Admin
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Campañas</h1>
            <p className="text-sm text-slate-400">{campaigns.length} campañas</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <GlassCard className="p-4 text-center">
            <Eye className="w-5 h-5 text-[#00D9FF] mx-auto mb-1.5" />
            <p className="text-xl font-black text-white">{totalViews}</p>
            <p className="text-[10px] text-slate-400">Vistas totales</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <MousePointerClick className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
            <p className="text-xl font-black text-white">{totalClicks}</p>
            <p className="text-[10px] text-slate-400">Clics totales</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <TrendingUp className="w-5 h-5 text-violet-400 mx-auto mb-1.5" />
            <p className="text-xl font-black text-white">{totalLeads}</p>
            <p className="text-[10px] text-slate-400">Leads generados</p>
          </GlassCard>
        </div>

        <div className="space-y-3">
          {campaigns.map(camp => (
            <GlassCard key={camp.id} className="p-5">
              {editing === camp.id ? (
                <div className="space-y-3">
                  <input type="text" value={editForm.title} onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#00D9FF]/50" placeholder="Título" />
                  <input type="text" value={editForm.slug} onChange={e => setEditForm(p => ({ ...p, slug: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#00D9FF]/50" placeholder="Slug" />
                  <input type="text" value={editForm.cta} onChange={e => setEditForm(p => ({ ...p, cta: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#00D9FF]/50" placeholder="CTA" />
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(camp.id)} className="px-4 py-2 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] hover:bg-[#00D9FF]/20 text-sm font-medium transition-all">Guardar</button>
                    <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-sm transition-all">Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${camp.status === 'active' ? 'from-emerald-500 to-teal-600' : camp.status === 'draft' ? 'from-slate-500 to-slate-600' : 'from-red-500 to-red-600'} flex items-center justify-center`}>
                        <Megaphone className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{camp.title}</p>
                        <p className="text-[10px] text-slate-500">/{camp.slug}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      camp.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                      camp.status === 'draft' ? 'bg-slate-800 text-slate-500' : 'bg-red-500/10 text-red-400'
                    }`}>{camp.status.toUpperCase()}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">{camp.views}</p>
                      <p className="text-[10px] text-slate-500">Vistas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">{camp.clicks}</p>
                      <p className="text-[10px] text-slate-500">Clics</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">{camp.leads}</p>
                      <p className="text-[10px] text-slate-500">Leads</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={camp.url} target="_blank" className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-[11px] transition-all">
                      <ExternalLink className="w-3 h-3" /> Visitar
                    </Link>
                    <button onClick={() => startEdit(camp)} className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-[11px] transition-all">
                      Editar
                    </button>
                    <button onClick={() => toggleStatus(camp.id)} className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-[11px] transition-all">
                      Cambiar estado
                    </button>
                    <button onClick={() => incrementViews(camp.id)} className="px-3 py-1.5 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] text-[11px] hover:bg-[#00D9FF]/20 transition-all">
                      <BarChart3 className="w-3 h-3" />
                    </button>
                  </div>
                </>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  )
}

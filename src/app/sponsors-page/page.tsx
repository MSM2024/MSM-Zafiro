'use client'

import Link from "next/link"
import { ArrowLeft, Award, TrendingUp, BarChart3, DollarSign, Target, Zap, Eye, Plus, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { usePageTitle } from "@/lib/usePageTitle"
import { loadPersistedSponsors, saveSponsors, clearSponsors, type SponsorCampaign } from "@/lib/zafiro-data"

export default function SponsorsFullPage() {
  usePageTitle("Sponsors")
  const [tab, setTab] = useState("campaigns")
  const [campaigns, setCampaigns] = useState<SponsorCampaign[]>(() => loadPersistedSponsors())
  const [campForm, setCampForm] = useState({ company: "", title: "", budget: "", category: "" })

  const handleClearSponsors = () => {
    setCampaigns(clearSponsors())
  }

  const handleCreateCampaign = () => {
    const newCampaign: SponsorCampaign = {
      id: `user-${Date.now()}`,
      companyName: campForm.company || campForm.title || "Mi Campaña",
      campaignName: campForm.title || "Campaña personalizada",
      tagline: "Campaña creada por usuario",
      details: `Presupuesto: $${parseInt(campForm.budget) || 100}`,
      logo: campForm.company?.charAt(0).toUpperCase() || "M",
      image: "",
      targetCategory: campForm.category || "General",
      targetAudience: "Audiencia general",
      countries: ["CU"],
      languages: ["es"],
      budget: parseInt(campForm.budget) || 100,
      spent: 0,
      duration: "30 días",
      ctaText: "Contactar",
      impressions: 0,
      clicks: 0,
      conversions: 0,
      status: "Activa"
    }
    const updated = [...campaigns, newCampaign]
    setCampaigns(updated)
    saveSponsors(updated)
    setCampForm({ company: "", title: "", budget: "", category: "" })
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Sponsors</h1>
            <p className="text-xs text-slate-400">Panel de patrocinadores y campañas</p>
          </div>
        </div>

        <nav className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {[
            { id: "campaigns", label: "Campañas", icon: Target },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "create", label: "Crear Campaña", icon: Plus },
            { id: "billing", label: "Facturación", icon: DollarSign },
          ].map((t) => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  tab === t.id
                    ? "bg-gradient-to-r from-[#00D9FF]/15 to-blue-600/10 text-[#00D9FF] border border-[#00D9FF]/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                }`}>
                <Icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            )
          })}
        </nav>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(() => {
            const totalBudget = campaigns.reduce((acc, c) => acc + c.budget, 0)
            const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0)
            const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0)
            const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(1) : "0.0"
            const stats = [
              { label: "Campañas Activas", value: campaigns.length.toString(), icon: Target, color: "text-[#00D9FF]" },
              { label: "Total Invertido", value: `$${totalBudget.toLocaleString()}`, icon: DollarSign, color: "text-emerald-400" },
              { label: "Impresiones Totales", value: totalImpressions.toLocaleString(), icon: Eye, color: "text-purple-400" },
              { label: "CTR Promedio", value: `${avgCtr}%`, icon: TrendingUp, color: "text-amber-400" },
            ]
            return stats.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="p-4 rounded-2xl glass">
                  <Icon className={`w-5 h-5 ${s.color} mb-2`} />
                  <p className="text-xl font-black">{s.value}</p>
                  <p className="text-[10px] text-slate-400">{s.label}</p>
                </div>
              )
            })
          })()}
        </div>

        {tab === "campaigns" && (
          <div className="space-y-3">
            <div className="flex justify-end mb-2">
              <button onClick={handleClearSponsors}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10">
                <Trash2 className="w-3.5 h-3.5" /> Limpiar Sponsors
              </button>
            </div>
            {campaigns.map((c, i) => (
              <div key={i} className="p-5 rounded-2xl glass hover:bg-[#0B1220]/80 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-sm font-black">{c.logo}</div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{c.companyName}</h3>
                      <p className="text-[9px] text-slate-500">{c.tagline}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{c.status}</span>
                </div>
                <div className="text-xs text-zinc-500 mb-2">{c.details}</div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div><p className="text-xs font-bold text-[#00D9FF]">${c.budget.toLocaleString()}</p><p className="text-[8px] text-slate-500">Presupuesto</p></div>
                  <div><p className="text-xs font-bold text-amber-400">{c.impressions.toLocaleString()}</p><p className="text-[8px] text-slate-500">Impresiones</p></div>
                  <div><p className="text-xs font-bold text-emerald-400">{c.clicks.toLocaleString()}</p><p className="text-[8px] text-slate-500">Clics</p></div>
                </div>
                <div className="flex justify-between text-[9px] text-zinc-600 mt-2">
                  <span>{c.targetCategory} · {c.targetAudience}</span>
                  <span>{c.ctaText}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "analytics" && (
          <div className="p-8 rounded-2xl glass text-center">
            <BarChart3 className="w-10 h-10 text-[#00D9FF] mx-auto mb-3" />
            <h2 className="text-lg font-bold mb-1">Analytics de Campañas</h2>
            <p className="text-xs text-slate-400">Dashboard analítico detallado con gráficos de rendimiento por campaña, segmentación por audiencia y optimización de presupuesto.</p>
          </div>
        )}

        {tab === "create" && (
          <div className="p-8 rounded-2xl glass">
            <h2 className="text-lg font-bold mb-4">Crear Nueva Campaña</h2>
              <div className="space-y-4 max-w-lg">
                {[["company", "Nombre de la Empresa"], ["title", "Título de Campaña"], ["budget", "Presupuesto ($)"], ["category", "Categoría"]].map(([key, label]) => (
                  <div key={key}>
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">{label}</label>
                    <input type="text" placeholder={label}
                      value={(campForm as Record<string, string>)[key]}
                      onChange={e => setCampForm({ ...campForm, [key]: e.target.value })}
                      className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00D9FF] outline-none" />
                  </div>
                ))}
                <button onClick={handleCreateCampaign}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-blue-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Crear Campaña con Stripe
                </button>
              </div>
          </div>
        )}

        {tab === "billing" && (
          <div className="p-8 rounded-2xl glass">
            <h2 className="text-lg font-bold mb-4">Facturación</h2>
            <p className="text-xs text-slate-400">Historial de pagos, facturas y configuración de métodos de pago procesados a través de Stripe.</p>
          </div>
        )}
      </div>
    </div>
  )
}

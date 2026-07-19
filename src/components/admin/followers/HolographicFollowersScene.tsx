'use client'

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Diamond, Globe, RefreshCw, Eye, TrendingUp, Target, AlertTriangle, X, Map, Megaphone, Download, Sparkles, Bot, ChevronDown } from "lucide-react"
import PlatformNode from "./PlatformNode"
import GrowthTimeline from "./GrowthTimeline"
import WorldFollowerMap from "./WorldFollowerMap"
import TargetProjection from "./TargetProjection"
import FollowersOrbit from "./FollowersOrbit"
import type { FollowersDashboard, SocialMetricSnapshot, AudienceSegment, GrowthTarget, DisplayMode, AlertEvent, Platform, SocialCampaign } from "@/lib/followers/types"
import { PLATFORMS } from "@/lib/followers/types"
import {
  getAccounts, getCampaigns, getTargets, getSegments, getAlerts, addAlert,
  getDisplayMode, saveDisplayMode, generateDashboardData, saveTargets,
} from "@/lib/followers/storage"

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

function generateElianaExplanation(alert: AlertEvent): string {
  const explanations: Record<string, string> = {
    GROWTH_SPIKE: 'Detecté un aumento inusual en la velocidad de crecimiento. Puede estar relacionado con una campaña activa, contenido viral o una mención de un perfil influyente.',
    SHARP_DROP: 'Registré una disminución significativa de seguidores. Esto puede deberse a una limpieza de cuentas inactivas por parte de la plataforma, un cambio de algoritmo o un evento de comunicación negativo.',
    SYNC_FAILED: 'No pude conectar con la API de la plataforma. El token puede haber expirado o la plataforma puede estar temporalmente no disponible.',
    TOKEN_EXPIRED: 'El token de acceso ha expirado. Necesitas renovar la autenticación para que pueda seguir obteniendo datos.',
    CAMPAIGN_MILESTONE: 'Una campaña ha alcanzado un hito importante. Revisa las métricas para entender qué está funcionando.',
    TARGET_ACHIEVED: '¡Meta alcanzada! El crecimiento ha cumplido el objetivo establecido. Puedes establecer una nueva meta más ambiciosa.',
    DATA_ANOMALY: 'Los datos de esta sincronización no coinciden con el patrón esperado. Sugiero revisar la fuente de datos antes de tomar decisiones.',
    PLATFORM_DISCONNECTED: 'La plataforma se ha desconectado. Esto puede afectar la precisión de tus estadísticas totales.',
  }
  return explanations[alert.type] || 'Revisa los datos recientes para entender qué cambió. Puede estar relacionado con campañas, contenido o cambios en la plataforma.'
}

export default function HolographicFollowersScene() {
  const [dashboard, setDashboard] = useState<FollowersDashboard>(() => generateDashboardData())
  const [accounts] = useState(() => getAccounts())
  const [segments, setSegments] = useState<AudienceSegment[]>(() => getSegments())
  const [targets, setTargets] = useState<GrowthTarget[]>(() => getTargets())
  const [campaigns, setCampaigns] = useState<SocialCampaign[]>(() => getCampaigns())
  const [alerts, setAlerts] = useState<AlertEvent[]>(() => getAlerts())
  const [mode, setMode] = useState<DisplayMode>(() => getDisplayMode())
  const [selectedPlatform, setSelectedPlatform] = useState<SocialMetricSnapshot | null>(null)
  const [expandedView, setExpandedView] = useState<'dashboard' | 'platforms' | 'map' | 'growth' | 'campaigns' | 'goals' | 'universo'>('dashboard')
  const [showNewGoal, setShowNewGoal] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  const [holographicMode, setHolographicMode] = useState(true)
  const [particlesEnabled, setParticlesEnabled] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [newGoal, setNewGoal] = useState({ platform: 'all' as Platform | 'all', targetFollowers: 10000, targetDate: '' })
  const [exporting, setExporting] = useState(false)
  const [elianaExplanation, setElianaExplanation] = useState<string | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null)
  const prefersReduced = useRef(false)

  useEffect(() => {
    setMounted(true)
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced.current) setParticlesEnabled(false)
  }, [])

  const refresh = () => {
    setDashboard(generateDashboardData())
    setAlerts(getAlerts())
    setSegments(getSegments())
    setTargets(getTargets())
    setCampaigns(getCampaigns())
  }

  const handleModeChange = (newMode: DisplayMode) => {
    setMode(newMode)
    saveDisplayMode(newMode)
    setDashboard(prev => ({ ...prev, displayMode: newMode }))
    if (newMode === 'UNIVERSO') setExpandedView('universo')
  }

  const handleAddGoal = () => {
    const id = `goal-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const target: GrowthTarget = {
      id, platform: newGoal.platform, targetFollowers: newGoal.targetFollowers,
      startDate: new Date().toISOString(), targetDate: new Date(newGoal.targetDate).toISOString(),
      currentFollowers: dashboard.totalFollowers, status: 'ACTIVE', createdBy: 'OWNER_SUPERADMIN',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }
    const current = getTargets()
    current.push(target)
    saveTargets(current)
    setTargets(current)
    setShowNewGoal(false)
    setNewGoal({ platform: 'all' as const, targetFollowers: 10000, targetDate: '' })
    addAlert({ id: `alert-${Date.now()}`, type: 'TARGET_ACHIEVED', severity: 'info', platform: 'zafiro', message: 'Nueva meta creada', detail: `Meta de ${newGoal.targetFollowers.toLocaleString()} seguidores`, detectedAt: new Date().toISOString(), acknowledged: false })
    setAlerts(getAlerts())
  }

  const handleExport = () => {
    setExporting(true)
    const rows = [
      ['Métrica', 'Valor', 'Fuente'],
      ['Seguidores totales', dashboard.totalFollowers.toString(), mode === 'REAL' ? 'DATO VERIFICADO' : mode],
      ['Crecimiento mensual', dashboard.followersThisMonth.toString(), 'DATO VERIFICADO'],
      ['Crecimiento %', `${dashboard.monthlyGrowthPercent}%`, 'DATO VERIFICADO'],
      ['Alcance', dashboard.reach.toString(), 'DATO VERIFICADO'],
      ['Impresiones', dashboard.impressions.toString(), 'DATO VERIFICADO'],
      ['Interacciones', dashboard.engagements.toString(), 'DATO VERIFICADO'],
      ['Registros', dashboard.registrations.toString(), 'DATO VERIFICADO'],
      ['Usuarios activos', dashboard.activeUsers.toString(), 'DATO VERIFICADO'],
      ['Plataforma líder', dashboard.topPlatform.platform, 'DATO VERIFICADO'],
      ['País principal', dashboard.topCountry.country, 'DATO VERIFICADO'],
      ['Ciudad principal', dashboard.topCity.city, 'DATO VERIFICADO'],
      ['Última actualización', dashboard.lastUpdated, '—'],
    ]
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `zafiro-followers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click(); URL.revokeObjectURL(url)
    setTimeout(() => setExporting(false), 1000)
  }

  const askEliana = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId)
    if (!alert) return
    setSelectedAlert(alertId)
    setElianaExplanation(generateElianaExplanation(alert))
  }

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: 1 + Math.random() * 2, delay: Math.random() * 5, duration: 3 + Math.random() * 5,
  }))

  if (!mounted) return null

  return (
    <div className="relative min-h-screen bg-[#050816] overflow-hidden">
      {/* Fondo holográfico */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050816] via-[#0A1628] to-[#050816]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-[100px]" />
        {particlesEnabled && !prefersReduced.current && particles.map(p => (
          <motion.div key={p.id} className="absolute rounded-full bg-[#00D9FF]/20"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size * 2, height: p.size * 2 }}
            animate={{ y: [0, -30, 0], opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }} />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00D9FF] to-violet-600 flex items-center justify-center shadow-lg shadow-[#00D9FF]/20">
                <Diamond className="w-6 h-6 text-white" />
              </div>
              {!prefersReduced.current && (
                <motion.div className="absolute -inset-1 rounded-2xl border border-[#00D9FF]/20" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 3, repeat: Infinity }} />
              )}
            </div>
            <div>
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                ZAFIRO FOLLOWERS UNIVERSE <Diamond className="w-4 h-4 text-[#00D9FF]" />
              </h1>
              <p className="text-[10px] text-slate-500">Panel holográfico de seguidores — Tiempo real</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAlerts(!showAlerts)}
              className="relative p-2 rounded-xl bg-slate-900/60 border border-slate-800/60 text-slate-400 hover:text-white transition-all">
              <AlertTriangle className="w-4 h-4" />
              {alerts.filter(a => !a.acknowledged).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[8px] font-bold text-white flex items-center justify-center">
                  {alerts.filter(a => !a.acknowledged).length}
                </span>
              )}
            </button>
            <button onClick={refresh} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60 text-slate-400 hover:text-white transition-all">
              <RefreshCw className="w-4 h-4" /> ACTUALIZAR DATOS
            </button>
          </div>
        </div>

        {/* Selector de modo */}
        <div className="flex gap-1 mb-6 p-1 rounded-2xl bg-slate-900/60 max-w-lg">
          {(['REAL', 'PROYECCION', 'META', 'UNIVERSO'] as DisplayMode[]).map(m => (
            <button key={m} onClick={() => handleModeChange(m)}
              className={`flex-1 py-2 px-3 rounded-xl text-[10px] font-medium transition-all ${mode === m ? 'bg-gradient-to-r from-[#00D9FF]/15 to-violet-600/10 text-[#00D9FF] border border-[#00D9FF]/20' : 'text-slate-500 hover:text-white'}`}>
              {m === 'REAL' ? 'REAL' : m === 'PROYECCION' ? 'PROYECCIÓN' : m === 'META' ? 'META' : 'UNIVERSO'}
            </button>
          ))}
        </div>

        {/* Botones de acción rápida */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setExpandedView('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-medium transition-all ${expandedView === 'dashboard' ? 'bg-slate-800 text-white' : 'bg-slate-900/40 text-slate-400 hover:text-white border border-slate-800/60'}`}>
            <Eye className="w-3 h-3" /> PANEL CENTRAL
          </button>
          <button onClick={() => setExpandedView('platforms')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-medium transition-all ${expandedView === 'platforms' ? 'bg-slate-800 text-white' : 'bg-slate-900/40 text-slate-400 hover:text-white border border-slate-800/60'}`}>
            <Globe className="w-3 h-3" /> VER POR PLATAFORMA
          </button>
          <button onClick={() => setExpandedView('map')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-medium transition-all ${expandedView === 'map' ? 'bg-slate-800 text-white' : 'bg-slate-900/40 text-slate-400 hover:text-white border border-slate-800/60'}`}>
            <Map className="w-3 h-3" /> VER MAPA
          </button>
          <button onClick={() => setExpandedView('growth')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-medium transition-all ${expandedView === 'growth' ? 'bg-slate-800 text-white' : 'bg-slate-900/40 text-slate-400 hover:text-white border border-slate-800/60'}`}>
            <TrendingUp className="w-3 h-3" /> VER CRECIMIENTO
          </button>
          <button onClick={() => setExpandedView('campaigns')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-medium transition-all ${expandedView === 'campaigns' ? 'bg-slate-800 text-white' : 'bg-slate-900/40 text-slate-400 hover:text-white border border-slate-800/60'}`}>
            <Megaphone className="w-3 h-3" /> VER CAMPAÑAS
          </button>
          <button onClick={() => setShowNewGoal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-medium bg-[#00D9FF]/10 text-[#00D9FF] hover:bg-[#00D9FF]/20 border border-[#00D9FF]/20 transition-all">
            <Target className="w-3 h-3" /> CREAR META
          </button>
          <button onClick={handleExport} disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-medium bg-slate-900/40 text-slate-400 hover:text-white border border-slate-800/60 transition-all">
            <Download className="w-3 h-3" /> {exporting ? 'EXPORTANDO...' : 'EXPORTAR REPORTE'}
          </button>
          <button onClick={() => setHolographicMode(!holographicMode)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-medium transition-all ${holographicMode ? 'bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20' : 'bg-slate-900/40 text-slate-400 hover:text-white border border-slate-800/60'}`}>
            <Sparkles className="w-3 h-3" /> {holographicMode ? 'MODO HOLOGRÁFICO: ON' : 'MODO HOLOGRÁFICO: OFF'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* PANEL CENTRAL */}
          {expandedView === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className={`relative p-8 rounded-2xl ${holographicMode ? 'glass' : 'bg-slate-900/80'} text-center overflow-hidden`}>
                    {holographicMode && !prefersReduced.current && (
                      <motion.div className="absolute -inset-16 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,217,255,0.05) 0%, transparent 60%)' }}
                        animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} />
                    )}
                    <div className="relative">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Diamond className="w-5 h-5 text-[#00D9FF]" />
                        <span className="text-xs text-slate-500 uppercase tracking-widest">
                          {mode === 'REAL' ? 'SEGUIDORES TOTALES VERIFICADOS' : mode === 'PROYECCION' ? 'PROYECCIÓN DE SEGUIDORES' : mode === 'META' ? 'META DE SEGUIDORES' : 'UNIVERSO DE SEGUIDORES'}
                        </span>
                      </div>
                      <p className="text-5xl md:text-7xl font-black text-white mt-2 tracking-tight">{formatCount(dashboard.totalFollowers)}</p>
                      <div className="flex items-center justify-center gap-4 mt-3">
                        <span className="text-sm text-emerald-400 font-medium">+{dashboard.followersThisMonth.toLocaleString()} este mes</span>
                        <span className={`text-sm font-medium ${dashboard.monthlyGrowthPercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {dashboard.monthlyGrowthPercent >= 0 ? '+' : ''}{dashboard.monthlyGrowthPercent}%
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-3 mt-2">
                        {mode === 'REAL' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">DATO VERIFICADO</span>}
                        {mode === 'PROYECCION' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">PROYECCIÓN</span>}
                        {mode === 'META' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400">META</span>}
                        <span className="text-[10px] text-slate-600">Actualizado {new Date(dashboard.lastUpdated).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Métricas de impacto */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {[
                      { label: 'Alcance total', value: dashboard.reach, color: 'text-[#00D9FF]' },
                      { label: 'Impresiones', value: dashboard.impressions, color: 'text-violet-400' },
                      { label: 'Interacciones', value: dashboard.engagements, color: 'text-emerald-400' },
                      { label: 'Registros', value: dashboard.registrations, color: 'text-amber-400' },
                    ].map((stat, i) => (
                      <div key={i} className={`p-4 rounded-xl ${holographicMode ? 'glass' : 'bg-slate-900/80'} text-center`}>
                        <p className="text-xl font-black text-white">{formatCount(stat.value)}</p>
                        <p className="text-[10px] text-slate-500">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Info Owner */}
                  <div className={`p-4 rounded-2xl ${holographicMode ? 'glass' : 'bg-slate-900/80'} mt-4`}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div><span className="text-slate-500">Rol</span><p className="text-[#00D9FF] font-medium">OWNER_SUPERADMIN</p></div>
                      <div><span className="text-slate-500">Membresía</span><p className="text-emerald-400 font-medium">LIFETIME_UNLIMITED</p></div>
                      <div><span className="text-slate-500">Plataforma líder</span><p className="text-white font-medium">{dashboard.topPlatform.platform} ({formatCount(dashboard.topPlatform.followers)})</p></div>
                      <div><span className="text-slate-500">Tendencia</span><p className={dashboard.trend === 'up' ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>{dashboard.trend === 'up' ? '↑ CRECIENDO' : '↓ DECLINANDO'}</p></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <GrowthTimeline dashboard={dashboard} />
                  <div className={`p-4 rounded-2xl ${holographicMode ? 'glass' : 'bg-slate-900/80'}`}>
                    <h3 className="text-xs font-bold text-white mb-3">Fuente de tráfico</h3>
                    {dashboard.topTrafficSource ? (
                      <div>
                        <p className="text-lg font-black text-white">{dashboard.topTrafficSource.name}</p>
                        <p className="text-xs text-slate-500">{dashboard.topTrafficSource.visits.toLocaleString()} visitas ({dashboard.topTrafficSource.percentage}%)</p>
                        <span className={`text-[10px] ${dashboard.topTrafficSource.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {dashboard.topTrafficSource.trend === 'up' ? '↑ Subiendo' : '↓ Bajando'}
                        </span>
                      </div>
                    ) : <p className="text-xs text-slate-500">Sin datos</p>}
                  </div>
                  <div className={`p-4 rounded-2xl ${holographicMode ? 'glass' : 'bg-slate-900/80'}`}>
                    <h3 className="text-xs font-bold text-white mb-3">País & Ciudad principal</h3>
                    <p className="text-lg font-black text-white">{dashboard.topCountry.country}</p>
                    <p className="text-xs text-slate-500">{dashboard.topCity.city} — {dashboard.topCountry.followers.toLocaleString()} seguidores</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PLATAFORMAS */}
          {expandedView === 'platforms' && (
            <motion.div key="platforms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboard.platforms.map(metric => (
                  <PlatformNode key={metric.id} metric={metric} active={selectedPlatform?.id === metric.id}
                    onClick={() => setSelectedPlatform(metric.id === selectedPlatform?.id ? null : metric)} />
                ))}
              </div>
            </motion.div>
          )}

          {/* MAPA MUNDIAL */}
          {expandedView === 'map' && (
            <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WorldFollowerMap segments={segments} />
                <div className={`p-5 rounded-2xl ${holographicMode ? 'glass' : 'bg-slate-900/80'}`}>
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Map className="w-4 h-4 text-[#00D9FF]" /> Concentración por país</h3>
                  <div className="space-y-1 text-xs text-slate-400">
                    <p>Los datos muestran concentración en {segments.length} países.</p>
                    <p className="mt-2">Los seguidores se agregan por país, plataforma y campaña.</p>
                    <p className="mt-2 text-slate-500">No se renderizan nodos individuales cuando la cantidad es enorme.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CRECIMIENTO */}
          {expandedView === 'growth' && (
            <motion.div key="growth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GrowthTimeline dashboard={dashboard} />
                <WorldFollowerMap segments={segments} />
              </div>
            </motion.div>
          )}

          {/* CAMPAÑAS */}
          {expandedView === 'campaigns' && (
            <motion.div key="campaigns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-5 rounded-2xl ${holographicMode ? 'glass' : 'bg-slate-900/80'}`}>
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Megaphone className="w-4 h-4 text-[#00D9FF]" /> Campañas</h3>
                  {campaigns.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No hay campañas activas</p>
                  ) : (
                    <div className="space-y-3">
                      {campaigns.map(c => (
                        <div key={c.id} className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-white">{c.name}</p>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full ${c.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : c.status === 'ENDED' ? 'bg-slate-800 text-slate-500' : 'bg-amber-500/10 text-amber-400'}`}>{c.status}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-[10px]">
                            <div><span className="text-slate-500">Alcance:</span> <span className="text-white">{c.reach.toLocaleString()}</span></div>
                            <div><span className="text-slate-500">Clics:</span> <span className="text-white">{c.clicks.toLocaleString()}</span></div>
                            <div><span className="text-slate-500">Conv.:</span> <span className="text-white">{c.conversionRate}%</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {dashboard.topCampaign && (
                    <div className="mt-3 pt-3 border-t border-slate-800/60">
                      <p className="text-[10px] text-slate-500">Campaña con mayor conversión: <strong className="text-[#00D9FF]">{dashboard.topCampaign.name}</strong></p>
                    </div>
                  )}
                </div>
                <div className={`p-5 rounded-2xl ${holographicMode ? 'glass' : 'bg-slate-900/80'}`}>
                  <h3 className="text-sm font-bold text-white mb-4">Resumen de tráfico</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between"><span className="text-slate-500">Tráfico hacia ZAFIRO</span><span className="text-white font-medium">{dashboard.topTrafficSource?.visits.toLocaleString() || '—'} visitas</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Registros creados</span><span className="text-white font-medium">{dashboard.registrations.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Usuarios activos</span><span className="text-white font-medium">{dashboard.activeUsers.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Fuente principal</span><span className="text-white font-medium">{dashboard.topTrafficSource?.name || '—'}</span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* METAS */}
          {expandedView === 'goals' && (
            <motion.div key="goals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TargetProjection targets={targets} totalFollowers={dashboard.totalFollowers} onAddTarget={() => setShowNewGoal(true)} />
                <div className={`p-5 rounded-2xl ${holographicMode ? 'glass' : 'bg-slate-900/80'}`}>
                  <h3 className="text-sm font-bold text-white mb-4">Ritmo necesario</h3>
                  {targets.filter(t => t.status === 'ACTIVE').length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">Crea una meta para ver el ritmo necesario</p>
                  ) : (
                    targets.filter(t => t.status === 'ACTIVE').slice(0, 3).map(t => {
                      const start = new Date(t.startDate).getTime()
                      const end = new Date(t.targetDate).getTime()
                      const now = Date.now()
                      const totalDays = (end - start) / 86400000
                      const remainingDays = (end - now) / 86400000
                      const neededPerDay = remainingDays > 0 ? Math.round((t.targetFollowers - t.currentFollowers) / remainingDays) : 0
                      const progress = t.targetFollowers > 0 ? Math.min(100, Math.round((t.currentFollowers / t.targetFollowers) * 100)) : 0
                      return (
                        <div key={t.id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 mb-3">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-slate-300">{t.platform === 'all' ? 'Todas las plataformas' : t.platform}</span>
                            <span className="text-emerald-400 font-medium">{progress}%</span>
                          </div>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-slate-500">ACTUAL: {t.currentFollowers.toLocaleString()}</span>
                            <span className="text-[#00D9FF]">META: {t.targetFollowers.toLocaleString()}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-800 overflow-hidden mb-2">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                              className="h-full rounded-full bg-gradient-to-r from-[#00D9FF] to-violet-500" />
                          </div>
                          {remainingDays > 0 && <p className="text-[10px] text-amber-400">Ritmo necesario: {neededPerDay.toLocaleString()} seguidores/día</p>}
                          {remainingDays <= 0 && <p className="text-[10px] text-red-400">Fecha límite alcanzada</p>}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* MODO UNIVERSO — Órbita holográfica */}
          {expandedView === 'universo' && (
            <motion.div key="universo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col items-center">
                <FollowersOrbit
                  platforms={dashboard.platforms}
                  totalFollowers={dashboard.totalFollowers}
                  totalVerified={dashboard.totalVerified}
                  reduced={prefersReduced.current}
                  onSelectPlatform={(p) => {
                    const metric = dashboard.platforms.find(m => m.platform === p)
                    if (metric) setSelectedPlatform(metric)
                    setExpandedView('platforms')
                  }}
                />
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">Agregado por plataforma y país</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <span className="text-[10px] text-slate-500">{dashboard.platforms.filter(p => p.label !== 'NO CONECTADO').length} plataformas conectadas</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <span className="text-[10px] text-slate-500">{segments.length} países</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PANEL DE ALERTAS CON ELIANA */}
        <AnimatePresence>
          {showAlerts && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 w-[420px] max-w-[calc(100vw-2rem)] z-50">
              <div className={`p-4 rounded-2xl ${holographicMode ? 'glass' : 'bg-slate-900/95'} border border-slate-700/60 max-h-[70vh] overflow-y-auto`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">Alertas</h3>
                  <button onClick={() => { setShowAlerts(false); setElianaExplanation(null) }} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">No hay alertas activas</p>
                ) : (
                  <div className="space-y-2">
                    {alerts.slice(0, 15).map(alert => (
                      <div key={alert.id} className={`p-3 rounded-xl text-xs ${
                        alert.severity === 'critical' ? 'bg-red-500/10 border border-red-500/20' :
                        alert.severity === 'warning' ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-slate-800/40'
                      }`}>
                        <div className="flex items-start gap-2">
                          <AlertTriangle className={`w-3 h-3 mt-0.5 shrink-0 ${alert.severity === 'critical' ? 'text-red-400' : alert.severity === 'warning' ? 'text-amber-400' : 'text-[#00D9FF]'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-300 font-medium">{alert.message}</p>
                            <p className="text-slate-500 mt-0.5">{alert.detail}</p>
                            <p className="text-[9px] text-slate-600 mt-1">{new Date(alert.detectedAt).toLocaleString('es-ES')}</p>

                            {/* Botón preguntar a ELIANA */}
                            <button onClick={() => askEliana(alert.id)}
                              className="flex items-center gap-1 mt-1.5 text-[9px] text-[#00D9FF] hover:text-white transition-colors">
                              <Bot className="w-3 h-3" /> Preguntar a ELIANA
                            </button>

                            {/* Explicación de ELIANA */}
                            {elianaExplanation && selectedAlert === alert.id && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 p-2 rounded-lg bg-[#00D9FF]/5 border border-[#00D9FF]/10">
                                <div className="flex items-start gap-1.5">
                                  <Bot className="w-3 h-3 text-[#00D9FF] mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-[10px] text-[#00D9FF] font-medium mb-0.5">ELIANA:</p>
                                    <p className="text-[10px] text-slate-400">{elianaExplanation}</p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL NUEVA META */}
        <AnimatePresence>
          {showNewGoal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowNewGoal(false)}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="w-full max-w-md p-6 rounded-2xl glass" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">Crear Meta</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Plataforma</label>
                    <select value={newGoal.platform} onChange={e => setNewGoal(p => ({ ...p, platform: e.target.value as Platform | 'all' }))}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#00D9FF]/50">
                      <option value="all" className="bg-[#050816]">Todas las plataformas</option>
                      {PLATFORMS.map(p => <option key={p.id} value={p.id} className="bg-[#050816]">{p.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Meta de seguidores</label>
                    <input type="number" value={newGoal.targetFollowers} onChange={e => setNewGoal(p => ({ ...p, targetFollowers: Math.max(1, Number(e.target.value)) }))}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#00D9FF]/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Fecha límite</label>
                    <input type="date" value={newGoal.targetDate} onChange={e => setNewGoal(p => ({ ...p, targetDate: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#00D9FF]/50" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddGoal} disabled={!newGoal.targetDate}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-blue-600 text-white text-sm font-medium disabled:opacity-50 transition-all">CREAR META</button>
                    <button onClick={() => setShowNewGoal(false)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-sm transition-all">CANCELAR</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

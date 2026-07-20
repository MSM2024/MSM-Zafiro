'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import {
  getIdentityStats, getProfileByAuthId, bootstrapOwnerProfile, getProfiles,
  getKycCases, getBusinessProfiles, getAdminActions, getEvents,
} from "@/lib/identity"
import { isOwnerEmail } from "@/lib/owner"
import CrossPillarStatsWidget from "@/components/CrossPillarStatsWidget"
import {
  APP_VERSION, BUILD_ID, COMMIT_SHA, FULL_VERSION,
} from "@/lib/build-info"
import {
  Shield, Users, BarChart3, Activity, AlertTriangle,
  UserCheck, TrendingUp, Cpu, CheckCircle, Clock,
  Fingerprint, Building2, Crown, Siren, ScrollText, Database,
  ArrowLeft, Info, ShoppingCart, BookOpen, ExternalLink, HardDrive,
} from "lucide-react"

export default function AdminPage() {
  usePageTitle("Panel Administrativo — ZAFIRO")
  const router = useRouter()
  const [session, setSession] = useState(() => getSession())
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [adminActions, setAdminActions] = useState<any[]>([])
  const [tab, setTab] = useState("dashboard")
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [refreshing, setRefreshing] = useState(false)

  function loadData() {
    const identityStats = getIdentityStats()
    setStats(identityStats)
    setEvents(getEvents().slice(0, 20))
    setAdminActions(getAdminActions().slice(0, 20))
    setLastRefresh(new Date())
  }

  function handleRefresh() {
    setRefreshing(true)
    loadData()
    setTimeout(() => setRefreshing(false), 400)
  }

  useEffect(() => {
    const s = getSession()
    setSession(s)
    if (!s) { router.replace("/auth/login"); return }

    const isOwner = isOwnerEmail(s.email)
    if (!isOwner) { setAuthorized(false); return }
    setAuthorized(true)

    const p = bootstrapOwnerProfile() || getProfileByAuthId(s.id)
    setProfile(p)

    loadData()
  }, [router])

  if (authorized === false) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-lg font-bold mb-2">Acceso Denegado</h1>
          <p className="text-xs text-slate-400 mb-4">No tienes permisos administrativos. Esta &aacute;rea es solo para el OWNER del sistema.</p>
          <Link href="/" className="text-[#00D9FF] text-sm">Volver a ZAFIRO</Link>
        </div>
      </div>
    )
  }

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#00D9FF] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-xs text-slate-400">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  const identityStats = stats
  const v2Profiles = getProfiles()
  const kycCases = getKycCases()
  const businesses = getBusinessProfiles()

  const now = new Date().toISOString()
  const todayStr = now.slice(0, 10)
  const todayProfiles = v2Profiles.filter(p => p.createdAt?.startsWith(todayStr))
  const incompleteRegistrations = v2Profiles.filter(p => p.verificationStatus === 'NOT_STARTED' || p.verificationStatus === 'IN_PROGRESS')

  const metrics = [
    { label: "Usuarios Totales", value: identityStats?.totalUsers ?? 0, icon: Users, color: "text-[#00D9FF]", source: "getIdentityStats()" },
    { label: "Perfiles Creados Hoy", value: todayProfiles.length, icon: UserCheck, color: "text-emerald-400", source: "localStorage" },
    { label: "Registros Incompletos", value: incompleteRegistrations.length, icon: AlertTriangle, color: "text-amber-400", source: "localStorage" },
    { label: "VIP", value: identityStats ? identityStats.vip + identityStats.entrepreneurVip : 0, icon: Crown, color: "text-amber-400", source: "getIdentityStats()" },
    { label: "KYC Aprobados", value: identityStats?.kycApproved ?? 0, icon: CheckCircle, color: "text-emerald-400", source: "getIdentityStats()" },
    { label: "KYC Pendientes", value: identityStats?.kycPending ?? 0, icon: Clock, color: "text-amber-400", source: "getIdentityStats()" },
    { label: "Negocios (KYB)", value: businesses.length, icon: Building2, color: "text-indigo-400", source: "localStorage" },
    { label: "Alto Riesgo", value: identityStats?.highRisk ?? 0, icon: Siren, color: "text-red-400", source: "getIdentityStats()" },
  ]

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-slate-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Panel Administrativo</h1>
              <p className="text-[10px] font-mono text-slate-500">Acceso exclusivo OWNER_SUPERADMIN</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <p className="text-[8px] text-slate-600">Actualizado: {lastRefresh.toLocaleString('es-ES')}</p>
            <button onClick={handleRefresh} disabled={refreshing}
              className="px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-[9px] text-slate-400 hover:text-white disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1">
              {refreshing ? (
                <div className="w-3 h-3 rounded-full border border-slate-400 border-t-transparent animate-spin" />
              ) : 'Refrescar'}
            </button>
          </div>
        </div>

        {/* Nav tabs */}
        <nav className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "usuarios", label: "Usuarios", icon: Users, href: "/admin/usuarios" },
            { id: "marketplace", label: "Marketplace", icon: ShoppingCart, href: "/admin/marketplace" },
            { id: "editorial", label: "Editorial", icon: BookOpen, href: "/admin/editorial" },
            { id: "kyc", label: "KYC", icon: Fingerprint, href: "/admin/kyc" },
            { id: "kyb", label: "KYB", icon: Building2, href: "/admin/kyb" },
            { id: "riesgos", label: "Riesgos", icon: Siren, href: "/admin/riesgos" },
            { id: "auditoria", label: "Auditoria", icon: ScrollText, href: "/admin/auditoria" },
            { id: "dashboard360", label: "360", icon: Activity, href: "/admin/dashboard-360" },
            { id: "metricas", label: "Metricas", icon: TrendingUp, href: "/admin/metricas" },
            { id: "actividad", label: "Actividad", icon: ExternalLink, href: "/actividad" },
            { id: "exportar", label: "Exportar", icon: Database, href: "/admin/exportar" },
            { id: "datos", label: "Datos", icon: HardDrive, href: "/admin/datos" },
            { id: "sync", label: "Sync", icon: Clock, href: "/admin/sync" },
            { id: "diagnostico", label: "Diagnostico", icon: Cpu },
          ].map((t) => {
            const Icon = t.icon
            if (t.href) {
              return (
                <Link key={t.id} href={t.href}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all text-slate-400 hover:text-white hover:bg-slate-900/40">
                  <Icon className="w-3.5 h-3.5" /> {t.label}
                </Link>
              )
            }
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  tab === t.id ? "bg-gradient-to-r from-amber-400/15 to-amber-600/10 text-amber-400 border border-amber-400/20" : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                }`}>
                <Icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            )
          })}
        </nav>

        {/* ======= DASHBOARD TAB ======= */}
        {tab === "dashboard" && (
          <div>
            {/* Metrics grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {metrics.map((m, i) => {
                const Icon = m.icon
                return (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
                    <Icon className={`w-4 h-4 ${m.color} mb-2`} />
                    <p className="text-xl font-black">{typeof m.value === 'number' ? m.value.toLocaleString() : m.value}</p>
                    <p className="text-[9px] text-slate-500">{m.label}</p>
                    <p className="text-[7px] text-slate-600 mt-1 font-mono">Fuente: {m.source}</p>
                  </div>
                )
              })}
            </div>

            {/* Cross-pillar stats */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-[#00D9FF] mb-3 flex items-center gap-2">Estado de los 5 Pilares</h3>
              <CrossPillarStatsWidget />
            </div>

            {/* Metrics without source */}
            <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-800/40 mb-6">
              <h3 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-2">
                <Info className="w-3 h-3" /> M&eacute;tricas sin fuente
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[10px] text-slate-500">
                <span>Usuarios activos: <span className="text-amber-400">DATOS NO DISPONIBLES</span></span>
                <span>Sesiones activas: <span className="text-amber-400">DATOS NO DISPONIBLES</span></span>
                <span>Altas por d&iacute;a: <span className="text-amber-400">DATOS NO DISPONIBLES</span></span>
                <span>Tiempo medio de carga: <span className="text-amber-400">DATOS NO DISPONIBLES</span></span>
                <span>Dispositivos/plataformas: <span className="text-amber-400">DATOS NO DISPONIBLES</span></span>
                <span>Estado de sincronizaci&oacute;n: <span className="text-amber-400">DATOS NO DISPONIBLES</span></span>
              </div>
              <p className="text-[8px] text-slate-600 mt-2">
                Integraci&oacute;n requerida: Supabase Auth para sesiones activas, Vercel Analytics para rendimiento, 
                backend de eventos para sincronizaci&oacute;n.
              </p>
            </div>

            {/* Recent events */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <Activity className="w-3 h-3 text-[#00D9FF]" /> Eventos recientes
              </h3>
              {events.length === 0 ? (
                <p className="text-[10px] text-slate-500">No hay eventos registrados.</p>
              ) : (
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {events.map((e, i) => (
                    <div key={e.id || i} className="flex items-center gap-2 text-[10px] text-slate-400 py-1 border-b border-slate-800/30 last:border-0">
                      <span className="text-slate-600 font-mono">{e.eventType}</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-slate-500">{new Date(e.createdAt).toLocaleString('es-ES')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======= DIAGNOSIS TAB ======= */}
        {tab === "diagnostico" && (
          <div>
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/60 mb-4">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" /> Diagn&oacute;stico del Sistema
              </h2>

              <div className="space-y-2 text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-40 shrink-0">APP_VERSION:</span>
                  <span className="text-white">{APP_VERSION}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-40 shrink-0">BUILD_ID:</span>
                  <span className="text-[#00D9FF]">{BUILD_ID}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-40 shrink-0">COMMIT_SHA:</span>
                  <span className="text-[#00D9FF]">{COMMIT_SHA}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-40 shrink-0">FULL_VERSION:</span>
                  <span className="text-white">{FULL_VERSION}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-40 shrink-0">ENTORNO:</span>
                  <span className="text-white">{typeof window !== 'undefined' ? (window.location.hostname === 'localhost' ? 'LOCAL' : 'PRODUCCION') : '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-40 shrink-0">USUARIO AUTENTICADO:</span>
                  <span className="text-emerald-400">{session?.email || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-40 shrink-0">UUID RESUELTO:</span>
                  <span className="text-emerald-400">{profile?.id || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-40 shrink-0">ROL:</span>
                  <span className="text-amber-400">{profile?.role || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-40 shrink-0">FUENTE DE DATOS:</span>
                  <span className="text-amber-400">localStorage (Supabase sin credenciales)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-40 shrink-0">ESTADO DE API:</span>
                  <span className="text-emerald-400">local</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-40 shrink-0">ESTADO DE BASE DE DATOS:</span>
                  <span className="text-amber-400">SIN CONEXION — localStorage</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-40 shrink-0">ESTADO DE CACHE:</span>
                  <span className="text-emerald-400">activo</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-40 shrink-0">ULTIMO ERROR:</span>
                  <span className="text-slate-500">—</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 w-40 shrink-0">ULTIMA SINCRONIZACION:</span>
                  <span className="text-slate-500">—</span>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <ScrollText className="w-3 h-3 text-amber-400" /> Acciones Administrativas
              </h3>
              {adminActions.length === 0 ? (
                <p className="text-[10px] text-slate-500">No hay acciones administrativas registradas.</p>
              ) : (
                <div className="space-y-2">
                  {adminActions.map((a, i) => (
                    <div key={a.id || i} className="text-[10px] text-slate-400 border-b border-slate-800/30 pb-1">
                      <span className="text-amber-400 font-bold">{a.actionType}</span> sobre {a.targetType} {a.targetId}
                      <span className="text-slate-600 ml-2">{new Date(a.createdAt).toLocaleString('es-ES')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security note */}
        <div className="mt-8 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-300 mb-1">Seguridad</p>
              <p className="text-[10px] text-amber-500/70">
                La autenticaci&oacute;n actual usa localStorage como fallback. Esto no es seguro para producci&oacute;n. 
                Supabase est&aacute; disponible pero sin credenciales configuradas. 
                El rol se determina por email del OWNER (<code className="text-amber-400 bg-amber-500/10 px-1 rounded">isOwnerEmail</code>). 
                No se exponen secretos ni tokens en el frontend. No hay MFA activo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

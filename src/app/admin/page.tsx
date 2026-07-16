'use client'

import Link from "next/link"
import { ArrowLeft, Shield, Users, FileText, BarChart3, Activity, Settings, AlertTriangle, MessageSquare, UserCheck, Eye, Ban, TrendingUp, Cpu, Zap, Bot, CheckCircle, Clock, RefreshCw, DollarSign, Star, Gem, Heart, Share2, Globe, BookOpen, Sparkles, Fingerprint, Building2, Search, Crown, FileSearch, Siren, ScrollText } from "lucide-react"
import { getIdentityStats } from "@/lib/identity"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"

export default function AdminPage() {
  usePageTitle("Automation Center — ZAFIRO")
  const router = useRouter()
  useEffect(() => {
    const session = getSession()
    if (!session || session.email !== "msmmystore@gmail.com") {
      router.replace("/")
    }
  }, [router])
  usePageTitle("Automation Center — ZAFIRO")
  const [tab, setTab] = useState("automation")

  const automationStats = [
    { label: "Conversaciones Automatizadas", value: "12,847", icon: MessageSquare, change: "+23%", color: "text-[#00D9FF]" },
    { label: "Casos Resueltos por ELIANA", value: "11,902", icon: Bot, change: "+31%", color: "text-emerald-400" },
    { label: "Casos Escalados a Humanos", value: "945", icon: Users, change: "-5%", color: "text-amber-400" },
    { label: "Tasa de Automatización", value: "92.6%", icon: Cpu, change: "+3.2%", color: "text-purple-400" },
    { label: "Alertas de Fraude", value: "38", icon: AlertTriangle, change: "-12%", color: "text-red-400" },
    { label: "Registros Automatizados", value: "4,210", icon: UserCheck, change: "+18%", color: "text-[#00D9FF]" },
    { label: "Membresías Pro Gestionadas", value: "892", icon: Star, change: "+15%", color: "text-amber-400" },
    { label: "PTS Distribuidos (este mes)", value: "284K", icon: Gem, change: "+22%", color: "text-[#00D9FF]" },
  ]

  const automationLog = [
    { id: "A001", type: "Registro", user: "carlos_medina", action: "Verificación de email completada", status: "Auto-resuelto", date: "hace 5min", eliana: true },
    { id: "A002", type: "Membresía", user: "maria_garcia", action: "Renovación Pro procesada con Stripe", status: "Auto-resuelto", date: "hace 12min", eliana: true },
    { id: "A003", type: "Sponsor", user: "farmasi_oficial", action: "Activación de campaña sponsor", status: "Auto-resuelto", date: "hace 28min", eliana: true },
    { id: "A004", type: "Reporte", user: "sistema", action: "Detección de spam en pregunta #3421", status: "Auto-resuelto", date: "hace 45min", eliana: true },
    { id: "A005", type: "Soporte", user: "juan_perez", action: "Solicitud de recuperación de cuenta", status: "Escalado", date: "hace 1h", eliana: false },
    { id: "A006", type: "Pago", user: "ana_lopez", action: "Disputa de cargo en Stripe", status: "Escalado", date: "hace 2h", eliana: false },
    { id: "A007", type: "Referido", user: "luis_torres", action: "Bonificación por referido acreditada", status: "Auto-resuelto", date: "hace 2h", eliana: true },
    { id: "A008", type: "Fraude", user: "sistema", action: "Múltiples cuentas detectadas — mismo IP", status: "Escalado", date: "hace 3h", eliana: false },
    { id: "A009", type: "Cuba Plus", user: "pedro_ramirez", action: "Activación de Cuba Plus con descuento referido", status: "Auto-resuelto", date: "hace 4h", eliana: true },
    { id: "A010", type: "Moderación", user: "sistema", action: "Contenido inapropiado eliminado automáticamente", status: "Auto-resuelto", date: "hace 5h", eliana: true },
  ]

  const fraudAlerts = [
    { id: "F001", severity: "Alta", detail: "Creación masiva de cuentas desde IP 192.168.x.x", status: "Bloqueado", date: "hace 1h" },
    { id: "F002", severity: "Media", detail: "Intento de canje de PTS desde cuenta sospechosa", status: "En revisión", date: "hace 3h" },
    { id: "F003", severity: "Alta", detail: "Suplantación de identidad detectada por ELIANA", status: "Investigando", date: "hace 6h" },
    { id: "F004", severity: "Baja", detail: "Enlace sospechoso en respuesta de nuevo usuario", status: "Auto-resuelto", date: "hace 8h" },
  ]

  const systemMetrics = [
    { name: "Tiempo de respuesta ELIANA", value: "1.2s", status: "Saludable", color: "text-emerald-400" },
    { name: "Precisión de detección de spam", value: "98.7%", status: "Excelente", color: "text-emerald-400" },
    { name: "Satisfacción de soporte automatizado", value: "4.8/5.0", status: "Excelente", color: "text-emerald-400" },
    { name: "Tiempo de activación de membresías", value: "15s", status: "Óptimo", color: "text-emerald-400" },
    { name: "Tasa de error en pagos Stripe", value: "0.3%", status: "Normal", color: "text-emerald-400" },
    { name: "Tiempo de procesamiento de referidos", value: "30s", status: "Óptimo", color: "text-amber-400" },
  ]

  const identityStats = typeof window !== 'undefined' ? getIdentityStats() : null

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9FF] to-cyan-600 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Automation Center</h1>
            <p className="text-[10px] font-mono text-slate-500">Centro de Automatización ELIANA — Acceso restringido</p>
          </div>
        </div>

        <nav className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {[
            { id: "automation", label: "Automation", icon: Cpu },
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "usuarios", label: "Usuarios", icon: Users, href: "/admin/usuarios" },
            { id: "vip", label: "VIP", icon: Crown, href: "/admin/vip" },
            { id: "kyc", label: "KYC", icon: Fingerprint, href: "/admin/kyc" },
            { id: "kyb", label: "KYB", icon: Building2, href: "/admin/kyb" },
            { id: "riesgos", label: "Riesgos", icon: Siren, href: "/admin/riesgos" },
            { id: "auditoria", label: "Auditoría", icon: ScrollText, href: "/admin/auditoria" },
            { id: "ratings", label: "Calificaciones", icon: Star, href: "/admin/ratings" },
            { id: "reportes", label: "Reportes", icon: AlertTriangle },
            { id: "contenido", label: "Contenido", icon: FileText },
            { id: "moderacion", label: "Moderación", icon: Eye },
            { id: "config", label: "Config", icon: Settings },
          ].map((t) => {
            const Icon = t.icon
            if (t.href) {
              return (
                <Link key={t.id} href={t.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    tab === t.id ? "bg-gradient-to-r from-[#00D9FF]/15 to-blue-600/10 text-[#00D9FF] border border-[#00D9FF]/20" : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                  }`}>
                  <Icon className="w-3.5 h-3.5" /> {t.label}
                </Link>
              )
            }
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  tab === t.id ? "bg-gradient-to-r from-[#00D9FF]/15 to-blue-600/10 text-[#00D9FF] border border-[#00D9FF]/20" : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                }`}>
                <Icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            )
          })}
        </nav>

        {tab === "automation" && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-4 h-4 text-[#00D9FF]" />
              <h2 className="text-sm font-mono font-bold text-[#00D9FF] uppercase tracking-wider">ELIANA Automation Engine</h2>
            </div>
            <p className="text-[10px] text-slate-400 mb-5 max-w-2xl">
              ELIANA gestiona automáticamente registro, verificación, membresías, pagos, soporte, moderación inicial, 
              detección de fraude y recomendaciones. Solo casos sensibles (fraude complejo, disputas, apelaciones, 
              bloqueos, asuntos legales) son escalados a revisión humana.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {automationStats.map((s, i) => {
                const Icon = s.icon
                return (
                  <div key={i} className="p-3 rounded-2xl glass">
                    <Icon className={`w-4 h-4 ${s.color} mb-1.5`} />
                    <p className="text-lg font-black">{s.value}</p>
                    <p className="text-[8px] text-slate-400">{s.label}</p>
                    <span className="text-[8px] text-emerald-400">{s.change}</span>
                  </div>
                )
              })}
            </div>

            {identityStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Total Usuarios", value: identityStats.totalUsers, icon: Users, color: "text-[#00D9FF]" },
                  { label: "VIP Activos", value: identityStats.vip + identityStats.entrepreneurVip, icon: Crown, color: "text-amber-400" },
                  { label: "KYC Aprobados", value: identityStats.kycApproved, icon: CheckCircle, color: "text-emerald-400" },
                  { label: "KYC Pendientes", value: identityStats.kycPending, icon: Clock, color: "text-amber-400" },
                ].map((s, i) => {
                  const Icon = s.icon
                  return (
                    <div key={i} className="p-3 rounded-2xl glass">
                      <Icon className={`w-4 h-4 ${s.color} mb-1.5`} />
                      <p className="text-lg font-black">{s.value}</p>
                      <p className="text-[8px] text-slate-400">{s.label}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {tab === "dashboard" && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Usuarios Totales", value: identityStats?.totalUsers || "—", icon: Users, color: "text-[#00D9FF]" },
                { label: "VIP", value: identityStats ? identityStats.vip + identityStats.entrepreneurVip : "—", icon: Crown, color: "text-amber-400" },
                { label: "KYC Aprobados", value: identityStats?.kycApproved || "—", icon: Fingerprint, color: "text-emerald-400" },
                { label: "Casos Riesgo", value: identityStats?.highRisk || "—", icon: AlertTriangle, color: "text-red-400" },
              ].map((s, i) => {
                const Icon = s.icon
                return (
                  <div key={i} className="p-4 rounded-2xl glass">
                    <Icon className={`w-5 h-5 ${s.color} mb-2`} />
                    <p className="text-2xl font-black">{s.value}</p>
                    <p className="text-[10px] text-slate-400">{s.label}</p>
                  </div>
                )
              })}
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Link href="/admin/kyc" className="p-5 rounded-2xl glass hover:border-[#00D9FF]/30 transition-all border border-slate-800/50">
                <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2"><Fingerprint className="w-3.5 h-3.5 text-[#00D9FF]" /> Verificación de Identidad</h3>
                <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-400">
                  <span>Pendientes: {identityStats?.kycPending || 0}</span>
                  <span>Aprobados: {identityStats?.kycApproved || 0}</span>
                  <span>Más info: {identityStats?.kycMoreInfo || 0}</span>
                  <span>Rechazados: {identityStats?.kycRejected || 0}</span>
                </div>
              </Link>
              <Link href="/admin/kyb" className="p-5 rounded-2xl glass hover:border-[#00D9FF]/30 transition-all border border-slate-800/50">
                <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-indigo-400" /> Verificación Empresarial</h3>
                <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-400">
                  <span>Negocios: {identityStats?.kybPending || 0} pendientes</span>
                  <span>Vencen pronto: {identityStats?.expiringSoon || 0}</span>
                </div>
              </Link>
            </div>
          </div>
        )}

        {tab === "reportes" && (
          <div className="p-5 rounded-2xl glass">
            <h2 className="text-sm font-bold text-white mb-3">Centro de Reportes</h2>
            <p className="text-[10px] text-slate-400">ELIANA detecta y resuelve automáticamente spam, desinformación y contenido inapropiado. Los reportes escalados requieren revisión humana.</p>
          </div>
        )}

        {tab === "contenido" && (
          <div className="p-5 rounded-2xl glass">
            <h2 className="text-sm font-bold text-white mb-3">Moderación de Contenido</h2>
            <p className="text-[10px] text-slate-400">ELIANA modera contenido inicial: detecta duplicados, spam, lenguaje ofensivo y desinformación. Solo contenido sensible o disputas se escalan a moderadores humanos.</p>
          </div>
        )}

        {tab === "moderacion" && (
          <div className="p-5 rounded-2xl glass">
            <h2 className="text-sm font-bold text-white mb-3">Acciones de Moderación</h2>
            <p className="text-[10px] text-slate-400">Historial de acciones: advertencias, suspensiones temporales y bloqueos. Las decisiones automáticas de ELIANA pueden ser apeladas y revisadas por humanos.</p>
          </div>
        )}

        {tab === "config" && (
          <div className="p-5 rounded-2xl glass">
            <h2 className="text-sm font-bold text-white mb-3">Configuración de la Plataforma</h2>
            <p className="text-[10px] text-slate-400">Ajustes generales, límites de rate, configuración de ELIANA, umbrales de automatización, parámetros de detección de fraude y políticas de escalado.</p>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getIdentityStats } from '@/lib/identity'
import { getAuditLog, getRecentSecurityEvents, getSecurityAlerts } from '@/lib/angel-security'
import {
  Globe, Shield, Users, AlertTriangle,
  CheckCircle, XCircle, Server, DollarSign,
  LucideIcon, ArrowUpRight, ArrowDownRight, RefreshCw, FileText,
} from 'lucide-react'

function StatCard({ icon: Icon, label, value, sub, color, trend }: {
  icon: LucideIcon; label: string; value: string; sub?: string; color: string; trend?: { up: boolean; pct: string }
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg bg-opacity-10 ${color} bg-current`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs ${trend.up ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.pct}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mt-3">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-slate-500 mt-1">{sub}</p>}
    </motion.div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    healthy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    inactive: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    pending: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  }
  const c = colors[status.toLowerCase()] || 'bg-slate-500/10 text-slate-400'
  return <span className={`text-[10px] px-2 py-0.5 rounded-full border ${c}`}>{status}</span>
}

export default function Dashboard360Page() {
  usePageTitle('Dashboard 360 — ZAFIRO')

  const [stats] = useState(() => getIdentityStats())
  const [auditEntries] = useState(() => getAuditLog({ limit: 20 }))
  const [securityEvents] = useState(() => getRecentSecurityEvents(20))
  const [alerts] = useState(() => getSecurityAlerts())

  const deployments = [
    { name: 'ZAFIRO OS', url: 'zafiro.msmmystore.com', status: 'healthy', uptime: '99.9%', build: 'v1.0.11' },
    { name: 'MSM My Store', url: 'msm-five.vercel.app', status: 'active', uptime: '99.8%', build: 'v1.0.0' },
    { name: 'MSM LegacyBook', url: 'msmlegacybook.com', status: 'pending', uptime: '—', build: '—' },
  ]

  const domains = [
    { name: 'msmmystore.com', provider: 'Cloudflare', status: 'active', ssl: true },
    { name: 'msmlegacybook.com', provider: 'Cloudflare', status: 'active', ssl: true },
    { name: 'zafiro.msmmystore.com', provider: 'Cloudflare → Vercel', status: 'active', ssl: true },
    { name: 'market.msmmystore.com', provider: 'Vercel (DNS pendiente)', status: 'pending', ssl: false },
  ]

  const securityMetrics = [
    { label: 'MFA Activo', value: '1 usuario' },
    { label: 'Eventos de seguridad (24h)', value: String(securityEvents.length) },
    { label: 'Alertas críticas', value: String(alerts.filter(a => a.severity === 'CRITICAL').length) },
    { label: 'Rate limit hits', value: String(securityEvents.filter(e => e.type === 'RATE_LIMIT_HIT').length) },
  ]

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00D9FF] to-purple-400 bg-clip-text text-transparent">
              Dashboard 360
            </h1>
            <p className="text-sm text-slate-400 mt-1">Don Miguel — Estado completo del ecosistema</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <RefreshCw className="w-3 h-3" />
            <span>Auto-actualizable</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Server} label="Deployments" value={String(deployments.length)} color="text-[#00D9FF]"
            sub={`${deployments.filter(d => d.status === 'healthy' || d.status === 'active').length} activos`} />
          <StatCard icon={Globe} label="Dominios" value={String(domains.length)} color="text-emerald-400"
            sub={`${domains.filter(d => d.status === 'active').length} resuelven`} />
          <StatCard icon={Shield} label="Seguridad" value={String(securityMetrics[1].value)} color="text-amber-400"
            sub={`${securityMetrics[2].value} críticas`}
            trend={{ up: false, pct: '—' }} />
          <StatCard icon={Users} label="Usuarios" value={String(stats?.totalUsers || 0)} color="text-purple-400"
            sub={`${stats?.vip || 0} VIP`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-[#00D9FF]" /> Estado de Deployments
            </h2>
            <div className="space-y-3">
              {deployments.map(d => (
                <div key={d.name} className="flex items-center justify-between py-2 border-b border-[#1A1B3A] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">{d.name}</p>
                    <p className="text-xs text-slate-400">{d.url}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{d.build} · {d.uptime}</span>
                    <StatusBadge status={d.status} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" /> Dominios
            </h2>
            <div className="space-y-3">
              {domains.map(d => (
                <div key={d.name} className="flex items-center justify-between py-2 border-b border-[#1A1B3A] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">{d.name}</p>
                    <p className="text-xs text-slate-400">{d.provider}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {d.ssl ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-red-400" />}
                    <StatusBadge status={d.status} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="lg:col-span-2 bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" /> Auditoría Reciente
            </h2>
            <div className="space-y-2">
              {auditEntries.slice(0, 10).map(e => (
                <div key={e.id} className="flex items-center justify-between py-1.5 border-b border-[#1A1B3A]/50 last:border-0 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${e.success ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className="text-slate-300 truncate">{e.action}</span>
                  </div>
                  <span className="text-slate-500 flex-shrink-0 ml-2">{new Date(e.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
              {auditEntries.length === 0 && <p className="text-xs text-slate-500">Sin eventos de auditoría</p>}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" /> Alertas de Seguridad
            </h2>
            <div className="space-y-2">
              {alerts.slice(0, 8).map(a => (
                <div key={a.id} className="flex items-start gap-2 py-1.5 border-b border-[#1A1B3A]/50 last:border-0">
                  <Shield className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${a.severity === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'}`} />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-300 truncate">{a.type}</p>
                    <p className="text-[10px] text-slate-500">{new Date(a.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && <p className="text-xs text-slate-500">Sin alertas activas</p>}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Villa Esperanza</p>
            <p className="text-lg font-bold text-[#00D9FF]">$0</p>
            <p className="text-[10px] text-slate-500">de $5,000,000 meta</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">KYC Aprobados</p>
            <p className="text-lg font-bold text-emerald-400">{stats?.kycApproved || 0}</p>
            <p className="text-[10px] text-slate-500">{stats?.kycPending || 0} pendientes</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Operaciones</p>
            <p className="text-lg font-bold text-amber-400">—</p>
            <p className="text-[10px] text-slate-500">Por implementar</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">ELIANA</p>
            <p className="text-lg font-bold text-purple-400">ACTIVA</p>
            <p className="text-[10px] text-slate-500">38 docs de conocimiento</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getPanelStatus, getDirectorioStats, getResumenInventario } from '@/lib/eliana/omnicanal'
import { getRecentTraces } from '@/lib/eliana/correlation'
import { getStoredTraining } from '@/lib/eliana/owner-firewall'
import { ELIANA_VERSION } from '@/lib/eliana/system-prompt'
import {
  Activity, Globe, Smartphone, Database, AlertTriangle,
  XCircle, Clock, Users, DollarSign, Shield,
  FileText, UserPlus, Package, BarChart3,
} from 'lucide-react'

export default function PanelPage() {
  usePageTitle('Panel OWNER — ELIANA')
  const [status] = useState(() => getPanelStatus())
  const [dirStats] = useState(() => getDirectorioStats())
  const [invResumen] = useState(() => getResumenInventario())
  const [traces] = useState(() => getRecentTraces(30))
  const [training] = useState(() => getStoredTraining())

  const metrics = [
    { icon: Activity, label: 'ELIANA', value: status.eliana.activa ? 'ACTIVA' : 'INACTIVA', color: status.eliana.activa ? 'text-emerald-400' : 'text-red-400', sub: `v${status.eliana.version}` },
    { icon: Smartphone, label: 'WhatsApp', value: status.whatsapp.status === 'conectado' ? 'Conectado' : 'Pendiente', color: status.whatsapp.status === 'conectado' ? 'text-emerald-400' : 'text-amber-400', sub: `${status.whatsapp.totalMessages} mensajes` },
    { icon: Globe, label: 'Web', value: status.web.status === 'ok' ? 'OK' : 'Error', color: 'text-[#00D9FF]', sub: new Date(status.web.lastPing).toLocaleTimeString() },
    { icon: Database, label: 'Supabase', value: status.supabase.configurado ? 'Configurado' : 'Sin credenciales', color: status.supabase.configurado ? 'text-emerald-400' : 'text-red-400' },
    { icon: Users, label: 'Directorio', value: String(dirStats.total), color: 'text-purple-400', sub: `${dirStats.porTipo.cliente || 0} clientes` },
    { icon: DollarSign, label: 'Inventario', value: `$${invResumen.porMoneda.USD?.saldo?.toFixed(0) || '0'}`, color: 'text-amber-400', sub: `${invResumen.pendientes} pendientes` },
  ]

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#00D9FF] to-purple-400 bg-clip-text text-transparent">
              Panel OWNER — ELIANA
            </h1>
            <p className="text-xs text-slate-400 mt-1">Control total del ecosistema omnicanal · v{ELIANA_VERSION}</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400">Tiempo real</span>
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {metrics.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <m.icon className={`w-4 h-4 ${m.color}`} />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">{m.label}</span>
              </div>
              <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
              {m.sub && <p className="text-[10px] text-slate-500 mt-0.5">{m.sub}</p>}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alertas */}
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" /> Alertas del Sistema
            </h2>
            {status.alertas.length === 0 ? (
              <p className="text-xs text-slate-500">Sin alertas activas.</p>
            ) : (
              <div className="space-y-2">
                {status.alertas.map((a, i) => (
                  <div key={i} className={`flex items-start gap-2 text-xs p-2 rounded-lg ${
                    a.severidad === 'alta' ? 'bg-red-500/5 text-red-400' : 'bg-amber-500/5 text-amber-400'
                  }`}>
                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{a.mensaje}</span>
                  </div>
                ))}
              </div>
            )}
            {status.supabase.error && (
              <div className="mt-3 flex items-center gap-2 text-xs bg-red-500/5 text-red-400 p-2 rounded-lg">
                <XCircle className="w-3 h-3" /> {status.supabase.error}
              </div>
            )}
          </div>

          {/* Errores */}
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" /> Últimos Errores
            </h2>
            {status.errores.ultimos.length === 0 ? (
              <p className="text-xs text-slate-500">Sin errores registrados.</p>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {status.errores.ultimos.map((e, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] py-1 border-b border-[#1A1B3A]/30 last:border-0">
                    <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                    <span className="text-slate-400 truncate">{e.mensaje}</span>
                    <span className="text-slate-600 ml-auto">{new Date(e.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trazas recientes */}
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00D9FF]" /> Trazas de Actividad
            </h2>
            {traces.length === 0 ? (
              <p className="text-xs text-slate-500">Sin actividad.</p>
            ) : (
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {traces.slice(-20).reverse().map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] py-0.5">
                    <span className={`w-2 h-2 rounded-full ${
                      t.result === 'success' || t.result === 'passed' ? 'bg-emerald-400' :
                      t.result === 'blocked' ? 'bg-red-400' : 'bg-slate-500'
                    }`} />
                    <span className="text-slate-500 w-16 truncate font-mono">{t.correlationId?.slice(-6) || '—'}</span>
                    <span className="text-slate-400 w-16">{t.step}</span>
                    <span className="text-slate-500 truncate flex-1">{t.action}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STORE_ONLY Training */}
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" /> STORE_ONLY Training
            </h2>
            {training.length === 0 ? (
              <p className="text-xs text-slate-500">Sin entrenamientos almacenados.</p>
            ) : (
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {training.slice(-10).reverse().map(t => (
                  <div key={t.id} className="text-[11px] py-1 border-b border-[#1A1B3A]/30 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${t.processed ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <span className="text-slate-400">{t.type}</span>
                      <span className="text-slate-600 text-[10px] ml-auto">{new Date(t.receivedAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-500 truncate mt-0.5">{t.content.slice(0, 80)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumen Inventario */}
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" /> Resumen Inventario
            </h2>
            <div className="space-y-3">
              {Object.entries(invResumen.porMoneda).map(([moneda, datos]) => (
                <div key={moneda} className="flex items-center justify-between text-xs py-1 border-b border-[#1A1B3A]/30 last:border-0">
                  <span className="text-slate-400 font-mono">{moneda}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-400">+${datos.entradas.toFixed(0)}</span>
                    <span className="text-red-400">-${datos.salidas.toFixed(0)}</span>
                    <span className={`font-semibold ${datos.saldo >= 0 ? 'text-white' : 'text-red-400'}`}>
                      ${datos.saldo.toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botones rápidos */}
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/zafiro/admin/eliana/directorio', icon: UserPlus, label: 'Directorio', color: 'text-purple-400' },
            { href: '/zafiro/admin/eliana/expedientes', icon: FileText, label: 'Expedientes', color: 'text-amber-400' },
            { href: '/zafiro/admin/eliana/inventario', icon: Package, label: 'Inventario', color: 'text-emerald-400' },
            { href: '/zafiro/admin/eliana/conocimiento', icon: Shield, label: 'Conocimiento', color: 'text-[#00D9FF]' },
          ].map((btn, i) => (
            <a key={i} href={btn.href}
              className="flex items-center gap-1.5 text-xs bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg px-4 py-2 hover:border-[#00D9FF]/30 transition-colors">
              <btn.icon className={`w-3.5 h-3.5 ${btn.color}`} />
              <span className="text-slate-300">{btn.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Zap, Gauge, Wifi, Database, RefreshCw, Clock, AlertTriangle, CheckCircle, BarChart3, Trash2, Download } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import { getNetworkMode, getNetworkProfile, MODE_CONFIG } from "@/lib/performance/network-mode"
import { getConnectionHistory, generateConnectionReport, clearConnectionHistory } from "@/lib/performance/connection-monitor"
import { getCacheStats, cacheClear } from "@/lib/performance/request-cache"
import { runBudgetCheck, getBudgetHistory, clearBudgetHistory } from "@/lib/performance/performance-budget"
import { getSyncStats } from "@/lib/performance/sync-engine"
import type { ZafiroNetworkMode } from "@/lib/performance/network-mode"

const ALLOWED_ROLES = ['OWNER_SUPERADMIN', 'ADMIN']

export default function RendimientoPage() {
  usePageTitle("Velocidad Luz 369/777 — Rendimiento")
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [tab, setTab] = useState<'dashboard' | 'budgets' | 'cache' | 'sync' | 'connection'>('dashboard')
  const [networkMode, setNetworkMode] = useState<ZafiroNetworkMode>('FULL')
  const [report, setReport] = useState(() => generateConnectionReport())
  const [cacheStats, setCacheStats] = useState(() => getCacheStats())
  const [syncStats, setSyncStats] = useState(() => getSyncStats())
  const [budgetHistory, setBudgetHistory] = useState(() => getBudgetHistory())
  const [running, setRunning] = useState(false)
  const [lastBudget, setLastBudget] = useState<Awaited<ReturnType<typeof runBudgetCheck>> | null>(null)

  useEffect(() => {
    const session = getSession()
    if (!session || !ALLOWED_ROLES.includes(session.role || '')) {
      router.replace('/')
    } else {
      setAuthorized(true)
      setNetworkMode(getNetworkMode())
    }
  }, [router])

  const refresh = () => {
    setNetworkMode(getNetworkMode())
    setReport(generateConnectionReport())
    setCacheStats(getCacheStats())
    setSyncStats(getSyncStats())
    setBudgetHistory(getBudgetHistory())
  }

  const runBudget = async () => {
    setRunning(true)
    const profile = getNetworkProfile()
    const result = await runBudgetCheck(window.location.href, profile.mode)
    setLastBudget(result)
    setBudgetHistory(getBudgetHistory())
    setRunning(false)
  }

  if (!authorized) return null

  const tabs = [
    { id: 'dashboard' as const, label: 'Panel', icon: Gauge },
    { id: 'budgets' as const, label: 'Presupuestos', icon: BarChart3 },
    { id: 'cache' as const, label: 'Caché', icon: Database },
    { id: 'sync' as const, label: 'Sincronización', icon: RefreshCw },
    { id: 'connection' as const, label: 'Conexión', icon: Wifi },
  ]

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a Admin
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Velocidad Luz 369/777</h1>
            <p className="text-sm text-slate-400">Panel de rendimiento — ZAFIRO Performance System</p>
          </div>
          <button onClick={refresh} className="ml-auto p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Resumen rápido */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          <div className="p-3 rounded-xl glass text-center">
            <Zap className={`w-4 h-4 mx-auto mb-1 ${
              networkMode === 'LIGHT' ? 'text-amber-400' : networkMode === 'BALANCED' ? 'text-emerald-400' : networkMode === 'OFFLINE' ? 'text-red-400' : 'text-[#00D9FF]'
            }`} />
            <p className="text-xs font-bold text-white">{MODE_CONFIG[networkMode].label}</p>
            <p className="text-[8px] text-slate-500">Modo actual</p>
          </div>
          <div className="p-3 rounded-xl glass text-center">
            <Database className="w-4 h-4 text-[#00D9FF] mx-auto mb-1" />
            <p className="text-xs font-bold text-white">{cacheStats.totalEntries}</p>
            <p className="text-[8px] text-slate-500">En caché</p>
          </div>
          <div className="p-3 rounded-xl glass text-center">
            <RefreshCw className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-white">{syncStats.pending}</p>
            <p className="text-[8px] text-slate-500">Pendientes</p>
          </div>
          <div className="p-3 rounded-xl glass text-center">
            <Clock className="w-4 h-4 text-violet-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-white">{report.averageRtt}ms</p>
            <p className="text-[8px] text-slate-500">RTT medio</p>
          </div>
          <div className="p-3 rounded-xl glass text-center">
            <Wifi className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-white">{report.averageDownlink}Mbps</p>
            <p className="text-[8px] text-slate-500">Velocidad media</p>
          </div>
          <div className="p-3 rounded-xl glass text-center">
            <AlertTriangle className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-white">{report.downtime}%</p>
            <p className="text-[8px] text-slate-500">Desconexión</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-0.5 rounded-xl bg-slate-900/40 overflow-x-auto">
          {tabs.map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all ${
                  tab === t.id ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}>
                <Icon className="w-3 h-3" /> {t.label}
              </button>
            )
          })}
        </div>

        {/* Panel de presupuestos */}
        {tab === 'budgets' && (
          <div className="space-y-4">
            <div className="flex gap-2 mb-4">
              <button onClick={runBudget} disabled={running}
                className="px-4 py-2 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] hover:bg-[#00D9FF]/20 text-sm font-medium transition-all disabled:opacity-50 flex items-center gap-2">
                <BarChart3 className={`w-4 h-4 ${running ? 'animate-pulse' : ''}`} />
                {running ? 'MIDIENDO...' : 'MEDIR AHORA'}
              </button>
              <button onClick={clearBudgetHistory} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-sm transition-all flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> LIMPIAR HISTORIAL
              </button>
            </div>

            {lastBudget && (
              <div className="p-5 rounded-2xl glass mb-4">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#00D9FF]" /> Última medición
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    lastBudget.overall === 'pass' ? 'bg-emerald-500/10 text-emerald-400' :
                    lastBudget.overall === 'partial' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>{lastBudget.overall.toUpperCase()}</span>
                </h3>
                <div className="space-y-2">
                  {lastBudget.entries.map((entry, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40">
                      <div className="flex items-center gap-2">
                        {entry.pass ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        <span className="text-xs text-slate-300">{entry.metric}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${entry.actual !== null && entry.actual <= entry.target ? 'text-emerald-400' : entry.actual !== null ? 'text-amber-400' : 'text-slate-500'}`}>
                          {entry.actual !== null ? `${entry.actual}${entry.unit}` : '—'}
                        </span>
                        <span className="text-[9px] text-slate-600">/ {entry.target}{entry.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {budgetHistory.length === 0 && !lastBudget && (
              <div className="p-8 text-center rounded-2xl glass">
                <BarChart3 className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No hay mediciones. Ejecuta una prueba de presupuesto.</p>
              </div>
            )}

            {budgetHistory.length > 0 && (
              <div className="p-5 rounded-2xl glass">
                <h3 className="text-sm font-bold text-white mb-3">Historial de mediciones ({budgetHistory.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {budgetHistory.slice().reverse().slice(0, 20).map((b, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 text-[10px]">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          b.overall === 'pass' ? 'bg-emerald-400' : b.overall === 'partial' ? 'bg-amber-400' : 'bg-red-400'
                        }`} />
                        <span className="text-slate-400">{new Date(b.timestamp).toLocaleString('es-ES')}</span>
                      </div>
                      <span className="text-slate-500">{b.networkMode} · {b.failures.length} fallos</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Caché */}
        {tab === 'cache' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-4 rounded-xl glass text-center">
                <p className="text-2xl font-black text-white">{cacheStats.totalEntries}</p>
                <p className="text-[10px] text-slate-500">Entradas en caché</p>
              </div>
              <div className="p-4 rounded-xl glass text-center">
                <p className="text-2xl font-black text-white">{cacheStats.totalSizeKB} KB</p>
                <p className="text-[10px] text-slate-500">Tamaño total</p>
              </div>
              <div className="p-4 rounded-xl glass text-center">
                <p className="text-2xl font-black text-white">{syncStats.total}</p>
                <p className="text-[10px] text-slate-500">Operaciones totales</p>
              </div>
            </div>
            <button onClick={() => { cacheClear(); setCacheStats(getCacheStats()) }}
              className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm transition-all flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> LIMPIAR CACHÉ
            </button>
            {cacheStats.keys.length > 0 && (
              <div className="p-5 rounded-2xl glass">
                <h3 className="text-sm font-bold text-white mb-3">Claves en caché</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {cacheStats.keys.map((k, i) => (
                    <div key={i} className="text-[10px] text-slate-500 font-mono truncate">{k}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sincronización */}
        {tab === 'sync' && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="p-4 rounded-xl glass text-center">
                <p className="text-xl font-black text-white">{syncStats.total}</p>
                <p className="text-[10px] text-slate-500">Total</p>
              </div>
              <div className="p-4 rounded-xl glass text-center">
                <p className="text-xl font-black text-amber-400">{syncStats.pending}</p>
                <p className="text-[10px] text-slate-500">Pendientes</p>
              </div>
              <div className="p-4 rounded-xl glass text-center">
                <p className="text-xl font-black text-emerald-400">{syncStats.synced}</p>
                <p className="text-[10px] text-slate-500">Sincronizados</p>
              </div>
              <div className="p-4 rounded-xl glass text-center">
                <p className="text-xl font-black text-red-400">{syncStats.failed}</p>
                <p className="text-[10px] text-slate-500">Requieren revisión</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">La sincronización automática procesa las operaciones en cola cuando la conexión lo permite.</p>
          </div>
        )}

        {/* Conexión */}
        {tab === 'connection' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="p-4 rounded-xl glass text-center">
                <Wifi className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <p className="text-lg font-black text-white">{report.uptime}%</p>
                <p className="text-[10px] text-slate-500">Disponibilidad</p>
              </div>
              <div className="p-4 rounded-xl glass text-center">
                <Clock className="w-5 h-5 text-[#00D9FF] mx-auto mb-1" />
                <p className="text-lg font-black text-white">{report.averageRtt}ms</p>
                <p className="text-[10px] text-slate-500">RTT promedio</p>
              </div>
              <div className="p-4 rounded-xl glass text-center">
                <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <p className="text-lg font-black text-white">{report.averageDownlink} Mbps</p>
                <p className="text-[10px] text-slate-500">Velocidad promedio</p>
              </div>
              <div className="p-4 rounded-xl glass text-center">
                <Database className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                <p className="text-lg font-black text-white">{report.samples.length}</p>
                <p className="text-[10px] text-slate-500">Muestras</p>
              </div>
            </div>
            <button onClick={() => { clearConnectionHistory(); setReport(generateConnectionReport()) }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-sm transition-all flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> LIMPIAR HISTORIAL
            </button>
          </div>
        )}

        {/* Panel por defecto */}
        {tab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl glass">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-400" /> Principio 369</h3>
              <div className="space-y-2 text-xs text-slate-400">
                <p><strong className="text-white">3 Capas:</strong> Local, Edge, Origen</p>
                <p><strong className="text-white">6 Estrategias:</strong> Comprimir, Cachear, Bajo demanda, Progresivo, Solo cambios, Adaptativo</p>
                <p><strong className="text-white">9 Métricas:</strong> TTFB, FCP, LCP, INP, CLS, JS inicial, Peso página, Latencia API, Tasa errores</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl glass">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><RefreshCw className="w-4 h-4 text-emerald-400" /> Protocolo 777</h3>
              <div className="space-y-2 text-xs text-slate-400">
                <p><strong className="text-white">7 Reglas de carga:</strong> Esencial primero, diferir módulos, lazy images, ELIANA bajo demanda, sin duplicados</p>
                <p><strong className="text-white">7 Modos de respaldo:</strong> Caché, texto sin imágenes, baja resolución, animaciones reducidas, offline queue</p>
                <p><strong className="text-white">7 Pruebas:</strong> Rápida, Fast 3G, Slow 3G, alta latencia, pérdida paquetes, offline, recursos limitados</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl glass">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Gauge className="w-4 h-4 text-[#00D9FF]" /> Estado actual</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Modo:</span><span className="text-white font-medium">{MODE_CONFIG[networkMode].label}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Caché:</span><span className="text-white font-medium">{cacheStats.totalEntries} entradas ({cacheStats.totalSizeKB} KB)</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Sync pendiente:</span><span className="text-white font-medium">{syncStats.pending} ops</span></div>
                <div className="flex justify-between"><span className="text-slate-400">RTT:</span><span className="text-white font-medium">{report.averageRtt}ms</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Velocidad:</span><span className="text-white font-medium">{report.averageDownlink} Mbps</span></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

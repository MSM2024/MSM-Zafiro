'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { motion } from "motion/react"
import { ArrowLeft, Users, UserPlus, Activity, CheckCircle, Clock, AlertTriangle, Gauge, Globe, TrendingUp, BarChart3, Database, Zap, Shield, RefreshCw, Loader2 } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import { computeUserMetrics, trackError } from "@/lib/analytics/users"
import { getPerfStats, capturePerfSample } from "@/lib/analytics/performance"
import { checkRateLimit, getRateLimitStatus } from "@/lib/analytics/rate-limiter"
import type { UserMetrics } from "@/lib/analytics/users"
import CrossPillarStatsWidget from "@/components/CrossPillarStatsWidget"

export default function AdminMetricasPage() {
  usePageTitle("Métricas Reales — Admin ZAFIRO")
  const router = useRouter()

  const [metrics, setMetrics] = useState<UserMetrics | null>(null)
  const [perfStats, setPerfStats] = useState<any>(null)
  const [loadTestResult, setLoadTestResult] = useState<string>("")
  const [loadTesting, setLoadTesting] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session || session.email !== "msmmystore@gmail.com") router.replace("/")
  }, [router])

  const refresh = useCallback(() => {
    capturePerfSample('/admin/metricas')
    setMetrics(computeUserMetrics())
    setPerfStats(getPerfStats())
  }, [])

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 30000)
    return () => clearInterval(interval)
  }, [refresh])

  const runLoadTest = async (count: number) => {
    setLoadTesting(true)
    setLoadTestResult(`Simulando ${count.toLocaleString()} usuarios...`)
    try {
      const t0 = performance.now()
      const testData: Record<string, any>[] = []
      for (let i = 0; i < count; i++) {
        const user = {
          id: `test_${Date.now()}_${i}`,
          email: `test${i}@simulacion.zafiro`,
          name: `Usuario Sim ${i}`,
        }
        testData.push(user)
        localStorage.setItem(`zafiro_test_user_${i}`, JSON.stringify(user))
        if (i % 100 === 0) {
          await new Promise(r => setTimeout(r, 0))
        }
      }
      const elapsed = Math.round(performance.now() - t0)
      const storageBefore = JSON.stringify(localStorage).length
      setLoadTestResult(
        `${count.toLocaleString()} usuarios simulados en ${elapsed}ms | ` +
        `Storage antes: ${(storageBefore / 1024).toFixed(1)}KB | ` +
        `${count.toLocaleString()} registros en localStorage`
      )

      for (let i = 0; i < count; i++) {
        localStorage.removeItem(`zafiro_test_user_${i}`)
      }
      const storageAfter = JSON.stringify(localStorage).length
      setLoadTestResult(prev => prev + ` | Storage después: ${(storageAfter / 1024).toFixed(1)}KB | ✅ LIMPIO`)
    } catch (err: any) {
      trackError(`load_test_${count}: ${err.message}`)
      setLoadTestResult(`❌ Error en prueba de ${count.toLocaleString()}: ${err.message}`)
    } finally {
      setLoadTesting(false)
    }
  }

  const capacidadTests = [
    { label: "100 usuarios", count: 100, icon: Users, color: "text-emerald-400", desc: "Capacidad básica — verifica escritura secuencial" },
    { label: "1,000 usuarios", count: 1000, icon: Users, color: "text-amber-400", desc: "Capacidad media — estrés en serialización JSON" },
    { label: "10,000 usuarios", count: 10000, icon: Zap, color: "text-red-400", desc: "Capacidad alta — límite de cuota localStorage (~5MB)" },
  ]

  if (!metrics) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00D9FF] animate-spin" />
      </div>
    )
  }

  const mainStats = [
    { label: "USUARIOS TOTALES", value: metrics.totalUsers, icon: Users, color: "text-[#00D9FF]" },
    { label: "PERFILES CREADOS HOY", value: metrics.profilesCreatedToday, icon: UserPlus, color: "text-emerald-400" },
    { label: "USUARIOS ACTIVOS", value: metrics.activeUsersToday, icon: Activity, color: "text-amber-400" },
    { label: "REGISTROS COMPLETADOS", value: metrics.registrosCompletados, icon: CheckCircle, color: "text-[#00D9FF]" },
    { label: "REGISTROS PENDIENTES", value: metrics.registrosPendientes, icon: Clock, color: "text-purple-400" },
    { label: "ERRORES", value: metrics.errores, icon: AlertTriangle, color: metrics.errores > 0 ? "text-red-400" : "text-emerald-400" },
    { label: "TIEMPO MEDIO DE CARGA", value: `${perfStats?.avgLoadTimeMs || metrics.loadTimeMs || 0}ms`, icon: Gauge, color: "text-cyan-400" },
    { label: "PAÍSES ACTIVOS", value: metrics.paisesActivos.length || "—", icon: Globe, color: "text-blue-400" },
    { label: "FUENTE DE REGISTRO", value: Object.keys(metrics.fuenteRegistro).length > 0 ? Object.entries(metrics.fuenteRegistro).map(([k, v]) => `${k}:${v}`).join(', ') : "—", icon: TrendingUp, color: "text-indigo-400" },
  ]

  const detalleStats = [
    { label: "Perfiles v1", value: metrics.v1Profiles, icon: Database, color: "text-slate-400" },
    { label: "Perfiles v2 (completos)", value: metrics.v2Profiles, icon: Database, color: "text-[#00D9FF]" },
    { label: "Usuarios auth", value: metrics.authUsers, icon: Shield, color: "text-cyan-400" },
    { label: "Sesiones activas", value: metrics.activeSessions, icon: Activity, color: "text-emerald-400" },
    { label: "Eventos totales", value: metrics.totalEvents, icon: BarChart3, color: "text-purple-400" },
    { label: "KYC iniciados", value: metrics.kycStarted, icon: CheckCircle, color: "text-amber-400" },
    { label: "KYC aprobados", value: metrics.kycApproved, icon: CheckCircle, color: "text-emerald-400" },
    { label: "VIPs", value: metrics.vips, icon: Users, color: "text-amber-400" },
    { label: "Emprendedores", value: metrics.entrepreneurs, icon: Users, color: "text-purple-400" },
    { label: "Errores totales", value: metrics.totalErrores, icon: AlertTriangle, color: metrics.totalErrores > 0 ? "text-red-400" : "text-emerald-400" },
  ]

  const registrosHoy = Object.entries(metrics.registrationsByHour)
    .filter(([h]) => h.startsWith(new Date().toISOString().slice(0, 10)))
    .sort(([a], [b]) => a.localeCompare(b))

  return (
    <div className="min-h-screen bg-[#050816] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-white">📊 Métricas Reales</h1>
          <span className="text-xs text-slate-500">Datos de localStorage</span>
          <button onClick={refresh} className="ml-auto text-slate-400 hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {mainStats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
                <stat.icon className={`w-5 h-5 ${stat.color} opacity-60`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cross-pillar stats */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            Estadísticas Multi-Pilar
          </h2>
          <CrossPillarStatsWidget />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#00D9FF]" />
              Desglose de datos
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {detalleStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30">
                  <span className="text-xs text-slate-500">{stat.label}</span>
                  <span className={`text-sm font-semibold ${stat.color}`}>
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#00D9FF]" />
              Registros hoy por hora
            </h2>
            {registrosHoy.length > 0 ? (
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {registrosHoy.map(([hour, count]) => (
                  <div key={hour} className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 w-16">{hour.slice(11)}h</span>
                    <div className="flex-1 h-4 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00D9FF] rounded-full transition-all"
                        style={{ width: `${Math.min(100, (count / Math.max(...registrosHoy.map(([, c]) => c), 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-slate-300 w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Sin registros hoy</p>
            )}
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00D9FF]" />
            Pruebas de capacidad progresiva
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Simula usuarios escribiendo en localStorage. No afecta producción. Mide tiempo, cuota de almacenamiento y límites detectados.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {capacidadTests.map((test) => (
              <button
                key={test.count}
                onClick={() => runLoadTest(test.count)}
                disabled={loadTesting}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-left hover:border-[#00D9FF]/30 transition-all disabled:opacity-50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <test.icon className={`w-4 h-4 ${test.color}`} />
                  <span className={`text-sm font-semibold ${test.color}`}>{test.label}</span>
                </div>
                <p className="text-xs text-slate-500">{test.desc}</p>
              </button>
            ))}
          </div>
          {loadTestResult && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-lg text-xs font-mono ${loadTestResult.includes('❌') ? 'bg-red-900/20 text-red-400 border border-red-800/30' : loadTestResult.includes('✅') ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-800/30' : 'bg-slate-800/50 text-slate-300'}`}
            >
              {loadTesting && <Loader2 className="w-3 h-3 inline animate-spin mr-2" />}
              {loadTestResult}
            </motion.div>
          )}
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00D9FF]" />
            Rate Limits activos
          </h2>
          <div className="text-xs text-slate-500">
            <p>Rate limit persistente en localStorage (<code className="text-[#00D9FF]">zafiro_rate_limits</code>)</p>
            <p className="mt-1">Máximo 5 intentos por ventana de 15 minutos por clave.</p>
            <p className="mt-1">Persiste entre recargas de página y funciona en Vercel serverless.</p>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#00D9FF]" />
            Rendimiento de red
          </h2>
          {perfStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500">Avg carga</p>
                <p className="text-lg font-bold text-cyan-400">{perfStats.avgLoadTimeMs}ms</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">P50</p>
                <p className="text-lg font-bold text-emerald-400">{perfStats.p50LoadTimeMs}ms</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">P95</p>
                <p className="text-lg font-bold text-amber-400">{perfStats.p95LoadTimeMs}ms</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Muestras</p>
                <p className="text-lg font-bold text-slate-300">{perfStats.total}</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Sin datos de rendimiento aún. Recarga la página para capturar.</p>
          )}
        </div>
      </div>
    </div>
  )
}

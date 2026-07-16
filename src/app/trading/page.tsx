'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePageTitle } from "@/lib/usePageTitle"
import {
  getConfig, saveConfig, calcularCapitalPorOperacion, generarSenal,
  getHistorialOperaciones, registrarOperacion, getResumenTrading,
  getMensajeAnalisis, type TradingConfig, type SenalTrading, type Operacion
} from "@/lib/trading-strategy"
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, BarChart3, Target, Shield, Zap, Bitcoin } from "lucide-react"

export default function TradingPage() {
  usePageTitle("Estrategia 1% — ZAFIRO")
  const [config, setConfig] = useState<TradingConfig>(getConfig())
  const [operaciones, setOperaciones] = useState<Operacion[]>([])
  const [resumen, setResumen] = useState("")
  const [analisis, setAnalisis] = useState("")
  const [btcPrice, setBtcPrice] = useState(65000)
  const [tendencia, setTendencia] = useState<"alcista" | "bajista" | "lateral">("lateral")
  const [rsi, setRsi] = useState(50)
  const [volumen, setVolumen] = useState(1.0)
  const [senal, setSenal] = useState<SenalTrading | null>(null)

  useEffect(() => {
    setOperaciones(getHistorialOperaciones())
    setResumen(getResumenTrading())
  }, [])

  function handleActualizarConfig() {
    saveConfig(config)
    setResumen(getResumenTrading())
  }

  function handleGenerarAnalisis() {
    const s = generarSenal("BTC", btcPrice, tendencia, rsi, volumen)
    setSenal(s)
    setAnalisis(getMensajeAnalisis(btcPrice, tendencia, rsi, volumen))
  }

  function handleAprobar(s: SenalTrading) {
    s.estado = "aprobada"
    setAnalisis(analisis.replace("pendiente", "aprobada"))
  }

  function handleEjecutar(s: SenalTrading) {
    const op: Operacion = {
      id: "",
      activo: s.activo,
      tipo: s.tipo,
      precioEntrada: s.precioEntrada,
      precioSalida: null,
      cantidad: s.cantidadUSD / s.precioEntrada,
      cantidadUSD: s.cantidadUSD,
      resultadoUSD: null,
      resultadoPct: null,
      apertura: new Date().toISOString(),
      cierre: null,
      estado: "abierta",
      plataforma: "Binance US",
    }
    registrarOperacion(op)
    s.estado = "ejecutada"
    setOperaciones(getHistorialOperaciones())
    setResumen(getResumenTrading())
    setAnalisis(`✅ *Operación ejecutada:* ${s.tipo === "compra" ? "COMPRA" : "VENTA"} ${s.activo} a $${s.precioEntrada.toFixed(2)}`)
    setSenal(null)
  }

  const porOp = calcularCapitalPorOperacion()
  const ganadas = operaciones.filter((o) => o.resultadoUSD && o.resultadoUSD > 0).length
  const perdidas = operaciones.filter((o) => o.resultadoUSD && o.resultadoUSD < 0).length
  const winRate = operaciones.length > 0 ? Math.round((ganadas / operaciones.length) * 100) : 0

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-black">Estrategia de Trading 1%</h1>
            <p className="text-[10px] text-slate-400">Algoritmo inteligente — BTC + Top 10 — USDT 24/7</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-xl glass border border-slate-800/30 text-center">
            <p className="text-[9px] text-slate-500">Capital</p>
            <p className="text-sm font-black text-[#00D9FF]">${config.capitalTotalUSD.toFixed(0)}</p>
          </div>
          <div className="p-3 rounded-xl glass border border-slate-800/30 text-center">
            <p className="text-[9px] text-slate-500">1% por Op.</p>
            <p className="text-sm font-black text-emerald-400">${porOp.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-xl glass border border-slate-800/30 text-center">
            <p className="text-[9px] text-slate-500">Win Rate</p>
            <p className="text-sm font-black text-amber-400">{winRate}%</p>
          </div>
          <div className="p-3 rounded-xl glass border border-slate-800/30 text-center">
            <p className="text-[9px] text-slate-500">Operaciones</p>
            <p className="text-sm font-black text-slate-200">{operaciones.length}</p>
          </div>
        </div>

        {/* Config */}
        <div className="p-4 rounded-2xl glass border border-slate-800/30 mb-6">
          <h2 className="text-xs font-bold mb-3 flex items-center gap-2"><Target className="w-3 h-4 text-[#00D9FF]" /> Configuración</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[8px] text-slate-500 uppercase">Capital Total (USD)</label>
              <input type="number" value={config.capitalTotalUSD} onChange={(e) => setConfig({ ...config, capitalTotalUSD: parseFloat(e.target.value) || 0 })} className="w-full bg-slate-800/50 border border-slate-700/30 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-[#00D9FF]/50 mt-1" />
            </div>
            <div>
              <label className="text-[8px] text-slate-500 uppercase">Riesgo por Op. (%)</label>
              <input type="number" value={config.riesgoPorOperacion * 100} onChange={(e) => setConfig({ ...config, riesgoPorOperacion: (parseFloat(e.target.value) || 1) / 100 })} className="w-full bg-slate-800/50 border border-slate-700/30 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-[#00D9FF]/50 mt-1" step="0.1" />
            </div>
            <div>
              <label className="text-[8px] text-slate-500 uppercase">Par Base</label>
              <select value={config.parBase} onChange={(e) => setConfig({ ...config, parBase: e.target.value })} className="w-full bg-slate-800/50 border border-slate-700/30 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-[#00D9FF]/50 mt-1">
                <option>USDT</option>
                <option>USDC</option>
                <option>BUSD</option>
              </select>
            </div>
            <div>
              <label className="text-[8px] text-slate-500 uppercase">Modo</label>
              <select value={config.modo} onChange={(e) => setConfig({ ...config, modo: e.target.value as any })} className="w-full bg-slate-800/50 border border-slate-700/30 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-[#00D9FF]/50 mt-1">
                <option value="manual">Manual</option>
                <option value="semi-automatico">Semi-Automático</option>
                <option value="automatico">Automático</option>
              </select>
            </div>
          </div>
          <button onClick={handleActualizarConfig} className="mt-3 text-[9px] bg-[#00D9FF]/20 border border-[#00D9FF]/30 px-4 py-1.5 rounded-lg hover:bg-[#00D9FF]/30 transition-colors">
            Actualizar Configuración
          </button>
        </div>

        {/* Analizador */}
        <div className="p-4 rounded-2xl glass border border-slate-800/30 mb-6">
          <h2 className="text-xs font-bold mb-3 flex items-center gap-2"><BarChart3 className="w-3 h-4 text-[#00D9FF]" /> Analizador de Mercado</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="text-[8px] text-slate-500 uppercase">BTC/USDT</label>
              <input type="number" value={btcPrice} onChange={(e) => setBtcPrice(parseFloat(e.target.value) || 0)} className="w-full bg-slate-800/50 border border-slate-700/30 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-[#00D9FF]/50 mt-1" />
            </div>
            <div>
              <label className="text-[8px] text-slate-500 uppercase">Tendencia</label>
              <select value={tendencia} onChange={(e) => setTendencia(e.target.value as any)} className="w-full bg-slate-800/50 border border-slate-700/30 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-[#00D9FF]/50 mt-1">
                <option value="alcista">Alcista 📈</option>
                <option value="bajista">Bajista 📉</option>
                <option value="lateral">Lateral ↔️</option>
              </select>
            </div>
            <div>
              <label className="text-[8px] text-slate-500 uppercase">RSI (0-100)</label>
              <input type="number" value={rsi} onChange={(e) => setRsi(Math.min(100, Math.max(0, parseInt(e.target.value) || 50)))} className="w-full bg-slate-800/50 border border-slate-700/30 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-[#00D9FF]/50 mt-1" />
            </div>
            <div>
              <label className="text-[8px] text-slate-500 uppercase">Volumen Relativo</label>
              <input type="number" value={volumen} onChange={(e) => setVolumen(parseFloat(e.target.value) || 1)} className="w-full bg-slate-800/50 border border-slate-700/30 rounded-lg px-2 py-1.5 text-[10px] focus:outline-none focus:border-[#00D9FF]/50 mt-1" step="0.1" />
            </div>
          </div>
          <button onClick={handleGenerarAnalisis} className="text-[9px] bg-emerald-500/20 border border-emerald-500/30 px-4 py-1.5 rounded-lg hover:bg-emerald-500/30 transition-colors flex items-center gap-2">
            <Zap className="w-3 h-3" /> Generar Señal
          </button>

          {senal && (
            <div className={`mt-4 p-4 rounded-xl border ${senal.tipo === "compra" ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {senal.tipo === "compra" ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
                  <span className="font-bold">{senal.tipo === "compra" ? "COMPRA" : "VENTA"} {senal.activo}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${senal.confianza > 0.7 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                  {Math.round(senal.confianza * 100)}% confianza
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] mb-2">
                <div><span className="text-slate-500">Entrada:</span> <span className="font-mono">${senal.precioEntrada.toFixed(2)}</span></div>
                <div><span className="text-emerald-500">TP:</span> <span className="font-mono">${senal.takeProfit.toFixed(2)}</span></div>
                <div><span className="text-red-500">SL:</span> <span className="font-mono">${senal.stopLoss.toFixed(2)}</span></div>
              </div>
              <p className="text-[9px] text-slate-400 mb-3">{senal.razon}</p>
              <p className="text-[9px] text-slate-500 mb-3">Cantidad: ${senal.cantidadUSD.toFixed(2)} USD ({((senal.cantidadUSD / config.capitalTotalUSD) * 100).toFixed(1)}% del capital)</p>
              <div className="flex gap-2">
                <button onClick={() => handleAprobar(senal)} className="text-[9px] bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded-lg hover:bg-blue-500/30 transition-colors">Aprobar</button>
                <button onClick={() => handleEjecutar(senal)} className="text-[9px] bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-lg hover:bg-emerald-500/30 transition-colors">Ejecutar</button>
                <button onClick={() => setSenal(null)} className="text-[9px] bg-slate-800/50 border border-slate-700/30 px-3 py-1 rounded-lg hover:bg-slate-700/30 transition-colors">Rechazar</button>
              </div>
            </div>
          )}
        </div>

        {/* Operaciones recientes */}
        <div className="p-4 rounded-2xl glass border border-slate-800/30">
          <h2 className="text-xs font-bold mb-3 flex items-center gap-2"><DollarSign className="w-3 h-4 text-[#00D9FF]" /> Historial de Operaciones</h2>
          {operaciones.length === 0 ? (
            <p className="text-[10px] text-slate-500">No hay operaciones registradas. Genera y ejecuta tu primera señal.</p>
          ) : (
            <div className="space-y-1">
              {operaciones.slice(0, 10).map((op) => (
                <div key={op.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/20">
                  <div className="flex items-center gap-3">
                    <span className={op.tipo === "compra" ? "text-emerald-400" : "text-red-400"}>
                      {op.tipo === "compra" ? "COMPRA" : "VENTA"}
                    </span>
                    <span className="text-[10px] font-bold">{op.activo}</span>
                    <span className="text-[9px] text-slate-500">{new Date(op.apertura).toLocaleDateString("es")}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono">${op.precioEntrada.toFixed(2)}</p>
                    <p className={`text-[9px] ${op.resultadoUSD && op.resultadoUSD > 0 ? "text-emerald-400" : op.resultadoUSD && op.resultadoUSD < 0 ? "text-red-400" : "text-slate-500"}`}>
                      {op.resultadoUSD ? `${op.resultadoUSD >= 0 ? "+" : ""}${op.resultadoUSD.toFixed(2)} (${op.resultadoPct?.toFixed(2)}%)` : "Abierta"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Regla de oro */}
        <div className="mt-6 p-4 rounded-2xl glass border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-amber-400" />
            <p className="text-[10px] font-bold text-amber-400">Regla de Oro — 1%</p>
          </div>
          <p className="text-[9px] text-slate-400">
            Nunca arriesgar más del 1% del capital total por operación. Esta es la clave de la longevidad financiera. 
            BTC + Top 10 por Market Cap. USDT como base 24/7. Robinhood para acciones. Todo supervisado por ELIANA.
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, TrendingUp, Calculator, RefreshCw, ExternalLink } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getRates, calculateMSM, type RateSnapshot } from "@/lib/tasas"

export default function TasasPage() {
  usePageTitle("Tasas Cuba")
  const [rates, setRates] = useState<RateSnapshot[]>([])
  const [calc, setCalc] = useState({ monto: 100, tasaCliente: 650, tasaProveedor: 620, comisiones: 0, costos: 0 })

  useEffect(() => {
    setRates(getRates())
  }, [])

  const result = calculateMSM(calc.monto, calc.tasaCliente, calc.tasaProveedor, calc.comisiones, calc.costos)

  const typeLabel: Record<string, string> = {
    BUY: "COMPRA",
    SELL: "VENTA",
    REFERENCE: "REFERENCIA",
    MSM_BUY: "MSM COMPRA",
    MSM_SELL: "MSM VENTA",
  }

  const typeColor: Record<string, string> = {
    BUY: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    SELL: "bg-red-500/10 text-red-400 border-red-500/30",
    REFERENCE: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    MSM_BUY: "bg-[#D6A83A]/10 text-[#D6A83A] border-[#D6A83A]/30",
    MSM_SELL: "bg-[#D6A83A]/10 text-[#D6A83A] border-[#D6A83A]/30",
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver a Admin
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-[#00D9FF]" /> Tasas de Cambio — Cuba
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Comparativo elTOQUE · BCC · CADECA · MSM — cada valor con fuente, fecha y tipo
          </p>
        </div>

        {/* Advertencia operativa */}
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
          ⚠️ Las tasas cambian durante el día. Consultar fuentes en tiempo real antes de calcular u operar.
          Toda tasa MSM requiere aprobación humana. Nunca ejecutar operaciones automáticamente.
        </div>

        {/* Tabla comparativa */}
        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden mb-10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-zinc-400">
                <th className="p-3">Fuente</th>
                <th className="p-3">Par</th>
                <th className="p-3">Tipo</th>
                <th className="p-3 text-right">Tasa</th>
                <th className="p-3">Observada</th>
                <th className="p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {rates.map(r => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3 font-medium">
                    {r.sourceUrl ? (
                      <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-[#00D9FF]">
                        {r.source} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : r.source}
                  </td>
                  <td className="p-3 font-mono">{r.baseCurrency}/{r.quoteCurrency}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] border ${typeColor[r.rateType]}`}>
                      {typeLabel[r.rateType]}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-lg">{r.rate}</td>
                  <td className="p-3 text-zinc-500 text-xs">
                    {new Date(r.observedAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="p-3">
                    <span className={`text-xs ${r.status === "APPROVED" ? "text-emerald-400" : "text-amber-400"}`}>
                      {r.status === "APPROVED" ? "✓ Aprobada" : "⏳ Pendiente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculadora MSM */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <Calculator className="w-5 h-5 text-[#D6A83A]" /> Calculadora MSM
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Monto (divisa)</label>
              <input type="number" value={calc.monto}
                onChange={(e) => setCalc({ ...calc, monto: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF] font-mono" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Tasa cliente</label>
              <input type="number" value={calc.tasaCliente}
                onChange={(e) => setCalc({ ...calc, tasaCliente: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF] font-mono" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Tasa proveedor</label>
              <input type="number" value={calc.tasaProveedor}
                onChange={(e) => setCalc({ ...calc, tasaProveedor: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF] font-mono" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Comisiones</label>
              <input type="number" value={calc.comisiones}
                onChange={(e) => setCalc({ ...calc, comisiones: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF] font-mono" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Costos op.</label>
              <input type="number" value={calc.costos}
                onChange={(e) => setCalc({ ...calc, costos: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF] font-mono" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center">
              <div className="text-xs text-zinc-400">Monto CUP</div>
              <div className="text-xl font-bold font-mono text-blue-400 mt-1">
                {result.montoCUP.toLocaleString("es-ES", { maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#D6A83A]/10 border border-[#D6A83A]/30 text-center">
              <div className="text-xs text-zinc-400">Ganancia Bruta</div>
              <div className="text-xl font-bold font-mono text-[#D6A83A] mt-1">
                {result.gananciaBruta.toLocaleString("es-ES", { maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <div className="text-xs text-zinc-400">Ganancia Neta</div>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                {result.gananciaNeta.toLocaleString("es-ES", { maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-8 flex items-center justify-center gap-2">
          <RefreshCw className="w-3 h-3" />
          Sellos simbólicos 369 · 777 — no alteran las matemáticas. Historial completo preservado.
        </p>
      </div>
    </div>
  )
}

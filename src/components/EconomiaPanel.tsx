'use client'

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { DollarSign, TrendingUp, ShoppingCart, X, Check, AlertCircle } from "lucide-react"

type Operacion = {
  id: string
  tipo: "venta" | "cancelacion" | "compra"
  monto: number
  concepto: string
  estado: "pendiente" | "confirmada" | "fallida"
  fecha: number
}

export default function EconomiaPanel() {
  const [ops, setOps] = useState<Operacion[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const raw = localStorage.getItem("zafiro_economia")
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })
  const [showForm, setShowForm] = useState(false)
  const [monto, setMonto] = useState("")
  const [concepto, setConcepto] = useState("")

  useEffect(() => {
    localStorage.setItem("zafiro_economia", JSON.stringify(ops))
  }, [ops])

  const crear = (tipo: Operacion["tipo"]) => {
    if (!monto || !concepto) return
    const op: Operacion = {
      id: crypto.randomUUID(),
      tipo,
      monto: parseFloat(monto),
      concepto,
      estado: "pendiente",
      fecha: Date.now(),
    }
    setOps((prev) => [op, ...prev])
    setMonto("")
    setConcepto("")
    setShowForm(false)
    setTimeout(() => {
      setOps((prev) =>
        prev.map((o) => (o.id === op.id ? { ...o, estado: "confirmada" } : o))
      )
    }, 1500)
  }

  const totalVentas = ops.filter((o) => o.tipo === "venta" && o.estado === "confirmada")
    .reduce((s, o) => s + o.monto, 0)

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="text-[#00D9FF]" size={20} />
        <h2 className="text-lg font-bold">MSM Economía</h2>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <TrendingUp size={18} className="mx-auto text-green-400 mb-1" />
          <div className="text-lg font-bold">${totalVentas.toFixed(2)}</div>
          <div className="text-xs text-slate-400">Ventas</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <ShoppingCart size={18} className="mx-auto text-orange-400 mb-1" />
          <div className="text-lg font-bold">{ops.length}</div>
          <div className="text-xs text-slate-400">Operaciones</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3 text-center">
          <AlertCircle size={18} className="mx-auto text-yellow-400 mb-1" />
          <div className="text-lg font-bold">{ops.filter((o) => o.estado === "pendiente").length}</div>
          <div className="text-xs text-slate-400">Pendientes</div>
        </div>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full py-2 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] text-sm mb-4 hover:bg-[#00D9FF]/20"
      >
        {showForm ? "Cerrar" : "Nueva Operación"}
      </button>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-lg p-4 mb-4 space-y-3"
        >
          <input
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            type="number"
            step="0.01"
            placeholder="Monto"
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
          />
          <input
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            placeholder="Concepto"
            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button onClick={() => crear("venta")} className="flex-1 py-2 rounded bg-green-600 text-white text-sm">Venta</button>
            <button onClick={() => crear("compra")} className="flex-1 py-2 rounded bg-blue-600 text-white text-sm">Compra</button>
            <button onClick={() => crear("cancelacion")} className="flex-1 py-2 rounded bg-red-600 text-white text-sm">Cancelar</button>
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        {ops.map((op) => (
          <motion.div
            key={op.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between bg-slate-800/30 rounded-lg p-3"
          >
            <div>
              <div className="text-sm font-medium">{op.concepto}</div>
              <div className="text-xs text-slate-400">
                ${op.monto.toFixed(2)} — {op.tipo}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {op.estado === "confirmada" ? (
                <Check size={14} className="text-green-400" />
              ) : op.estado === "fallida" ? (
                <X size={14} className="text-red-400" />
              ) : (
                <div className="w-3 h-3 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
              )}
              {op.estado}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

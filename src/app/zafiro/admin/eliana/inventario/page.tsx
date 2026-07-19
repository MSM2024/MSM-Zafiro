'use client'

import { useState } from 'react'
import { usePageTitle } from '@/lib/usePageTitle'
import {
  getMovimientos, addMovimiento, confirmarMovimiento, corregirMovimiento,
  getResumenInventario, getAlertasInventario,
  type MovimientoInventario, type MovimientoCategoria,
  type MovimientoDireccion, type MonedaTipo,
} from '@/lib/eliana/omnicanal'
import {
  Package, Plus, CheckCircle, AlertTriangle, TrendingUp, TrendingDown,
  DollarSign, Edit2, Search, Filter,
} from 'lucide-react'

export default function InventarioPage() {
  usePageTitle('Inventario Vivo — ELIANA')
  const [movimientos, setMovimientos] = useState(() => getMovimientos())
  const [resumen] = useState(() => getResumenInventario())
  const [alertas] = useState(() => getAlertasInventario())
  const [filtroCat, setFiltroCat] = useState<string>('')
  const [filtroMon, setFiltroMon] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState({
    categoria: 'producto' as MovimientoCategoria, direccion: 'entrada' as MovimientoDireccion,
    concepto: '', cantidad: 1, moneda: 'USD' as MonedaTipo, monto: 0,
    responsable: '', evidencia: '',
  })

  const filtered = movimientos.filter(m => {
    if (filtroCat && m.categoria !== filtroCat) return false
    if (filtroMon && m.moneda !== filtroMon) return false
    return true
  })

  const handleSubmit = () => {
    addMovimiento({ ...form, fecha: new Date().toISOString(), estado: 'pendiente' })
    setShowForm(false)
    setForm({ categoria: 'producto', direccion: 'entrada', concepto: '', cantidad: 1, moneda: 'USD', monto: 0, responsable: '', evidencia: '' })
    setMovimientos(getMovimientos())
  }

  const handleConfirm = (id: string) => {
    confirmarMovimiento(id)
    setMovimientos(getMovimientos())
  }

  const handleCorregir = (id: string) => {
    const m = movimientos.find(mm => mm.id === id)
    if (!m || editing === id) return
    const nuevaCant = prompt('Nueva cantidad:', String(m.cantidad))
    if (!nuevaCant) return
    const nuevoMonto = prompt('Nuevo monto:', String(m.monto))
    if (!nuevoMonto) return
    corregirMovimiento(id, { cantidad: Number(nuevaCant), monto: Number(nuevoMonto) })
    setEditing(null)
    setMovimientos(getMovimientos())
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
              Inventario Vivo
            </h1>
            <p className="text-xs text-slate-400">{movimientos.length} movimientos · {resumen.pendientes} pendientes</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 text-xs bg-[#0A0B1A] border border-emerald-500/20 rounded-lg px-4 py-2 text-emerald-400 hover:border-emerald-500/40 transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Nuevo Movimiento
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(resumen.porMoneda).map(([moneda, datos]) => (
            <div key={moneda} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3">
              <span className="text-[9px] text-slate-500 font-mono">{moneda}</span>
              <p className={`text-sm font-bold mt-1 ${datos.saldo >= 0 ? 'text-white' : 'text-red-400'}`}>
                ${datos.saldo.toFixed(0)}
              </p>
              <div className="flex items-center gap-2 text-[9px] mt-1">
                <span className="text-emerald-400">+${datos.entradas.toFixed(0)}</span>
                <span className="text-red-400">-${datos.salidas.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>

        {alertas.length > 0 && (
          <div className="space-y-1.5">
            {alertas.map((a, i) => (
              <div key={i} className={`flex items-center gap-2 text-xs p-2 rounded-lg ${
                a.severidad === 'alta' ? 'bg-red-500/5 text-red-400' : 'bg-amber-500/5 text-amber-400'
              }`}>
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> {a.mensaje}
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4">Registrar Movimiento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(['categoria', 'direccion', 'concepto', 'cantidad', 'moneda', 'monto', 'responsable', 'evidencia'] as const).map(f => (
                <div key={f}>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{f}</label>
                  {f === 'categoria' ? (
                    <select value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria: e.target.value as MovimientoCategoria }))}
                      className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none">
                      {['producto', 'equipo', 'comision', 'gasto', 'apartado', 'transferencia'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  ) : f === 'direccion' ? (
                    <select value={form.direccion} onChange={e => setForm(p => ({ ...p, direccion: e.target.value as MovimientoDireccion }))}
                      className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none">
                      <option value="entrada">Entrada</option>
                      <option value="salida">Salida</option>
                    </select>
                  ) : f === 'moneda' ? (
                    <select value={form.moneda} onChange={e => setForm(p => ({ ...p, moneda: e.target.value as MonedaTipo }))}
                      className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none">
                      {['CUP', 'USD', 'EUR', 'MLC', 'USDT'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  ) : f === 'cantidad' ? (
                    <input value={form.cantidad} onChange={e => setForm(p => ({ ...p, cantidad: Number(e.target.value) }))} type="number" min="0"
                      className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none" />
                  ) : f === 'monto' ? (
                    <input value={form.monto} onChange={e => setForm(p => ({ ...p, monto: Number(e.target.value) }))} type="number" step="0.01" min="0"
                      className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none" />
                  ) : (
                    <input value={form[f] as string} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                      className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none" />
                  )}
                </div>
              ))}
            </div>
            <button onClick={handleSubmit}
              className="mt-4 px-5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors cursor-pointer">
              Registrar Movimiento
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          {['producto', 'equipo', 'comision', 'gasto', 'apartado', 'transferencia'].map(cat => (
            <button key={cat} onClick={() => setFiltroCat(filtroCat === cat ? '' : cat)}
              className={`px-2 py-1 rounded-lg text-[9px] font-mono border transition-all cursor-pointer ${
                filtroCat === cat ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-slate-700 text-slate-500 hover:text-white'
              }`}>
              {cat}
            </button>
          ))}
          {['CUP', 'USD', 'EUR', 'MLC', 'USDT'].map(mon => (
            <button key={mon} onClick={() => setFiltroMon(filtroMon === mon ? '' : mon)}
              className={`px-2 py-1 rounded-lg text-[9px] font-mono border transition-all cursor-pointer ${
                filtroMon === mon ? 'border-amber-500/20 bg-amber-500/10 text-amber-400' : 'border-slate-700 text-slate-500 hover:text-white'
              }`}>
              {mon}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-500">Sin movimientos.</div>
          )}
          {filtered.slice().reverse().map(m => (
            <div key={m.id} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4 flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                m.direccion === 'entrada' ? 'bg-emerald-500/10' : 'bg-red-500/10'
              }`}>
                {m.direccion === 'entrada'
                  ? <TrendingUp className="w-5 h-5 text-emerald-400" />
                  : <TrendingDown className="w-5 h-5 text-red-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{m.concepto}</h3>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-mono border text-slate-500 border-slate-700">{m.categoria}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono border ${
                    m.estado === 'confirmado' ? 'border-emerald-500/20 text-emerald-400' :
                    m.estado === 'pendiente' ? 'border-amber-500/20 text-amber-400' : 'border-red-500/20 text-red-400'
                  }`}>{m.estado}</span>
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-[10px] text-slate-500">
                  <span>{m.cantidad}x</span>
                  <span className="font-mono">{m.moneda} ${m.monto.toFixed(2)}</span>
                  {m.responsable && <span>Responsable: {m.responsable}</span>}
                  <span>{new Date(m.fecha).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {m.estado === 'pendiente' && (
                  <button onClick={() => handleConfirm(m.id)}
                    className="text-emerald-400 hover:text-emerald-300 cursor-pointer" title="Confirmar">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                {m.estado !== 'corregido' && m.correccionDe === undefined && (
                  <button onClick={() => handleCorregir(m.id)}
                    className="text-amber-400 hover:text-amber-300 cursor-pointer" title="Corregir">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

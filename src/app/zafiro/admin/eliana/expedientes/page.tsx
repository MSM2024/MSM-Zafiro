'use client'

import { useState } from 'react'
import { usePageTitle } from '@/lib/usePageTitle'
import {
  getExpedientes, addExpediente, addOperacionPendiente, confirmarOperacion,
  addComprobante, addEventoExpediente,
  getDirectorio,
  type Expediente, type EntidadTipo, type MonedaTipo,
} from '@/lib/eliana/omnicanal'
import {
  FileText, FolderOpen, Plus, CheckCircle, XCircle,
  Clock, DollarSign, Eye, Archive,
} from 'lucide-react'

export default function ExpedientesPage() {
  usePageTitle('Expedientes — ELIANA')
  const [expedientes, setExpedientes] = useState(() => getExpedientes())
  const [directorio] = useState(() => getDirectorio())
  const [filtro, setFiltro] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ entityId: '', entityTipo: 'cliente' as EntidadTipo, titulo: '', permisos: '', notas: '' })
  const [opForm, setOpForm] = useState<{ expedienteId: string; tipo: string; descripcion: string; montoUsd: number; moneda: MonedaTipo } | null>(null)

  const filtered = filtro ? expedientes.filter(e => e.estado === filtro) : expedientes

  const handleCreate = () => {
    addExpediente({
      entityId: form.entityId,
      entityTipo: form.entityTipo,
      titulo: form.titulo,
      permisos: form.permisos.split(',').map(p => p.trim()).filter(Boolean),
      estado: 'abierto',
      operacionesPendientes: [],
      comprobantes: [],
      eventos: [],
      notas: form.notas,
    })
    setShowForm(false)
    setForm({ entityId: '', entityTipo: 'cliente', titulo: '', permisos: '', notas: '' })
    setExpedientes(getExpedientes())
  }

  const handleAddOp = () => {
    if (!opForm) return
    addOperacionPendiente(opForm.expedienteId, {
      tipo: opForm.tipo, descripcion: opForm.descripcion,
      montoUsd: opForm.montoUsd, moneda: opForm.moneda, estado: 'pendiente',
    })
    setOpForm(null)
    setExpedientes(getExpedientes())
  }

  const handleConfirmOp = (expId: string, opId: string) => {
    confirmarOperacion(expId, opId)
    setExpedientes(getExpedientes())
  }

  const getEntityName = (id: string) => directorio.find(d => d.id === id)?.nombre || id.slice(0, 8)

  const estados: Array<{ k: string; label: string; color: string }> = [
    { k: '', label: 'Todos', color: 'text-white' },
    { k: 'abierto', label: 'Abiertos', color: 'text-emerald-400' },
    { k: 'pendiente', label: 'Pendientes', color: 'text-amber-400' },
    { k: 'completado', label: 'Completados', color: 'text-[#00D9FF]' },
    { k: 'archivado', label: 'Archivados', color: 'text-slate-500' },
  ]

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
              Expedientes
            </h1>
            <p className="text-xs text-slate-400">{expedientes.length} expedientes · {expedientes.filter(e => e.estado === 'abierto').length} activos</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 text-xs bg-[#0A0B1A] border border-amber-500/20 rounded-lg px-4 py-2 text-amber-400 hover:border-amber-500/40 transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Nuevo Expediente
          </button>
        </div>

        {showForm && (
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4">Crear Expediente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Entidad</label>
                <select value={form.entityTipo} onChange={e => setForm(p => ({ ...p, entityTipo: e.target.value as EntidadTipo }))}
                  className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 outline-none">
                  {['cliente', 'colaborador', 'proveedor', 'grupo', 'canal'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Entidad ID (del Directorio)</label>
                <input value={form.entityId} onChange={e => setForm(p => ({ ...p, entityId: e.target.value }))}
                  className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Título</label>
                <input value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))}
                  className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Permisos (comas)</label>
                <input value={form.permisos} onChange={e => setForm(p => ({ ...p, permisos: e.target.value }))}
                  className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Notas</label>
                <textarea value={form.notas} onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} rows={3}
                  className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:border-amber-500 outline-none" />
              </div>
            </div>
            <button onClick={handleCreate}
              className="mt-4 px-5 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition-colors cursor-pointer">
              Crear Expediente
            </button>
          </div>
        )}

        <div className="flex gap-1">
          {estados.map(e => (
            <button key={e.k} onClick={() => setFiltro(e.k)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                filtro === e.k ? 'bg-amber-500/15 border border-amber-500/20 ' + e.color : 'text-slate-500 hover:text-white hover:bg-slate-900/40'
              }`}>
              {e.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-500">Sin expedientes.</div>
          )}
          {filtered.map(exp => (
            <div key={exp.id} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-semibold">{exp.titulo}</h3>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono border ${
                      exp.estado === 'abierto' ? 'border-emerald-500/20 text-emerald-400' :
                      exp.estado === 'pendiente' ? 'border-amber-500/20 text-amber-400' :
                      exp.estado === 'completado' ? 'border-[#00D9FF]/20 text-[#00D9FF]' :
                      'border-slate-500/20 text-slate-500'
                    }`}>{exp.estado}</span>
                    <span className="text-[9px] text-slate-600 font-mono">{exp.entityTipo}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Entidad: {getEntityName(exp.entityId)}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">
                    Operaciones pendientes ({exp.operacionesPendientes.filter(o => o.estado === 'pendiente').length})
                  </h4>
                  {exp.operacionesPendientes.length === 0 ? (
                    <p className="text-[10px] text-slate-600">Sin operaciones.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {exp.operacionesPendientes.map(op => (
                        <div key={op.id} className="flex items-center gap-2 text-[10px] py-1 border-b border-[#1A1B3A]/30">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            op.estado === 'pendiente' ? 'bg-amber-400' : 'bg-emerald-400'
                          }`} />
                          <span className="text-slate-400 truncate flex-1">{op.descripcion}</span>
                          <span className="font-mono text-slate-300">${op.montoUsd}</span>
                          {op.estado === 'pendiente' && (
                            <button onClick={() => handleConfirmOp(exp.id, op.id)}
                              className="text-emerald-400 hover:text-emerald-300 cursor-pointer">
                              <CheckCircle className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setOpForm({ expedienteId: exp.id, tipo: 'general', descripcion: '', montoUsd: 0, moneda: 'USD' })}
                    className="mt-2 flex items-center gap-1 text-[9px] text-amber-400 hover:text-amber-300 cursor-pointer">
                    <Plus className="w-3 h-3" /> Agregar operación
                  </button>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">
                    Comprobantes ({exp.comprobantes.length})
                  </h4>
                  {exp.comprobantes.length === 0 ? (
                    <p className="text-[10px] text-slate-600">Sin comprobantes.</p>
                  ) : (
                    <div className="space-y-1">
                      {exp.comprobantes.map(c => (
                        <div key={c.id} className="flex items-center gap-2 text-[10px] py-1 border-b border-[#1A1B3A]/30">
                          <span className="text-slate-400">{c.referencia}</span>
                          <span className="font-mono text-slate-300">${c.montoUsd}</span>
                          <span className={`${c.estado === 'verificado' ? 'text-emerald-400' : c.estado === 'rechazado' ? 'text-red-400' : 'text-amber-400'}`}>
                            {c.estado}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {exp.eventos.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#1A1B3A]/30">
                  <div className="flex flex-wrap gap-3">
                    {exp.eventos.slice(-5).map(ev => (
                      <span key={ev.id} className="text-[9px] text-slate-600">
                        <Clock className="w-2.5 h-2.5 inline mr-1" />
                        {ev.accion}: {ev.detalle.slice(0, 40)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {opForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setOpForm(null)}>
            <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-sm font-semibold mb-4">Nueva Operación</h3>
              <div className="space-y-3">
                <input value={opForm.descripcion} onChange={e => setOpForm(p => p ? { ...p, descripcion: e.target.value } : null)}
                  placeholder="Descripción" className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white outline-none" />
                <div className="flex gap-2">
                  <input value={opForm.montoUsd} onChange={e => setOpForm(p => p ? { ...p, montoUsd: Number(e.target.value) } : null)}
                    type="number" step="0.01" placeholder="Monto"
                    className="flex-1 bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white outline-none" />
                  <select value={opForm.moneda} onChange={e => setOpForm(p => p ? { ...p, moneda: e.target.value as MonedaTipo } : null)}
                    className="bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white outline-none">
                    {['CUP', 'USD', 'EUR', 'MLC', 'USDT'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleAddOp}
                    className="flex-1 px-4 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition-colors cursor-pointer">
                    Agregar
                  </button>
                  <button onClick={() => setOpForm(null)}
                    className="px-4 py-2 rounded-lg border border-[#1A1B3A] text-slate-400 text-xs hover:text-white transition-colors cursor-pointer">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

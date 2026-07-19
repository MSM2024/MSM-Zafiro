'use client'

import { useState } from 'react'
import { usePageTitle } from '@/lib/usePageTitle'
import {
  getDirectorio, addDirectorioEntry, updateDirectorioEntry,
  getDirectorioStats,
  type DirectorioEntry, type EntidadTipo, type PaisTipo, type CanalTipo,
} from '@/lib/eliana/omnicanal'
import {
  Users, UserPlus, Search, Phone, Mail, Globe, MapPin,
  CheckCircle, XCircle, Edit2, Filter,
} from 'lucide-react'

export default function DirectorioPage() {
  usePageTitle('Directorio Único — ELIANA')
  const [entries, setEntries] = useState(() => getDirectorio())
  const [stats] = useState(() => getDirectorioStats())
  const [filtro, setFiltro] = useState<{ tipo?: string; pais?: string; activo?: string }>({})
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ tipo: 'cliente' as EntidadTipo, nombre: '', alias: '', pais: 'Cuba' as PaisTipo, ciudad: '', telefono: '', email: '', canalPreferido: 'whatsapp' as CanalTipo, tags: '', permisos: '', notas: '' })

  const applyFiltro = () => {
    let result = getDirectorio()
    if (filtro.tipo) result = result.filter(e => e.tipo === filtro.tipo)
    if (filtro.pais) result = result.filter(e => e.pais === filtro.pais)
    if (filtro.activo !== '') result = result.filter(e => e.activo === (filtro.activo === 'true'))
    if (search) result = result.filter(e => e.nombre.toLowerCase().includes(search.toLowerCase()) || e.telefono.includes(search) || e.email.toLowerCase().includes(search.toLowerCase()))
    setEntries(result)
  }

  const handleSubmit = () => {
    addDirectorioEntry({
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      permisos: form.permisos.split(',').map(p => p.trim()).filter(Boolean),
      activo: true,
    })
    setShowForm(false)
    setForm({ tipo: 'cliente', nombre: '', alias: '', pais: 'Cuba', ciudad: '', telefono: '', email: '', canalPreferido: 'whatsapp', tags: '', permisos: '', notas: '' })
    applyFiltro()
  }

  const toggleActivo = (id: string, activo: boolean) => {
    updateDirectorioEntry(id, { activo })
    applyFiltro()
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-[#00D9FF] bg-clip-text text-transparent">
              Directorio Único
            </h1>
            <p className="text-xs text-slate-400">{stats.total} contactos · {Object.entries(stats.porPais).map(([p, c]) => `${p}: ${c}`).join(' · ')}</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 text-xs bg-[#0A0B1A] border border-purple-500/20 rounded-lg px-4 py-2 text-purple-400 hover:border-purple-500/40 transition-colors cursor-pointer">
            <UserPlus className="w-3.5 h-3.5" /> {showForm ? 'Cerrar' : 'Nuevo'}
          </button>
        </div>

        {showForm && (
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4">Nuevo Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(['tipo', 'nombre', 'alias', 'pais', 'ciudad', 'telefono', 'email', 'canalPreferido', 'tags', 'permisos', 'notas'] as const).map(f => (
                <div key={f}>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{f}</label>
                  {f === 'tipo' ? (
                    <select value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value as EntidadTipo }))}
                      className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 outline-none">
                      {['cliente', 'colaborador', 'proveedor', 'grupo', 'canal'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  ) : f === 'pais' ? (
                    <select value={form.pais} onChange={e => setForm(p => ({ ...p, pais: e.target.value as PaisTipo }))}
                      className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 outline-none">
                      {['Cuba', 'USA', 'Panama', 'Mexico', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  ) : f === 'canalPreferido' ? (
                    <select value={form.canalPreferido} onChange={e => setForm(p => ({ ...p, canalPreferido: e.target.value as CanalTipo }))}
                      className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 outline-none">
                      {['whatsapp', 'web', 'telegram', 'voice', 'grupal'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  ) : (
                    <input value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                      placeholder={f === 'tags' ? 'comas, separados' : f === 'permisos' ? 'comas, separados' : ''}
                      className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-xs text-white focus:border-purple-500 outline-none" />
                  )}
                </div>
              ))}
            </div>
            <button onClick={handleSubmit}
              className="mt-4 px-5 py-2 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-colors cursor-pointer">
              Guardar Contacto
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input value={search} onChange={e => { setSearch(e.target.value); setTimeout(applyFiltro, 0) }}
              placeholder="Buscar por nombre, teléfono o email..."
              className="w-full bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-[#00D9FF]/30 outline-none" />
          </div>
          {['tipo', 'pais'].map(f => (
            <select key={f} value={filtro[f as keyof typeof filtro] || ''} onChange={e => { setFiltro(p => ({ ...p, [f]: e.target.value })); setTimeout(applyFiltro, 0) }}
              className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg px-3 py-2 text-[10px] text-slate-400 outline-none">
              <option value="">{`Todos ${f}`}</option>
              {(f === 'tipo' ? ['cliente', 'colaborador', 'proveedor', 'grupo', 'canal'] : ['Cuba', 'USA', 'Panama', 'Mexico', 'Other']).map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          ))}
          <select value={filtro.activo ?? ''} onChange={e => { setFiltro(p => ({ ...p, activo: e.target.value })); setTimeout(applyFiltro, 0) }}
            className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg px-3 py-2 text-[10px] text-slate-400 outline-none">
            <option value="">Todos estado</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>

        <div className="space-y-2">
          {entries.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-500">Sin resultados.</div>
          )}
          {entries.map(e => (
            <div key={e.id} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4 flex items-start gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                e.tipo === 'cliente' ? 'bg-blue-500/10 text-blue-400' :
                e.tipo === 'colaborador' ? 'bg-emerald-500/10 text-emerald-400' :
                e.tipo === 'proveedor' ? 'bg-amber-500/10 text-amber-400' : 'bg-purple-500/10 text-purple-400'
              }`}>
                {e.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{e.nombre}</h3>
                  {e.alias && <span className="text-[10px] text-slate-500">«{e.alias}»</span>}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono border ${
                    e.activo ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-red-500/5 border-red-500/20 text-red-400'
                  }`}>
                    {e.activo ? 'activo' : 'inactivo'}
                  </span>
                  <span className="text-[9px] text-slate-600 font-mono uppercase">{e.tipo}</span>
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-[10px] text-slate-500">
                  {e.telefono && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{e.telefono}</span>}
                  {e.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{e.email}</span>}
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.ciudad}, {e.pais}</span>
                  {e.canalPreferido && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{e.canalPreferido}</span>}
                </div>
                {e.tags.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {e.tags.map(t => <span key={t} className="text-[8px] px-1.5 py-0.5 rounded bg-[#1A1B3A] text-slate-400 border border-[#2A2B4A] font-mono">{t}</span>)}
                  </div>
                )}
              </div>
              <button onClick={() => toggleActivo(e.id, !e.activo)} className="text-slate-600 hover:text-white cursor-pointer" title={e.activo ? 'Desactivar' : 'Activar'}>
                {e.activo ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

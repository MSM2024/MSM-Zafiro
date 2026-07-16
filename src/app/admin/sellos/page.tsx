'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import {
  BookOpen, ArrowLeft, Plus, Edit3, Eye, Clock, CheckCircle, Archive,
  Search, Filter, Trash2, Save, X, Sparkles
} from 'lucide-react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import { getSeals, saveSeals, getSealByNumber, SEED_SEALS, THEMES, type Seal } from '@/lib/seals-data'

export default function AdminSellosPage() {
  usePageTitle('Admin — Sellos — ZAFIRO')
  const router = useRouter()

  useEffect(() => {
    const session = getSession()
    if (!session || session.email !== 'msmmystore@gmail.com') {
      router.replace('/')
    }
  }, [router])

  const [seals, setSeals] = useState<Seal[]>([])
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Seal | null>(null)
  const [showNew, setShowNew] = useState(false)

  useEffect(() => {
    setSeals(getSeals())
  }, [])

  const filtered = seals.filter(s => {
    if (filter !== 'all' && s.estado !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return s.versiculo.toLowerCase().includes(q) || s.tema.toLowerCase().includes(q) || s.referencia.toLowerCase().includes(q)
    }
    return true
  }).sort((a, b) => a.orden - b.orden)

  const handleSave = (seal: Seal) => {
    const idx = seals.findIndex(s => s.numero === seal.numero)
    const updated = [...seals]
    if (idx >= 0) updated[idx] = seal
    else updated.push(seal)
    saveSeals(updated)
    setSeals(updated)
    setEditing(null)
    setShowNew(false)
  }

  const handleDelete = (num: number) => {
    if (!confirm(`¿Eliminar el Sello #${num}?`)) return
    const updated = seals.filter(s => s.numero !== num)
    saveSeals(updated)
    setSeals(updated)
  }

  const newSealTemplate: Seal = {
    numero: seals.length > 0 ? Math.max(...seals.map(s => s.numero)) + 1 : 151,
    slug: `salmo-nuevo`,
    referencia: 'Salmo :',
    versiculo: '',
    tema: '',
    reflexion: '',
    declaracion: '',
    oracion: '',
    pregunta: '',
    accion: '',
    estado: 'draft',
    orden: seals.length + 1,
  }

  const statusColors = {
    draft: 'bg-zinc-800 text-zinc-400',
    published: 'bg-emerald-500/20 text-emerald-400',
    archived: 'bg-amber-500/20 text-amber-400',
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/admin')} className="text-zinc-500 hover:text-[#00D9FF]">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-amber-400" /> Panel Editorial de Sellos
              </h1>
              <p className="text-sm text-zinc-500">{seals.length} sellos en total</p>
            </div>
          </div>
          <button
            onClick={() => { setShowNew(true); setEditing(null) }}
            className="flex items-center gap-2 px-4 py-2 bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 rounded-xl text-sm hover:bg-[#00D9FF]/30 transition-all"
          >
            <Plus className="w-4 h-4" /> Nuevo sello
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar sellos..."
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#00D9FF]/50"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'draft', 'published', 'archived'] as const).map(f => (
              <button key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all capitalize ${filter === f ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30' : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700 border border-transparent'}`}
              >
                {f === 'all' ? 'Todos' : f === 'draft' ? 'Borradores' : f === 'published' ? 'Publicados' : 'Archivados'}
              </button>
            ))}
          </div>
        </div>

        {/* Editor modal */}
        {(editing || showNew) && (
          <SealEditor
            seal={showNew ? newSealTemplate : editing!}
            onSave={handleSave}
            onClose={() => { setEditing(null); setShowNew(false) }}
          />
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500 border-b border-zinc-800">
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">Referencia</th>
                <th className="pb-3 font-medium">Versículo</th>
                <th className="pb-3 font-medium">Tema</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((seal, idx) => (
                <motion.tr
                  key={seal.numero}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className="border-b border-zinc-800/50 hover:bg-zinc-900/30"
                >
                  <td className="py-3 font-mono text-zinc-400">{seal.numero}</td>
                  <td className="py-3 text-zinc-300">{seal.referencia}</td>
                  <td className="py-3 text-zinc-400 max-w-xs truncate">{seal.versiculo}</td>
                  <td className="py-3">
                    <span className="text-xs text-[#00D9FF]">{seal.tema}</span>
                  </td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[seal.estado]}`}>
                      {seal.estado === 'draft' ? 'Borrador' : seal.estado === 'published' ? 'Publicado' : 'Archivado'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditing(seal); setShowNew(false) }}
                        className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-[#00D9FF] hover:bg-zinc-700 transition-all">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(seal.numero)}
                        className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <a href={`/sellos/${seal.numero}`} target="_blank"
                        className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-amber-400 hover:bg-zinc-700 transition-all">
                        <Eye className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-zinc-500">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No se encontraron sellos con este filtro.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SealEditor({ seal, onSave, onClose }: { seal: Seal; onSave: (s: Seal) => void; onClose: () => void }) {
  const [form, setForm] = useState<Seal>({ ...seal })

  const set = (key: keyof Seal, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...form,
      slug: form.slug || `salmo-${form.numero}`,
      orden: form.orden || form.numero,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center overflow-y-auto pt-10 pb-20"
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-3xl mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {seal.numero ? <><Edit3 className="w-5 h-5 text-[#00D9FF]" /> Editar Sello #{seal.numero}</> : <><Plus className="w-5 h-5 text-[#00D9FF]" /> Nuevo Sello</>}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Número" value={String(form.numero)} onChange={v => set('numero', v)} type="number" />
            <Field label="Referencia (Salmo X:Y)" value={form.referencia} onChange={v => set('referencia', v)} />
            <Field label="Slug" value={form.slug} onChange={v => set('slug', v)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ThemeSelect value={form.tema} onChange={v => set('tema', v)} />
            <StatusSelect value={form.estado} onChange={v => set('estado', v as Seal['estado'])} />
          </div>

          <TextArea label="Versículo" value={form.versiculo} onChange={v => set('versiculo', v)} rows={2} />
          <TextArea label="Reflexión" value={form.reflexion} onChange={v => set('reflexion', v)} rows={4} />
          <TextArea label="Declaración de fe" value={form.declaracion} onChange={v => set('declaracion', v)} rows={3} />
          <TextArea label="Oración" value={form.oracion} onChange={v => set('oracion', v)} rows={3} />
          <TextArea label="Pregunta de meditación" value={form.pregunta} onChange={v => set('pregunta', v)} rows={2} />
          <TextArea label="Acción práctica" value={form.accion} onChange={v => set('accion', v)} rows={2} />
          <Field label="Orden" value={String(form.orden)} onChange={v => set('orden', v)} type="number" />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-all text-sm">
              Cancelar
            </button>
            <button type="submit"
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 hover:bg-[#00D9FF]/30 transition-all text-sm font-medium">
              <Save className="w-4 h-4" /> Guardar Sello
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-xs text-zinc-500 mb-1 block">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2.5 px-3 text-sm text-zinc-200 focus:outline-none focus:border-[#00D9FF]/50" />
    </div>
  )
}

function TextArea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="text-xs text-zinc-500 mb-1 block">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2.5 px-3 text-sm text-zinc-200 focus:outline-none focus:border-[#00D9FF]/50 resize-y" />
    </div>
  )
}

function ThemeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-zinc-500 mb-1 block">Tema</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2.5 px-3 text-sm text-zinc-200 focus:outline-none focus:border-[#00D9FF]/50">
        <option value="">Selecciona un tema</option>
        {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>
  )
}

function StatusSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-zinc-500 mb-1 block">Estado</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2.5 px-3 text-sm text-zinc-200 focus:outline-none focus:border-[#00D9FF]/50">
        <option value="draft">Borrador</option>
        <option value="published">Publicado</option>
        <option value="archived">Archivado</option>
      </select>
    </div>
  )
}

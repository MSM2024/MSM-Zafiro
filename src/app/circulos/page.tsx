'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { useRouter } from 'next/navigation'
import { getCirclesList, createCircle, getCategories, getCircleStats, getCircleCover } from '@/lib/circles'
import { getSession } from '@/lib/auth'
import { Plus, Search, Users, Globe, Lock, Hash, UserPlus } from 'lucide-react'

export default function CirculosPage() {
  usePageTitle('Círculos — ZAFIRO')
  const router = useRouter()
  const session = typeof window !== 'undefined' ? getSession() : null
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<{ name: string; description: string; category: string; tags: string; visibility: 'public' | 'private' }>({ name: '', description: '', category: 'General', tags: '', visibility: 'public' })

  const circles = getCirclesList({ search: search || undefined, category: category || undefined })
  const stats = getCircleStats()
  const categories = getCategories()

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !session) return
    createCircle({
      name: form.name.trim(), description: form.description.trim(),
      category: form.category, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      authorId: session.email || '', authorName: session.name || 'Usuario',
      visibility: form.visibility,
    })
    setForm({ name: '', description: '', category: 'General', tags: '', visibility: 'public' })
    setShowCreate(false)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#00D9FF] to-purple-400 bg-clip-text text-transparent">
            Círculos
          </h1>
          {session && (
            <button onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-1.5 bg-[#00D9FF]/10 text-[#00D9FF] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#00D9FF]/20 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Crear Círculo
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
            <Users className="w-4 h-4 text-[#00D9FF] mx-auto mb-1" />
            <p className="text-lg font-bold text-[#00D9FF]">{stats.total}</p>
            <p className="text-[10px] text-slate-400">Círculos</p>
          </div>
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
            <UserPlus className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-emerald-400">{stats.members}</p>
            <p className="text-[10px] text-slate-400">Miembros</p>
          </div>
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
            <Hash className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-amber-400">{stats.categories}</p>
            <p className="text-[10px] text-slate-400">Categorías</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar círculos..."
              className="w-full bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50"
            />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-[#00D9FF]/50">
            <option value="">Todas</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {showCreate && session && (
          <form onSubmit={handleCreate} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4 mb-4 space-y-3">
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre del círculo..." maxLength={100}
              className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50"
            />
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción..." rows={2} maxLength={500}
              className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50 resize-none"
            />
            <div className="flex items-center gap-3">
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="bg-[#050816] border border-[#1A1B3A] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#00D9FF]/50">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={form.visibility} onChange={e => setForm(f => ({ ...f, visibility: e.target.value as 'public' | 'private' }))}
                className="bg-[#050816] border border-[#1A1B3A] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#00D9FF]/50">
                <option value="public">Público</option>
                <option value="private">Privado</option>
              </select>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Tags (coma)" maxLength={100}
                className="bg-[#050816] border border-[#1A1B3A] rounded-lg px-2 py-1.5 text-[10px] text-slate-300 placeholder:text-slate-600 flex-1 focus:outline-none focus:border-[#00D9FF]/50"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowCreate(false)} className="text-xs text-slate-500 hover:text-white px-3 py-1.5">Cancelar</button>
              <button type="submit" disabled={!form.name.trim()} className="bg-[#00D9FF]/10 text-[#00D9FF] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#00D9FF]/20 disabled:opacity-30">
                Crear Círculo
              </button>
            </div>
          </form>
        )}

        {circles.length === 0 ? (
          <div className="text-center py-12 bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl">
            <Users className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No hay círculos aún</p>
            <p className="text-xs text-slate-500 mt-1">Crea el primer círculo temático</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {circles.map(c => (
              <Link key={c.id} href={`/circulos/${c.id}`}
                className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl overflow-hidden hover:border-[#00D9FF]/20 transition-colors group">
                <div className={`h-16 bg-gradient-to-r ${c.coverColor} opacity-60 group-hover:opacity-80 transition-opacity`} />
                <div className="p-4 -mt-8 relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.coverColor} flex items-center justify-center text-lg font-bold shadow-lg mb-2`}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-sm font-medium text-white group-hover:text-[#00D9FF] transition-colors truncate">{c.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.members.length}</span>
                    <span className="flex items-center gap-1">{c.visibility === 'public' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}{c.visibility === 'public' ? 'Público' : 'Privado'}</span>
                    <span>{c.postCount} publicaciones</span>
                  </div>
                  {c.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {c.tags.slice(0, 3).map(t => (
                        <span key={t} className="text-[9px] text-[#00D9FF] bg-[#00D9FF]/5 px-1.5 py-0.5 rounded-full">#{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

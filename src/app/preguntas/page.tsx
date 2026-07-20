'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { useRouter } from 'next/navigation'
import { getQuestionsList, getQaStats, createQuestion } from '@/lib/qa'
import { getSession } from '@/lib/auth'
import { PageShell } from '@/components/ui/PageShell'
import { Plus, Search, HelpCircle, CheckCircle, MessageSquare, TrendingUp } from 'lucide-react'

export default function PreguntasPage() {
  usePageTitle('Preguntas y Respuestas — ZAFIRO')
  const router = useRouter()
  const session = typeof window !== 'undefined' ? getSession() : null
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'unresolved'>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', tags: '' })

  const questions = getQuestionsList({ search: search || undefined, unresolved: filter === 'unresolved' })
  const stats = getQaStats()

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !session) return
    createQuestion({
      authorId: session.email || '', authorName: session.name || 'Usuario',
      title: form.title.trim(), body: form.body.trim(),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    })
    setForm({ title: '', body: '', tags: '' })
    setShowCreate(false)
    router.refresh()
  }

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#00D9FF] to-purple-400 bg-clip-text text-transparent">
            Preguntas y Respuestas
          </h1>
          {session && (
            <button onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-1.5 bg-[#00D9FF]/10 text-[#00D9FF] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#00D9FF]/20 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Nueva Pregunta
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-[#00D9FF]">{stats.total}</p>
            <p className="text-[10px] text-slate-400">Preguntas</p>
          </div>
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-emerald-400">{stats.answers}</p>
            <p className="text-[10px] text-slate-400">Respuestas</p>
          </div>
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-amber-400">{stats.resolved}</p>
            <p className="text-[10px] text-slate-400">Resueltas</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar preguntas..."
              className="w-full bg-[#0A0B1A] border border-[#1A1B3A] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50"
            />
          </div>
          <button onClick={() => setFilter(f => f === 'all' ? 'unresolved' : 'all')}
            className={`px-3 py-2 rounded-lg text-xs border transition-colors ${filter === 'unresolved' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-[#0A0B1A] text-slate-400 border-[#1A1B3A] hover:text-white'}`}>
            {filter === 'unresolved' ? 'Sin resolver' : 'Todas'}
          </button>
        </div>

        {/* Create Form */}
        {showCreate && session && (
          <form onSubmit={handleCreate} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4 mb-4 space-y-3">
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Título de tu pregunta..." maxLength={200}
              className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50"
            />
            <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Describe tu pregunta en detalle..." rows={4} maxLength={2000}
              className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50 resize-none"
            />
            <div className="flex items-center justify-between">
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="Tags (separados por coma)" maxLength={100}
                className="bg-[#050816] border border-[#1A1B3A] rounded-lg px-2 py-1 text-[10px] text-slate-300 placeholder:text-slate-600 w-48 focus:outline-none focus:border-[#00D9FF]/50"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowCreate(false)} className="text-xs text-slate-500 hover:text-white px-3 py-1.5">Cancelar</button>
                <button type="submit" disabled={!form.title.trim()} className="bg-[#00D9FF]/10 text-[#00D9FF] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#00D9FF]/20 disabled:opacity-30">
                  Publicar Pregunta
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="text-center py-12 bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl">
            <HelpCircle className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No hay preguntas aún</p>
            <p className="text-xs text-slate-500 mt-1">Sé el primero en preguntar</p>
          </div>
        ) : (
          <div className="space-y-2">
            {questions.map(q => (
              <Link key={q.id} href={`/preguntas/${q.id}`}
                className="block bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4 hover:border-[#00D9FF]/20 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="text-center flex-shrink-0 w-12">
                    <p className={`text-lg font-bold ${q.score >= 0 ? 'text-[#00D9FF]' : 'text-red-400'}`}>{q.score}</p>
                    <p className="text-[9px] text-slate-500">votos</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-white truncate">{q.title}</h3>
                      {q.resolved && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{q.body}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-slate-500">{q.answers.length} respuesta{q.answers.length !== 1 ? 's' : ''}</span>
                      <span className="text-[10px] text-slate-500">{q.views} vistas</span>
                      {q.tags.slice(0, 3).map(t => (
                        <span key={t} className="text-[9px] text-[#00D9FF] bg-[#00D9FF]/5 px-1.5 py-0.5 rounded-full">#{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  )
}

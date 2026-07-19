'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import { isOwnerEmail } from '@/lib/owner'
import {
  getAllDocuments, getActiveDocument, addDocument, activateDocument, archiveDocument,
  getLegalAudit, type LegalDocument, type LegalDocType, type LegalAuditEntry,
} from '@/lib/legal/terms-engine'
import { FileText, Plus, CheckCircle, Archive, ArrowLeft } from 'lucide-react'

export default function AdminTerminosPage() {
  usePageTitle('Admin Términos — ZAFIRO')
  const [authorized] = useState(() => {
    const session = getSession()
    return !!(session && isOwnerEmail(session.email))
  })
  const [docs, setDocs] = useState<LegalDocument[]>([])
  const [audit, setAudit] = useState<LegalAuditEntry[]>([])
  const [filter, setFilter] = useState<LegalDocType | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'terms' as LegalDocType, title: '', content: '', summary: '', author: '' })

  useEffect(() => {
    if (!authorized) return
    loadData()
  }, [authorized])

  function loadData() {
    setDocs(getAllDocuments())
    setAudit(getLegalAudit())
  }

  function handleAdd() {
    if (!form.title || !form.content || !form.summary) return
    const doc = addDocument(form.type, form.title, form.content, form.summary, form.author || 'admin')
    activateDocument(doc.id, form.author || 'admin')
    setShowForm(false)
    setForm({ type: 'terms', title: '', content: '', summary: '', author: '' })
    loadData()
  }

  function handleActivate(id: string) {
    activateDocument(id, 'admin')
    loadData()
  }

  function handleArchive(id: string) {
    archiveDocument(id, 'admin')
    loadData()
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-bold mb-2">Acceso Restringido</h1>
          <p className="text-sm text-slate-400">Solo OWNER_SUPERADMIN.</p>
          <Link href="/" className="text-[#00D9FF] text-sm mt-4 inline-block">Volver</Link>
        </div>
      </div>
    )
  }

  const filtered = filter === 'all' ? docs : docs.filter(d => d.type === filter)
  const activeTerms = getActiveDocument('terms')

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
            <FileText className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Admin Términos Legales</h1>
            <p className="text-xs text-slate-400">{docs.length} documentos · {audit.length} eventos de auditoría</p>
          </div>
        </div>

        {activeTerms && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <p className="text-[10px] font-bold text-emerald-400">
              ✅ Versión activa: {activeTerms.title} v{activeTerms.version}
            </p>
          </div>
        )}

        <div className="flex gap-1 mb-4 overflow-x-auto">
          {(['all', 'terms', 'privacy', 'community_rules'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-bold cursor-pointer ${
                filter === f ? 'bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/20' : 'text-slate-400 hover:text-white'
              }`}>
              {f === 'all' ? 'Todos' : f === 'terms' ? 'Términos' : f === 'privacy' ? 'Privacidad' : 'Reglas'}
            </button>
          ))}
          <button onClick={() => setShowForm(!showForm)}
            className="px-3 py-1.5 rounded-lg text-[9px] font-bold text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 cursor-pointer flex items-center gap-1">
            <Plus className="w-3 h-3" /> Nuevo
          </button>
        </div>

        {showForm && (
          <div className="p-6 rounded-2xl glass mb-4">
            <h2 className="text-sm font-bold mb-4">Nuevo Documento Legal</h2>
            <div className="space-y-3 max-w-lg">
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as LegalDocType }))}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white outline-none">
                <option value="terms">Términos</option>
                <option value="privacy">Privacidad</option>
                <option value="community_rules">Reglas Comunidad</option>
              </select>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Título" className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white outline-none" />
              <textarea value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                placeholder="Resumen" rows={2} className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white outline-none" />
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Contenido completo" rows={10} className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white outline-none font-mono" />
              <button onClick={handleAdd}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold cursor-pointer hover:opacity-90">
                <Plus className="w-4 h-4 inline mr-1" /> Crear y Activar
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map(doc => (
            <div key={doc.id} className={`p-4 rounded-2xl glass ${doc.status !== 'active' ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      doc.status === 'archived' ? 'bg-slate-800 text-slate-500' : 'bg-amber-500/20 text-amber-400'
                    }`}>{doc.status}</span>
                    <span className="text-[9px] font-mono text-slate-500">{doc.type}</span>
                    <span className="text-[9px] font-mono text-slate-500">v{doc.version}</span>
                  </div>
                  <h3 className="text-sm font-bold">{doc.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-1">{doc.summary}</p>
                  <p className="text-[9px] text-slate-600 mt-1">Autor: {doc.author} · {new Date(doc.updatedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-1">
                  {doc.status !== 'active' && (
                    <button onClick={() => handleActivate(doc.id)}
                      className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 cursor-pointer">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  {doc.status === 'active' && (
                    <button onClick={() => handleArchive(doc.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer">
                      <Archive className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <details className="mt-6">
          <summary className="text-[10px] text-slate-600 cursor-pointer hover:text-slate-400">Auditoría ({audit.length} eventos)</summary>
          <div className="mt-2 space-y-1">
            {audit.slice(-20).reverse().map(a => (
              <div key={a.id} className="p-2 rounded-lg bg-slate-950 text-[9px] font-mono text-slate-500">
                {a.action} · {a.docId} · {a.by} · {new Date(a.timestamp).toLocaleString()}
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  )
}

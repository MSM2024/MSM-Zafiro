'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { isOwnerEmail } from '@/lib/owner'
import { getSession } from '@/lib/auth'
import {
  addKnowledgeDocument, getDocuments, getDocumentsByCategory, deleteDocument,
  queryKnowledge, getCategories,
  type KnowledgeDocument, type KnowledgeCategory,
} from '@/lib/eliana/knowledge/retrieval'
import { getStoredTraining, markTrainingProcessed, type StoredTraining } from '@/lib/eliana/owner-firewall'
import {
  ArrowLeft, BookOpen, Upload, Search, Trash2, FileText, FolderOpen, CheckCircle, Clock,
} from 'lucide-react'

export default function AdminConocimientoPage() {
  usePageTitle('Conocimiento ELIANA — Admin')
  const [authorized, setAuthorized] = useState(false)
  const [tab, setTab] = useState<'documents' | 'upload' | 'training' | 'search'>('documents')
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [training, setTraining] = useState<StoredTraining[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState('')
  const [uploadForm, setUploadForm] = useState({ title: '', category: 'ZAFIRO' as KnowledgeCategory, content: '' })

  useEffect(() => {
    const session = getSession()
    if (!session || !isOwnerEmail(session.email)) return
    setAuthorized(true)
    setDocuments(getDocuments())
    setTraining(getStoredTraining())
  }, [])

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-bold mb-2">Acceso Restringido</h1>
          <p className="text-sm text-slate-400">Solo el OWNER_SUPERADMIN puede gestionar conocimiento.</p>
          <Link href="/" className="text-[#00D9FF] text-sm mt-4 inline-block">Volver</Link>
        </div>
      </div>
    )
  }

  const handleUpload = () => {
    if (!uploadForm.title || !uploadForm.content) return
    const { document } = addKnowledgeDocument(uploadForm.title, uploadForm.content, uploadForm.category)
    setDocuments(getDocuments())
    setUploadForm({ title: '', category: 'ZAFIRO', content: '' })
    alert(`✅ "${document.title}" almacenado (${document.chunkCount} chunks)`)
  }

  const handleDelete = (id: string) => {
    if (!confirm('¿Eliminar este documento?')) return
    deleteDocument(id)
    setDocuments(getDocuments())
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    const results = queryKnowledge(searchQuery)
    setSearchResults(results.length > 0
      ? results.map(r => `[${r.title}] (${r.category}) ${r.content.slice(0, 300)}...`).join('\n\n---\n\n')
      : 'Sin resultados.')
  }

  const handleProcessTraining = (id: string) => {
    markTrainingProcessed(id)
    setTraining(getStoredTraining())
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
            <BookOpen className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Conocimiento ELIANA</h1>
            <p className="text-xs text-slate-400">Gestión de la base de conocimiento</p>
          </div>
        </div>

        <nav className="flex gap-1 mb-6 overflow-x-auto">
          {[
            { id: 'documents' as const, label: 'Documentos', icon: FileText },
            { id: 'upload' as const, label: 'Subir', icon: Upload },
            { id: 'training' as const, label: 'Entrenamiento', icon: Clock },
            { id: 'search' as const, label: 'Buscar', icon: Search },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tab === t.id ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
              }`}>
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </nav>

        {tab === 'documents' && (
          <div className="space-y-3">
            <div className="flex gap-2 mb-4">
              {getCategories().map(cat => (
                <button key={cat} onClick={() => setDocuments(getDocumentsByCategory(cat))}
                  className="px-2 py-1 rounded-lg text-[9px] font-mono border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 cursor-pointer">
                  {cat.replace(/_/g, ' ')}
                </button>
              ))}
              <button onClick={() => setDocuments(getDocuments())}
                className="px-2 py-1 rounded-lg text-[9px] font-mono border border-[#00D9FF]/30 text-[#00D9FF] cursor-pointer">
                Todos
              </button>
            </div>
            {documents.length === 0 && (
              <div className="p-8 rounded-2xl glass text-center text-sm text-slate-500">
                No hay documentos de conocimiento. Usa la pestaña "Subir" para agregar.
              </div>
            )}
            {documents.map(d => (
              <div key={d.id} className="p-4 rounded-2xl glass flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{d.title}</h3>
                  <p className="text-[10px] text-slate-500">{d.category} · {d.chunkCount} chunks · v{d.version}</p>
                </div>
                <button onClick={() => handleDelete(d.id)} className="text-red-400 hover:text-red-300 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'upload' && (
          <div className="p-6 rounded-2xl glass">
            <h2 className="text-sm font-bold mb-4">Subir Conocimiento</h2>
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Título</label>
                <input value={uploadForm.title} onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Nombre del documento"
                  className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Categoría</label>
                <select value={uploadForm.category} onChange={e => setUploadForm(f => ({ ...f, category: e.target.value as KnowledgeCategory }))}
                  className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 outline-none">
                  {getCategories().map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Contenido</label>
                <textarea value={uploadForm.content} onChange={e => setUploadForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Contenido del documento (mín. 10 caracteres)"
                  rows={10}
                  className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 outline-none font-mono" />
              </div>
              <button onClick={handleUpload}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" /> Subir a Base de Conocimiento
              </button>
            </div>
          </div>
        )}

        {tab === 'training' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 mb-2">Material de entrenamiento recibido vía STORE_ONLY</p>
            {training.length === 0 && (
              <div className="p-8 rounded-2xl glass text-center text-sm text-slate-500">
                No hay material de entrenamiento almacenado.
              </div>
            )}
            {training.filter(t => !t.processed).map(t => (
              <div key={t.id} className="p-4 rounded-2xl glass">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-purple-400">{t.type}</span>
                  <button onClick={() => handleProcessTraining(t.id)}
                    className="flex items-center gap-1 text-[9px] text-emerald-400 hover:text-emerald-300 cursor-pointer">
                    <CheckCircle className="w-3 h-3" /> Procesado
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">{new Date(t.receivedAt).toLocaleString()}</p>
                <pre className="mt-2 p-2 rounded-lg bg-slate-950 text-[9px] text-slate-400 overflow-x-auto max-h-32">
                  {t.content.slice(0, 500)}{t.content.length > 500 ? '...' : ''}
                </pre>
              </div>
            ))}
          </div>
        )}

        {tab === 'search' && (
          <div className="p-6 rounded-2xl glass">
            <h2 className="text-sm font-bold mb-4">Buscar en Conocimiento</h2>
            <div className="flex gap-2 mb-4">
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSearch() }}
                placeholder="¿Qué quieres buscar?"
                className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-500 outline-none" />
              <button onClick={handleSearch}
                className="px-4 py-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/20 text-xs font-bold hover:bg-purple-500/30 transition-all cursor-pointer">
                <Search className="w-4 h-4" />
              </button>
            </div>
            {searchResults && (
              <pre className="p-4 rounded-xl bg-slate-950 text-[10px] text-slate-300 whitespace-pre-wrap max-h-96 overflow-y-auto font-mono">
                {searchResults}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

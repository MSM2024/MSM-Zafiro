'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { AlertTriangle, CheckCircle, XCircle, Eye, Loader2, Trash2, Archive, Tag } from "lucide-react"
import type { CleanAction } from "@/lib/email-cleaner/types"

interface Props {
  pendingActions: CleanAction[]
  onApprove: (actionIds: string[]) => Promise<void>
  onReject: (actionIds: string[]) => Promise<void>
  onExecute: (actionIds: string[]) => Promise<void>
  loading: boolean
}

const actionIcons: Record<string, typeof Trash2> = {
  SPAM: AlertTriangle,
  TRASH: Trash2,
  ARCHIVE: Archive,
  LABEL: Tag,
  REVIEW: Eye,
}

const actionLabels: Record<string, string> = {
  SPAM: 'Mover a Spam',
  TRASH: 'Mover a Papelera',
  ARCHIVE: 'Archivar',
  LABEL: 'Etiquetar',
  REVIEW: 'Revisar',
}

export default function ActionPanel({ pendingActions, onApprove, onReject, onExecute, loading }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [stage, setStage] = useState<'review' | 'approve' | 'executing'>('review')
  const [estimatedSpace, setEstimatedSpace] = useState(0)

  const toggleSelect = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  const toggleSelectAll = () => {
    if (selected.size === pendingActions.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(pendingActions.map(a => a.id)))
    }
  }

  const handleApprove = async () => {
    setStage('approve')
    await onApprove(Array.from(selected))
  }

  const handleExecute = async () => {
    setStage('executing')
    await onExecute(Array.from(selected))
    setSelected(new Set())
    setStage('review')
  }

  const totalMessages = pendingActions.length
  const recoverableMB = pendingActions.reduce((acc, a) => {
    if (a.action === 'SPAM' || a.action === 'TRASH') return acc + 1
    return acc
  }, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Acciones Pendientes</h2>
        {pendingActions.length > 0 && (
          <button onClick={toggleSelectAll} className="text-[10px] text-[#00D9FF] hover:text-white transition-colors">
            {selected.size === pendingActions.length ? 'Deseleccionar todo' : 'Seleccionar todo'}
          </button>
        )}
      </div>

      {pendingActions.length === 0 ? (
        <div className="p-8 rounded-2xl glass border border-slate-800/60 text-center">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No hay acciones pendientes. Ejecuta un análisis primero.</p>
        </div>
      ) : (
        <>
          <div className="p-4 rounded-2xl glass bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm font-bold text-amber-400">Se moverán {totalMessages} mensajes</p>
                <p className="text-[10px] text-slate-400">Espacio recuperable estimado: ~{recoverableMB} MB</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {pendingActions.map(action => {
              const Icon = actionIcons[action.action] || Eye
              return (
                <div key={action.id}
                  className={`p-3 rounded-xl glass border cursor-pointer transition-all ${
                    selected.has(action.id) ? 'border-[#00D9FF]/30 bg-[#00D9FF]/5' : 'border-slate-800/60 hover:border-slate-700'
                  }`}
                  onClick={() => toggleSelect(action.id)}>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={selected.has(action.id)} onChange={() => toggleSelect(action.id)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-[#00D9FF] focus:ring-[#00D9FF]/30" />
                    <Icon className="w-4 h-4 text-[#00D9FF] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white truncate">{action.subject}</p>
                      <p className="text-[10px] text-slate-500 truncate">{action.from}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 shrink-0">
                      {actionLabels[action.action] || action.action}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1 ml-9">{action.reason}</p>
                </div>
              )
            })}
          </div>

          {stage === 'review' && selected.size > 0 && (
            <div className="flex gap-3">
              <button onClick={handleApprove} disabled={loading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                APROBAR ({selected.size})
              </button>
              <button onClick={() => { onReject(Array.from(selected)); setSelected(new Set()) }} disabled={loading}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                <XCircle className="w-4 h-4" /> RECHAZAR
              </button>
            </div>
          )}

          {stage === 'approve' && (
            <div className="p-4 rounded-2xl glass border border-emerald-500/20 bg-emerald-500/5">
              <p className="text-sm text-emerald-400 font-bold mb-2">✅ Aprobado — Listo para ejecutar</p>
              <p className="text-xs text-slate-400 mb-3">Se moverán {selected.size} mensajes a sus destinos correspondientes.</p>
              <button onClick={handleExecute} disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                EJECUTAR LIMPIEZA ({selected.size} mensajes)
              </button>
            </div>
          )}

          {stage === 'executing' && (
            <div className="p-4 rounded-2xl glass text-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#00D9FF] mx-auto mb-2" />
              <p className="text-sm text-slate-400">Ejecutando acciones...</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

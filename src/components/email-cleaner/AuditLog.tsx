'use client'

import { useState } from "react"
import { Search, CheckCircle, XCircle, MinusCircle, Clock, ChevronDown, ChevronUp } from "lucide-react"
import type { AuditEntry } from "@/lib/email-cleaner/types"

interface Props {
  entries: AuditEntry[]
}

const resultIcons: Record<string, typeof CheckCircle> = {
  SUCCESS: CheckCircle,
  ERROR: XCircle,
  SKIPPED: MinusCircle,
}

const resultColors: Record<string, string> = {
  SUCCESS: 'text-emerald-400',
  ERROR: 'text-red-400',
  SKIPPED: 'text-slate-500',
}

export default function AuditLog({ entries }: Props) {
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all' ? entries : entries.filter(e => e.result === filter)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#00D9FF]" /> Auditoría
        </h2>
        <div className="flex gap-1">
          {(['all', 'SUCCESS', 'ERROR', 'SKIPPED'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                filter === f ? 'bg-[#00D9FF]/10 text-[#00D9FF]' : 'text-slate-500 hover:text-white'
              }`}>
              {f === 'all' ? 'Todos' : f === 'SUCCESS' ? 'Éxito' : f === 'ERROR' ? 'Error' : 'Omitido'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-5 rounded-2xl glass border border-slate-800/60 text-center">
          <Search className="w-6 h-6 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">No hay eventos de auditoría registrados.</p>
        </div>
      ) : (
        <div className="space-y-1 max-h-[500px] overflow-y-auto">
          {filtered.map(entry => {
            const Icon = resultIcons[entry.result] || MinusCircle
            const color = resultColors[entry.result] || 'text-slate-500'
            return (
              <div key={entry.id} className="p-3 rounded-xl glass border border-slate-800/60">
                <div className="flex items-start gap-3">
                  <Icon className={`w-4 h-4 ${color} mt-0.5 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white">{entry.action}</span>
                      <span className={`text-[9px] ${color}`}>{entry.result}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">
                      {entry.emailAccount} · {entry.category || 'general'}
                      {entry.reason && ` · ${entry.reason}`}
                    </p>
                    <p className="text-[9px] text-slate-600 mt-0.5">
                      {new Date(entry.executedAt).toLocaleString('es-ES')}
                      {entry.approvedBy && ` · por ${entry.approvedBy}`}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

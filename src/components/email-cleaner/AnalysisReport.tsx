'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { BarChart3, AlertTriangle, Trash2, Archive, Tag, ChevronDown, ChevronUp, Shield, RefreshCw, Loader2 } from "lucide-react"
import type { EmailAnalysis, AnalysisCategory as AnalysisCategoryType } from "@/lib/email-cleaner/types"

interface Props {
  analysis: EmailAnalysis | null
  onAnalyze: () => Promise<void>
  loading: boolean
}

const categoryIcons: Record<string, typeof AlertTriangle> = {
  spam: AlertTriangle,
  promotions: Tag,
  large: Trash2,
  old: Archive,
}

const riskColors: Record<string, string> = {
  low: 'text-emerald-400 bg-emerald-500/10',
  medium: 'text-amber-400 bg-amber-500/10',
  high: 'text-red-400 bg-red-500/10',
}

function CategoryCard({ cat }: { cat: AnalysisCategoryType }) {
  const [expanded, setExpanded] = useState(false)
  const Icon = categoryIcons[cat.name] || AlertTriangle

  return (
    <div className="p-4 rounded-2xl glass border border-slate-800/60">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-[#00D9FF]" />
          <div className="text-left">
            <p className="text-sm font-medium text-white">{cat.label}</p>
            <p className="text-[10px] text-slate-500">{cat.messageCount} mensajes · ~{cat.estimatedSpaceMB} MB</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${riskColors[cat.riskLevel] || riskColors.low}`}>
            {cat.riskLevel.toUpperCase()}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-2">
              {cat.topSenders.length > 0 && (
                <div>
                  <p className="text-[10px] text-slate-500 mb-1">Remitentes principales:</p>
                  <div className="flex flex-wrap gap-1">
                    {cat.topSenders.map((s, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-[10px] text-slate-500">
                Acción sugerida: <span className="text-white font-medium">{cat.suggestedAction === 'SPAM' ? 'Mover a Spam' : cat.suggestedAction === 'TRASH' ? 'Mover a Papelera' : cat.suggestedAction === 'ARCHIVE' ? 'Archivar' : 'Etiquetar'}</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AnalysisReport({ analysis, onAnalyze, loading }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Análisis de Correo</h2>
        <button onClick={onAnalyze} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] hover:bg-[#00D9FF]/20 text-sm font-medium transition-all disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {loading ? 'Analizando...' : 'Analizar'}
        </button>
      </div>

      {analysis ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total mensajes', value: analysis.totalMessages.toLocaleString(), icon: BarChart3, color: 'text-[#00D9FF]' },
              { label: 'Espacio recuperable', value: `~${analysis.estimatedSpaceMB} MB`, icon: Trash2, color: 'text-emerald-400' },
              { label: 'Categorías', value: analysis.categories.length.toString(), icon: Tag, color: 'text-violet-400' },
              { label: 'Último análisis', value: new Date(analysis.analyzedAt).toLocaleDateString(), icon: RefreshCw, color: 'text-amber-400' },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl glass text-center">
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <p className="text-lg font-black text-white">{stat.value}</p>
                <p className="text-[10px] text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {analysis.categories.map((cat, i) => (
              <CategoryCard key={i} cat={cat} />
            ))}
          </div>

          {analysis.oldestMessageDate && (
            <p className="text-[10px] text-slate-600">
              Rango de fechas: {new Date(analysis.oldestMessageDate).toLocaleDateString()} — {new Date(analysis.newestMessageDate || analysis.analyzedAt).toLocaleDateString()}
            </p>
          )}
        </>
      ) : (
        <div className="p-8 rounded-2xl glass border border-slate-800/60 text-center">
          <Shield className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Conecta una cuenta y ejecuta un análisis para ver resultados detallados.</p>
        </div>
      )}
    </div>
  )
}

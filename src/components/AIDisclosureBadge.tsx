'use client'

import { useState } from "react"
import { Info, Brain } from "lucide-react"

const DISCLOSURE_TEXT = "Esta conversación es con ELIANA, un asistente de inteligencia artificial. Las respuestas pueden contener errores. No constituye asesoría profesional regulada."

export default function AIDisclosureBadge() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[7px] font-mono text-slate-500 hover:text-amber-400 border border-slate-700/50 hover:border-amber-500/30 transition-all cursor-pointer"
        title="Transparencia de IA"
      >
        <Brain className="w-2.5 h-2.5" />
        IA
        <Info className="w-2 h-2" />
      </button>
      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-56 p-2 rounded-lg bg-slate-800 border border-slate-700 shadow-xl z-50">
          <p className="text-[9px] text-slate-300 leading-relaxed">{DISCLOSURE_TEXT}</p>
          <button onClick={() => setOpen(false)} className="mt-1 text-[7px] text-slate-500 hover:text-white transition-colors">Cerrar</button>
        </div>
      )}
    </div>
  )
}

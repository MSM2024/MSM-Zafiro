'use client'

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Sparkles, Activity } from "lucide-react"
import ElianaPortrait from "./ElianaPortrait"

interface ElianaAvatarCardProps {
  variant?: "default" | "compact" | "full"
  status?: "online" | "thinking" | "offline"
  className?: string
  onActivate?: () => void
}

export default function ElianaAvatarCard({ variant = "default", status = "online", className = "", onActivate }: ElianaAvatarCardProps) {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  const statusColor = status === "online" ? "bg-emerald-400" : status === "thinking" ? "bg-amber-400" : "bg-slate-500"
  const statusText = status === "online" ? "En línea" : status === "thinking" ? "Pensando..." : "Sin conexión"

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 p-2 ${className}`}>
        <div className="relative">
          <ElianaPortrait size={40} animated={false} showAura={false} reduced />
          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${statusColor} border-2 border-[#050816]`} />
        </div>
        <div>
          <p className="text-xs font-bold text-white">ELIANA</p>
          <p className="text-[9px] text-slate-500">{statusText}</p>
        </div>
      </div>
    )
  }

  if (variant === "full") {
    return (
      <motion.div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-slate-800/50 p-6 ${className}`}
        whileHover={reduced ? {} : { scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        {!reduced && (
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              background: `radial-gradient(circle at 30% 20%, #00D9FF 0%, transparent 50%),
                           radial-gradient(circle at 70% 80%, #7C3AED 0%, transparent 50%)`,
            }}
          />
        )}

        <div className="flex flex-col items-center text-center gap-4">
          <div className="relative">
            <ElianaPortrait size={120} animated={!reduced} reduced={reduced} />
            <motion.div
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#050816]"
              style={{ backgroundColor: statusColor }}
              animate={status === "online" ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">ELIANA</h3>
            <p className="text-xs text-slate-400 mt-0.5">Asistente Digital Soberano</p>
          </div>

          {!reduced && (
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <Activity className="w-3 h-3" />
              <span>{statusText}</span>
              <Sparkles className="w-3 h-3 ml-1" />
              <span>v1.1.0</span>
            </div>
          )}

          {onActivate && (
            <motion.button
              onClick={onActivate}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00D9FF]/20 to-[#7C3AED]/20 border border-[#00D9FF]/30 text-xs font-bold text-white hover:from-[#00D9FF]/30 hover:to-[#7C3AED]/30 transition-all"
              whileTap={{ scale: 0.97 }}
            >
              Hablar con ELIANA
            </motion.button>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl bg-slate-900/40 border border-slate-800/40 p-4 ${className}`}
      whileHover={reduced ? {} : { scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {!reduced && (
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            background: `radial-gradient(circle at 50% 0%, #00D9FF 0%, transparent 60%)`,
          }}
        />
      )}

      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <ElianaPortrait size={56} animated={false} showAura={false} reduced />
          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${statusColor} border-2 border-slate-900`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">ELIANA</h3>
            {status === "online" && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-[8px] font-bold text-emerald-400">
                ONLINE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 truncate">Tu asistente digital soberano</p>

          {!reduced && (
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
                <span className="text-[9px] text-slate-500">{statusText}</span>
              </div>
              <span className="text-[9px] text-slate-600">v1.1.0</span>
            </div>
          )}
        </div>

        {onActivate && (
          <motion.button
            onClick={onActivate}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[10px] font-bold text-[#00D9FF] hover:bg-[#00D9FF]/20 transition-all"
            whileTap={{ scale: 0.95 }}
          >
            ABRIR
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

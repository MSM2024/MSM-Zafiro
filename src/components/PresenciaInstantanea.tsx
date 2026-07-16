'use client'

import { useState, useEffect, useCallback, useRef } from "react"
import { Mic, MicOff, Eye, Zap, Volume2 } from "lucide-react"
import { getConfigPresencia, saveConfigPresencia, PresenciaEngine, type ConfigPresencia } from "@/lib/presencia"
import { useRouter } from "next/navigation"

const COMANDOS: Record<string, string> = {
  "activar": "abrir chat",
  "abrir": "",
  "eliana": "abrir chat",
  "dashboard": "/dashboard",
  "trading": "/trading",
  "cripto": "/admin/cripto",
  "impacto": "/impacto",
  "universo": "/universo",
  "perfil": "/profile-page",
  "galaxia": "/galaxia",
  "ayuda": "/help",
  "cuenta": "",
  "venmo": "",
}

export default function PresenciaInstantanea() {
  const [config, setConfig] = useState<ConfigPresencia>(getConfigPresencia())
  const [escuchando, setEscuchando] = useState(false)
  const [ultimoComando, setUltimoComando] = useState("")
  const [visible, setVisible] = useState(true)
  const [soporteVoz, setSoporteVoz] = useState(false)
  const engineRef = useRef<PresenciaEngine | null>(null)
  const router = useRouter()

  useEffect(() => {
    setSoporteVoz(PresenciaEngine.verificarSoporte())
    if (config.vozActiva && soporteVoz) {
      const engine = new PresenciaEngine("ZAFIRO")
      engine.onComando((comando) => {
        setUltimoComando(comando)
        setEscuchando(true)
        setTimeout(() => setEscuchando(false), 2000)

        const destino = COMANDOS[comando]
        if (destino && destino.startsWith("/")) {
          router.push(destino)
        } else if (comando === "activar" || comando === "eliana") {
          const chatBtn = document.querySelector("[data-chat-toggle]") as HTMLElement
          chatBtn?.click()
        } else if (comando === "cuenta") {
          router.push("/auth/login")
        } else if (comando === "venmo") {
          window.open("https://venmo.com/code?user_id=4167245563430505292", "_blank")
        }
      })
      engine.iniciar()
      engineRef.current = engine
      setEscuchando(true)
      return () => engine.detener()
    }
  }, [config.vozActiva, soporteVoz])

  const toggleVoz = useCallback(() => {
    const nuevo = !config.vozActiva
    const cfg = { ...config, vozActiva: nuevo }
    setConfig(cfg)
    saveConfigPresencia(cfg)
    if (nuevo && engineRef.current) {
      engineRef.current.iniciar()
      setEscuchando(true)
    } else if (engineRef.current) {
      engineRef.current.detener()
      setEscuchando(false)
    }
  }, [config])

  if (!soporteVoz && !config.deteccionMirada) {
    return (
      <div className="fixed bottom-24 right-4 z-50">
        <button
          onClick={() => router.push("/galaxia")}
          className="w-10 h-10 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/20 flex items-center justify-center hover:bg-[#00D9FF]/20 transition-all group"
          title="Presencia Instantánea — Galaxia Infinita"
        >
          <Eye className="w-4 h-4 text-[#00D9FF]/50 group-hover:text-[#00D9FF] transition-colors" />
        </button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-24 right-4 z-50 transition-all duration-500 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
      <div className="relative">
        {/* Indicador de escucha */}
        {escuchando && (
          <div className="absolute -top-1 -right-1 w-3 h-3">
            <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400/50" />
            <span className="absolute inset-0 rounded-full bg-emerald-400" />
          </div>
        )}

        {/* Botón principal */}
        <button
          onClick={toggleVoz}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            escuchando
              ? "bg-emerald-500/20 border-2 border-emerald-400/50 shadow-emerald-500/20"
              : "bg-slate-800/80 border border-slate-700/30 hover:border-[#00D9FF]/30"
          }`}
          title={config.vozActiva ? "Desactivar comando de voz" : "Activar comando de voz"}
        >
          {config.vozActiva ? (
            <div className="relative">
              <Mic className="w-5 h-5 text-emerald-400" />
              {escuchando && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </div>
          ) : (
            <MicOff className="w-5 h-5 text-slate-500" />
          )}
        </button>

        {/* Último comando */}
        {ultimoComando && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
            <p className="text-[7px] text-emerald-500/60 font-mono bg-black/60 px-2 py-0.5 rounded-full">
              &quot;{ultimoComando}&quot;
            </p>
          </div>
        )}

        {/* Indicador de modo */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full flex items-center gap-1">
          <Volume2 className="w-2.5 h-2.5 text-emerald-500/40" />
          <span className={`text-[6px] font-mono ${escuchando ? "text-emerald-500/60" : "text-slate-600"}`}>
            {escuchando ? "ZAFIRO..." : "en espera"}
          </span>
        </div>
      </div>
    </div>
  )
}

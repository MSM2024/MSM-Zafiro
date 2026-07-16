'use client'

import { useState, useEffect } from "react"
import { KeyRound, ShieldCheck } from "lucide-react"
import {
  hasFounderKey, setupFounderKey, verifyFounderKey, isFounderSessionActive,
} from "@/lib/security-lock"

/**
 * Desafío de Sesión — ELIANA solicita la Clave Única del Fundador
 * antes de mostrar saldos, inventarios o realizar transferencias.
 */
export default function FounderChallenge({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "setup" | "challenge" | "granted">("loading")
  const [key, setKey] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (isFounderSessionActive()) {
      setState("granted")
    } else if (!hasFounderKey()) {
      setState("setup")
    } else {
      setState("challenge")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (state === "setup") {
      if (key.length < 4) {
        setError("La clave debe tener al menos 4 caracteres.")
        return
      }
      await setupFounderKey(key)
      await verifyFounderKey(key)
      setState("granted")
    } else {
      const ok = await verifyFounderKey(key)
      if (ok) {
        setState("granted")
      } else {
        setError("Clave incorrecta. ELIANA protege estos datos.")
        setKey("")
      }
    }
  }

  if (state === "loading") return null
  if (state === "granted") return <>{children}</>

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-full bg-[#D6A83A]/10 border border-[#D6A83A]/30 flex items-center justify-center mx-auto mb-5">
          <KeyRound className="w-7 h-7 text-[#D6A83A]" />
        </div>
        <h2 className="text-xl font-bold text-white">
          {state === "setup" ? "Configura tu Clave de Fundador" : "Desafío de Sesión"}
        </h2>
        <p className="text-sm text-zinc-400 mt-2 mb-6">
          {state === "setup"
            ? "Crea la Clave Única del Fundador para proteger saldos, inventarios y transferencias."
            : "🛡️ Soy ELIANA. Antes de mostrar información financiera, ingresa la Clave Única del Fundador."}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Clave Única del Fundador"
            autoFocus
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center focus:outline-none focus:border-[#D6A83A]"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#D6A83A] text-[#111827] font-semibold hover:bg-[#D6A83A]/90 transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            {state === "setup" ? "Sellar Clave" : "Verificar Identidad"}
          </button>
        </form>
        <p className="text-xs text-zinc-600 mt-6">
          Cifrado local SHA-256 · Válida solo durante esta sesión
        </p>
      </div>
    </div>
  )
}

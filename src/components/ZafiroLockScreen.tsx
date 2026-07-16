'use client'

import { useState, useEffect, useCallback } from "react"
import { Shield, Delete, AlertTriangle } from "lucide-react"
import {
  hasPinConfigured, setupPin, verifyPin, isSessionUnlocked,
  isEmergencyLocked, getLockoutRemainingMinutes, getBackupEmail,
} from "@/lib/security-lock"

export default function ZafiroLockScreen({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "setup" | "locked" | "unlocked" | "emergency">("loading")
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [setupStep, setSetupStep] = useState<1 | 2>(1)
  const [error, setError] = useState("")
  const [remaining, setRemaining] = useState(3)
  const [lockoutMin, setLockoutMin] = useState(0)

  useEffect(() => {
    if (isEmergencyLocked()) {
      setLockoutMin(getLockoutRemainingMinutes())
      setState("emergency")
    } else if (isSessionUnlocked()) {
      setState("unlocked")
    } else if (!hasPinConfigured()) {
      setState("setup")
    } else {
      setState("locked")
    }
  }, [])

  const handleDigit = useCallback(async (digit: string) => {
    setError("")
    const current = state === "setup" && setupStep === 2 ? confirmPin : pin
    if (current.length >= 6) return
    const next = current + digit

    if (state === "setup") {
      if (setupStep === 1) {
        setPin(next)
        if (next.length === 6) {
          setTimeout(() => setSetupStep(2), 200)
        }
      } else {
        setConfirmPin(next)
        if (next.length === 6) {
          if (next === pin) {
            await setupPin(pin)
            await verifyPin(pin)
            setState("unlocked")
          } else {
            setError("Los PIN no coinciden. Intenta de nuevo.")
            setPin("")
            setConfirmPin("")
            setSetupStep(1)
          }
        }
      }
    } else {
      setPin(next)
      if (next.length === 6) {
        const result = await verifyPin(next)
        if (result.success) {
          setState("unlocked")
        } else if (result.locked) {
          setLockoutMin(getLockoutRemainingMinutes())
          setState("emergency")
        } else {
          setError(`PIN incorrecto. ${result.remaining} intento${result.remaining !== 1 ? "s" : ""} restante${result.remaining !== 1 ? "s" : ""}.`)
          setRemaining(result.remaining)
          setPin("")
        }
      }
    }
  }, [state, setupStep, pin, confirmPin])

  const handleDelete = () => {
    setError("")
    if (state === "setup" && setupStep === 2) {
      setConfirmPin(confirmPin.slice(0, -1))
    } else {
      setPin(pin.slice(0, -1))
    }
  }

  if (state === "loading") {
    return (
      <div className="fixed inset-0 z-[100] bg-[#050816] flex items-center justify-center">
        <Shield className="w-10 h-10 text-[#00D9FF] animate-pulse" />
      </div>
    )
  }

  if (state === "unlocked") return <>{children}</>

  if (state === "emergency") {
    return (
      <div className="fixed inset-0 z-[100] bg-[#050816] flex flex-col items-center justify-center px-6 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-2xl font-bold text-white">Modo Emergencia Activado</h1>
        <p className="text-zinc-400 mt-3 max-w-sm">
          Se detectaron 3 intentos fallidos. El acceso está bloqueado por seguridad.
        </p>
        <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          🔒 Bloqueado por {lockoutMin} minuto{lockoutMin !== 1 ? "s" : ""} más
          <br />📧 Notificación enviada a {getBackupEmail()}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-2.5 rounded-full border border-white/20 text-sm text-zinc-300 hover:bg-white/5"
        >
          Reintentar
        </button>
      </div>
    )
  }

  const activePin = state === "setup" && setupStep === 2 ? confirmPin : pin
  const title = state === "setup"
    ? setupStep === 1 ? "Crea tu PIN Maestro" : "Confirma tu PIN"
    : "ZAFIRO Bloqueado"
  const subtitle = state === "setup"
    ? setupStep === 1 ? "6 dígitos que protegerán tu universo" : "Ingresa el mismo PIN otra vez"
    : "Ingresa tu PIN Maestro de 6 dígitos"

  return (
    <div className="fixed inset-0 z-[100] bg-[#050816] flex flex-col items-center justify-center px-6">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D9FF]/20 to-[#7C3AED]/20 border border-[#00D9FF]/30 flex items-center justify-center mb-6">
        <Shield className="w-8 h-8 text-[#00D9FF]" />
      </div>
      <h1 className="text-xl font-bold text-white">{title}</h1>
      <p className="text-sm text-zinc-400 mt-2">{subtitle}</p>

      {/* PIN dots */}
      <div className="flex gap-3 my-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border transition-all ${
              i < activePin.length
                ? "bg-[#00D9FF] border-[#00D9FF] scale-110"
                : "border-zinc-600"
            }`}
          />
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-4">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(d => (
          <button
            key={d}
            onClick={() => handleDigit(d)}
            className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-xl font-semibold text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            {d}
          </button>
        ))}
        <div />
        <button
          onClick={() => handleDigit("0")}
          className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-xl font-semibold text-white hover:bg-white/10 active:scale-95 transition-all"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="w-16 h-16 rounded-full flex items-center justify-center text-zinc-400 hover:text-white"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>

      <p className="text-xs text-zinc-600 mt-8">
        🛡️ Protegido con cifrado local · Frecuencia 369-777
      </p>
    </div>
  )
}

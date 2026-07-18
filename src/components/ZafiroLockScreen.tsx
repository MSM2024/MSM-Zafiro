'use client'

import { useState, useCallback, useEffect, useRef } from "react"
import { Shield, Delete, AlertTriangle, Diamond, Eye, EyeOff } from "lucide-react"
import {
  hasPinConfigured, setupPin, verifyPin, isSessionUnlocked,
  isEmergencyLocked, getLockoutRemainingMinutes, getBackupEmail,
} from "@/lib/security-lock"
import HolographicBackground from "@/components/zafiro/HolographicBackground"
import ElianaDiamond from "@/components/ElianaDiamond"

export default function ZafiroLockScreen({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "setup" | "locked" | "unlocked" | "emergency">(() => {
    if (isEmergencyLocked()) return "emergency"
    if (isSessionUnlocked()) return "unlocked"
    if (!hasPinConfigured()) return "setup"
    return "locked"
  })
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [setupStep, setSetupStep] = useState<1 | 2>(1)
  const [error, setError] = useState("")
  const [remaining, setRemaining] = useState(3)
  const [lockoutMin, setLockoutMin] = useState(() => isEmergencyLocked() ? getLockoutRemainingMinutes() : 0)
  const [showPin, setShowPin] = useState(false)
  const [reduced, setReduced] = useState(false)
  const prefersReduced = useRef(false)

  useEffect(() => {
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(prefersReduced.current)
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backgroundColor: '#050816' }}>
        <ElianaDiamond size={48} variant="animated" />
      </div>
    )
  }

  if (state === "unlocked") return <>{children}</>

  if (state === "emergency") {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 text-center" style={{ backgroundColor: '#050816' }}>
        <HolographicBackground density="low" scanLine={false} />
        <div className="relative z-10">
          <div style={{ animation: 'shake 0.5s ease-in-out' }}>
            <AlertTriangle className="w-16 h-16 text-red-500 mb-6 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-white">Modo Emergencia Activado</h1>
          <p className="text-zinc-400 mt-3 max-w-sm">
            Se detectaron 3 intentos fallidos. El acceso está bloqueado por seguridad.
          </p>
          <div className="mt-6 p-4 rounded-xl border text-red-300 text-sm" style={{ backgroundColor: '#7F1D1D20', borderColor: '#7F1D1D50' }}>
            <div className="flex items-center gap-2 justify-center mb-1">
              <Shield className="w-4 h-4 text-red-400" />
              <span>BLOQUEO DE SEGURIDAD</span>
            </div>
            <p>🔒 Bloqueado por {lockoutMin} minuto{lockoutMin !== 1 ? "s" : ""} más</p>
            <p className="text-xs text-red-400/60 mt-1">📧 Notificación enviada a {getBackupEmail()}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-2.5 rounded-full border text-sm text-zinc-300 hover:bg-white/5 transition-all"
            style={{ borderColor: '#ffffff20' }}
          >
            Reintentar
          </button>
        </div>
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
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6" style={{ backgroundColor: '#050816' }}>
      <HolographicBackground density={reduced ? 'low' : 'low'} scanLine={false} glowColor="#7C3AED" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-xs mx-auto">
        <div className="relative mb-6">
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle, rgba(0,217,255,0.1) 0%, transparent 70%)',
            transform: 'scale(2)',
          }} />
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{
            backgroundColor: '#00D9FF10',
            border: '1px solid #00D9FF30',
          }}>
            <Shield className="w-8 h-8" style={{ color: '#00D9FF' }} />
          </div>
          <div className="absolute -top-1 -right-1">
            <ElianaDiamond size={16} variant="diamond" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(0,217,255,0.15)' }}>{title}</h1>
        <p className="text-sm mt-2" style={{ color: '#A1A1AA' }}>{subtitle}</p>

        <div className="flex gap-3 my-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full border transition-all duration-200"
              style={{
                backgroundColor: i < activePin.length ? '#00D9FF' : 'transparent',
                borderColor: i < activePin.length ? '#00D9FF' : '#52525B',
                transform: i < activePin.length ? 'scale(1.1)' : 'scale(1)',
                boxShadow: i < activePin.length ? '0 0 8px rgba(0,217,255,0.5)' : 'none',
              }}
            />
          ))}
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg text-sm flex items-center gap-2" style={{
            backgroundColor: '#7F1D1D20',
            border: '1px solid #7F1D1D40',
            color: '#F87171',
          }}>
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 w-full max-w-[220px]">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(d => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="w-full aspect-square rounded-2xl text-xl font-semibold text-white transition-all active:scale-90 hover:scale-105"
              style={{
                backgroundColor: '#ffffff08',
                border: '1px solid #ffffff10',
              }}
            >
              {d}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleDigit("0")}
            className="w-full aspect-square rounded-2xl text-xl font-semibold text-white transition-all active:scale-90 hover:scale-105"
            style={{
              backgroundColor: '#ffffff08',
              border: '1px solid #ffffff10',
            }}
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-full aspect-square rounded-2xl flex items-center justify-center transition-all hover:bg-white/5"
            style={{ color: '#A1A1AA' }}
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 mt-8">
          <Diamond className="w-3 h-3" style={{ color: '#00D9FF60' }} />
          <p className="text-xs" style={{ color: '#52525B' }}>
            Protegido con cifrado local · Frecuencia 369-777
          </p>
        </div>
      </div>
    </div>
  )
}



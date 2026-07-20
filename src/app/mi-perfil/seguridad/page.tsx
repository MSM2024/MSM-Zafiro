'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowLeft, Lock, Smartphone, Fingerprint, Key, LogOut, Shield, AlertTriangle, CheckCircle, Globe, History, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession, logout } from '@/lib/auth'

const SECURITY_LOG_KEY = "zafiro_security_events"

interface SecurityEvent {
  action: string
  detail: string
  timestamp: string
  ip: string
}

function getSecurityLog(): SecurityEvent[] {
  try { return JSON.parse(localStorage.getItem(SECURITY_LOG_KEY) || "[]") }
  catch { return [] }
}

function addSecurityEvent(action: string, detail: string) {
  const log: SecurityEvent[] = getSecurityLog()
  log.push({ action, detail, timestamp: new Date().toISOString(), ip: "local" })
  if (log.length > 50) log.splice(0, log.length - 50)
  localStorage.setItem(SECURITY_LOG_KEY, JSON.stringify(log))
}

export default function SeguridadPage() {
  usePageTitle('Seguridad — ZAFIRO')
  const router = useRouter()
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [sessions] = useState(() => [
    { device: "Chrome Windows", ip: "local", lastActive: "Ahora", current: true },
    { device: "Safari iPhone", ip: "local", lastActive: "Hace 2 días", current: false },
  ])
  const [securityLog, setSecurityLog] = useState<SecurityEvent[]>([])
  const [showLog, setShowLog] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session) router.replace('/auth/login')
    setSecurityLog(getSecurityLog().reverse().slice(0, 20))
    addSecurityEvent("view_security", "Acceso a página de seguridad")
  }, [router])

  const handleLogout = async () => {
    addSecurityEvent("logout", "Cierre de sesión manual")
    await logout()
    router.replace('/')
  }

  const handleMfaToggle = () => {
    setMfaEnabled(!mfaEnabled)
    addSecurityEvent(mfaEnabled ? "mfa_disabled" : "mfa_enabled", `Autenticación multifactor ${mfaEnabled ? "desactivada" : "activada"}`)
    setSecurityLog(getSecurityLog().reverse().slice(0, 20))
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/mi-perfil" className="text-zinc-500 hover:text-[#00D9FF]"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold flex items-center gap-3"><Lock className="w-6 h-6 text-cyan-400" /> Seguridad</h1>
        </div>

        <div className="space-y-4">
          {/* MFA */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-cyan-400 mb-4 flex items-center gap-2"><Fingerprint className="w-4 h-4" /> Autenticación de múltiples factores (MFA)</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-300">Añade una capa adicional de seguridad a tu cuenta</p>
                <p className="text-xs text-zinc-500 mt-1">Recomendado para todos los usuarios</p>
              </div>
              <button onClick={handleMfaToggle}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${mfaEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-zinc-700'}`}>
                {mfaEnabled ? '✓ Activado' : 'Activar'}
              </button>
            </div>
          </motion.div>

          {/* Password */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-cyan-400 mb-4 flex items-center gap-2"><Key className="w-4 h-4" /> Contraseña</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-300 font-mono">{showPassword ? "MiContraseñaSegura" : "••••••••"}</span>
                <button onClick={() => setShowPassword(!showPassword)} className="text-zinc-500 hover:text-white transition-colors cursor-pointer">
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-[#00D9FF] text-xs border border-zinc-700 hover:bg-zinc-700 transition-all cursor-pointer">Cambiar</button>
            </div>
            <p className="text-[9px] text-zinc-600 mt-2">Último cambio: hace 3 meses</p>
          </motion.div>

          {/* Connected Devices */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-cyan-400 mb-4 flex items-center gap-2"><Smartphone className="w-4 h-4" /> Dispositivos conectados</h3>
            <div className="space-y-3">
              {sessions.map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <Smartphone className={`w-4 h-4 ${s.current ? 'text-emerald-400' : 'text-zinc-600'}`} />
                  <div className="flex-1">
                    <p className="text-sm text-zinc-300">{s.device} {s.current && <span className="text-[9px] text-emerald-400 ml-1">(actual)</span>}</p>
                    <p className="text-[10px] text-zinc-500">{s.ip} · {s.lastActive}</p>
                  </div>
                  {!s.current && (
                    <button className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors cursor-pointer">Cerrar</button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Security Log */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-cyan-400 flex items-center gap-2"><History className="w-4 h-4" /> Registro de actividad</h3>
              <button onClick={() => setShowLog(!showLog)} className="text-[9px] text-zinc-500 hover:text-white transition-colors cursor-pointer">
                {showLog ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {showLog && (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {securityLog.length === 0 ? (
                  <p className="text-[10px] text-zinc-500">Sin eventos registrados.</p>
                ) : (
                  securityLog.map((ev, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] py-1 border-b border-zinc-800/50 last:border-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                      <span className="text-zinc-400 flex-1">{ev.action}</span>
                      <span className="text-zinc-600 text-[8px]">{new Date(ev.timestamp).toLocaleString("es")}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>

          {/* Privacy Settings Link */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-cyan-400 mb-4 flex items-center gap-2"><Shield className="w-4 h-4" /> Privacidad</h3>
            <p className="text-xs text-zinc-500 mb-3">Gestiona tus preferencias de consentimiento y datos personales.</p>
            <Link href="/zafiro/privacidad" className="text-[#00D9FF] text-xs hover:underline">Ir a configuración de privacidad →</Link>
          </motion.div>

          {/* Logout */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-red-400 mb-4 flex items-center gap-2"><LogOut className="w-4 h-4" /> Cerrar sesión</h3>
            <p className="text-xs text-zinc-500 mb-3">Cierra la sesión actual en todos los dispositivos</p>
            <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs hover:bg-red-500/30 transition-all cursor-pointer">Cerrar sesión</button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

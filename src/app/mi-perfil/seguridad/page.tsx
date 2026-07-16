'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowLeft, Lock, Smartphone, Fingerprint, Key, LogOut, Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession, logout } from '@/lib/auth'

export default function SeguridadPage() {
  usePageTitle('Seguridad — ZAFIRO')
  const router = useRouter()
  const [mfaEnabled, setMfaEnabled] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session) router.replace('/auth/login')
  }, [router])

  const handleLogout = async () => {
    await logout()
    router.replace('/')
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/mi-perfil" className="text-zinc-500 hover:text-[#00D9FF]"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold flex items-center gap-3"><Lock className="w-6 h-6 text-cyan-400" /> Seguridad</h1>
        </div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-cyan-400 mb-4 flex items-center gap-2"><Fingerprint className="w-4 h-4" /> Autenticación de múltiples factores (MFA)</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-300">Añade una capa adicional de seguridad a tu cuenta</p>
                <p className="text-xs text-zinc-500 mt-1">Recomendado para todos los usuarios</p>
              </div>
              <button onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${mfaEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-zinc-700'}`}>
                {mfaEnabled ? '✓ Activado' : 'Activar'}
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-cyan-400 mb-4 flex items-center gap-2"><Key className="w-4 h-4" /> Contraseña</h3>
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-300">••••••••</p>
              <button className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-[#00D9FF] text-xs border border-zinc-700 hover:bg-zinc-700 transition-all">Cambiar</button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-cyan-400 mb-4 flex items-center gap-2"><Smartphone className="w-4 h-4" /> Dispositivos conectados</h3>
            <div className="flex items-center gap-3 text-sm text-zinc-400">
              <Smartphone className="w-4 h-4 text-zinc-600" />
              <span className="flex-1">Sesión actual</span>
              <span className="text-xs text-zinc-600">Activo ahora</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-red-400 mb-4 flex items-center gap-2"><LogOut className="w-4 h-4" /> Cerrar sesión</h3>
            <p className="text-xs text-zinc-500 mb-3">Cierra la sesión actual en todos los dispositivos</p>
            <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs hover:bg-red-500/30 transition-all">Cerrar sesión</button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

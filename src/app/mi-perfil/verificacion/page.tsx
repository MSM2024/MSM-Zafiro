'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowLeft, FileCheck, Shield, CheckCircle, XCircle, Clock, AlertTriangle, ChevronRight, BadgeCheck } from 'lucide-react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import { getProfileByAuthId, bootstrapOwnerProfile, getKycCase, createKycCase, type Profile, type KycCase } from '@/lib/identity'

const STATUS_UI: Record<string, { label: string; color: string; icon: typeof Clock; desc: string }> = {
  NOT_STARTED: { label: 'No iniciado', color: 'text-zinc-400', icon: Clock, desc: 'Aún no has iniciado tu verificación de identidad.' },
  IN_PROGRESS: { label: 'En progreso', color: 'text-blue-400', icon: Clock, desc: 'Tu verificación está siendo procesada.' },
  PENDING_REVIEW: { label: 'Pendiente de revisión', color: 'text-amber-400', icon: AlertTriangle, desc: 'Tu documentación está siendo revisada por nuestro equipo.' },
  APPROVED: { label: 'Verificado', color: 'text-emerald-400', icon: CheckCircle, desc: 'Tu identidad ha sido verificada exitosamente.' },
  REJECTED: { label: 'Rechazado', color: 'text-red-400', icon: XCircle, desc: 'Tu verificación no pudo ser completada.' },
  MORE_INFORMATION_REQUIRED: { label: 'Información requerida', color: 'text-amber-400', icon: AlertTriangle, desc: 'Necesitamos información adicional para completar tu verificación.' },
  EXPIRED: { label: 'Expirado', color: 'text-zinc-500', icon: Clock, desc: 'Tu verificación ha expirado. Inicia un nuevo proceso.' },
  SUSPENDED: { label: 'Suspendido', color: 'text-red-400', icon: Shield, desc: 'Tu verificación ha sido suspendida.' },
}

export default function VerificacionPage() {
  usePageTitle('Verificación — ZAFIRO')
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [kycCase, setKycCase] = useState<KycCase | null>(null)

  useEffect(() => {
    const session = getSession()
    if (!session) { router.replace('/auth/login'); return }
    const p = bootstrapOwnerProfile() || getProfileByAuthId(session.id)
    if (!p) return
    setProfile(p)
    const kyc = getKycCase(p.id)
    if (kyc) setKycCase(kyc)
  }, [router])

  const handleStartKyc = () => {
    if (!profile) return
    const kyc = createKycCase(profile.id)
    setKycCase(kyc)
    router.push('/kyc/consentimiento')
  }

  const status = kycCase?.status || 'NOT_STARTED'
  const statusUI = STATUS_UI[status] || STATUS_UI.NOT_STARTED
  const Icon = statusUI.icon

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/mi-perfil" className="text-zinc-500 hover:text-[#00D9FF]"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold flex items-center gap-3"><FileCheck className="w-6 h-6 text-emerald-400" /> Verificación de Identidad</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Icon className={`w-10 h-10 ${statusUI.color}`} />
            <div>
              <h2 className={`text-lg font-bold ${statusUI.color}`}>{statusUI.label}</h2>
              <p className="text-sm text-zinc-500">{statusUI.desc}</p>
            </div>
          </div>
          {profile?.verificationStatus === 'APPROVED' ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 rounded-xl p-3">
              <BadgeCheck className="w-5 h-5" /> Identidad verificada — puedes acceder a todas las funciones
            </div>
          ) : (
            <button onClick={handleStartKyc}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 hover:bg-[#00D9FF]/30 transition-all text-sm font-medium">
              {status === 'NOT_STARTED' ? 'Iniciar verificación' : 'Continuar verificación'} <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>

        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#00D9FF] mb-4">¿Por qué verificarte?</h3>
          <ul className="space-y-3">
            {[
              'Acceso a funciones premium de la plataforma',
              'Mayor credibilidad en la comunidad ZAFIRO',
              'Límites elevados de almacenamiento y publicación',
              'Participación en el marketplace de emprendedores',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, FileText, UserCheck, Search, AlertTriangle, CheckCircle, ChevronRight, Lock } from 'lucide-react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import {
  getProfileByAuthId, bootstrapOwnerProfile, getKycCase, createKycCase, hasConsent,
  type Profile,
} from '@/lib/identity'

const KYC_STEPS = [
  { icon: ShieldCheck, title: 'Consentimiento', desc: 'Acepta la política de privacidad y autoriza la verificación.' },
  { icon: UserCheck, title: 'Datos personales', desc: 'Proporciona tu nombre legal, fecha de nacimiento y dirección.' },
  { icon: FileText, title: 'Documento de identidad', desc: 'Sube una foto de tu pasaporte, licencia o documento oficial.' },
  { icon: Search, title: 'Verificación automática', desc: 'Nuestro sistema valida tu identidad de forma segura.' },
  { icon: AlertTriangle, title: 'Análisis de riesgo', desc: 'Evaluación de cumplimiento normativo y prevención de fraude.' },
  { icon: CheckCircle, title: 'Decisión final', desc: 'Recibes la confirmación de tu verificación por correo y en tu perfil.' },
]

export default function KycInicioPage() {
  usePageTitle('Verificación KYC — ZAFIRO')
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session) { router.replace('/auth/login'); return }
    const p = bootstrapOwnerProfile() || getProfileByAuthId(session.id)
    if (p) setProfile(p)
  }, [router])

  const handleStart = () => {
    if (!profile) return
    setLoading(true)
    const session = getSession()
    if (!session) return

    createKycCase(profile.id)

    if (hasConsent(profile.id, 'kyc_verification')) {
      router.push('/kyc/datos')
    } else {
      router.push('/kyc/consentimiento')
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/mi-perfil" className="text-zinc-500 hover:text-[#00D9FF]"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3"><ShieldCheck className="w-6 h-6 text-[#00D9FF]" /> Verificación KYC</h1>
            <p className="text-sm text-zinc-500">Verifica tu identidad para acceder a más beneficios</p>
          </div>
        </div>

        {profile?.verificationStatus === 'APPROVED' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-2">Identidad verificada</h2>
            <p className="text-sm text-zinc-400 mb-4">Tu identidad ya fue verificada exitosamente. No necesitas iniciar el proceso nuevamente.</p>
            <Link href="/mi-perfil"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-sm font-medium hover:bg-emerald-500/30 transition-all">
              Volver a mi perfil
            </Link>
          </motion.div>
        ) : profile?.verificationStatus === 'PENDING_REVIEW' || profile?.verificationStatus === 'IN_PROGRESS' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#00D9FF]/10 border border-[#00D9FF]/20 rounded-2xl p-6 text-center">
            <Search className="w-12 h-12 text-[#00D9FF] mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-2">Verificación en progreso</h2>
            <p className="text-sm text-zinc-400 mb-4">Tu documentación está siendo revisada. Te notificaremos cuando se complete.</p>
            <Link href="/kyc/estado"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 rounded-xl text-sm font-medium hover:bg-[#00D9FF]/30 transition-all">
              Ver estado <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-[#00D9FF]" />
                <h2 className="text-lg font-bold">Proceso seguro y confidencial</h2>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                La verificación de identidad (KYC) nos permite confirmar que eres quien dices ser. Esto protege a toda la comunidad y te desbloquea beneficios adicionales como insignia verificada y acceso a funciones premium.
              </p>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Lock className="w-3 h-3" />
                <span>Tus datos están cifrados y nunca se almacenan en carpetas públicas.</span>
              </div>
            </div>

            <h3 className="text-sm font-medium text-zinc-500 mb-4 uppercase tracking-wider">Pasos del proceso</h3>
            <div className="space-y-3 mb-8">
              {KYC_STEPS.map((step, i) => {
                const Icon = step.icon
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4">
                    <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#00D9FF]">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#00D9FF]" />
                        {step.title}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">{step.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            <button onClick={handleStart} disabled={loading || !profile}
              className="w-full py-3 bg-[#00D9FF] text-[#050816] font-semibold rounded-xl hover:bg-[#00D9FF]/90 transition-all disabled:opacity-50">
              {loading ? 'Iniciando...' : 'Comenzar verificación'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

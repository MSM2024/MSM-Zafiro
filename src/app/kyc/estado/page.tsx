'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import { getProfileByAuthId, bootstrapOwnerProfile, getKycCase, type Profile, type KycCase } from '@/lib/identity'

export default function KycEstadoPage() {
  usePageTitle('Estado de verificación — ZAFIRO')
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [kycCase, setKycCase] = useState<KycCase | null>(null)

  useEffect(() => {
    const session = getSession()
    if (!session) { router.replace('/auth/login'); return }
    const p = bootstrapOwnerProfile() || getProfileByAuthId(session.id)
    if (p) {
      setProfile(p)
      const kc = getKycCase(p.id)
      if (kc) setKycCase(kc)
    }
  }, [router])

  const status = kycCase?.status || 'NOT_STARTED'

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/mi-perfil" className="text-zinc-500 hover:text-[#00D9FF]"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3"><ShieldCheck className="w-6 h-6 text-[#00D9FF]" /> Estado de verificación</h1>
            <p className="text-sm text-zinc-500">Consulta el resultado de tu proceso KYC</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {status === 'NOT_STARTED' && (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center">
              <ShieldCheck className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h2 className="text-lg font-bold mb-2">No has iniciado la verificación</h2>
              <p className="text-sm text-zinc-500 mb-6">Para acceder a la insignia verificada y beneficios adicionales, completa el proceso de verificación de identidad.</p>
              <Link href="/kyc/inicio"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D9FF] text-[#050816] font-semibold rounded-xl hover:bg-[#00D9FF]/90 transition-all">
                Comenzar verificación <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {status === 'IN_PROGRESS' && (
            <div className="bg-[#00D9FF]/10 border border-[#00D9FF]/20 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#00D9FF]/20 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-[#00D9FF] animate-pulse" />
              </div>
              <h2 className="text-lg font-bold mb-2">Verificación en progreso</h2>
              <p className="text-sm text-zinc-400 mb-4">Estamos procesando tu información. Esto puede tomar unos minutos.</p>
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                <Clock className="w-3 h-3" />
                <span>Tiempo estimado: 1-5 minutos</span>
              </div>
            </div>
          )}

          {status === 'PENDING_REVIEW' && (
            <div className="bg-[#00D9FF]/10 border border-[#00D9FF]/20 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#00D9FF]/20 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-[#00D9FF] animate-spin" />
              </div>
              <h2 className="text-lg font-bold mb-2">Tu documentación está siendo revisada</h2>
              <p className="text-sm text-zinc-400 mb-4">Nuestro equipo de cumplimiento está analizando tu documentación. Te notificaremos por correo electrónico cuando se complete la revisión.</p>
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                <Clock className="w-3 h-3" />
                <span>Revisión estimada: 24-48 horas</span>
              </div>
            </div>
          )}

          {status === 'APPROVED' && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
              </motion.div>
              <h2 className="text-lg font-bold text-emerald-400 mb-2">¡Identidad verificada!</h2>
              <p className="text-sm text-zinc-400 mb-2">Tu identidad ha sido verificada exitosamente. Ya puedes disfrutar de todos los beneficios de la verificación.</p>
              <p className="text-xs text-zinc-500 mb-6">Se ha añadido la insignia de identidad verificada a tu perfil.</p>
              <Link href="/mi-perfil"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-all">
                Ver mi perfil <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {status === 'REJECTED' && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-lg font-bold text-red-400 mb-2">Verificación no aprobada</h2>
              <p className="text-sm text-zinc-400 mb-2">Tu documentación no pudo ser verificada. Esto puede deberse a:</p>
              <ul className="text-sm text-zinc-500 mb-6 text-left max-w-xs mx-auto space-y-1">
                <li className="flex items-start gap-2"><XCircle className="w-3 h-3 text-red-400 mt-1 flex-shrink-0" /> Imagen borrosa o ilegible</li>
                <li className="flex items-start gap-2"><XCircle className="w-3 h-3 text-red-400 mt-1 flex-shrink-0" /> Documento vencido o dañado</li>
                <li className="flex items-start gap-2"><XCircle className="w-3 h-3 text-red-400 mt-1 flex-shrink-0" /> Datos no coinciden con el perfil</li>
              </ul>
              <Link href="/kyc/inicio"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 font-semibold rounded-xl hover:bg-red-500/30 transition-all">
                <RefreshCw className="w-4 h-4" /> Intentar de nuevo
              </Link>
            </div>
          )}

          {status === 'MORE_INFORMATION_REQUIRED' && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-lg font-bold text-amber-400 mb-2">Información adicional requerida</h2>
              <p className="text-sm text-zinc-400 mb-2">Necesitamos información adicional para completar tu verificación. Por favor, revisa tu correo electrónico para más detalles.</p>
              <p className="text-xs text-zinc-500 mb-6">Esto puede incluir una segunda foto del documento o documentación complementaria.</p>
              <Link href="/kyc/documento"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold rounded-xl hover:bg-amber-500/30 transition-all">
                <RefreshCw className="w-4 h-4" /> Subir documentación
              </Link>
            </div>
          )}

          {(status === 'EXPIRED' || status === 'SUSPENDED') && (
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h2 className="text-lg font-bold mb-2">Verificación {status === 'EXPIRED' ? 'expirada' : 'suspendida'}</h2>
              <p className="text-sm text-zinc-500 mb-6">Tu verificación ha {status === 'EXPIRED' ? 'expirado' : 'sido suspendida'}. Por favor, contacta a soporte para más información.</p>
              <Link href="/help"
                className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-700 transition-all">
                Contactar soporte
              </Link>
            </div>
          )}

          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-zinc-600">Estado actual</p>
                <p className="text-zinc-400 font-medium mt-0.5">{status.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className="text-zinc-600">Última actualización</p>
                <p className="text-zinc-400 font-medium mt-0.5">
                  {kycCase?.updatedAt ? new Date(kycCase.updatedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </p>
              </div>
              {kycCase?.reviewedAt && (
                <div>
                  <p className="text-zinc-600">Fecha de revisión</p>
                  <p className="text-zinc-400 font-medium mt-0.5">
                    {new Date(kycCase.reviewedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              )}
              {kycCase?.expiresAt && (
                <div>
                  <p className="text-zinc-600">Expira</p>
                  <p className="text-zinc-400 font-medium mt-0.5">
                    {new Date(kycCase.expiresAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

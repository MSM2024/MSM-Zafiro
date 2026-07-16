'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, FileText, UserCheck, Clock, Scale, Lock, CheckCircle } from 'lucide-react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import {
  getProfileByAuthId, bootstrapOwnerProfile, recordConsent, hasConsent,
  getKycCase, createKycCase, updateKycCase,
  type Profile,
} from '@/lib/identity'

const POLICY_VERSION = '1.0'

export default function KycConsentimientoPage() {
  usePageTitle('Consentimiento — Verificación ZAFIRO')
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session) { router.replace('/auth/login'); return }
    const p = bootstrapOwnerProfile() || getProfileByAuthId(session.id)
    if (p) {
      setProfile(p)
      if (hasConsent(p.id, 'kyc_verification')) {
        router.replace('/kyc/datos')
      }
    }
  }, [router])

  const handleSubmit = () => {
    if (!profile || !agreed) return
    setLoading(true)

    recordConsent(profile.id, 'kyc_verification', POLICY_VERSION, true)

    let kc = getKycCase(profile.id)
    if (!kc) kc = createKycCase(profile.id)
    updateKycCase(kc.id, { status: 'IN_PROGRESS', consentRecordId: kc.id })

    router.push('/kyc/datos')
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/kyc/inicio" className="text-zinc-500 hover:text-[#00D9FF]"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3"><Scale className="w-6 h-6 text-[#00D9FF]" /> Consentimiento</h1>
            <p className="text-sm text-zinc-500">Paso 1 de 6 — Autorización de verificación</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="w-5 h-5 text-[#00D9FF]" />
              <h3 className="text-sm font-bold">Motivo de la verificación</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              ZAFIRO requiere verificar la identidad de sus miembros para garantizar la seguridad de la comunidad, prevenir fraudes y cumplir con las normativas internacionales de prevención de lavado de dinero (AML) y conocimiento del cliente (KYC).
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-[#00D9FF]" />
              <h3 className="text-sm font-bold">Información solicitada</h3>
            </div>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-1 flex-shrink-0" /> Nombre legal completo</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-1 flex-shrink-0" /> Fecha de nacimiento</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-1 flex-shrink-0" /> País de residencia y dirección</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-1 flex-shrink-0" /> Número de teléfono</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-1 flex-shrink-0" /> Fotografía del documento de identidad</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <UserCheck className="w-5 h-5 text-[#00D9FF]" />
              <h3 className="text-sm font-bold">Proveedor que la procesará</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Los datos son procesados por el proveedor de verificación de identidad contratado por ZAFIRO. En la fase actual utilizamos un proveedor sandbox de prueba. En producción, los datos se procesan a través de un proveedor certificado y regulado.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-[#00D9FF]" />
              <h3 className="text-sm font-bold">Tiempo de conservación</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Los datos de verificación se conservan durante todo el tiempo que mantengas tu cuenta activa en ZAFIRO, más un período adicional de 5 años tras la eliminación de la cuenta, conforme a las obligaciones legales de retención.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Scale className="w-5 h-5 text-[#00D9FF]" />
              <h3 className="text-sm font-bold">Derechos del usuario</h3>
            </div>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-1 flex-shrink-0" /> Derecho de acceso a tus datos</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-1 flex-shrink-0" /> Derecho de rectificación</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-1 flex-shrink-0" /> Derecho de eliminación (sujeto a obligaciones legales)</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-1 flex-shrink-0" /> Derecho de oposición al tratamiento</li>
              <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-1 flex-shrink-0" /> Derecho de portabilidad de datos</li>
            </ul>
          </motion.div>
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-5 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 accent-[#00D9FF]" />
            <span className="text-sm text-zinc-400 leading-relaxed">
              He leído y acepto la <Link href="/privacy" className="text-[#00D9FF] hover:underline">Política de Privacidad</Link> y autorizo a ZAFIRO a verificar mi identidad conforme a los términos descritos. Versión de política: <span className="text-zinc-300 font-mono">{POLICY_VERSION}</span>.
            </span>
          </label>
        </div>

        <button onClick={handleSubmit} disabled={!agreed || loading}
          className="w-full py-3 bg-[#00D9FF] text-[#050816] font-semibold rounded-xl hover:bg-[#00D9FF]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Procesando...' : 'Aceptar y continuar'}
        </button>
      </div>
    </div>
  )
}

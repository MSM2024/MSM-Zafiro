'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  ArrowLeft, ShieldCheck, FileText, Clock, CheckCircle2,
  AlertTriangle, Upload, Loader2,
} from 'lucide-react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import {
  getProfileByAuthId, bootstrapOwnerProfile,
  getBusinessProfile, updateBusinessProfile,
  type Profile, type BusinessProfile,
} from '@/lib/identity'

const REQUIRED_DOCS = [
  { id: 'mercantile', name: 'Registro mercantil', desc: 'Documento de constitución o registro ante cámara de comercio.' },
  { id: 'license', name: 'Licencia comercial', desc: 'Permiso o licencia para operar el negocio.' },
  { id: 'tax', name: 'Documento fiscal', desc: 'Registro tributario o identificación fiscal de la empresa.' },
  { id: 'address', name: 'Comprobante de dirección', desc: 'Factura de servicios o estado de cuenta reciente.' },
  { id: 'statutes', name: 'Estatutos', desc: 'Estatutos sociales o acta constitutiva.' },
  { id: 'bank', name: 'Certificación bancaria', desc: 'Carta o certificado de la cuenta bancaria empresarial.' },
]

export default function EmprendedorVerificacionPage() {
  usePageTitle('Verificación Empresarial KYB — ZAFIRO')
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const session = getSession()
    if (!session) { router.replace('/auth/login'); return }
    const p = bootstrapOwnerProfile() || getProfileByAuthId(session.id)
    if (!p) return
    setProfile(p)
    const bp = getBusinessProfile(p.id)
    if (bp) {
      setBusinessProfile(bp)
      if (bp.verificationStatus === 'NOT_STARTED') {
        updateBusinessProfile(bp.id, { verificationStatus: 'IN_PROGRESS' })
        setBusinessProfile({ ...bp, verificationStatus: 'IN_PROGRESS' })
      }
    }
  }, [router])

  const handleStartKYB = () => {
    if (!businessProfile) return
    updateBusinessProfile(businessProfile.id, { verificationStatus: 'IN_PROGRESS' })
    setBusinessProfile({ ...businessProfile, verificationStatus: 'IN_PROGRESS' })
  }

  const handleUpload = (docId: string) => {
    setUploadedDocs(prev => ({ ...prev, [docId]: true }))
  }

  const handleSubmitForReview = () => {
    if (!businessProfile) return
    updateBusinessProfile(businessProfile.id, { verificationStatus: 'PENDING_REVIEW' })
    setBusinessProfile({ ...businessProfile, verificationStatus: 'PENDING_REVIEW' })
  }

  const status = businessProfile?.verificationStatus || 'NOT_STARTED'
  const allUploaded = REQUIRED_DOCS.every(d => uploadedDocs[d.id])

  const statusConfig = {
    NOT_STARTED: { icon: AlertTriangle, color: 'text-zinc-500', bg: 'bg-zinc-900/40', label: 'No iniciado' },
    IN_PROGRESS: { icon: FileText, color: 'text-yellow-400', bg: 'bg-yellow-400/5', label: 'En progreso' },
    PENDING_REVIEW: { icon: Loader2, color: 'text-blue-400', bg: 'bg-blue-400/5', label: 'En revisión' },
    APPROVED: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/5', label: 'Aprobada' },
    REJECTED: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/5', label: 'Rechazada' },
    MORE_INFORMATION_REQUIRED: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-400/5', label: 'Info requerida' },
    EXPIRED: { icon: Clock, color: 'text-zinc-500', bg: 'bg-zinc-900/40', label: 'Expirada' },
    SUSPENDED: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/5', label: 'Suspendida' },
  } as const

  const sc = statusConfig[status as keyof typeof statusConfig] || statusConfig.NOT_STARTED

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/emprendedor" className="text-zinc-500 hover:text-[#00D9FF]"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3"><ShieldCheck className="w-6 h-6 text-[#00D9FF]" /> Verificación KYB</h1>
            <p className="text-sm text-zinc-500">Conocimiento de tu empresa (Know Your Business)</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className={`${sc.bg} border border-zinc-800 rounded-2xl p-5 mb-6 flex items-center gap-4`}>
          <sc.icon className={`w-8 h-8 ${sc.color} ${status === 'PENDING_REVIEW' ? 'animate-spin' : ''}`} />
          <div>
            <p className={`text-sm font-bold ${sc.color}`}>{sc.label}</p>
            <p className="text-xs text-zinc-500">
              {status === 'NOT_STARTED' && 'Inicia el proceso de verificación empresarial.'}
              {status === 'IN_PROGRESS' && 'Sube los documentos requeridos para completar la verificación.'}
              {status === 'PENDING_REVIEW' && 'Documentos empresariales en revisión. Te notificaremos cuando se completen.'}
              {status === 'APPROVED' && 'Tu empresa ha sido verificada exitosamente.'}
              {status === 'REJECTED' && 'La verificación fue rechazada. Contacta soporte para más detalles.'}
            </p>
          </div>
        </motion.div>

        {status === 'NOT_STARTED' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center mb-6">
            <ShieldCheck className="w-12 h-12 text-[#00D9FF]/30 mx-auto mb-3" />
            <h2 className="text-lg font-bold mb-2">Verificación Empresarial (KYB)</h2>
            <p className="text-sm text-zinc-500 mb-4 max-w-md mx-auto">
              El proceso KYB verifica la existencia legal y operativa de tu empresa.
              Necesitarás proporcionar documentos de constitución y registro.
            </p>
            <button onClick={handleStartKYB}
              className="px-6 py-3 bg-[#00D9FF] text-[#050816] font-semibold rounded-xl hover:bg-[#00D9FF]/90 transition-all">
              Iniciar Verificación
            </button>
          </motion.div>
        )}

        {status === 'PENDING_REVIEW' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center mb-6">
            <Loader2 className="w-12 h-12 text-blue-400 mx-auto mb-3 animate-spin" />
            <h2 className="text-lg font-bold mb-2">Documentos en revisión</h2>
            <p className="text-sm text-zinc-500">Nuestro equipo está verificando los documentos empresariales. Esto puede tomar 1-3 días hábiles.</p>
          </motion.div>
        )}

        {status === 'APPROVED' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-emerald-400/5 border border-emerald-400/20 rounded-2xl p-6 text-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-emerald-400 mb-2">Empresa Verificada</h2>
            <p className="text-sm text-zinc-500">Tu empresa está activa y verificada en ZAFIRO.</p>
          </motion.div>
        )}

        {(status === 'IN_PROGRESS' || status === 'MORE_INFORMATION_REQUIRED') && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold">Documentos requeridos</h3>
            {REQUIRED_DOCS.map((doc, i) => (
              <motion.div key={doc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.03 }}
                className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${uploadedDocs[doc.id] ? 'bg-emerald-400/10' : 'bg-zinc-800/50'}`}>
                  {uploadedDocs[doc.id] ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <FileText className="w-5 h-5 text-zinc-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{doc.name}</p>
                  <p className="text-xs text-zinc-500">{doc.desc}</p>
                </div>
                {!uploadedDocs[doc.id] && (
                  <button onClick={() => handleUpload(doc.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium transition-all">
                    <Upload className="w-3.5 h-3.5" /> Subir
                  </button>
                )}
              </motion.div>
            ))}

            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              onClick={handleSubmitForReview} disabled={!allUploaded}
              className="w-full py-3 bg-[#00D9FF] text-[#050816] font-semibold rounded-xl hover:bg-[#00D9FF]/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-4">
              Enviar para revisión
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}

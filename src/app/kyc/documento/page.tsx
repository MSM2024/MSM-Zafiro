'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowLeft, FileText, Upload, CheckCircle, AlertCircle, Shield } from 'lucide-react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import {
  getProfileByAuthId, bootstrapOwnerProfile, getKycCase, updateKycCase,
  addKycDocument,
  type Profile, type KycCase,
} from '@/lib/identity'

const DOC_TYPES = [
  { id: 'passport', label: 'Pasaporte', desc: 'Pasaporte vigente de cualquier país.' },
  { id: 'drivers_license', label: 'Licencia de conducir', desc: 'Licencia de conducir vigente.' },
  { id: 'national_id', label: 'Documento nacional', desc: 'Cédula de identidad o documento nacional.' },
  { id: 'residence_permit', label: 'Permiso de residencia', desc: 'Tarjeta de residencia o permiso de estancia.' },
]

export default function KycDocumentoPage() {
  usePageTitle('Documento — Verificación ZAFIRO')
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [kycCase, setKycCase] = useState<KycCase | null>(null)
  const [selectedType, setSelectedType] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [loading, setLoading] = useState(false)

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setFileName(file.name)
  }

  const handleSubmit = () => {
    if (!kycCase || !selectedType || !fileName) return
    setLoading(true)

    addKycDocument(kycCase.id, selectedType, fileName)
    updateKycCase(kycCase.id, { status: 'PENDING_REVIEW', submittedAt: new Date().toISOString() })

    router.push('/kyc/estado')
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/kyc/datos" className="text-zinc-500 hover:text-[#00D9FF]"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3"><FileText className="w-6 h-6 text-[#00D9FF]" /> Documento de identidad</h1>
            <p className="text-sm text-zinc-500">Paso 3 de 6 — Sube tu documento oficial</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold mb-3">Tipo de documento</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DOC_TYPES.map((doc) => (
                <motion.button key={doc.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedType(doc.id)}
                  className={`text-left p-4 rounded-xl border transition-all ${selectedType === doc.id
                    ? 'bg-[#00D9FF]/10 border-[#00D9FF]/40'
                    : 'bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700'
                  }`}>
                  <p className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#00D9FF]" />
                    {doc.label}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">{doc.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {selectedType && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-sm font-bold mb-3">Subir imagen del documento</h3>
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
                <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileSelect} className="hidden" />

                {fileName ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{fileName}</p>
                      <p className="text-xs text-zinc-500">Archivo seleccionado</p>
                    </div>
                    <button onClick={() => { setFileName(''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                      className="text-xs text-zinc-500 hover:text-red-400 transition-colors">
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <button onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center gap-3 py-8 border-2 border-dashed border-zinc-800 rounded-xl hover:border-[#00D9FF]/30 transition-all">
                    <Upload className="w-8 h-8 text-zinc-600" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-zinc-400">Haz clic para seleccionar archivo</p>
                      <p className="text-xs text-zinc-600 mt-1">PNG, JPG o PDF — Máx. 10 MB</p>
                    </div>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#00D9FF] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  No almacenamos imágenes de documentos en carpetas públicas. Usamos almacenamiento cifrado temporal que se elimina después del proceso de verificación.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Asegúrate de que la imagen sea clara, que todos los datos sean legibles y que el documento esté vigente. Documentos borrosos o vencidos serán rechazados.
                </p>
              </div>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading || !selectedType || !fileName}
            className="w-full py-3 bg-[#00D9FF] text-[#050816] font-semibold rounded-xl hover:bg-[#00D9FF]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Enviando...' : 'Enviar documento'}
          </button>
        </div>
      </div>
    </div>
  )
}

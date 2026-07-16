'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowLeft, UserCheck, Lock } from 'lucide-react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import {
  getProfileByAuthId, bootstrapOwnerProfile, getKycCase, updateKycCase,
  updatePrivateData, getPrivateData,
  type Profile,
} from '@/lib/identity'

const COUNTRIES = [
  { code: 'CU', name: 'Cuba' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'ES', name: 'España' },
  { code: 'MX', name: 'México' },
  { code: 'CO', name: 'Colombia' },
  { code: 'AR', name: 'Argentina' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'DO', name: 'República Dominicana' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'PA', name: 'Panamá' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CL', name: 'Chile' },
  { code: 'PE', name: 'Perú' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'OTHER', name: 'Otro' },
]

export default function KycDatosPage() {
  usePageTitle('Datos personales — Verificación ZAFIRO')
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    legalFirstName: '',
    legalLastName: '',
    dateOfBirth: '',
    countryCode: 'CU',
    phoneE164: '',
    addressLine1: '',
    municipalityCity: '',
    provinceRegion: '',
    postalCode: '',
  })

  useEffect(() => {
    const session = getSession()
    if (!session) { router.replace('/auth/login'); return }
    const p = bootstrapOwnerProfile() || getProfileByAuthId(session.id)
    if (p) {
      setProfile(p)
      const existing = getPrivateData(p.id)
      if (existing) {
        setForm({
          legalFirstName: existing.legalFirstName || '',
          legalLastName: existing.legalLastName || '',
          dateOfBirth: existing.dateOfBirth || '',
          countryCode: existing.countryCode || 'CU',
          phoneE164: existing.phoneE164 || '',
          addressLine1: existing.addressLine1 || '',
          municipalityCity: existing.municipalityCity || '',
          provinceRegion: existing.provinceRegion || '',
          postalCode: existing.postalCode || '',
        })
      }
    }
  }, [router])

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setLoading(true)

    updatePrivateData(profile.id, {
      legalFirstName: form.legalFirstName,
      legalLastName: form.legalLastName,
      dateOfBirth: form.dateOfBirth,
      countryCode: form.countryCode,
      phoneE164: form.phoneE164,
      addressLine1: form.addressLine1,
      municipalityCity: form.municipalityCity,
      provinceRegion: form.provinceRegion,
      postalCode: form.postalCode,
    })

    const kc = getKycCase(profile.id)
    if (kc) {
      updateKycCase(kc.id, { status: 'IN_PROGRESS' })
    }

    router.push('/kyc/documento')
  }

  const inputClass = 'w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#00D9FF]/50 transition-all'
  const labelClass = 'block text-xs font-medium text-zinc-500 mb-1.5'

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/kyc/inicio" className="text-zinc-500 hover:text-[#00D9FF]"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3"><UserCheck className="w-6 h-6 text-[#00D9FF]" /> Datos personales</h1>
            <p className="text-sm text-zinc-500">Paso 2 de 6 — Información de identidad</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
          <Lock className="w-3 h-3" />
          <span>Tus datos personales están cifrados y protegidos.</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold mb-4">Nombre legal</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nombre(s)</label>
                <input type="text" value={form.legalFirstName} onChange={(e) => handleChange('legalFirstName', e.target.value)}
                  placeholder="Ej: María Elena" className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Apellido(s)</label>
                <input type="text" value={form.legalLastName} onChange={(e) => handleChange('legalLastName', e.target.value)}
                  placeholder="Ej: Rodríguez López" className={inputClass} required />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold mb-4">Fecha de nacimiento</h3>
            <div>
              <label className={labelClass}>Fecha</label>
              <input type="date" value={form.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                className={inputClass} required />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold mb-4">País y teléfono</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>País de residencia</label>
                <select value={form.countryCode} onChange={(e) => handleChange('countryCode', e.target.value)} className={inputClass}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Teléfono (E.164)</label>
                <input type="tel" value={form.phoneE164} onChange={(e) => handleChange('phoneE164', e.target.value)}
                  placeholder="+53 5555 1234" className={inputClass} />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold mb-4">Dirección</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Dirección</label>
                <input type="text" value={form.addressLine1} onChange={(e) => handleChange('addressLine1', e.target.value)}
                  placeholder="Calle, número, apartamento" className={inputClass} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Municipio / Ciudad</label>
                  <input type="text" value={form.municipalityCity} onChange={(e) => handleChange('municipalityCity', e.target.value)}
                    placeholder="Ej: La Habana" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Provincia / Región</label>
                  <input type="text" value={form.provinceRegion} onChange={(e) => handleChange('provinceRegion', e.target.value)}
                    placeholder="Ej: La Habana" className={inputClass} />
                </div>
              </div>
              <div className="w-1/2">
                <label className={labelClass}>Código postal</label>
                <input type="text" value={form.postalCode} onChange={(e) => handleChange('postalCode', e.target.value)}
                  placeholder="Ej: 10100" className={inputClass} />
              </div>
            </div>
          </motion.div>

          <button type="submit" disabled={loading || !form.legalFirstName || !form.legalLastName || !form.dateOfBirth}
            className="w-full py-3 bg-[#00D9FF] text-[#050816] font-semibold rounded-xl hover:bg-[#00D9FF]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Guardando...' : 'Guardar y continuar'}
          </button>
        </form>
      </div>
    </div>
  )
}

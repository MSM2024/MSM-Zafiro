'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowLeft, Building2, Globe, Mail, Phone } from 'lucide-react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import {
  getProfileByAuthId, bootstrapOwnerProfile,
  getBusinessProfile, createBusinessProfile, updateBusinessProfile,
  type Profile,
} from '@/lib/identity'

const ENTITY_TYPES = [
  'LLC', 'Corporation', 'Sole Proprietorship', 'Partnership', 'Non-profit', 'Other',
]

const BUSINESS_CATEGORIES = [
  'Technology', 'Commerce', 'Services', 'Education', 'Health',
  'Finance', 'Manufacturing', 'Real Estate', 'Other',
]

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

export default function EmprendedorRegistroPage() {
  usePageTitle('Registro Empresarial — ZAFIRO')
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    legalBusinessName: '',
    tradingName: '',
    entityType: 'LLC',
    registrationNumber: '',
    incorporationCountry: 'CU',
    businessCategory: 'Technology',
    businessDescription: '',
    website: '',
    supportEmail: '',
    supportPhone: '',
  })

  useEffect(() => {
    const session = getSession()
    if (!session) { router.replace('/auth/login'); return }
    const p = bootstrapOwnerProfile() || getProfileByAuthId(session.id)
    if (!p) return
    setProfile(p)
    const bp = getBusinessProfile(p.id)
    if (bp) {
      setForm({
        legalBusinessName: bp.legalBusinessName || '',
        tradingName: bp.tradingName || '',
        entityType: bp.entityType || 'LLC',
        registrationNumber: bp.registrationNumber || '',
        incorporationCountry: bp.incorporationCountry || 'CU',
        businessCategory: bp.businessCategory || 'Technology',
        businessDescription: bp.businessDescription || '',
        website: bp.website || '',
        supportEmail: bp.supportEmail || '',
        supportPhone: bp.supportPhone || '',
      })
    }
  }, [router])

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile || !form.legalBusinessName.trim()) return
    setLoading(true)

    let bp = getBusinessProfile(profile.id)
    if (!bp) {
      bp = createBusinessProfile(profile.id, form.legalBusinessName.trim(), form.entityType)
    } else {
      updateBusinessProfile(bp.id, {
        legalBusinessName: form.legalBusinessName.trim(),
        tradingName: form.tradingName.trim() || undefined,
        entityType: form.entityType,
        registrationNumber: form.registrationNumber.trim() || undefined,
        incorporationCountry: form.incorporationCountry,
        businessCategory: form.businessCategory,
        businessDescription: form.businessDescription.trim() || undefined,
        website: form.website.trim() || undefined,
        supportEmail: form.supportEmail.trim() || undefined,
        supportPhone: form.supportPhone.trim() || undefined,
      })
    }

    setTimeout(() => {
      setLoading(false)
      router.push('/emprendedor')
    }, 400)
  }

  const inputClass = 'w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#00D9FF]/50 transition-all'
  const labelClass = 'block text-xs font-medium text-zinc-500 mb-1.5'

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/emprendedor" className="text-zinc-500 hover:text-[#00D9FF]"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3"><Building2 className="w-6 h-6 text-[#00D9FF]" /> Registro Empresarial</h1>
            <p className="text-sm text-zinc-500">Datos legales de tu empresa</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold mb-4">Identificación legal</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nombre legal de la empresa *</label>
                <input type="text" value={form.legalBusinessName} onChange={(e) => handleChange('legalBusinessName', e.target.value)}
                  placeholder="Ej: Zafiro Technologies S.A." className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Nombre comercial</label>
                <input type="text" value={form.tradingName} onChange={(e) => handleChange('tradingName', e.target.value)}
                  placeholder="Nombre que usan los clientes" className={inputClass} />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold mb-4">Tipo y registro</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Tipo de entidad</label>
                <select value={form.entityType} onChange={(e) => handleChange('entityType', e.target.value)} className={inputClass}>
                  {ENTITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Número de registro</label>
                <input type="text" value={form.registrationNumber} onChange={(e) => handleChange('registrationNumber', e.target.value)}
                  placeholder="RFC, NIT, etc." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>País de constitución</label>
                <select value={form.incorporationCountry} onChange={(e) => handleChange('incorporationCountry', e.target.value)} className={inputClass}>
                  {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Categoría del negocio</label>
                <select value={form.businessCategory} onChange={(e) => handleChange('businessCategory', e.target.value)} className={inputClass}>
                  {BUSINESS_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold mb-4">Descripción</h3>
            <div>
              <label className={labelClass}>Descripción del negocio</label>
              <textarea value={form.businessDescription} onChange={(e) => handleChange('businessDescription', e.target.value)}
                placeholder="Describe brevemente la actividad principal de tu empresa..." rows={4}
                className={`${inputClass} resize-none`} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold mb-4">Contacto</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Sitio web</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input type="url" value={form.website} onChange={(e) => handleChange('website', e.target.value)}
                    placeholder="https://miempresa.com" className={`${inputClass} pl-10`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Email de soporte</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input type="email" value={form.supportEmail} onChange={(e) => handleChange('supportEmail', e.target.value)}
                    placeholder="soporte@miempresa.com" className={`${inputClass} pl-10`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Teléfono de soporte</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <input type="tel" value={form.supportPhone} onChange={(e) => handleChange('supportPhone', e.target.value)}
                    placeholder="+53 5555 1234" className={`${inputClass} pl-10`} />
                </div>
              </div>
            </div>
          </motion.div>

          <button type="submit" disabled={loading || !form.legalBusinessName.trim()}
            className="w-full py-3 bg-[#00D9FF] text-[#050816] font-semibold rounded-xl hover:bg-[#00D9FF]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Guardando...' : 'Registrar Empresa'}
          </button>
        </form>
      </div>
    </div>
  )
}

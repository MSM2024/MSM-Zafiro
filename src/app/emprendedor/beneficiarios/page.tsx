'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowLeft, Users, Plus, X, ShieldCheck, Info,
} from 'lucide-react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import {
  getProfileByAuthId, bootstrapOwnerProfile,
  getBusinessProfile, getBusinessMembers, addBusinessMember,
  type Profile, type BusinessProfile, type BusinessMember,
} from '@/lib/identity'

const KYC_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  NOT_STARTED: { label: 'Sin KYC', color: 'text-zinc-500', bg: 'bg-zinc-800/50' },
  IN_PROGRESS: { label: 'KYC en curso', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  PENDING_REVIEW: { label: 'En revisión', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  APPROVED: { label: 'KYC Aprobado', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  REJECTED: { label: 'KYC Rechazado', color: 'text-red-400', bg: 'bg-red-400/10' },
}

export default function EmprendedorBeneficiariosPage() {
  usePageTitle('Beneficiarios — ZAFIRO')
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
  const [beneficiaries, setBeneficiaries] = useState<BusinessMember[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    ownershipPercentage: '',
  })

  useEffect(() => {
    const session = getSession()
    if (!session) { router.replace('/auth/login'); return }
    const p = bootstrapOwnerProfile() || getProfileByAuthId(session.id)
    if (!p) return
    setProfile(p)
    const bp = getBusinessProfile(p.id)
    if (!bp) { router.replace('/emprendedor'); return }
    setBusinessProfile(bp)
    const all = getBusinessMembers(bp.id)
    setBeneficiaries(all.filter(m => m.controlRole === 'beneficial_owner'))
  }, [router])

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessProfile || !form.fullName.trim()) return
    setLoading(true)
    const ownership = form.ownershipPercentage ? parseFloat(form.ownershipPercentage) : undefined
    addBusinessMember(businessProfile.id, form.fullName.trim(), 'beneficial_owner', ownership)
    const all = getBusinessMembers(businessProfile.id)
    setBeneficiaries(all.filter(m => m.controlRole === 'beneficial_owner'))
    setForm({ fullName: '', ownershipPercentage: '' })
    setShowForm(false)
    setLoading(false)
  }

  const totalOwnership = beneficiaries.reduce((acc, b) => acc + (b.ownershipPercentage || 0), 0)

  const inputClass = 'w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#00D9FF]/50 transition-all'
  const labelClass = 'block text-xs font-medium text-zinc-500 mb-1.5'

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/emprendedor" className="text-zinc-500 hover:text-[#00D9FF]"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-3"><Users className="w-6 h-6 text-[#00D9FF]" /> Beneficiarios</h1>
            <p className="text-sm text-zinc-500">Beneficiarios reales de tu empresa</p>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] rounded-xl text-sm font-medium hover:bg-[#00D9FF]/20 transition-all">
              <Plus className="w-4 h-4" /> Añadir
            </button>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-blue-400/5 border border-blue-400/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-blue-300 font-medium mb-1">Aviso importante</p>
            <p className="text-xs text-zinc-500">
              Los beneficiarios reales con ownership significativo (generalmente &gt;25%) deben completar verificación KYC individual.
              Esto es requerido por regulaciones anti-lavado de dinero.
            </p>
          </div>
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6">
              <form onSubmit={handleSubmit}
                className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold">Nuevo beneficiario</h3>
                  <button type="button" onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className={labelClass}>Nombre completo *</label>
                  <input type="text" value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="Nombre y apellidos del beneficiario" className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>% Participación</label>
                  <input type="number" min="0" max="100" step="0.01" value={form.ownershipPercentage}
                    onChange={(e) => handleChange('ownershipPercentage', e.target.value)}
                    placeholder="0.00" className={inputClass} />
                </div>
                <button type="submit" disabled={loading || !form.fullName.trim()}
                  className="w-full py-3 bg-[#00D9FF] text-[#050816] font-semibold rounded-xl hover:bg-[#00D9FF]/90 transition-all disabled:opacity-50">
                  {loading ? 'Guardando...' : 'Añadir Beneficiario'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {beneficiaries.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 mb-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-zinc-500">Total participación de beneficiarios</p>
              <p className={`text-lg font-bold ${totalOwnership > 100 ? 'text-red-400' : 'text-white'}`}>{totalOwnership.toFixed(1)}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500">Beneficiarios</p>
              <p className="text-lg font-bold">{beneficiaries.length}</p>
            </div>
          </motion.div>
        )}

        <div className="space-y-3">
          {beneficiaries.map((b, i) => {
            const st = KYC_STATUS_MAP[b.kycStatus] || KYC_STATUS_MAP.NOT_STARTED
            return (
              <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800/60 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#00D9FF]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{b.fullName}</p>
                    <p className="text-xs text-zinc-500">Beneficiario real</p>
                  </div>
                  <div className="text-right space-y-1">
                    {b.ownershipPercentage != null && (
                      <p className="text-sm font-medium">{b.ownershipPercentage}%</p>
                    )}
                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full ${st.color} ${st.bg}`}>
                      {st.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {beneficiaries.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-center py-16">
            <Users className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-500">No hay beneficiarios registrados.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

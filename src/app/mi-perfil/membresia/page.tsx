'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { ArrowLeft, Crown, Gem, CheckCircle, Star, Zap, Shield, Headphones, Layers, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import { getProfileByAuthId, bootstrapOwnerProfile, type Profile } from '@/lib/identity'

const TIER_BENEFITS: Record<string, { label: string; benefits: string[]; price: string; icon: typeof Crown }> = {
  STANDARD: {
    label: 'Estándar',
    price: 'Gratis',
    icon: Star,
    benefits: ['Perfil público', 'Acceso a la red ZAFIRO', 'Preguntas y respuestas', '100MB de almacenamiento'],
  },
  VIP: {
    label: 'VIP',
    price: '$9.99/mes',
    icon: Crown,
    benefits: ['Insignia VIP', 'Perfil destacado', 'Acceso anticipado a productos', '1GB almacenamiento', 'Soporte prioritario', 'Círculos VIP', 'Herramientas ELIANA ampliadas', 'Contenido exclusivo'],
  },
  ENTREPRENEUR_VIP: {
    label: 'Emprendedor VIP',
    price: '$29.99/mes',
    icon: Gem,
    benefits: ['Todos los beneficios VIP', 'Perfil de negocio verificable', 'KYB empresarial', 'Marketplace activo', 'Hasta 10 miembros de equipo', 'Panel avanzado de métricas', 'API de integración', 'Soporte dedicado'],
  },
}

export default function MembresiaPage() {
  usePageTitle('Membresía — ZAFIRO')
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    const session = getSession()
    if (!session) { router.replace('/auth/login'); return }
    const p = bootstrapOwnerProfile() || getProfileByAuthId(session.id)
    if (p) setProfile(p)
  }, [router])

  const currentTier = profile?.membershipTier || 'STANDARD'

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/mi-perfil" className="text-zinc-500 hover:text-[#00D9FF]"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3"><Crown className="w-6 h-6 text-amber-400" /> Membresía</h1>
            <p className="text-sm text-zinc-500">Plan actual: {TIER_BENEFITS[currentTier]?.label || 'Estándar'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(TIER_BENEFITS).map(([key, tier]) => {
            const isCurrent = currentTier === key
            const Icon = tier.icon
            return (
              <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`relative bg-zinc-900/40 border rounded-2xl p-6 transition-all cursor-pointer ${isCurrent ? 'border-[#00D9FF]/40 bg-[#00D9FF]/5' : 'border-zinc-800 hover:border-zinc-700'}`}
                onClick={() => setSelected(key === selected ? null : key)}>
                {isCurrent && <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-[#00D9FF] text-[#050816] text-[8px] font-bold rounded-full">ACTUAL</div>}
                <Icon className={`w-8 h-8 mb-3 ${key === 'ENTREPRENEUR_VIP' ? 'text-indigo-400' : key === 'VIP' ? 'text-amber-400' : 'text-zinc-400'}`} />
                <h3 className="text-lg font-bold mb-1">{tier.label}</h3>
                <p className="text-xl font-bold text-[#00D9FF] mb-4">{tier.price}</p>
                <ul className="space-y-2">
                  {tier.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                      <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                {!isCurrent && (
                  <button className="w-full mt-4 py-2 rounded-xl bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 text-xs font-medium hover:bg-[#00D9FF]/30 transition-all">
                    {key === 'ENTREPRENEUR_VIP' ? 'Actualizar a Emprendedor' : 'Actualizar a VIP'}
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>

        {profile?.vipStatus && profile.vipStatus !== 'VIP_ACTIVE' && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-sm">
            <p className="text-amber-400 font-medium">Estado VIP: {profile.vipStatus.replace(/_/g, ' ')}</p>
            <p className="text-zinc-500 text-xs mt-1">Tu membresía VIP tiene un estado pendiente. Contacta a soporte si tienes dudas.</p>
          </div>
        )}
      </div>
    </div>
  )
}

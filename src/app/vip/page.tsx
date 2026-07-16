'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import Link from 'next/link'
import { ArrowLeft, Crown, Gem, CheckCircle, Star, Shield, Headphones, Layers, Sparkles, ChevronRight, Zap } from 'lucide-react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import { getProfileByAuthId, bootstrapOwnerProfile, type Profile } from '@/lib/identity'

const VIP_BENEFITS = [
  { icon: Crown, title: 'Insignia VIP', desc: 'Badges exclusivos visibles en tu perfil y publicaciones.' },
  { icon: Star, title: 'Perfil destacado', desc: 'Apareces primero en búsquedas y exploraciones.' },
  { icon: Zap, title: 'Acceso anticipado', desc: 'Prueba nuevas funciones antes que nadie.' },
  { icon: Shield, title: 'Ofertas exclusivas', desc: 'Descuentos y promociones solo para miembros VIP.' },
  { icon: Layers, title: '1 GB de almacenamiento', desc: 'Sube y comparte más archivos sin límites.' },
  { icon: Headphones, title: 'Soporte prioritario', desc: 'Respuesta garantizada en menos de 24 horas.' },
  { icon: Sparkles, title: 'Círculos VIP', desc: 'Acceso a grupos exclusivos de alto nivel.' },
  { icon: Gem, title: 'Contenido exclusivo', desc: 'Tutoriales, masterclasses y recursos premium.' },
]

export default function VipPage() {
  usePageTitle('VIP — ZAFIRO')
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const session = getSession()
    if (!session) { router.replace('/auth/login'); return }
    const p = bootstrapOwnerProfile() || getProfileByAuthId(session.id)
    if (p) setProfile(p)
  }, [router])

  const isVip = profile?.membershipTier === 'VIP' || profile?.membershipTier === 'ENTREPRENEUR_VIP'

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-zinc-500 hover:text-[#00D9FF]"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3"><Crown className="w-6 h-6 text-amber-400" /> VIP</h1>
            <p className="text-sm text-zinc-500">Membresía premium de ZAFIRO</p>
          </div>
        </div>

        {isVip ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-amber-400">Membresía Activa</h2>
                  <p className="text-sm text-zinc-400">
                    {profile.membershipTier === 'ENTREPRENEUR_VIP' ? 'Emprendedor VIP' : 'VIP'}
                    {profile.vipStatus === 'VIP_ACTIVE' && ' — Confirmada'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>Tienes acceso a todos los beneficios premium</span>
              </div>
            </div>

            <h3 className="text-sm font-medium text-zinc-500 mb-3 uppercase tracking-wider">Tus beneficios</h3>
            <div className="grid grid-cols-2 gap-3">
              {VIP_BENEFITS.map((b, i) => {
                const Icon = b.icon
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
                    <Icon className="w-5 h-5 text-amber-400 mb-2" />
                    <p className="text-sm font-medium">{b.title}</p>
                    <p className="text-xs text-zinc-500 mt-1">{b.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 mb-6 text-center">
              <Crown className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Desbloquea VIP</h2>
              <p className="text-sm text-zinc-500 mb-4">Obtén acceso a beneficios exclusivos, soporte prioritario y herramientas avanzadas.</p>
              <Link href="/mi-perfil/membresia"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D9FF] text-[#050816] font-semibold rounded-xl hover:bg-[#00D9FF]/90 transition-all">
                Ver planes y precios <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <h3 className="text-sm font-medium text-zinc-500 mb-4 uppercase tracking-wider">Lo que obtienes con VIP</h3>
            <div className="space-y-3">
              {VIP_BENEFITS.map((b, i) => {
                const Icon = b.icon
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-4 bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{b.title}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{b.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        <div className="mt-8">
          <Link href="/vip/beneficios"
            className="flex items-center justify-between bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 hover:border-[#00D9FF]/30 transition-all">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#00D9FF]" />
              <span className="text-sm font-medium">Ver beneficios detallados</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </Link>
        </div>
      </div>
    </div>
  )
}

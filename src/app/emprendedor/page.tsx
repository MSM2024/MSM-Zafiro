'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Briefcase, Building2, ShieldCheck, Users, ChevronRight,
  CheckCircle2, Lock, ArrowRight, Star, Crown,
} from 'lucide-react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import {
  getProfileByAuthId, bootstrapOwnerProfile,
  getBusinessProfile, getBusinessMembers,
  type Profile, type BusinessProfile, type BusinessMember,
} from '@/lib/identity'

const FEATURES = [
  { icon: Building2, title: 'Registro Empresarial', desc: 'Registra tu empresa con verificación KYB completa.' },
  { icon: ShieldCheck, title: 'Verificación KYB', desc: 'Proceso de conocimiento comercial para tu negocio.' },
  { icon: Users, title: 'Equipo y Beneficiarios', desc: 'Gestiona miembros y beneficiarios reales de tu empresa.' },
  { icon: Star, title: 'Beneficios Exclusivos', desc: 'Acceso prioritario a herramientas y eventos VIP.' },
]

export default function EmprendedorPage() {
  usePageTitle('Emprendedor VIP — ZAFIRO')
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null)
  const [members, setMembers] = useState<BusinessMember[]>([])

  useEffect(() => {
    const session = getSession()
    if (!session) { router.replace('/auth/login'); return }
    const p = bootstrapOwnerProfile() || getProfileByAuthId(session.id)
    if (!p) return
    setProfile(p)
    const bp = getBusinessProfile(p.id)
    if (bp) {
      setBusinessProfile(bp)
      setMembers(getBusinessMembers(bp.id))
    }
  }, [router])

  const isVIP = profile?.membershipTier === 'ENTREPRENEUR_VIP'

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 mb-4">
            <Crown className="w-8 h-8 text-[#00D9FF]" />
          </div>
          <h1 className="text-3xl font-bold">Emprendedor VIP</h1>
          <p className="text-zinc-500 mt-2">Gestiona tu empresa y desbloquea beneficios exclusivos.</p>
        </motion.div>

        {isVIP && businessProfile ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Estado', value: businessProfile.verificationStatus === 'APPROVED' ? 'Verificada' : 'En proceso', color: businessProfile.verificationStatus === 'APPROVED' ? 'text-emerald-400' : 'text-yellow-400' },
                { label: 'Equipo', value: members.length.toString(), color: 'text-white' },
                { label: 'Entidad', value: businessProfile.entityType || '—', color: 'text-white' },
                { label: 'País', value: businessProfile.incorporationCountry || '—', color: 'text-white' },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 text-center">
                  <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-1">{businessProfile.legalBusinessName}</h3>
              <p className="text-xs text-zinc-500">{businessProfile.businessCategory || 'Sin categoría'} · {String(businessProfile.registeredAddress?.country ?? '—')}</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: '/emprendedor/registro', icon: Building2, label: 'Editar Registro', desc: 'Datos empresariales' },
                { href: '/emprendedor/verificacion', icon: ShieldCheck, label: 'Verificación KYB', desc: businessProfile.verificationStatus === 'APPROVED' ? 'Completada' : 'Pendiente' },
                { href: '/emprendedor/equipo', icon: Users, label: 'Equipo', desc: `${members.length} miembros` },
                { href: '/emprendedor/beneficiarios', icon: Briefcase, label: 'Beneficiarios', desc: 'Owners reales' },
              ].map((item, i) => (
                <motion.div key={item.href} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                  <Link href={item.href}
                    className="flex items-center gap-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 hover:border-[#00D9FF]/30 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#00D9FF]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs text-zinc-500">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-[#00D9FF] transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 text-center">
              <Lock className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h2 className="text-lg font-bold mb-2">Acceso Emprendedor VIP</h2>
              <p className="text-sm text-zinc-500 mb-4">Registra tu empresa para desbloquear herramientas exclusivas y verificación empresarial.</p>
              <Link href="/emprendedor/registro"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D9FF] text-[#050816] font-semibold rounded-xl hover:bg-[#00D9FF]/90 transition-all">
                Registrar Empresa <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                  className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
                  <f.icon className="w-6 h-6 text-[#00D9FF] mb-3" />
                  <h3 className="text-sm font-bold mb-1">{f.title}</h3>
                  <p className="text-xs text-zinc-500">{f.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-3">Comparación de beneficios</h3>
              <div className="space-y-2">
                {[
                  { feature: 'Perfil verificado', standard: true, vip: true, entrepreneur: true },
                  { feature: 'KYC completo', standard: true, vip: true, entrepreneur: true },
                  { feature: 'Registro empresarial', standard: false, vip: false, entrepreneur: true },
                  { feature: 'Verificación KYB', standard: false, vip: false, entrepreneur: true },
                  { feature: 'Gestión de equipo', standard: false, vip: false, entrepreneur: true },
                  { feature: 'Beneficiarios reales', standard: false, vip: false, entrepreneur: true },
                  { feature: 'Soporte prioritario', standard: false, vip: true, entrepreneur: true },
                ].map((row, i) => (
                  <div key={i} className="flex items-center text-xs py-1.5 border-b border-zinc-800/50">
                    <span className="flex-1 text-zinc-400">{row.feature}</span>
                    <span className="w-16 text-center text-zinc-600">{row.standard ? '✓' : '—'}</span>
                    <span className="w-16 text-center text-zinc-600">{row.vip ? '✓' : '—'}</span>
                    <span className="w-20 text-center text-[#00D9FF]">{row.entrepreneur ? '✓' : '—'}</span>
                  </div>
                ))}
                <div className="flex items-center text-[10px] pt-1">
                  <span className="flex-1" />
                  <span className="w-16 text-center text-zinc-600">Std</span>
                  <span className="w-16 text-center text-zinc-600">VIP</span>
                  <span className="w-20 text-center text-[#00D9FF]">Emprendedor</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

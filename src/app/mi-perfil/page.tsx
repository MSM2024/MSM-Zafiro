'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, Shield, Crown, FileCheck, User, Mail, Phone, Globe,
  MapPin, Calendar, Edit3, CheckCircle, XCircle, Clock, AlertTriangle,
  Gem, Star, Building2, BadgeCheck, Sparkles, ChevronRight, Lock,
  Smartphone, Fingerprint, Key, LogOut, ChevronDown, ChevronUp,
} from 'lucide-react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import {
  getProfileByAuthId, bootstrapOwnerProfile, getPrivateData,
  getEarnedBadges, hasPermission, type Profile, type BadgeType,
} from '@/lib/identity'

const BADGE_CONFIG: Record<BadgeType, { label: string; icon: string; color: string }> = {
  ADMINISTRADOR_OFICIAL: { label: 'Administrador Oficial', icon: '🛡️', color: 'text-red-400' },
  VIP: { label: 'VIP', icon: '💎', color: 'text-amber-400' },
  IDENTIDAD_VERIFICADA: { label: 'Identidad Verificada', icon: '✓', color: 'text-emerald-400' },
  EMPRENDEDOR_VIP: { label: 'Emprendedor VIP', icon: '🏢', color: 'text-indigo-400' },
  NEGOCIO_VERIFICADO: { label: 'Negocio Verificado', icon: '🏪', color: 'text-blue-400' },
  FUNDADOR: { label: 'Fundador', icon: '👑', color: 'text-amber-400' },
  EQUIPO_MSM: { label: 'Equipo MSM', icon: '🤝', color: 'text-cyan-400' },
}

export default function MiPerfilPage() {
  usePageTitle('Mi Perfil — ZAFIRO')
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [privateData, setPrivateData] = useState<any>(null)
  const [badges, setBadges] = useState<BadgeType[]>([])
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (!session) { router.replace('/auth/login'); return }
    const ownerProfile = bootstrapOwnerProfile()
    const p = ownerProfile || getProfileByAuthId(session.id)
    if (!p) { router.replace('/auth/login'); return }
    setProfile(p)
    setPrivateData(getPrivateData(p.id))
    setBadges(getEarnedBadges(p.id))
  }, [router])

  if (!profile) return null

  const statCards = [
    { icon: Crown, label: 'Membresía', value: profile.membershipTier === 'ENTREPRENEUR_VIP' ? 'Emprendedor VIP' : profile.membershipTier === 'VIP' ? 'VIP' : 'Estándar', color: profile.membershipTier === 'ENTREPRENEUR_VIP' ? 'text-indigo-400' : profile.membershipTier === 'VIP' ? 'text-amber-400' : 'text-zinc-400' },
    { icon: Shield, label: 'Rol', value: profile.role.replace(/_/g, ' '), color: profile.role === 'OWNER_SUPERADMIN' ? 'text-red-400' : 'text-[#00D9FF]' },
    { icon: profile.verificationStatus === 'APPROVED' ? CheckCircle : Clock, label: 'Verificación', value: profile.verificationStatus.replace(/_/g, ' '), color: profile.verificationStatus === 'APPROVED' ? 'text-emerald-400' : 'text-amber-400' },
    { icon: Star, label: 'Insignias', value: `${badges.length} obtenidas`, color: 'text-purple-400' },
  ]

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-zinc-500 hover:text-[#00D9FF]"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-bold">Mi Perfil</h1>
            <p className="text-sm text-zinc-500">{profile.publicHandle}</p>
          </div>
        </div>

        {/* Profile header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00D9FF]/30 to-amber-500/30 border-2 border-[#00D9FF]/40 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold text-white">{profile.displayName.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profile.displayName}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {badges.map(b => (
                  <span key={b} className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${BADGE_CONFIG[b]?.color || 'text-zinc-400'} bg-current/10 border border-current/20`}>
                    {BADGE_CONFIG[b]?.icon} {BADGE_CONFIG[b]?.label}
                  </span>
                ))}
              </div>
            </div>
            <Link href="/settings" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-[#00D9FF] text-sm hover:bg-zinc-700 transition-all">
              <Edit3 className="w-4 h-4" /> Editar perfil
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 text-center">
              <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
              <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Info */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-[#00D9FF] mb-4 flex items-center gap-2"><User className="w-4 h-4" /> Información</h3>
            <div className="space-y-3 text-sm">
              {[
                { icon: Mail, label: 'Email', value: privateData?.email || '—' },
                { icon: Phone, label: 'Teléfono', value: privateData?.phoneE164 || 'No configurado' },
                { icon: Globe, label: 'País', value: privateData?.countryCode || 'No configurado' },
                { icon: MapPin, label: 'Ubicación', value: [privateData?.provinceRegion, privateData?.municipalityCity].filter(Boolean).join(', ') || 'No configurado' },
                { icon: Calendar, label: 'Miembro desde', value: new Date(profile.createdAt).toLocaleDateString('es-ES', { dateStyle: 'long' }) },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-zinc-400">
                  <item.icon className="w-4 h-4 text-zinc-600" />
                  <span className="w-28 text-zinc-500">{item.label}</span>
                  <span className="text-zinc-300">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-3">
            {[
              { href: '/mi-perfil/seguridad', icon: Lock, label: 'Seguridad', desc: 'MFA, contraseña, sesiones', color: 'text-cyan-400' },
              { href: '/mi-perfil/membresia', icon: Crown, label: 'Membresía', desc: 'Plan actual, beneficios, facturación', color: 'text-amber-400' },
              { href: '/mi-perfil/verificacion', icon: FileCheck, label: 'Verificación', desc: 'Estado KYC, documentos, identidad', color: 'text-emerald-400' },
              { href: '/vip', icon: Gem, label: 'VIP', desc: 'Beneficios exclusivos, contenido premium', color: 'text-purple-400' },
            ].map((item, i) => (
              <Link key={i} href={item.href}
                className="flex items-center gap-4 bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all group">
                <div className={`w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-zinc-500">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-[#00D9FF] transition-colors" />
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Badges detailed */}
        {badges.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mt-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
            <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between w-full">
              <h3 className="text-sm font-semibold text-[#00D9FF] flex items-center gap-2">
                <Star className="w-4 h-4" /> Insignias ({badges.length})
              </h3>
              {expanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </button>
            {expanded && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {badges.map(b => (
                  <div key={b} className="bg-zinc-800/50 rounded-xl p-3 text-center">
                    <div className="text-2xl mb-1">{BADGE_CONFIG[b]?.icon}</div>
                    <div className={`text-xs font-medium ${BADGE_CONFIG[b]?.color || 'text-zinc-400'}`}>{BADGE_CONFIG[b]?.label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

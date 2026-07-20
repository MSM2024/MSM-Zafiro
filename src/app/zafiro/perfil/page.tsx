'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession, logout } from '@/lib/auth'
import {
  getProfileByAuthId, bootstrapOwnerProfile, getPrivateData,
  updateProfile, updatePrivateData, getEarnedBadges,
  type Profile, type BadgeType,
} from '@/lib/identity'
import { isOwnerEmail } from '@/lib/owner'
import { ActivityTimeline } from '@/components/ActivityTimeline'
import { BadgesDisplay } from '@/components/BadgesDisplay'
import {
  Save, LogOut, Shield, ArrowLeft, BookOpen, User,
  Phone, MapPin, Camera, CheckCircle, Crown, X, AlertTriangle,
  Gem, Activity, ExternalLink,
} from 'lucide-react'

const BADGE_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  ADMINISTRADOR_OFICIAL: { label: 'Admin Oficial', icon: '🛡️', color: 'text-red-400' },
  VIP: { label: 'VIP', icon: '💎', color: 'text-amber-400' },
  IDENTIDAD_VERIFICADA: { label: 'Verificado', icon: '✓', color: 'text-emerald-400' },
  FUNDADOR: { label: 'Fundador', icon: '👑', color: 'text-amber-400' },
  EMPRENDEDOR_VIP: { label: 'Emprendedor VIP', icon: '🏢', color: 'text-indigo-400' },
  NEGOCIO_VERIFICADO: { label: 'Negocio Verificado', icon: '🏪', color: 'text-blue-400' },
  EQUIPO_MSM: { label: 'Equipo MSM', icon: '🤝', color: 'text-cyan-400' },
}

export default function ZafiroPerfilPage() {
  usePageTitle('Mi Perfil — ZAFIRO')
  const router = useRouter()
  const [session, setSession] = useState(() => getSession())
  const [profile, setProfile] = useState<Profile | null>(null)
  const [privateData, setPrivateData] = useState<any>(null)
  const [badges, setBadges] = useState<BadgeType[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarWarning, setAvatarWarning] = useState('')
  const [loading, setLoading] = useState(true)
  const [initialForm, setInitialForm] = useState({ displayName: '', phone: '', country: '', bio: '' })
  const [form, setForm] = useState({ displayName: '', phone: '', country: '', bio: '' })
  const fileRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const s = getSession()
    setSession(s)
    if (!s) { router.replace('/auth/login'); return }

    const ownerProfile = bootstrapOwnerProfile()
    const p = ownerProfile || getProfileByAuthId(s.id)
    if (!p) { router.replace('/auth/login'); return }

    setProfile(p)
    const priv = getPrivateData(p.id)
    setPrivateData(priv)
    setBadges(getEarnedBadges(p.id))
    const vals = {
      displayName: p.displayName || '',
      phone: priv?.phoneE164 || '',
      country: priv?.countryCode || '',
      bio: p.biography || '',
    }
    setForm(vals)
    setInitialForm(vals)
    setLoading(false)
  }, [router])

  const handleSave = () => {
    if (!profile || !session) return
    setSaving(true)
    setError('')
    setSaved(false)

    try {
      updateProfile(profile.id, { displayName: form.displayName, biography: form.bio })
      if (privateData) {
        updatePrivateData(profile.id, { phoneE164: form.phone, countryCode: form.country })
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      setError('Error al guardar. Intenta de nuevo.')
    }
    setSaving(false)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarWarning('')
    if (file.size > 2 * 1024 * 1024) { setError('La imagen no debe superar 2 MB'); return }
    if (file.size > 500 * 1024) {
      setAvatarWarning('Imagen grande (>500KB). Se guardar\u00e1 en localStorage (cuota limitada ~5MB). Recomendado: comprimir antes.')
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setAvatarPreview(dataUrl)
      if (profile) updateProfile(profile.id, { profilePhotoUrl: dataUrl })
    }
    reader.readAsDataURL(file)
  }

  const handleLogout = () => { logout(); router.push('/auth/login') }

  const isOwner = session && isOwnerEmail(session.email)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#00D9FF] border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-xs text-slate-400">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  if (!session || !profile) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-bold mb-2">Inicia sesi&oacute;n</h1>
          <Link href="/auth/login" className="text-[#00D9FF] text-sm">Ir a login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>

        {/* Profile header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative group">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D9FF] to-blue-600 flex items-center justify-center text-xl font-black overflow-hidden border-2 border-[#00D9FF]/30">
              {avatarPreview || profile.profilePhotoUrl ? (
                <img src={avatarPreview || profile.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                profile.displayName?.charAt(0)?.toUpperCase() || '?'
              )}
            </div>
            <button onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center hover:bg-slate-700 transition-all cursor-pointer">
              <Camera className="w-3 h-3 text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black truncate">{profile.displayName || 'Sin nombre'}</h1>
            <p className="text-xs text-slate-400 truncate">@{profile.publicHandle}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {badges.slice(0, 3).map(b => (
                <span key={b} className={`text-[8px] px-1.5 py-0.5 rounded-full ${BADGE_CONFIG[b]?.color || 'text-slate-400'} bg-current/10`}>
                  {BADGE_CONFIG[b]?.icon} {BADGE_CONFIG[b]?.label}
                </span>
              ))}
              {badges.length > 3 && (
                <span className="text-[8px] text-slate-500">+{badges.length - 3}</span>
              )}
            </div>
          </div>
        </div>

        {avatarWarning && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
            <p className="text-[8px] text-amber-300">{avatarWarning}</p>
          </div>
        )}

        {/* Owner banner */}
        {isOwner && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
            <Crown className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-amber-300">OWNER · Acceso completo</p>
              <p className="text-[9px] text-amber-500/70 truncate">{profile.role}</p>
            </div>
            <Link href="/admin" className="text-[9px] px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-all shrink-0">
              Panel Admin
            </Link>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { icon: Shield, label: 'Rol', value: profile.role?.replace(/_/g, ' ') || '—', color: profile.role === 'OWNER_SUPERADMIN' ? 'text-amber-400' : 'text-[#00D9FF]' },
            { icon: profile.verificationStatus === 'APPROVED' ? CheckCircle : AlertTriangle, label: 'Verificación', value: profile.verificationStatus === 'APPROVED' ? 'Verificado' : profile.verificationStatus?.replace(/_/g, ' ') || '—', color: profile.verificationStatus === 'APPROVED' ? 'text-emerald-400' : 'text-amber-400' },
            { icon: Crown, label: 'Membresía', value: profile.membershipTier === 'ENTREPRENEUR_VIP' ? 'Emprendedor VIP' : profile.membershipTier === 'VIP' ? 'VIP' : 'Estándar', color: profile.membershipTier === 'ENTREPRENEUR_VIP' ? 'text-indigo-400' : profile.membershipTier === 'VIP' ? 'text-amber-400' : 'text-slate-400' },
          ].map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/60 text-center">
                <Icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
                <p className={`text-xs font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[8px] text-slate-500">{s.label}</p>
              </div>
            )
          })}
        </div>

        {/* Edit form */}
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/60 mb-4">
          <h2 className="text-sm font-bold mb-4">Editar Perfil</h2>

          {error && (
            <div className="flex items-center gap-2 p-2 mb-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
              <p className="text-[10px] text-red-300">{error}</p>
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 p-2 mb-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
              <p className="text-[10px] text-emerald-300">Cambios guardados correctamente</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre</label>
              <input value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00D9FF] outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Teléfono</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00D9FF] outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">País</label>
              <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00D9FF] outline-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-blue-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button onClick={() => { setForm(initialForm); setAvatarPreview(null); setError('') }}
                className="px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 text-xs font-bold hover:text-white transition-all cursor-pointer flex items-center gap-2">
                <X className="w-4 h-4" /> Cancelar
              </button>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/60 mb-4">
          <BadgesDisplay max={16} />
        </div>

        {/* Cross-pillar activity */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00D9FF]" /> Actividad Reciente
          </h2>
          <ActivityTimeline max={6} />
          <Link href="/actividad" className="mt-2 flex items-center justify-center gap-1 text-[9px] text-slate-500 hover:text-[#00D9FF] transition-colors">
            <ExternalLink className="w-3 h-3" /> Ver toda la actividad
          </Link>
        </div>

        {/* Quick links */}
        <div className="space-y-2 mb-6">
          <Link href="/mi-perfil"
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-slate-700 transition-all group">
            <User className="w-4 h-4 text-[#00D9FF]" />
            <span className="flex-1 text-xs font-bold text-white group-hover:text-[#00D9FF] transition-colors">Perfil completo</span>
            <span className="text-[9px] text-slate-500">/mi-perfil</span>
          </Link>
          <Link href="/mi-perfil/seguridad"
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-slate-700 transition-all group">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="flex-1 text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">Seguridad</span>
            <span className="text-[9px] text-slate-500">MFA, sesiones</span>
          </Link>
          <Link href="/mi-perfil/membresia"
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-slate-700 transition-all group">
            <Gem className="w-4 h-4 text-amber-400" />
            <span className="flex-1 text-xs font-bold text-white group-hover:text-amber-400 transition-colors">Membresía</span>
            <span className="text-[9px] text-slate-500">Plan, beneficios</span>
          </Link>
          <Link href="/zafiro/biblioteca"
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:border-slate-700 transition-all group">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span className="flex-1 text-xs font-bold text-white group-hover:text-purple-400 transition-colors">Biblioteca</span>
            <span className="text-[9px] text-slate-500">Libros, obras</span>
          </Link>
        </div>

        {/* Admin links (owner only) */}
        {isOwner && (
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 mb-4">
            <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider mb-2">Acceso Administrativo</p>
            <div className="space-y-1.5">
              <Link href="/admin" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
                → Panel Administrativo
              </Link>
              <Link href="/admin/usuarios" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
                → Usuarios
              </Link>
            </div>
          </div>
        )}

        {/* Logout */}
        <button onClick={handleLogout}
          className="w-full px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" /> Cerrar sesión
        </button>
      </div>
    </div>
  )
}

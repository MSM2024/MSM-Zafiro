'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession, logout } from '@/lib/auth'
import { updateProfile, getProfiles } from '@/lib/profile'
import { getActiveMembership, getMembershipStatusLabel, getUserMembership, type MembershipStatus, type UserMembership } from '@/lib/memberships'
import {
  Save, LogOut, CreditCard, Shield, ArrowLeft, BookOpen,
} from 'lucide-react'

export default function ZafiroPerfilPage() {
  usePageTitle('Mi Perfil — ZAFIRO')
  const router = useRouter()
  const [session] = useState(() => getSession())
  const [profile, setProfile] = useState<{ userId: string; name?: string; username?: string; company?: string; location?: string; bioShort?: string } | null>(null)
  const [membership, setMembership] = useState<UserMembership | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', country: '', bio: '' })

  useEffect(() => {
    const s = getSession()
    if (!s) return
    const allProfiles = getProfiles()
    const p = allProfiles[s.id] || allProfiles[Object.keys(allProfiles).find(k => allProfiles[k].email === s.email) || '']
    if (p) {
      setProfile(p)
      setForm({ name: p.name || '', phone: p.company || '', country: p.location || '', bio: p.bioShort || '' })
    }
    const m = getActiveMembership(s.id) || getUserMembership(s.id)
    if (m) setMembership(m)
  }, [])

  const handleSave = () => {
    if (!session || !profile) return
    setSaving(true)
    updateProfile(profile.userId, {
      name: form.name,
      company: form.phone,
      location: form.country,
      bioShort: form.bio,
    })
    setTimeout(() => setSaving(false), 500)
  }

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-bold mb-2">Inicia sesión</h1>
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

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D9FF] to-blue-600 flex items-center justify-center text-xl font-black">
            {profile?.name?.charAt(0)?.toUpperCase() || session.email?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <h1 className="text-xl font-black">{profile?.name || 'Sin nombre'}</h1>
            <p className="text-xs text-slate-400">{session.email}</p>
            <p className="text-[10px] text-slate-500">@{profile?.username || 'sin-username'}</p>
          </div>
        </div>

        <Link href="/zafiro/biblioteca" className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-[#00D9FF]/30 transition-all mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9FF] to-cyan-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white group-hover:text-[#00D9FF] transition-colors">Biblioteca ZAFIRO</p>
            <p className="text-[10px] text-slate-500">Gestiona tus libros, obras y contenido editorial</p>
          </div>
        </Link>

        {membership && (
          <div className={`p-4 rounded-2xl mb-6 ${
            membership.status === 'ACTIVE' || membership.status === 'LIFETIME'
              ? 'bg-emerald-500/10 border border-emerald-500/20'
              : membership.status === 'PENDING_PAYMENT' || membership.status === 'PAST_DUE'
              ? 'bg-amber-500/10 border border-amber-500/20'
              : 'bg-slate-800/40 border border-slate-700/30'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Membresía</p>
                <p className="text-sm font-bold">{membership.planId?.toUpperCase() || 'GRATIS'}</p>
                <p className="text-[10px] text-slate-400">{getMembershipStatusLabel(membership.status || 'NONE')}</p>
              </div>
              <Link href="/zafiro/membresias"
                className="px-3 py-1.5 rounded-lg bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 text-[9px] font-bold hover:bg-[#00D9FF]/30 transition-all cursor-pointer">
                Gestionar
              </Link>
            </div>
          </div>
        )}

        <div className="p-6 rounded-2xl glass mb-4">
          <h2 className="text-sm font-bold mb-4">Editar Perfil</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
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
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Biografía</label>
              <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3}
                className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00D9FF] outline-none" />
            </div>
            <button onClick={handleSave} disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-blue-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href="/zafiro/membresias"
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800/40 border border-slate-700/30 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-500 transition-all text-center">
            <CreditCard className="w-4 h-4 mx-auto mb-1" /> Membresías
          </Link>
          <Link href="/mi-perfil/seguridad"
            className="flex-1 px-4 py-3 rounded-xl bg-slate-800/40 border border-slate-700/30 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-500 transition-all text-center">
            <Shield className="w-4 h-4 mx-auto mb-1" /> Seguridad
          </Link>
          <button onClick={handleLogout}
            className="flex-1 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer text-center">
            <LogOut className="w-4 h-4 mx-auto mb-1" /> Salir
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import { isOwnerEmail } from '@/lib/owner'
import { getAllMemberships, getMembershipEvents, cancelMembership, type UserMembership } from '@/lib/memberships'
import { getPlanById } from '@/lib/plans'
import { getProfiles, type UserProfile } from '@/lib/profile'
import { Search, User, CreditCard, MoreHorizontal } from 'lucide-react'

export default function AdminPerfilesPage() {
  usePageTitle('Admin Perfiles — ZAFIRO')
  const [authorized] = useState(() => {
    const session = getSession()
    return !!(session && isOwnerEmail(session.email))
  })
  const [memberships, setMemberships] = useState<UserMembership[]>([])
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({})
  const [search, setSearch] = useState('')
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)

  useEffect(() => {
    if (!authorized) return
    setMemberships(getAllMemberships())
    setProfiles(getProfiles())
  }, [authorized])

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-bold mb-2">Acceso Restringido</h1>
          <p className="text-sm text-slate-400">Solo administradores.</p>
          <Link href="/" className="text-[#00D9FF] text-sm mt-4 inline-block">Volver</Link>
        </div>
      </div>
    )
  }

  const filtered = memberships.filter(m => {
    if (!search) return true
    const p = profiles[m.profileId]
    const name = p?.name || p?.email || ''
    return name.toLowerCase().includes(search.toLowerCase()) || m.planId.toLowerCase().includes(search.toLowerCase()) || m.status.toLowerCase().includes(search.toLowerCase())
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-emerald-400 bg-emerald-500/10'
      case 'LIFETIME': return 'text-purple-400 bg-purple-500/10'
      case 'PENDING_PAYMENT': return 'text-amber-400 bg-amber-500/10'
      case 'PAST_DUE': return 'text-red-400 bg-red-500/10'
      case 'CANCELED': return 'text-slate-400 bg-slate-500/10'
      case 'EXPIRED': return 'text-slate-500 bg-slate-800'
      default: return 'text-slate-500 bg-slate-800'
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
          ← Volver
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Admin Perfiles</h1>
            <p className="text-xs text-slate-400">{memberships.length} membresías registradas</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, plan o estado..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#00D9FF] outline-none" />
        </div>

        <div className="space-y-3">
          {filtered.map(m => {
            const profile = profiles[m.profileId]
            const plan = getPlanById(m.planId)
            const events = selectedProfile === m.profileId ? getMembershipEvents(m.profileId, 5) : []

            return (
              <div key={m.id} className="p-4 rounded-2xl glass">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm font-bold text-slate-400">
                      {profile?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{profile?.name || 'Usuario desconocido'}</h3>
                      <p className="text-[10px] text-slate-500">{profile?.email || m.profileId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusColor(m.status)}`}>
                      {m.status}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">{plan?.name || m.planId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 text-[9px] text-slate-600 font-mono">
                  <span>ID: {m.profileId.slice(0, 8)}...</span>
                  {m.currentPeriodEnd && <span>Vence: {new Date(m.currentPeriodEnd).toLocaleDateString()}</span>}
                  {m.billingInterval && <span>{m.billingInterval}</span>}
                  {m.stripeSubscriptionId && <span>Stripe: ✓</span>}
                </div>

                <details className="mt-2">
                  <summary className="text-[9px] text-slate-600 cursor-pointer hover:text-slate-400">Eventos</summary>
                  <div className="mt-2 space-y-1">
                    {events.length === 0 && <p className="text-[9px] text-slate-600">Sin eventos</p>}
                    {events.map(e => (
                      <div key={e.id} className="p-2 rounded-lg bg-slate-950 text-[9px] text-slate-500 font-mono">
                        <span className="text-slate-400">{e.eventType}</span> · {new Date(e.createdAt).toLocaleString()} · {e.source}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div className="p-8 rounded-2xl glass text-center text-sm text-slate-500">
              {search ? 'Sin resultados' : 'No hay membresías registradas'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

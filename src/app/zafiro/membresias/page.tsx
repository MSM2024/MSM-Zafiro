'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import { getActiveMembership, getUserMembership, getMembershipStatusLabel, cancelMembership, type MembershipStatus, type UserMembership } from '@/lib/memberships'
import { getActivePlans, type Plan } from '@/lib/plans'
import { CheckCircle, ArrowLeft, Loader } from 'lucide-react'

export default function ZafiroMembresiasPage() {
  usePageTitle('Membresías — ZAFIRO')
  const searchParams = useSearchParams()
  const [session] = useState(() => getSession())
  const [currentMembership, setCurrentMembership] = useState<UserMembership | null>(null)
  const [plans] = useState(getActivePlans())
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!session) return

    const active = getActiveMembership(session.id)
    const any_m = getUserMembership(session.id)
    setCurrentMembership(active || any_m)

    if (success === '1' && sessionId) {
      setMessage({ type: 'info', text: 'Pago pendiente de confirmación por Stripe. La membresía se activará cuando el webhook sea recibido.' })
    }
    if (canceled === '1') {
      setMessage({ type: 'error', text: 'Pago cancelado. Puedes intentarlo de nuevo cuando quieras.' })
    }
  }, [success, canceled, sessionId, session])

  const handleSubscribe = async (plan: Plan, interval: 'month' | 'annual') => {
    if (!session) return
    if (plan.priceMonthly === 0) {
      setMessage({ type: 'info', text: 'Ya tienes el plan gratuito.' })
      return
    }

    setLoading(plan.id)
    setMessage(null)

    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: session.id,
          email: session.email,
          planId: plan.id,
          billingInterval: interval,
          successUrl: `${window.location.origin}/zafiro/membresias?success=1&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/zafiro/membresias?canceled=1`,
        }),
      })

      const data = await res.json()

      if (data.error) {
        setMessage({ type: 'error', text: data.error })
        setLoading(null)
        return
      }

      if (data.url) {
        window.location.assign(data.url)
      } else {
        setMessage({ type: 'error', text: 'No se pudo crear la sesión de pago' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexión al servidor' })
    }
    setLoading(null)
  }

  const handleCancel = () => {
    if (!session || !currentMembership) return
    if (!confirm('¿Cancelar tu membresía?')) return
    cancelMembership(session.id, 'frontend')
    setCurrentMembership(getUserMembership(session.id))
    setMessage({ type: 'info', text: 'Membresía cancelada. Seguirás teniendo acceso hasta el final del período.' })
  }

  const isOwner = session && session.email === 'com8msm@gmail.com'

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
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/zafiro/perfil" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a Perfil
        </Link>

        <h1 className="text-2xl font-black mb-2">Membresías</h1>
        <p className="text-xs text-slate-400 mb-6">Elige el plan que mejor se adapte a ti</p>

        {message && (
          <div className={`p-4 rounded-2xl mb-4 text-xs font-bold ${
            message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' :
            message.type === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
            'bg-amber-500/10 border border-amber-500/20 text-amber-400'
          }`}>
            {message.text}
          </div>
        )}

        {currentMembership && (currentMembership.status === 'ACTIVE' || currentMembership.status === 'LIFETIME') && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-bold text-emerald-400">Membresía Activa</p>
                  <p className="text-[10px] text-slate-400">
                    {currentMembership.planId?.toUpperCase()} · {getMembershipStatusLabel(currentMembership.status)}
                    {currentMembership.currentPeriodEnd && ` · Válido hasta ${new Date(currentMembership.currentPeriodEnd).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              {currentMembership.status !== 'LIFETIME' && (
                <button onClick={handleCancel}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-bold hover:bg-red-500/20 transition-all cursor-pointer">
                  Cancelar
                </button>
              )}
            </div>
          </div>
        )}

        {isOwner && (
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-6">
            <p className="text-xs font-bold text-purple-400">👑 OWNER_SUPERADMIN — Membresía vitalicia sin facturación</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(plan => {
            const isCurrent = currentMembership?.planId === plan.id && currentMembership?.status === 'ACTIVE'
            const isPending = currentMembership?.planId === plan.id && currentMembership?.status === 'PENDING_PAYMENT'

            return (
              <div key={plan.id} className={`p-6 rounded-2xl glass flex flex-col ${
                plan.popular ? 'border-[#00D9FF]/30 relative' : 'border-slate-700/30'
              }`}>
                {plan.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#00D9FF] text-[#050816] text-[9px] font-bold">
                    Más Popular
                  </span>
                )}

                <h2 className="text-lg font-black mb-1">{plan.name}</h2>
                <p className="text-[10px] text-slate-400 mb-4">{plan.description}</p>

                <div className="mb-4">
                  <span className="text-3xl font-black">${plan.priceMonthly}</span>
                  <span className="text-xs text-slate-400">/mes</span>
                  {plan.priceAnnual && (
                    <p className="text-[10px] text-slate-500 mt-1">${plan.priceAnnual}/mes facturado anual</p>
                  )}
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-[10px] text-slate-300">
                      <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div className="px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold text-center border border-emerald-500/30">
                    Plan Actual
                  </div>
                ) : isPending ? (
                  <div className="px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-bold text-center border border-amber-500/30 flex items-center justify-center gap-2">
                    <Loader className="w-3 h-3 animate-spin" /> Pendiente
                  </div>
                ) : plan.priceMonthly === 0 ? (
                  <div className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-500 text-xs font-bold text-center border border-slate-700/30">
                    Actual
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button onClick={() => handleSubscribe(plan, 'month')} disabled={loading === plan.id}
                      className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-blue-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer disabled:opacity-50">
                      {loading === plan.id ? 'Procesando...' : 'Mensual'}
                    </button>
                    {plan.priceAnnual && (
                      <button onClick={() => handleSubscribe(plan, 'annual')} disabled={loading === plan.id}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 border border-slate-700/50 transition-all cursor-pointer disabled:opacity-50">
                        Anual (${plan.priceAnnual}/mes)
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {currentMembership?.stripeCustomerId && (
          <div className="mt-6 text-center">
            <Link
              href={`/api/stripe/customer-portal?stripeCustomerId=${currentMembership.stripeCustomerId}&returnUrl=${typeof window !== 'undefined' ? window.location.origin : ''}/zafiro/membresias`}
              className="text-[10px] text-slate-500 hover:text-[#00D9FF] underline">
              Gestionar facturación en Stripe →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

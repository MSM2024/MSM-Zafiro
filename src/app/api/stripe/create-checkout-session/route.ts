import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, getStripePublishableKey } from '@/lib/stripe-server'
import { createPendingMembership } from '@/lib/memberships'
import { getPlanById } from '@/lib/plans'
import { authenticateRequest, requireMethod } from '@/lib/security-middleware'
import { isFeatureEnabled } from '@/lib/feature-flags'

export async function POST(request: NextRequest) {
  const methodCheck = requireMethod(request, ['POST'])
  if (methodCheck) return methodCheck

  if (isFeatureEnabled('SECURITY_MIDDLEWARE_ENABLED')) {
    const auth = authenticateRequest(request)
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 })
    }
  }

  try {
    const body = await request.json()
    const { profileId, email, planId, billingInterval, successUrl, cancelUrl } = body as {
      profileId?: string
      email?: string
      planId?: string
      billingInterval?: 'month' | 'annual'
      successUrl?: string
      cancelUrl?: string
    }

    if (!profileId || !email || !planId) {
      return NextResponse.json({ error: 'profileId, email y planId son obligatorios' }, { status: 400 })
    }

    const plan = getPlanById(planId)
    if (!plan) {
      return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 })
    }

    if (plan.priceMonthly === 0) {
      return NextResponse.json({ error: 'El plan gratuito no requiere checkout' }, { status: 400 })
    }

    const interval = billingInterval || 'month'
    const priceId = interval === 'annual' ? plan.stripePriceIdAnnual : plan.stripePriceIdMonthly
    if (!priceId) {
      return NextResponse.json({ error: 'Precio no configurado para este plan' }, { status: 500 })
    }

    createPendingMembership(profileId, planId, interval)

    const result = await createCheckoutSession(
      profileId,
      email,
      priceId,
      interval,
      successUrl || `${request.nextUrl.origin}/zafiro/membresias?success=1`,
      cancelUrl || `${request.nextUrl.origin}/zafiro/membresias?canceled=1`,
    )

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      url: result.url,
      sessionId: result.sessionId,
      publishableKey: getStripePublishableKey(),
    })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

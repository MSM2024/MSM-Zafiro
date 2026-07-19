import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent, retrieveCheckoutSession } from '@/lib/stripe-server'
import { activateMembership, updateMembershipStatus } from '@/lib/memberships'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature') || ''

    const event = constructWebhookEvent(body, signature)

    if ('error' in event) {
      return NextResponse.json({ error: event.error }, { status: 400 })
    }

    // Simulated mode: extract data from body directly
    let eventType = event.type
    let eventData = event.data?.object || {}

    // Simulated webhook support
    if (!eventType) {
      try {
        const parsed = JSON.parse(body)
        eventType = parsed.type || 'checkout.session.completed'
        eventData = parsed.data?.object || parsed.data || parsed
      } catch {
        return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
      }
    }

    // Handle events
    switch (eventType) {
      case 'checkout.session.completed': {
        const session = eventData as unknown as Record<string, unknown>
        const clientReferenceId = session.client_reference_id as string | undefined
        const metadata = (session.metadata as Record<string, string>) || {}
        const profileId = metadata.profileId || clientReferenceId || ''
        const email = (session.customer_email as string) || ''
        const customerId = (session.customer as string) || ''
        const subscriptionId = (session.subscription as string) || ''

        if (!profileId) {
          return NextResponse.json({ error: 'No profileId in session' }, { status: 400 })
        }

        // Retrieve full session for line items
        let planId = 'pro'
        let billingInterval: 'month' | 'annual' = 'month'

        if (session.id && !session.id.toString().startsWith('cs_sim_')) {
          const fullSession = await retrieveCheckoutSession(session.id as string)
          if (fullSession?.line_items?.data?.length) {
            const price = fullSession.line_items.data[0].price
            if (price?.recurring?.interval === 'year') billingInterval = 'annual'
          }
        }

        // Simulated: get plan from query params if present
        const planParam = (session.success_url as string || '').match(/plan=([^&]+)/)
        if (planParam) planId = planParam[1]

        const idempotencyKey = `webhook_${event.id || Date.now()}`
        const result = activateMembership(profileId, planId, billingInterval, subscriptionId, customerId, idempotencyKey)
        if (!result) {
          return NextResponse.json({ error: 'Could not activate membership' }, { status: 500 })
        }

        return NextResponse.json({ received: true, event: eventType, profileId, membership: result })
      }

      case 'customer.subscription.deleted': {
        const sub = eventData as unknown as Record<string, unknown>
        const metadataSub = (sub.metadata as Record<string, string>) || {}
        const profileIdSub = metadataSub.profileId || ''
        if (profileIdSub) {
          updateMembershipStatus(profileIdSub, 'CANCELED', 'stripe_webhook')
        }
        return NextResponse.json({ received: true, event: eventType })
      }

      case 'invoice.payment_failed': {
        const invoice = eventData as unknown as Record<string, unknown>
        const metadataInv = (invoice.metadata as Record<string, string>) || {}
        const profileIdInv = metadataInv.profileId || ''
        if (profileIdInv) {
          updateMembershipStatus(profileIdInv, 'PAST_DUE', 'stripe_webhook')
        }
        return NextResponse.json({ received: true, event: eventType })
      }

      default:
        return NextResponse.json({ received: true, event: eventType })
    }
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

const PLANS: Record<string, { priceId: string; name: string }> = {
  plus: { priceId: 'price_plus_monthly', name: 'Plus' },
  pro: { priceId: 'price_pro_monthly', name: 'Pro' },
}

export async function POST(request: NextRequest) {
  try {
    const { plan, userId, successUrl, cancelUrl } = await request.json()

    if (!plan || !PLANS[plan]) {
      return NextResponse.json(
        { error: 'Invalid plan. Supported: plus, pro' },
        { status: 400 }
      )
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return NextResponse.json(
        {
          data: {
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/membership?simulated=true&plan=${plan}`,
          },
        },
        { status: 200 }
      )
    }

    const stripe = await import('stripe').then((m) => new m.default(stripeKey))

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: PLANS[plan].priceId, quantity: 1 }],
      customer_email: undefined,
      client_reference_id: userId,
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/membership?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/membership?canceled=true`,
      metadata: { plan, userId: userId || 'anonymous' },
    })

    return NextResponse.json({ data: { url: session.url } })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

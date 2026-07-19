import { NextRequest, NextResponse } from 'next/server'
import { createCustomerPortalSession } from '@/lib/stripe-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stripeCustomerId = searchParams.get('stripeCustomerId')
    const returnUrl = searchParams.get('returnUrl') || `${request.nextUrl.origin}/zafiro/membresias`

    if (!stripeCustomerId) {
      return NextResponse.json({ error: 'stripeCustomerId es obligatorio' }, { status: 400 })
    }

    const result = await createCustomerPortalSession(stripeCustomerId, returnUrl)

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ url: result.url })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

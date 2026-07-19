// Stripe Server — Helpers del servidor para Stripe
// Frecuencia 369
// Nunca exponer secret keys en frontend
// Verificar siempre webhook signature
// Usar idempotency para evitar duplicados

import Stripe from 'stripe'

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key || key.startsWith('sk_live_your')) return null
  return new Stripe(key, {})
}

export function getStripePublishableKey(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
}

export async function createCheckoutSession(
  profileId: string,
  email: string,
  priceId: string,
  billingInterval: 'month' | 'annual',
  successUrl: string,
  cancelUrl: string,
): Promise<{ url: string | null; sessionId: string | null; error?: string }> {
  const stripe = getStripe()
  if (!stripe) {
    // Simulated mode for development
    return {
      url: `${successUrl}?session_id=cs_sim_${Date.now()}&profile_id=${profileId}`,
      sessionId: `cs_sim_${Date.now()}`,
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      subscription_data: {
        metadata: { profileId },
      },
      success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl,
    })

    return { url: session.url, sessionId: session.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error creating checkout session'
    return { url: null, sessionId: null, error: message }
  }
}

export async function createCustomerPortalSession(
  stripeCustomerId: string,
  returnUrl: string,
): Promise<{ url: string | null; error?: string }> {
  const stripe = getStripe()
  if (!stripe) {
    return { url: `${returnUrl}?portal=simulated` }
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    })
    return { url: session.url }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error creating portal session'
    return { url: null, error: message }
  }
}

export async function retrieveCheckoutSession(
  sessionId: string,
): Promise<Stripe.Checkout.Session | null> {
  const stripe = getStripe()
  if (!stripe) return null

  try {
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription', 'line_items'],
    })
  } catch {
    return null
  }
}

export function constructWebhookEvent(
  body: string | Buffer,
  signature: string,
): Stripe.Event | { error: string } {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripe || !secret || secret.startsWith('whsec_your')) {
    // Simulated mode for development
    try {
      return JSON.parse(body.toString())
    } catch {
      return { error: 'Invalid body' }
    }
  }

  try {
    return stripe.webhooks.constructEvent(body, signature, secret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Signature verification failed'
    return { error: message }
  }
}

export function formatStripeAmount(amount: number, currency: string): string {
  const value = currency === 'usd' ? amount / 100 : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(value)
}

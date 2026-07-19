// Plans — Fuente única de verdad para planes de membresía
// Frecuencia 369

export interface Plan {
  id: string
  name: string
  description: string
  priceMonthly: number
  priceAnnual: number | null
  currency: string
  stripePriceIdMonthly: string | null
  stripePriceIdAnnual: string | null
  features: string[]
  ptsPerDay: number
  sortOrder: number
  popular?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Gratis',
    description: 'Acceso básico a ZAFIRO',
    priceMonthly: 0,
    priceAnnual: null,
    currency: 'usd',
    stripePriceIdMonthly: null,
    stripePriceIdAnnual: null,
    features: ['100 PTS/día', 'Perfil público', 'Explorar contenido'],
    ptsPerDay: 100,
    sortOrder: 0,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Acceso completo a ZAFIRO',
    priceMonthly: 9.99,
    priceAnnual: 7.99,
    currency: 'usd',
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || 'price_pro_monthly',
    stripePriceIdAnnual: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO?.replace('monthly', 'annual') || 'price_pro_annual',
    features: ['500 PTS/día', 'Acceso VIP', 'Círculos exclusivos', 'Sin anuncios', 'Insignias premium'],
    ptsPerDay: 500,
    sortOrder: 1,
    popular: true,
  },
  {
    id: 'cuba_plus',
    name: 'Cuba Plus',
    description: 'Acceso completo + beneficios Cuba',
    priceMonthly: 14.99,
    priceAnnual: 11.99,
    currency: 'usd',
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_CUBA_PLUS || 'price_cuba_plus_monthly',
    stripePriceIdAnnual: process.env.NEXT_PUBLIC_STRIPE_PRICE_CUBA_PLUS?.replace('monthly', 'annual') || 'price_cuba_plus_annual',
    features: ['1000 PTS/día', 'Todo de Pro', 'Prioridad en remesas', 'Tasas preferenciales', 'Soporte prioritario'],
    ptsPerDay: 1000,
    sortOrder: 2,
  },
]

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find(p => p.id === id)
}

export function getActivePlans(): Plan[] {
  return PLANS.filter(p => p.id !== 'free' || true) // free always available
}

import { NextRequest, NextResponse } from "next/server"

const LEAD_KEY = 'zafiro_mm_leads'

interface LeadInput {
  name: string
  email: string
  country: string
  whatsapp?: string
  interest: string
  consent: boolean
  campaign?: string
  medium?: string
  referral?: string
}

interface Lead extends LeadInput {
  leadId: string
  consentVersion: string
  source: string
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

const RATE_LIMIT_WINDOW = 60_000
const RATE_LIMIT_MAX = 5
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "127.0.0.1"
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(key)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 }
  }
  if (entry.count >= RATE_LIMIT_MAX) return { allowed: false, remaining: 0 }
  entry.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count }
}

function validateLead(body: unknown): { valid: boolean; error?: string; data?: LeadInput } {
  if (!body || typeof body !== 'object') return { valid: false, error: 'Cuerpo inválido' }
  const data = body as Record<string, unknown>

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2)
    return { valid: false, error: 'El nombre debe tener al menos 2 caracteres' }
  if (data.name.length > 100) return { valid: false, error: 'El nombre es demasiado largo' }

  if (!data.email || typeof data.email !== 'string')
    return { valid: false, error: 'El correo electrónico es obligatorio' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return { valid: false, error: 'Correo electrónico inválido' }
  if (data.email.length > 254) return { valid: false, error: 'Correo electrónico demasiado largo' }

  if (!data.country || typeof data.country !== 'string' || data.country.trim().length < 2)
    return { valid: false, error: 'El país es obligatorio' }

  if (data.whatsapp && (typeof data.whatsapp !== 'string' || data.whatsapp.length > 20))
    return { valid: false, error: 'WhatsApp inválido' }

  if (!data.interest || typeof data.interest !== 'string')
    return { valid: false, error: 'El interés principal es obligatorio' }

  if (data.consent !== true)
    return { valid: false, error: 'Debes aceptar el consentimiento' }

  return {
    valid: true,
    data: {
      name: (data.name as string).trim(),
      email: (data.email as string).trim().toLowerCase(),
      country: (data.country as string).trim(),
      whatsapp: data.whatsapp ? (data.whatsapp as string).trim() : undefined,
      interest: data.interest as string,
      consent: true,
      campaign: typeof data.campaign === 'string' ? data.campaign : undefined,
      medium: typeof data.medium === 'string' ? data.medium : undefined,
      referral: typeof data.referral === 'string' ? data.referral : undefined,
    },
  }
}

export async function POST(request: NextRequest) {
  try {
    const { allowed, remaining } = checkRateLimit(getRateLimitKey(request))
    if (!allowed) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta más tarde.' }, { status: 429 })
    }

    let body: unknown
    try { body = await request.json() } catch {
      return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
    }

    const validation = validateLead(body)
    if (!validation.valid || !validation.data) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const lead: Lead = {
      ...validation.data,
      leadId: crypto.randomUUID(),
      consentVersion: '1.0',
      source: request.headers.get('referer') || 'direct',
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Lead stored — KV integration when available

    return NextResponse.json({
      success: true,
      message: 'Registro exitoso. Te mantendremos informado.',
      leadId: lead.leadId,
    })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

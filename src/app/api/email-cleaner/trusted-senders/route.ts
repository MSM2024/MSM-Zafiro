import { NextRequest, NextResponse } from "next/server"

const TRUSTED_DOMAINS = [
  'google.com', 'gmail.com', 'vercel.com', 'supabase.com',
  'stripe.com', 'facebook.com', 'meta.com', 'whatsapp.com',
  'msmmystore.com', 'msmmystore.org',
]

export async function GET() {
  return NextResponse.json({
    success: true,
    trustedDomains: TRUSTED_DOMAINS,
    trustedEmails: ['cm8msm@gmail.com', 'msmmystore@gmail.com'],
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domain, email, reason } = body as { domain?: string; email?: string; reason?: string }

    if (!domain && !email) {
      return NextResponse.json({ error: 'Se requiere domain o email' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `${domain || email} agregado a remitentes confiables`,
    })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

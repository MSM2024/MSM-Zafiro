import { NextRequest, NextResponse } from 'next/server'
import { getFeatureFlags, setFeatureFlag, resetFeatureFlags, type FeatureFlag } from '@/lib/feature-flags'

const OWNER_EMAIL = 'com8msm@gmail.com'

function isOwnerFromRequest(request: NextRequest): boolean {
  const header = request.headers.get('x-zafiro-session')
  if (!header) return false
  try {
    const session = JSON.parse(Buffer.from(header, 'base64url').toString())
    return session?.email === OWNER_EMAIL
  } catch { return false }
}

export async function GET() {
  const flags = getFeatureFlags()
  return NextResponse.json({ flags })
}

export async function POST(request: NextRequest) {
  try {
    if (!isOwnerFromRequest(request)) {
      return NextResponse.json({ error: 'Solo el OWNER puede modificar feature flags' }, { status: 403 })
    }

    const body = await request.json()
    const { flag, enabled } = body as { flag?: FeatureFlag; enabled?: boolean }

    if (!flag || typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'flag (string) y enabled (boolean) son obligatorios' }, { status: 400 })
    }

    const success = setFeatureFlag(flag, enabled, true)
    if (!success) {
      return NextResponse.json({ error: `Flag "${flag}" no encontrado o no modificable` }, { status: 400 })
    }

    const flags = getFeatureFlags()
    return NextResponse.json({ success: true, flag, enabled, flags })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isOwnerFromRequest(request)) {
      return NextResponse.json({ error: 'Solo el OWNER puede resetear feature flags' }, { status: 403 })
    }
    resetFeatureFlags()
    return NextResponse.json({ success: true, message: 'Feature flags reseteados a valores por defecto' })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

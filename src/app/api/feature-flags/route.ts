import { NextRequest, NextResponse } from 'next/server'
import { getFeatureFlags, setFeatureFlag, resetFeatureFlags, type FeatureFlag } from '@/lib/feature-flags'
import { getSession } from '@/lib/auth'
import { isOwnerEmail } from '@/lib/owner'

export async function GET() {
  const flags = getFeatureFlags()
  return NextResponse.json({ flags })
}

export async function POST(request: NextRequest) {
  try {
    const session = getSession()
    if (!session || !session.email || !isOwnerEmail(session.email)) {
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

export async function DELETE() {
  try {
    resetFeatureFlags()
    return NextResponse.json({ success: true, message: 'Feature flags reseteados a valores por defecto' })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

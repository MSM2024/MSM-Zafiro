import { NextRequest, NextResponse } from 'next/server'
import { createProfile, getProfileByUsername } from '@/lib/profile'
import { bootstrapOwnerProfile, createProfile as createIdentityProfile } from '@/lib/identity'
import { isOwnerEmail } from '@/lib/owner'
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
    const { userId, email, name, username } = body as {
      userId?: string
      email?: string
      name?: string
      username?: string
    }

    if (!userId || !email) {
      return NextResponse.json({ error: 'userId y email son obligatorios' }, { status: 400 })
    }

    if (username) {
      const existing = getProfileByUsername(username)
      if (existing && existing.userId !== userId) {
        return NextResponse.json({ error: 'Nombre de usuario ya existe' }, { status: 409 })
      }
    }

    const { getProfiles } = await import('@/lib/profile')
    const existingProfile = getProfiles()[userId]
    if (existingProfile) {
      return NextResponse.json({ error: 'El perfil ya existe', profile: existingProfile }, { status: 409 })
    }

    const profile = createProfile(userId, email, name || email.split('@')[0])

    const displayName = name || email.split('@')[0]
    createIdentityProfile(userId, displayName, email, isOwnerEmail(email) ? 'OWNER_SUPERADMIN' : 'USER', 'STANDARD')

    return NextResponse.json({ success: true, profile })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

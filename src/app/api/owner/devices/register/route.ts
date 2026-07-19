import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/security-middleware'
import { isFeatureEnabled } from '@/lib/feature-flags'

export async function POST(request: NextRequest) {
  if (isFeatureEnabled('SECURITY_MIDDLEWARE_ENABLED')) {
    const auth = authenticateRequest(request)
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: auth.status || 401 })
    }
  }

  try {
    const { deviceName } = await request.json()
    return NextResponse.json({
      success: true,
      message: 'Device registration endpoint ready. Awaiting Supabase Auth integration.',
      deviceName: deviceName || 'unknown',
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}

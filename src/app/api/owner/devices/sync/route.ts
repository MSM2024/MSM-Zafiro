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

  return NextResponse.json({
    success: true,
    message: 'Device sync endpoint ready. Awaiting Supabase Auth integration.',
    synced: ['eliana', 'knowledge', 'projects', 'notifications'],
    timestamp: new Date().toISOString(),
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { getActiveDocument, getAllDocuments, formatLegalForPrompt } from '@/lib/legal/terms-engine'
import { authenticateRequest, requireMethod } from '@/lib/security-middleware'
import { isFeatureEnabled } from '@/lib/feature-flags'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const docType = searchParams.get('type') || 'terms'

  if (!['terms', 'privacy', 'community_rules'].includes(docType)) {
    return NextResponse.json({ error: 'Tipo no válido. Usa: terms, privacy, community_rules' }, { status: 400 })
  }

  const doc = getActiveDocument(docType as 'terms' | 'privacy' | 'community_rules')
  if (!doc) {
    return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 })
  }

  return NextResponse.json(doc)
}

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
    const { type, title, content, summary, author } = body as {
      type?: string
      title?: string
      content?: string
      summary?: string
      author?: string
    }

    if (!type || !title || !content || !summary) {
      return NextResponse.json({ error: 'type, title, content y summary son obligatorios' }, { status: 400 })
    }

    if (!['terms', 'privacy', 'community_rules'].includes(type)) {
      return NextResponse.json({ error: 'Tipo no válido' }, { status: 400 })
    }

    const { addDocument, activateDocument } = await import('@/lib/legal/terms-engine')
    const doc = addDocument(type as 'terms' | 'privacy' | 'community_rules', title, content, summary, author || 'admin')
    activateDocument(doc.id, author || 'admin')

    return NextResponse.json(doc)
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

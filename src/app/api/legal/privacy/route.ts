import { NextRequest, NextResponse } from 'next/server'
import { getActiveDocument } from '@/lib/legal/terms-engine'

export async function GET(request: NextRequest) {
  const doc = getActiveDocument('privacy')
  if (!doc) {
    return NextResponse.json({ error: 'Política de privacidad no encontrada' }, { status: 404 })
  }
  return NextResponse.json(doc)
}

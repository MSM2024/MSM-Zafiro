import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { accountId } = body as { accountId?: string }

    if (!accountId) {
      return NextResponse.json({ error: 'accountId requerido' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Acceso revocado. Para reconectar, inicia OAuth nuevamente.',
      revokedAt: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

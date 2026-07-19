import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body as { email?: string }

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
    }

    const allowed = ['cm8msm@gmail.com', 'msmmystore@gmail.com']
    if (!allowed.includes(email)) {
      return NextResponse.json({ error: 'Cuenta no autorizada' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      message: 'Conexión iniciada. Completa la autenticación en Google.',
      authUrl: `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_OAUTH_CLIENT_ID || 'pending'}&redirect_uri=${process.env.GOOGLE_OAUTH_REDIRECT_URI || 'pending'}&scope=https://www.googleapis.com/auth/gmail.readonly%20https://www.googleapis.com/auth/gmail.modify%20https://www.googleapis.com/auth/gmail.labels&response_type=code&access_type=offline&state=${email}`,
    })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: NextRequest) {
  try {
    const { mode, email, password, phone, googleId, facebookId } = await request.json()

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      if (mode === 'register') {
        return NextResponse.json({
          data: { user: { email, phone } },
          message: 'Demo mode: cuenta creada con ' + (phone ? 'teléfono' : 'email'),
        })
      }
      return NextResponse.json({ data: { user: { email } }, message: 'Demo mode' })
    }

    // Social login callback
    if (googleId || facebookId) {
      const provider = googleId ? 'google_id' : 'facebook_id'
      const providerValue = googleId || facebookId
      const headers = {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SERVICE_KEY || SUPABASE_KEY}`,
      }

      const existing = await fetch(
        `${SUPABASE_URL}/rest/v1/users?${provider}=eq.${providerValue}&select=id`,
        { headers }
      )
      const existingData = await existing.json()

      if (existingData && existingData.length > 0) {
        return NextResponse.json({ data: { user: existingData[0] } })
      }

      const res = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
        method: 'POST',
        headers: {
          ...headers,
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          [provider]: providerValue,
          email: email || null,
          email_verified: true,
          display_name: email ? email.split('@')[0] : `Usuario ${provider}`,
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        return NextResponse.json({ error: err || 'Error al crear usuario' }, { status: 500 })
      }

      const data = await res.json()
      return NextResponse.json({ data: { user: data } })
    }

    // Phone registration
    if (mode === 'register' && phone) {
      const headers = {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SERVICE_KEY || SUPABASE_KEY}`,
      }

      const existing = await fetch(
        `${SUPABASE_URL}/rest/v1/users?phone=eq.${encodeURIComponent(phone)}&select=id`,
        { headers }
      )
      const existingData = await existing.json()

      if (existingData && existingData.length > 0) {
        return NextResponse.json({ error: 'Este número de teléfono ya está registrado. ¿Olvidaste tu contraseña?' }, { status: 409 })
      }

      const res = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
        method: 'POST',
        headers: {
          ...headers,
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          phone,
          email: email || null,
          display_name: email ? email.split('@')[0] : `Usuario`,
          phone_verified: false,
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        return NextResponse.json({ error: err || 'Error al crear usuario' }, { status: 500 })
      }

      const data = await res.json()
      return NextResponse.json({ data: { user: data } })
    }

    // Email/password auth (default)
    const endpoint = mode === 'register'
      ? `${SUPABASE_URL}/auth/v1/signup`
      : `${SUPABASE_URL}/auth/v1/token?grant_type=password`

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: data.msg || data.error_description || 'Error de autenticación' },
        { status: res.status }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

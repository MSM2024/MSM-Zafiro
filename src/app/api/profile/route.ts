import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const TABLE = 'core.users'

async function supabaseFetch(path: string, options?: RequestInit) {
  if (!SUPABASE_URL) return null
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY || '',
      Authorization: `Bearer ${SUPABASE_KEY || ''}`,
      Prefer: 'return=representation',
      ...options?.headers,
    },
  })
  if (!res.ok) return null
  return res.json()
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const userId = searchParams.get('userId')

  try {
    if (!userId) {
      return NextResponse.json({ data: null, error: 'userId required' }, { status: 400 })
    }
    const data = await supabaseFetch(`${TABLE}?id=eq.${userId}&select=*`)
    return NextResponse.json({ data: data?.[0] || null })
  } catch {
    return NextResponse.json({ data: null, fallback: true })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, ...updates } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }
    const data = await supabaseFetch(`${TABLE}?id=eq.${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() }),
    })
    return NextResponse.json({ data: data?.[0] || updates })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

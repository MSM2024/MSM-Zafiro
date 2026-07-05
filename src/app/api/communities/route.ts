import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const TABLE = 'knowledge.communities'

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

export async function GET() {
  try {
    const data = await supabaseFetch(`${TABLE}?select=*&order=created_at.desc`)
    return NextResponse.json({ data: data || [] })
  } catch {
    return NextResponse.json({ data: [], fallback: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = await supabaseFetch(TABLE, {
      method: 'POST',
      body: JSON.stringify({
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        description: body.description,
        purpose: body.purpose,
        owner_id: body.owner_id,
        category_id: body.category_id,
        visibility: 'public',
      }),
    })
    return NextResponse.json({ data: data?.[0] || body }, { status: data ? 201 : 200 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create community' }, { status: 500 })
  }
}

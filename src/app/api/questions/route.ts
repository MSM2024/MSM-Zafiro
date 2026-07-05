import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const TABLE = 'knowledge.questions'

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
  const id = searchParams.get('id')

  try {
    if (id) {
      const data = await supabaseFetch(`${TABLE}?id=eq.${id}&select=*`)
      return NextResponse.json({ data: data?.[0] || null })
    }
    const data = await supabaseFetch(`${TABLE}?order=created_at.desc&limit=20`)
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
        title: body.title,
        body: body.body,
        category_id: body.category_id,
        author_id: body.author_id,
        status: 'open',
      }),
    })
    return NextResponse.json({ data: data?.[0] || body }, { status: data ? 201 : 200 })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
  }
}

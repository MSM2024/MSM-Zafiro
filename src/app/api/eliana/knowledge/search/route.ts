import { NextRequest, NextResponse } from 'next/server'
import { queryKnowledge } from '@/lib/eliana/knowledge/retrieval'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, maxResults } = body as { query?: string; maxResults?: number }

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'query es obligatorio' }, { status: 400 })
    }

    const results = queryKnowledge(query, maxResults || 5)

    return NextResponse.json({
      success: true,
      results: results.map(r => ({
        title: r.title,
        category: r.category,
        content: r.content.slice(0, 500),
        index: r.index,
        totalChunks: r.totalChunks,
      })),
      total: results.length,
    })
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

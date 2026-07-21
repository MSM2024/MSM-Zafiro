import { NextRequest, NextResponse } from 'next/server'
import { addKnowledgeDocument } from '@/lib/eliana/knowledge/retrieval'

const VALID_CATEGORIES = ['MSM', 'ZAFIRO', 'CAJEROS', 'MENTE_MAESTRA', 'LA_SUIZA', 'VILLA_ESPERANZA', 'ECONOMIA', 'WHATSAPP']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string | null
    const category = formData.get('category') as string | null
    const content = formData.get('content') as string | null
    const file = formData.get('file') as File | null

    if (!title || !category) {
      return NextResponse.json({ success: false, error: 'title y category son obligatorios' }, { status: 400 })
    }

    const normalizedCat = category.toUpperCase().replace(/[\s-]+/g, '_')
    if (!VALID_CATEGORIES.includes(normalizedCat)) {
      return NextResponse.json({ success: false, error: `Categoría inválida. Válidas: ${VALID_CATEGORIES.join(', ')}` }, { status: 400 })
    }

    let textContent = content || ''

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const fileName = file.name.toLowerCase()

      if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
        textContent = buffer.toString('utf-8')
      } else {
        return NextResponse.json({ success: false, error: 'Formato no soportado. Usa TXT o MD.' }, { status: 400 })
      }
    }

    if (!textContent || textContent.length < 10) {
      return NextResponse.json({ success: false, error: 'El contenido debe tener al menos 10 caracteres.' }, { status: 400 })
    }

    const result = addKnowledgeDocument(title, textContent, normalizedCat as any)

    return NextResponse.json({
      success: true,
      message: 'Documento almacenado localmente y disponible para consultas RAG.',
      document: {
        id: result.document.id,
        title: result.document.title,
        category: result.document.category,
        contentLength: textContent.length,
        chunkCount: result.chunks.length,
        timestamp: result.document.createdAt,
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET() {
  const { getDocuments } = await import('@/lib/eliana/knowledge/retrieval')
  return NextResponse.json({ documents: getDocuments() })
}

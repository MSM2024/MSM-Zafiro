import { NextRequest, NextResponse } from 'next/server'

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

    // TODO: Integrar con Supabase cuando haya credenciales
    // Por ahora, endpoint listo para recibir y almacenar

    return NextResponse.json({
      success: true,
      message: 'Conocimiento recibido. Pendiente de integración con Supabase + embeddings.',
      document: {
        title,
        category,
        contentLength: textContent.length,
        chunkCount: Math.ceil(textContent.length / 1800),
        timestamp: new Date().toISOString(),
      },
    })
  } catch {
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 })
  }
}

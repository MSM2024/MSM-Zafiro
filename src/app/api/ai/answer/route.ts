import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { questionId, questionText, language } = await request.json()

    if (!questionText) {
      return NextResponse.json(
        { error: 'questionText is required' },
        { status: 400 }
      )
    }

    const openaiKey = process.env.OPENAI_API_KEY
    if (!openaiKey) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      )
    }

    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Eres ELIANA, asistente de conocimiento de MSM Zafiro. Responde preguntas de forma rigurosa, con fuentes cuando sea posible. Idioma: ${language || 'es'}.`,
            },
            {
              role: 'user',
              content: questionText,
            },
          ],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error('OpenAI API error:', err)
      return NextResponse.json(
        { error: 'AI service error' },
        { status: 502 }
      )
    }

    const data = await response.json()
    const answer = data.choices?.[0]?.message?.content

    return NextResponse.json({
      data: {
        answer,
        model: data.model,
        usage: data.usage,
        source: 'ai',
      },
    })
  } catch (error) {
    console.error('AI answer error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

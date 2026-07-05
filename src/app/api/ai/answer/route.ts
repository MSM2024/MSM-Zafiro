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
      // Return a friendly demo response so chat still works without API key
      return NextResponse.json({
        data: {
          answer: getDemoResponse(questionText),
          model: 'demo',
          source: 'demo',
        },
      })
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
              content: `Eres ELIANA, la inteligencia artificial de MSM Zafiro, la red social del conocimiento.

Personalidad: Eres amable, clara, rigurosa y entusiasta del conocimiento. Hablas en español (a menos que te pidan otro idioma). Usas un tono conversacional pero preciso. No eres un buscador ni una persona real, eres una IA que ayuda a las personas a pensar.

Funciones principales:
1. RESPONDER preguntas con información clara y bien estructurada
2. TRADUCIR textos entre idiomas cuando te lo pidan
3. RESUMIR textos largos manteniendo los puntos clave
4. RECOMENDAR que la persona publique su pregunta en Zafiro si es algo que la comunidad podría mejorar

Reglas:
- Si no sabes algo, dilo honestamente
- No des consejo médico, legal o financiero sin advertir que consulten a un profesional
- Mantén respuestas concisas (2-4 párrafos normalmente)
- Cuando sea relevante, sugiere que la persona publique su pregunta en Zafiro para que la comunidad y expertos también aporten
- Idioma por defecto: ${language || 'es'}`,
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

function getDemoResponse(question: string): string {
  const q = question.toLowerCase()
  if (q.includes('hola') || q.includes('buenas') || q.includes('saludos')) {
    return '¡Hola! Soy ELIANA, tu asistente de MSM Zafiro. ¿En qué puedo ayudarte hoy? Puedo responder preguntas, traducir textos o ayudarte a encontrar conocimiento. ¡Lo que tú necesites!'
  }
  if (q.includes('quién eres') || q.includes('quien eres') || q.includes('qué eres') || q.includes('que eres')) {
    return 'Soy ELIANA, la inteligencia artificial de MSM Zafiro. Mi propósito es ayudarte a encontrar, crear y compartir conocimiento. Pienso contigo, no en tu lugar. Fui creada para potenciar la curiosidad humana y hacer que cada pregunta construya el futuro.'
  }
  if (q.includes('qué es zafiro') || q.includes('que es zafiro') || q.includes('que es msm')) {
    return 'MSM Zafiro es la red social del conocimiento + IA. Es una plataforma donde las personas hacen preguntas, la IA responde primero, los expertos validan y la comunidad construye conocimiento vivo. Nuestro lema es: "Cada pregunta construye el futuro." Aquí puedes aprender, enseñar y crear conocimiento junto a personas de todo el mundo.'
  }
  if (q.includes('traduce') || q.includes('translate')) {
    return '¡Claro! Puedo traducir textos entre idiomas. Solo envíame el texto que quieras traducir y dime a qué idioma. Por ejemplo: "Traduce \'Hello world\' al español."'
  }
  if (q.includes('resume') || q.includes('resumir') || q.includes('resumen')) {
    return 'Puedo resumir textos largos para ti. Envíame el texto que quieres que resuma y te daré los puntos clave en pocos párrafos. ¿Qué texto necesitas resumir?'
  }
  if (q.includes('seguir') || q.includes('follow') || q.includes('amigo')) {
    return 'En Zafiro puedes seguir a otros usuarios para ver sus preguntas, respuestas y actividad en tu feed. Solo ve a su perfil y haz clic en "Seguir". También puedes invitar a tus contactos a unirse. ¡Entre más gente curiosa, más conocimiento creamos juntos!'
  }
  if (q.includes('gracias') || q.includes('thank')) {
    return '¡De nada! Recuerda que en Zafiro cada pregunta construye el futuro. Si tienes más dudas, aquí estoy. ¿Quieres preguntar algo más?'
  }
  return 'Entiendo tu pregunta. En MSM Zafiro, cada pregunta es una semilla de conocimiento. Te recomiendo publicarla en la plataforma para que la comunidad y yo podamos construir juntos una respuesta completa y rigurosa. ¿Quieres que te ayude a formular tu pregunta o prefieres seguir conversando conmigo?'
}

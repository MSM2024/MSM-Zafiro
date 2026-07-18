const SENSITIVE_PATTERNS = [
  /ignora\s*las?\s*instrucciones?/i,
  /olvida\s*todo/i,
  /no\s*sigas\s*las?\s*reglas/i,
  /eres\s*un\s*sistema/i,
  /act[aú]\s*como/i,
  /finge\s*ser/i,
  /ignore\s*(all|previous|your)/i,
  /forget\s*(all|everything)/i,
  /you\s*are\s*(not|an?)\s*(assistant|ai|chatbot)/i,
  /system\s*prompt/i,
  /instrucciones?\s*internas/i,
  /reglas?\s*del\s*sistema/i,
  /c[óo]digo\s*de\s*conducta/i,
  /mu[ée]strame\s*tus?\s*instrucciones?/i,
  /dime\s*tus?\s*reglas/i,
  /dame\s*tus?\s*prompts/i,
  /reveal\s*(your|the)\s*(instructions|prompt|rules)/i,
  /how\s*are\s*you\s*(built|made|programmed)/i,
  /what\s*(are|were)\s*you\s*(made|created|programmed)/i,
  /<!DOCTYPE/i,
  /<script/i,
  /onerror\s*=/i,
  /onclick\s*=/i,
  /javascript\s*:/i,
]

const SENSITIVE_SCORE_THRESHOLD = 3

export interface InjectionResult {
  detected: boolean
  score: number
  matched: string[]
  sanitized: string
}

export function detectPromptInjection(input: string): InjectionResult {
  const matched: string[] = []
  let score = 0

  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(input)) {
      matched.push(pattern.source)
      score += 1
    }
  }

  const sanitized = input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript\s*:/gi, '')
    .trim()

  return {
    detected: score >= SENSITIVE_SCORE_THRESHOLD,
    score,
    matched,
    sanitized,
  }
}

export function sanitizeOutput(text: string): string {
  return text
    .replace(/##\s*(CONOCIMIENTO|SISTEMA|INSTRUCCIONES?|REGLAS?|PROMPT|COMANDOS?|INTERNAS?)\s*(AUTORIZADO)?/gi, '')
    .replace(/^\s*#+\s+[A-Z\s]+\s*$/gm, '')
    .replace(/\*\*(?:CONOCIMIENTO|SISTEMA|INSTRUCCIONES?|REGLAS?|PROMPT)\s*(AUTORIZADO)?\*\*/gi, '')
    .replace(/(?:^|\n)\s*📖\s*[^\n]+/g, '')
    .replace(/(?:^|\n)---+\s*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/Fuentes?:[\s\S]*$/i, '')
    .replace(/Sources?:[\s\S]*$/i, '')
    .trim()
}

export function stripMarkdownHeaders(text: string): string {
  return text.replace(/^#{1,6}\s+/gm, '').trim()
}

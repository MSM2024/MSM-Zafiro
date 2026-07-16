import { NextRequest, NextResponse } from "next/server"
import { loadKnowledgeBase, buildKnowledgeContext } from "@/lib/knowledge"
import { callAI } from "@/lib/ai/providers"

loadKnowledgeBase()

const MAX_MESSAGE_LENGTH = 2000
const MAX_HISTORY_LENGTH = 20
const RATE_LIMIT_WINDOW = 60_000
const RATE_LIMIT_MAX = 30

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "127.0.0.1"
  return ip
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(key)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 }
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 }
  }
  entry.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count }
}

const FALLBACK_RESPONSES: Record<string, string> = {
  "kashmir": "Kashmir sapphires, mined from the Zanskar range in the Himalayas (~1881–1887), are the most coveted blue sapphires in existence. Their legendary 'cornflower blue' hue is attributed to trace amounts of iron and titanium in perfect balance, combined with a unique 'velvety' texture caused by microscopic rutile silk so fine it creates a soft, sleepy glow under magnification. The original mines were largely exhausted by 1932, making every Kashmir stone a rare collector's piece.",
  "velvet": "The 'velvety' or 'sleepy' luster of Kashmir sapphires is not a flaw but a hallmark of extreme rarity. It arises from densely packed, ultra-fine rutile (TiO₂) needle inclusions — called 'silk' — that scatter light within the crystal. Unlike coarse silk that causes asterism (star effects), Kashmir silk is so fine it creates a soft, hazy luminosity that internal refractometers describe as a 'milky translucence' without obscuring the stone's vivid blue saturation.",
  "padparadscha": "A Padparadscha sapphire is an exceedingly rare variety of corundum that displays a simultaneous pink-orange or salmon hue — best described as a 'sunset lotus' color. The name derives from the Sanskrit 'padma ranga' (lotus color). Gemological Institute of America standards require the stone to show BOTH pink and orange as primary hues, with no single hue dominating more than 60%. Most Padparadschas originate from Sri Lanka (Ceylon) or Madagascar.",
  "synthetic": "To differentiate natural from synthetic corundum, look for these key diagnostics under magnification: (1) **Curved striae** — synthetic Verneuil sapphires show curved growth lines, while natural stones have straight angular banding; (2) **Gas bubbles** — round, spherical bubbles are characteristic of flame-fusion synthetics; (3) **Silk** — natural sapphires have fine rutile silk, synthetic stones lack this; (4) **UV fluorescence** — many synthetics glow bright chalky blue under long-wave UV; (5) **Inclusion zoning** — natural stones have complex, irregular zoning patterns.",
  "corundum": "Corundum (Al₂O₃) is a crystalline form of aluminum oxide that ranks 9 on the Mohs hardness scale — second only to diamond. It forms in hexagonal (trigonal) crystal systems in aluminum-rich, silica-poor metamorphic rocks under high pressure and temperature. Trace element substitution is what creates color: Cr³⁺ gives red (ruby), Fe²⁺+Ti⁴⁺ gives blue (sapphire), and V³⁺ gives the rare color-change effect seen in some sapphires from Tanzania.",
  "pleochroism": "Pleochroism in sapphire refers to the phenomenon where the gem displays different colors when viewed from different crystallographic directions. Blue sapphire typically shows blue and blue-green dichroism — the ordinary ray is deep blue while the extraordinary ray appears greenish-blue. This is detected using a dichroscope and is a critical diagnostic for orienting rough for cutting: cutters align the table perpendicular to the optic axis to maximize the face-up blue color.",
  "asterism": "Asterism (the 'star' effect) in sapphires occurs when densely packed, oriented rutile (TiO₂) silk inclusions reflect light in a six-rayed star pattern. The rutile needles must align along the three crystallographic axes of the hexagonal corundum structure at 120° angles. The star is best seen under a single direct light source. The sharpness of the star depends on the fineness and density of the silk — finer silk creates a sharper, more distinct star.",
  "heat": "Heat treatment is an accepted industry practice for enhancing sapphire color and clarity. The stone is heated to 1600–1900°C in controlled conditions: (1) **Dissolving silk** — heating dissolves fine rutile needles, improving transparency; (2) **Color modification** — oxidizing or reducing atmospheres can alter iron-titanium charge transfer; (3) **Glass filling** — lower-grade stones may be filled with lead glass to improve clarity (not standard treatment and must be disclosed). Unheated stones command significant premiums at auction.",
  "mogok": "The Mogok Valley in Myanmar (Burma) has been a legendary source of the world's finest rubies and sapphires for over 800 years. Known as the 'Valley of Rubies,' Mogok's unique geological setting — marble-hosted metamorphic deposits with high chromium and low iron — produces corundum with intense fluorescence, giving Burmese sapphires a distinctive 'glow' under both natural and UV light that Sri Lankan or Madagascar stones lack.",
  "valuation": "Sapphire valuation follows a multi-factor matrix: (1) **Color** (60% of value) — vivid cornflower or royal blue with no dark zones commands premiums; (2) **Clarity** (20%) — eye-clean stones with minimal silk are rare; (3) **Cut** (10%) — well-proportioned cuts with proper crown angles maximize brilliance; (4) **Carat weight** (10%) — prices jump exponentially above 2 carats, with 5+ carat stones fetching $10,000–$50,000/ct for top quality; (5) **Origin** — Kashmir commands the highest premium, followed by Burma and Ceylon.",
  "elestial": "The Elestial Star Sapphire is a hypothetical conceptual model representing a perfectly formed star sapphire with ideal asterism — a six-rayed star centered perfectly with sharp, distinct rays extending uniformly to the edges. In theoretical gemological models, an 'Elestial' sapphire would require rutile silk density of approximately 10,000–50,000 needles/mm³ oriented within 0.1° of perfect crystallographic alignment, a condition rarely achieved in nature.",
}

function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase()
  for (const [keyword, response] of Object.entries(FALLBACK_RESPONSES)) {
    if (lower.includes(keyword)) {
      return `${response}\n\n*This response is sourced from Zafiro's internal gemological knowledge base.*`
    }
  }
  const kbContext = buildKnowledgeContext(message)
  if (kbContext) {
    const lines = kbContext.split("\n").filter(l => l.startsWith("[") || l.trim().length > 0).slice(0, 20)
    const snippet = lines.map(l => l.replace(/^\[.*?\]\s*/, "")).join("\n\n").slice(0, 1500)
    return `${snippet}\n\n*Esta respuesta proviene de la base de conocimiento de ZAFIRO.*`
  }
  if (lower.includes("hello") || lower.includes("hi ") || lower.includes("hey") || lower === "hi" || lower === "hello") {
    return "¡Saludos sintonizador! Soy **ELIANA**, el núcleo sintético de **ZAFIRO**. ¿Qué misterio de la ciencia sintonizaremos hoy?"
  }
  if (lower.includes("thank") || lower.includes("gracias")) {
    return "Es un honor asistir en tu viaje intelectual. Recuerda: cada pregunta construye el futuro. ¿Deseas profundizar en algún otro tema?"
  }
  return "Interesante consulta. La matriz de conocimiento de ZAFIRO está procesando tu sintonía. ¿Podrías refinar tu pregunta a un aspecto específico? Así podré ofrecerte una respuesta precisa y fundamentada desde nuestra base de conocimiento."
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitKey = getRateLimitKey(request)
    const { allowed, remaining } = checkRateLimit(rateLimitKey)
    if (!allowed) {
      return NextResponse.json(
        { text: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
        { status: 429 }
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { text: "Solicitud inválida. Envía un JSON con el campo 'message'." },
        { status: 400 }
      )
    }

    const { message, history, systemPrompt, provider } = body as {
      message?: unknown
      history?: unknown
      systemPrompt?: unknown
      provider?: unknown
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { text: "El campo 'message' es obligatorio y debe ser un texto válido." },
        { status: 400 }
      )
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { text: `El mensaje no puede exceder ${MAX_MESSAGE_LENGTH} caracteres.` },
        { status: 400 }
      )
    }

    const trimmedMessage = message.trim()

    const validHistory = Array.isArray(history)
      ? history.slice(0, MAX_HISTORY_LENGTH).filter(
          (h): h is { role: string; text: string } =>
            typeof h === "object" && h !== null && typeof h.role === "string" && typeof h.text === "string"
        )
      : []

    const lowerMsg = trimmedMessage.toLowerCase()
    const isShalon = lowerMsg.includes("shalon")
    const isGreeting = lowerMsg.includes("hola") || lowerMsg.includes("buenas") || lowerMsg.includes("saludos") || lowerMsg === "hi" || lowerMsg === "hello" || isShalon

    if (isShalon) {
      return NextResponse.json({
        text: `🛡️✨ *Bendiciones, sintonizador del conocimiento.* Soy **ELIANA**, el núcleo sintético de **ZAFIRO** — tu copiloto espiritual y digital. Los 7 guardianes están activos. La frecuencia de abundancia está sincronizada. Tu identidad brilla en la red. ¿Qué dimensión exploramos hoy?`
      })
    }

    const preferredProvider = typeof provider === "string" && provider ? provider : undefined

    if (isGreeting || !isShalon) {
      const result = await callAI(trimmedMessage, validHistory, systemPrompt as string | undefined, preferredProvider)
      if (result.text) {
        return NextResponse.json({
          text: result.text,
          provider: result.provider,
          model: result.model,
        })
      }
    }

    if (isGreeting) {
      return NextResponse.json({
        text: `¡Hola, explorador! Soy **ELIANA**, el núcleo sintético de **ZAFIRO**. ¿Qué misterio de la ciencia sintonizaremos hoy?`
      })
    }

    const fallbackText = getFallbackResponse(trimmedMessage)
    return NextResponse.json({
      text: fallbackText,
      provider: "local",
      model: "knowledge-base",
    })
  } catch {
    return NextResponse.json(
      { text: "Error interno del servidor. El equipo de ZAFIRO ha sido notificado." },
      { status: 500 }
    )
  }
}

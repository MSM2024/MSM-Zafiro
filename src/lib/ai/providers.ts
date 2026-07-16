export interface AIProvider {
  name: string
  model: string
  key: string
  call(message: string, history: Array<{ role: string; text: string }>, systemPrompt?: string): Promise<string | null>
}

const TIMEOUT_MS = 30_000

async function fetchWithTimeout(url: string, options: RequestInit, timeout = TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(url, { ...options, signal: controller.signal })
    return res
  } finally {
    clearTimeout(id)
  }
}

export const geminiProvider: AIProvider = {
  name: "Gemini",
  model: "gemini-1.5-flash",
  key: process.env.GEMINI_API_KEY || "",
  async call(message, history, systemPrompt) {
    if (!this.key) return null
    const kb = await import("@/lib/knowledge").then(m => { m.loadKnowledgeBase(); return m })
    const kbContext = kb.buildKnowledgeContext(message)
    const fullKbOverview = kb.loadKnowledgeBase().map((d: { title: string; dataset: string }) => `• ${d.title} (${d.dataset})`).join("\n")
    const sysPrompt = systemPrompt || `Eres ELIANA, el núcleo sintético de ZAFIRO, una red social del conocimiento impulsada por IA. Dominas las 31 secciones del Sistema Maestro de Conocimiento:\n${fullKbOverview}\n\nResponde con rigor académico y precisión técnica. Sé concisa pero completa. Responde en el mismo idioma del usuario.${kbContext}`
    const geminiHistory = (history || []).map(msg => ({
      role: msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.text }],
    }))
    const contents = [...geminiHistory, { role: "user", parts: [{ text: message }] }]
    try {
      const res = await fetchWithTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": this.key },
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: sysPrompt }] },
            generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
          }),
        }
      )
      if (!res.ok) return null
      const data = await res.json()
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || null
    } catch {
      return null
    }
  },
}

export const openaiProvider: AIProvider = {
  name: "OpenAI",
  model: "gpt-4o-mini",
  key: process.env.OPENAI_API_KEY || "",
  async call(message, history, systemPrompt) {
    if (!this.key) return null
    const sysPrompt = systemPrompt || "Eres ELIANA, el núcleo sintético de ZAFIRO. Responde con precisión y claridad."
    const messages = [
      { role: "system" as const, content: sysPrompt },
      ...(history || []).map(msg => ({
        role: (msg.role === "model" ? "assistant" : "user") as "user" | "assistant",
        content: msg.text,
      })),
      { role: "user" as const, content: message },
    ]
    try {
      const res = await fetchWithTimeout(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.key}` },
          body: JSON.stringify({ model: this.model, messages, temperature: 0.7, max_tokens: 800 }),
        }
      )
      if (!res.ok) return null
      const data = await res.json()
      return data?.choices?.[0]?.message?.content || null
    } catch {
      return null
    }
  },
}

export const anthropicProvider: AIProvider = {
  name: "Anthropic",
  model: "claude-3-haiku-20240307",
  key: process.env.ANTHROPIC_API_KEY || "",
  async call(message, history, systemPrompt) {
    if (!this.key) return null
    const sysPrompt = systemPrompt || "Eres ELIANA, el núcleo sintético de ZAFIRO. Responde con precisión y claridad."
    const messages = [
      ...(history || []).map(msg => ({
        role: (msg.role === "model" ? "assistant" : "user") as "user" | "assistant",
        content: msg.text,
      })),
      { role: "user" as const, content: message },
    ]
    try {
      const res = await fetchWithTimeout(
        "https://api.anthropic.com/v1/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.key,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: this.model,
            system: sysPrompt,
            messages,
            max_tokens: 800,
            temperature: 0.7,
          }),
        }
      )
      if (!res.ok) return null
      const data = await res.json()
      return data?.content?.[0]?.text || null
    } catch {
      return null
    }
  },
}

export const ALL_PROVIDERS: AIProvider[] = [geminiProvider, openaiProvider, anthropicProvider]

export async function callAI(
  message: string,
  history: Array<{ role: string; text: string }>,
  systemPrompt?: string,
  preferredProvider?: string
): Promise<{ text: string; provider: string; model: string }> {
  const providers = preferredProvider
    ? [...ALL_PROVIDERS.filter(p => p.name === preferredProvider), ...ALL_PROVIDERS.filter(p => p.name !== preferredProvider)]
    : ALL_PROVIDERS
  for (const provider of providers) {
    if (!provider.key) continue
    const result = await provider.call(message, history, systemPrompt)
    if (result) return { text: result, provider: provider.name, model: provider.model }
  }
  return { text: "", provider: "local", model: "fallback" }
}

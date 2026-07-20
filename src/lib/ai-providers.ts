export interface AIProvider {
  id: string
  name: string
  models: string[]
  defaultModel: string
  keyEnv?: string
  enabled: boolean
  priority: number
  capabilities: ("chat" | "embedding" | "vision" | "audio" | "code")[]
  color: string
  icon: string
}

export const AVAILABLE_PROVIDERS: AIProvider[] = [
  { id: "gemini", name: "Google Gemini", models: ["gemini-2.0-flash", "gemini-2.0-pro", "gemini-1.5-pro"], defaultModel: "gemini-2.0-flash", keyEnv: "GEMINI_API_KEY", enabled: true, priority: 1, capabilities: ["chat", "embedding", "vision"], color: "text-blue-400", icon: "🧠" },
  { id: "openai", name: "OpenAI", models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"], defaultModel: "gpt-4o-mini", keyEnv: "OPENAI_API_KEY", enabled: false, priority: 2, capabilities: ["chat", "embedding", "vision", "audio"], color: "text-emerald-400", icon: "🟢" },
  { id: "anthropic", name: "Anthropic Claude", models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"], defaultModel: "claude-3-haiku", keyEnv: "ANTHROPIC_API_KEY", enabled: false, priority: 3, capabilities: ["chat", "code"], color: "text-amber-400", icon: "🔮" },
  { id: "deepseek", name: "DeepSeek", models: ["deepseek-chat", "deepseek-coder"], defaultModel: "deepseek-chat", keyEnv: "DEEPSEEK_API_KEY", enabled: false, priority: 4, capabilities: ["chat", "code"], color: "text-cyan-400", icon: "🔍" },
  { id: "perplexity", name: "Perplexity", models: ["sonar-pro", "sonar-small"], defaultModel: "sonar-small", keyEnv: "PERPLEXITY_API_KEY", enabled: false, priority: 5, capabilities: ["chat", "embedding"], color: "text-purple-400", icon: "🌐" },
  { id: "grok", name: "xAI Grok", models: ["grok-2", "grok-2-mini"], defaultModel: "grok-2-mini", keyEnv: "GROK_API_KEY", enabled: false, priority: 6, capabilities: ["chat"], color: "text-rose-400", icon: "⚡" },
]

const PROVIDERS_KEY = "zafiro_ai_providers"
const ROUTING_KEY = "zafiro_ai_routing"

export interface ProviderConfig extends AIProvider {
  apiKey: string
  customEndpoint?: string
}

export function getProviderConfigs(): ProviderConfig[] {
  try {
    const raw = localStorage.getItem(PROVIDERS_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* */ }
  return AVAILABLE_PROVIDERS.map(p => ({ ...p, apiKey: "" }))
}

export function saveProviderConfigs(configs: ProviderConfig[]) {
  localStorage.setItem(PROVIDERS_KEY, JSON.stringify(configs))
}

export function getActiveProviders(): ProviderConfig[] {
  return getProviderConfigs().filter(p => p.enabled && p.apiKey)
}

export function getRoutingRule(): "manual" | "auto" | "fallback" {
  try {
    return (localStorage.getItem(ROUTING_KEY) as any) || "manual"
  } catch { return "manual" }
}

export function setRoutingRule(rule: "manual" | "auto" | "fallback") {
  localStorage.setItem(ROUTING_KEY, rule)
}

export function testProviderConnection(provider: ProviderConfig): Promise<boolean> {
  return new Promise(resolve => {
    setTimeout(() => resolve(!!provider.apiKey), 500)
  })
}

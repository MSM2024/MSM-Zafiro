'use client'

export interface ConsentOption {
  id: string
  label: string
  description: string
  required: boolean
}

export const CONSENT_OPTIONS: ConsentOption[] = [
  { id: "essential", label: "Esenciales", description: "Funcionamiento básico de la plataforma (sesión, seguridad)", required: true },
  { id: "analytics", label: "Analítica", description: "Mejora de funcionalidades basada en uso", required: false },
  { id: "marketing", label: "Marketing", description: "Comunicaciones promocionales y recomendaciones", required: false },
  { id: "ai_training", label: "Entrenamiento de IA", description: "Uso de interacciones para mejorar ELIANA y otros asistentes", required: false },
  { id: "data_sharing", label: "Comp artición con terceros", description: "Compartir datos con socios estratégicos del ecosistema", required: false },
]

const CONSENT_KEY = "zafiro_consent_preferences"

export function getConsentPreferences(): Record<string, boolean> {
  try {
    const saved = localStorage.getItem(CONSENT_KEY)
    if (saved) return JSON.parse(saved)
  } catch { /* silent */ }
  const defaults: Record<string, boolean> = {}
  for (const opt of CONSENT_OPTIONS) defaults[opt.id] = opt.required
  return defaults
}

export function setConsentPreferences(prefs: Record<string, boolean>) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs))
}

export function hasConsent(id: string): boolean {
  const prefs = getConsentPreferences()
  return prefs[id] === true
}

export function recordConsentAction(action: string, detail: string) {
  const log: { action: string; detail: string; timestamp: string }[] = JSON.parse(localStorage.getItem("zafiro_consent_log") || "[]")
  log.push({ action, detail, timestamp: new Date().toISOString() })
  localStorage.setItem("zafiro_consent_log", JSON.stringify(log))
}

const PRESENCIA_KEY = "zafiro_presencia_instantanea"

export interface ConfigPresencia {
  vozActiva: boolean
  deteccionMirada: boolean
  comandoVoz: string
  aperturaAutomatica: boolean
  ultimaActivacion: string | null
  modo: "siempre-listo" | "solo-voz" | "manual"
}

export function getConfigPresencia(): ConfigPresencia {
  if (typeof window === "undefined") return defaultPresencia()
  try {
    return JSON.parse(localStorage.getItem(PRESENCIA_KEY) || "null") || defaultPresencia()
  } catch {
    return defaultPresencia()
  }
}

function defaultPresencia(): ConfigPresencia {
  return {
    vozActiva: true,
    deteccionMirada: false,
    comandoVoz: "ZAFIRO",
    aperturaAutomatica: true,
    ultimaActivacion: null,
    modo: "siempre-listo",
  }
}

export function saveConfigPresencia(cfg: ConfigPresencia): void {
  localStorage.setItem(PRESENCIA_KEY, JSON.stringify(cfg))
}

export class PresenciaEngine {
  private recognition: any | null = null
  private listeners: Array<(text: string) => void> = []
  private activo = false
  private palabraClave: string

  constructor(palabraClave = "ZAFIRO") {
    this.palabraClave = palabraClave.toLowerCase()
    if (typeof window !== "undefined" && "SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      this.recognition = new SR()
      this.recognition.lang = "es-ES"
      this.recognition.continuous = true
      this.recognition.interimResults = false
      this.recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript.toLowerCase()
          if (transcript.includes(this.palabraClave)) {
            const comando = transcript.replace(this.palabraClave, "").trim()
            this.listeners.forEach((fn) => fn(comando || "activar"))
          }
        }
      }
    }
  }

  iniciar(): void {
    if (this.recognition && !this.activo) {
      try {
        this.recognition.start()
        this.activo = true
        const cfg = getConfigPresencia()
        cfg.ultimaActivacion = new Date().toISOString()
        saveConfigPresencia(cfg)
      } catch { /* ya iniciado */ }
    }
  }

  detener(): void {
    if (this.recognition && this.activo) {
      this.recognition.stop()
      this.activo = false
    }
  }

  onComando(fn: (text: string) => void): void {
    this.listeners.push(fn)
  }

  get isActivo(): boolean { return this.activo }

  static verificarSoporte(): boolean {
    return typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
  }
}

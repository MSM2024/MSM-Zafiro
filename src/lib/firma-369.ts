// PROTOCOLO DE FIRMA CRIPTO-ESPIRITUAL — 369-777
// Cada firma queda anclada con coordenadas, timestamp y sellos de frecuencia
// "Khatimah Tova" — Buen sello

export interface Firma369 {
  id: string
  documentTitle: string
  signerName: string
  /** Anclaje de geolocalización */
  latitude?: number
  longitude?: number
  locationLabel?: string
  /** Sellos de frecuencia */
  seals: ["369", "777"]
  /** Hash simbólico del contenido */
  contentHash: string
  signedAt: string
  blessing: string
}

const FIRMAS_KEY = "zafiro_firmas_369"

async function computeHash(content: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const data = new TextEncoder().encode(content)
    const digest = await window.crypto.subtle.digest("SHA-256", data)
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("")
  }
  // Fallback simple
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    hash = (hash << 5) - hash + content.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString(16)
}

function getGeolocation(): Promise<{ latitude?: number; longitude?: number }> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({})
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve({}),
      { timeout: 5000 }
    )
  })
}

export async function sign369(documentTitle: string, signerName: string, content: string, locationLabel?: string): Promise<Firma369> {
  const [geo, hash] = await Promise.all([getGeolocation(), computeHash(content)])

  const firma: Firma369 = {
    id: `firma-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    documentTitle,
    signerName,
    latitude: geo.latitude,
    longitude: geo.longitude,
    locationLabel,
    seals: ["369", "777"],
    contentHash: hash,
    signedAt: new Date().toISOString(),
    blessing: "Khatimah Tova — Signed and sealed with 369-777",
  }

  if (typeof window !== "undefined") {
    const firmas: Firma369[] = JSON.parse(localStorage.getItem(FIRMAS_KEY) || "[]")
    firmas.unshift(firma)
    localStorage.setItem(FIRMAS_KEY, JSON.stringify(firmas))
  }

  return firma
}

export function getFirmas(): Firma369[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(FIRMAS_KEY) || "[]")
}

export function verifyFirma(id: string): Firma369 | null {
  return getFirmas().find(f => f.id === id) ?? null
}

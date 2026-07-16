const CRYPTO_KEY = "zafiro_cripto_activos"

export interface CriptoPlataforma {
  id: string
  nombre: string
  url: string
  tipo: "exchange" | "wallet" | "defi" | "staking"
    estadoConexion: "conectado" | "pendiente" | "error"
    codigo2FA: string | null
    ultimaSync: string
    activos: CriptoActivo[]
}

export interface CriptoActivo {
  simbolo: string
  nombre: string
  cantidad: number
  valorUSD: number
  tipo: "coin" | "token" | "nft" | "stablecoin"
}

const PLATAFORMAS_CRYPTO: Omit<CriptoPlataforma, "estadoConexion" | "codigo2FA" | "ultimaSync" | "activos">[] = [
  { id: "binance_us", nombre: "Binance US", url: "https://binance.us", tipo: "exchange" },
  { id: "kucoin", nombre: "KuCoin", url: "https://kucoin.com", tipo: "exchange" },
  { id: "bitmart", nombre: "BitMart", url: "https://bitmart.com", tipo: "exchange" },
  { id: "pionex", nombre: "Pionex", url: "https://pionex.com", tipo: "exchange" },
  { id: "hotbit", nombre: "Hotbit", url: "https://hotbit.io", tipo: "exchange" },
  { id: "crypto_com", nombre: "Crypto.com", url: "https://crypto.com", tipo: "exchange" },
]

export function getPlataformasCripto(): CriptoPlataforma[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(CRYPTO_KEY) || "null") || seedPlataformasCripto()
  } catch {
    return seedPlataformasCripto()
  }
}

export function seedPlataformasCripto(): CriptoPlataforma[] {
  const data: CriptoPlataforma[] = PLATAFORMAS_CRYPTO.map((p) => ({
    ...p,
    estadoConexion: "conectado" as const,
    codigo2FA: null,
    ultimaSync: new Date().toISOString(),
    activos: [],
  }))
  localStorage.setItem(CRYPTO_KEY, JSON.stringify(data))
  return data
}

export function actualizarActivos(plataformaId: string, activos: CriptoActivo[]): void {
  const data = getPlataformasCripto()
  const idx = data.findIndex((p) => p.id === plataformaId)
  if (idx === -1) return
  data[idx].activos = activos
  data[idx].ultimaSync = new Date().toISOString()
  localStorage.setItem(CRYPTO_KEY, JSON.stringify(data))
}

export function syncCripto2FA(plataformaId: string, codigo: string): void {
  const data = getPlataformasCripto()
  const idx = data.findIndex((p) => p.id === plataformaId)
  if (idx === -1) return
  data[idx].codigo2FA = codigo
  data[idx].estadoConexion = "conectado"
  data[idx].ultimaSync = new Date().toISOString()
  localStorage.setItem(CRYPTO_KEY, JSON.stringify(data))
}

export function getTotalPortafolio(): number {
  return getPlataformasCripto().reduce((sum, p) =>
    sum + p.activos.reduce((s, a) => s + a.valorUSD, 0), 0)
}

export function getResumenCripto(): string {
  const plataformas = getPlataformasCripto()
  const total = getTotalPortafolio()
  const activosTotales = plataformas.reduce((sum, p) => sum + p.activos.length, 0)
  return `💰 *Dashboard de Activos Digitales — ZAFIRO*

Plataformas conectadas: ${plataformas.length}
Activos rastreados: ${activosTotales}
Valor total del portafolio: $${total.toFixed(2)} USD

*Plataformas:*
${plataformas.map((p) =>
  `  ${p.estadoConexion === "conectado" ? "✅" : "⏳"} ${p.nombre} — ${p.activos.length} activos`
).join("\n")}

*Control total de tu fortuna digital.* 🛡️💎`
}

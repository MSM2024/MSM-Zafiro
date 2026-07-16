// TASAS DE CAMBIO CUBA — Motor de Cálculo MSM
// Regla de oro: cada valor es una referencia separada, con fuente, fecha y aprobación humana
// Los códigos 369/777 son etiquetas simbólicas — no alteran matemáticas

export type RateType = "BUY" | "SELL" | "REFERENCE" | "MSM_BUY" | "MSM_SELL"
export type RateStatus = "PENDING" | "APPROVED" | "EXPIRED" | "REJECTED"

export interface RateSnapshot {
  id: string
  source: string
  baseCurrency: string
  quoteCurrency: string
  rateType: RateType
  rate: number
  paymentMethod?: string
  observedAt: string
  expiresAt?: string
  sourceUrl?: string
  approvedBy?: string
  status: RateStatus
  symbolicLabels: string[]
}

const RATES_KEY = "zafiro_exchange_rates"

// Snapshot verificado — 16 Julio 2026 (elTOQUE + BCC + CADECA)
export const SEED_RATES: RateSnapshot[] = [
  { id: "r1", source: "elTOQUE", baseCurrency: "USD", quoteCurrency: "CUP", rateType: "REFERENCE", rate: 660, observedAt: "2026-07-16T17:00:00Z", sourceUrl: "https://eltoque.com/tasas-de-cambio-cuba", status: "APPROVED", symbolicLabels: ["369", "777"] },
  { id: "r2", source: "elTOQUE", baseCurrency: "EUR", quoteCurrency: "CUP", rateType: "REFERENCE", rate: 760, observedAt: "2026-07-16T17:00:00Z", sourceUrl: "https://eltoque.com/tasas-de-cambio-cuba", status: "APPROVED", symbolicLabels: ["369", "777"] },
  { id: "r3", source: "BCC", baseCurrency: "USD", quoteCurrency: "CUP", rateType: "REFERENCE", rate: 592, observedAt: "2026-07-10T00:00:00Z", sourceUrl: "https://www.bc.gob.cu/tasas-de-cambio", status: "APPROVED", symbolicLabels: ["369", "777"] },
  { id: "r4", source: "CADECA", baseCurrency: "USD", quoteCurrency: "CUP", rateType: "BUY", rate: 589, observedAt: "2026-07-16T17:00:00Z", status: "APPROVED", symbolicLabels: ["369", "777"] },
  { id: "r5", source: "CADECA", baseCurrency: "USD", quoteCurrency: "CUP", rateType: "SELL", rate: 608, observedAt: "2026-07-16T17:00:00Z", status: "APPROVED", symbolicLabels: ["369", "777"] },
  { id: "r6", source: "CADECA", baseCurrency: "EUR", quoteCurrency: "CUP", rateType: "BUY", rate: 672, observedAt: "2026-07-16T17:00:00Z", status: "APPROVED", symbolicLabels: ["369", "777"] },
  { id: "r7", source: "CADECA", baseCurrency: "EUR", quoteCurrency: "CUP", rateType: "SELL", rate: 696, observedAt: "2026-07-16T17:00:00Z", status: "APPROVED", symbolicLabels: ["369", "777"] },
]

export function getRates(): RateSnapshot[] {
  if (typeof window === "undefined") return SEED_RATES
  const stored = localStorage.getItem(RATES_KEY)
  if (!stored) {
    localStorage.setItem(RATES_KEY, JSON.stringify(SEED_RATES))
    return SEED_RATES
  }
  return JSON.parse(stored)
}

export function addRate(rate: Omit<RateSnapshot, "id" | "status" | "symbolicLabels">): RateSnapshot {
  const rates = getRates()
  const newRate: RateSnapshot = {
    ...rate,
    id: `rate-${Date.now()}`,
    status: "PENDING", // Toda tasa MSM debe ser aprobada por persona autorizada
    symbolicLabels: ["369", "777"],
  }
  rates.unshift(newRate)
  localStorage.setItem(RATES_KEY, JSON.stringify(rates))
  return newRate
}

export function approveRate(id: string, approvedBy: string): RateSnapshot | null {
  const rates = getRates()
  const rate = rates.find(r => r.id === id)
  if (!rate) return null
  rate.status = "APPROVED"
  rate.approvedBy = approvedBy
  localStorage.setItem(RATES_KEY, JSON.stringify(rates))
  return rate
}

export interface MSMCalculation {
  montoCUP: number
  gananciaBruta: number
  gananciaNeta: number
}

/** monto_CUP = monto_divisa × tasa_aplicada
 *  ganancia_bruta = monto_divisa × (tasa_cliente − tasa_proveedor)
 *  ganancia_neta = ganancia_bruta − comisiones − costos */
export function calculateMSM(
  montoDivisa: number,
  tasaCliente: number,
  tasaProveedor: number,
  comisiones: number = 0,
  costosOperativos: number = 0
): MSMCalculation {
  const montoCUP = montoDivisa * tasaCliente
  const gananciaBruta = montoDivisa * (tasaCliente - tasaProveedor)
  const gananciaNeta = gananciaBruta - comisiones - costosOperativos
  return { montoCUP, gananciaBruta, gananciaNeta }
}

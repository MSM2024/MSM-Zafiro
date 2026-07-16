// BPA MIRROR v1.0 — Control de cuentas de Cuba dentro de ZAFIRO OS
// Herramienta visual de registro manual — sincronizada con el Ledger Maestro
// NO se conecta al banco real: es un espejo de control personal

export interface BPABalance {
  cup: number
  mlc: number
  lastUpdated: string
}

export interface BPATransfer {
  id: string
  amount: number
  currency: "CUP" | "MLC"
  recipient: string
  concept?: string
  date: string
  voucherCode: string
  createdAt: string
}

export const BPA_LIMITS = {
  dailyCUP: 80_000,
  monthlyCUP: 1_000_000,
} as const

const BALANCE_KEY = "zafiro_bpa_balance"
const TRANSFERS_KEY = "zafiro_bpa_transfers"

export function getBalance(): BPABalance {
  if (typeof window === "undefined") return { cup: 0, mlc: 0, lastUpdated: "" }
  const stored = localStorage.getItem(BALANCE_KEY)
  return stored ? JSON.parse(stored) : { cup: 0, mlc: 0, lastUpdated: "" }
}

export function updateBalance(cup: number, mlc: number): BPABalance {
  const balance: BPABalance = { cup, mlc, lastUpdated: new Date().toISOString() }
  localStorage.setItem(BALANCE_KEY, JSON.stringify(balance))
  return balance
}

export function getTransfers(): BPATransfer[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(TRANSFERS_KEY) || "[]")
}

export function addTransfer(transfer: Omit<BPATransfer, "id" | "voucherCode" | "createdAt">): BPATransfer {
  const transfers = getTransfers()
  const voucherCode = `ZAF-${Date.now().toString(36).toUpperCase()}-369`
  const newTransfer: BPATransfer = {
    ...transfer,
    id: `bpa-${Date.now()}`,
    voucherCode,
    createdAt: new Date().toISOString(),
  }
  transfers.unshift(newTransfer)
  localStorage.setItem(TRANSFERS_KEY, JSON.stringify(transfers))
  return newTransfer
}

export function getDailyUsage(): number {
  const today = new Date().toISOString().slice(0, 10)
  return getTransfers()
    .filter(t => t.currency === "CUP" && t.date.startsWith(today))
    .reduce((sum, t) => sum + t.amount, 0)
}

export function getMonthlyUsage(): number {
  const month = new Date().toISOString().slice(0, 7)
  return getTransfers()
    .filter(t => t.currency === "CUP" && t.date.startsWith(month))
    .reduce((sum, t) => sum + t.amount, 0)
}

export function generateVoucherText(t: BPATransfer): string {
  return [
    "🛡️ COMPROBANTE ZAFIRO — BPA MIRROR",
    "━━━━━━━━━━━━━━━━━",
    `Código: ${t.voucherCode}`,
    `Monto: ${t.amount.toLocaleString("es-ES")} ${t.currency}`,
    `Destinatario: ${t.recipient}`,
    t.concept ? `Concepto: ${t.concept}` : "",
    `Fecha: ${new Date(t.date).toLocaleDateString("es-ES")}`,
    "━━━━━━━━━━━━━━━━━",
    "Sellado con frecuencia 369-777 💎",
  ].filter(Boolean).join("\n")
}

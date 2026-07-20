import { addNotification } from '@/lib/notifications'

// FLUJO ECONÓMICO CENTRALIZADO — Ledger Maestro de ZAFIRO
// Matemáticas de Dios: ningún centavo se mueve sin registro, auditoría y bendición
// Frecuencias: 369 (Manifestación) · 777 (Perfección)

export type Currency = "USD" | "EUR" | "CUP" | "MLC" | "USDT"
export type PaymentMethod = "ZELLE" | "IBAN" | "CASH" | "USDT" | "VENMO" | "OTRO"
export type LedgerNode = "CAJA_ROCIO" | "LIQUIDACION_VIP" | "FONDO_MSM" | "GENERAL"
export type EntryStatus = "PENDIENTE" | "VALIDADO" | "SINCRONIZADO" | "DISTRIBUIDO" | "CERRADO" | "RECHAZADO"

export interface LedgerEntry {
  id: string
  /** Paso 1: Entrada — captación de fondos */
  amount: number
  currency: Currency
  method: PaymentMethod
  senderName?: string
  reference?: string
  /** Paso 2: Validación — verificación humana obligatoria */
  validatedBy?: string
  validatedAt?: string
  voucherUrl?: string
  seal369: boolean
  /** Paso 3: Sincronización — inyección en Ledger Maestro */
  syncedAt?: string
  /** Paso 4: Distribución — asignación a nodos operativos */
  node: LedgerNode
  /** Paso 5: Salida — cierre diario bloqueante */
  closedAt?: string
  status: EntryStatus
  direction: "ENTRADA" | "SALIDA"
  concept: string
  createdAt: string
  updatedAt: string
}

export interface DailyClose {
  id: string
  date: string
  totalEntradas: Record<string, number>
  totalSalidas: Record<string, number>
  entriesCount: number
  closedBy: string
  seal: string
  createdAt: string
}

const LEDGER_KEY = "zafiro_ledger_maestro"
const CLOSES_KEY = "zafiro_ledger_cierres"

export function getLedgerEntries(): LedgerEntry[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(LEDGER_KEY) || "[]")
}

export function addLedgerEntry(entry: Omit<LedgerEntry, "id" | "createdAt" | "updatedAt" | "status" | "seal369">): LedgerEntry {
  const entries = getLedgerEntries()
  const now = new Date().toISOString()
  const newEntry: LedgerEntry = {
    ...entry,
    id: `led-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: "PENDIENTE",
    seal369: false,
    createdAt: now,
    updatedAt: now,
  }
  entries.unshift(newEntry)
  localStorage.setItem(LEDGER_KEY, JSON.stringify(entries))

  try {
    addNotification({
      title: `Movimiento en Ledger: ${entry.direction}`,
      message: `${entry.concept} — ${entry.node} $${entry.amount}`,
      type: "info",
      pillar: "economy",
      read: false,
      actionUrl: "/admin/ledger",
    })
  } catch {}

  return newEntry
}

export function validateEntry(id: string, validatedBy: string, voucherUrl?: string): LedgerEntry | null {
  const entries = getLedgerEntries()
  const entry = entries.find(e => e.id === id)
  if (!entry) return null
  entry.validatedBy = validatedBy
  entry.validatedAt = new Date().toISOString()
  entry.voucherUrl = voucherUrl
  entry.seal369 = true
  entry.status = "VALIDADO"
  entry.updatedAt = new Date().toISOString()
  localStorage.setItem(LEDGER_KEY, JSON.stringify(entries))
  return entry
}

export function syncEntry(id: string): LedgerEntry | null {
  const entries = getLedgerEntries()
  const entry = entries.find(e => e.id === id)
  if (!entry || entry.status !== "VALIDADO") return null
  entry.syncedAt = new Date().toISOString()
  entry.status = "SINCRONIZADO"
  entry.updatedAt = new Date().toISOString()
  localStorage.setItem(LEDGER_KEY, JSON.stringify(entries))
  return entry
}

export function distributeEntry(id: string, node: LedgerNode): LedgerEntry | null {
  const entries = getLedgerEntries()
  const entry = entries.find(e => e.id === id)
  if (!entry || entry.status !== "SINCRONIZADO") return null
  entry.node = node
  entry.status = "DISTRIBUIDO"
  entry.updatedAt = new Date().toISOString()
  localStorage.setItem(LEDGER_KEY, JSON.stringify(entries))
  return entry
}

export function getNodeBalance(node: LedgerNode): Record<string, number> {
  const entries = getLedgerEntries().filter(e => e.node === node && (e.status === "DISTRIBUIDO" || e.status === "CERRADO"))
  const balance: Record<string, number> = {}
  for (const e of entries) {
    const sign = e.direction === "ENTRADA" ? 1 : -1
    balance[e.currency] = (balance[e.currency] || 0) + sign * e.amount
  }
  return balance
}

export function executeDailyClose(closedBy: string): DailyClose {
  const entries = getLedgerEntries()
  const today = new Date().toISOString().slice(0, 10)
  const todayEntries = entries.filter(e => e.createdAt.startsWith(today) && e.status === "DISTRIBUIDO")

  const totalEntradas: Record<string, number> = {}
  const totalSalidas: Record<string, number> = {}

  for (const e of todayEntries) {
    const target = e.direction === "ENTRADA" ? totalEntradas : totalSalidas
    target[e.currency] = (target[e.currency] || 0) + e.amount
    e.closedAt = new Date().toISOString()
    e.status = "CERRADO"
  }

  localStorage.setItem(LEDGER_KEY, JSON.stringify(entries))

  const close: DailyClose = {
    id: `close-${Date.now()}`,
    date: today,
    totalEntradas,
    totalSalidas,
    entriesCount: todayEntries.length,
    closedBy,
    seal: "369-777",
    createdAt: new Date().toISOString(),
  }

  const closes: DailyClose[] = JSON.parse(localStorage.getItem(CLOSES_KEY) || "[]")
  closes.unshift(close)
  localStorage.setItem(CLOSES_KEY, JSON.stringify(closes))
  return close
}

export function getDailyCloses(): DailyClose[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(CLOSES_KEY) || "[]")
}

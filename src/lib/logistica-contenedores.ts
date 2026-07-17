export type ContainerOrigen = "USA" | "Panamá"
export type ContainerStatus = "Planificado" | "En tránsito" | "En aduana" | "En almacén" | "Distribuyendo" | "Completado"
export type ItemCategoria = "Ventiladores Recargables" | "Combos de Comida" | "Equipos EKO" | "Otros"

export const CATEGORIA_VALOR_ESTIMADO: Record<ItemCategoria, number> = {
  "Ventiladores Recargables": 35,
  "Combos de Comida": 50,
  "Equipos EKO": 120,
  Otros: 20,
}

export interface ContainerItem {
  nombre: string
  cantidad: number
  unidad: string
  categoria: ItemCategoria
  valorUnitarioUSD?: number
}

export interface Container {
  id: string
  nombre: string
  origen: ContainerOrigen
  destino: "Cuba"
  status: ContainerStatus
  fechaSalida: string
  fechaEstimadaLlegada: string
  fechaRealLlegada?: string
  items: ContainerItem[]
  trackingNumber: string
  notas?: string
  sello369: string
  valorEstimadoUSD: number
  ledgerRefId?: string
  createdAt: string
  updatedAt: string
}

export interface GraneroStats {
  totalContenedores: number
  enTransito: number
  completados: number
  totalItems: number
  valorTotalUSD: number
  ultimaActualizacion: string
}

const CONTAINERS_KEY = "zafiro_contenedores"

function generateSello369(): string {
  const n = Date.now().toString(36).toUpperCase()
  const r = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `CTN-${n}-${r}-369`
}

function calcularValorEstimado(items: ContainerItem[]): number {
  return items.reduce((sum, i) => {
    const unitValue = i.valorUnitarioUSD || CATEGORIA_VALOR_ESTIMADO[i.categoria]
    return sum + (unitValue * i.cantidad)
  }, 0)
}

export function getContainers(): Container[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(CONTAINERS_KEY) || "[]")
}

export function getContainer(id: string): Container | undefined {
  return getContainers().find(c => c.id === id)
}

export function addContainer(data: Omit<Container, "id" | "sello369" | "valorEstimadoUSD" | "createdAt" | "updatedAt">): Container {
  const containers = getContainers()
  const container: Container = {
    ...data,
    id: `cnt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    sello369: generateSello369(),
    valorEstimadoUSD: calcularValorEstimado(data.items),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  containers.unshift(container)
  localStorage.setItem(CONTAINERS_KEY, JSON.stringify(containers))
  return container
}

export function updateContainerStatus(id: string, status: ContainerStatus, fechaRealLlegada?: string): Container | null {
  const containers = getContainers()
  const idx = containers.findIndex(c => c.id === id)
  if (idx === -1) return null
  containers[idx] = {
    ...containers[idx],
    status,
    fechaRealLlegada: fechaRealLlegada || containers[idx].fechaRealLlegada,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(CONTAINERS_KEY, JSON.stringify(containers))
  return containers[idx]
}

export function deleteContainer(id: string): void {
  const containers = getContainers().filter(c => c.id !== id)
  localStorage.setItem(CONTAINERS_KEY, JSON.stringify(containers))
}

export function getGraneroStats(): GraneroStats {
  const containers = getContainers()
  const totalItems = containers.reduce((sum, c) =>
    sum + c.items.reduce((s, i) => s + i.cantidad, 0), 0
  )
  return {
    totalContenedores: containers.length,
    enTransito: containers.filter(c => c.status === "En tránsito" || c.status === "En aduana").length,
    completados: containers.filter(c => c.status === "Completado").length,
    totalItems,
    valorTotalUSD: containers.reduce((sum, c) => sum + c.valorEstimadoUSD, 0),
    ultimaActualizacion: new Date().toISOString(),
  }
}

export function getItemsByCategoria(): Record<ItemCategoria, number> {
  const containers = getContainers()
  const result: Record<ItemCategoria, number> = {
    "Ventiladores Recargables": 0,
    "Combos de Comida": 0,
    "Equipos EKO": 0,
    Otros: 0,
  }
  for (const c of containers) {
    for (const item of c.items) {
      result[item.categoria] = (result[item.categoria] || 0) + item.cantidad
    }
  }
  return result
}

export function syncContainerToLedger(containerId: string, ledgerEntryId: string): Container | null {
  const containers = getContainers()
  const idx = containers.findIndex(c => c.id === containerId)
  if (idx === -1) return null
  containers[idx].ledgerRefId = ledgerEntryId
  containers[idx].updatedAt = new Date().toISOString()
  localStorage.setItem(CONTAINERS_KEY, JSON.stringify(containers))
  return containers[idx]
}

export function getContainersByStatus(status: ContainerStatus): Container[] {
  return getContainers().filter(c => c.status === status)
}

export function generarReporteContainer(c: Container): string {
  const items = c.items.map(i => `  • ${i.cantidad} × ${i.nombre} (${i.categoria} — $${i.valorUnitarioUSD || CATEGORIA_VALOR_ESTIMADO[i.categoria]}/u)`).join("\n")
  return [
    "📦 LOGÍSTICA ZAFIRO — MANIFIESTO DE CONTENEDOR",
    "━━━━━━━━━━━━━━━━━━━━━━━",
    `Contenedor: ${c.nombre}`,
    `Tracking: ${c.trackingNumber}`,
    `Ruta: ${c.origen} → ${c.destino}`,
    `Estatus: ${c.status}`,
    `Salida: ${new Date(c.fechaSalida).toLocaleDateString("es-ES")}`,
    `Llegada estimada: ${new Date(c.fechaEstimadaLlegada).toLocaleDateString("es-ES")}`,
    c.fechaRealLlegada ? `Llegada real: ${new Date(c.fechaRealLlegada).toLocaleDateString("es-ES")}` : "",
    `Valor estimado: $${c.valorEstimadoUSD.toLocaleString("es-ES")} USD`,
    "",
    "Carga:",
    items,
    "",
    `Sello: ${c.sello369}`,
    c.ledgerRefId ? `Ledger Ref: ${c.ledgerRefId}` : "",
    "━━━━━━━━━━━━━━━━━━━━━━━",
    "Frecuencia 369 — Abundancia en Logística 💎",
  ].filter(Boolean).join("\n")
}

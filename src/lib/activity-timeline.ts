import { getOrders } from "@/lib/marketplace"
import { getDevocionales, getWriters } from "@/lib/editorial"
import { getBooks } from "@/lib/biblioteca/storage"
import { getProfiles } from "@/lib/identity"
import { getLedgerEntries } from "@/lib/ledger"
import { getPublishedSeals } from "@/lib/seals-data"

export interface ActivityEvent {
  id: string
  pillar: "marketplace" | "editorial" | "economy" | "identity" | "sellos"
  type: string
  summary: string
  timestamp: string
  link?: string
}

const PILLAR_PREFIX: Record<string, string> = {
  marketplace: "\uD83C\uDFEA",
  editorial: "\uD83D\uDCD6",
  economy: "\uD83D\uDCB0",
  identity: "\uD83D\uDC64",
  sellos: "\uD83D\uDD2E",
}

const PILLAR_COLORS: Record<string, string> = {
  marketplace: "text-amber-400",
  editorial: "text-blue-400",
  economy: "text-emerald-400",
  identity: "text-purple-400",
  sellos: "text-rose-400",
}

export function getAllActivityEvents(): ActivityEvent[] {
  const events: ActivityEvent[] = []
  const now = new Date().toISOString()

  const orders = getOrders()
  for (const o of orders) {
    const itemName = o.items?.[0]?.productName || "Producto"
    events.push({
      id: `order-${o.id}`,
      pillar: "marketplace",
      type: `Pedido ${o.status}`,
      summary: `${itemName} — $${o.total || 0}`,
      timestamp: o.createdAt || now,
      link: "/marketplace/orders",
    })
  }

  const profiles = getProfiles()
  for (const p of profiles) {
    events.push({
      id: `profile-${p.id}`,
      pillar: "identity",
      type: "Usuario registrado",
      summary: p.displayName || p.publicHandle || "Anónimo",
      timestamp: p.createdAt || now,
      link: `/perfil/${p.publicHandle || ""}`,
    })
  }

  const ledger = getLedgerEntries()
  for (const e of ledger) {
    events.push({
      id: `ledger-${e.id}`,
      pillar: "economy",
      type: `${e.direction === "SALIDA" ? "\uD83D\uDCB8" : "\uD83D\uDCB0"} ${e.direction}`,
      summary: `${e.concept} — ${e.node} $${e.amount}`,
      timestamp: e.createdAt || now,
      link: "/admin/ledger",
    })
  }

  const books = getBooks()
  for (const b of books) {
    events.push({
      id: `book-${b.id}`,
      pillar: "editorial",
      type: `Libro ${b.status || "subido"}`,
      summary: b.title || "Sin título",
      timestamp: b.createdAt,
      link: "/editorial/biblioteca",
    })
  }

  const devs = getDevocionales()
  for (const d of devs) {
    events.push({
      id: `dev-${d.id}`,
      pillar: "editorial",
      type: "Devocional",
      summary: d.title || "Sin título",
      timestamp: d.date || now,
      link: `/editorial/devocionales/${d.id}`,
    })
  }

  const writers = getWriters()
  for (const w of writers) {
    events.push({
      id: `writer-${w.id}`,
      pillar: "editorial",
      type: "Escritor registrado",
      summary: w.name || "Anónimo",
      timestamp: w.joinedAt || now,
      link: `/editorial/escritores/${w.id}`,
    })
  }

  const seals = getPublishedSeals()
  const sealSeedTime = new Date("2025-01-01").getTime()
  for (const s of seals) {
    const sealDate = new Date(sealSeedTime + s.numero * 86400000).toISOString()
    events.push({
      id: `seal-${s.numero}`,
      pillar: "sellos",
      type: "Sello publicado",
      summary: s.tema || `Sello #${s.numero}`,
      timestamp: sealDate,
      link: `/sellos/${s.numero}`,
    })
  }

  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return events
}

export function getActivityTimeline(max = 20, pillarFilter?: string): ActivityEvent[] {
  let events = getAllActivityEvents()
  if (pillarFilter) {
    events = events.filter(e => e.pillar === pillarFilter)
  }
  return events.slice(0, max)
}

export function getPillarActivityIcon(pillar: string): string {
  return PILLAR_PREFIX[pillar] || "●"
}

export function getPillarActivityColor(pillar: string): string {
  return PILLAR_COLORS[pillar] || "text-slate-400"
}

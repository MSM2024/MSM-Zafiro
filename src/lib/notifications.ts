import { getProducts, getOrders, type Order, type Product } from "@/lib/marketplace"
import { getDevocionales, getWriters, type Devocional, type Writer } from "@/lib/editorial"
import { getBooks } from "@/lib/biblioteca/storage"
import { getLedgerEntries } from "@/lib/ledger"
import { getPublishedSeals } from "@/lib/seals-data"
import { getUsers } from "@/lib/auth"

export interface AppNotification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "system"
  pillar: "marketplace" | "editorial" | "economy" | "identity" | "sellos" | "system"
  read: boolean
  timestamp: string
  actionUrl?: string
}

const PILLAR_LABELS: Record<string, string> = {
  marketplace: "Marketplace",
  editorial: "Editorial",
  economy: "Economía",
  identity: "Identidad",
  sellos: "Sellos",
  system: "Sistema",
}

function getPillarColor(pillar: string): string {
  switch (pillar) {
    case "marketplace": return "bg-amber-500/10 border-amber-500/20 text-amber-400"
    case "editorial": return "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
    case "economy": return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
    case "identity": return "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
    case "sellos": return "bg-violet-500/10 border-violet-500/20 text-violet-400"
    default: return "bg-slate-500/10 border-slate-500/20 text-slate-400"
  }
}

const STORAGE_KEY = "zafiro_notifications"

function getStoredNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveNotifications(ns: AppNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ns))
  } catch { /* quota exceeded */ }
}

export function getAllNotifications(): AppNotification[] {
  const stored = getStoredNotifications()
  const generated = generateLiveNotifications()
  const merged = [...generated]
  for (const s of stored) {
    if (!merged.find(m => m.id === s.id)) merged.push(s)
  }
  merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  return merged.slice(0, 100)
}

export function markNotificationRead(id: string) {
  const stored = getStoredNotifications()
  const idx = stored.findIndex(n => n.id === id)
  if (idx !== -1) {
    stored[idx].read = true
    saveNotifications(stored)
  }
}

export function markAllRead() {
  const stored = getStoredNotifications()
  for (const n of stored) n.read = true
  saveNotifications(stored)
}

export function deleteNotification(id: string) {
  saveNotifications(getStoredNotifications().filter(n => n.id !== id))
}

export function addNotification(n: Omit<AppNotification, "id" | "timestamp">) {
  const stored = getStoredNotifications()
  const notif: AppNotification = {
    ...n,
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  }
  stored.unshift(notif)
  saveNotifications(stored.slice(0, 200))
  try {
    const { notifyDataChanged } = require("@/lib/broadcast")
    notifyDataChanged(n.pillar)
  } catch {}
  return notif
}

function generateLiveNotifications(): AppNotification[] {
  const result: AppNotification[] = []

  try {
    const users = getUsers()
    if (users.length > 0) {
      const latest = users[users.length - 1]
      result.push({
        id: `live_user_${latest.id}`,
        title: "Nuevo miembro registrado",
        message: `${latest.name} se unió al Imperio MSM (${latest.email})`,
        type: "success",
        pillar: "identity",
        read: false,
        timestamp: latest.createdAt || new Date().toISOString(),
        actionUrl: "/admin/usuarios",
      })
    }
  } catch { /* ignore */ }

  try {
    const seals = getPublishedSeals()
    if (seals.length > 0) {
      const latest = seals[seals.length - 1]
      result.push({
        id: `live_sello_${latest.numero}`,
        title: "Nuevo sello publicado",
        message: `Sello #${latest.numero} — "${latest.tema}" — ${latest.referencia}`,
        type: "info",
        pillar: "sellos",
        read: false,
        timestamp: new Date().toISOString(),
        actionUrl: `/sellos/${latest.numero}`,
      })
    }
  } catch { /* ignore */ }

  try {
    const devs = getDevocionales()
    for (const d of devs.slice(-3).reverse()) {
      result.push({
        id: `live_dev_${d.id}`,
        title: "Devocional publicado",
        message: `"${d.title}" por ${d.author} — ${d.verseRef.slice(0, 30)}`,
        type: "info",
        pillar: "editorial",
        read: false,
        timestamp: typeof d.createdAt === "string" ? d.createdAt : new Date().toISOString(),
        actionUrl: `/editorial/devocionales/${d.id}`,
      })
    }
  } catch { /* ignore */ }

  try {
    const books = getBooks()
    const published = books.filter(b => b.status === "PUBLICADO" || b.status === "APROBADO")
    for (const b of published.slice(-2).reverse()) {
      result.push({
        id: `live_book_${b.id}`,
        title: "Obra publicada en Biblioteca",
        message: `"${b.title}" por ${b.authorName} — ${b.chapterCount} capítulos`,
        type: "success",
        pillar: "editorial",
        read: false,
        timestamp: b.createdAt || new Date().toISOString(),
        actionUrl: `/zafiro/biblioteca/${b.id}`,
      })
    }
  } catch { /* ignore */ }

  try {
    const orders = getOrders()
    for (const o of orders.slice(-3).reverse()) {
      result.push({
        id: `live_order_${o.id}`,
        title: "Nuevo pedido en Marketplace",
        message: `Pedido #${o.id.slice(0, 8)} — ${o.items.length} item(s) — $${o.total.toFixed(2)}`,
        type: "warning",
        pillar: "marketplace",
        read: false,
        timestamp: o.createdAt || new Date().toISOString(),
        actionUrl: "/marketplace/orders",
      })
    }
  } catch { /* ignore */ }

  try {
    const products = getProducts()
    const active = products.filter(p => p.status === "active")
    for (const p of active.slice(-2).reverse()) {
      result.push({
        id: `live_product_${p.id}`,
        title: "Producto activo en Marketplace",
        message: `${p.name} — $${p.price.toFixed(2)} (${p.stock} disponibles)`,
        type: "info",
        pillar: "marketplace",
        read: false,
        timestamp: p.createdAt || new Date().toISOString(),
        actionUrl: `/marketplace/${p.id}`,
      })
    }
  } catch { /* ignore */ }

  try {
    const entries = getLedgerEntries()
    for (const e of entries.slice(-2).reverse()) {
      result.push({
        id: `live_ledger_${e.id}`,
        title: "Movimiento en Ledger Maestro",
        message: `${e.direction === "ENTRADA" ? "Ingreso" : "Salida"} de $${Math.abs(e.amount).toFixed(2)} — ${e.concept.slice(0, 60)}`,
        type: e.direction === "ENTRADA" ? "success" : "warning",
        pillar: "economy",
        read: false,
        timestamp: e.createdAt || new Date().toISOString(),
        actionUrl: "/admin/ledger",
      })
    }
  } catch { /* ignore */ }

  return result
}

export { PILLAR_LABELS, getPillarColor }

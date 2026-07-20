import { getProducts, getOrders } from "@/lib/marketplace"
import { getDevocionales, getWriters } from "@/lib/editorial"
import { getBooks } from "@/lib/biblioteca/storage"
import { getProfiles } from "@/lib/identity"
import { getLedgerEntries } from "@/lib/ledger"
import { getPublishedSeals } from "@/lib/seals-data"

export interface ExportSection {
  name: string
  pillar: string
  rows: Record<string, string>[]
}

function toCSV(rows: Record<string, string>[]): string {
  if (rows.length === 0) return ""
  const headers = Object.keys(rows[0])
  const lines = [headers.join(",")]
  for (const row of rows) {
    lines.push(headers.map(h => {
      const val = (row[h] || "").replace(/"/g, '""')
      return val.includes(",") || val.includes('"') || val.includes("\n") ? `"${val}"` : val
    }).join(","))
  }
  return lines.join("\n")
}

function toJSON(rows: Record<string, string>[]): string {
  return JSON.stringify(rows, null, 2)
}

export function getAllExportData(): ExportSection[] {
  const sections: ExportSection[] = []

  try {
    const products = getProducts()
    sections.push({
      name: "Productos",
      pillar: "marketplace",
      rows: products.map(p => ({
        id: p.id, name: p.name, price: String(p.price), currency: p.currency,
        category: p.category, stock: String(p.stock), status: p.status,
        featured: String(p.featured || false), created: p.createdAt || "",
      })),
    })
  } catch { /* ignore */ }

  try {
    const orders = getOrders()
    sections.push({
      name: "Pedidos",
      pillar: "marketplace",
      rows: orders.map(o => ({
        id: o.id, customer: o.customerName, email: o.customerEmail,
        total: String(o.total), currency: o.currency, status: o.status,
        method: o.paymentMethod, items: String(o.items.length),
        created: o.createdAt,
      })),
    })
  } catch { /* ignore */ }

  try {
    const books = getBooks()
    sections.push({
      name: "Libros",
      pillar: "editorial",
      rows: books.map(b => ({
        id: b.id, title: b.title, author: b.authorName,
        status: b.status, chapters: String(b.chapterCount),
        words: String(b.wordCount), tags: b.tags.join("; "),
        created: b.createdAt || "",
      })),
    })
  } catch { /* ignore */ }

  try {
    const devs = getDevocionales()
    sections.push({
      name: "Devocionales",
      pillar: "editorial",
      rows: devs.map(d => ({
        id: d.id, title: d.title, author: d.author,
        verse: d.verseRef, readingTime: String(d.readingTimeMinutes),
        featured: String(d.featured), tags: d.tags.join("; "),
        created: d.createdAt,
      })),
    })
  } catch { /* ignore */ }

  try {
    const writers = getWriters()
    sections.push({
      name: "Escritores",
      pillar: "editorial",
      rows: writers.map(w => ({
        id: w.id, name: w.name, email: w.email,
        booksPublished: String(w.booksPublished),
        specialties: w.specialties.join("; "),
        verified: String(w.verified), joined: w.joinedAt,
      })),
    })
  } catch { /* ignore */ }

  try {
    const profiles = getProfiles()
    sections.push({
      name: "Perfiles",
      pillar: "identity",
      rows: profiles.map((p: any) => ({
        id: p.id, name: p.displayName || p.name || "",
        email: p.email || "", handle: p.handle || "",
        created: p.createdAt || "",
      })),
    })
  } catch { /* ignore */ }

  try {
    const entries = getLedgerEntries()
    sections.push({
      name: "Ledger",
      pillar: "economy",
      rows: entries.map(e => ({
        id: e.id, amount: String(e.amount), currency: e.currency,
        direction: e.direction, node: e.node, status: e.status,
        concept: e.concept, method: e.method,
        seal369: String(e.seal369), created: e.createdAt,
      })),
    })
  } catch { /* ignore */ }

  try {
    const seals = getPublishedSeals()
    sections.push({
      name: "Sellos",
      pillar: "sellos",
      rows: seals.map(s => ({
        numero: String(s.numero), tema: s.tema,
        referencia: s.referencia, versiculo: s.versiculo,
        estado: s.estado,
      })),
    })
  } catch { /* ignore */ }

  return sections
}

export { toCSV, toJSON }

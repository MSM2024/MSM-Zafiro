import { getProducts } from "@/lib/marketplace"
import { getDevocionales, getWriters } from "@/lib/editorial"
import { getBooks } from "@/lib/biblioteca/storage"
import { getProfiles } from "@/lib/identity"
import { getLedgerEntries } from "@/lib/ledger"
import { getPublishedSeals } from "@/lib/seals-data"

export interface LeaderboardItem {
  rank: number
  label: string
  value: string
  href: string
  pillar: "marketplace" | "editorial" | "identity" | "economy" | "sellos"
  icon: string
}

export function getLeaderboard(): LeaderboardItem[] {
  const items: LeaderboardItem[] = []
  let rank = 0

  try {
    const products = getProducts().filter(p => p.status === "active").sort((a, b) => b.price - a.price).slice(0, 5)
    for (const p of products) {
      items.push({ rank: ++rank, label: p.name, value: `$${p.price.toFixed(2)}`, href: `/marketplace/${p.id}`, pillar: "marketplace", icon: "🛒" })
    }
  } catch { /* ignore */ }

  try {
    const books = getBooks().filter(b => b.status === "PUBLICADO" || b.status === "APROBADO").slice(0, 5)
    for (const b of books) {
      items.push({ rank: ++rank, label: b.title, value: `${b.chapterCount} cap.`, href: `/zafiro/biblioteca/${b.id}`, pillar: "editorial", icon: "📖" })
    }
  } catch { /* ignore */ }

  try {
    const devs = getDevocionales().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
    for (const d of devs) {
      items.push({ rank: ++rank, label: d.title, value: d.author, href: `/editorial/devocionales/${d.id}`, pillar: "editorial", icon: "✨" })
    }
  } catch { /* ignore */ }

  try {
    const writers = getWriters().sort((a, b) => b.booksPublished - a.booksPublished).slice(0, 5)
    for (const w of writers) {
      items.push({ rank: ++rank, label: w.name, value: `${w.booksPublished} libros`, href: `/editorial/escritores/${w.id}`, pillar: "editorial", icon: "✍️" })
    }
  } catch { /* ignore */ }

  try {
    const entries = getLedgerEntries().sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount)).slice(0, 5)
    for (const e of entries) {
      items.push({ rank: ++rank, label: e.concept.slice(0, 40), value: `$${Math.abs(e.amount).toFixed(2)} ${e.currency}`, href: "/admin/ledger", pillar: "economy", icon: "💰" })
    }
  } catch { /* ignore */ }

  try {
    const profiles = getProfiles().slice(0, 5)
    for (const p of profiles) {
      const name = (p as any).displayName || (p as any).name || "Usuario"
      items.push({ rank: ++rank, label: name, value: "Miembro ZAFIRO", href: `/perfil/${(p as any).handle || p.id}`, pillar: "identity", icon: "👤" })
    }
  } catch { /* ignore */ }

  try {
    const seals = getPublishedSeals().slice(0, 5)
    for (const s of seals) {
      items.push({ rank: ++rank, label: `Sello #${s.numero} — ${s.tema}`, value: s.referencia, href: `/sellos/${s.numero}`, pillar: "sellos", icon: "🔏" })
    }
  } catch { /* ignore */ }

  return items.slice(0, 25)
}

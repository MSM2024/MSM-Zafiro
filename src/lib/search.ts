import { getProducts } from "@/lib/marketplace"
import { getDevocionales, getWriters } from "@/lib/editorial"
import { getBooks } from "@/lib/biblioteca/storage"
import { getProfiles } from "@/lib/identity"
import { getPublishedSeals } from "@/lib/seals-data"
import { getLedgerEntries } from "@/lib/ledger"

export interface SearchResult {
  id: string
  title: string
  description: string
  pillar: "marketplace" | "editorial" | "identity" | "economy" | "sellos"
  category: string
  href: string
  icon: string
}

export function crossPillarSearch(query: string): SearchResult[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  const results: SearchResult[] = []

  try {
    const products = getProducts().filter(p => p.status === "active")
    for (const p of products) {
      if (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))) {
        results.push({
          id: `prod_${p.id}`,
          title: p.name,
          description: `$${p.price.toFixed(2)} · ${p.category}`,
          pillar: "marketplace",
          category: "Productos",
          href: `/marketplace/${p.id}`,
          icon: "🛒",
        })
      }
    }
  } catch { /* ignore */ }

  try {
    const books = getBooks().filter(b => b.status === "PUBLICADO" || b.status === "APROBADO")
    for (const b of books) {
      if (b.title.toLowerCase().includes(q) || b.authorName.toLowerCase().includes(q) || b.tags.some(t => t.toLowerCase().includes(q))) {
        results.push({
          id: `book_${b.id}`,
          title: b.title,
          description: `${b.authorName} · ${b.chapterCount} capítulos`,
          pillar: "editorial",
          category: "Libros",
          href: `/zafiro/biblioteca/${b.id}`,
          icon: "📖",
        })
      }
    }
  } catch { /* ignore */ }

  try {
    const devs = getDevocionales()
    for (const d of devs) {
      if (d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q) || d.verseRef.toLowerCase().includes(q) || d.tags.some(t => t.toLowerCase().includes(q))) {
        results.push({
          id: `dev_${d.id}`,
          title: d.title,
          description: `${d.author} · ${d.verseRef}`,
          pillar: "editorial",
          category: "Devocionales",
          href: `/editorial/devocionales/${d.id}`,
          icon: "✨",
        })
      }
    }
  } catch { /* ignore */ }

  try {
    const writers = getWriters()
    for (const w of writers) {
      if (w.name.toLowerCase().includes(q) || w.bio.toLowerCase().includes(q) || w.specialties.some(s => s.toLowerCase().includes(q))) {
        results.push({
          id: `writer_${w.id}`,
          title: w.name,
          description: `${w.specialties.join(", ")} · ${w.booksPublished} libros`,
          pillar: "editorial",
          category: "Escritores",
          href: `/editorial/escritores/${w.id}`,
          icon: "✍️",
        })
      }
    }
  } catch { /* ignore */ }

  try {
    const profiles = getProfiles()
    for (const p of profiles) {
      const displayName = (p as any).displayName || (p as any).name || ""
      const bio = (p as any).bio || ""
      if (displayName.toLowerCase().includes(q) || bio.toLowerCase().includes(q)) {
        results.push({
          id: `profile_${p.id}`,
          title: displayName,
          description: bio.slice(0, 100),
          pillar: "identity",
          category: "Perfiles",
          href: `/perfil/${(p as any).handle || p.id}`,
          icon: "👤",
        })
      }
    }
  } catch { /* ignore */ }

  try {
    const seals = getPublishedSeals()
    for (const s of seals) {
      const searchText = `#${s.numero} ${s.tema} ${s.referencia} ${s.versiculo}`.toLowerCase()
      if (searchText.includes(q)) {
        results.push({
          id: `seal_${s.numero}`,
          title: `Sello #${s.numero} — ${s.tema}`,
          description: `${s.referencia} · ${s.versiculo.slice(0, 80)}`,
          pillar: "sellos",
          category: "Sellos",
          href: `/sellos/${s.numero}`,
          icon: "🔏",
        })
      }
    }
  } catch { /* ignore */ }

  try {
    const entries = getLedgerEntries()
    for (const e of entries) {
      if (e.concept.toLowerCase().includes(q) || e.reference?.toLowerCase().includes(q) || e.senderName?.toLowerCase().includes(q)) {
        results.push({
          id: `ledger_${e.id}`,
          title: e.concept.slice(0, 60),
          description: `${e.direction === "ENTRADA" ? "+" : "-"}$${Math.abs(e.amount).toFixed(2)} ${e.currency} · ${e.node}`,
          pillar: "economy",
          category: "Ledger",
          href: "/admin/ledger",
          icon: "💰",
        })
      }
    }
  } catch { /* ignore */ }

  return results.slice(0, 30)
}

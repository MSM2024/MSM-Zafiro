import { getProfiles } from "@/lib/identity"
import { getProducts, getOrders } from "@/lib/marketplace"
import { getDevocionales, getWriters } from "@/lib/editorial"
import { getBooks } from "@/lib/biblioteca/storage"
import { getLedgerEntries } from "@/lib/ledger"
import { getPublishedSeals, getSeals } from "@/lib/seals-data"

export interface CrossPillarStats {
  identity: { profiles: number; kycVerified: number; ownerCount: number }
  marketplace: { products: number; orders: number; categories: number }
  editorial: { books: number; devocionales: number; writers: number }
  economy: { ledgerEntries: number; nodes: number; totalVolume: number }
  sellos: { published: number; total: number; completion: number }
  totals: { entries: number; pillars: number }
}

export function getCrossPillarStats(): CrossPillarStats {
  const profiles = getProfiles()
  const products = getProducts()
  const orders = getOrders()
  const devocionales = getDevocionales()
  const writers = getWriters()
  const books = getBooks()
  const ledger = getLedgerEntries()
  const seals = getSeals()
  const publishedSeals = getPublishedSeals()

  const totalVolume = ledger.reduce((sum, e) => sum + (e.amount || 0), 0)

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))]

  const kycVerified = profiles.filter((p: any) => p.verificationStatus === "verified").length
  const ownerCount = profiles.filter((p: any) => p.role === "OWNER" || p.role === "OWNER_SUPERADMIN").length

  return {
    identity: {
      profiles: profiles.length,
      kycVerified,
      ownerCount,
    },
    marketplace: {
      products: products.length,
      orders: orders.length,
      categories: categories.length,
    },
    editorial: {
      books: books.length,
      devocionales: devocionales.length,
      writers: writers.length,
    },
    economy: {
      ledgerEntries: ledger.length,
      nodes: [...new Set(ledger.map((e) => e.node).filter(Boolean))].length,
      totalVolume,
    },
    sellos: {
      published: publishedSeals.length,
      total: seals.length,
      completion: publishedSeals.length,
    },
    totals: {
      entries: profiles.length + products.length + orders.length + devocionales.length + writers.length + books.length + ledger.length + seals.length,
      pillars: 5,
    },
  }
}

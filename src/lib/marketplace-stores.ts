'use client'

import { addNotification } from '@/lib/notifications'

export interface Store {
  id: string
  name: string
  description: string
  logoUrl?: string
  coverUrl?: string
  ownerId: string
  ownerName: string
  email: string
  phone?: string
  address?: string
  website?: string
  category: string
  tags: string[]
  verificationStatus: "unverified" | "pending" | "verified" | "rejected"
  status: "active" | "inactive" | "suspended"
  rating: number
  reviewCount: number
  productCount: number
  orderCount: number
  createdAt: string
  updatedAt: string
}

export interface StoreReview {
  id: string
  storeId: string
  authorId: string
  authorName: string
  rating: 1 | 2 | 3 | 4 | 5
  comment: string
  createdAt: string
}

export interface DeliveryEvidence {
  id: string
  orderId: string
  storeId: string
  photoUrl?: string
  notes: string
  receiverName?: string
  receiverSignature?: string
  status: "pending" | "confirmed" | "disputed"
  createdAt: string
  confirmedAt?: string
}

const STORES_KEY = "zafiro_marketplace_stores"
const REVIEWS_KEY = "zafiro_marketplace_store_reviews"
const EVIDENCE_KEY = "zafiro_marketplace_delivery_evidence"

function getStores(): Store[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(STORES_KEY) || "[]") }
  catch { return [] }
}
function saveStores(s: Store[]) { localStorage.setItem(STORES_KEY, JSON.stringify(s)) }

function getReviews(): StoreReview[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(REVIEWS_KEY) || "[]") }
  catch { return [] }
}
function saveReviews(r: StoreReview[]) { localStorage.setItem(REVIEWS_KEY, JSON.stringify(r)) }

function getEvidence(): DeliveryEvidence[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(EVIDENCE_KEY) || "[]") }
  catch { return [] }
}
function saveEvidence(e: DeliveryEvidence[]) { localStorage.setItem(EVIDENCE_KEY, JSON.stringify(e)) }

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// ============================================================
// STORES
// ============================================================

export function registerStore(input: {
  name: string; description: string; ownerId: string; ownerName: string; email: string
  phone?: string; address?: string; website?: string; category?: string; tags?: string[]
}): Store {
  const store: Store = {
    id: genId("store"), name: input.name, description: input.description,
    ownerId: input.ownerId, ownerName: input.ownerName, email: input.email,
    phone: input.phone, address: input.address, website: input.website,
    category: input.category || "General", tags: input.tags || [],
    verificationStatus: "unverified", status: "active",
    rating: 0, reviewCount: 0, productCount: 0, orderCount: 0,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  }
  const all = getStores()
  all.unshift(store)
  saveStores(all)
  try {
    addNotification({
      title: "Nuevo comercio registrado", message: `${store.name} — por ${store.ownerName}`,
      type: "info", pillar: "marketplace", read: false, actionUrl: "/admin/marketplace",
    })
  } catch {}
  return store
}

export function getStoresList(filters?: { status?: string; search?: string; ownerId?: string; verified?: boolean }): Store[] {
  let list = getStores()
  if (filters?.status) list = list.filter(s => s.status === filters.status)
  if (filters?.ownerId) list = list.filter(s => s.ownerId === filters.ownerId)
  if (filters?.verified) list = list.filter(s => s.verificationStatus === "verified")
  if (filters?.search) {
    const q = filters.search.toLowerCase()
    list = list.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
  }
  return list.sort((a, b) => b.rating - a.rating || b.productCount - a.productCount)
}

export function getStore(id: string): Store | undefined {
  return getStores().find(s => s.id === id)
}

export function updateStore(id: string, updates: Partial<Store>): Store | undefined {
  const all = getStores()
  const idx = all.findIndex(s => s.id === id)
  if (idx === -1) return undefined
  all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() }
  saveStores(all)
  return all[idx]
}

export function verifyStore(id: string, status: "verified" | "rejected"): Store | undefined {
  return updateStore(id, { verificationStatus: status })
}

export function getStoreStats(): { total: number; verified: number; pending: number; active: number } {
  const all = getStores()
  return {
    total: all.length,
    verified: all.filter(s => s.verificationStatus === "verified").length,
    pending: all.filter(s => s.verificationStatus === "pending").length,
    active: all.filter(s => s.status === "active").length,
  }
}

// ============================================================
// REVIEWS
// ============================================================

export function addStoreReview(input: {
  storeId: string; authorId: string; authorName: string; rating: 1 | 2 | 3 | 4 | 5; comment: string
}): StoreReview {
  const review: StoreReview = {
    id: genId("rev"), storeId: input.storeId, authorId: input.authorId,
    authorName: input.authorName, rating: input.rating, comment: input.comment,
    createdAt: new Date().toISOString(),
  }
  const all = getReviews()
  all.unshift(review)
  saveReviews(all)
  const storeReviews = all.filter(r => r.storeId === input.storeId)
  const avgRating = storeReviews.reduce((s, r) => s + r.rating, 0) / storeReviews.length
  updateStore(input.storeId, { rating: Math.round(avgRating * 10) / 10, reviewCount: storeReviews.length })
  return review
}

export function getStoreReviews(storeId: string): StoreReview[] {
  return getReviews().filter(r => r.storeId === storeId)
}

// ============================================================
// DELIVERY EVIDENCE
// ============================================================

export function addDeliveryEvidence(input: {
  orderId: string; storeId: string; photoUrl?: string; notes: string; receiverName?: string
}): DeliveryEvidence {
  const evidence: DeliveryEvidence = {
    id: genId("ev"), orderId: input.orderId, storeId: input.storeId,
    photoUrl: input.photoUrl, notes: input.notes, receiverName: input.receiverName,
    status: "pending", createdAt: new Date().toISOString(),
  }
  const all = getEvidence()
  all.unshift(evidence)
  saveEvidence(all)
  try {
    addNotification({
      title: "Evidencia de entrega", message: `Orden #${input.orderId.slice(0, 8)} — evidencia registrada`,
      type: "info", pillar: "marketplace", read: false, actionUrl: "/admin/marketplace",
    })
  } catch {}
  return evidence
}

export function confirmDelivery(evidenceId: string): DeliveryEvidence | undefined {
  const all = getEvidence()
  const idx = all.findIndex(e => e.id === evidenceId)
  if (idx === -1) return undefined
  all[idx].status = "confirmed"
  all[idx].confirmedAt = new Date().toISOString()
  saveEvidence(all)
  return all[idx]
}

export function getOrderEvidence(orderId: string): DeliveryEvidence | undefined {
  return getEvidence().find(e => e.orderId === orderId)
}

export function getStoreEvidence(storeId: string): DeliveryEvidence[] {
  return getEvidence().filter(e => e.storeId === storeId)
}

export function getEvidenceStats(): { total: number; pending: number; confirmed: number } {
  const all = getEvidence()
  return {
    total: all.length,
    pending: all.filter(e => e.status === "pending").length,
    confirmed: all.filter(e => e.status === "confirmed").length,
  }
}

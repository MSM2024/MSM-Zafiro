'use client'

import { sendEmail } from './email-service'

const RATINGS_KEY = 'zafiro_ratings'

export interface Rating {
  id: string
  orderId: string
  productId: string
  sellerId: string
  buyerId: string
  stars: 1 | 2 | 3 | 4 | 5
  comment: string
  deliveryRating: 1 | 2 | 3 | 4 | 5
  createdAt: string
  responded: boolean
  responseComment?: string
  respondedAt?: string
}

export interface SellerRatingSummary {
  sellerId: string
  average: number
  total: number
  distribution: Record<number, number>
}

function getRatings(): Rating[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(RATINGS_KEY) || '[]') } catch { return [] }
}

function saveRatings(ratings: Rating[]): void {
  localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings))
}

export function submitRating(
  orderId: string, productId: string, sellerId: string, buyerId: string,
  stars: 1|2|3|4|5, comment: string, deliveryRating: 1|2|3|4|5
): Rating {
  const ratings = getRatings()
  const existing = ratings.find(r => r.orderId === orderId && r.buyerId === buyerId)
  if (existing) throw new Error('Ya calificaste esta orden')

  const rating: Rating = {
    id: `rating_${Date.now()}`,
    orderId, productId, sellerId, buyerId,
    stars, comment, deliveryRating,
    createdAt: new Date().toISOString(),
    responded: false,
  }
  ratings.push(rating)
  saveRatings(ratings)

  sendEmail(sellerId, 'Nueva calificación recibida',
    `Has recibido una calificación de ${stars} estrellas.\n\nComentario: ${comment}\n\nSigue mejorando tu servicio para mantener tu reputación VIP.`,
    'rating_receipt', { orderId, stars: String(stars) }
  )

  return rating
}

export function respondToRating(ratingId: string, responseComment: string): Rating | null {
  const ratings = getRatings()
  const found = ratings.find(r => r.id === ratingId)
  if (!found) return null
  found.responded = true
  found.responseComment = responseComment
  found.respondedAt = new Date().toISOString()
  saveRatings(ratings)
  return found
}

export function getSellerRatings(sellerId: string): Rating[] {
  return getRatings().filter(r => r.sellerId === sellerId)
}

export function getBuyerRatings(buyerId: string): Rating[] {
  return getRatings().filter(r => r.buyerId === buyerId)
}

export function getProductRatings(productId: string): Rating[] {
  return getRatings().filter(r => r.productId === productId)
}

export function getSellerSummary(sellerId: string): SellerRatingSummary {
  const ratings = getSellerRatings(sellerId)
  const total = ratings.length
  if (total === 0) return { sellerId, average: 0, total: 0, distribution: { 1:0, 2:0, 3:0, 4:0, 5:0 } }
  const sum = ratings.reduce((a, r) => a + r.stars, 0)
  const distribution: Record<number, number> = { 1:0, 2:0, 3:0, 4:0, 5:0 }
  ratings.forEach(r => { distribution[r.stars] = (distribution[r.stars] || 0) + 1 })
  return { sellerId, average: Math.round((sum / total) * 10) / 10, total, distribution }
}

export function getAllRatings(): Rating[] {
  return getRatings()
}

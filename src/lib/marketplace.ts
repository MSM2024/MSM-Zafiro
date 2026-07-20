'use client'

import { addLedgerEntry as addLedger } from '@/lib/ledger'
import { addNotification } from '@/lib/notifications'
import { enqueueOperation } from '@/lib/offline-queue'

export type ProductCategory = "digital" | "physical" | "service" | "membership" | "merchandise"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: "USD" | "CUP" | "MLC" | "USDT"
  category: ProductCategory
  tags: string[]
  imageUrl?: string
  stock: number
  status: "active" | "inactive" | "out_of_stock"
  featured: boolean
  storeId?: string
  variants?: ProductVariant[]
  variantGroups?: VariantGroup[]
  createdAt: string
  updatedAt: string
}

export interface VariantGroup {
  id: string
  name: string
  options: VariantOption[]
}

export interface VariantOption {
  id: string
  value: string
  priceAdjustment?: number
  stockOverride?: number
  imageUrl?: string
}

export interface ProductVariant {
  name: string
  options: string[]
  price?: number
  stock?: number
}

export interface VariantSelection {
  groupId: string
  groupName: string
  optionId: string
  optionValue: string
}

export interface ProductStoreInfo {
  id: string
  name: string
  storeId?: string
  storeName?: string
}

export interface CartItem {
  productId: string
  quantity: number
  variantSelections?: VariantSelection[]
  addedAt: string
}

export interface Cart {
  id: string
  items: CartItem[]
  couponCode?: string
  createdAt: string
  updatedAt: string
}

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"

export interface OrderItem {
  productId: string
  productName: string
  price: number
  currency: string
  quantity: number
  variantInfo?: string
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  currency: string
  customerName: string
  customerEmail: string
  customerHandle?: string
  shippingAddress?: string
  notes?: string
  status: OrderStatus
  paymentMethod: string
  paymentRef?: string
  ledgerEntryId?: string
  createdAt: string
  updatedAt: string
}

const PRODUCTS_KEY = "zafiro_marketplace_products"
const CART_KEY = "zafiro_marketplace_cart"
const ORDERS_KEY = "zafiro_marketplace_orders"

const SEED_PRODUCTS: Product[] = [
  { id: "prod-001", name: "Curso 'De Cero a Dueño Digital'", description: "Programa completo de transformación digital: mentalidad, herramientas y estrategias para construir tu imperio desde cero. Incluye módulos de branding, ventas, automatización y liderazgo.", price: 369, currency: "USD", category: "digital", tags: ["curso", "digital", "negocios", "emprendimiento"], stock: 999, status: "active", featured: true, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-07-01T00:00:00Z" },
  { id: "prod-002", name: "Membresía VIP MSM", description: "Acceso privilegiado a la comunidad MSM: contenido exclusivo, sesiones en vivo con Don Miguel, red de contactos de alto valor y descuentos en productos del ecosistema.", price: 777, currency: "USD", category: "membership", tags: ["vip", "comunidad", "red", "exclusivo"], stock: 100, status: "active", featured: true, createdAt: "2026-01-01T00:00:00Z", updatedAt: "2026-07-01T00:00:00Z" },
  { id: "prod-003", name: "Libro 'Los 7 Sellos del Éxito'", description: "Edición física firmada por Don Miguel. Una guía práctica sobre los 7 principios fundamentales para alcanzar la libertad financiera y espiritual.", price: 49.99, currency: "USD", category: "physical", tags: ["libro", "físico", "firmado", "edición limitada"], stock: 50, status: "active", featured: true, createdAt: "2026-02-01T00:00:00Z", updatedAt: "2026-07-01T00:00:00Z" },
  { id: "prod-004", name: "Camiseta MSM 369", description: "Camiseta premium de algodón orgánico con el diseño oficial 369-777. Disponible en tallas S-XXL. Diseño exclusivo de la comunidad MSM.", price: 36.90, currency: "USD", category: "merchandise", tags: ["camiseta", "merchandising", "369", "ropa"], stock: 200, status: "active", featured: false, createdAt: "2026-03-01T00:00:00Z", updatedAt: "2026-07-01T00:00:00Z" },
  { id: "prod-005", name: "Consultoría Personalizada 1:1", description: "Sesión privada de 60 minutos con Don Miguel para resolver dudas específicas de tu negocio, estrategia o desarrollo personal. Incluye grabación y resumen ejecutivo.", price: 369, currency: "USD", category: "service", tags: ["consultoría", "1:1", "personalizado", "estrategia"], stock: 20, status: "active", featured: true, createdAt: "2026-01-15T00:00:00Z", updatedAt: "2026-07-01T00:00:00Z" },
  { id: "prod-006", name: "Paquete de Emprendedor Digital", description: "Todo lo necesario para empezar: curso De Cero a Dueño Digital + membresía VIP 3 meses + camiseta MSM. Ahorra 30% vs compra por separado.", price: 888, currency: "USD", category: "digital", tags: ["paquete", "combo", "emprendedor", "ahorro"], stock: 30, status: "active", featured: true, createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-07-01T00:00:00Z" },
  { id: "prod-007", name: "Gorra MSM Origen", description: "Gorra ajustable con bordado del logo oficial MSM. Diseño clásico, colores negro y dorado. Una pieza para los verdaderos creyentes del imperio.", price: 24.99, currency: "USD", category: "merchandise", tags: ["gorra", "merchandising", "accesorio"], stock: 150, status: "active", featured: false, createdAt: "2026-05-01T00:00:00Z", updatedAt: "2026-07-01T00:00:00Z" },
  { id: "prod-008", name: "Sesión de Estrategia para Negocios", description: "Análisis profundo de tu modelo de negocio con recomendaciones accionables. Incluye diagnóstico financiero, análisis de mercado y plan de crecimiento.", price: 777, currency: "USD", category: "service", tags: ["consultoría", "negocios", "estrategia", "diagnóstico"], stock: 10, status: "active", featured: false, createdAt: "2026-02-15T00:00:00Z", updatedAt: "2026-07-01T00:00:00Z" },
  { id: "prod-009", name: "Pack de Productos Digitales", description: "5 plantillas editables: plan de negocios, calendario editorial, tracker de hábitos, planner financiero y guía de branding personal. Formato Notion + PDF.", price: 69.99, currency: "USD", category: "digital", tags: ["plantillas", "digital", "notion", "organización"], stock: 999, status: "active", featured: false, createdAt: "2026-06-01T00:00:00Z", updatedAt: "2026-07-01T00:00:00Z" },
  { id: "prod-010", name: "Taza MSM 369-777", description: "Taza de cerámica de alta calidad con el sello 369-777 grabado. Capacidad 350ml. Apto para microondas y lavavajillas.", price: 18.99, currency: "USD", category: "merchandise", tags: ["taza", "merchandising", "hogar"], stock: 100, status: "active", featured: false, createdAt: "2026-06-15T00:00:00Z", updatedAt: "2026-07-01T00:00:00Z" },
]

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  digital: "Productos Digitales",
  physical: "Productos Físicos",
  service: "Servicios",
  membership: "Membresías",
  merchandise: "Merchandising",
}

const CATEGORY_COLORS: Record<ProductCategory, string> = {
  digital: "text-blue-400",
  physical: "text-emerald-400",
  service: "text-purple-400",
  membership: "text-amber-400",
  merchandise: "text-cyan-400",
}

export function getCategoryLabel(cat: ProductCategory): string { return CATEGORY_LABELS[cat] || cat }
export function getCategoryColor(cat: ProductCategory): string { return CATEGORY_COLORS[cat] || "text-slate-400" }

// ============================================================
// PRODUCTS
// ============================================================

export function getProducts(): Product[] {
  if (typeof window === "undefined") return SEED_PRODUCTS
  const stored = localStorage.getItem(PRODUCTS_KEY)
  if (!stored) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS))
    return SEED_PRODUCTS
  }
  return JSON.parse(stored)
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export function getProduct(id: string): Product | undefined {
  return getProducts().find(p => p.id === id)
}

export function getActiveProducts(): Product[] {
  return getProducts().filter(p => p.status === "active")
}

export function getFeaturedProducts(): Product[] {
  return getActiveProducts().filter(p => p.featured)
}

export function getProductsByCategory(cat: ProductCategory): Product[] {
  return getActiveProducts().filter(p => p.category === cat)
}

export function addProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
  const products = getProducts()
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  products.push(newProduct)
  saveProducts(products)
  return newProduct
}

export function updateProduct(id: string, updates: Partial<Product>): Product | undefined {
  const products = getProducts()
  const idx = products.findIndex(p => p.id === id)
  if (idx === -1) return undefined
  products[idx] = { ...products[idx], ...updates, updatedAt: new Date().toISOString() }
  saveProducts(products)
  return products[idx]
}

// ============================================================
// CART
// ============================================================

export function getCart(): Cart {
  if (typeof window === "undefined") return { id: "cart-1", items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  const stored = localStorage.getItem(CART_KEY)
  if (!stored) {
    const cart: Cart = { id: "cart-1", items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
    return cart
  }
  return JSON.parse(stored)
}

function saveCart(cart: Cart) {
  cart.updatedAt = new Date().toISOString()
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export function addToCart(productId: string, quantity: number = 1, variantSelections?: VariantSelection[]): Cart {
  const cart = getCart()
  const variantKey = variantSelections ? variantSelections.map(v => `${v.optionId}`).sort().join('_') : ''
  const existing = cart.items.find(i => {
    if (i.productId !== productId) return false
    const iKey = i.variantSelections ? i.variantSelections.map(v => `${v.optionId}`).sort().join('_') : ''
    return iKey === variantKey
  })
  if (existing) {
    existing.quantity += quantity
  } else {
    cart.items.push({ productId, quantity, variantSelections, addedAt: new Date().toISOString() })
  }
  saveCart(cart)
  return cart
}

export function updateCartItem(productId: string, quantity: number): Cart {
  const cart = getCart()
  if (quantity <= 0) {
    cart.items = cart.items.filter(i => i.productId !== productId)
  } else {
    const item = cart.items.find(i => i.productId === productId)
    if (item) item.quantity = quantity
  }
  saveCart(cart)
  return cart
}

export function removeFromCart(productId: string): Cart {
  return updateCartItem(productId, 0)
}

export function clearCart() {
  const cart = getCart()
  cart.items = []
  saveCart(cart)
}

export function getCartTotal(cart: Cart): { subtotal: number; currency: string; itemCount: number } {
  const products = getProducts()
  let subtotal = 0
  let currency = "USD"
  let itemCount = 0
  for (const item of cart.items) {
    const product = products.find(p => p.id === item.productId)
    if (product) {
      let price = product.price
      if (item.variantSelections && product.variantGroups) {
        for (const sel of item.variantSelections) {
          const group = product.variantGroups.find(g => g.id === sel.groupId)
          if (group) {
            const opt = group.options.find(o => o.id === sel.optionId)
            if (opt?.priceAdjustment) price += opt.priceAdjustment
          }
        }
      }
      subtotal += price * item.quantity
      currency = product.currency
      itemCount += item.quantity
    }
  }
  return { subtotal, currency, itemCount }
}

export function getItemEffectivePrice(product: Product, variantSelections?: VariantSelection[]): number {
  let price = product.price
  if (variantSelections && product.variantGroups) {
    for (const sel of variantSelections) {
      const group = product.variantGroups.find(g => g.id === sel.groupId)
      if (group) {
        const opt = group.options.find(o => o.id === sel.optionId)
        if (opt?.priceAdjustment) price += opt.priceAdjustment
      }
    }
  }
  return price
}

// ============================================================
// ORDERS
// ============================================================

export function getOrders(): Order[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]")
}

export function getOrder(id: string): Order | undefined {
  return getOrders().find(o => o.id === id)
}

export function getOrdersByCustomer(handle: string): Order[] {
  return getOrders().filter(o => o.customerHandle === handle).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function createOrder(input: {
  items: { productId: string; quantity: number; variantSelections?: VariantSelection[] }[]
  customerName: string
  customerEmail: string
  customerHandle?: string
  shippingAddress?: string
  notes?: string
  paymentMethod: string
}): Order {
  const products = getProducts()
  const orderItems = input.items.map(item => {
    const product = products.find(p => p.id === item.productId)
    const effectivePrice = product ? getItemEffectivePrice(product, item.variantSelections) : 0
    const variantInfo = item.variantSelections && item.variantSelections.length > 0
      ? item.variantSelections.map(v => `${v.groupName}: ${v.optionValue}`).join(', ')
      : undefined
    return {
      productId: item.productId,
      productName: product?.name || "Producto eliminado",
      price: effectivePrice,
      currency: product?.currency || "USD",
      quantity: item.quantity,
      variantInfo,
    }
  })
  const total = orderItems.reduce((s, item) => s + item.price * item.quantity, 0)
  const currency = orderItems[0]?.currency || "USD"

  // Reduce stock
  for (const item of orderItems) {
    const product = products.find(p => p.id === item.productId)
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity)
    }
  }
  saveProducts(products)

  const order: Order = {
    id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    items: orderItems,
    total,
    currency,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerHandle: input.customerHandle,
    shippingAddress: input.shippingAddress,
    notes: input.notes,
    status: "pending",
    paymentMethod: input.paymentMethod,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const orders = getOrders()
  orders.unshift(order)
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))

  // Link to ledger
  try {
    const entry = addLedger({
      amount: total,
      currency: currency as any,
      method: input.paymentMethod as any,
      senderName: input.customerName,
      concept: `Pedido ${order.id}`,
      direction: "ENTRADA",
      node: "GENERAL",
    })
    order.ledgerEntryId = entry.id
    const orders2 = getOrders()
    const oi = orders2.findIndex(o => o.id === order.id)
    if (oi !== -1) { orders2[oi].ledgerEntryId = entry.id; localStorage.setItem(ORDERS_KEY, JSON.stringify(orders2)) }
  } catch {}

  try {
    addNotification({
      title: "Nuevo pedido recibido",
      message: `Pedido #${order.id.slice(0, 8)} — ${order.items.length} item(s) — $${order.total.toFixed(2)} — ${order.customerName}`,
      type: "warning",
      pillar: "marketplace",
      read: false,
      actionUrl: "/marketplace/orders",
    })
  } catch {}

  enqueueOperation({
    entity: "order",
    entityId: order.id,
    type: "create",
    data: order,
  })

  return order
}

export function updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
  const orders = getOrders()
  const idx = orders.findIndex(o => o.id === id)
  if (idx === -1) return undefined
  const prevStatus = orders[idx].status
  orders[idx] = { ...orders[idx], status, updatedAt: new Date().toISOString() }
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  if (prevStatus !== status && (status === "delivered" || status === "cancelled" || status === "shipped")) {
    try {
      addNotification({
        title: `Pedido ${status === "delivered" ? "entregado" : status === "shipped" ? "enviado" : "cancelado"}`,
        message: `Pedido #${id.slice(0, 8)} — estado actualizado: ${status}`,
        type: status === "cancelled" ? "warning" : "success",
        pillar: "marketplace",
        read: false,
        actionUrl: "/marketplace/orders",
      })
    } catch {}
  }
  return orders[idx]
}

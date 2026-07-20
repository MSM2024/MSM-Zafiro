import { describe, it, expect, beforeEach } from 'vitest'
import {
  getActiveProducts, getProduct, addToCart, getCart,
  getCartTotal, removeFromCart, clearCart, createOrder,
  getOrders, getOrdersByCustomer, getProductsByCategory
} from '../marketplace'

beforeEach(() => { localStorage.clear() })

describe('marketplace', () => {
  it('getActiveProducts returns seed products', () => {
    const products = getActiveProducts()
    expect(products.length).toBeGreaterThan(0)
  })

  it('getProduct returns correct product', () => {
    const products = getActiveProducts()
    const p = getProduct(products[0].id)
    expect(p?.id).toBe(products[0].id)
  })

  it('getProduct returns null for unknown', () => {
    expect(getProduct('nonexistent')).toBeUndefined()
  })

  it('addToCart and getCart work', () => {
    const pid = getActiveProducts()[0].id
    addToCart(pid)
    const cart = getCart()
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].productId).toBe(pid)
    expect(cart.items[0].quantity).toBe(1)
  })

  it('addToCart increments quantity for same product', () => {
    const pid = getActiveProducts()[0].id
    addToCart(pid)
    addToCart(pid)
    expect(getCart().items[0].quantity).toBe(2)
  })

  it('getCartTotal returns correct counts', () => {
    const products = getActiveProducts()
    addToCart(products[0].id)
    addToCart(products[1].id)
    addToCart(products[1].id)
    const total = getCartTotal(getCart())
    expect(total.itemCount).toBe(3)
    expect(total.subtotal).toBeGreaterThan(0)
  })

  it('removeFromCart works', () => {
    const pid = getActiveProducts()[0].id
    addToCart(pid)
    removeFromCart(pid)
    expect(getCart().items).toHaveLength(0)
  })

  it('clearCart empties cart', () => {
    addToCart(getActiveProducts()[0].id)
    clearCart()
    expect(getCart().items).toHaveLength(0)
  })

  it('createOrder and getOrders work', () => {
    const pid = getActiveProducts()[0].id
    addToCart(pid)
    const order = createOrder({
      items: getCart().items,
      customerName: 'Test',
      customerEmail: 'test@test.com',
      customerHandle: 'test@test.com',
      paymentMethod: 'card',
    })
    expect(order.status).toBe('pending')
    expect(order.items).toHaveLength(1)
    const orders = getOrdersByCustomer('test@test.com')
    expect(orders).toHaveLength(1)
  })

  it('getProductsByCategory filters correctly', () => {
    const digital = getProductsByCategory('digital')
    expect(digital.every(p => p.category === 'digital')).toBe(true)
  })
})

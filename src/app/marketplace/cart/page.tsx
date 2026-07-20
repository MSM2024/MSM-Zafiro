'use client'

import { useState, useMemo } from "react"
import Link from "next/link"
import { usePageTitle } from "@/lib/usePageTitle"
import { getCart, getCartTotal, getProducts, updateCartItem, removeFromCart, clearCart, createOrder, getOrders, getItemEffectivePrice } from "@/lib/marketplace"
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus, CreditCard, Check, AlertTriangle, Package } from "lucide-react"

export default function CartPage() {
  usePageTitle("Carrito — MSM Marketplace")
  const [cart, setCart] = useState(getCart)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checking, setChecking] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", email: "", address: "", notes: "", payment: "USDT" })

  const products = getProducts()
  const { subtotal, currency } = getCartTotal(cart)

  const cartItems = useMemo(() => {
    return cart.items.map(item => {
      const product = products.find(p => p.id === item.productId)
      return { ...item, product }
    }).filter(i => i.product)
  }, [cart, products])

  const handleUpdate = (productId: string, qty: number) => {
    const newCart = updateCartItem(productId, qty)
    setCart({ ...newCart })
  }

  const handleRemove = (productId: string) => {
    const newCart = removeFromCart(productId)
    setCart({ ...newCart })
  }

  const handleClear = () => {
    clearCart()
    setCart(getCart())
  }

  const handleCheckout = () => {
    if (!form.name || !form.email) return
    setChecking(true)
    try {
      const order = createOrder({
        items: cartItems.map(i => ({ productId: i.productId, quantity: i.quantity, variantSelections: i.variantSelections })),
        customerName: form.name,
        customerEmail: form.email,
        shippingAddress: form.address || undefined,
        notes: form.notes || undefined,
        paymentMethod: form.payment,
      })
      clearCart()
      setCart(getCart())
      setDone(order.id)
    } catch (e) {
      console.error(e)
    }
    setChecking(false)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-xl font-black mb-2">Pedido Confirmado</h1>
          <p className="text-xs text-slate-400 mb-1">Tu orden ha sido registrada en el Ledger Maestro.</p>
          <p className="text-[9px] font-mono text-[#00D9FF] mb-6">{done}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/marketplace/orders" className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[10px] font-bold text-white hover:bg-slate-700/50 transition-all">
              Ver pedidos
            </Link>
            <Link href="/marketplace" className="px-4 py-2 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[10px] font-bold text-[#00D9FF] hover:bg-[#00D9FF]/20 transition-all">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Seguir comprando
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black">Carrito</h1>
            <p className="text-[9px] font-mono text-slate-500">{cart.items.length} items</p>
          </div>
          {cart.items.length > 0 && (
            <button onClick={handleClear}
              className="ml-auto px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[9px] font-bold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer">
              Vaciar
            </button>
          )}
        </div>

        {cart.items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500 mb-4">Tu carrito está vacío</p>
            <Link href="/marketplace" className="px-4 py-2 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[10px] font-bold text-[#00D9FF] hover:bg-[#00D9FF]/20 transition-all">
              Explorar productos
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-6">
              {cartItems.map(item => (
                  <div key={`${item.productId}_${item.variantSelections?.map(v=>v.optionId).join('_') || ''}`} className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-slate-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/marketplace/${item.productId}`} className="text-sm font-bold text-white hover:text-[#00D9FF] transition-colors truncate block">
                        {item.product!.name}
                      </Link>
                      {item.variantSelections && item.variantSelections.length > 0 && (
                        <p className="text-[9px] text-[#00D9FF] mt-0.5">{item.variantSelections.map(v => v.optionValue).join(' · ')}</p>
                      )}
                      <p className="text-[10px] text-slate-500">${getItemEffectivePrice(item.product!, item.variantSelections).toFixed(2)} {item.product!.currency}</p>
                    </div>
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <button onClick={() => handleUpdate(item.productId, item.quantity - 1)}
                        className="w-6 h-6 rounded-md bg-slate-700/50 text-white text-[10px] hover:bg-slate-700 transition-all cursor-pointer">
                        <Minus className="w-2.5 h-2.5 mx-auto" />
                      </button>
                      <span className="w-6 text-center text-[10px] font-bold">{item.quantity}</span>
                      <button onClick={() => handleUpdate(item.productId, item.quantity + 1)}
                        className="w-6 h-6 rounded-md bg-slate-700/50 text-white text-[10px] hover:bg-slate-700 transition-all cursor-pointer">
                        <Plus className="w-2.5 h-2.5 mx-auto" />
                      </button>
                    </div>
                    <p className="text-sm font-black w-20 text-right">${(getItemEffectivePrice(item.product!, item.variantSelections) * item.quantity).toFixed(2)}</p>
                    <button onClick={() => handleRemove(item.productId)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
              ))}
            </div>

            {/* Summary */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-slate-400">Subtotal</span>
                <span className="text-xl font-black">${subtotal.toFixed(2)} <span className="text-[9px] text-slate-500 font-normal">{currency}</span></span>
              </div>
              {!showCheckout ? (
                <button onClick={() => setShowCheckout(true)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4" /> Proceder al Pago
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Nombre</label>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none" placeholder="Tu nombre" />
                    </div>
                    <div>
                      <label className="text-[8px] font-bold text-slate-400 uppercase">Email</label>
                      <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none" placeholder="tu@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[8px] font-bold text-slate-400 uppercase">Dirección de envío (opcional)</label>
                    <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-[8px] font-bold text-slate-400 uppercase">Notas (opcional)</label>
                    <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-[8px] font-bold text-slate-400 uppercase">Método de pago</label>
                    <select value={form.payment} onChange={e => setForm(f => ({ ...f, payment: e.target.value }))}
                      className="w-full mt-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none cursor-pointer">
                      <option value="USDT">USDT (TRC20)</option>
                      <option value="ZELLE">Zelle</option>
                      <option value="VENMO">Venmo</option>
                      <option value="CASH">Efectivo</option>
                      <option value="OTRO">Otro</option>
                    </select>
                  </div>
                  <button onClick={handleCheckout} disabled={checking || !form.name || !form.email}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer disabled:opacity-30 flex items-center justify-center gap-2">
                    {checking ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Check className="w-4 h-4" />}
                    Confirmar Pedido (${subtotal.toFixed(2)})
                  </button>
                </div>
              )}
            </div>

            {/* Data source */}
            <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/40">
              <p className="text-[8px] text-slate-600">
                Los pedidos se sincronizan automáticamente con el Ledger Maestro de ZAFIRO.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import { getStoresList, getStore, updateStore } from '@/lib/marketplace-stores'
import { getProducts, addProduct, updateProduct, getOrders } from '@/lib/marketplace'
import { ChevronLeft, Store, Package, ShoppingCart, Plus, Edit3, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react'

export default function VendorDashboardPage() {
  usePageTitle('Panel de Vendedor — MSM Marketplace')
  const session = typeof window !== 'undefined' ? getSession() : null
  const userId = session?.email || ''
  const [tab, setTab] = useState<'store' | 'products' | 'orders'>('store')
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: 'digital' })

  const stores = getStoresList({ ownerId: userId })
  const activeStore = stores[0]
  const allProducts = getProducts().filter(p => p.storeId === activeStore?.id)
  const allOrders = getOrders().filter(o => {
    if (!activeStore) return false
    return o.items.some(i => allProducts.some(p => p.id === i.productId))
  })

  const stats = useMemo(() => ({
    products: allProducts.length,
    activeProducts: allProducts.filter(p => p.status === 'active').length,
    orders: allOrders.length,
    revenue: allOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0),
  }), [allProducts, allOrders])

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !activeStore) return
    addProduct({
      name: form.name.trim(), description: form.description.trim(),
      price: parseFloat(form.price) || 0, stock: parseInt(form.stock) || 0,
      currency: 'USD', category: form.category as any, tags: [],
      status: 'active', featured: false, storeId: activeStore.id,
    })
    setForm({ name: '', description: '', price: '', stock: '', category: 'digital' })
    setShowAddProduct(false)
  }

  if (!session) return (
    <div className="min-h-screen bg-[#050816] text-white p-4 flex items-center justify-center">
      <div className="text-center"><p className="text-slate-400">Inicia sesión para acceder al panel</p>
        <Link href="/auth/login" className="text-[#00D9FF] text-sm hover:underline mt-2 inline-block">Ir a login</Link></div>
    </div>
  )

  if (!activeStore) return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-lg mx-auto text-center py-12">
        <Store className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold mb-2">No tienes un comercio registrado</h2>
        <p className="text-sm text-slate-400 mb-4">Registra tu comercio para empezar a vender en MSM Marketplace</p>
        <Link href="/marketplace/registrar-comercio" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00D9FF] to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90">
          <Store className="w-4 h-4" /> Registrar Comercio
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/marketplace" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white mb-4 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Volver al Marketplace
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00D9FF] to-blue-600 flex items-center justify-center text-lg font-bold">{activeStore.name.charAt(0)}</div>
          <div className="flex-1">
            <h1 className="text-lg font-bold">{activeStore.name}</h1>
            <p className="text-xs text-slate-400">{activeStore.verificationStatus === 'verified' ? '✅ Verificado' : '⏳ Pendiente de verificación'} · {activeStore.category}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
            <Package className="w-4 h-4 text-[#00D9FF] mx-auto mb-1" />
            <p className="text-lg font-bold text-[#00D9FF]">{stats.products}</p>
            <p className="text-[10px] text-slate-400">Productos</p>
          </div>
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
            <ShoppingCart className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-emerald-400">{stats.orders}</p>
            <p className="text-[10px] text-slate-400">Órdenes</p>
          </div>
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
            <TrendingUp className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-amber-400">{stats.activeProducts}</p>
            <p className="text-[10px] text-slate-400">Activos</p>
          </div>
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 text-center">
            <DollarSign className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-purple-400">${stats.revenue.toFixed(0)}</p>
            <p className="text-[10px] text-slate-400">Ingresos</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4 border-b border-[#1A1B3A] pb-2">
          {(['store', 'products', 'orders'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === t ? 'bg-[#00D9FF]/10 text-[#00D9FF]' : 'text-slate-400 hover:text-white'}`}>
              {t === 'store' ? 'Tienda' : t === 'products' ? 'Productos' : 'Órdenes'}
            </button>
          ))}
        </div>

        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-300">Mis Productos</h2>
              <button onClick={() => setShowAddProduct(!showAddProduct)}
                className="flex items-center gap-1 text-xs text-[#00D9FF] hover:text-white transition-colors">
                <Plus className="w-3 h-3" /> Agregar Producto
              </button>
            </div>
            {showAddProduct && (
              <form onSubmit={handleAddProduct} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4 mb-4 space-y-3">
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre del producto" maxLength={100}
                  className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50" />
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción" rows={2}
                  className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50 resize-none" />
                <div className="grid grid-cols-3 gap-2">
                  <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="Precio" type="number" step="0.01"
                    className="bg-[#050816] border border-[#1A1B3A] rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50" />
                  <input value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="Stock" type="number"
                    className="bg-[#050816] border border-[#1A1B3A] rounded-lg px-2 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50" />
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="bg-[#050816] border border-[#1A1B3A] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#00D9FF]/50">
                    {['digital', 'physical', 'service', 'membership', 'merchandise'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowAddProduct(false)} className="text-xs text-slate-500 hover:text-white px-2 py-1">Cancelar</button>
                  <button type="submit" disabled={!form.name.trim()} className="bg-[#00D9FF]/10 text-[#00D9FF] px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#00D9FF]/20 disabled:opacity-30">Crear Producto</button>
                </div>
              </form>
            )}
            {allProducts.length === 0 ? (
              <div className="text-center py-8 bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl">
                <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No tienes productos aún</p>
              </div>
            ) : (
              <div className="space-y-2">
                {allProducts.map(p => (
                  <div key={p.id} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-lg"><Package className="w-5 h-5 text-slate-500" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-400">${p.price.toFixed(2)} · Stock: {p.stock} · {p.status}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <h2 className="text-sm font-semibold text-slate-300 mb-3">Órdenes de tu tienda</h2>
            {allOrders.length === 0 ? (
              <div className="text-center py-8 bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl">
                <ShoppingCart className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No hay órdenes aún</p>
              </div>
            ) : (
              <div className="space-y-2">
                {allOrders.map(o => (
                  <div key={o.id} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white">#{o.id.slice(0, 10)}</p>
                      <p className="text-[10px] text-slate-400">{o.customerName} · ${o.total.toFixed(2)} · {o.items.length} items</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      o.status === 'pending' ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' :
                      o.status === 'confirmed' ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' :
                      o.status === 'delivered' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' :
                      o.status === 'cancelled' ? 'text-red-400 border-red-500/20 bg-red-500/10' :
                      'text-slate-400 border-slate-500/20 bg-slate-500/10'
                    }`}>{o.status}</span>
                    <span className="text-[10px] text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'store' && (
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4 space-y-3">
            <h2 className="text-sm font-semibold text-slate-300">Información de la Tienda</h2>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div><span className="text-slate-500">Nombre:</span><p className="text-white">{activeStore.name}</p></div>
              <div><span className="text-slate-500">Categoría:</span><p className="text-white">{activeStore.category}</p></div>
              <div><span className="text-slate-500">Email:</span><p className="text-white">{activeStore.email}</p></div>
              <div><span className="text-slate-500">Teléfono:</span><p className="text-white">{activeStore.phone || '—'}</p></div>
              <div><span className="text-slate-500">Verificación:</span><p className={`${activeStore.verificationStatus === 'verified' ? 'text-emerald-400' : 'text-amber-400'}`}>{activeStore.verificationStatus}</p></div>
              <div><span className="text-slate-500">Rating:</span><p className="text-white">{activeStore.rating > 0 ? `${activeStore.rating} ⭐` : 'Sin reseñas'}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

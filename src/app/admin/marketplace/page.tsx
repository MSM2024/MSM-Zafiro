'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import { isOwnerEmail } from "@/lib/owner"
import { getProducts, getOrders, updateProduct, updateOrderStatus, addProduct, type Product, type Order, type OrderStatus, type ProductCategory } from "@/lib/marketplace"
import { ArrowLeft, ShoppingCart, Package, TrendingUp, DollarSign, AlertTriangle, Check, X, Eye, Edit3, Search, Filter, Star, BarChart3, Shield, Plus } from "lucide-react"

const STATUS_OPTS: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]
const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400 border-yellow-500/20 bg-yellow-500/10",
  confirmed: "text-blue-400 border-blue-500/20 bg-blue-500/10",
  processing: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
  shipped: "text-purple-400 border-purple-500/20 bg-purple-500/10",
  delivered: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  cancelled: "text-red-400 border-red-500/20 bg-red-500/10",
  refunded: "text-orange-400 border-orange-500/20 bg-orange-500/10",
}

export default function AdminMarketplacePage() {
  usePageTitle("Marketplace — Admin ZAFIRO")
  const router = useRouter()
  const [tab, setTab] = useState("products")
  const [session, setSession] = useState(() => getSession())
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState("")
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: "", price: "", stock: "" })
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({ name: "", description: "", price: "", stock: "", currency: "USD" as const, category: "digital" as ProductCategory })

  const refresh = () => { setProducts(getProducts()); setOrders(getOrders()) }

  useEffect(() => {
    const s = getSession()
    setSession(s)
    if (!s) { router.replace("/auth/login"); return }
    if (!isOwnerEmail(s.email)) { setAuthorized(false); return }
    setAuthorized(true)
    refresh()
  }, [router])

  const salesStats = useMemo(() => {
    const total = orders.reduce((s, o) => s + o.total, 0)
    const byStatus: Record<string, number> = {}
    orders.forEach(o => { byStatus[o.status] = (byStatus[o.status] || 0) + 1 })
    const topProducts: Record<string, { name: string; qty: number; rev: number }> = {}
    orders.filter(o => o.status !== "cancelled").forEach(o => {
      o.items.forEach(item => {
        if (!topProducts[item.productId]) topProducts[item.productId] = { name: item.productName, qty: 0, rev: 0 }
        topProducts[item.productId].qty += item.quantity
        topProducts[item.productId].rev += item.price * item.quantity
      })
    })
    return { total, count: orders.length, byStatus, topProducts: Object.entries(topProducts).sort((a, b) => b[1].rev - a[1].rev).slice(0, 5) }
  }, [orders])

  const filteredProducts = useMemo(() => {
    if (!search) return products
    const q = search.toLowerCase()
    return products.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
  }, [products, search])

  const handleSaveProduct = (id: string) => {
    updateProduct(id, {
      name: editForm.name,
      price: parseFloat(editForm.price) || 0,
      stock: parseInt(editForm.stock) || 0,
    })
    setEditingProduct(null)
    refresh()
  }

  const handleToggleActive = (id: string) => {
    const p = products.find(x => x.id === id)
    if (!p) return
    updateProduct(id, { status: p.status === "active" ? "inactive" : "active" })
    refresh()
  }

  const handleUpdateStatus = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status)
    refresh()
  }

  if (authorized === false) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center"><Shield className="w-12 h-12 text-red-400 mx-auto mb-4" /><h1 className="text-lg font-bold mb-2">Acceso Denegado</h1><Link href="/" className="text-[#00D9FF] text-sm">Volver</Link></div>
      </div>
    )
  }
  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#00D9FF] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver al Panel
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black">MSM Marketplace</h1>
            <p className="text-[10px] font-mono text-slate-500">{products.length} productos &middot; {orders.length} pedidos &middot; ${salesStats.total.toFixed(2)} ventas</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {[
            { id: "products", label: "Productos", icon: Package },
            { id: "orders", label: "Pedidos", icon: ShoppingCart },
            { id: "stats", label: "Estadísticas", icon: BarChart3 },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${tab === t.id ? "bg-gradient-to-r from-amber-400/15 to-amber-600/10 text-amber-400 border border-amber-400/20" : "text-slate-400 hover:text-white hover:bg-slate-900/40"}`}>
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </nav>

        {/* ===== PRODUCTS ===== */}
        {tab === "products" && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/50 border border-slate-800/60 flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input type="text" placeholder="Buscar por nombre o ID..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent text-[10px] text-white outline-none w-full" />
              </div>
              <button onClick={() => setShowCreate(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold hover:bg-emerald-500/20 transition-all cursor-pointer">
                <Plus className="w-3 h-3" /> Crear Producto
              </button>
              <span className="text-[9px] text-slate-500">{products.filter(p => p.status === "active").length} activos / {products.length} total</span>
            </div>

            {/* Create Product Modal */}
            {showCreate && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="w-full max-w-md mx-4 rounded-2xl bg-slate-900 border border-slate-700/60 p-6">
                  <h3 className="text-sm font-bold text-white mb-4">Nuevo Producto</h3>
                  <div className="space-y-3">
                    <input value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} placeholder="Nombre del producto" className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00D9FF]" />
                    <textarea value={createForm.description} onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción" rows={2} className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00D9FF] resize-none" />
                    <div className="grid grid-cols-2 gap-2">
                      <input value={createForm.price} onChange={e => setCreateForm(f => ({ ...f, price: e.target.value }))} placeholder="Precio" type="number" step="0.01" className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00D9FF]" />
                      <input value={createForm.stock} onChange={e => setCreateForm(f => ({ ...f, stock: e.target.value }))} placeholder="Stock" type="number" className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00D9FF]" />
                    </div>
                    <select value={createForm.category} onChange={e => setCreateForm(f => ({ ...f, category: e.target.value as ProductCategory }))} className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#00D9FF]">
                      <option value="digital">Digital</option>
                      <option value="physical">Físico</option>
                      <option value="service">Servicio</option>
                      <option value="membership">Membresía</option>
                      <option value="merchandise">Merchandising</option>
                    </select>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => { setShowCreate(false); setCreateForm({ name: "", description: "", price: "", stock: "", currency: "USD", category: "digital" }) }}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[10px] text-slate-400 hover:text-white transition-all cursor-pointer">Cancelar</button>
                    <button onClick={() => {
                      if (!createForm.name || !createForm.price) return
                      addProduct({
                        name: createForm.name,
                        description: createForm.description,
                        price: parseFloat(createForm.price) || 0,
                        stock: parseInt(createForm.stock) || 0,
                        currency: createForm.currency,
                        category: createForm.category,
                        tags: [],
                        status: "active",
                        featured: false,
                      })
                      setShowCreate(false)
                      setCreateForm({ name: "", description: "", price: "", stock: "", currency: "USD", category: "digital" })
                      refresh()
                    }}
                      className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[10px] font-bold hover:opacity-90 transition-all cursor-pointer">Crear</button>
                  </div>
                </div>
              </div>
            )}
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-700/30">
                      <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Producto</th>
                      <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Precio</th>
                      <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Stock</th>
                      <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Categoría</th>
                      <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Estado</th>
                      <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Destacado</th>
                      <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                        <td className="px-3 py-2">
                          {editingProduct === p.id ? (
                            <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                              className="bg-slate-950/80 border border-slate-700 rounded px-2 py-1 text-[10px] text-white outline-none w-full" />
                          ) : (
                            <div>
                              <p className="text-[10px] font-bold text-white">{p.name}</p>
                              <p className="text-[7px] font-mono text-slate-600">{p.id}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {editingProduct === p.id ? (
                            <input value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                              className="bg-slate-950/80 border border-slate-700 rounded px-2 py-1 text-[10px] text-white outline-none w-20" type="number" step="0.01" />
                          ) : (
                            <span className="text-[10px] font-mono text-white">${p.price.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {editingProduct === p.id ? (
                            <input value={editForm.stock} onChange={e => setEditForm(f => ({ ...f, stock: e.target.value }))}
                              className="bg-slate-950/80 border border-slate-700 rounded px-2 py-1 text-[10px] text-white outline-none w-16" type="number" />
                          ) : (
                            <span className={`text-[10px] font-mono ${p.stock <= 5 ? "text-red-400" : "text-white"}`}>{p.stock}</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-[9px] text-slate-400">{p.category}</td>
                        <td className="px-3 py-2">
                          <span className={`text-[7px] px-1.5 py-0.5 rounded-full border ${p.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-3 py-2">{p.featured ? <Star className="w-3 h-3 text-amber-400" /> : <X className="w-3 h-3 text-slate-600" />}</td>
                        <td className="px-3 py-2">
                          <div className="flex gap-1">
                            {editingProduct === p.id ? (
                              <>
                                <button onClick={() => handleSaveProduct(p.id)}
                                  className="px-2 py-0.5 rounded text-[7px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer">Guardar</button>
                                <button onClick={() => setEditingProduct(null)}
                                  className="px-2 py-0.5 rounded text-[7px] bg-slate-500/10 text-slate-400 border border-slate-500/20 hover:bg-slate-500/20 cursor-pointer">Cancelar</button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => { setEditingProduct(p.id); setEditForm({ name: p.name, price: p.price.toString(), stock: p.stock.toString() }) }}
                                  className="px-2 py-0.5 rounded text-[7px] bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 cursor-pointer">
                                  <Edit3 className="w-2.5 h-2.5 inline mr-0.5" />Editar
                                </button>
                                <button onClick={() => handleToggleActive(p.id)}
                                  className={`px-2 py-0.5 rounded text-[7px] border cursor-pointer ${p.status === "active" ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"}`}>
                                  {p.status === "active" ? "Desactivar" : "Activar"}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===== ORDERS ===== */}
        {tab === "orders" && (
          <div>
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mb-4">
              {STATUS_OPTS.map(s => (
                <div key={s} className={`p-2 rounded-xl text-center border ${STATUS_COLORS[s]} bg-opacity-5`}>
                  <p className="text-lg font-black">{salesStats.byStatus[s] || 0}</p>
                  <p className="text-[7px] uppercase">{s}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-700/30">
                      <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">ID</th>
                      <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Cliente</th>
                      <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Items</th>
                      <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Total</th>
                      <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Pago</th>
                      <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Estado</th>
                      <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Fecha</th>
                      <th className="px-3 py-2 text-[8px] font-bold text-slate-400 uppercase">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={8} className="px-3 py-6 text-[10px] text-slate-500 text-center">No hay pedidos</td></tr>
                    ) : orders.slice(0, 50).map(o => (
                      <tr key={o.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                        <td className="px-3 py-2 text-[7px] font-mono text-[#00D9FF]">{o.id.slice(0, 16)}...</td>
                        <td className="px-3 py-2">
                          <p className="text-[9px] text-white">{o.customerName}</p>
                          <p className="text-[7px] text-slate-500">{o.customerEmail}</p>
                        </td>
                        <td className="px-3 py-2 text-[9px] text-slate-400">{o.items.length} items</td>
                        <td className="px-3 py-2 text-[10px] font-mono text-white font-bold">${o.total.toFixed(2)}</td>
                        <td className="px-3 py-2 text-[8px] text-slate-400">{o.paymentMethod}</td>
                        <td className="px-3 py-2">
                          <select value={o.status} onChange={e => handleUpdateStatus(o.id, e.target.value as OrderStatus)}
                            className={`text-[7px] px-1.5 py-0.5 rounded-full border outline-none cursor-pointer ${STATUS_COLORS[o.status] || "text-slate-500"}`}>
                            {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-2 text-[7px] text-slate-500">{new Date(o.createdAt).toLocaleDateString("es-ES")}</td>
                        <td className="px-3 py-2">
                          <Link href={`/marketplace/orders`} className="px-2 py-0.5 rounded text-[7px] bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20 hover:bg-[#00D9FF]/20 transition-all">
                            <Eye className="w-2.5 h-2.5 inline mr-0.5" />Ver
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===== STATS ===== */}
        {tab === "stats" && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <DollarSign className="w-5 h-5 text-emerald-400 mb-2" />
              <p className="text-2xl font-black">${salesStats.total.toFixed(2)}</p>
              <p className="text-[9px] text-slate-500">Ingresos totales</p>
              <p className="text-[7px] text-slate-600 mt-1">{salesStats.count} pedidos</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <TrendingUp className="w-5 h-5 text-[#00D9FF] mb-2" />
              <p className="text-2xl font-black">{products.filter(p => p.status === "active").length}</p>
              <p className="text-[9px] text-slate-500">Productos activos</p>
              <p className="text-[7px] text-slate-600 mt-1">{products.length} total en catálogo</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <Package className="w-5 h-5 text-amber-400 mb-2" />
              <p className="text-2xl font-black">{orders.filter(o => o.status === "pending" || o.status === "confirmed").length}</p>
              <p className="text-[9px] text-slate-500">Pedidos por procesar</p>
              <p className="text-[7px] text-slate-600 mt-1">{orders.filter(o => o.status === "delivered").length} entregados</p>
            </div>

            {/* Top products */}
            <div className="md:col-span-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
              <h3 className="text-xs font-bold text-white mb-3">Top 5 Productos por Ingreso</h3>
              {salesStats.topProducts.length === 0 ? (
                <p className="text-[10px] text-slate-500">Sin ventas registradas.</p>
              ) : (
                <div className="space-y-2">
                  {salesStats.topProducts.map(([id, data], i) => (
                    <div key={id} className="flex items-center gap-3 py-2 border-b border-slate-800/30 last:border-0">
                      <span className="text-[9px] font-bold text-slate-500 w-5">#{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-white">{data.name}</p>
                        <p className="text-[8px] text-slate-500">{data.qty} unidades vendidas</p>
                      </div>
                      <p className="text-[11px] font-mono text-emerald-400 font-bold">${data.rev.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-3 p-3 rounded-xl bg-slate-900/30 border border-slate-800/40">
              <p className="text-[8px] text-slate-600">Fuente: localStorage (zafiro_marketplace_products, zafiro_marketplace_orders)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

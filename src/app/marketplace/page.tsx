'use client'

import { useState, useMemo } from "react"
import Link from "next/link"
import { usePageTitle } from "@/lib/usePageTitle"
import { getActiveProducts, getProductsByCategory, getCart, getCartTotal, addToCart, type ProductCategory, type Product } from "@/lib/marketplace"
import { ShoppingCart, Search, Filter, Grid3X3, List, Star, ArrowLeft, Plus, Check, Tags, Package } from "lucide-react"

const CATEGORIES: { id: ProductCategory | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "digital", label: "Digitales" },
  { id: "physical", label: "Físicos" },
  { id: "service", label: "Servicios" },
  { id: "membership", label: "Membresías" },
  { id: "merchandise", label: "Merchandising" },
]

function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToCart(product.id)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const catColors: Record<string, string> = {
    digital: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    physical: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    service: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    membership: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    merchandise: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  }

  return (
    <div className="group relative p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 hover:border-[#00D9FF]/30 transition-all">
      <Link href={`/marketplace/${product.id}`}>
        <div className="w-full h-32 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mb-3 overflow-hidden">
          <Package className="w-10 h-10 text-slate-700 group-hover:text-[#00D9FF]/40 transition-all" />
        </div>
        <span className={`text-[8px] px-2 py-0.5 rounded-full border ${catColors[product.category] || ""}`}>
          {product.category}
        </span>
        <h3 className="text-sm font-bold text-white mt-1.5 group-hover:text-[#00D9FF] transition-colors">{product.name}</h3>
        <p className="text-[9px] text-slate-500 mt-1 line-clamp-2">{product.description}</p>
      </Link>
      <div className="flex items-center justify-between mt-3">
        <p className="text-lg font-black text-white">${product.price.toFixed(2)} <span className="text-[8px] text-slate-500 font-normal">{product.currency}</span></p>
        <button onClick={handleAdd} disabled={product.stock <= 0}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            added ? "bg-emerald-500/20 text-emerald-400" : "bg-[#00D9FF]/10 text-[#00D9FF] hover:bg-[#00D9FF]/20"
          } disabled:opacity-30 disabled:cursor-not-allowed`}>
          {added ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>
      {product.featured && <Star className="absolute top-3 right-3 w-3 h-3 text-amber-400" />}
      {product.stock <= 5 && product.stock > 0 && (
        <p className="text-[7px] text-amber-400 mt-1">Solo {product.stock} disponibles</p>
      )}
    </div>
  )
}

export default function MarketplacePage() {
  usePageTitle("MSM Marketplace — ZAFIRO")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<ProductCategory | "all">("all")
  const [view, setView] = useState<"grid" | "list">("grid")

  const cart = getCart()
  const { itemCount } = getCartTotal(cart)

  const products = useMemo(() => {
    const filtered = category === "all" ? getActiveProducts() : getProductsByCategory(category as ProductCategory)
    if (!search) return filtered
    const q = search.toLowerCase()
    return filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)))
  }, [category, search])

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black">MSM Marketplace</h1>
              <p className="text-[9px] font-mono text-slate-500">Imperio MSM — Catálogo oficial — <Link href="/imperio" className="text-amber-400 hover:underline">👑 Centro de Mando</Link></p>
            </div>
          </div>
          <Link href="/marketplace/cart"
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[10px] font-bold text-[#00D9FF] hover:bg-[#00D9FF]/20 transition-all">
            <ShoppingCart className="w-4 h-4" />
            Carrito
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-[8px] font-bold text-black flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input type="text" placeholder="Buscar productos..." value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-white placeholder:text-slate-500 outline-none w-full" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800/60 text-[10px]">
            <Filter className="w-3 h-3 text-slate-400" />
            <select value={category} onChange={e => setCategory(e.target.value as ProductCategory | "all")}
              className="bg-transparent text-white outline-none cursor-pointer">
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900/50 border border-slate-800/60">
            <button onClick={() => setView("grid")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${view === "grid" ? "bg-[#00D9FF]/20 text-[#00D9FF]" : "text-slate-500 hover:text-white"}`}>
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setView("list")}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${view === "list" ? "bg-[#00D9FF]/20 text-[#00D9FF]" : "text-slate-500 hover:text-white"}`}>
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Product grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500">No se encontraron productos</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="space-y-2">
            {products.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 hover:bg-slate-800/30 transition-all">
                <Link href={`/marketplace/${p.id}`} className="flex-1 flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{p.name}</p>
                    <p className="text-[8px] text-slate-500 truncate">{p.description}</p>
                  </div>
                </Link>
                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-sm font-black">${p.price.toFixed(2)}</p>
                  <button onClick={() => { addToCart(p.id); window.location.href = "/marketplace/cart" }}
                    className="px-3 py-1.5 rounded-lg bg-[#00D9FF]/10 text-[10px] font-bold text-[#00D9FF] hover:bg-[#00D9FF]/20 transition-all cursor-pointer">
                    Comprar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Data source */}
        <div className="mt-6 p-3 rounded-xl bg-slate-900/30 border border-slate-800/40">
          <p className="text-[8px] text-slate-600">
            Fuente: localStorage (zafiro_marketplace_products) &middot; 10 productos semilla con datos reales
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { usePageTitle } from "@/lib/usePageTitle"
import { getProduct, addToCart, getItemEffectivePrice } from "@/lib/marketplace"
import type { VariantSelection } from "@/lib/marketplace"
import { ArrowLeft, ShoppingCart, Plus, Check, Star, Package, AlertTriangle } from "lucide-react"

const CATEGORY_COLORS: Record<string, string> = {
  digital: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  physical: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  service: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  membership: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  merchandise: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
}

const CATEGORY_LABELS: Record<string, string> = {
  digital: "Producto Digital",
  physical: "Producto Físico",
  service: "Servicio",
  membership: "Membresía",
  merchandise: "Merchandising",
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.productId as string
  const [added, setAdded] = useState(false)
  const [qty, setQty] = useState(1)
  const [variantSelections, setVariantSelections] = useState<Record<string, string>>({})

  const product = getProduct(productId)
  usePageTitle(product ? `${product.name} — MSM Marketplace` : "Producto — MSM Marketplace")

  const handleSelectVariant = (groupId: string, optionId: string) => {
    setVariantSelections(prev => ({ ...prev, [groupId]: optionId }))
  }

  const buildVariantSelections = (): VariantSelection[] | undefined => {
    if (!product?.variantGroups) return undefined
    const selections: VariantSelection[] = []
    for (const group of product.variantGroups) {
      const selectedOptionId = variantSelections[group.id]
      if (selectedOptionId) {
        const opt = group.options.find(o => o.id === selectedOptionId)
        if (opt) {
          selections.push({ groupId: group.id, groupName: group.name, optionId: selectedOptionId, optionValue: opt.value })
        }
      }
    }
    return selections.length > 0 ? selections : undefined
  }

  const handleAdd = () => {
    const selections = buildVariantSelections()
    addToCart(product!.id, qty, selections)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h1 className="text-lg font-bold mb-2">Producto no encontrado</h1>
          <Link href="/marketplace" className="text-[#00D9FF] text-sm">Volver al catálogo</Link>
        </div>
      </div>
    )
  }

  const selections = buildVariantSelections()
  const effectivePrice = getItemEffectivePrice(product, selections)
  const allVariantsSelected = !product.variantGroups || product.variantGroups.every(g => variantSelections[g.id])

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700/50">
            <Package className="w-24 h-24 text-slate-700" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[8px] px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[product.category] || ""}`}>
                {CATEGORY_LABELS[product.category] || product.category}
              </span>
              {product.featured && (
                <span className="flex items-center gap-1 text-[8px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Star className="w-2.5 h-2.5" /> Destacado
                </span>
              )}
            </div>

            <h1 className="text-2xl font-black mb-2">{product.name}</h1>
            <p className="text-3xl font-black text-[#00D9FF] mb-4">
              ${effectivePrice.toFixed(2)}
              <span className="text-sm text-slate-500 font-normal ml-1">{product.currency}</span>
              {effectivePrice !== product.price && (
                <span className="text-xs text-slate-500 font-normal ml-2 line-through">${product.price.toFixed(2)}</span>
              )}
            </p>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">{product.description}</p>

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-6">
                {product.tags.map(t => (
                  <span key={t} className="text-[8px] px-2 py-0.5 rounded-full bg-slate-800/50 text-slate-400 border border-slate-700/50">#{t}</span>
                ))}
              </div>
            )}

            {/* Variant Groups */}
            {product.variantGroups && product.variantGroups.map(group => (
              <div key={group.id} className="mb-4">
                <p className="text-xs font-semibold text-slate-300 mb-2">{group.name}</p>
                <div className="flex flex-wrap gap-2">
                  {group.options.map(opt => {
                    const isSelected = variantSelections[group.id] === opt.id
                    const optPrice = opt.priceAdjustment ? `+$${opt.priceAdjustment.toFixed(0)}` : ''
                    return (
                      <button key={opt.id} onClick={() => handleSelectVariant(group.id, opt.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition-all cursor-pointer ${
                          isSelected ? 'bg-[#00D9FF]/20 text-[#00D9FF] border-[#00D9FF]/40' : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:border-slate-600'
                        }`}>
                        {opt.value} {optPrice && <span className="text-[9px] opacity-70">{optPrice}</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Stock */}
            <div className="mb-6">
              {product.stock > 10 ? (
                <p className="text-[10px] text-emerald-400">✓ En stock ({product.stock} disponibles)</p>
              ) : product.stock > 0 ? (
                <p className="text-[10px] text-amber-400">⚠ Solo {product.stock} unidades restantes</p>
              ) : (
                <p className="text-[10px] text-red-400">✗ Agotado</p>
              )}
            </div>

            {/* Quantity + Add */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-7 h-7 rounded-md bg-slate-700/50 text-white text-xs hover:bg-slate-700 transition-all cursor-pointer">-</button>
                <span className="w-8 text-center text-sm font-bold">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock || 99, qty + 1))}
                  className="w-7 h-7 rounded-md bg-slate-700/50 text-white text-xs hover:bg-slate-700 transition-all cursor-pointer">+</button>
              </div>
              <button onClick={handleAdd} disabled={product.stock <= 0 || (!!product.variantGroups && !allVariantsSelected)}
                className={`flex-1 px-6 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  added ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-gradient-to-r from-[#00D9FF] to-blue-600 text-white hover:opacity-90"
                } disabled:opacity-30 disabled:cursor-not-allowed`}>
                {added ? <><Check className="w-4 h-4" /> Agregado</> : <><ShoppingCart className="w-4 h-4" /> Agregar al Carrito</>}
              </button>
            </div>

            <Link href="/marketplace/cart"
              className="block text-center py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[10px] font-bold text-slate-400 hover:text-white hover:border-slate-600 transition-all">
              Ver Carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

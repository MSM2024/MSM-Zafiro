'use client'

import { useState } from "react"
import Link from "next/link"
import { usePageTitle } from "@/lib/usePageTitle"
import { getOrders } from "@/lib/marketplace"
import { ShoppingCart, ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, RefreshCw } from "lucide-react"

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  pending: { label: "Pendiente", icon: Clock, color: "text-yellow-400 border-yellow-500/20 bg-yellow-500/10" },
  confirmed: { label: "Confirmado", icon: CheckCircle, color: "text-blue-400 border-blue-500/20 bg-blue-500/10" },
  processing: { label: "Procesando", icon: RefreshCw, color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10" },
  shipped: { label: "Enviado", icon: Truck, color: "text-purple-400 border-purple-500/20 bg-purple-500/10" },
  delivered: { label: "Entregado", icon: CheckCircle, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "text-red-400 border-red-500/20 bg-red-500/10" },
  refunded: { label: "Reembolsado", icon: RefreshCw, color: "text-orange-400 border-orange-500/20 bg-orange-500/10" },
}

export default function OrdersPage() {
  usePageTitle("Mis Pedidos — MSM Marketplace")
  const [orders] = useState(getOrders())

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black">Mis Pedidos</h1>
            <p className="text-[9px] font-mono text-slate-500">{orders.length} pedidos registrados</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500 mb-4">No tienes pedidos aún</p>
            <Link href="/marketplace" className="px-4 py-2 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[10px] font-bold text-[#00D9FF] hover:bg-[#00D9FF]/20 transition-all">
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => {
              const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
              const StatusIcon = statusConfig.icon
              return (
                <div key={order.id} className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] font-mono text-[#00D9FF]">{order.id}</p>
                    <span className={`flex items-center gap-1 text-[8px] px-2 py-0.5 rounded-full border ${statusConfig.color}`}>
                      <StatusIcon className="w-2.5 h-2.5" /> {statusConfig.label}
                    </span>
                  </div>
                  <div className="space-y-1 mb-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-[10px]">
                        <span className="text-slate-400">{item.productName} × {item.quantity}</span>
                        <span className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-700/30">
                    <div className="text-[8px] text-slate-500">
                      {new Date(order.createdAt).toLocaleString("es-ES")} &middot; {order.paymentMethod}
                    </div>
                    <p className="text-sm font-black">${order.total.toFixed(2)} <span className="text-[8px] text-slate-500 font-normal">{order.currency}</span></p>
                  </div>
                  {order.ledgerEntryId && (
                    <p className="text-[7px] text-slate-600 mt-1">Ledger: {order.ledgerEntryId}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-6 p-3 rounded-xl bg-slate-900/30 border border-slate-800/40">
          <p className="text-[8px] text-slate-600">
            Los pedidos generan automáticamente una entrada en el Ledger Maestro (zafiro_marketplace_orders).
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Ship, Package, Plus, RefreshCw, ClipboardList, Trash2, Copy, Check, TrendingUp, MapPin, CalendarDays, Box, Wheat, Fan, Cpu, DollarSign, BookOpen } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import {
  getContainers, addContainer, updateContainerStatus, deleteContainer,
  getGraneroStats, getItemsByCategoria, generarReporteContainer, syncContainerToLedger,
  type Container, type ContainerStatus, type ContainerOrigen, type ItemCategoria,
} from "@/lib/logistica-contenedores"
import { addLedgerEntry, type LedgerEntry } from "@/lib/ledger"

const STATUS_OPTIONS: ContainerStatus[] = ["Planificado", "En tránsito", "En aduana", "En almacén", "Distribuyendo", "Completado"]
const STATUS_COLORS: Record<ContainerStatus, string> = {
  "Planificado": "bg-blue-500/10 text-blue-400 border-blue-500/30",
  "En tránsito": "bg-amber-500/10 text-amber-400 border-amber-500/30",
  "En aduana": "bg-purple-500/10 text-purple-400 border-purple-500/30",
  "En almacén": "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  "Distribuyendo": "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  "Completado": "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
}
const CATEGORY_ICONS: Record<ItemCategoria, typeof Fan> = {
  "Ventiladores Recargables": Fan,
  "Combos de Comida": Wheat,
  "Equipos EKO": Cpu,
  Otros: Package,
}

export default function LogisticaPage() {
  usePageTitle("Logística de Contenedores")
  const [containers, setContainers] = useState<Container[]>([])
  const [stats, setStats] = useState({ totalContenedores: 0, enTransito: 0, completados: 0, totalItems: 0, valorTotalUSD: 0, ultimaActualizacion: "" })
  const [itemsByCat, setItemsByCat] = useState<Record<string, number>>({})
  const [showNew, setShowNew] = useState(false)
  const [copiedId, setCopiedId] = useState("")
  const [newForm, setNewForm] = useState({
    nombre: "", origen: "USA" as ContainerOrigen, status: "Planificado" as ContainerStatus,
    fechaSalida: "", fechaEstimadaLlegada: "", trackingNumber: "", notas: "",
  })
  const [newItems, setNewItems] = useState<{ nombre: string; cantidad: string; unidad: string; categoria: ItemCategoria }[]>([])

  const refresh = () => {
    setContainers(getContainers())
    setStats(getGraneroStats())
    setItemsByCat(getItemsByCategoria())
  }

  useEffect(() => { refresh() }, [])

  const handleAddItem = () => {
    setNewItems([...newItems, { nombre: "", cantidad: "1", unidad: "unidad", categoria: "Ventiladores Recargables" }])
  }

  const handleNewContainer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newForm.nombre || !newForm.fechaSalida || !newForm.fechaEstimadaLlegada || !newForm.trackingNumber) return
    addContainer({
      nombre: newForm.nombre,
      origen: newForm.origen,
      destino: "Cuba",
      status: newForm.status,
      fechaSalida: newForm.fechaSalida,
      fechaEstimadaLlegada: newForm.fechaEstimadaLlegada,
      trackingNumber: newForm.trackingNumber,
      notas: newForm.notas,
      items: newItems.filter(i => i.nombre && parseFloat(i.cantidad) > 0).map(i => ({
        nombre: i.nombre,
        cantidad: parseFloat(i.cantidad) || 0,
        unidad: i.unidad,
        categoria: i.categoria,
      })),
    })
    setShowNew(false)
    setNewForm({ nombre: "", origen: "USA", status: "Planificado", fechaSalida: "", fechaEstimadaLlegada: "", trackingNumber: "", notas: "" })
    setNewItems([])
    refresh()
  }

  const handleStatusChange = (id: string, status: ContainerStatus) => {
    updateContainerStatus(id, status)
    refresh()
  }

  const handleSyncToLedger = (c: Container) => {
    if (c.status !== "Completado") return
    const entry = addLedgerEntry({
      amount: c.valorEstimadoUSD,
      currency: "USD",
      method: "OTRO",
      concept: `Contenedor: ${c.nombre} — ${c.trackingNumber} (${c.origen}→Cuba)`,
      direction: "ENTRADA",
      node: "FONDO_MSM",
      senderName: `Logística ${c.origen}`,
      reference: c.sello369,
    })
    syncContainerToLedger(c.id, entry.id)
    refresh()
  }

  const copyReport = async (c: Container) => {
    try {
      await navigator.clipboard.writeText(generarReporteContainer(c))
      setCopiedId(c.id)
      setTimeout(() => setCopiedId(""), 2000)
    } catch { /* clipboard unavailable */ }
  }

  const catKeys = Object.keys(itemsByCat) as ItemCategoria[]

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-20">
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver a Admin
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Ship className="w-7 h-7 text-[#00D9FF]" /> Logística de Contenedores
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              USA / Panamá → Cuba — Frecuencia 369
            </p>
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D9FF] text-[#050816] font-medium text-sm hover:bg-[#00D9FF]/90"
          >
            <Plus className="w-4 h-4" /> Nuevo Contenedor
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#123B8F]/40 to-white/5 border border-white/10">
            <Ship className="w-5 h-5 text-[#00D9FF] mb-2" />
            <div className="text-2xl font-bold">{stats.totalContenedores}</div>
            <div className="text-xs text-zinc-400">Total Contenedores</div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-white/5 border border-white/10">
            <TrendingUp className="w-5 h-5 text-amber-400 mb-2" />
            <div className="text-2xl font-bold">{stats.enTransito}</div>
            <div className="text-xs text-zinc-400">En Tránsito / Aduana</div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-white/5 border border-white/10">
            <Package className="w-5 h-5 text-emerald-400 mb-2" />
            <div className="text-2xl font-bold">{stats.totalItems.toLocaleString("es-ES")}</div>
            <div className="text-xs text-zinc-400">Items en Granero</div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-white/5 border border-white/10">
            <ClipboardList className="w-5 h-5 text-purple-400 mb-2" />
            <div className="text-2xl font-bold">{stats.completados}</div>
            <div className="text-xs text-zinc-400">Completados</div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#D6A83A]/20 to-white/5 border border-white/10">
            <DollarSign className="w-5 h-5 text-[#D6A83A] mb-2" />
            <div className="text-2xl font-bold">${stats.valorTotalUSD.toLocaleString("es-ES")}</div>
            <div className="text-xs text-zinc-400">Valor Total USD</div>
          </div>
        </div>

        {/* Granero por categoría */}
        {catKeys.length > 0 && (
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-[#D6A83A]" /> Granero MSM — Cargas Prioritarias
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {catKeys.map(cat => {
                const Icon = CATEGORY_ICONS[cat as ItemCategoria] || Package
                return (
                  <div key={cat} className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <Icon className="w-5 h-5 text-[#00D9FF] mx-auto mb-2" />
                    <div className="text-lg font-bold">{itemsByCat[cat].toLocaleString("es-ES")}</div>
                    <div className="text-xs text-zinc-400">{cat}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Lista de contenedores */}
        <div className="space-y-4">
          {containers.length === 0 ? (
            <div className="p-10 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Ship className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">
                Ningún contenedor registrado. Crea el primer envío para abastecer el Granero de MSM.
              </p>
            </div>
          ) : (
            containers.map(c => (
              <div key={c.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Ship className="w-4 h-4 text-[#00D9FF]" /> {c.nombre}
                    </h3>
                    <div className="text-xs text-zinc-500 mt-0.5 font-mono">{c.trackingNumber} · {c.sello369}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c.id, e.target.value as ContainerStatus)}
                      className={`px-2 py-1 rounded-full text-xs border font-medium ${STATUS_COLORS[c.status]} bg-transparent cursor-pointer [&>option]:bg-[#0a1128]`}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {c.status === "Completado" && !c.ledgerRefId && (
                      <button
                        onClick={() => handleSyncToLedger(c)}
                        title="Sincronizar con Ledger Maestro"
                        className="p-1.5 rounded-lg border border-[#D6A83A]/30 hover:bg-[#D6A83A]/10 text-[#D6A83A]"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {c.ledgerRefId && (
                      <span className="px-1.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px]" title="Sincronizado con Ledger">
                        ✓
                      </span>
                    )}
                    <button
                      onClick={() => copyReport(c)}
                      title="Copiar manifiesto"
                      className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10"
                    >
                      {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => { deleteContainer(c.id); refresh() }}
                      title="Eliminar"
                      className="p-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <MapPin className="w-3.5 h-3.5" /> {c.origen} → Cuba
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <CalendarDays className="w-3.5 h-3.5" /> Salida: {new Date(c.fechaSalida).toLocaleDateString("es-ES")}
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <CalendarDays className="w-3.5 h-3.5" /> Llegada est.: {new Date(c.fechaEstimadaLlegada).toLocaleDateString("es-ES")}
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Box className="w-3.5 h-3.5" /> {c.items.length} tipo(s) de carga
                  </div>
                  <div className="flex items-center gap-1.5 text-[#D6A83A]">
                    <DollarSign className="w-3.5 h-3.5" /> ${c.valorEstimadoUSD.toLocaleString("es-ES")} USD
                  </div>
                </div>

                {c.items.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {c.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs">
                        <span className="font-mono font-bold text-[#00D9FF]">{item.cantidad}×</span>
                        <span className="text-zinc-300">{item.nombre}</span>
                        <span className="text-zinc-500">({item.categoria})</span>
                      </div>
                    ))}
                  </div>
                )}
                {c.notas && (
                  <p className="text-xs text-zinc-500 mt-2 italic">{c.notas}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal: Nuevo contenedor */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <form onSubmit={handleNewContainer} className="w-full max-w-lg rounded-2xl bg-[#0a1128] border border-white/10 p-6 space-y-4 my-8">
            <h2 className="font-semibold flex items-center gap-2">
              <Ship className="w-5 h-5 text-[#00D9FF]" /> Nuevo Contenedor
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs text-zinc-400 mb-1">Nombre del contenedor *</label>
                <input type="text" required value={newForm.nombre}
                  onChange={(e) => setNewForm({ ...newForm, nombre: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF]" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Origen *</label>
                <select value={newForm.origen}
                  onChange={(e) => setNewForm({ ...newForm, origen: e.target.value as ContainerOrigen })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF] text-white [&>option]:bg-[#0a1128]">
                  <option value="USA">USA</option>
                  <option value="Panamá">Panamá</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Destino</label>
                <input type="text" disabled value="Cuba"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-500" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Fecha de salida *</label>
                <input type="date" required value={newForm.fechaSalida}
                  onChange={(e) => setNewForm({ ...newForm, fechaSalida: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF]" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Llegada estimada *</label>
                <input type="date" required value={newForm.fechaEstimadaLlegada}
                  onChange={(e) => setNewForm({ ...newForm, fechaEstimadaLlegada: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF]" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-zinc-400 mb-1">Tracking Number *</label>
                <input type="text" required value={newForm.trackingNumber}
                  onChange={(e) => setNewForm({ ...newForm, trackingNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF] font-mono" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-zinc-400 mb-1">Notas (opcional)</label>
                <textarea value={newForm.notas}
                  onChange={(e) => setNewForm({ ...newForm, notas: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF] text-sm" rows={2} />
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-zinc-400 font-medium">Carga del contenedor</label>
                <button type="button" onClick={handleAddItem}
                  className="text-xs text-[#00D9FF] hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Agregar item
                </button>
              </div>
              {newItems.length === 0 && (
                <p className="text-xs text-zinc-500">Sin items. Agrega ventiladores, comida, equipos EKO...</p>
              )}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {newItems.map((item, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2">
                    <input type="text" placeholder="Nombre" value={item.nombre}
                      onChange={(e) => { const items = [...newItems]; items[i].nombre = e.target.value; setNewItems(items) }}
                      className="col-span-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF] text-xs" />
                    <input type="number" min="1" value={item.cantidad}
                      onChange={(e) => { const items = [...newItems]; items[i].cantidad = e.target.value; setNewItems(items) }}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF] text-xs font-mono" />
                    <select value={item.categoria}
                      onChange={(e) => { const items = [...newItems]; items[i].categoria = e.target.value as ItemCategoria; setNewItems(items) }}
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-[#00D9FF] text-xs text-white [&>option]:bg-[#0a1128]">
                      <option value="Ventiladores Recargables">Ventiladores</option>
                      <option value="Combos de Comida">Comida</option>
                      <option value="Equipos EKO">EKO</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setShowNew(false); setNewItems([]) }}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-sm">Cancelar</button>
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#00D9FF] text-[#050816] font-semibold text-sm">Crear Contenedor</button>
            </div>
          </form>
        </div>
      )}

      <p className="text-center text-xs text-zinc-500 mt-10 flex items-center justify-center gap-2">
        <RefreshCw className="w-3 h-3" />
        Frecuencia 369 — Abundancia en Logística. Cada contenedor sellado con código único.
      </p>
    </div>
  )
}

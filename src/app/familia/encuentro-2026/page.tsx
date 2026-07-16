'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Clock, Users } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { REUNION, PROGRAMA_DEL_DIA, addGuest, getGuests, getDaysUntilReunion, type ReunionGuest } from "@/lib/familia"

export default function Encuentro2026Page() {
  usePageTitle("Encuentro 2026")
  const [guests, setGuests] = useState<ReunionGuest[]>([])
  const [days, setDays] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    fullName: "",
    branch: "",
    phone: "",
    country: "",
    companions: 0,
    transport: "",
    message: "",
  })

  useEffect(() => {
    setGuests(getGuests())
    setDays(getDaysUntilReunion())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName.trim()) return
    addGuest({ ...form, status: "confirmed" })
    setGuests(getGuests())
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050816] via-[#0a1128] to-[#123B8F]/20 text-white pb-20">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <Link href="/familia" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Volver a Familia
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold">Encuentro 2026</h1>
          <p className="text-[#D6A83A] mt-2">{REUNION.location}</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D6A83A]/10 border border-[#D6A83A]/30 text-[#D6A83A]">
            <Clock className="w-4 h-4" />
            <span className="font-semibold">{days} días restantes</span>
          </div>
        </div>

        {/* Programa del día */}
        <div className="mb-10 p-6 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#D6A83A]" /> Programa del Día
          </h2>
          <div className="space-y-3">
            {PROGRAMA_DEL_DIA.map((p) => (
              <div key={p.hora} className="flex gap-4 items-start">
                <span className="text-[#D6A83A] font-mono font-semibold text-sm w-12 shrink-0">{p.hora}</span>
                <span className="text-sm text-zinc-300">{p.actividad}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmación */}
        {submitted ? (
          <div className="p-8 rounded-2xl bg-[#2F6B45]/20 border border-[#2F6B45] text-center">
            <Check className="w-12 h-12 text-[#2F6B45] mx-auto mb-4" />
            <h2 className="text-xl font-bold">¡Asistencia Confirmada!</h2>
            <p className="text-zinc-300 mt-2">
              Gracias, {form.fullName}. Tu confirmación quedó registrada.
              Nos vemos el 16 de agosto en Las Siete Vueltas. 🌳✨
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D6A83A]" /> Confirmar Asistencia
            </h2>
            <div>
              <label className="block text-sm mb-1 text-zinc-300">Nombre completo *</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#D6A83A]"
                placeholder="Tu nombre y apellidos"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-zinc-300">Rama familiar</label>
              <select
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#D6A83A] text-white [&>option]:bg-[#0a1128]"
              >
                <option value="">Seleccionar...</option>
                <option value="soria-macias">Soria Macías (paterna)</option>
                <option value="martinez-sablon">Martínez Sablón (materna)</option>
                <option value="familia-politica">Familia política</option>
                <option value="invitado">Invitado especial</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-zinc-300">Teléfono</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#D6A83A]"
                  placeholder="+53..."
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-zinc-300">País / Ciudad</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#D6A83A]"
                  placeholder="Cuba, EE.UU..."
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-zinc-300">Acompañantes</label>
                <input
                  type="number"
                  min={0}
                  value={form.companions}
                  onChange={(e) => setForm({ ...form, companions: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#D6A83A]"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-zinc-300">Transporte</label>
                <select
                  value={form.transport}
                  onChange={(e) => setForm({ ...form, transport: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#D6A83A] text-white [&>option]:bg-[#0a1128]"
                >
                  <option value="">Seleccionar...</option>
                  <option value="propio">Vehículo propio</option>
                  <option value="colectivo">Transporte colectivo</option>
                  <option value="necesito">Necesito transporte</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1 text-zinc-300">Mensaje para la familia</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#D6A83A]"
                placeholder="Un saludo, un recuerdo, una oración..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#D6A83A] text-[#111827] font-semibold hover:bg-[#D6A83A]/90 transition-colors"
            >
              Confirmar mi Asistencia
            </button>
          </form>
        )}

        {/* Confirmados */}
        {guests.length > 0 && (
          <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Familiares Confirmados ({guests.length})</h2>
            <div className="space-y-2">
              {guests.map((g) => (
                <div key={g.id} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-[#2F6B45]" />
                  <span>{g.fullName}</span>
                  {g.companions > 0 && <span className="text-zinc-500">+{g.companions}</span>}
                  {g.country && <span className="text-zinc-500 text-xs">({g.country})</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

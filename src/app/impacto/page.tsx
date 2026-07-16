'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePageTitle } from "@/lib/usePageTitle"
import { getMisionSocial, actualizarProyecto, asignarFondos, guardarConstitucion, getEstadoGeneral, type ProyectoSocial } from "@/lib/impacto-social"
import { ArrowLeft, Heart, DollarSign, Target, FileText, Globe, Home, Users, Lightbulb, Stethoscope, TrainFront } from "lucide-react"

const CAT_ICONS: Record<string, typeof Heart> = {
  salud: Stethoscope, infraestructura: TrainFront, "tercera-edad": Users,
  discapacidad: Heart, vivienda: Home, "agua-luz": Lightbulb,
  alimentacion: Heart, constitucion: FileText,
}

export default function ImpactoPage() {
  usePageTitle("Impacto Social — ZAFIRO")
  const [mision, setMision] = useState(getMisionSocial())
  const [resumen, setResumen] = useState("")
  const [constitucion, setConstitucion] = useState("")
  const [editProyecto, setEditProyecto] = useState<string | null>(null)
  const [fondosInput, setFondosInput] = useState("")

  useEffect(() => {
    setResumen(getEstadoGeneral())
  }, [])

  function refresh() {
    const m = getMisionSocial()
    setMision(m)
    setResumen(getEstadoGeneral())
  }

  function handleAsignarFondos(id: string) {
    const monto = parseFloat(fondosInput)
    if (!monto || monto <= 0) return
    asignarFondos(id, monto)
    setFondosInput("")
    setEditProyecto(null)
    refresh()
  }

  function handleGuardarConstitucion() {
    if (!constitucion.trim()) return
    guardarConstitucion(constitucion)
    refresh()
  }

  const total = mision.proyectos.reduce((s, p) => s + p.fondosAsignadosUSD, 0)
  const ejecutado = mision.proyectos.reduce((s, p) => s + p.fondosEjecutadosUSD, 0)
  const beneficiarios = mision.proyectos.reduce((s, p) => s + p.受益人, 0)

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400/20 to-rose-600/20 border border-rose-500/30 flex items-center justify-center">
            <Heart className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h1 className="text-xl font-black">Impacto Social — Prosperidad Compartida</h1>
            <p className="text-[10px] text-slate-400">{mision.lema}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-2xl glass border border-slate-800/30 text-center">
            <DollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-lg font-black">${total.toFixed(0)}</p>
            <p className="text-[9px] text-slate-500">Fondos Asignados</p>
          </div>
          <div className="p-4 rounded-2xl glass border border-slate-800/30 text-center">
            <Target className="w-5 h-5 text-[#00D9FF] mx-auto mb-1" />
            <p className="text-lg font-black">${ejecutado.toFixed(0)}</p>
            <p className="text-[9px] text-slate-500">Fondos Ejecutados</p>
          </div>
          <div className="p-4 rounded-2xl glass border border-slate-800/30 text-center">
            <Users className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-black">{beneficiarios.toLocaleString()}</p>
            <p className="text-[9px] text-slate-500">Beneficiarios</p>
          </div>
        </div>

        {/* Proyectos */}
        <div className="space-y-3 mb-6">
          {mision.proyectos.map((p) => {
            const Icon = CAT_ICONS[p.categoria] || Heart
            const estados = { semilla: "🌱 Semilla", creciendo: "🌿 Creciendo", floreciendo: "🌸 Floreciendo", cosechando: "🌾 Cosechando" }
            return (
              <div key={p.id} className="p-4 rounded-2xl glass border border-slate-800/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-rose-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{p.nombre}</h3>
                      <p className="text-[9px] text-slate-400 mt-0.5">{p.descripcion}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[9px]">{estados[p.estado]}</span>
                        <span className="text-[9px] text-slate-500">$${p.fondosAsignadosUSD.toFixed(0)} asignados</span>
                        <span className="text-[9px] text-slate-500">{p.受益人} beneficiarios</span>
                      </div>
                      {p.metas.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.metas.map((m, i) => (
                            <span key={i} className="text-[8px] px-2 py-0.5 rounded-full bg-slate-800/50 text-slate-400">{m}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setEditProyecto(editProyecto === p.id ? null : p.id)} className="text-[9px] text-slate-500 hover:text-white transition-colors">
                    ${p.fondosAsignadosUSD.toFixed(0)}
                  </button>
                </div>
                {editProyecto === p.id && (
                  <div className="mt-3 pt-3 border-t border-slate-700/30 flex items-center gap-2">
                    <input value={fondosInput} onChange={(e) => setFondosInput(e.target.value)} type="number" placeholder="Monto USD" className="flex-1 bg-slate-800/50 border border-slate-700/30 rounded-lg px-3 py-1.5 text-[10px] focus:outline-none focus:border-[#00D9FF]/50" />
                    <button onClick={() => handleAsignarFondos(p.id)} className="text-[9px] bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-lg hover:bg-emerald-500/30 transition-colors">Asignar</button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Constitución Renacer */}
        <div className="p-4 rounded-2xl glass border border-amber-500/20 bg-amber-500/5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-amber-400">Constitución Renacer</h2>
          </div>
          {mision.pacto ? (
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-700/30 mb-3">
              <p className="text-[10px] text-slate-300 whitespace-pre-wrap font-mono">{mision.pacto}</p>
            </div>
          ) : (
            <p className="text-[9px] text-slate-500 mb-3">Esperando el documento fundacional. Pégalo aquí cuando esté listo:</p>
          )}
          <textarea value={constitucion} onChange={(e) => setConstitucion(e.target.value)} rows={4} placeholder="Pega aquí la Constitución Renacer..." className="w-full bg-slate-800/50 border border-slate-700/30 rounded-lg px-3 py-2 text-[10px] focus:outline-none focus:border-amber-500/50 mb-2 resize-none" />
          <button onClick={handleGuardarConstitucion} className="text-[9px] bg-amber-500/20 border border-amber-500/30 px-4 py-1.5 rounded-lg hover:bg-amber-500/30 transition-colors">
            {mision.pacto ? "Actualizar Constitución" : "Guardar Constitución"}
          </button>
        </div>

        {/* Propósito */}
        <div className="p-4 rounded-2xl glass border border-slate-800/30">
          <Globe className="w-4 h-4 text-[#00D9FF] mb-2" />
          <p className="text-[10px] text-slate-400 leading-relaxed">
            <strong className="text-white">El Propósito Sagrado de MSM:</strong> La riqueza que generamos tiene un solo destino: 
            levantar a Segundo Frente y convertirlo en un modelo de bienestar, tecnología y prosperidad compartida. 
            Hospital, teleférico, ancianos, discapacitados, vivienda, agua, luz, comida — <strong className="text-rose-400">todo para todos</strong>.
          </p>
          <p className="text-[9px] text-slate-600 mt-2 italic">
            "Todo el mundo en el amplio justo de la corriente y el agua. Todos los beneficios para todos."
          </p>
        </div>
      </div>
    </div>
  )
}

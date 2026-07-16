'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePageTitle } from "@/lib/usePageTitle"
import { crearConstitucionRenacer, guardarConstitucion, type ConstitucionRenacer } from "@/lib/impacto-social"
import { ArrowLeft, BookOpen, Shield, UserCheck, Heart, Home, Lightbulb, GraduationCap, Eye, Globe, Star, TrainFront, Users } from "lucide-react"

const ICONOS_ARTICULOS = [Shield, Heart, TrainFront, Users, Home, Star, GraduationCap, Eye, Globe, BookOpen]

export default function ConstitucionPage() {
  usePageTitle("Constitución Renacer — ZAFIRO")
  const [constitucion, setConstitucion] = useState<ConstitucionRenacer | null>(null)

  useEffect(() => {
    const c = crearConstitucionRenacer()
    guardarConstitucion(JSON.stringify(c, null, 2))
    setConstitucion(c)
  }, [])

  if (!constitucion) return <div className="min-h-screen bg-[#050816]" />

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/impacto" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Impacto Social
        </Link>

        {/* Sello */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400/20 via-[#00D9FF]/10 to-purple-400/20 border border-amber-500/30 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#00D9FF] to-purple-400">
            {constitucion.titulo}
          </h1>
          <p className="text-[9px] text-slate-500 mt-1">Pacto fundacional de la nueva era de prosperidad compartida</p>
        </div>

        {/* Preámbulo */}
        <div className="p-6 rounded-2xl glass border border-amber-500/20 bg-amber-500/5 mb-8">
          <h2 className="text-xs font-bold text-amber-400 mb-3 flex items-center gap-2"><BookOpen className="w-3 h-4" /> Preámbulo</h2>
          <p className="text-[11px] text-slate-300 leading-relaxed italic whitespace-pre-line">
            {constitucion.preambulo}
          </p>
        </div>

        {/* Artículos */}
        <div className="space-y-3 mb-8">
          <h2 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-3 h-4 text-[#00D9FF]" /> Los 10 Artículos del Renacer
          </h2>
          {constitucion.articulos.map((art, i) => {
            const Icon = ICONOS_ARTICULOS[i] || BookOpen
            return (
              <div key={art.numero} className="p-4 rounded-2xl glass border border-slate-800/30 hover:border-amber-500/20 transition-all duration-500 group">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                    <Icon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">Artículo {art.numero}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{art.titulo}</h3>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{art.contenido}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Firmantes */}
        <div className="p-6 rounded-2xl glass border border-slate-800/30 text-center">
          <h2 className="text-xs font-bold text-white mb-4">Firmantes</h2>
          <div className="space-y-2">
            {constitucion.firmantes.map((f, i) => (
              <div key={i} className="flex items-center justify-center gap-2">
                <UserCheck className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-slate-300">{f}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-700/30">
            <p className="text-[8px] text-slate-600">
              Registrada en el Módulo de Impacto Social de ZAFIRO OS · {new Date(constitucion.fecha).toLocaleDateString("es", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        {/* Villa Esperanza callout */}
        <div className="mt-6 p-5 rounded-2xl glass border border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-3 mb-2">
            <Home className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-emerald-400">Villa Esperanza</h2>
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">
            La primera comunidad modelo bajo la Constitución Renacer. Viviendas sostenibles con energía solar, 
            huertos comunitarios orgánicos, centro de innovación tecnológica ZAFIRO y sistema de agua potable 
            para todos. El blueprint de lo que Cuba puede ser.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Urbanización sostenible", "Paneles solares", "Huertos orgánicos", "Centro tecnológico", "Agua potable"].map((m, i) => (
              <span key={i} className="text-[8px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

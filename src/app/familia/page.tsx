'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, CalendarDays, Images, BookOpen, TreePine, Share2, Heart, MapPin } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { REUNION, getConfirmedCount, getDaysUntilReunion, getPhotosCount, getStoriesCount, getWhatsAppShareLink } from "@/lib/familia"

export default function FamiliaPage() {
  usePageTitle("Nube Familiar")
  const [stats, setStats] = useState({ confirmed: 0, days: 0, photos: 0, stories: 0 })

  useEffect(() => {
    setStats({
      confirmed: getConfirmedCount(),
      days: getDaysUntilReunion(),
      photos: getPhotosCount(),
      stories: getStoriesCount(),
    })
  }, [])

  const cards = [
    { title: "Familiares confirmados", value: stats.confirmed, icon: Users, color: "text-[#D6A83A]" },
    { title: "Días para el encuentro", value: stats.days, icon: CalendarDays, color: "text-[#00D9FF]" },
    { title: "Fotografías recopiladas", value: stats.photos, icon: Images, color: "text-[#2F6B45]" },
    { title: "Historias familiares", value: stats.stories, icon: BookOpen, color: "text-[#7C3AED]" },
  ]

  const sections = [
    { href: "/familia/encuentro-2026", label: "Encuentro 2026", icon: Heart, desc: "Confirma tu asistencia" },
    { href: "/familia/arbol", label: "Árbol Genealógico", icon: TreePine, desc: "Soria Macías · Martínez Sablón" },
    { href: "/familia/galeria", label: "Galería", icon: Images, desc: "Fotos y recuerdos" },
    { href: "/familia/cronologia", label: "Cronología", icon: CalendarDays, desc: "Línea del tiempo familiar" },
    { href: "/familia/historias", label: "Historias", icon: BookOpen, desc: "Memorias de los mayores" },
    { href: "/familia/invitacion", label: "Invitación", icon: Share2, desc: "Comparte por WhatsApp" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050816] via-[#0a1128] to-[#123B8F]/20 text-white">
      {/* Hero */}
      <section className="relative pt-20 pb-12 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D6A83A]/10 via-transparent to-transparent" />
        <div className="relative max-w-3xl mx-auto">
          <div className="text-5xl mb-4">🌳</div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Gran Encuentro Familiar{" "}
            <span className="bg-gradient-to-r from-[#D6A83A] to-[#F7F1E5] bg-clip-text text-transparent">
              Soria Martínez
            </span>
          </h1>
          <p className="mt-4 text-lg text-[#D6A83A] font-medium">
            16 de agosto de 2026 · Finca Las Siete Vueltas
          </p>
          <p className="mt-4 text-zinc-300 max-w-xl mx-auto">
            {REUNION.lema}
          </p>
          <div className="mt-2 flex items-center justify-center gap-1 text-sm text-zinc-400">
            <MapPin className="w-4 h-4" />
            <span>Mayarí Arriba, Segundo Frente, Santiago de Cuba</span>
          </div>

          {/* Countdown grande */}
          <div className="mt-8 inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/5 border border-[#D6A83A]/30">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#D6A83A]">{stats.days}</div>
              <div className="text-xs text-zinc-400 mt-1">días restantes</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-lg font-semibold">3 · 6 · 9</div>
              <div className="text-xs text-zinc-400 mt-1">frecuencia familiar</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/familia/encuentro-2026"
              className="px-6 py-3 rounded-full bg-[#D6A83A] text-[#111827] font-semibold hover:bg-[#D6A83A]/90 transition-colors"
            >
              Confirmar Asistencia
            </Link>
            <a
              href={getWhatsAppShareLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full border border-[#D6A83A]/50 text-[#D6A83A] hover:bg-[#D6A83A]/10 transition-colors"
            >
              Compartir Invitación
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {cards.map((c) => {
            const Icon = c.icon
            return (
              <div key={c.title} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <Icon className={`w-6 h-6 mx-auto mb-2 ${c.color}`} />
                <div className="text-2xl font-bold">{c.value}</div>
                <div className="text-xs text-zinc-400 mt-1">{c.title}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Sections */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((s) => {
            const Icon = s.icon
            return (
              <Link
                key={s.href}
                href={s.href}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D6A83A]/50 transition-colors group"
              >
                <Icon className="w-8 h-8 text-[#D6A83A] mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg">{s.label}</h3>
                <p className="text-sm text-zinc-400 mt-1">{s.desc}</p>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

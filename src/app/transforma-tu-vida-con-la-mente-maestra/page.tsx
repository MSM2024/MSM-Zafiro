'use client'

import { useRef } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { trackMMEvent } from "@/lib/mente-maestra/analytics"
import Hero from "@/components/mente-maestra/Hero"
import Benefits from "@/components/mente-maestra/Benefits"
import Modules from "@/components/mente-maestra/Modules"
import Author from "@/components/mente-maestra/Author"
import FAQ from "@/components/mente-maestra/FAQ"
import LeadForm from "@/components/mente-maestra/LeadForm"
import FinalCTA from "@/components/mente-maestra/FinalCTA"

export default function MenteMaestraPage() {
  usePageTitle("Transforma tu vida con La Mente Maestra — MSM Editorial")
  const leadFormRef = useRef<HTMLDivElement>(null)

  const scrollToForm = () => {
    trackMMEvent('cta_click')
    leadFormRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>
      </div>
      <Hero onCtaClick={scrollToForm} />
      <Benefits />
      <Modules />
      <section className="py-20 px-4" ref={leadFormRef}>
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2">RESERVA TU ACCESO</h2>
            <p className="text-slate-400 text-sm">Sé de los primeros en conocer el lanzamiento de La Mente Maestra.</p>
          </div>
          <LeadForm />
        </div>
      </section>
      <Author />
      <FAQ />
      <FinalCTA onCtaClick={scrollToForm} />
      <footer className="py-8 px-4 text-center">
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} MSM MY STORE LLC. La Mente Maestra es un programa del ecosistema ZAFIRO.</p>
      </footer>
    </div>
  )
}

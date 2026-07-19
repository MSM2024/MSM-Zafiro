'use client'

import { motion } from "motion/react"
import { ArrowRight, Gem } from "lucide-react"
import { MENTE_MAESTRA } from "@/lib/mente-maestra/config"
import { trackMMEvent } from "@/lib/mente-maestra/analytics"

interface Props {
  onCtaClick: () => void
}

export default function FinalCTA({ onCtaClick }: Props) {
  const hasCheckout = !!MENTE_MAESTRA.checkoutUrl
  const ctaText = hasCheckout ? MENTE_MAESTRA.ctaPrimary : MENTE_MAESTRA.waitlistText

  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 md:p-12 rounded-2xl glass glow-cyan text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00D9FF] via-violet-500 to-[#00D9FF]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#00D9FF]/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <Gem className="w-12 h-12 text-[#00D9FF] mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              ¿LISTO PARA COMENZAR?
            </h2>
            <p className="text-slate-300 mb-4 max-w-lg mx-auto">
              Tu transformación comienza con una decisión y continúa con acciones constantes.
            </p>
            <div className="mb-6 p-4 rounded-xl bg-slate-900/40 border border-slate-700/50">
              <h3 className="text-sm font-bold text-white mb-2">{MENTE_MAESTRA.membershipTitle}</h3>
              <ul className="text-xs text-slate-400 space-y-1 text-left max-w-xs mx-auto">
                {MENTE_MAESTRA.membershipIncludes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#00D9FF] mt-1.5 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <p className="text-lg font-bold text-[#00D9FF] mt-3">{MENTE_MAESTRA.priceLabel}</p>
            </div>
            <button
              onClick={() => { trackMMEvent('final_cta_click'); onCtaClick() }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00D9FF] to-blue-600 text-white font-bold rounded-xl text-lg hover:shadow-lg hover:shadow-[#00D9FF]/25 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {ctaText} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

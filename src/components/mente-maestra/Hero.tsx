'use client'

import { motion } from "motion/react"
import { MENTE_MAESTRA } from "@/lib/mente-maestra/config"
import { trackMMEvent } from "@/lib/mente-maestra/analytics"

interface Props {
  onCtaClick: () => void
}

export default function MenteMaestraHero({ onCtaClick }: Props) {
  const hasCheckout = !!MENTE_MAESTRA.checkoutUrl
  const ctaText = hasCheckout ? MENTE_MAESTRA.ctaPrimary : MENTE_MAESTRA.waitlistText

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-[#00D9FF]/5 via-transparent to-[#050816] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00D9FF]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#00D9FF] to-violet-600 flex items-center justify-center shadow-lg shadow-[#00D9FF]/20">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            {MENTE_MAESTRA.heroTitle.split('\n').map((line, i) => (
              <span key={i}>{i > 0 && <br />}{line}</span>
            ))}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-4 leading-relaxed">
            {MENTE_MAESTRA.heroSubtitle}
          </p>
          <p className="text-sm text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
            {MENTE_MAESTRA.heroSupport}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => { trackMMEvent('hero_cta_click'); onCtaClick() }}
              className="px-8 py-4 bg-gradient-to-r from-[#00D9FF] to-blue-600 text-white font-bold rounded-xl text-lg hover:shadow-lg hover:shadow-[#00D9FF]/25 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {ctaText}
            </button>
            <a
              href="#programa"
              onClick={() => trackMMEvent('hero_secondary_click')}
              className="px-8 py-4 border border-slate-700 text-slate-300 font-semibold rounded-xl hover:border-[#00D9FF]/30 hover:text-white transition-all duration-300"
            >
              {MENTE_MAESTRA.ctaSecondary}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

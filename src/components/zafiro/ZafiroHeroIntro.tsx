'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import ElianaDiamond from '@/components/ElianaDiamond'
import ElianaHeroGuide from './ElianaHeroGuide'
import HolographicBackground from './HolographicBackground'
import FloatingCodePanels from './FloatingCodePanels'

interface Props {
  onEnter?: () => void
  onExplore?: () => void
}

const TAGLINE = 'ZAFIRO NO ES UNA OPCIÓN'
const SUBTAGLINE = 'ZAFIRO ES EL DESTINO'

export default function ZafiroHeroIntro({ onEnter, onExplore }: Props) {
  const [mounted, setMounted] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setMounted(true)
  }, [])

  if (!mounted) return <div className="min-h-screen" style={{ backgroundColor: '#050816' }} />

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4" style={{ backgroundColor: '#050816' }}>
      <HolographicBackground density={reduced.current ? 'low' : 'medium'} scanLine={!reduced.current} />
      <FloatingCodePanels count={reduced.current ? 2 : 5} reduced={reduced.current} />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-20 w-full max-w-6xl mx-auto">
        <ElianaHeroGuide className="flex-shrink-0" />

        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="mb-4 sm:mb-6 md:mb-8"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute" style={{
                background: 'radial-gradient(circle, rgba(0,217,255,0.12) 0%, transparent 70%)',
                transform: 'scale(2.5)',
                width: 140,
                height: 140,
              }} />
              <ElianaDiamond size={reduced.current ? 96 : 140} variant="animated" />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-[10px] sm:text-xs md:text-sm font-mono tracking-[0.3em] sm:tracking-[0.4em] mb-3 sm:mb-4"
            style={{ color: '#22D3EE60' }}
          >
            UNIVERSO DIGITAL SOBERANO
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
          >
            <span style={{
              color: 'transparent',
              backgroundImage: 'linear-gradient(135deg, #22D3EE 0%, #7C3AED 40%, #C084FC 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
            }}>
              {TAGLINE}
            </span>
            <br />
            <span className="text-white">{SUBTAGLINE}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center md:items-start gap-3 sm:gap-4 mt-8 sm:mt-10"
          >
            <button
              onClick={onEnter}
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl font-bold text-sm overflow-hidden transition-all active:scale-[0.97]"
              style={{
                background: 'linear-gradient(135deg, #22D3EE 0%, #7C3AED 100%)',
                color: '#fff',
                boxShadow: '0 4px 24px rgba(0,217,255,0.2)',
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                ENTRAR A MI UNIVERSO
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #22D3EE 100%)',
              }} />
            </button>

            <button
              onClick={onExplore}
              className="relative w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl border text-sm font-medium transition-all hover:bg-white/5 active:scale-[0.97]"
              style={{ borderColor: '#22D3EE30', color: '#22D3EE' }}
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                EXPLORAR
              </span>
            </button>
          </motion.div>
        </div>
      </div>

      {!reduced.current && (
        <motion.div
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 2 }}
        >
          <div className="w-5 h-8 rounded-full border border-[#22D3EE20] flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-[#22D3EE40]" style={{
              animation: 'pulse-glow 1.5s ease-in-out infinite',
            }} />
          </div>
        </motion.div>
      )}
    </div>
  )
}

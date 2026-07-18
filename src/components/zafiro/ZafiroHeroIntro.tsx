'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Sparkles } from 'lucide-react'
import ElianaDiamond from '@/components/ElianaDiamond'
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
  const [reduced, setReduced] = useState(false)
  const prefersReduced = useRef(false)

  useEffect(() => {
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(prefersReduced.current)
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: '#050816' }}>
      <HolographicBackground density={reduced ? 'low' : 'medium'} scanLine={!reduced} />
      <FloatingCodePanels count={reduced ? 2 : 5} reduced={reduced} />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="relative z-10 mb-8"
      >
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle, rgba(0,217,255,0.12) 0%, transparent 70%)',
          transform: 'scale(2.5)',
        }} />
        <ElianaDiamond size={reduced ? 96 : 140} variant="animated" />
      </motion.div>

      <div className="relative z-10 text-center px-4">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-xs md:text-sm font-mono tracking-[0.4em] mb-4"
          style={{ color: '#22D3EE60' }}
        >
          UNIVERSO DIGITAL SOBERANO
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="text-2xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
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
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <button
            onClick={onEnter}
            className="group relative px-8 py-3 rounded-xl font-semibold text-sm overflow-hidden transition-all active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #22D3EE 0%, #7C3AED 100%)',
              color: '#fff',
              boxShadow: '0 4px 24px rgba(0,217,255,0.2)',
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              ENTRAR A MI UNIVERSO
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #22D3EE 100%)',
            }} />
          </button>

          <button
            onClick={onExplore}
            className="px-8 py-3 rounded-xl border text-sm font-medium transition-all hover:bg-white/5 active:scale-[0.97]"
            style={{ borderColor: '#22D3EE30', color: '#22D3EE' }}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              EXPLORAR
            </span>
          </button>
        </motion.div>
      </div>

      {!reduced && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
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

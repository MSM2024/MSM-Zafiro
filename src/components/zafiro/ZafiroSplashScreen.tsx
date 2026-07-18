'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import ElianaDiamond from '@/components/ElianaDiamond'
import HolographicBackground from './HolographicBackground'
import FloatingCodePanels from './FloatingCodePanels'

interface Props {
  onComplete: () => void
  minDuration?: number
  maxDuration?: number
}

export default function ZafiroSplashScreen({ onComplete, minDuration = 2000, maxDuration = 4000 }: Props) {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter')
  const [showSubtext, setShowSubtext] = useState(false)
  const [showBranding, setShowBranding] = useState(false)
  const [reduced, setReduced] = useState(false)
  const completedRef = useRef(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const finish = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    setPhase('exit')
    setTimeout(onComplete, 600)
  }, [onComplete])

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase('show'), 100)
    const subTimer = setTimeout(() => setShowSubtext(true), 600)
    const brandTimer = setTimeout(() => setShowBranding(true), 1400)
    const autoTimer = setTimeout(finish, minDuration + Math.random() * (maxDuration - minDuration))

    return () => {
      clearTimeout(enterTimer)
      clearTimeout(subTimer)
      clearTimeout(brandTimer)
      clearTimeout(autoTimer)
    }
  }, [finish, minDuration, maxDuration])

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundColor: '#050816' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6 }}
          onClick={finish}
        >
          <HolographicBackground density={reduced ? 'low' : 'medium'} scanLine={!reduced} />
          <FloatingCodePanels count={reduced ? 2 : 4} reduced={reduced} />

          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={
              phase === 'enter'
                ? { scale: 0.8, opacity: 0.5, rotate: -10 }
                : { scale: 1, opacity: 1, rotate: 0 }
            }
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 mb-6"
          >
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(circle, rgba(0,217,255,0.15) 0%, transparent 70%)',
              transform: 'scale(2)',
            }} />
            <ElianaDiamond size={reduced ? 80 : 100} variant="animated" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative z-10 text-3xl md:text-5xl font-black tracking-widest"
            style={{
              color: 'transparent',
              backgroundImage: 'linear-gradient(135deg, #22D3EE 0%, #7C3AED 50%, #C084FC 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
            }}
          >
            ZAFIRO
          </motion.h1>

          <AnimatePresence>
            {showSubtext && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 text-xs md:text-sm mt-2 font-light tracking-[0.3em]"
                style={{ color: '#22D3EE80' }}
              >
                UNIVERSO DIGITAL SOBERANO
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showBranding && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 mt-8 flex items-center gap-3"
              >
                <span className="text-[8px] font-mono" style={{ color: '#7C3AED60' }}>✦ ELIANA</span>
                <span className="w-px h-3" style={{ backgroundColor: '#22D3EE30' }} />
                <span className="text-[8px] font-mono" style={{ color: '#22D3EE60' }}>MSM my store</span>
              </motion.div>
            )}
          </AnimatePresence>

          {!reduced && (
            <motion.div
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-6 h-6 border-2 border-transparent border-t-[#22D3EE] rounded-full animate-spin" style={{ borderTopColor: '#22D3EE40' }} />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

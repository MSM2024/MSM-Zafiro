'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'motion/react'
import Image from 'next/image'

interface Props {
  className?: string
}

export default function ElianaHeroGuide({ className = '' }: Props) {
  const [mounted, setMounted] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="relative w-40 h-56 sm:w-48 sm:h-64 md:w-56 md:h-72 lg:w-72 lg:h-96">
        {!reduced.current && (
          <>
            <motion.div
              className="absolute inset-0 rounded-[2rem]"
              style={{
                background: 'radial-gradient(ellipse at 50% 30%, rgba(0,217,255,0.15), rgba(124,58,237,0.08) 40%, transparent 70%)',
                filter: 'blur(20px)',
              }}
              animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
              className="absolute inset-0 rounded-[2rem]"
              style={{
                background: 'radial-gradient(ellipse at 50% 50%, rgba(255,215,0,0.06), transparent 60%)',
                filter: 'blur(30px)',
              }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 140" fill="none">
              <motion.circle
                cx="50" cy="70" r="55"
                stroke="#00D9FF" strokeWidth="0.3"
                strokeDasharray="4 6"
                opacity="0.15"
                animate={{ rotate: [0, 360] }}
                style={{ transformOrigin: '50% 50%' }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              />
              <motion.circle
                cx="50" cy="70" r="48"
                stroke="#8A2BE2" strokeWidth="0.2"
                strokeDasharray="2 8"
                opacity="0.12"
                animate={{ rotate: [360, 0] }}
                style={{ transformOrigin: '50% 50%' }}
                transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              />
            </svg>

            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="absolute w-px h-12"
                style={{
                  left: `${15 + i * 18}%`,
                  top: `${10 + (i % 3) * 15}%`,
                  background: `linear-gradient(to bottom, transparent, ${i % 2 === 0 ? '#00D9FF' : '#8A2BE2'}, transparent)`,
                  opacity: 0.15,
                }}
                animate={{ opacity: [0.05, 0.2, 0.05], scaleY: [1, 1.2, 1] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
              />
            ))}
          </>
        )}

        <motion.div
          className="relative z-10 w-full h-full"
          animate={reduced.current ? {} : { y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image
            src="/assets/eliana/eliana-holographic-guide.png"
            alt="ELIANA — Guía Inteligente"
            width={288}
            height={384}
            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,217,255,0.3)]"
            priority
            onError={(e) => {
              const target = e.currentTarget
              target.style.display = 'none'
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}

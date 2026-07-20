'use client'

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"

interface Props {
  onComplete: () => void
}

const MAX_SPLASH_MS = 3500
const EXIT_DURATION_MS = 600

export default function ZafiroSplashScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter")
  const [imgLoaded, setImgLoaded] = useState(false)
  const skipRef = useRef(false)
  const doneRef = useRef(false)

  const complete = () => {
    if (doneRef.current) return
    doneRef.current = true
    onComplete()
  }

  useEffect(() => {
    const enter = setTimeout(() => setPhase("visible"), 50)

    // Hard max timeout — always complete after MAX_SPLASH_MS
    const hardTimeout = setTimeout(() => {
      setPhase("exit")
      setTimeout(complete, EXIT_DURATION_MS)
    }, MAX_SPLASH_MS)

    return () => {
      clearTimeout(enter)
      clearTimeout(hardTimeout)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const skip = () => {
    if (skipRef.current) return
    skipRef.current = true
    setPhase("exit")
    setTimeout(complete, EXIT_DURATION_MS)
  }

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
          style={{ backgroundColor: '#000000' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onClick={skip}
        >
          {/* Background image or fallback */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.img
              src="/assets/zafiro/zafiro-splash-1080x1920.png"
              alt=""
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: imgLoaded ? 1 : 0 }}
              transition={{ duration: 0.6 }}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
            />

            {!imgLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ backgroundColor: '#000000' }}>
                {/* Static diamond fallback */}
                <svg viewBox="0 0 100 120" className="w-16 h-20 mb-4" style={{ filter: 'drop-shadow(0 0 30px rgba(0,217,255,0.3))' }}>
                  <polygon points="50,2 26,26 50,36" fill="#1a4b8c" opacity="0.9"/>
                  <polygon points="50,2 74,26 50,36" fill="#1e3a5f" opacity="0.85"/>
                  <polygon points="8,36 26,26 32,41 12,44" fill="#2563eb" opacity="0.8"/>
                  <polygon points="92,36 74,26 68,41 88,44" fill="#7c3aed" opacity="0.7"/>
                  <polygon points="12,44 32,41 50,44 68,41 88,44 92,40 92,48 88,51 68,49 50,51 32,49 12,51 8,48 8,40" fill="#6366f1" opacity="0.8"/>
                  <polygon points="12,48 32,49 50,108 50,118" fill="#2563eb" opacity="0.8"/>
                  <polygon points="88,48 68,49 50,108 50,118" fill="#7c3aed" opacity="0.75"/>
                  <polygon points="44,113 50,126 56,113 50,118" fill="#a855f7" opacity="0.8"/>
                </svg>
              </div>
            )}
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%)',
          }} />

          {/* Title */}
          {phase === "visible" && (
            <div className="absolute bottom-[15%] left-0 right-0 flex flex-col items-center z-10 px-6">
              <motion.h1
                className="text-3xl sm:text-5xl md:text-7xl font-black tracking-[0.12em] text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  color: '#FFFFFF',
                  textShadow: '0 0 30px rgba(0,255,255,0.2)',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                }}
              >
                ZAFIRO
              </motion.h1>

              <motion.p
                className="text-[9px] sm:text-xs tracking-[0.35em] text-center mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                UNIVERSO INFINITO EN TUS MANOS
              </motion.p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

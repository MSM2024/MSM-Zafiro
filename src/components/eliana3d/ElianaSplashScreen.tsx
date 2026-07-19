'use client'

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import ElianaPortrait from "./ElianaPortrait"

interface ElianaSplashScreenProps {
  onComplete: () => void
}

export default function ElianaSplashScreen({ onComplete }: ElianaSplashScreenProps) {
  const [phase, setPhase] = useState<"enter" | "show" | "exit">("enter")
  const [showEliana, setShowEliana] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showSub, setShowSub] = useState(false)
  const [showBrand, setShowBrand] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
  }, [])

  const skip = useCallback(() => {
    setPhase("exit")
    setTimeout(onComplete, 400)
  }, [onComplete])

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("show"), 100)
    const t2 = setTimeout(() => setShowEliana(true), 600)
    const t3 = setTimeout(() => setShowText(true), 1200)
    const t4 = setTimeout(() => setShowSub(true), 1800)
    const t5 = setTimeout(() => setShowBrand(true), 2400)
    const t6 = setTimeout(() => { setPhase("exit"); setTimeout(onComplete, 500) }, 3200 + Math.random() * 800)

    return () => { [t1, t2, t3, t4, t5, t6].forEach(clearTimeout) }
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050816] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onClick={skip}
        >
          {!reduced && (
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `radial-gradient(circle at 30% 40%, #00D9FF 0%, transparent 50%),
                                 radial-gradient(circle at 70% 60%, #7C3AED 0%, transparent 50%)`,
              }}
            />
          )}

          {!reduced && (
            <div className="absolute inset-0" style={{ perspective: "800px" }}>
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-0.5 rounded-full"
                  style={{
                    background: i % 3 === 0 ? "#00D9FF" : i % 3 === 1 ? "#7C3AED" : "#FBBF24",
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 0.6, 0],
                    y: [0, -30 - Math.random() * 40],
                    x: [0, (Math.random() - 0.5) * 20],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={phase === "show" ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <ElianaPortrait size={reduced ? 120 : 180} animated={!reduced} showAura={!reduced} reduced={reduced} />
          </motion.div>

          {!reduced && (
            <motion.div
              className="absolute w-32 h-32 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(0,217,255,0.08) 0%, transparent 70%)",
                filter: "blur(20px)",
                top: "38%",
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={showText ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-[#00D9FF] via-blue-300 to-[#7C3AED] bg-clip-text text-transparent">
                ZAFIRO
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="mt-2 text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase"
            initial={{ opacity: 0 }}
            animate={showSub ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            UNIVERSO DIGITAL SOBERANO
          </motion.p>

          <motion.p
            className="mt-6 text-[10px] font-mono text-slate-600"
            initial={{ opacity: 0 }}
            animate={showBrand ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            ELIANA · {reduced ? "" : "MSM my store"}
          </motion.p>

          {!reduced && (
            <motion.div
              className="absolute bottom-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-5 h-5 border-2 border-[#00D9FF]/30 border-t-[#00D9FF] rounded-full animate-spin" />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import ZafiroHeroIntro from "@/components/zafiro/ZafiroHeroIntro"
import ZafiroUniverse from "@/components/ZafiroUniverse"

export default function Home() {
  const [showIntro, setShowIntro] = useState(true)

  return (
    <div className="min-h-screen text-white relative" style={{ backgroundColor: '#050816' }}>
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="hero"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03, filter: 'blur(3px)' }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <ZafiroHeroIntro
              onEnter={() => setShowIntro(false)}
              onExplore={() => setShowIntro(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!showIntro && (
          <motion.div
            key="universe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <ZafiroUniverse />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

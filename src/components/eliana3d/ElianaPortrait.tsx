'use client'

import { motion } from "motion/react"
import Image from "next/image"

interface ElianaPortraitProps {
  size?: number
  animated?: boolean
  showAura?: boolean
  reduced?: boolean
  className?: string
}

export default function ElianaPortrait({ size = 200, animated = true, showAura = true, reduced = false, className = "" }: ElianaPortraitProps) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {showAura && !reduced && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 40%, rgba(0,217,255,0.12), rgba(124,58,237,0.06) 50%, transparent 70%)`,
          }}
          animate={animated ? { scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {!reduced && (
        <>
          <motion.div
            className="absolute rounded-full border border-[#00D9FF]/10"
            style={{ width: size * 1.2, height: size * 1.2 }}
            animate={animated ? { rotate: 360 } : {}}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute rounded-full border border-[#7C3AED]/10"
            style={{ width: size * 0.9, height: size * 0.9 }}
            animate={animated ? { rotate: -360 } : {}}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </>
      )}

      <motion.div
        className="relative z-10 overflow-hidden"
        style={{ width: size * 0.85, height: size * 0.85, borderRadius: size * 0.1 }}
        animate={animated ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/assets/eliana/eliana-face.svg"
          alt="ELIANA"
          width={size}
          height={size * 1.25}
          className="w-full h-full object-cover"
          priority
        />
      </motion.div>

      {showAura && !reduced && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-[#00D9FF]/20"
              style={{
                width: size * (0.6 + i * 0.25),
                height: size * (0.6 + i * 0.25),
              }}
              animate={animated ? { rotate: [i * 120, i * 120 + 360], scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 8 + i * 4, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </>
      )}

      {!reduced && (
        <>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 rounded-full bg-[#00D9FF]"
              style={{
                left: `${30 + i * 30}%`,
                top: `${10 + i * 25}%`,
              }}
              animate={animated ? {
                y: [0, -8, 0],
                opacity: [0, 0.6, 0],
              } : {}}
              transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.7, ease: "easeInOut" }}
            />
          ))}
          {[0, 1].map((i) => (
            <motion.div
              key={`particle-r-${i}`}
              className="absolute w-1 h-1 rounded-full bg-[#7C3AED]"
              style={{
                right: `${20 + i * 35}%`,
                top: `${15 + i * 30}%`,
              }}
              animate={animated ? {
                y: [0, -6, 0],
                opacity: [0, 0.4, 0],
              } : {}}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
            />
          ))}
        </>
      )}
    </div>
  )
}

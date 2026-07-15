'use client'

import { motion } from "motion/react"
import { useEffect, useState } from "react"

type Props = {
  size?: number
  pulse?: boolean
}

const COLORS = ["#00D9FF", "#FF6B35", "#FFD700", "#7B68EE", "#00E676", "#FF4081", "#FFFFFF"]

export default function ElianaAvatar({ size = 120, pulse = true }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  const cx = size / 2
  const coreR = size * 0.12

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {COLORS.map((color, i) => (
        <motion.div
          key={color}
          className="absolute rounded-full border"
          style={{
            width: coreR * 2 + i * (size * 0.18),
            height: coreR * 2 + i * (size * 0.18),
            borderColor: color,
            opacity: 0.4,
          }}
          initial={{ scale: 0 }}
          animate={{
            scale: 1,
            rotate: 360,
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            scale: { duration: 0.5 },
            rotate: { duration: 8 + i * 2, repeat: Infinity, ease: "linear" },
            opacity: { duration: 3 + i, repeat: Infinity },
          }}
        />
      ))}
      <motion.div
        className="absolute rounded-full bg-[#00D9FF]"
        style={{
          width: coreR * 2,
          height: coreR * 2,
          boxShadow: "0 0 20px rgba(0,217,255,0.5)",
        }}
        animate={pulse ? { scale: [1, 1.15, 1] } : undefined}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}

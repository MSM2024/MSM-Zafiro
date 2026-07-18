'use client'

import { useEffect, useState, useRef, useMemo } from 'react'

interface Props {
  density?: 'low' | 'medium' | 'high'
  scanLine?: boolean
  glowColor?: string
  className?: string
}

const PARTICLE_COUNTS = { low: 15, medium: 30, high: 50 }

export default function HolographicBackground({ density = 'medium', scanLine = true, glowColor = '#00D9FF', className = '' }: Props) {
  const [mounted, setMounted] = useState(false)
  const prefersReduced = useRef(false)

  useEffect(() => {
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setMounted(true)
  }, [])

  const particles = useMemo(() => {
    const count = prefersReduced.current ? 8 : PARTICLE_COUNTS[density]
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      opacity: 0.1 + Math.random() * 0.4,
      duration: 4 + Math.random() * 8,
      delay: Math.random() * 5,
    }))
  }, [density])

  if (!mounted) return null

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${glowColor}08 0%, transparent 70%)`,
      }} />

      {!prefersReduced.current && particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            backgroundColor: glowColor,
            boxShadow: `0 0 ${p.size * 2}px ${glowColor}`,
            animation: `drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {scanLine && !prefersReduced.current && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-px" style={{
            background: `linear-gradient(90deg, transparent, ${glowColor}40, transparent)`,
            animation: 'scan-line 4s ease-in-out infinite',
          }} />
        </div>
      )}

      <div className="absolute inset-0" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, ${glowColor}08 1px, transparent 0)`,
        backgroundSize: '60px 60px',
      }} />
    </div>
  )
}

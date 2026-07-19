'use client'

import { useEffect, useRef, useState } from "react"

interface ElianaHologramBetaProps {
  width?: number
  height?: number
  className?: string
}

export default function ElianaHologramBeta({ width = 300, height = 300, className = "" }: ElianaHologramBetaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [supported, setSupported] = useState(true)
  const animRef = useRef<number>(0)
  const particlesRef = useRef<{ x: number; y: number; z: number; speed: number; size: number; alpha: number }[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) { setSupported(false); return }
    const ctx = canvas.getContext("2d")
    if (!ctx) { setSupported(false); return }

    const count = 60
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 200,
      speed: 0.2 + Math.random() * 0.6,
      size: 0.5 + Math.random() * 2,
      alpha: 0.1 + Math.random() * 0.4,
    }))

    let time = 0

    const animate = () => {
      time += 0.005
      ctx.clearRect(0, 0, width, height)

      // Draw outer ring
      ctx.beginPath()
      ctx.arc(width / 2, height / 2, 70, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(0, 217, 255, ${0.08 + Math.sin(time) * 0.04})`
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw middle ring
      ctx.beginPath()
      ctx.arc(width / 2, height / 2, 55, time, time + Math.PI * 1.5)
      ctx.strokeStyle = `rgba(124, 58, 237, ${0.1 + Math.sin(time * 1.3) * 0.05})`
      ctx.lineWidth = 0.8
      ctx.stroke()

      // Draw inner ring
      ctx.beginPath()
      ctx.arc(width / 2, height / 2, 40, -time * 1.5, -time * 1.5 + Math.PI * 1.2)
      ctx.strokeStyle = `rgba(0, 217, 255, ${0.12 + Math.sin(time * 0.7) * 0.06})`
      ctx.lineWidth = 0.6
      ctx.stroke()

      // Diamond glow
      const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, 25)
      gradient.addColorStop(0, `rgba(0, 217, 255, ${0.15 + Math.sin(time * 2) * 0.08})`)
      gradient.addColorStop(0.5, `rgba(0, 217, 255, ${0.05 + Math.sin(time * 2) * 0.03})`)
      gradient.addColorStop(1, "rgba(0, 217, 255, 0)")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(width / 2, height / 2, 25, 0, Math.PI * 2)
      ctx.fill()

      // Particles
      particlesRef.current.forEach((p, i) => {
        p.y -= p.speed
        p.x += Math.sin(time * 2 + i) * 0.3
        const scale = 1 + p.z / 200
        const alpha = p.alpha * (0.3 + Math.sin(time * 3 + i * 0.5) * 0.7)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * scale, 0, Math.PI * 2)
        ctx.fillStyle = i % 3 === 0
          ? `rgba(0, 217, 255, ${alpha})`
          : i % 3 === 1
            ? `rgba(124, 58, 237, ${alpha})`
            : `rgba(251, 191, 36, ${alpha})`
        ctx.fill()

        // Reset
        if (p.y < -5) {
          p.y = height + 5
          p.x = Math.random() * width
        }
      })

      animRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animRef.current)
  }, [width, height])

  if (!supported) return null

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    />
  )
}

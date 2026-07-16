'use client'

import { useEffect, useRef } from "react"

interface Particle {
  x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number; maxLife: number
}

export default function GenesisChamberBackground({ intensity = 1 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
    const particles: Particle[] = []
    const MAX = Math.floor(60 * intensity)

    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    window.addEventListener("resize", resize)

    for (let i = 0; i < MAX; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        life: 0, maxLife: Math.random() * 200 + 100,
      })
    }

    let animId: number
    const animate = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.life++
        if (p.x < 0 || p.x > w || p.y < 0 || p.y > h || p.life > p.maxLife) {
          p.x = Math.random() * w; p.y = Math.random() * h
          p.life = 0; p.maxLife = Math.random() * 200 + 100
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 217, 255, ${p.alpha * (1 - p.life / p.maxLife)})`
        ctx.fill()
      }
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  }, [intensity])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.6 }} />
}

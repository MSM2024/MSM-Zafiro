'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'motion/react'
import ElianaDiamond from './ElianaDiamond'

const STORAGE_KEY = 'zafiro_eliana_flotante'
const DRAG_THRESHOLD = 5

interface Position {
  x: number
  y: number
}

function loadPosition(): Position {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const p = JSON.parse(raw)
      if (typeof p.x === 'number' && typeof p.y === 'number') return p
    }
  } catch { /* silent */ }
  return { x: typeof window !== 'undefined' ? window.innerWidth - 100 : 700, y: typeof window !== 'undefined' ? window.innerHeight - 200 : 500 }
}

function clampPosition(p: Position): Position {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1200
  const h = typeof window !== 'undefined' ? window.innerHeight : 800
  const size = 60
  return {
    x: Math.max(0, Math.min(w - size, p.x)),
    y: Math.max(0, Math.min(h - size - 80, p.y)),
  }
}

export default function HoloCompanion() {
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [hidden, setHidden] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, startElX: 0, startElY: 0, moved: false })
  const elRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const p = clampPosition(loadPosition())
    setPosition(p)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(position))
  }, [position, mounted])

  useEffect(() => {
    if (!mounted) return
    const handleResize = () => setPosition(prev => clampPosition(prev))
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mounted])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startElX: position.x,
      startElY: position.y,
      moved: false,
    }
    setDragging(true)
    const el = elRef.current
    if (el) el.setPointerCapture(e.pointerId)
  }, [position])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      dragRef.current.moved = true
    }
    setPosition(prev => clampPosition({
      x: dragRef.current.startElX + dx,
      y: dragRef.current.startElY + dy,
    }))
  }, [dragging])

  const handlePointerUp = useCallback(() => {
    const wasDrag = dragRef.current.moved
    setDragging(false)
    if (!wasDrag) {
      window.dispatchEvent(new CustomEvent('eliana:open'))
    }
  }, [])

  const handleDoubleClick = useCallback(() => {
    setHidden(true)
  }, [])

  if (!mounted || hidden) return null

  return (
    <div
      ref={elRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      className="fixed z-[9998] select-none touch-none"
      style={{
        left: position.x,
        top: position.y,
        cursor: dragging ? 'grabbing' : 'pointer',
      }}
    >
      <motion.div
        className="relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
      >
        <div className="w-14 h-14 rounded-2xl bg-[#050816]/80 backdrop-blur-lg border border-[#00D9FF]/30 shadow-[0_0_30px_rgba(0,217,255,0.25)] flex items-center justify-center group hover:scale-105 active:scale-95 transition-transform">
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00D9FF]/20 via-[#7c3aed]/10 to-transparent" />
          <span className="absolute inset-[-2px] rounded-2xl border border-[#00D9FF]/20 animate-ping opacity-20" />
          <span className="relative z-10 flex items-center justify-center">
            <ElianaDiamond size={28} variant="animated" />
          </span>
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-[#050816] z-20" />
        </div>
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-[8px] text-slate-500 bg-[#050816]/80 px-2 py-0.5 rounded-full border border-slate-800/60">
            ELIANA · Arrástrame o haz clic
          </span>
        </div>
      </motion.div>
    </div>
  )
}

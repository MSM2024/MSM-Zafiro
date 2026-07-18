'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'motion/react'
import { X, Bot, Cpu, Shield } from 'lucide-react'
import ElianaDiamond from './ElianaDiamond'

type CompanionType = 'eliana' | 'robot-369' | 'guardian-777'

interface StoredState {
  type: CompanionType
  x: number
  y: number
  visible: boolean
  collapsed: boolean
}

const COMPANION_CONFIG = {
  'eliana': { icon: 'diamond', label: 'ELIANA Mini', color: '#00D9FF', glow: 'rgba(0,217,255,0.3)' },
  'robot-369': { icon: 'robot', label: 'Robot 369', color: '#FF6B35', glow: 'rgba(255,107,53,0.3)' },
  'guardian-777': { icon: 'shield', label: 'Guardián 777', color: '#7B68EE', glow: 'rgba(123,104,238,0.3)' },
}

const STORAGE_KEY = 'zafiro_holo_companion'
const DEFAULT_POSITION = () => ({ x: typeof window !== 'undefined' ? window.innerWidth - 100 : 700, y: typeof window !== 'undefined' ? window.innerHeight - 200 : 500 })

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* silent */ }
  const def = DEFAULT_POSITION()
  return { type: 'eliana', x: def.x, y: def.y, visible: true, collapsed: false }
}

export default function HoloCompanion() {
  const [mounted, setMounted] = useState(false)
  const [state, setState] = useState<StoredState>(loadState)
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, startElX: 0, startElY: 0 })
  const elRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useRef(false)

  useEffect(() => {
    setMounted(true)
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const cycleType = useCallback(() => {
    setState(prev => {
      const types: CompanionType[] = ['eliana', 'robot-369', 'guardian-777']
      const idx = types.indexOf(prev.type)
      return { ...prev, type: types[(idx + 1) % types.length], collapsed: false }
    })
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (state.collapsed) return
    setDragging(true)
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startElX: state.x,
      startElY: state.y,
    }
    const el = elRef.current
    if (el) el.setPointerCapture(e.pointerId)
  }, [state.collapsed, state.x, state.y])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging || state.collapsed) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setState(prev => ({
      ...prev,
      x: Math.max(0, Math.min(window.innerWidth - 60, dragRef.current.startElX + dx)),
      y: Math.max(0, Math.min(window.innerHeight - 60, dragRef.current.startElY + dy)),
    }))
  }, [dragging, state.collapsed])

  const handlePointerUp = useCallback(() => {
    setDragging(false)
  }, [])

  const toggleCollapse = useCallback(() => {
    setState(prev => ({ ...prev, collapsed: !prev.collapsed }))
  }, [])

  const hide = useCallback(() => {
    setState(prev => ({ ...prev, visible: false }))
  }, [])

  if (!mounted) return null

  const config = COMPANION_CONFIG[state.type]

  return (
    <div
      ref={elRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="fixed z-[9998] select-none touch-none"
      style={{
        left: state.x,
        top: state.y,
        cursor: dragging ? 'grabbing' : 'grab',
      }}
    >
      {state.collapsed ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: `${config.color}15`,
            borderColor: `${config.color}30`,
            borderWidth: 1,
            boxShadow: `0 0 12px ${config.glow}`,
          }}
          onClick={toggleCollapse}
        >
          <Bot className="w-4 h-4" style={{ color: config.color }} />
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl overflow-hidden backdrop-blur-lg"
          style={{
            backgroundColor: '#0A0B1Ae0',
            borderColor: `${config.color}20`,
            borderWidth: 1,
            boxShadow: `0 4px 24px ${config.glow}`,
            width: 160,
          }}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/30">
            <span className="text-[9px] font-semibold" style={{ color: config.color }}>{config.label}</span>
            <div className="flex items-center gap-1">
              <button onClick={cycleType} className="p-0.5 rounded hover:bg-slate-700/50 transition-colors">
                <Cpu className="w-2.5 h-2.5 text-slate-500" />
              </button>
              <button onClick={toggleCollapse} className="p-0.5 rounded hover:bg-slate-700/50 transition-colors">
                <Shield className="w-2.5 h-2.5 text-slate-500" />
              </button>
              <button onClick={hide} className="p-0.5 rounded hover:bg-slate-700/50 transition-colors">
                <X className="w-2.5 h-2.5 text-slate-500" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center py-3" style={{ minHeight: 80 }}>
            {state.type === 'eliana' && <ElianaDiamond size={48} variant="animated" />}
            {state.type === 'robot-369' && (
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: `${config.color}20`, color: config.color }}
                  animate={!prefersReduced.current ? { rotate: [0, 360] } : undefined}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                >
                  369
                </motion.div>
                <span className="text-[8px] text-slate-500">Frecuencia Maestra</span>
              </div>
            )}
            {state.type === 'guardian-777' && (
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${config.color}20` }}
                  animate={!prefersReduced.current ? { scale: [1, 1.1, 1] } : undefined}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Shield className="w-4 h-4" style={{ color: config.color }} />
                </motion.div>
                <span className="text-[8px] text-slate-500">Protección Activa</span>
              </div>
            )}
          </div>
          <div className="px-3 pb-2">
            <p className="text-[8px] text-slate-600 text-center">
              Arrástrame — {state.type === 'eliana' ? 'Núcleo sintético' : state.type === 'robot-369' ? 'Frecuencia 369' : 'Guardián 777'}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

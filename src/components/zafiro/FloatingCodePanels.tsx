'use client'

import { useEffect, useState, useMemo } from 'react'

interface PanelData {
  id: number
  x: number
  y: number
  lines: string[]
  width: number
  delay: number
  duration: number
  opacity: number
}

const CODE_SNIPPETS = [
  ['const zafiro = new Universe()', 'zafiro.frequency = 369', 'zafiro.activate()'],
  ['import { Sovereignty } from "@zafiro/core"', 'Sovereignty.declare()', '// ∞ Digital Sovereign'],
  ['@369:777', 'fn main() {', '  eliana.engage()', '}'],
  ['<Identity>', '  <Soul boundTo="eternal" />', '  <Legacy generations={50} />', '</Identity>'],
  ['ZAFIRO.protect(() => {', '  user.session = "sovereign"', '  return access.unlimited', '})'],
  ['╔══ ZAFIRO OS ══╗', '║  NODE: ACTIVE ║', '║  FREQ: 369   ║', '╚═══════════════╝'],
  ['{ "universe": "zafiro",', '  "status": "immortal",', '  "legacy": "50 generations" }'],
]

export default function FloatingCodePanels({ count = 4, reduced = false }: { count?: number; reduced?: boolean }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const panels = useMemo(() => {
    const actualCount = reduced ? 2 : count
    const shuffled = [...CODE_SNIPPETS].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, actualCount).map((lines, i) => ({
      id: i,
      x: 5 + Math.random() * 70,
      y: 10 + Math.random() * 60,
      lines,
      width: 120 + Math.random() * 80,
      delay: i * 1.5 + Math.random() * 2,
      duration: 6 + Math.random() * 6,
      opacity: 0.15 + Math.random() * 0.25,
    }))
  }, [count, reduced])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {panels.map(p => (
        <div
          key={p.id}
          className="absolute rounded-lg border font-mono"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.width,
            opacity: p.opacity,
            borderColor: '#22D3EE20',
            backgroundColor: '#0B102680',
            backdropFilter: 'blur(4px)',
            padding: '8px 10px',
            animation: reduced ? 'none' : `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        >
          {p.lines.map((line, j) => (
            <div key={j} className="text-[7px] leading-relaxed whitespace-nowrap" style={{ color: j === p.lines.length - 1 ? '#7C3AED' : '#22D3EE' }}>
              {line.includes('//') ? (
                <><span style={{ color: '#22D3EE60' }}>{line.split('//')[0]}</span><span style={{ color: '#C084FC60' }}>//{line.split('//')[1]}</span></>
              ) : line}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

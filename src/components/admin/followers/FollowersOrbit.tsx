'use client'

import { useRef, useEffect, useState } from "react"
import { motion } from "motion/react"
import { Diamond } from "lucide-react"
import type { SocialMetricSnapshot, Platform } from "@/lib/followers/types"
import { PLATFORMS } from "@/lib/followers/types"

interface Props {
  platforms: SocialMetricSnapshot[]
  totalFollowers: number
  totalVerified: number
  onSelectPlatform?: (platform: Platform) => void
  reduced?: boolean
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

export default function FollowersOrbit({ platforms, totalFollowers, totalVerified, onSelectPlatform, reduced }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [orbitRadius, setOrbitRadius] = useState(180)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const updateSize = () => {
      const w = containerRef.current?.offsetWidth || 600
      setOrbitRadius(Math.min(w * 0.35, 220))
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  const connectedPlatforms = platforms.filter(p => p.label !== 'NO CONECTADO')
  const orbitCount = connectedPlatforms.length || 8

  if (!mounted) return null

  return (
    <div ref={containerRef} className="relative w-full aspect-square max-w-[600px] mx-auto">
      {/* Anillos de energía exteriores */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-[8%] rounded-full border border-[#00D9FF]/10" />
        {!reduced && (
          <>
            <div className="absolute inset-[12%] rounded-full border border-violet-500/8 animate-[spin_20s_linear_infinite]" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-[4%] rounded-full border border-[#00D9FF]/8 animate-[spin_30s_linear_infinite]" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
            <motion.div
              className="absolute inset-[6%] rounded-full"
              style={{ background: 'conic-gradient(from 0deg, transparent, rgba(0,217,255,0.05), transparent, rgba(128,0,255,0.05), transparent)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />
          </>
        )}
      </div>

      {/* Esfera central */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Resplandor central */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/10 via-violet-500/10 to-[#00D9FF]/10 rounded-full blur-2xl" />

          {/* Diamante ZAFIRO */}
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#0A1628] to-[#0D1F3C] border border-[#00D9FF]/20 flex flex-col items-center justify-center shadow-xl shadow-black/50">
            {!reduced && (
              <motion.div
                className="absolute inset-1 rounded-full border border-[#00D9FF]/10"
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            )}
            <Diamond className="w-6 h-6 md:w-8 md:h-8 text-[#00D9FF]" />
            <p className="text-xs text-slate-500 mt-1">TOTAL</p>
            <p className="text-lg md:text-xl font-black text-white -mt-0.5">{formatCount(totalFollowers)}</p>
            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">VERIFICADO</span>
          </div>
        </div>
      </div>

      {/* Nodos orbitantes */}
      {connectedPlatforms.map((metric, i) => {
        const angle = (i / orbitCount) * 360
        const rad = (angle * Math.PI) / 180
        const x = Math.cos(rad) * orbitRadius
        const y = Math.sin(rad) * orbitRadius
        const platformInfo = PLATFORMS.find(p => p.id === metric.platform)
        if (!platformInfo) return null

        return (
          <motion.button
            key={metric.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.15 }}
            onClick={() => onSelectPlatform?.(metric.platform)}
            className="absolute flex flex-col items-center cursor-pointer group"
            style={{
              left: `calc(50% + ${x}px - 28px)`,
              top: `calc(50% + ${y}px - 28px)`,
            }}
          >
            {/* Nodo */}
            <div
              className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg transition-transform group-hover:shadow-xl"
              style={{ backgroundColor: platformInfo.color + '25', borderColor: platformInfo.color + '40', borderWidth: 1 }}
            >
              <span style={{ color: platformInfo.color }} className="text-sm font-black">{platformInfo.label.slice(0, 2).toUpperCase()}</span>
            </div>
            <p className="text-[9px] text-slate-400 mt-1 whitespace-nowrap">{platformInfo.label}</p>
            <p className="text-[10px] font-bold text-white -mt-0.5">{formatCount(metric.followerCount)}</p>

            {/* Partícula de conexión */}
            {!reduced && (
              <motion.div
                className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full pointer-events-none"
                style={{ backgroundColor: platformInfo.color }}
                animate={{
                  x: [0, -x * 0.5, 0],
                  y: [0, -y * 0.5, 0],
                  opacity: [0, 0.4, 0],
                }}
                transition={{ duration: 2 + Math.random(), delay: i * 0.3, repeat: Infinity }}
              />
            )}
          </motion.button>
        )
      })}

      {/* Nodos para plataformas desconectadas (en órbita exterior, atenuadas) */}
      {platforms.filter(p => p.label === 'NO CONECTADO').map((metric, i) => {
        const offset = connectedPlatforms.length
        const angle = ((i + offset) / orbitCount) * 360
        const rad = (angle * Math.PI) / 180
        const x = Math.cos(rad) * (orbitRadius + 30)
        const y = Math.sin(rad) * (orbitRadius + 30)
        const platformInfo = PLATFORMS.find(p => p.id === metric.platform)
        if (!platformInfo) return null

        return (
          <div key={metric.id} className="absolute flex flex-col items-center opacity-40"
            style={{ left: `calc(50% + ${x}px - 20px)`, top: `calc(50% + ${y}px - 20px)` }}>
            <div className="w-9 h-9 rounded-lg bg-slate-800/60 flex items-center justify-center text-[9px] text-slate-600 font-bold">
              {platformInfo.label.slice(0, 2).toUpperCase()}
            </div>
            <p className="text-[8px] text-slate-700 mt-1">{platformInfo.label}</p>
            <p className="text-[8px] text-slate-700">SIN DATOS</p>
          </div>
        )
      })}
    </div>
  )
}

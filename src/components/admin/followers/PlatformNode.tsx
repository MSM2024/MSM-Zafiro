'use client'

import { motion } from "motion/react"
import type { SocialMetricSnapshot, Platform } from "@/lib/followers/types"
import { PLATFORMS } from "@/lib/followers/types"

interface Props {
  metric: SocialMetricSnapshot
  onClick?: () => void
  active?: boolean
}

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

const PLATFORM_ICONS: Record<Platform, string> = {
  facebook: 'fb',
  instagram: 'ig',
  tiktok: 'tt',
  youtube: 'yt',
  x: 'x',
  telegram: 'tg',
  whatsapp_community: 'wa',
  zafiro: 'zf',
  editorial: 'ed',
  marketplace: 'mp',
}

export default function PlatformNode({ metric, onClick, active }: Props) {
  const platform = PLATFORMS.find(p => p.id === metric.platform)
  if (!platform) return null

  const iconLabel = PLATFORM_ICONS[metric.platform]
  const isConnected = metric.label !== 'NO CONECTADO'

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative p-4 rounded-2xl text-left transition-all ${
        active ? 'border-[#00D9FF]/40 bg-[#00D9FF]/5' : 'border-slate-800/60 bg-slate-900/40'
      } border hover:border-slate-700/60`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
          style={{ backgroundColor: platform.color + '30', color: platform.color }}
        >
          {iconLabel}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{platform.label}</p>
          <span className={`text-[10px] ${isConnected ? 'text-emerald-400' : 'text-slate-500'}`}>
            {isConnected ? 'CONECTADO' : 'NO CONECTADO'}
          </span>
        </div>
        {metric.verified && (
          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">DATO VERIFICADO</span>
        )}
        {metric.source === 'estimated' && (
          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400">ESTIMACIÓN</span>
        )}
      </div>

      {isConnected ? (
        <>
          <p className="text-xl font-black text-white">{formatCount(metric.followerCount)}</p>
          <p className="text-[10px] text-slate-500">
            Alcance: {formatCount(metric.reach)} · Interacciones: {formatCount(metric.engagements)}
          </p>
          <p className="text-[8px] text-slate-600 mt-1">
            {metric.capturedAt ? new Date(metric.capturedAt).toLocaleDateString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '—'}
          </p>
        </>
      ) : (
        <div className="py-3 text-center">
          <p className="text-xs text-slate-600">Plataforma no conectada</p>
          <p className="text-[10px] text-slate-700 mt-0.5">Conecta para ver datos</p>
        </div>
      )}
    </motion.button>
  )
}

'use client'

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { getUserBadges, getBadgeDefinition, getTierColor, BADGE_DEFINITIONS, type BadgeDefinition, type UserBadge } from "@/lib/badges"
import { Award, Sparkles } from "lucide-react"

export function BadgesDisplay({ max = 12 }: { max?: number }) {
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [allDefs] = useState(BADGE_DEFINITIONS)

  useEffect(() => {
    setBadges(getUserBadges())
  }, [])

  const earnedSet = new Set(badges.map(b => b.badgeId))

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Award className="w-4 h-4 text-amber-400" />
        <h3 className="text-xs font-bold text-white">Insignias</h3>
        <span className="text-[9px] text-slate-500">({badges.length}/{allDefs.length})</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {allDefs.slice(0, max).map(badge => {
          const earned = earnedSet.has(badge.id)
          return (
            <div key={badge.id} className="relative group">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border transition-all ${
                earned
                  ? "bg-slate-800/50 border-slate-700/50 cursor-pointer hover:border-amber-500/30"
                  : "bg-slate-900/30 border-slate-800/30 opacity-30 cursor-default"
              }`}>
                <span>{badge.icon}</span>
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                <p className="text-[9px] font-bold text-white">{badge.icon} {badge.name}</p>
                <p className="text-[8px] text-slate-400">{badge.description}</p>
                <span className={`text-[7px] px-1 rounded ${getTierColor(badge.tier)}`}>{badge.tier}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function NewBadgesAlert({ newBadges }: { newBadges: BadgeDefinition[] }) {
  if (newBadges.length === 0) return null
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-[9999] p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 shadow-2xl max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <p className="text-sm font-bold text-white">Nuevas insignias</p>
      </div>
      {newBadges.map(b => (
        <div key={b.id} className="flex items-center gap-2 py-1">
          <span className="text-lg">{b.icon}</span>
          <div>
            <p className="text-xs font-medium text-white">{b.name}</p>
            <p className="text-[9px] text-slate-400">{b.description}</p>
          </div>
        </div>
      ))}
    </motion.div>
  )
}

'use client'

import { motion } from 'motion/react'
import { Bookmark, BookOpen, CheckCircle, Star } from 'lucide-react'
import type { UserSealProgress } from '@/lib/seals-data'

export default function SealVisualGrid({
  total = 150,
  progress,
  favorites,
  onSelect,
}: {
  total?: number
  progress: UserSealProgress[]
  favorites: number[]
  onSelect: (n: number) => void
}) {
  const getSealStatus = (num: number): 'unread' | 'reading' | 'completed' => {
    const p = progress.find(x => x.sealId === num)
    return p ? p.status : 'unread'
  }

  return (
    <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-15 gap-1.5">
      {Array.from({ length: total }, (_, i) => i + 1).map(num => {
        const status = getSealStatus(num)
        const isFav = favorites.includes(num)
        let border = 'border-zinc-700/40 bg-zinc-900/40'
        if (status === 'completed') border = 'border-amber-500/60 bg-amber-500/10'
        else if (status === 'reading') border = 'border-[#00D9FF]/60 bg-[#00D9FF]/10'
        else if (isFav) border = 'border-pink-400/60 bg-pink-400/10'
        return (
          <motion.button
            key={num}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(num)}
            className={`relative flex items-center justify-center w-full aspect-square rounded-lg text-xs font-mono border transition-colors ${border}`}
          >
            {isFav && (
              <Star className="absolute -top-1 -right-1 w-2.5 h-2.5 text-pink-400" />
            )}
            {status === 'completed' && (
              <CheckCircle className="absolute -top-1 -left-1 w-2.5 h-2.5 text-amber-400" />
            )}
            <span className={status === 'completed' ? 'text-amber-300' : status === 'reading' ? 'text-[#00D9FF]' : 'text-zinc-500'}>
              {num}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

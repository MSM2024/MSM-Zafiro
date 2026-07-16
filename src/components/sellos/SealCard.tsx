'use client'

import { motion } from 'motion/react'
import { BookOpen, Star, ChevronRight } from 'lucide-react'
import type { Seal } from '@/lib/seals-data'

export default function SealCard({ seal, isFav, onToggleFav }: { seal: Seal; isFav: boolean; onToggleFav?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-[#00D9FF]/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[#00D9FF]" />
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-400">SELLO #{seal.numero}</div>
            <div className="text-xs text-zinc-500">{seal.referencia}</div>
          </div>
        </div>
        <button onClick={onToggleFav} className={`transition-colors ${isFav ? 'text-pink-400' : 'text-zinc-600 hover:text-pink-400'}`}>
          <Star className="w-5 h-5" fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <p className="text-sm italic text-zinc-300 mb-4 leading-relaxed border-l-2 border-[#00D9FF]/30 pl-4">
        &ldquo;{seal.versiculo}&rdquo;
      </p>

      <div className="text-xs px-3 py-1 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] w-fit mb-4">
        {seal.tema}
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">{seal.reflexion}</p>

      <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
        <span className="text-xs text-zinc-500">Sello #{seal.numero} de 150</span>
        <span className="text-[#00D9FF] text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          Leer <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </motion.div>
  )
}

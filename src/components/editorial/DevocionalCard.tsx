'use client'

import Link from "next/link"
import { BookOpen, Clock, Star } from "lucide-react"
import type { Devocional } from "@/lib/editorial/types"

export default function DevocionalCard({ devocional, compact }: { devocional: Devocional; compact?: boolean }) {
  const date = new Date(devocional.date).toLocaleDateString("es-ES", {
    day: "numeric", month: "long", year: "numeric",
  })

  return (
    <Link href={`/editorial/devocionales/${devocional.id}`}
      className="block p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 hover:border-[#00D9FF]/30 transition-all group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[9px] font-mono text-slate-500">{date}</span>
        </div>
        {devocional.featured && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
      </div>
      <h3 className={`font-bold text-white group-hover:text-[#00D9FF] transition-colors ${compact ? "text-xs" : "text-sm"}`}>
        {devocional.title}
      </h3>
      <p className="text-[9px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
        {devocional.content.slice(0, compact ? 80 : 120)}...
      </p>
      <div className="flex items-center gap-3 mt-2 text-[8px] text-slate-400">
        <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{devocional.readingTimeMinutes} min</span>
        <span className="text-amber-400/60">{devocional.verseRef}</span>
      </div>
    </Link>
  )
}

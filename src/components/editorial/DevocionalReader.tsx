'use client'

import { ArrowLeft, BookOpen, Clock, Share2 } from "lucide-react"
import Link from "next/link"
import type { Devocional } from "@/lib/editorial/types"

export default function DevocionalReader({ devocional }: { devocional: Devocional }) {
  const date = new Date(devocional.date).toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/editorial/devocionales"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Todos los Devocionales
        </Link>

        <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 mb-4">
          <BookOpen className="w-3 h-3 text-amber-400" />
          <span className="capitalize">{date}</span>
          <span className="text-slate-700">|</span>
          <Clock className="w-3 h-3" />
          <span>{devocional.readingTimeMinutes} min de lectura</span>
        </div>

        <h1 className="text-2xl font-black text-white mb-4">{devocional.title}</h1>

        <div className="prose prose-invert prose-sm max-w-none mb-8">
          {devocional.content.split("\n\n").map((p, i) => (
            <p key={i} className="text-sm text-slate-300 leading-relaxed mb-4">{p}</p>
          ))}
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-amber-500/20 mb-8">
          <p className="text-xs text-slate-400 italic leading-relaxed mb-2">&ldquo;{devocional.verse}&rdquo;</p>
          <p className="text-[10px] font-bold text-amber-400">{devocional.verseRef}</p>
        </div>

        <div className="flex items-center justify-between text-[9px] text-slate-500">
          <span>Por {devocional.author}</span>
          <Link href="/editorial"
            className="inline-flex items-center gap-1.5 text-[#00D9FF] hover:underline">
            <Share2 className="w-3 h-3" /> MSM Editorial
          </Link>
        </div>
      </div>
    </div>
  )
}

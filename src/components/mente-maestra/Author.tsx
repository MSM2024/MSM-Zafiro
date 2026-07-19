'use client'

import { motion } from "motion/react"
import { ExternalLink, BookOpen } from "lucide-react"
import Link from "next/link"
import { MENTE_MAESTRA } from "@/lib/mente-maestra/config"

export default function Author() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 rounded-2xl glass glow-border text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00D9FF] to-violet-600 flex items-center justify-center text-2xl font-black text-white">
            MS
          </div>
          <h2 className="text-xl font-bold text-white mb-1">{MENTE_MAESTRA.author.name}</h2>
          <p className="text-sm text-[#00D9FF] mb-4">{MENTE_MAESTRA.author.title}</p>
          <p className="text-slate-400 text-sm leading-relaxed max-w-lg mx-auto mb-6">
            {MENTE_MAESTRA.author.bio}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={MENTE_MAESTRA.author.profileUrl}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50 text-sm transition-all"
            >
              <ExternalLink className="w-4 h-4" /> Perfil ZAFIRO
            </Link>
            <Link
              href="/ecosystem"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50 text-sm transition-all"
            >
              <BookOpen className="w-4 h-4" /> MSM Editorial
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

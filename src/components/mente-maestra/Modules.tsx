'use client'

import { motion } from "motion/react"
import { BookOpen, Brain, Heart, Target, Rocket, Users } from "lucide-react"
import { MENTE_MAESTRA } from "@/lib/mente-maestra/config"
import { trackMMEvent } from "@/lib/mente-maestra/analytics"
import { useEffect } from "react"

const moduleIcons = [BookOpen, Brain, Heart, Target, Rocket, Users]

export default function Modules() {
  useEffect(() => { trackMMEvent('modules_view') }, [])

  return (
    <section className="py-20 px-4 bg-[#0A0B1A]/50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            QUÉ INCLUYE
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Seis módulos diseñados para guiarte desde la reflexión hasta la acción.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MENTE_MAESTRA.modules.map((mod, i) => {
            const Icon = moduleIcons[i % moduleIcons.length]
            return (
              <motion.div
                key={mod.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-6 rounded-2xl glass glass-hover card-3d glow-border"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9FF]/20 to-violet-600/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[#00D9FF]" />
                </div>
                <div className="text-xs font-mono font-bold text-[#00D9FF] mb-1">MÓDULO {mod.number}</div>
                <h3 className="text-lg font-bold text-white mb-3">{mod.title}</h3>
                <ul className="space-y-2">
                  {mod.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]/60 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

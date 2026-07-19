'use client'

import { motion } from "motion/react"
import { CheckCircle } from "lucide-react"
import { MENTE_MAESTRA } from "@/lib/mente-maestra/config"

export default function Benefits() {
  return (
    <section id="programa" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-4">
            ESTE PROGRAMA ES PARA TI
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
            Si te identificas con alguna de estas situaciones, La Mente Maestra está diseñada para ti.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MENTE_MAESTRA.benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-start gap-3 p-4 rounded-2xl glass glass-hover"
            >
              <CheckCircle className="w-5 h-5 text-[#00D9FF] mt-0.5 shrink-0" />
              <span className="text-slate-200">{benefit}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

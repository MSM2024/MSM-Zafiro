'use client'

import { motion } from "motion/react"
import Link from "next/link"
import { ArrowLeft, Sparkles, Diamond, Globe, Eye, Zap } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"

export default function Zafiro369CampaignPage() {
  usePageTitle("ZAFIRO 369/777 — Campaña")

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>
      </div>

      <section className="relative min-h-[80vh] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00D9FF]/5 via-transparent to-[#050816]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-[#00D9FF]/5 rounded-full blur-[80px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-3xl"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#00D9FF]/20 via-violet-600/20 to-[#00D9FF]/10 flex items-center justify-center border border-[#00D9FF]/20"
          >
            <Diamond className="w-8 h-8 text-[#00D9FF]" />
          </motion.div>

          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-violet-400">369</span>
            <span className="text-4xl text-slate-600">/</span>
            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-[#00D9FF]">777</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
            ZAFIRO HA LLEGADO
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-3">Una identidad. Una comunidad. Un universo digital.</p>
          <p className="text-base text-slate-500 mb-8 max-w-lg mx-auto">Crea tu perfil, conecta con emprendedores, descubre contenido y avanza acompañado por ELIANA.</p>

          <motion.a
            href="https://zafiro.msmmystore.com"
            target="_blank"
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0,217,255,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00D9FF] to-violet-600 text-white font-bold rounded-xl text-lg transition-all"
          >
            <Sparkles className="w-5 h-5" /> ENTRAR A ZAFIRO
          </motion.a>
        </motion.div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Diamond, title: "Tu Identidad", desc: "Perfil, membresía VIP, insignias y reconocimiento en el ecosistema MSM." },
              { icon: Globe, title: "Tu Comunidad", desc: "Conecta con emprendedores, escritores y creadores con propósito." },
              { icon: Zap, title: "Tu Futuro", desc: "Accede a herramientas, contenido y oportunidades diseñadas para tu crecimiento." },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-6 rounded-2xl glass glass-hover text-center"
              >
                <item.icon className="w-8 h-8 text-[#00D9FF] mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#0A0B1A]/50">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl glass glow-cyan"
          >
            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              &ldquo;ZAFIRO no es solamente una plataforma. Es tu identidad, tu comunidad y tu universo digital, acompañado por <strong className="text-[#00D9FF]">ELIANA</strong>.&rdquo;
            </p>
            <p className="text-sm text-slate-500 mb-6">— Miguel Soria Martínez, Fundador MSM MY STORE LLC</p>
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-violet-400 mb-4">
              369 / 777
            </div>
            <a href="https://zafiro.msmmystore.com" target="_blank"
              className="inline-flex items-center gap-2 text-[#00D9FF] hover:text-white transition-colors text-sm font-medium">
              <Eye className="w-4 h-4" /> zafiro.msmmystore.com
            </a>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 px-4 text-center">
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} MSM MY STORE LLC — ZAFIRO 369/777</p>
        <p className="text-[10px] text-slate-700 mt-1">Los códigos 369 y 777 son identidad visual y simbólica de la marca ZAFIRO.</p>
      </footer>
    </div>
  )
}

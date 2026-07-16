'use client'

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Gem, Users, MessageSquare, Activity, TrendingUp, Award, Flame, Eye, Zap, Bot, BarChart3, FileText, Shield, Sparkles, BookOpen, Brain } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { getSession } from "@/lib/auth"
import { getPTSAccount, getStreak } from "@/lib/rewards"
import { getReferralCount } from "@/lib/referidos"
import { getPlatforms } from "@/lib/universo"
import { getPublicaciones } from "@/lib/comentarios"
import GenesisChamberBackground from "@/components/GenesisChamberBackground"
import ElianaDiamond from "@/components/ElianaDiamond"
import ModuleAngels from "@/components/ModuleAngels"

export default function DashboardPage() {
  usePageTitle("Dashboard — ZAFIRO")
  const session = getSession()
  const userId = session?.id || ""
  const [pts] = useState(() => userId ? getPTSAccount(userId).balance : 0)
  const [streak] = useState(() => userId ? getStreak(userId) : 0)
  const [referrals] = useState(() => userId ? getReferralCount(userId) : 0)
  const [platforms] = useState(() => userId ? getPlatforms(userId).length : 0)
  const [posts] = useState(() => userId ? getPublicaciones(userId).length : 0)
  const [level] = useState(() => userId ? getPTSAccount(userId).level : 1)

  const metrics = [
    { label: "PTS Disponibles", value: pts.toLocaleString(), icon: Gem, color: "text-[#00D9FF]", subtitle: `Nivel ${level}` },
    { label: "Racha Actual", value: `${streak} días`, icon: Flame, color: "text-amber-400", subtitle: "sigue así" },
    { label: "Plataformas", value: platforms.toString(), icon: Eye, color: "text-emerald-400", subtitle: "conectadas" },
    { label: "Publicaciones", value: posts.toString(), icon: FileText, color: "text-purple-400", subtitle: "totales" },
    { label: "Referidos", value: referrals.toString(), icon: Users, color: "text-blue-400", subtitle: "invitados" },
    { label: "Actividad", value: "Alta", icon: Activity, color: "text-rose-400", subtitle: "últimos 7 días" },
  ]

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
      <GenesisChamberBackground intensity={1.5} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
            <div className="absolute inset-[-20px] rounded-full bg-gradient-to-br from-[#00D9FF]/10 via-[#7c3aed]/10 to-transparent animate-pulse-glow" />
            <div className="absolute inset-[-10px] rounded-full border border-[#00D9FF]/20" />
            <ElianaDiamond size={128} variant="animated" />
          </div>
          <h1 className="text-3xl font-black text-gradient text-center">Cámara de la Génesis</h1>
          <p className="text-sm text-slate-400 text-center mt-1">
            {session ? `Bienvenido, ${session.name}` : "Inicia sesión para ver tus métricas"}
          </p>
          <div className="mt-4 flex items-center gap-4 text-[9px] text-slate-500">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-[#FF6B35]" /> Protegido</span>
            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-[#FFD700]" /> Sincronizado</span>
            <span className="flex items-center gap-1"><Brain className="w-3 h-3 text-[#00D9FF]" /> ELIANA activa</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-[#00D9FF]" />
            <h2 className="text-xs font-bold text-white tracking-wider uppercase">Los 7 Ángeles — Módulos del Sistema</h2>
          </div>
          <ModuleAngels />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {metrics.map((m, i) => {
            const Icon = m.icon
            return (
              <div key={i} className="p-4 rounded-2xl glass card-3d glass-hover border border-slate-800/30 hover:border-[#00D9FF]/20 transition-all duration-500">
                <Icon className={`w-5 h-5 ${m.color} mb-2`} />
                <p className="text-lg font-black">{m.value}</p>
                <p className="text-[9px] text-slate-400">{m.label}</p>
                <p className="text-[7px] text-slate-600">{m.subtitle}</p>
              </div>
            )
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-2xl glass border border-slate-800/30">
            <h2 className="text-xs font-bold text-white mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-[#00D9FF]" /> Acciones Rápidas</h2>
            <div className="space-y-2">
              <Link href="/universo" className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/20 border border-slate-700/30 hover:border-slate-600 transition-all">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] text-slate-300">Gestionar Mi Universo Digital</span>
              </Link>
              <Link href="/referidos" className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/20 border border-slate-700/30 hover:border-slate-600 transition-all">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] text-slate-300">Compartir enlace de referido</span>
              </Link>
              <Link href="/rewards" className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/20 border border-slate-700/30 hover:border-slate-600 transition-all">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] text-slate-300">Ver MSM Rewards</span>
              </Link>
              <Link href="/profile-page" className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/20 border border-slate-700/30 hover:border-slate-600 transition-all">
                <Gem className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] text-slate-300">Editar mi perfil</span>
              </Link>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass border border-slate-800/30">
            <h2 className="text-xs font-bold text-white mb-3 flex items-center gap-2"><Bot className="w-4 h-4 text-[#00D9FF]" /> Resumen ELIANA</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-slate-800/40">
                <span className="text-[9px] text-slate-400">Automatización</span>
                <span className="text-[9px] text-emerald-400">92.6% activa</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-800/40">
                <span className="text-[9px] text-slate-400">Análisis de plataformas</span>
                <span className="text-[9px] text-slate-300">{platforms} conectadas</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-800/40">
                <span className="text-[9px] text-slate-400">PTS generados (total)</span>
                <span className="text-[9px] text-slate-300">{pts.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[9px] text-slate-400">Estado del sistema</span>
                <span className="text-[9px] text-emerald-400">Saludable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from "next/link"
import { ArrowLeft, Globe, Link2, Activity, ExternalLink } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { DEFAULT_ECOSYSTEM, type EcosystemProject } from "@/lib/ecosistema"
import CrossPillarStatsWidget from "@/components/CrossPillarStatsWidget"
import { CrossPillarLeaderboard } from "@/components/CrossPillarLeaderboard"
import { ActivityTimeline } from "@/components/ActivityTimeline"

const ICON_MAP: Record<string, string> = {
  "🏪": "Store", "💎": "Gem", "🤖": "Brain", "📝": "BookOpen",
  "🎯": "Target", "🌐": "Globe", "📱": "Smartphone", "💰": "DollarSign",
  "👥": "Users", "📊": "BarChart3", "🛡️": "Shield", "🔗": "Link2",
  "📖": "BookOpen", "🏦": "Landmark", "📦": "Package",
}

const PROJECT_ROUTES: Record<string, string> = {
  "MSM My Store": "https://msmmystore.com",
  "ZAFIRO": "/",
  "MSM Marketplace": "/marketplace",
  "Álbum de la Vida": "/familia",
  "MSM Mente Maestra": "/campanas/zafiro-369-777",
  "ELIANA": "/eliana",
  "MSM Blog": "https://msmmystore.com/blog",
  "Remesas a Cuba": "https://msmmystore.com",
  "Farmasi": "https://msmmystore.com",
  "Redes Sociales": "/universo",
  "Marketing Digital": "/what-we-do",
  "MSM Payment": "/pagar",
}

function ProjectIcon({ icon }: { icon: string }) {
  const name = ICON_MAP[icon] || "Globe"
  return <span className="text-lg">{icon}</span>
}

export default function EcosystemPage() {
  usePageTitle("Ecosistema MSM — ZAFIRO")

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Ecosistema MSM</h1>
            <p className="text-sm text-slate-400">Un universo de proyectos interconectados por <span className="text-[#00D9FF]">ELIANA</span></p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/50 border border-slate-800/60 p-6 mb-8">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            <span className="text-white font-bold">MSM</span> es un ecosistema de proyectos que trabajan juntos para ofrecer comercio, conocimiento y comunidad.
            <span className="text-[#00D9FF]"> ZAFIRO</span> es el centro neural. <Link href="/imperio" className="text-amber-400 hover:underline">El Imperio MSM</Link> los unifica a todos.
          </p>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-[#00D9FF]" />
          <h2 className="text-sm font-mono font-bold text-[#00D9FF] uppercase tracking-wider">Estadísticas en Vivo</h2>
        </div>
        <div className="mb-8">
          <CrossPillarStatsWidget />
        </div>

        <h2 className="text-sm font-mono font-bold text-[#00D9FF] uppercase tracking-wider mb-4">Proyectos del Ecosistema</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {DEFAULT_ECOSYSTEM.map((p: EcosystemProject) => {
            const url = PROJECT_ROUTES[p.name] || p.url || "/about"
            return (
              <Link key={p.id} href={url} target={url.startsWith("http") ? "_blank" : undefined}
                className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/60 hover:border-[#00D9FF]/30 transition-all group">
                <div className="flex items-center gap-3 mb-2">
                  <ProjectIcon icon={p.icon} />
                  <h3 className="text-xs font-bold text-white group-hover:text-[#00D9FF] transition-colors">{p.name}</h3>
                </div>
                <p className="text-[9px] text-slate-400 leading-relaxed">{p.description}</p>
                <span className={`text-[7px] mt-2 inline-block px-1.5 py-0.5 rounded-full ${
                  p.status === "activo" ? "bg-emerald-500/10 text-emerald-400" :
                  p.status === "beta" ? "bg-amber-500/10 text-amber-400" :
                  "bg-slate-500/10 text-slate-400"
                }`}>{p.status}</span>
              </Link>
            )
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800/60 p-6">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Link2 className="w-4 h-4 text-[#00D9FF]" /> Sinergia del Imperio</h2>
            <ul className="space-y-2 text-[10px] text-slate-400">
              <li className="flex items-start gap-2">• Comprar en el <Link href="/marketplace" className="text-amber-400 hover:underline">Marketplace</Link> y ver el registro en el <Link href="/admin/ledger" className="text-cyan-400 hover:underline">Ledger Maestro</Link>.</li>
              <li className="flex items-start gap-2">• Conectar tu <Link href="/zafiro/perfil" className="text-[#00D9FF] hover:underline">perfil ZAFIRO</Link> con tu actividad en el ecosistema.</li>
              <li className="flex items-start gap-2">• Consultar <Link href="/admin/tasas" className="text-green-400 hover:underline">tasas de cambio Cuba</Link> y calcular ganancias MSM.</li>
              <li className="flex items-start gap-2">• Seguir la <Link href="/trading" className="text-purple-400 hover:underline">estrategia de Trading 1%</Link> con señales generadas por ELIANA.</li>
              <li className="flex items-start gap-2">• Gestionar <Link href="/admin/bpa" className="text-blue-400 hover:underline">BPA Mirror</Link> y <Link href="/admin/financiamiento" className="text-amber-400 hover:underline">Financiamiento</Link> desde el <Link href="/admin" className="text-red-400 hover:underline">Panel Admin</Link>.</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-slate-900/50 border border-slate-800/60 p-6">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-400" /> Top del Ecosistema</h2>
            <CrossPillarLeaderboard />
          </div>
          <div>
            <ActivityTimeline max={10} />
            <Link href="/actividad" className="mt-2 flex items-center justify-center gap-1 text-[9px] text-slate-500 hover:text-[#00D9FF] transition-colors">
              <ExternalLink className="w-3 h-3" /> Ver toda la actividad
            </Link>
          </div>
        </div>

        <Link href="/imperio" className="block text-center py-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 text-[10px] font-bold text-amber-400 hover:from-amber-500/20 transition-all">
          👑 Ir al Centro de Mando del Imperio MSM
        </Link>
      </div>
    </div>
  )
}

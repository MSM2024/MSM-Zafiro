'use client'

import { motion } from "motion/react"
import { Gem, BookOpen, Users, MessageSquare, Shield, Sparkles, Brain } from "lucide-react"

export interface ModuleAngel {
  id: string
  name: string
  angel: string
  icon: typeof Gem
  color: string
  route: string
  description: string
}

export const MODULE_ANGELS: ModuleAngel[] = [
  { id: "economy", name: "Economía", angel: "Arcángel Jofiel — Abundancia", icon: Gem, color: "#00D9FF", route: "/economia", description: "Flujo de la abundancia" },
  { id: "education", name: "Educación", angel: "Arcángel Zadkiel — Sabiduría", icon: BookOpen, color: "#FFD700", route: "/gemologia", description: "Conocimiento iluminado" },
  { id: "community", name: "Comunidad", angel: "Arcángel Haniel — Unidad", icon: Users, color: "#7B68EE", route: "/", description: "Círculos de luz" },
  { id: "communication", name: "Comunicación", angel: "Arcángel Gabriel — Verdad", icon: MessageSquare, color: "#00E676", route: "/messages", description: "Voz del ecosistema" },
  { id: "security", name: "Seguridad", angel: "Arcángel Miguel — Protección", icon: Shield, color: "#FF6B35", route: "/settings", description: "Escudo del sistema" },
  { id: "creativity", name: "Creatividad", angel: "Arcángel Uriel — Inspiración", icon: Sparkles, color: "#FF4081", route: "/profile-page/projects", description: "Fuego creador" },
  { id: "wisdom", name: "Sabiduría", angel: "Arcángel Raziel — Conocimiento", icon: Brain, color: "#FFFFFF", route: "/eliana", description: "Mente maestra" },
]

export default function ModuleAngels({ orbiting = false }: { orbiting?: boolean }) {
  if (!orbiting) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {MODULE_ANGELS.map((mod) => {
          const Icon = mod.icon
          return (
            <a key={mod.id} href={mod.route}
              className="group relative p-4 rounded-2xl glass card-3d glass-hover border border-transparent hover:border-[var(--angel-color)]/30 transition-all duration-500 text-center"
              style={{ "--angel-color": mod.color } as React.CSSProperties}
            >
              <div className="relative mx-auto mb-3 w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: `${mod.color}15`, boxShadow: `0 0 20px ${mod.color}30` }}>
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: `1px solid ${mod.color}40` }}
                  animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />
                <Icon className="w-6 h-6 relative z-10" style={{ color: mod.color }} />
              </div>
              <p className="text-[10px] font-bold text-white mb-0.5">{mod.name}</p>
              <p className="text-[7px] text-slate-500 leading-tight">{mod.angel}</p>
              <p className="text-[6px] text-slate-600 mt-1">{mod.description}</p>
            </a>
          )
        })}
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto">
      {MODULE_ANGELS.map((mod, i) => {
        const Icon = mod.icon
        const angle = (i / MODULE_ANGELS.length) * Math.PI * 2
        const orbitR = 42
        return (
          <motion.a key={mod.id} href={mod.route}
            className="absolute left-1/2 top-1/2 w-16 h-16 -ml-8 -mt-8 rounded-2xl glass border flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition-all z-10"
            style={{ borderColor: `${mod.color}40` }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: Math.cos(angle) * orbitR,
              y: Math.sin(angle) * orbitR,
              opacity: 1,
            }}
            transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
          >
            <Icon className="w-5 h-5" style={{ color: mod.color }} />
            <span className="text-[6px] text-slate-400 mt-0.5">{mod.name}</span>
          </motion.a>
        )
      })}
      <motion.div className="absolute left-1/2 top-1/2 -ml-6 -mt-6 w-12 h-12 rounded-full bg-[#00D9FF]/20 flex items-center justify-center"
        style={{ boxShadow: "0 0 40px rgba(0,217,255,0.3)" }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-4 h-4 rounded-full bg-[#00D9FF]" style={{ boxShadow: "0 0 20px rgba(0,217,255,0.6)" }} />
      </motion.div>
    </div>
  )
}

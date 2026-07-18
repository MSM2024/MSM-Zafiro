'use client'

import type { SettingsSection } from '@/lib/settings/types'
import { User, Palette, Bell, Eye, Globe, Shield, Moon, Volume2 } from 'lucide-react'

const SECTIONS: { id: SettingsSection; label: string; icon: typeof User }[] = [
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'apariencia', label: 'Apariencia', icon: Palette },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
  { id: 'privacidad', label: 'Privacidad', icon: Eye },
  { id: 'idioma', label: 'Idioma y Región', icon: Globe },
  { id: 'seguridad', label: 'Seguridad', icon: Shield },
  { id: 'accesibilidad', label: 'Accesibilidad', icon: Moon },
  { id: 'audio', label: 'Audio y Voz', icon: Volume2 },
]

interface Props {
  active: SettingsSection
  onChange: (id: SettingsSection) => void
  children?: React.ReactNode
}

export default function SettingsNavigation({ active, onChange, children }: Props) {
  return (
    <nav className="space-y-1">
      {SECTIONS.map((sec) => {
        const Icon = sec.icon
        return (
          <button key={sec.id} onClick={() => onChange(sec.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              active === sec.id
                ? 'bg-gradient-to-r from-[#00D9FF]/15 to-blue-600/10 text-[#00D9FF] border border-[#00D9FF]/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
            }`}>
            <Icon className="w-4 h-4" />
            <span>{sec.label}</span>
          </button>
        )
      })}
      {children}
    </nav>
  )
}

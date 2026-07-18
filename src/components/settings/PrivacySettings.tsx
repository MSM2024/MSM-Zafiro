'use client'

import type { PrivacySettings as PS } from '@/lib/settings/types'
import { Eye, Users, MessageCircle, Activity, Briefcase, FileText, Sparkles, BarChart3, Mail } from 'lucide-react'

const OPTIONS: { key: keyof PS; icon: typeof Eye; label: string; desc: string }[] = [
  { key: 'profilePublic', icon: Eye, label: 'Perfil público', desc: 'Cualquier persona puede ver tu perfil y actividad pública.' },
  { key: 'showActivity', icon: Activity, label: 'Mostrar actividad', desc: 'Otros usuarios pueden ver tus interacciones recientes.' },
  { key: 'showBusiness', icon: Briefcase, label: 'Visibilidad de negocios', desc: 'Tus proyectos y emprendimientos son visibles.' },
  { key: 'showPosts', icon: FileText, label: 'Visibilidad de publicaciones', desc: 'Tus publicaciones son accesibles para otros.' },
  { key: 'allowElianaPersonalization', icon: Sparkles, label: 'Personalización de ELIANA', desc: 'ELIANA usa tu actividad para ofrecerte recomendaciones.' },
  { key: 'allowAnalytics', icon: BarChart3, label: 'Analítica autorizada', desc: 'Ayudas a mejorar ZAFIRO con datos anónimos de uso.' },
  { key: 'allowCommunications', icon: Mail, label: 'Consentimiento de comunicaciones', desc: 'Recibes comunicaciones del equipo ZAFIRO.' },
]

const FOLLOW_OPTIONS = [
  { value: 'todos' as const, label: 'Todos' },
  { value: 'verificados' as const, label: 'Solo verificados' },
  { value: 'nadie' as const, label: 'Nadie' },
]

const MESSAGE_OPTIONS = [
  { value: 'todos' as const, label: 'Todos' },
  { value: 'seguidores' as const, label: 'Solo seguidores' },
  { value: 'nadie' as const, label: 'Nadie' },
]

interface Props {
  value: PS
  onChange: (v: PS) => void
}

export default function PrivacySettings({ value, onChange }: Props) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">Privacidad</h2>

      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-slate-800">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-sm font-bold">Perfil público</p>
            <p className="text-xs text-slate-400">Tu perfil es visible para todos los usuarios</p>
          </div>
        </div>
        <button onClick={() => onChange({ ...value, profilePublic: !value.profilePublic })}
          className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${
            value.profilePublic ? 'bg-[#00D9FF]' : 'bg-slate-700'
          }`}>
          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
            value.profilePublic ? 'right-0.5' : 'left-0.5'
          }`} />
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-slate-400" />
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">¿Quién puede seguirme?</label>
        </div>
        <div className="flex gap-1 p-1 rounded-xl bg-slate-900/40">
          {FOLLOW_OPTIONS.map(o => (
            <button key={o.value} onClick={() => onChange({ ...value, whoCanFollow: o.value })}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                value.whoCanFollow === o.value ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-4 h-4 text-slate-400" />
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">¿Quién puede enviarme mensajes?</label>
        </div>
        <div className="flex gap-1 p-1 rounded-xl bg-slate-900/40">
          {MESSAGE_OPTIONS.map(o => (
            <button key={o.value} onClick={() => onChange({ ...value, whoCanMessage: o.value })}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                value.whoCanMessage === o.value ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {OPTIONS.map(({ key, icon: Icon, label, desc }) => (
          <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/20 border border-slate-800/60">
            <div className="flex items-start gap-3">
              <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-xs text-slate-300 font-medium">{label}</span>
                <p className="text-[9px] text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
            <button onClick={() => onChange({ ...value, [key]: !value[key] })}
              className={`w-9 h-5 rounded-full relative shrink-0 transition-all cursor-pointer ${
                value[key] ? 'bg-[#00D9FF]' : 'bg-slate-700'
              }`}>
              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all ${
                value[key] ? 'right-0.5' : 'left-0.5'
              }`} />
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <p className="text-xs text-amber-400 font-bold flex items-center gap-2"><Eye className="w-4 h-4" /> Exportar mis datos</p>
        <p className="text-[10px] text-slate-400 mt-1">Recibirás un enlace para descargar toda tu información.</p>
        <p className="text-[9px] text-slate-600 mt-2">KYC, KYB, dirección, documentos e información financiera no se exponen en esta sección.</p>
      </div>
    </div>
  )
}

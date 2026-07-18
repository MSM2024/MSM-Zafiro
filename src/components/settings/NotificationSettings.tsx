'use client'

import { Bell, BellOff, Moon, Clock } from 'lucide-react'
import type { NotificationSettings as NS, NotificationCategory, NotificationChannel, UIState } from '@/lib/settings/types'
import { NOTIFICATION_CATEGORIES, NOTIFICATION_CHANNELS } from '@/lib/settings/types'
import { useState } from 'react'

const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  sistema: 'Sistema',
  comunidad: 'Comunidad',
  mensajes: 'Mensajes',
  marketplace: 'Marketplace',
  editorial: 'Editorial',
  economia: 'MSM Economía',
  seguridad: 'Seguridad',
  eliana: 'ELIANA',
  promociones: 'Promociones autorizadas',
}

const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  'in-app': 'Dentro de ZAFIRO',
  email: 'Correo',
  whatsapp: 'WhatsApp',
  push: 'Notificación Push',
}

const FREQUENCIES = [
  { value: 'inmediata', label: 'Inmediata' },
  { value: 'resumen-diario', label: 'Resumen Diario' },
  { value: 'semanal', label: 'Semanal' },
] as const

interface Props {
  value: NS
  onChange: (v: NS) => void
}

export default function NotificationSettings({ value, onChange }: Props) {
  const toggleCategory = (cat: NotificationCategory) => {
    onChange({ ...value, categories: { ...value.categories, [cat]: !value.categories[cat] } })
  }

  const toggleChannel = (ch: NotificationChannel) => {
    if (ch === 'whatsapp' || ch === 'push') return
    onChange({ ...value, channels: { ...value.channels, [ch]: !value.channels[ch] } })
  }

  const allOn = NOTIFICATION_CATEGORIES.every(c => value.categories[c])
  const allOff = NOTIFICATION_CATEGORIES.every(c => !value.categories[c])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Notificaciones</h2>
        <div className="flex gap-2">
          <button onClick={() => {
            const cats = {} as Record<NotificationCategory, boolean>
            for (const c of NOTIFICATION_CATEGORIES) cats[c] = true
            onChange({ ...value, categories: cats })
          }} className="text-[10px] px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer flex items-center gap-1">
            <Bell className="w-3 h-3" /> Activar Todo
          </button>
          <button onClick={() => {
            const cats = {} as Record<NotificationCategory, boolean>
            for (const c of NOTIFICATION_CATEGORIES) cats[c] = false
            onChange({ ...value, categories: cats })
          }} className="text-[10px] px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer flex items-center gap-1">
            <BellOff className="w-3 h-3" /> Silenciar Todo
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {NOTIFICATION_CATEGORIES.map(cat => (
          <div key={cat} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/20 border border-slate-800/60">
            <span className="text-xs text-slate-300">{CATEGORY_LABELS[cat]}</span>
            <button onClick={() => toggleCategory(cat)}
              className={`w-9 h-5 rounded-full relative transition-all cursor-pointer ${
                value.categories[cat] ? 'bg-[#00D9FF]' : 'bg-slate-700'
              }`}>
              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all ${
                value.categories[cat] ? 'right-0.5' : 'left-0.5'
              }`} />
            </button>
          </div>
        ))}
      </div>

      <div>
        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 block">Canales</label>
        <div className="space-y-2">
          {NOTIFICATION_CHANNELS.map(ch => {
            const isExternal = ch === 'whatsapp' || ch === 'push'
            return (
              <div key={ch} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/20 border border-slate-800/60">
                <div>
                  <span className="text-xs text-slate-300">{CHANNEL_LABELS[ch]}</span>
                  {isExternal && <span className="text-[9px] text-slate-600 ml-2">(Sin integración)</span>}
                </div>
                <button onClick={() => toggleChannel(ch)} disabled={isExternal}
                  className={`w-9 h-5 rounded-full relative transition-all cursor-pointer ${
                    isExternal ? 'bg-slate-800 opacity-50' :
                    value.channels[ch] ? 'bg-[#00D9FF]' : 'bg-slate-700'
                  }`}>
                  <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all ${
                    value.channels[ch] ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-slate-800">
        <div className="flex items-center gap-3">
          <Moon className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-sm font-bold">Horario de Descanso</p>
            <p className="text-xs text-slate-400">Sin notificaciones durante este período</p>
          </div>
        </div>
        <button onClick={() => onChange({ ...value, quietHoursEnabled: !value.quietHoursEnabled })}
          className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${
            value.quietHoursEnabled ? 'bg-[#00D9FF]' : 'bg-slate-700'
          }`}>
          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
            value.quietHoursEnabled ? 'right-0.5' : 'left-0.5'
          }`} />
        </button>
      </div>

      {value.quietHoursEnabled && (
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
              <Clock className="w-3 h-3 inline mr-1" /> Inicio
            </label>
            <input type="time" value={value.quietHoursStart}
              onChange={e => onChange({ ...value, quietHoursStart: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-[#00D9FF] outline-none" />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
              <Clock className="w-3 h-3 inline mr-1" /> Fin
            </label>
            <input type="time" value={value.quietHoursEnd}
              onChange={e => onChange({ ...value, quietHoursEnd: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-[#00D9FF] outline-none" />
          </div>
        </div>
      )}

      <div>
        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">Frecuencia</label>
        <div className="flex gap-1 p-1 rounded-xl bg-slate-900/40">
          {FREQUENCIES.map(({ value: v, label }) => (
            <button key={v} onClick={() => onChange({ ...value, frequency: v })}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                value.frequency === v ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

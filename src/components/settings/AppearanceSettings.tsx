'use client'

import { Sun, Moon, Monitor, Table, Type, Move } from 'lucide-react'
import type { ThemeMode, FontScale, MotionPreference, AccentColorName } from '@/lib/settings/types'
import AccentColorPicker from './AccentColorPicker'
import { applyTheme, applyCompactMode, applyFontScale, applyMotionPreference, applyAllTheme } from '@/lib/settings/theme-manager'

interface Props {
  themeMode: ThemeMode
  accentColor: AccentColorName
  customAccentColor: string
  compactMode: boolean
  fontScale: FontScale
  motionPreference: MotionPreference
  onChange: (field: string, value: unknown) => void
}

const THEMES: { value: ThemeMode; icon: typeof Sun; label: string }[] = [
  { value: 'system', icon: Monitor, label: 'Sistema' },
  { value: 'light', icon: Sun, label: 'Claro' },
  { value: 'dark', icon: Moon, label: 'Oscuro' },
]

const FONT_OPTIONS: { value: FontScale; label: string }[] = [
  { value: 'pequena', label: 'Pequeña' },
  { value: 'normal', label: 'Normal' },
  { value: 'grande', label: 'Grande' },
  { value: 'muy-grande', label: 'Muy Grande' },
]

const MOTION_OPTIONS: { value: MotionPreference; label: string }[] = [
  { value: 'completo', label: 'Completo' },
  { value: 'reducido', label: 'Reducido' },
  { value: 'sistema', label: 'Según Sistema' },
]

export default function AppearanceSettings({ themeMode, accentColor, customAccentColor, compactMode, fontScale, motionPreference, onChange }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Apariencia</h2>

      <div>
        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 block">Tema</label>
        <div className="flex gap-2">
          {THEMES.map(({ value, icon: Icon, label }) => (
            <button key={value} onClick={() => { applyTheme(value); onChange('themeMode', value) }}
              className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all cursor-pointer ${
                themeMode === value
                  ? 'border-[#00D9FF] bg-[#00D9FF]/10 text-[#00D9FF]'
                  : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-600'
              }`}>
              <Icon className="w-6 h-6" />
              <span className="text-xs font-bold">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <AccentColorPicker
        value={accentColor}
        customColor={customAccentColor}
        onChange={(name, color) => { onChange('accentColor', name); onChange('customAccentColor', color) }}
      />

      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-slate-800">
        <div className="flex items-center gap-3">
          <Table className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-sm font-bold">Modo Compacto</p>
            <p className="text-xs text-slate-400">Reducir espaciado en vistas</p>
          </div>
        </div>
        <button onClick={() => { applyCompactMode(!compactMode); onChange('compactMode', !compactMode) }}
          className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${
            compactMode ? 'bg-[#00D9FF]' : 'bg-slate-700'
          }`}>
          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
            compactMode ? 'right-0.5' : 'left-0.5'
          }`} />
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Type className="w-4 h-4 text-slate-400" />
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Tamaño de Fuente</label>
        </div>
        <div className="flex gap-1 p-1 rounded-xl bg-slate-900/40">
          {FONT_OPTIONS.map(({ value, label }) => (
            <button key={value} onClick={() => { applyFontScale(value); onChange('fontScale', value) }}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fontScale === value
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Move className="w-4 h-4 text-slate-400" />
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Movimiento</label>
        </div>
        <div className="flex gap-1 p-1 rounded-xl bg-slate-900/40">
          {MOTION_OPTIONS.map(({ value, label }) => (
            <button key={value} onClick={() => { applyMotionPreference(value); onChange('motionPreference', value) }}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                motionPreference === value
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}>
              {label}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 mt-1">Respeta prefers-reduced-motion del sistema.</p>
      </div>
    </div>
  )
}

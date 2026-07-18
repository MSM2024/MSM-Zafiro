'use client'

import { useState, useEffect } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import type { AccentColorName } from '@/lib/settings/types'
import { ACCENT_COLORS, ACCENT_COLOR_NAMES } from '@/lib/settings/types'
import { validateHexColor } from '@/lib/settings/validation'
import { applyAccentColor, applyAccentByName } from '@/lib/settings/theme-manager'

interface Props {
  value: AccentColorName
  customColor: string
  onChange: (name: AccentColorName, color: string) => void
}

const SWATCHES: { name: AccentColorName; label: string }[] = [
  { name: 'zafiro', label: 'ZAFIRO' },
  { name: 'cian', label: 'CIAN' },
  { name: 'violeta', label: 'VIOLETA' },
  { name: 'dorado', label: 'DORADO' },
  { name: 'esmeralda', label: 'ESMERALDA' },
  { name: 'rubi', label: 'RUBÍ' },
  { name: 'rosa', label: 'ROSA' },
  { name: 'naranja', label: 'NARANJA' },
  { name: 'plata', label: 'PLATA' },
]

export default function AccentColorPicker({ value, customColor, onChange }: Props) {
  const [customHex, setCustomHex] = useState(customColor)
  const [contrastNote, setContrastNote] = useState('')

  useEffect(() => {
    setCustomHex(customColor)
  }, [customColor])

  const handleSwatch = (name: AccentColorName) => {
    const color = ACCENT_COLORS[name]
    applyAccentByName(name)
    setContrastNote('')
    onChange(name, color)
  }

  const handleCustom = (hex: string) => {
    setCustomHex(hex)
    const validation = validateHexColor(hex)
    if (!validation.ok) {
      setContrastNote('Color inválido. Usa formato #RRGGBB.')
      return
    }
    if (validation.adjusted) {
      setContrastNote('Este color requiere un ajuste para conservar la legibilidad.')
      applyAccentColor(validation.adjusted)
      onChange('custom', validation.adjusted)
    } else {
      applyAccentColor(hex)
      setContrastNote('')
      onChange('custom', hex)
    }
  }

  const restoreZafiro = () => {
    handleSwatch('zafiro')
    setCustomHex(ACCENT_COLORS.zafiro)
    setContrastNote('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold">Color Principal</h3>
        <button onClick={restoreZafiro}
          className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-[#00D9FF] transition-colors cursor-pointer">
          <RotateCcw className="w-3 h-3" /> RESTAURAR ZAFIRO ORIGINAL
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {SWATCHES.map(({ name, label }) => {
          const color = ACCENT_COLORS[name]
          const selected = value === name
          return (
            <button key={name} onClick={() => handleSwatch(name)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-800/50 transition-all cursor-pointer group">
              <div className={`w-8 h-8 rounded-full relative flex items-center justify-center transition-transform group-hover:scale-110 ${selected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#050816]' : ''}`}
                style={{ backgroundColor: color }}>
                {selected && <Check className="w-4 h-4 text-white drop-shadow" />}
              </div>
              <span className="text-[8px] text-slate-500 font-medium text-center leading-tight">{label}</span>
            </button>
          )
        })}
      </div>

      <div>
        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Color Personalizado</label>
        <div className="flex items-center gap-3 mt-1">
          <input type="color"
            value={customHex}
            onChange={e => handleCustom(e.target.value)}
            className="w-10 h-10 rounded-xl border border-slate-700 bg-transparent cursor-pointer" />
          <input type="text"
            value={customHex}
            onChange={e => handleCustom(e.target.value)}
            placeholder="#00D9FF"
            maxLength={7}
            className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white font-mono focus:border-[#00D9FF] outline-none" />
          <div className="w-10 h-10 rounded-xl border border-slate-700" style={{ backgroundColor: customHex }} />
        </div>
        {contrastNote && <p className="text-[10px] text-amber-400 mt-1">{contrastNote}</p>}
      </div>
    </div>
  )
}

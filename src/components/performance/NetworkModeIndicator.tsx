'use client'

import { useState, useEffect } from "react"
import { Wifi, WifiOff, BatteryMedium, Zap, Settings } from "lucide-react"
import { getNetworkMode, onNetworkModeChange, setManualPreference, getManualPreference, MODE_CONFIG } from "@/lib/performance/network-mode"
import type { ZafiroNetworkMode, ManualMode } from "@/lib/performance/network-mode"

export default function NetworkModeIndicator() {
  const [mode, setMode] = useState<ZafiroNetworkMode>('FULL')
  const [manual, setManual] = useState<ManualMode>('auto')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setMode(getNetworkMode())
    setManual(getManualPreference())
    const unsub = onNetworkModeChange(m => setMode(m))
    return unsub
  }, [])

  const config = MODE_CONFIG[mode]

  const handleChange = (newManual: ManualMode) => {
    setManualPreference(newManual)
    setManual(newManual)
    setMode(getNetworkMode())
  }

  const icon = mode === 'OFFLINE' ? WifiOff : mode === 'LIGHT' ? BatteryMedium : mode === 'BALANCED' ? Zap : Wifi
  const Icon = icon
  const colors = { LIGHT: 'text-amber-400', BALANCED: 'text-emerald-400', FULL: 'text-[#00D9FF]', OFFLINE: 'text-red-400' }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${colors[mode]} hover:bg-slate-800/60`}>
        <Icon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{config.label}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-64 p-3 rounded-2xl glass border border-slate-700/60 z-50 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white">Rendimiento</h3>
              <Settings className="w-3 h-3 text-slate-500" />
            </div>

            <div className="space-y-1 mb-3">
              {([
                ['auto', 'Automático'],
                ['light', 'Ahorro de Datos'],
                ['full', 'Completo'],
              ] as [ManualMode, string][]).map(([value, label]) => (
                <button key={value} onClick={() => handleChange(value)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-medium transition-all ${
                    manual === value ? 'bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20' : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${manual === value ? 'bg-[#00D9FF]' : 'bg-slate-600'}`} />
                  {label}
                </button>
              ))}
            </div>

            <div className="p-2 rounded-lg bg-slate-900/60">
              <p className="text-[9px] text-slate-500">Modo actual: <strong className={colors[mode]}>{config.label}</strong></p>
              <p className="text-[8px] text-slate-600 mt-0.5">{config.description}</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

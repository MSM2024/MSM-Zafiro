'use client'

import type { LanguageRegionSettings as LRS } from '@/lib/settings/types'
import { LANGUAGES } from '@/lib/settings/types'

const COUNTRIES = [
  { code: 'CU', name: 'Cuba' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'ES', name: 'España' },
  { code: 'MX', name: 'México' },
  { code: 'PA', name: 'Panamá' },
  { code: 'DO', name: 'República Dominicana' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'CO', name: 'Colombia' },
  { code: 'AR', name: 'Argentina' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'PE', name: 'Perú' },
  { code: 'CL', name: 'Chile' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'HN', name: 'Honduras' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'UY', name: 'Uruguay' },
]

const TIMEZONES = [
  'America/Havana', 'America/New_York', 'America/Chicago', 'America/Denver',
  'America/Los_Angeles', 'America/Panama', 'America/Mexico_City', 'America/Bogota',
  'America/Lima', 'America/Santiago', 'America/Buenos_Aires', 'America/Sao_Paulo',
  'Europe/Madrid', 'Europe/London', 'Europe/Paris', 'Europe/Berlin',
  'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Dubai',
]

const CURRENCIES = [
  { code: 'USD', label: 'USD — Dólar estadounidense' },
  { code: 'EUR', label: 'EUR — Euro' },
  { code: 'CUP', label: 'CUP — Peso cubano' },
  { code: 'MXN', label: 'MXN — Peso mexicano' },
  { code: 'COP', label: 'COP — Peso colombiano' },
  { code: 'ARS', label: 'ARS — Peso argentino' },
  { code: 'BRL', label: 'BRL — Real brasileño' },
  { code: 'CLP', label: 'CLP — Peso chileno' },
  { code: 'PEN', label: 'PEN — Sol peruano' },
]

interface Props {
  value: LRS
  onChange: (v: LRS) => void
}

export default function LanguageRegionSettings({ value, onChange }: Props) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">Idioma y Región</h2>

      <div>
        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">Idioma</label>
        <div className="flex gap-1 p-1 rounded-xl bg-slate-900/40">
          {(Object.entries(LANGUAGES) as [string, string][]).map(([code, label]) => (
            <button key={code} onClick={() => onChange({ ...value, language: code as 'es' | 'en' })}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                value.language === code ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">País</label>
          <select value={value.country} onChange={e => onChange({ ...value, country: e.target.value })}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00D9FF] outline-none">
            {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">Zona Horaria</label>
          <select value={value.timezone} onChange={e => onChange({ ...value, timezone: e.target.value })}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00D9FF] outline-none">
            {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">Formato de Fecha</label>
          <select value={value.dateFormat} onChange={e => onChange({ ...value, dateFormat: e.target.value as LRS['dateFormat'] })}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00D9FF] outline-none">
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">Formato de Hora</label>
          <div className="flex gap-1 p-1 rounded-xl bg-slate-900/40 mt-1">
            {(['24h', '12h'] as const).map(f => (
              <button key={f} onClick={() => onChange({ ...value, timeFormat: f })}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  value.timeFormat === f ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">Moneda</label>
          <select value={value.currency} onChange={e => onChange({ ...value, currency: e.target.value })}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00D9FF] outline-none">
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">Separador Decimal</label>
          <div className="flex gap-1 p-1 rounded-xl bg-slate-900/40 mt-1">
            {([',', '.'] as const).map(s => (
              <button key={s} onClick={() => onChange({ ...value, decimalSeparator: s })}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  value.decimalSeparator === s ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
                }`}>
                {s === ',' ? 'Coma (1.234,56)' : 'Punto (1,234.56)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="text-[10px] text-slate-500">Los nombres propios, direcciones y referencias financieras no se traducen al cambiar de idioma.</p>
    </div>
  )
}

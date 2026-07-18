'use client'

import { Eye, Type, Move, Underline, Keyboard, Focus, BookOpen, EyeOff, Brain } from 'lucide-react'
import type { AccessibilitySettings as AS } from '@/lib/settings/types'

interface Props {
  value: AS
  onChange: (v: AS) => void
}

const OPTIONS: { key: keyof AS; icon: typeof Eye; label: string; desc: string }[] = [
  { key: 'highContrast', icon: Eye, label: 'Alto Contraste', desc: 'Aumenta el contraste de textos y elementos interactivos.' },
  { key: 'reduceMotion', icon: Move, label: 'Reducción de Movimiento', desc: 'Minimiza animaciones y transiciones.' },
  { key: 'underlineLinks', icon: Underline, label: 'Subrayar Enlaces', desc: 'Muestra todos los enlaces subrayados.' },
  { key: 'focusVisible', icon: Focus, label: 'Foco Visible', desc: 'Resalta el elemento enfocado con un anillo visible.' },
  { key: 'simplifiedReading', icon: BookOpen, label: 'Lectura Simplificada', desc: 'Reduce distracciones visuales en el contenido.' },
  { key: 'hideDecorations', icon: EyeOff, label: 'Ocultar Efectos Decorativos', desc: 'Elimina gradientes, sombras y efectos visuales no esenciales.' },
  { key: 'lowStimulation', icon: Brain, label: 'Baja Estimulación Visual', desc: 'Modo calmado con colores suaves y menos cambios.' },
]

export default function AccessibilitySettings({ value, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Eye className="w-5 h-5 text-[#00D9FF]" />
        <h2 className="text-lg font-bold">Accesibilidad</h2>
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

      <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <Keyboard className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold">Navegación por Teclado</h3>
        </div>
        <p className="text-xs text-slate-400">Todas las funciones de ZAFIRO son accesibles mediante teclado:</p>
        <ul className="text-[10px] text-slate-500 mt-2 space-y-1 list-disc list-inside">
          <li><kbd className="px-1 py-0.5 rounded bg-slate-800 text-[9px]">Tab</kbd> Navegar entre elementos</li>
          <li><kbd className="px-1 py-0.5 rounded bg-slate-800 text-[9px]">Enter</kbd> / <kbd className="px-1 py-0.5 rounded bg-slate-800 text-[9px]">Space</kbd> Activar elemento</li>
          <li><kbd className="px-1 py-0.5 rounded bg-slate-800 text-[9px]">Esc</kbd> Cerrar modales</li>
          <li><kbd className="px-1 py-0.5 rounded bg-slate-800 text-[9px]">Arrow</kbd> Navegar en listas</li>
        </ul>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold">Etiquetas para Lectores de Pantalla</h3>
        </div>
        <p className="text-xs text-slate-400">Todos los componentes interactivos incluyen etiquetas ARIA y descripciones para compatibilidad con lectores de pantalla.</p>
      </div>

      <p className="text-[10px] text-slate-500">Los cambios de accesibilidad se aplican inmediatamente y persisten al recargar.</p>
    </div>
  )
}

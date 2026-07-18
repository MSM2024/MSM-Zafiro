'use client'

import { Volume2, Mic, MessageCircle, Volume1, SkipForward, Subtitles, FileText, MicOff } from 'lucide-react'
import type { AudioVoiceSettings as AVS } from '@/lib/settings/types'

interface Props {
  value: AVS
  onChange: (v: AVS) => void
}

export default function AudioVoiceSettings({ value, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Volume2 className="w-5 h-5 text-[#00D9FF]" />
        <h2 className="text-lg font-bold">Audio y Voz</h2>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-slate-800">
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-sm font-bold">Sonidos de Interfaz</p>
            <p className="text-xs text-slate-400">Reproducir sonidos en acciones e interacciones</p>
          </div>
        </div>
        <button onClick={() => onChange({ ...value, interfaceSounds: !value.interfaceSounds })}
          className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${
            value.interfaceSounds ? 'bg-[#00D9FF]' : 'bg-slate-700'
          }`}>
          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
            value.interfaceSounds ? 'right-0.5' : 'left-0.5'
          }`} />
        </button>
      </div>

      <div>
        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
          <Volume1 className="w-3 h-3 inline mr-1" /> Volumen
        </label>
        <div className="flex items-center gap-3">
          <input type="range" min="0" max="100" value={value.volume}
            onChange={e => onChange({ ...value, volume: parseInt(e.target.value) })}
            className="flex-1 accent-[#00D9FF]" />
          <span className="text-xs text-slate-400 w-8 text-right">{value.volume}%</span>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">Voz de ELIANA</label>
        <select value={value.elianaVoice} onChange={e => onChange({ ...value, elianaVoice: e.target.value })}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00D9FF] outline-none">
          <option value="default">ELIANA — Voz predeterminada</option>
          <option value="suave">ELIANA — Suave</option>
          <option value="dinamica">ELIANA — Dinámica</option>
          <option value="profesional">ELIANA — Profesional</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-slate-800">
        <div className="flex items-center gap-3">
          <SkipForward className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-sm font-bold">Reproducción Automática</p>
            <p className="text-xs text-slate-400">ELIANA no hablará automáticamente al abrir una página</p>
          </div>
        </div>
        <button onClick={() => onChange({ ...value, autoPlay: !value.autoPlay })}
          className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${
            value.autoPlay ? 'bg-[#00D9FF]' : 'bg-slate-700'
          }`}>
          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
            value.autoPlay ? 'right-0.5' : 'left-0.5'
          }`} />
        </button>
      </div>

      <div>
        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">Velocidad de Voz</label>
        <div className="flex items-center gap-3">
          <input type="range" min="0.5" max="2" step="0.1" value={value.speechRate}
            onChange={e => onChange({ ...value, speechRate: parseFloat(e.target.value) })}
            className="flex-1 accent-[#00D9FF]" />
          <span className="text-xs text-slate-400 w-8 text-right">{value.speechRate}x</span>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-slate-800">
        <div className="flex items-center gap-3">
          <Subtitles className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-sm font-bold">Subtítulos</p>
            <p className="text-xs text-slate-400">Mostrar subtítulos en mensajes de voz</p>
          </div>
        </div>
        <button onClick={() => onChange({ ...value, subtitles: !value.subtitles })}
          className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${
            value.subtitles ? 'bg-[#00D9FF]' : 'bg-slate-700'
          }`}>
          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
            value.subtitles ? 'right-0.5' : 'left-0.5'
          }`} />
        </button>
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-slate-800">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-sm font-bold">Transcripción</p>
            <p className="text-xs text-slate-400">Transcribir mensajes de voz a texto</p>
          </div>
        </div>
        <button onClick={() => onChange({ ...value, transcription: !value.transcription })}
          className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${
            value.transcription ? 'bg-[#00D9FF]' : 'bg-slate-700'
          }`}>
          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
            value.transcription ? 'right-0.5' : 'left-0.5'
          }`} />
        </button>
      </div>

      <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mic className={`w-5 h-5 ${value.microphoneEnabled ? 'text-emerald-400' : 'text-slate-400'}`} />
            <div>
              <p className="text-sm font-bold">Micrófono</p>
              <p className="text-xs text-slate-400">El navegador solicitará permiso antes de utilizar el micrófono</p>
            </div>
          </div>
          <button onClick={() => {
            if (!value.microphoneEnabled) {
              navigator.mediaDevices?.getUserMedia({ audio: true })
                .then(() => onChange({ ...value, microphoneEnabled: true }))
                .catch(() => {})
            } else {
              onChange({ ...value, microphoneEnabled: false })
            }
          }}
            className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${
              value.microphoneEnabled ? 'bg-emerald-500' : 'bg-slate-700'
            }`}>
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
              value.microphoneEnabled ? 'right-0.5' : 'left-0.5'
            }`} />
          </button>
        </div>
      </div>

      <p className="text-[10px] text-slate-500">ELIANA no habla automáticamente al abrir una página. Todos los permisos de audio son solicitados explícitamente.</p>
    </div>
  )
}

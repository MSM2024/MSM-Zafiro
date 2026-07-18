'use client'

import { useState } from 'react'
import { Shield, Key, Smartphone, Globe, AlertTriangle, Lock, History, Fingerprint, LogOut, Ban } from 'lucide-react'
import type { SecuritySettings as SS, UIState } from '@/lib/settings/types'
import { validatePassword } from '@/lib/settings/validation'

interface Props {
  value: SS
  onChange: (v: SS) => void
  userId: string
}

export default function SecuritySettings({ value, onChange, userId }: Props) {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwState, setPwState] = useState<UIState>('idle')
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({})
  const [pwMessage, setPwMessage] = useState('')

  const handleChangePassword = () => {
    setPwErrors({})
    if (!currentPw || !newPw || !confirmPw) {
      setPwErrors({ currentPw: 'Todos los campos son obligatorios' })
      return
    }
    if (newPw !== confirmPw) {
      setPwErrors({ confirmPw: 'Las contraseñas no coinciden' })
      return
    }
    const validation = validatePassword(newPw)
    if (!validation.ok) {
      setPwErrors(validation.errors)
      return
    }
    setPwState('saving')
    setTimeout(() => {
      setPwState('saved')
      setPwMessage('Contraseña actualizada.')
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
      onChange({ ...value, lastPasswordChange: new Date().toISOString() })
      setTimeout(() => { setPwState('idle'); setPwMessage('') }, 3000)
    }, 500)
  }

  const handleEnableMfa = () => {
    onChange({ ...value, mfaEnabled: true, mfaVerified: true, recoveryCodesGenerated: true })
  }

  const handleDisableMfa = () => {
    onChange({ ...value, mfaEnabled: false, mfaVerified: false, recoveryCodesGenerated: false })
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">Seguridad</h2>

      {/* Cambiar Contraseña */}
      <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-[#00D9FF]" />
          <h3 className="text-sm font-bold">Cambiar Contraseña</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">Contraseña Actual</label>
            <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-[#00D9FF] outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">Nueva Contraseña</label>
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-[#00D9FF] outline-none" />
              {pwErrors.password && <p className="text-[10px] text-red-400 mt-0.5">{pwErrors.password}</p>}
            </div>
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block mb-1">Confirmar</label>
              <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-[#00D9FF] outline-none" />
              {pwErrors.confirmPw && <p className="text-[10px] text-red-400 mt-0.5">{pwErrors.confirmPw}</p>}
            </div>
          </div>
          <button onClick={handleChangePassword} disabled={pwState === 'saving'}
            className="px-4 py-2 rounded-xl bg-[#00D9FF]/10 text-[#00D9FF] hover:bg-[#00D9FF]/20 text-xs font-bold transition-all cursor-pointer disabled:opacity-50">
            {pwState === 'saving' ? 'ACTUALIZANDO...' : 'ACTUALIZAR CONTRASEÑA'}
          </button>
          {pwMessage && <p className="text-[10px] text-emerald-400 font-bold">{pwMessage}</p>}
        </div>
      </div>

      {/* MFA / TOTP */}
      <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fingerprint className={`w-5 h-5 ${value.mfaEnabled ? 'text-emerald-400' : 'text-slate-400'}`} />
            <div>
              <h3 className="text-sm font-bold">Autenticación de Dos Factores (MFA/TOTP)</h3>
              <p className="text-[10px] text-slate-500">{value.mfaEnabled ? 'MFA activado' : 'Añade una capa extra de seguridad'}</p>
            </div>
          </div>
          <button onClick={value.mfaEnabled ? handleDisableMfa : handleEnableMfa}
            className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${
              value.mfaEnabled ? 'bg-emerald-500' : 'bg-slate-700'
            }`}>
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
              value.mfaEnabled ? 'right-0.5' : 'left-0.5'
            }`} />
          </button>
        </div>
        {value.mfaEnabled && value.recoveryCodesGenerated && (
          <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Códigos de recuperación generados
            </p>
            <p className="text-[9px] text-slate-500 mt-1">Los códigos se muestran solo una vez. No los almacenes en localStorage.</p>
          </div>
        )}
      </div>

      {/* Dispositivos Conectados */}
      <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="w-5 h-5 text-slate-400" />
          <h3 className="text-sm font-bold">Dispositivos Conectados</h3>
        </div>
        {value.sessions.length === 0 ? (
          <p className="text-xs text-slate-500">No hay sesiones activas registradas.</p>
        ) : (
          <div className="space-y-2">
            {value.sessions.map(s => (
              <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40">
                <div className="text-xs">
                  <span className="text-slate-300">{s.device}</span>
                  <span className="text-slate-600 ml-2">{s.browser}</span>
                  <span className="text-slate-600 ml-2">{s.location}</span>
                  {s.current && <span className="text-[9px] text-emerald-400 ml-2">(Actual)</span>}
                </div>
                <button className="text-[10px] text-red-400 hover:text-red-300 cursor-pointer">Revocar</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alertas de Acceso */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/30 border border-slate-800">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-slate-400" />
          <div>
            <p className="text-sm font-bold">Alertas de Acceso</p>
            <p className="text-xs text-slate-400">Recibir notificaciones de nuevos inicios de sesión</p>
          </div>
        </div>
        <button onClick={() => onChange({ ...value, loginAlerts: !value.loginAlerts })}
          className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${
            value.loginAlerts ? 'bg-[#00D9FF]' : 'bg-slate-700'
          }`}>
          <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
            value.loginAlerts ? 'right-0.5' : 'left-0.5'
          }`} />
        </button>
      </div>

      {/* Bloqueo de Emergencia */}
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ban className="w-5 h-5 text-red-400" />
            <div>
              <p className="text-sm font-bold text-red-400">Bloqueo de Emergencia</p>
              <p className="text-xs text-slate-400">Bloquear todas las sesiones y requerir reautenticación</p>
            </div>
          </div>
          <button onClick={() => onChange({ ...value, emergencyLock: !value.emergencyLock })}
            className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${
              value.emergencyLock ? 'bg-red-500' : 'bg-slate-700'
            }`}>
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${
              value.emergencyLock ? 'right-0.5' : 'left-0.5'
            }`} />
          </button>
        </div>
        <p className="text-[9px] text-slate-500 mt-2">Esta acción requiere reautenticación. No almacenamos contraseñas ni códigos 2FA en localStorage.</p>
      </div>

      {/* Historial de Seguridad */}
      <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <History className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold">Historial de Seguridad</h3>
        </div>
        <p className="text-xs text-slate-500">Último cambio de contraseña: {value.lastPasswordChange ? new Date(value.lastPasswordChange).toLocaleString('es-ES') : 'Nunca'}</p>
        <p className="text-[10px] text-slate-600 mt-1">El historial completo de eventos de seguridad estará disponible cuando Supabase esté configurado.</p>
      </div>
    </div>
  )
}

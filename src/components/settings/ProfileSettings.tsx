'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, X, Eye, Camera } from 'lucide-react'
import type { UIState } from '@/lib/settings/types'
import { getProfile, updateProfile, type UserProfile } from '@/lib/profile'
import { validateProfile } from '@/lib/settings/validation'
import { getOfflineStatus } from '@/lib/settings/sync'

interface Props {
  userId: string
  profile: UserProfile | null
  onSaved?: () => void
}

export default function ProfileSettings({ userId, profile, onSaved }: Props) {
  const router = useRouter()
  const [fields, setFields] = useState<Record<string, string>>({
    name: profile?.name || '',
    username: profile?.username || '',
    bioShort: profile?.bioShort || '',
    title: profile?.title || '',
    location: profile?.location || '',
    website: profile?.website || '',
  })
  const [state, setState] = useState<UIState>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')

  const hasChanges = Object.entries(fields).some(([k, v]) => {
    const orig = profile?.[k as keyof UserProfile]
    return String(orig || '') !== v
  })

  const handleSave = () => {
    const validation = validateProfile(fields)
    setErrors(validation.errors)
    if (!validation.ok) {
      setState('error')
      setMessage('Revisa los campos señalados.')
      return
    }
    setState('saving')
    const offline = getOfflineStatus()
    const saved = updateProfile(userId, fields as Partial<UserProfile>)
    if (saved) {
      setState(offline ? 'sync_pending' : 'saved')
      setMessage(offline ? 'Se sincronizará al recuperar conexión.' : 'Preferencias guardadas.')
      onSaved?.()
    } else {
      setState('error')
      setMessage('Error al guardar el perfil.')
    }
    setTimeout(() => { setState('idle'); setMessage('') }, 3000)
  }

  const handleCancel = () => {
    setFields({
      name: profile?.name || '',
      username: profile?.username || '',
      bioShort: profile?.bioShort || '',
      title: profile?.title || '',
      location: profile?.location || '',
      website: profile?.website || '',
    })
    setErrors({})
    setState('idle')
    setMessage('')
  }

  const set = (k: string, v: string) => {
    setFields(prev => ({ ...prev, [k]: v }))
    if (errors[k]) setErrors(prev => { const n = { ...prev }; delete n[k]; return n })
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">Perfil Público</h2>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00D9FF] to-blue-600 flex items-center justify-center text-xl font-black">
            {(fields.name || '?').charAt(0).toUpperCase()}
          </div>
          <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <Camera className="w-5 h-5 text-white" />
          </button>
        </div>
        <div>
          <p className="font-bold">{fields.name || 'Sin nombre'}</p>
          <p className="text-xs text-slate-400">@{fields.username || userId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ['name', 'Nombre'],
          ['username', 'Nombre de Usuario'],
          ['title', 'Título Profesional'],
          ['location', 'Ubicación'],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">{label}</label>
            <input type="text" placeholder={label}
              value={fields[key] || ''}
              onChange={e => set(key, e.target.value)}
              className={`w-full mt-1 bg-slate-950/80 border ${errors[key] ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00D9FF] outline-none transition-colors`} />
            {errors[key] && <p className="text-[10px] text-red-400 mt-0.5">{errors[key]}</p>}
          </div>
        ))}
      </div>

      <div>
        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Biografía</label>
        <textarea placeholder="Cuéntanos sobre ti..."
          value={fields.bioShort || ''}
          onChange={e => set('bioShort', e.target.value)}
          rows={3}
          className={`w-full mt-1 bg-slate-950/80 border ${errors.bioShort ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00D9FF] outline-none transition-colors resize-none`} />
        {errors.bioShort && <p className="text-[10px] text-red-400 mt-0.5">{errors.bioShort}</p>}
      </div>

      <div>
        <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Sitio Web</label>
        <input type="url" placeholder="https://..."
          value={fields.website || ''}
          onChange={e => set('website', e.target.value)}
          className={`w-full mt-1 bg-slate-950/80 border ${errors.website ? 'border-red-500' : 'border-slate-800'} rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#00D9FF] outline-none transition-colors`} />
        {errors.website && <p className="text-[10px] text-red-400 mt-0.5">{errors.website}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={!hasChanges && state !== 'error'}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-blue-600 text-white text-xs font-bold cursor-pointer hover:opacity-90 transition-all disabled:opacity-40 flex items-center gap-2">
          <Save className="w-3.5 h-3.5" /> Guardar Cambios
        </button>
        {hasChanges && (
          <button onClick={handleCancel} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold cursor-pointer transition-all flex items-center gap-2">
            <X className="w-3.5 h-3.5" /> Cancelar
          </button>
        )}
        <button onClick={() => router.push('/profile-page')} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold cursor-pointer transition-all flex items-center gap-2">
          <Eye className="w-3.5 h-3.5" /> Vista Previa
        </button>
      </div>

      {message && (
        <p className={`text-[10px] font-bold flex items-center gap-1 ${
          state === 'error' ? 'text-red-400' :
          state === 'sync_pending' ? 'text-amber-400' :
          'text-emerald-400'
        }`}>
          {state === 'saved' && <Save className="w-3 h-3" />}
          {state === 'sync_pending' && <span className="w-2 h-2 rounded-full bg-amber-400" />}
          {message}
        </p>
      )}
    </div>
  )
}

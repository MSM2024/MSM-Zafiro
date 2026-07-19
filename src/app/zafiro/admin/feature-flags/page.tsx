'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import { isOwnerEmail } from '@/lib/owner'
import {
  getFeatureFlags, setFeatureFlag, resetFeatureFlags, getStageLabel,
  type FeatureFlagState, type FeatureFlag,
} from '@/lib/feature-flags'
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

export default function FeatureFlagsAdminPage() {
  usePageTitle('Feature Flags — ZAFIRO')
  const [flags, setFlags] = useState<FeatureFlagState[]>(() => getFeatureFlags())
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [authorized] = useState(() => {
    const session = getSession()
    return !!(session && isOwnerEmail(session.email))
  })
  const [sessionEmail] = useState(() => getSession()?.email || '')

  const handleToggle = async (flag: FeatureFlag, current: boolean) => {
    setLoading(flag)
    setMessage(null)

    const success = setFeatureFlag(flag, !current, isOwnerEmail(sessionEmail))
    if (success) {
      setFlags(getFeatureFlags())
      setMessage({ type: 'success', text: `Flag "${flag}" → ${!current ? 'ACTIVADO' : 'DESACTIVADO'}` })
    } else {
      setMessage({ type: 'error', text: `No se pudo cambiar "${flag}" — solo el OWNER puede modificar flags owner-only` })
    }
    setLoading(null)
  }

  const handleReset = () => {
    resetFeatureFlags()
    setFlags(getFeatureFlags())
    setMessage({ type: 'success', text: 'Flags reseteados a valores por defecto' })
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-lg font-bold mb-2">Acceso Restringido</h1>
          <p className="text-sm text-slate-400">Solo el OWNER_SUPERADMIN puede gestionar feature flags.</p>
          <Link href="/" className="text-[#00D9FF] text-sm mt-4 inline-block">Volver a ZAFIRO</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center border border-[#00D9FF]/20">
            <AlertTriangle className="w-5 h-5 text-[#00D9FF]" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black">Feature Flags</h1>
            <p className="text-xs text-slate-400">Control de despliegue canario — Frecuencia 369-777</p>
          </div>
          <button onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold hover:bg-red-500/20 transition-all cursor-pointer flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-xl text-xs font-bold ${
            message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <XCircle className="w-3 h-3 inline mr-1" />}
            {message.text}
          </div>
        )}

        <div className="space-y-2">
          {flags.map(f => (
            <div key={f.flag} className="p-4 rounded-2xl glass flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono">{f.flag}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                    f.stage === 'alpha' ? 'bg-red-500/10 text-red-400' :
                    f.stage === 'beta' ? 'bg-amber-500/10 text-amber-400' :
                    f.stage === 'canary' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-emerald-500/10 text-emerald-400'
                  }`}>{getStageLabel(f.stage)}</span>
                  {f.ownerOnly && <span className="text-[9px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded-full">OWNER</span>}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">{f.description}</p>
              </div>
              <button
                onClick={() => handleToggle(f.flag, f.enabled)}
                disabled={loading === f.flag}
                className={`relative w-12 h-6 rounded-full transition-all cursor-pointer ${
                  f.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                } ${loading === f.flag ? 'opacity-50' : ''}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                  f.enabled ? 'left-6' : 'left-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

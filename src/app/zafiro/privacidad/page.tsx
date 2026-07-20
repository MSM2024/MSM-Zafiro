'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { getActiveDocument, type LegalDocument } from '@/lib/legal/terms-engine'
import { ArrowLeft, Lock, Shield, CheckCircle2, XCircle, History } from 'lucide-react'
import { CONSENT_OPTIONS, getConsentPreferences, setConsentPreferences, recordConsentAction } from '@/lib/consent-engine'

export default function PrivacidadPage() {
  usePageTitle('Política de Privacidad — ZAFIRO')
  const [doc] = useState<LegalDocument | null>(() => getActiveDocument('privacy') || null)
  const [consent, setConsent] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)
  const [showLog, setShowLog] = useState(false)
  const [consentLog, setConsentLog] = useState<{ action: string; detail: string; timestamp: string }[]>([])

  useEffect(() => {
    setConsent(getConsentPreferences())
    setConsentLog(JSON.parse(localStorage.getItem("zafiro_consent_log") || "[]"))
  }, [])

  const toggle = (id: string) => {
    const opt = CONSENT_OPTIONS.find(o => o.id === id)
    if (opt?.required) return
    setConsent(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const save = () => {
    setConsentPreferences(consent)
    recordConsentAction("update", `Consent preferences updated: ${JSON.stringify(consent)}`)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setConsentLog(JSON.parse(localStorage.getItem("zafiro_consent_log") || "[]"))
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
            <Lock className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Política de Privacidad</h1>
            {doc && <p className="text-[10px] text-slate-500">Versión {doc.version} · {new Date(doc.createdAt).toLocaleDateString()}</p>}
          </div>
        </div>

        <div className="p-6 rounded-2xl glass mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-[#00D9FF]" />
            <h2 className="text-sm font-bold">Preferencias de Consentimiento</h2>
          </div>
          <p className="text-[10px] text-slate-500 mb-4">Gestiona cómo procesamos tus datos personales en el ecosistema ZAFIRO.</p>
          <div className="space-y-3">
            {CONSENT_OPTIONS.map(opt => {
              const enabled = consent[opt.id] ?? opt.required
              return (
                <div key={opt.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-800/30 transition-colors">
                  <button
                    onClick={() => toggle(opt.id)}
                    className={`shrink-0 mt-0.5 w-5 h-5 rounded border transition-all flex items-center justify-center ${
                      enabled ? "bg-[#00D9FF]/20 border-[#00D9FF] text-[#00D9FF]" : "border-slate-600 text-transparent"
                    } ${opt.required ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {enabled && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium">
                      {opt.label}
                      {opt.required && <span className="text-[9px] text-slate-500 ml-1">(requerido)</span>}
                    </p>
                    <p className="text-[9px] text-slate-500">{opt.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={save}
              className="px-4 py-1.5 rounded-lg bg-[#00D9FF]/20 text-[#00D9FF] text-xs font-medium hover:bg-[#00D9FF]/30 transition-all border border-[#00D9FF]/30"
            >
              {saved ? "✓ Guardado" : "Guardar Preferencias"}
            </button>
            <button
              onClick={() => setShowLog(!showLog)}
              className="text-[9px] text-slate-500 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <History className="w-3 h-3" /> Registro de cambios
            </button>
          </div>
          {showLog && (
            <div className="mt-3 p-2 rounded-lg bg-slate-900/50 border border-slate-800/50 max-h-32 overflow-y-auto">
              {consentLog.length === 0 ? (
                <p className="text-[9px] text-slate-600">Sin cambios registrados.</p>
              ) : (
                consentLog.slice().reverse().map((entry, i) => (
                  <p key={i} className="text-[8px] text-slate-500 font-mono">
                    [{new Date(entry.timestamp).toLocaleString()}] {entry.action}: {entry.detail}
                  </p>
                ))
              )}
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl glass">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-bold">Documento Legal</h2>
          </div>
          {doc ? (
            <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
              {doc.content}
            </pre>
          ) : (
            <p className="text-sm text-slate-500">Cargando...</p>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/zafiro/terminos" className="text-[10px] text-slate-500 hover:text-[#00D9FF] underline mx-2">Términos y Condiciones</Link>
          <Link href="/zafiro/reglas-comunidad" className="text-[10px] text-slate-500 hover:text-[#00D9FF] underline mx-2">Reglas de la Comunidad</Link>
        </div>
      </div>
    </div>
  )
}

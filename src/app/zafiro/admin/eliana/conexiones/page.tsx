'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plug, Power, PowerOff, RefreshCw, CheckCircle2, XCircle, Brain, Settings2 } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import { AVAILABLE_PROVIDERS, getProviderConfigs, saveProviderConfigs, getActiveProviders, getRoutingRule, setRoutingRule, testProviderConnection, type ProviderConfig } from "@/lib/ai-providers"

export default function ConexionesPage() {
  usePageTitle("Conexiones IA — ZAFIRO")
  const [configs, setConfigs] = useState<ProviderConfig[]>([])
  const [routing, setRouting] = useState(getRoutingRule())
  const [testing, setTesting] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setConfigs(getProviderConfigs())
  }, [])

  const updateProvider = (id: string, patch: Partial<ProviderConfig>) => {
    setConfigs(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p))
  }

  const save = () => {
    saveProviderConfigs(configs)
    setRoutingRule(routing as any)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const testAll = async () => {
    const results: Record<string, boolean> = {}
    for (const cfg of configs) {
      if (!cfg.apiKey) continue
      setTesting(cfg.id)
      results[cfg.id] = await testProviderConnection(cfg)
      setTestResults({ ...testResults, ...results })
    }
    setTesting(null)
  }

  const activeCount = getActiveProviders().length

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/zafiro/admin/eliana/panel" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a Admin ELIANA
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400/20 to-blue-400/20 border border-purple-500/30 flex items-center justify-center">
            <Brain className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-black">Conexiones de IA</h1>
            <p className="text-[10px] text-slate-400">{activeCount} de {AVAILABLE_PROVIDERS.length} proveedores activos</p>
          </div>
        </div>

        {/* Routing Strategy */}
        <div className="p-4 rounded-2xl glass border border-slate-800/30 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Settings2 className="w-4 h-4 text-[#00D9FF]" />
            <h2 className="text-sm font-bold">Estrategia de Enrutamiento</h2>
          </div>
          <div className="flex gap-2">
            {[
              { id: "manual", label: "Manual", desc: "Selección manual del proveedor" },
              { id: "auto", label: "Automático", desc: "Selección basada en capacidades" },
              { id: "fallback", label: "Fallback", desc: "Probar en orden de prioridad" },
            ].map(r => (
              <button key={r.id} onClick={() => setRouting(r.id as "manual" | "auto" | "fallback")}
                className={`flex-1 p-3 rounded-xl border text-left transition-all ${
                  routing === r.id
                    ? "bg-[#00D9FF]/10 border-[#00D9FF]/40 text-white"
                    : "bg-slate-900/40 border-slate-800/40 text-slate-400 hover:border-slate-700/60"
                }`}>
                <p className="text-xs font-bold">{r.label}</p>
                <p className="text-[8px] text-slate-500 mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Provider Cards */}
        <div className="space-y-3">
          {configs.map(cfg => (
            <div key={cfg.id} className={`p-4 rounded-2xl border transition-all ${
              cfg.enabled ? "glass border-slate-700/40" : "bg-slate-900/30 border-slate-800/20 opacity-60"
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cfg.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-white">{cfg.name}</p>
                    <p className="text-[9px] text-slate-500">{cfg.models.join(", ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {testResults[cfg.id] !== undefined && (
                    testResults[cfg.id]
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      : <XCircle className="w-3.5 h-3.5 text-red-400" />
                  )}
                  <button onClick={() => updateProvider(cfg.id, { enabled: !cfg.enabled })}
                    className={`p-1.5 rounded-lg transition-all ${
                      cfg.enabled ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800/50 text-slate-500"
                    }`}>
                    {cfg.enabled ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input value={cfg.apiKey} onChange={e => updateProvider(cfg.id, { apiKey: e.target.value })}
                  type="password" placeholder={`API Key (${cfg.keyEnv || "manual"})`}
                  className="flex-1 bg-slate-900/60 border border-slate-800/60 rounded-lg px-3 py-1.5 text-[10px] text-white placeholder-slate-600 focus:outline-none focus:border-[#00D9FF]/50 font-mono" />
                {cfg.customEndpoint !== undefined && (
                  <input value={cfg.customEndpoint || ""} onChange={e => updateProvider(cfg.id, { customEndpoint: e.target.value })}
                    placeholder="Endpoint custom (opcional)"
                    className="flex-1 bg-slate-900/60 border border-slate-800/60 rounded-lg px-3 py-1.5 text-[10px] text-white placeholder-slate-600 focus:outline-none focus:border-[#00D9FF]/50" />
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                {cfg.capabilities.map(c => (
                  <span key={c} className="text-[8px] px-1.5 py-0.5 rounded bg-slate-800/50 text-slate-500">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <button onClick={save}
            className="px-5 py-2 rounded-xl bg-[#00D9FF]/20 border border-[#00D9FF]/30 text-xs font-bold text-[#00D9FF] hover:bg-[#00D9FF]/30 transition-all cursor-pointer">
            {saved ? "✓ Guardado" : "Guardar Configuración"}
          </button>
          <button onClick={testAll} disabled={testing !== null}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300 hover:bg-slate-700/50 transition-all cursor-pointer">
            <RefreshCw className={`w-3 h-3 ${testing ? "animate-spin" : ""}`} />
            {testing ? "Probando..." : "Probar Conexiones"}
          </button>
        </div>

        <p className="mt-8 text-[9px] text-slate-600 text-center">
          Las claves API se almacenan localmente en el navegador. Nunca se envían a servidores externos no configurados.
        </p>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { isOwnerEmail } from '@/lib/owner'
import { getSession } from '@/lib/auth'
import {
  getCoreStatus, getProjectsStatus,
  type CoreStatus,
} from '@/lib/eliana/core/eliana-core'
import { getAgents, getAgentActions, getAllActions, type AIAgent, type AgentAction } from '@/lib/eliana/core/agent-registry'
import { getAllRules, addRule, updateRule, formatRulesForPrompt, type CentralRule } from '@/lib/eliana/core/rules-engine'
import { getSyncHistory, executeSyncFlow, type SyncEvent } from '@/lib/eliana/core/sync-protocol'
import {
  Activity, Cpu, Globe, BookOpen, Shield, RefreshCw, Plus, CheckCircle, XCircle,
} from 'lucide-react'

export default function AdminELIANACorePage() {
  usePageTitle('ELIANA CORE — Admin Central')
  const [authorized] = useState(() => {
    const session = getSession()
    return !!(session && isOwnerEmail(session.email))
  })
  const [tab, setTab] = useState<'overview' | 'agents' | 'rules' | 'sync' | 'actions'>('overview')
  const [status, setStatus] = useState<CoreStatus | null>(null)
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [rules, setRules] = useState<CentralRule[]>([])
  const [syncEvents, setSyncEvents] = useState<SyncEvent[]>([])
  const [actions, setActions] = useState<AgentAction[]>([])
  const [projects, setProjects] = useState<Array<{ name: string; status: string }>>([])
  const [newRule, setNewRule] = useState({ title: '', rule: '' })

  useEffect(() => {
    if (!authorized) return
    loadData()
  }, [authorized])

  function loadData() {
    setStatus(getCoreStatus())
    setAgents(getAgents())
    setRules(getAllRules())
    setSyncEvents(getSyncHistory(10))
    setActions(getAllActions(20))
    setProjects(getProjectsStatus())
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-bold mb-2">Acceso Restringido</h1>
          <p className="text-sm text-slate-400">Solo OWNER_SUPERADMIN.</p>
          <Link href="/" className="text-[#00D9FF] text-sm mt-4 inline-block">Volver</Link>
        </div>
      </div>
    )
  }

  const handleAddRule = () => {
    if (!newRule.title || !newRule.rule) return
    addRule(newRule.title, newRule.rule, 'don_miguel', ['all_agents'], ['manual'])
    setNewRule({ title: '', rule: '' })
    loadData()
  }

  const handleToggleRule = (id: string) => {
    const rule = rules.find(r => r.id === id)
    if (!rule) return
    updateRule(id, { status: rule.status === 'active' ? 'archived' : 'active' })
    loadData()
  }

  const handleSyncInstruction = () => {
    const instruction = prompt('Instrucción de Don Miguel para sincronizar:')
    if (!instruction) return
    executeSyncFlow(instruction, 'don_miguel', 'opencode')
    loadData()
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm">
          ← Volver a ZAFIRO
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center border border-[#00D9FF]/20">
            <Cpu className="w-5 h-5 text-[#00D9FF]" />
          </div>
          <div>
            <h1 className="text-2xl font-black">ELIANA CORE</h1>
            <p className="text-xs text-slate-400">Programación Centralizada de IA v{status?.version || '...'}</p>
          </div>
        </div>

        <nav className="flex gap-1 mb-6 overflow-x-auto">
          {[
            { id: 'overview' as const, label: 'Estado General', icon: Activity },
            { id: 'agents' as const, label: 'Agentes', icon: Globe },
            { id: 'rules' as const, label: 'Reglas', icon: Shield },
            { id: 'sync' as const, label: 'Sincronización', icon: RefreshCw },
            { id: 'actions' as const, label: 'Acciones', icon: BookOpen },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tab === t.id ? 'bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/20' : 'text-slate-400 hover:text-white hover:bg-slate-900/40'
              }`}>
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </nav>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl glass">
              <h2 className="text-sm font-bold mb-3">📋 Reglas</h2>
              <p className="text-[10px] font-mono text-slate-400 whitespace-pre-wrap">{status?.rules}</p>
            </div>
            <div className="p-6 rounded-2xl glass">
              <h2 className="text-sm font-bold mb-3">🤖 Agentes</h2>
              <p className="text-[10px] font-mono text-slate-400 whitespace-pre-wrap">{status?.agents}</p>
            </div>
            <div className="p-6 rounded-2xl glass">
              <h2 className="text-sm font-bold mb-3">🔄 Sincronización</h2>
              <p className="text-[10px] font-mono text-slate-400 whitespace-pre-wrap">{status?.sync}</p>
            </div>
            <div className="p-6 rounded-2xl glass">
              <h2 className="text-sm font-bold mb-3">📚 Dominios</h2>
              <p className="text-[10px] font-mono text-slate-400 whitespace-pre-wrap">{status?.domains}</p>
            </div>
            <div className="p-6 rounded-2xl glass md:col-span-2">
              <h2 className="text-sm font-bold mb-3">📦 Proyectos Sincronizados (13)</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {projects.map(p => (
                  <div key={p.name} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/60">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] font-mono text-slate-300">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 rounded-2xl glass md:col-span-2">
              <h2 className="text-sm font-bold mb-3">✅ Criterios de Aceptación</h2>
              <div className="space-y-2 text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-400" />ELIANA deja de responder genérico cuando hay conocimiento disponible</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-400" />Todas las IA usan la misma identidad y reglas activas</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-400" />Las respuestas se sincronizan desde la base central</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-400" />Los errores se guardan como aprendizaje corregido</div>
                <div className="flex items-center gap-2 text-slate-600"><XCircle className="w-3 h-3 text-slate-600" />Sin Supabase — persistencia limitada a localStorage</div>
                <div className="flex items-center gap-2 text-slate-600"><XCircle className="w-3 h-3 text-slate-600" />Sin pruebas automatizadas — verificación manual</div>
              </div>
            </div>
            <div className="p-6 rounded-2xl glass md:col-span-2">
              <h2 className="text-sm font-bold mb-3">⚡ Acción Rápida</h2>
              <button onClick={handleSyncInstruction}
                className="px-4 py-2 rounded-xl bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 text-xs font-bold hover:bg-[#00D9FF]/30 transition-all cursor-pointer flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Ejecutar Sincronización 369
              </button>
            </div>
          </div>
        )}

        {tab === 'agents' && (
          <div className="space-y-3">
            {agents.map(agent => {
              const agentActions = getAgentActions(agent.id, 5)
              return (
                <div key={agent.id} className="p-4 rounded-2xl glass">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${agent.status === 'connected' ? 'bg-emerald-400' : agent.status === 'error' ? 'bg-red-400' : 'bg-slate-600'}`} />
                      <h3 className="text-sm font-bold">{agent.name}</h3>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">{agent.id} · {agent.version}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-2">{agent.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {agent.capabilities.map(c => (
                      <span key={c} className="px-2 py-0.5 rounded-full bg-slate-950 text-[9px] font-mono text-slate-500">{c}</span>
                    ))}
                  </div>
                  {agentActions.length > 0 && (
                    <details className="mt-2">
                      <summary className="text-[9px] text-slate-600 cursor-pointer hover:text-slate-400">Últimas acciones</summary>
                      <div className="mt-2 space-y-1">
                        {agentActions.map(a => (
                          <div key={a.id} className="p-2 rounded-lg bg-slate-950 text-[9px] font-mono text-slate-500">
                            <span className={a.success ? 'text-emerald-400' : 'text-red-400'}>
                              {a.success ? '✓' : '✗'}
                            </span>{' '}
                            {a.intent} — {a.action}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {tab === 'rules' && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl glass mb-4">
              <h2 className="text-sm font-bold mb-3">Nueva Regla</h2>
              <div className="space-y-2 max-w-lg">
                <input value={newRule.title} onChange={e => setNewRule(f => ({ ...f, title: e.target.value }))}
                  placeholder="Título de la regla"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-[#00D9FF] outline-none" />
                <textarea value={newRule.rule} onChange={e => setNewRule(f => ({ ...f, rule: e.target.value }))}
                  placeholder="Contenido de la regla"
                  rows={3}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-[#00D9FF] outline-none font-mono" />
                <button onClick={handleAddRule}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Añadir Regla
                </button>
              </div>
            </div>
            {rules.map(r => (
              <div key={r.id} className={`p-4 rounded-2xl glass ${r.status !== 'active' ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      r.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      r.status === 'pending_validation' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-800 text-slate-500'
                    }`}>{r.status}</span>
                    <span className="text-[9px] font-mono text-slate-500">{r.id} v{r.version}</span>
                  </div>
                  <button onClick={() => handleToggleRule(r.id)}
                    className={`text-[9px] cursor-pointer ${r.status === 'active' ? 'text-red-400 hover:text-red-300' : 'text-emerald-400 hover:text-emerald-300'}`}>
                    {r.status === 'active' ? 'Archivar' : 'Activar'}
                  </button>
                </div>
                <h3 className="text-sm font-bold">{r.title}</h3>
                <p className="text-[10px] text-slate-400 mt-1">{r.rule}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] text-slate-600">Fuente: {r.source}</span>
                  <span className="text-[9px] text-slate-600">Scope: {r.scope.join(', ')}</span>
                  {r.tags.map((t: string) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-slate-950 text-[9px] font-mono text-slate-600">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'sync' && (
          <div className="space-y-3">
            <button onClick={handleSyncInstruction}
              className="px-4 py-2 rounded-xl bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 text-xs font-bold hover:bg-[#00D9FF]/30 transition-all cursor-pointer flex items-center gap-2 mb-4">
              <RefreshCw className="w-4 h-4" /> Nueva Sincronización
            </button>
            {syncEvents.map(e => (
              <div key={e.id} className="p-3 rounded-2xl glass flex items-start gap-3">
                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  e.status === 'completed' ? 'bg-emerald-400' :
                  e.status === 'failed' ? 'bg-red-400' : 'bg-amber-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-slate-400">{e.step.replace(/_/g, ' ')}</span>
                    <span className="text-[9px] text-slate-600">{new Date(e.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-1">{e.description}</p>
                  <span className="text-[9px] text-slate-600">Agente: {e.agentId}</span>
                </div>
              </div>
            ))}
            {syncEvents.length === 0 && (
              <div className="p-8 rounded-2xl glass text-center text-sm text-slate-500">
                No hay eventos de sincronización.
              </div>
            )}
          </div>
        )}

        {tab === 'actions' && (
          <div className="space-y-2">
            {actions.map(a => (
              <div key={a.id} className="p-3 rounded-2xl glass">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-bold ${a.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {a.success ? '✓' : '✗'}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400">{a.agentId}</span>
                  <span className="text-[9px] text-slate-600">{a.intent}</span>
                  <span className="text-[9px] text-slate-600 ml-auto">{new Date(a.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">Input: {a.input.slice(0, 200)}</p>
                <p className="text-[10px] text-slate-500 font-mono">Output: {a.output.slice(0, 200)}</p>
                {a.learning && (
                  <p className="text-[9px] text-amber-400 mt-1">🧠 {a.learning}</p>
                )}
              </div>
            ))}
            {actions.length === 0 && (
              <div className="p-8 rounded-2xl glass text-center text-sm text-slate-500">
                No hay acciones registradas.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

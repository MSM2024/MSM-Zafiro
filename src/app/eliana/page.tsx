'use client'

import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'motion/react'
import { usePageTitle } from '@/lib/usePageTitle'
import { getSession } from '@/lib/auth'
import { ELIANA_VERSION, ELIANA_LAST_UPDATED } from '@/lib/eliana/system-prompt'
import { getRecentTraces } from '@/lib/eliana/correlation'
import type { TraceStep } from '@/lib/eliana/correlation'
import { getStoredTraining } from '@/lib/eliana/owner-firewall'
import {
  Send, Bot, User, Sparkles, AlertTriangle, CheckCircle,
  RefreshCw, Wifi, Globe, Smartphone, Clock, Shield, Copy, Check,
} from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  intent?: string
  provider?: string
  model?: string
  sources?: string[]
  confidence?: string
  knowledgeUsed?: boolean
  correlationId?: string
}

const NEWS = [
  { date: '2026-07-18', text: 'ELIANA v1.0.1 — Nuevo clasificador unificado de intenciones (30+ intents)', icon: '🚀' },
  { date: '2026-07-18', text: 'WhatsApp: respuestas automáticas con Meta Graph API', icon: '📱' },
  { date: '2026-07-18', text: 'Firewall financiero con operation_id obligatorio', icon: '🛡️' },
  { date: '2026-07-18', text: 'Correlation ID en toda la pipeline para trazabilidad', icon: '🔍' },
  { date: '2026-07-18', text: 'STORE_ONLY para entrenamiento del owner — sin respuesta pública', icon: '✅' },
]

function ElianaChat() {
  usePageTitle('ELIANA — Centro de Inteligencia MSM')
  const searchParams = useSearchParams()
  const context = searchParams.get('context')

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [version, setVersion] = useState(ELIANA_VERSION)
  const [lastUpdated, setLastUpdated] = useState(ELIANA_LAST_UPDATED)
  const [traces, setTraces] = useState<TraceStep[]>([])
  const [tab, setTab] = useState<'chat' | 'info' | 'traces'>('chat')
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch { /* silent */ }
  }

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/eliana/chat')
      const data = await res.json()
      if (data.status === 'ok') {
        setStatus('connected')
        setVersion(data.version || ELIANA_VERSION)
        setLastUpdated(data.lastUpdated || ELIANA_LAST_UPDATED)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => { checkStatus() }, [checkStatus])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setError('')

    const userMsg: ChatMessage = { role: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const session = getSession()
      const res = await fetch('/api/eliana/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session: session ? { email: session.email } : undefined }),
      })
      const data = await res.json()
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        text: data.text || 'No se pudo generar una respuesta.',
        intent: data.intent,
        provider: data.provider,
        model: data.model,
        sources: data.sources,
        confidence: data.confidence,
        knowledgeUsed: data.knowledgeUsed,
        correlationId: data.correlationId,
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
      setTraces(getRecentTraces(10))
    }
  }, [input, loading])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#00D9FF] to-purple-400 bg-clip-text text-transparent">
              ELIANA — Centro de Inteligencia MSM
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              v{version} · {lastUpdated}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={status} />
            <button onClick={checkStatus}
              className="text-slate-400 hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[#1A1B3A] mb-6">
          {[
            { id: 'chat' as const, label: 'Chat', icon: Bot },
            { id: 'info' as const, label: 'Novedades', icon: Sparkles },
            { id: 'traces' as const, label: 'Actividad', icon: Clock },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${
                tab === t.id ? 'text-[#00D9FF] border-[#00D9FF]' : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}>
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>

        {tab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Info Panel */}
            <div className="hidden lg:block space-y-3">
              <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
                <h3 className="text-xs font-semibold text-white mb-3">Estado en Tiempo Real</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">ELIANA</span>
                    <span className="text-emerald-400">ACTIVA</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">WhatsApp</span>
                    <Smartphone className={`w-3 h-3 ${status === 'connected' ? 'text-emerald-400' : 'text-slate-500'}`} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Web</span>
                    <Globe className={`w-3 h-3 ${status === 'connected' ? 'text-emerald-400' : 'text-slate-500'}`} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Versión</span>
                    <span className="text-[#00D9FF]">{version}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Último deploy</span>
                    <span className="text-slate-300">{lastUpdated}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
                <h3 className="text-xs font-semibold text-white mb-3">Comandos Rápidos</h3>
                <div className="space-y-1.5 text-xs">
                  <p className="text-slate-400"><span className="text-[#00D9FF]">369</span> — Frecuencia Maestra</p>
                  <p className="text-slate-400"><span className="text-emerald-400">SHALON</span> — Saludo espiritual</p>
                  <p className="text-slate-400"><span className="text-amber-400">AYUDA</span> — Todos los comandos</p>
                  <p className="text-slate-400"><span className="text-purple-400">STATUS</span> — Estado del sistema</p>
                </div>
              </div>

              {traces.length > 0 && (
                <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-white mb-3">Actividad Reciente</h3>
                  <div className="space-y-1">
                    {traces.slice(-5).reverse().map((t, i) => (
                      <div key={i} className="text-[10px] text-slate-500 truncate">
                        <span className="text-slate-400">{t.step}</span> → {t.result}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chat */}
            <div className="lg:col-span-3 flex flex-col">
              <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl flex flex-col h-[60vh]">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 && (
                    <div className="text-center py-12">
                      <Bot className="w-12 h-12 text-[#00D9FF]/30 mx-auto mb-3" />
                      <p className="text-sm text-slate-400">Yo soy ELIANA, el núcleo sintético de ZAFIRO.</p>
                      <p className="text-xs text-slate-500 mt-1">Pregúntame lo que necesites.</p>
                    </div>
                  )}
                  {messages.map((msg, i) => {
                    const msgId = `msg-${i}`
                    return (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D9FF]/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-[#00D9FF]" />
                        </div>
                      )}
                      <div className={`group max-w-[80%] ${msg.role === 'user' ? 'bg-[#00D9FF]/10 border border-[#00D9FF]/20' : 'bg-[#050816] border border-[#1A1B3A]'} rounded-xl px-4 py-2.5`}>
                        <p className="text-sm text-white whitespace-pre-wrap">{msg.text}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {msg.role === 'assistant' && msg.provider && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              {msg.provider}{msg.model ? `/${msg.model}` : ''}
                            </span>
                          )}
                          {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                            <span className="text-[10px] text-[#00D9FF]/60">{msg.sources.length} fuente{msg.sources.length > 1 ? 's' : ''}</span>
                          )}
                          {msg.role === 'assistant' && msg.confidence && (
                            <span className={`text-[10px] ${
                              msg.confidence === 'high' ? 'text-emerald-400' :
                              msg.confidence === 'medium' ? 'text-amber-400' : 'text-slate-500'
                            }`}>{msg.confidence}</span>
                          )}
                          <span className="flex-1" />
                          {msg.role === 'assistant' && (
                            <button onClick={() => copyToClipboard(msg.text, msgId)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-white">
                              {copiedId === msgId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          )}
                          {msg.intent && (
                            <span className="text-[10px] text-slate-600">{msg.intent}</span>
                          )}
                        </div>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-emerald-400" />
                        </div>
                      )}
                    </div>
                    )
                  })}
                  {loading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D9FF]/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-[#00D9FF]" />
                      </div>
                      <div className="bg-[#050816] border border-[#1A1B3A] rounded-xl px-4 py-2.5">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-[#00D9FF] rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-[#00D9FF] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-[#00D9FF] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/5 rounded-lg px-3 py-2">
                      <AlertTriangle className="w-3 h-3" /> {error}
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="border-t border-[#1A1B3A] p-3">
                  <div className="flex gap-2">
                    <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                      placeholder="Escribe tu mensaje..."
                      rows={1}
                      className="flex-1 bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50 resize-none"
                    />
                    <button onClick={sendMessage} disabled={loading || !input.trim()}
                      className="bg-[#00D9FF]/10 text-[#00D9FF] px-3 py-2 rounded-lg hover:bg-[#00D9FF]/20 transition-colors disabled:opacity-30">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Novedades v{version}
              </h2>
              <div className="space-y-3">
                {NEWS.map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-slate-300">{item.text}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> Seguridad y Auditoría
              </h2>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-[#1A1B3A]/50">
                  <span className="text-slate-400">Firewall Financiero</span>
                  <span className="text-emerald-400">ACTIVO</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#1A1B3A]/50">
                  <span className="text-slate-400">Operation ID requerido</span>
                  <span className="text-emerald-400">OBLIGATORIO</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#1A1B3A]/50">
                  <span className="text-slate-400">Correlation ID</span>
                  <span className="text-emerald-400">ACTIVO</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#1A1B3A]/50">
                  <span className="text-slate-400">STORE_ONLY Training</span>
                  <span className="text-emerald-400">ACTIVO</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-400">Rate Limiting</span>
                  <span className="text-emerald-400">30 req/min</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'traces' && (
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00D9FF]" /> Trazas de Actividad
            </h2>
            {traces.length === 0 ? (
              <p className="text-xs text-slate-500">Sin actividad reciente. Envía un mensaje para ver trazas.</p>
            ) : (
              <div className="space-y-1.5 max-h-96 overflow-y-auto">
                {traces.slice().reverse().map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] py-1 border-b border-[#1A1B3A]/30 last:border-0">
                    <span className="text-slate-500 w-12 truncate font-mono">{t.correlationId.slice(-8)}</span>
                    <span className={`w-16 text-[10px] ${
                      t.result === 'success' || t.result === 'passed' || t.result === 'handled' || t.result === 'found' ? 'text-emerald-400' :
                      t.result === 'blocked' ? 'text-red-400' : 'text-slate-400'
                    }`}>{t.result}</span>
                    <span className="text-slate-400 w-20">{t.step}</span>
                    <span className="text-slate-500 truncate">{t.action}</span>
                    <span className="text-slate-600 text-[10px] ml-auto">{new Date(t.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'connected') {
    return (
      <div className="flex items-center gap-1.5 text-xs">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <span className="text-emerald-400">ELIANA ACTIVA</span>
      </div>
    )
  }
  if (status === 'checking') {
    return (
      <div className="flex items-center gap-1.5 text-xs">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-amber-400">Verificando...</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <AlertTriangle className="w-3 h-3 text-red-400" />
      <span className="text-red-400">Sin conexión</span>
    </div>
  )
}

export default function ElianaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-slate-400 text-sm">Cargando ELIANA...</div>
      </div>
    }>
      <ElianaChat />
    </Suspense>
  )
}

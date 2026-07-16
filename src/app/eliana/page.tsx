'use client'

import { Suspense, useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Send, Bot, Sparkles, Brain, BookOpen } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import ElianaDiamond from "@/components/ElianaDiamond"
import { getSealByNumber } from "@/lib/seals-data"

const PROVIDERS = [
  { id: "Gemini", label: "Gemini", icon: Brain, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", desc: "Google Gemini 1.5 Flash" },
  { id: "OpenAI", label: "OpenAI", icon: Sparkles, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", desc: "GPT-4o Mini" },
  { id: "Anthropic", label: "Anthropic", icon: Bot, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", desc: "Claude 3 Haiku" },
]

function ElianaContent() {
  usePageTitle("ELIANA — ZAFIRO")
  const searchParams = useSearchParams()
  const contextParam = searchParams.get('context') || ''
  const selloNum = contextParam.startsWith('sello-') ? parseInt(contextParam.replace('sello-', '')) : null
  const contextSeal = selloNum ? getSealByNumber(selloNum) : null

  const getInitialMessage = () => {
    if (contextSeal) {
      return `Bendiciones. Has llegado hasta el **Sello #${contextSeal.numero}** de *LOS 150 SELLOS DE LOS SALMOS*.\n\n**${contextSeal.referencia}** — *"${contextSeal.versiculo}"*\n\n**Tema:** ${contextSeal.tema}\n\nSoy **ELIANA**, tu guía inteligente en ZAFIRO. Puedo explicarte este versículo con palabras sencillas, ayudarte a convertirlo en oración, crear una declaración personal para ti, o recomendarte sellos relacionados con **${contextSeal.tema.toLowerCase()}**. ¿Cómo puedo acompañarte hoy?`
    }
    return "Soy **ELIANA**, el núcleo sintético de **ZAFIRO**. Puedo responder con 3 inteligencias artificiales distintas. Selecciona una abajo o simplemente pregúntame lo que necesites."
  }

  const [messages, setMessages] = useState<Array<{ role: "user" | "eliana"; text: string; provider?: string; model?: string }>>([
    { role: "eliana", text: getInitialMessage() }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [lastProvider, setLastProvider] = useState<string>("")
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText || input).trim()
    if (!text || loading) return
    setInput("")
    setMessages(prev => [...prev, { role: "user", text }])
    setLoading(true)
    try {
      const history = messages
        .filter(m => m.role === "user" || m.role === "eliana")
        .slice(-10)
        .map(m => ({ role: m.role === "eliana" ? "model" : "user", content: m.text }))

      const body: Record<string, unknown> = { message: text, history }
      if (selectedProvider) body.provider = selectedProvider

      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      const data = await res.json()
      const provider = data.provider || "local"
      const model = data.model || ""
      setLastProvider(provider)
      setMessages(prev => [...prev, { role: "eliana", text: data.text || "Lo siento, no pude procesar tu consulta.", provider, model }])
    } catch {
      setMessages(prev => [...prev, { role: "eliana", text: "Hubo un error de conexión. Intenta de nuevo.", provider: "error" }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const pills = contextSeal
    ? [ "Explícame este sello con palabras sencillas", "Ayúdame a orar con este sello", "¿Qué otros sellos hablan de " + contextSeal.tema.toLowerCase() + "?", "Crea una declaración personal para mí" ]
    : ["¿Qué es ZAFIRO?", "¿Cómo funciona ELIANA?", "Explícame la gemología", "Conecta mi universo"]

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-800/50 bg-[#050816]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={contextSeal ? `/sellos/${contextSeal.numero}` : "/"} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <ElianaDiamond size={24} variant="animated" />
              <div>
                <h1 className="text-sm font-black text-white leading-none">ELIANA</h1>
                <p className="text-[8px] text-slate-500 font-mono">Engine for Learning & Intelligence</p>
              </div>
            </div>
            {contextSeal && (
              <Link href={`/sellos/${contextSeal.numero}`} className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[8px] font-mono text-amber-400">
                <BookOpen className="w-3 h-3" /> Sello #{contextSeal.numero}
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            {PROVIDERS.map(p => {
              const isActive = lastProvider === p.id
              return (
                <div key={p.id} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] font-mono font-bold ${isActive ? `${p.bg} ${p.color} ${p.border} border` : "text-slate-600"}`}>
                  <p.icon className="w-3 h-3" />
                  {isActive && <span className="hidden sm:inline">{p.label}</span>}
                </div>
              )
            })}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4">
        <div ref={chatRef} className="flex-1 overflow-y-auto py-6 space-y-4 scroll-thin">
          {messages.length === 1 && (
            <div className="text-center pt-8 pb-4">
              <ElianaDiamond size={48} variant="halo" />
              <h2 className="text-lg font-black text-white mt-3">{contextSeal ? `Sello #${contextSeal.numero} — ${contextSeal.tema}` : "ELIANA Multi-IA"}</h2>
              <p className="text-[10px] text-slate-500 font-mono mt-1">{contextSeal ? contextSeal.referencia : "Conectada a 3 motores de inteligencia artificial"}</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/20"
                  : "glass text-slate-200 border border-slate-800/50"
              }`}>
                {msg.role === "eliana" && i > 0 && msg.provider && (
                  <div className="flex items-center gap-1.5 mb-1.5 pb-1.5 border-b border-slate-700/30">
                    {PROVIDERS.filter(p => p.id === msg.provider).map(p => <p.icon key={p.id} className={`w-3 h-3 ${p.color}`} />)}
                    <span className="text-[7px] font-mono text-slate-500">{msg.provider} · {msg.model || ""}</span>
                  </div>
                )}
                {msg.text.split("\n").map((line, j) => <p key={j}>{line}</p>)}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl glass flex gap-1.5">
                <span className="w-2 h-2 bg-[#00D9FF] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-[#00D9FF] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-[#00D9FF] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
        </div>

        {messages.length === 1 && !loading && (
          <div className="flex flex-wrap gap-2 justify-center pb-4">
            {pills.map((p, i) => (
              <button key={i} onClick={() => sendMessage(p)}
                className="px-3 py-1.5 rounded-xl text-[9px] font-mono border border-slate-700/50 text-slate-400 hover:text-white hover:border-[#00D9FF]/30 transition-all bg-slate-900/30 cursor-pointer">
                {p}
              </button>
            ))}
          </div>
        )}

        <div className="pb-4 space-y-2">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {PROVIDERS.map(p => {
              const isSelected = selectedProvider === p.id
              const Icon = p.icon
              return (
                <button key={p.id} onClick={() => setSelectedProvider(isSelected ? null : p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-bold transition-all border cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? `${p.bg} ${p.color} ${p.border}`
                      : "text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700"
                  }`}>
                  <Icon className="w-3 h-3" />
                  {p.label}
                  {isSelected && <span className="text-[7px] ml-1">✓</span>}
                </button>
              )
            })}
            {selectedProvider && (
              <button onClick={() => setSelectedProvider(null)}
                className="text-[8px] text-slate-600 hover:text-slate-400 font-mono px-2 cursor-pointer">
                Auto
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 glass rounded-2xl px-4 py-3 border border-slate-700/50 focus-within:border-[#00D9FF]/40 transition-colors">
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje..." disabled={loading}
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 outline-none"
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-gradient-to-r from-[#00D9FF] to-cyan-600 text-white disabled:opacity-30 transition-all cursor-pointer">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ElianaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <ElianaDiamond size={48} variant="halo" />
      </div>
    }>
      <ElianaContent />
    </Suspense>
  )
}

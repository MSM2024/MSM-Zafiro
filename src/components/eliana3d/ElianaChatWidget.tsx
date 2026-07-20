'use client'

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Send, Minus, Trash2, AlertTriangle } from "lucide-react"
import ElianaPortrait from "./ElianaPortrait"
import AIDisclosureBadge from "@/components/AIDisclosureBadge"

interface Message {
  role: "user" | "assistant"
  content: string
}

const suggestions = [
  "¿Qué es ZAFIRO?",
  "¿Quién es Don Miguel?",
  "Muéstrame el libro",
  "¿Cómo funciona la Frecuencia 369?",
]

const STORAGE_HISTORY = "zafiro_eliana_chat_history"

export default function ElianaChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HISTORY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch { /* silent */ }
    return [{ role: "assistant" as const, content: "Bienvenido a ZAFIRO. Soy ELIANA, tu asistente digital soberano. ¿En qué puedo ayudarte?" }]
  })
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [reduced, setReduced] = useState(false)
  const closePanel = useCallback(() => {
    setOpen(false)
    window.dispatchEvent(new CustomEvent("eliana:chat-close"))
  }, [])
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    const handler = () => {
      setOpen(true)
      window.dispatchEvent(new CustomEvent("eliana:chat-state", { detail: { open: true } }))
    }
    window.addEventListener("eliana:open", handler)
    return () => window.removeEventListener("eliana:open", handler)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })
  }, [messages, loading, reduced])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showClearConfirm) { setShowClearConfirm(false); return }
        closePanel()
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, showClearConfirm])

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMsg }])
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      })
      const data = await res.json()
      const reply = data.response || data.message || "No pude procesar tu solicitud."
      setMessages((prev) => [...prev, { role: "assistant", content: reply }])
    } catch {
      const lower = userMsg.toLowerCase()
      let reply = "Lo siento, no tengo una respuesta para eso ahora. Intenta preguntar de otra forma."
      if (lower.includes("qué es zafiro") || lower.includes("que es zafiro")) {
        reply = "ZAFIRO es el Universo Digital Soberano de MSM my store — un ecosistema de identidad, comercio, conocimiento y economía."
      } else if (lower.includes("don miguel") || lower.includes("quién es")) {
        reply = "Don Miguel Soria Martínez es el Fundador y Owner del ecosistema MSM."
      } else if (lower.includes("frecuencia 369") || lower.includes("369")) {
        reply = "La Frecuencia 369 es el ciclo de sincronización del ecosistema MSM — 3 días de reflexión, 6 de acción, 9 de cosecha."
      } else if (lower.includes("hola") || lower.includes("buenas")) {
        reply = "¡Hola! Soy ELIANA, tu asistente digital. ¿En qué puedo ayudarte?"
      } else if (lower.includes("libro")) {
        reply = "El libro 'DE CERO A DUEÑO DIGITAL' está disponible en la Biblioteca ZAFIRO. Puedes acceder desde /zafiro/biblioteca."
      }
      setMessages((prev) => [...prev, { role: "assistant", content: reply }])
    }
    setLoading(false)
  }, [input, loading])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const clearConversation = () => {
    setMessages([{ role: "assistant", content: "Bienvenido a ZAFIRO. Soy ELIANA, tu asistente digital soberano. ¿En qué puedo ayudarte?" }])
    setShowClearConfirm(false)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Chat con ELIANA"
            className="fixed bottom-6 right-4 z-[9999] w-[360px] max-w-[calc(100vw-2rem)] max-h-[600px] rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800/60 shadow-2xl flex flex-col overflow-hidden"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="shrink-0 flex items-center gap-3 p-3 border-b border-slate-800/60 bg-slate-900/80">
              <div className="relative">
                <ElianaPortrait size={32} animated={!reduced} showAura reduced />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white">ELIANA</p>
                <p className="text-[9px] text-slate-500">En l&iacute;nea</p>
              </div>
              <AIDisclosureBadge />
              <button
                onClick={() => setShowClearConfirm(true)}
                className="p-1 rounded-lg hover:bg-slate-800/50 text-slate-500 hover:text-red-400 transition-all"
                aria-label="Limpiar conversaci&oacute;n"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={closePanel}
                className="p-1 rounded-lg hover:bg-slate-800/50 text-slate-500 hover:text-white transition-all"
                aria-label="Minimizar chat"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={closePanel}
                className="p-1 rounded-lg hover:bg-slate-800/50 text-slate-500 hover:text-white transition-all"
                aria-label="Cerrar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
              {showClearConfirm && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <p className="text-[10px] text-red-300 flex-1">¿Borrar toda la conversaci&oacute;n?</p>
                  <button onClick={clearConversation} className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30">S&iacute;</button>
                  <button onClick={() => setShowClearConfirm(false)} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white">No</button>
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {msg.role === "assistant" && (
                    <div className="shrink-0 mt-0.5">
                      <ElianaPortrait size={20} animated={false} showAura={false} reduced />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-[#00D9FF]/20 text-white rounded-tr-sm"
                        : "bg-slate-800/50 text-slate-200 rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="shrink-0 mt-0.5">
                    <ElianaPortrait size={20} animated={false} showAura={false} reduced />
                  </div>
                  <div className="bg-slate-800/50 rounded-xl rounded-tl-sm px-3 py-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {messages.length <= 2 && !loading && (
              <div className="shrink-0 px-3 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(s); setTimeout(() => handleSend(), 100) }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/40 border border-slate-700/40 text-[9px] text-slate-400 hover:text-white hover:border-[#00D9FF]/30 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="shrink-0 p-3 border-t border-slate-800/60">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00D9FF]/30 transition-all"
                  disabled={loading}
                  aria-label="Mensaje para ELIANA"
                />
                <motion.button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="p-2 rounded-xl bg-[#00D9FF]/20 border border-[#00D9FF]/30 text-[#00D9FF] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#00D9FF]/30 transition-all"
                  whileTap={{ scale: 0.95 }}
                  aria-label="Enviar mensaje"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}

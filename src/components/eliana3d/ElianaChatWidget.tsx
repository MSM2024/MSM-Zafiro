'use client'

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Send, Minus, Sparkles, MessageCircle, ChevronDown } from "lucide-react"
import ElianaPortrait from "./ElianaPortrait"

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

export default function ElianaChatWidget() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "Bienvenido a ZAFIRO. Soy ELIANA, tu asistente digital soberano. ¿En qué puedo ayudarte?" }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [reduced, setReduced] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    const handler = () => setOpen(true)
    window.addEventListener("eliana:open", handler)
    return () => window.removeEventListener("eliana:open", handler)
  }, [])

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" })
  }, [messages, reduced])

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
      setMessages((prev) => [...prev, { role: "assistant", content: data.response || data.message || "No pude procesar tu solicitud." }])
    } catch {
      const localResponses: Record<string, string> = {
        "¿qué es zafiro?": "ZAFIRO es el Universo Digital Soberano de MSM my store — un ecosistema de identidad, comercio, conocimiento y economía.",
        "¿quién es don miguel?": "Don Miguel Soria Martínez es el Fundador y Owner del ecosistema MSM.",
        "frecuencia 369": "La Frecuencia 369 es el ciclo de sincronización del ecosistema MSM — 3 días de reflexión, 6 de acción, 9 de cosecha.",
        "hola": "¡Hola! Soy ELIANA, tu asistente digital. ¿En qué puedo ayudarte?",
      }
      const lower = userMsg.toLowerCase()
      let reply = "Lo siento, no tengo una respuesta para eso ahora. Intenta preguntar de otra forma."
      for (const [key, val] of Object.entries(localResponses)) {
        if (lower.includes(key)) { reply = val; break }
      }
      setMessages((prev) => [...prev, { role: "assistant", content: reply }])
    }
    setLoading(false)
  }, [input, loading])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <>
      {/* FAB */}
      {!open && (
        <motion.button
          className="fixed bottom-6 right-4 z-[9999] w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00D9FF] to-blue-600 shadow-lg shadow-[#00D9FF]/20 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#050816]" />
        </motion.button>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {open && !minimized && (
          <motion.div
            className="fixed bottom-6 right-4 z-[9999] w-[360px] max-w-[calc(100vw-2rem)] max-h-[600px] rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-800/60 shadow-2xl flex flex-col overflow-hidden"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="shrink-0 flex items-center gap-3 p-3 border-b border-slate-800/60 bg-slate-900/80">
              <div className="relative">
                <ElianaPortrait size={32} animated={false} showAura={false} reduced />
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white">ELIANA</p>
                <p className="text-[9px] text-slate-500">En línea · v1.1.0</p>
              </div>
              <button onClick={() => setMinimized(true)} className="p-1 rounded-lg hover:bg-slate-800/50 text-slate-500 hover:text-white transition-all">
                <Minus className="w-4 h-4" />
              </button>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-slate-800/50 text-slate-500 hover:text-white transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
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
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
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
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 2 && (
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

            {/* Input */}
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
                />
                <motion.button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="p-2 rounded-xl bg-[#00D9FF]/20 border border-[#00D9FF]/30 text-[#00D9FF] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#00D9FF]/30 transition-all"
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized indicator */}
      <AnimatePresence>
        {minimized && (
          <motion.button
            className="fixed bottom-6 right-4 z-[9999] flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-slate-800/60 shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setMinimized(false)}
          >
            <ElianaPortrait size={20} animated={false} showAura={false} reduced />
            <span className="text-xs text-white font-bold">ELIANA</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}

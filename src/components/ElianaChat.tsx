"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, Send, Loader2, Volume2, VolumeX, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "eliana";
  text: string;
  timestamp: number;
}

const STORAGE_KEY = "zafiro_eliana_chat";

function loadHistory(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages: Message[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-100)));
  } catch { /* quota */ }
}

export function ElianaChat({ fullScreen = false, onChat }: { fullScreen?: boolean; onChat?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [typingText, setTypingText] = useState("");
  const [typingIndex, setTypingIndex] = useState(-1);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => { setMessages(loadHistory()) }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  useEffect(() => {
    if (fullScreen) inputRef.current?.focus();
  }, [fullScreen]);

  useEffect(() => {
    if (typingIndex < 0 || typingIndex >= messages.length) return;
    const msg = messages[typingIndex];
    if (msg.role !== "eliana") return;
    if (typingText.length < msg.text.length) {
      const timer = setTimeout(() => {
        setTypingText(msg.text.slice(0, typingText.length + 3));
      }, 15);
      return () => clearTimeout(timer);
    }
  }, [typingText, typingIndex, messages]);

  const startTypingEffect = (msgIndex: number) => {
    setTypingText("");
    setTypingIndex(msgIndex);
  };

  const startListening = useCallback(() => {
    onChat?.();
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "es-MX";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-MX";
    utterance.rate = 1.1;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  const handleSend = useCallback(async (text?: string) => {
    const message = (text || input).trim();
    if (!message || loading) return;
    onChat?.();
    setInput("");
    const userMsg: Message = { role: "user", text: message, timestamp: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionText: message, language: "es" }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const answer = data.data?.answer || "Lo siento, no pude procesar tu pregunta.";
      const elianaMsg: Message = { role: "eliana", text: answer, timestamp: Date.now() };
      const finalMessages = [...newMessages, elianaMsg];
      setMessages(finalMessages);
      saveHistory(finalMessages);
      speak(answer);
      setTimeout(() => startTypingEffect(finalMessages.length - 1), 100);
    } catch {
      const fallback = getDemoResponse(message);
      const elianaMsg: Message = { role: "eliana", text: fallback, timestamp: Date.now() };
      const finalMessages = [...newMessages, elianaMsg];
      setMessages(finalMessages);
      saveHistory(finalMessages);
      speak(fallback);
      setTimeout(() => startTypingEffect(finalMessages.length - 1), 100);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, messages, speak]);

  const renderElianaText = (msg: Message, idx: number) => {
    if (idx === typingIndex && typingText.length < msg.text.length) {
      return (
        <>
          {typingText}
          <span className="animate-[cursorBlink_0.8s_infinite]" style={{ color: "#00d4ff" }}>▊</span>
        </>
      );
    }
    return msg.text;
  };

  return (
    <div className="eliana-chat flex flex-col flex-1 relative"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.03) 0%, transparent 60%)",
      }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: i % 2 === 0 ? "#00d4ff" : "#7c3aed",
              opacity: 0.15 + Math.random() * 0.15,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1] opacity-[0.06]">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[scanLine_3s_linear_infinite]" />
        <div className="absolute inset-0" style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,212,255,0.02) 3px, rgba(0,212,255,0.02) 4px)",
        }} />
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto flex flex-col gap-1.5 relative z-[2] ${fullScreen ? "p-3.5" : "p-1.5"}`}>
        {messages.length === 0 && (
          <div className={`text-center ${fullScreen ? "px-4 pt-9 pb-4" : "px-2 pt-4 pb-2"}`}>
            <div className="relative mx-auto mb-3" style={{ width: fullScreen ? 80 : 44, height: fullScreen ? 80 : 44 }}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 rounded-full blur-xl opacity-70 animate-pulse" style={{ animationDuration: "3s" }} />
              <div className="absolute inset-1.5 rounded-full bg-[url(/assets/ai-logo.svg)] bg-cover bg-center z-[2]"
                style={{ boxShadow: "0 0 30px rgba(0,212,255,0.4)" }}
              />
              <div className="absolute inset-0 rounded-full border border-cyan-400/15 animate-[spin_4s_linear_infinite]" />
              <div className="absolute -inset-1.5 rounded-full border border-dashed border-purple-500/10 animate-[spin_6s_linear_infinite_reverse]" />
            </div>
            <strong className={`block mb-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent uppercase tracking-widest ${fullScreen ? "text-lg" : "text-sm"}`}>
              <span className="glitch-text">ELIANA</span>
            </strong>
            {fullScreen && <p className="mx-auto max-w-[260px] text-gray-500 dark:text-white/40 text-xs">Terminal de conocimiento cuántico activada.</p>}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`animate-[fadeIn_0.3s_ease-out] ${fullScreen ? "max-w-[85%]" : "max-w-[92%]"}`}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div className={`
              ${fullScreen ? "px-3.5 py-2.5" : "px-2.5 py-1.5"}
              ${msg.role === "user"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl rounded-b-2xl rounded-br-sm"
                : "bg-gray-100/70 dark:bg-[#0a0e1e]/70 border border-cyan-400/10 text-gray-900 dark:text-gray-100 rounded-t-2xl rounded-b-2xl rounded-bl-sm"
              }
            `}>
              {msg.role === "eliana" && (
                <div className="flex items-center gap-1 mb-1 pb-0.5 border-b border-cyan-400/10">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                  <strong className="text-[9px] uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    ELIANA
                  </strong>
                  <span className="ml-auto text-[8px] text-cyan-400/30">
                    {new Date(msg.timestamp).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              )}
              <p className="m-0 whitespace-pre-wrap" style={{ fontSize: fullScreen ? 13 : 12, lineHeight: 1.4 }}>
                {msg.role === "eliana" ? renderElianaText(msg, i) : msg.text}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="self-start animate-[borderGlow_1.5s_ease-in-out_infinite]"
            style={{
              padding: fullScreen ? "14px 18px" : "8px 12px",
              borderRadius: "14px 14px 14px 4px",
              background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))",
              border: "1px solid rgba(0,212,255,0.15)",
              display: "flex", alignItems: "center", gap: 8,
              fontSize: fullScreen ? 13 : 11,
            }}
          >
            <Loader2 className={`${fullScreen ? "w-4 h-4" : "w-3 h-3"} animate-spin text-cyan-400`} />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent uppercase tracking-wider"
              style={{ fontSize: fullScreen ? 11 : 9 }}
            >
              PROCESANDO...
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-1 relative z-[2] p-1.5 border-t border-cyan-400/10 bg-white/30 dark:bg-black/20"
        style={{ padding: fullScreen ? "12px" : "6px" }}
      >
        <button
          onClick={listening ? stopListening : startListening}
          title={listening ? "Detener" : "Hablar por voz"}
          className="flex-shrink-0 grid place-items-center rounded-xl transition-all"
          style={{
            width: fullScreen ? 38 : 30, height: fullScreen ? 38 : 30,
            border: listening ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(0,212,255,0.15)",
            background: listening ? "rgba(239,68,68,0.1)" : "rgba(0,212,255,0.05)",
            color: listening ? "#ef4444" : "rgba(0,212,255,0.6)",
            cursor: "pointer",
            animation: listening ? "pulse 1s infinite" : "none",
          }}
        >
          {listening ? <MicOff className={fullScreen ? "w-4 h-4" : "w-3 h-3"} /> : <Mic className={fullScreen ? "w-4 h-4" : "w-3 h-3"} />}
        </button>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          placeholder={listening ? "Escuchando..." : "Pregúntale a ELIANA..."}
          disabled={listening}
          className="flex-1 min-w-0 rounded-xl border border-cyan-400/10 bg-white/20 dark:bg-black/30 text-gray-900 dark:text-gray-100 outline-none transition-colors placeholder-gray-400 dark:placeholder-white/30"
          style={{
            padding: fullScreen ? "10px 14px" : "7px 10px",
            fontSize: fullScreen ? 12 : 11,
          }}
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="flex-shrink-0 grid place-items-center rounded-xl border-0 transition-all"
          style={{
            width: fullScreen ? 38 : 30, height: fullScreen ? 38 : 30,
            background: input.trim() ? "linear-gradient(135deg, #2563ff, #7c3aed)" : "rgba(255,255,255,0.05)",
            color: input.trim() ? "#fff" : "rgba(255,255,255,0.2)",
            cursor: input.trim() ? "pointer" : "default",
          }}
        >
          {loading ? <Loader2 className={`${fullScreen ? "w-4 h-4" : "w-3 h-3"} animate-spin`} /> : <Send className={fullScreen ? "w-4 h-4" : "w-3 h-3"} />}
        </button>
      </div>

      {listening && (
        <div className="text-center text-[10px] text-red-500 py-1 font-mono tracking-wider animate-pulse relative z-[2]">
          🎤 CAPTURA DE SEÑAL ACTIVADA...
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}

function getDemoResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("hola") || q.includes("buenas")) return "¡Hola! Soy ELIANA, tu asistente de MSM Zafiro. ¿En qué puedo ayudarte hoy? Puedo responder preguntas, traducir textos o ayudarte a encontrar conocimiento.";
  if (q.includes("quién eres") || q.includes("quien eres")) return "Soy ELIANA, la inteligencia artificial de MSM Zafiro. Mi propósito es ayudarte a encontrar, crear y compartir conocimiento. Pienso contigo, no en tu lugar.";
  if (q.includes("qué es zafiro") || q.includes("que es zafiro")) return "MSM Zafiro es la red social del conocimiento + IA. Una plataforma donde las personas hacen preguntas, la IA responde primero, los expertos validan y la comunidad construye conocimiento vivo. Cada pregunta construye el futuro.";
  if (q.includes("traduce") || q.includes("translate")) return "¡Claro! Puedo traducir textos entre idiomas. Solo envíame el texto y dime a qué idioma. Por ejemplo: 'Traduce Hello world al español.'";
  if (q.includes("resume") || q.includes("resumir")) return "Puedo resumir textos largos para ti. Envíame el texto que quieres resumir y te daré los puntos clave.";
  if (q.includes("gracias")) return "¡De nada! Recuerda que en Zafiro cada pregunta construye el futuro. ¿Quieres preguntar algo más?";
  return "Entiendo tu pregunta. En MSM Zafiro, cada pregunta es una semilla de conocimiento. Te recomiendo publicarla para que la comunidad y yo podamos construir juntos una respuesta completa. ¿Quieres que te ayude a formular tu pregunta?";
}

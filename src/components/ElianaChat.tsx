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

export function ElianaChat({ fullScreen = false }: { fullScreen?: boolean }) {
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

  // Typing effect for ELIANA responses
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
          <span className="cursor-blink" style={{ animation: "cursorBlink 0.8s infinite", color: "#00d4ff" }}>▊</span>
        </>
      );
    }
    return msg.text;
  };

  return (
    <div className="eliana-chat" style={{
      display: "flex", flexDirection: "column",
      height: fullScreen ? "100%" : "100%",
      maxHeight: fullScreen ? "none" : "420px",
      position: "relative",
      background: "radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.03) 0%, transparent 60%)",
    }}>
      {/* Floating particles */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0,
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            borderRadius: "50%",
            background: i % 2 === 0 ? "#00d4ff" : "#7c3aed",
            opacity: 0.15 + Math.random() * 0.15,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }} />
        ))}
      </div>

      {/* Scan line */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 1, opacity: 0.06,
      }}>
        <div style={{
          position: "absolute", left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent, #00d4ff, transparent)",
          animation: "scanLine 3s linear infinite",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,212,255,0.02) 3px, rgba(0,212,255,0.02) 4px)",
        }} />
      </div>

      {/* Messages */}
      <div className="chat-messages" style={{
        flex: 1, overflowY: "auto", padding: fullScreen ? "14px" : "6px",
        display: "flex", flexDirection: "column", gap: 6, position: "relative", zIndex: 2,
      }}>
        {messages.length === 0 && (
          <div className="chat-empty" style={{
            textAlign: "center", padding: fullScreen ? "36px 16px" : "16px 8px",
            color: "var(--muted)", fontSize: fullScreen ? 13 : 11, lineHeight: 1.5,
          }}>
            <div style={{
              position: "relative", width: fullScreen ? 80 : 44, height: fullScreen ? 80 : 44, margin: "0 auto 12px",
            }}>
              <div className="neon-glow" style={{
                position: "absolute", inset: fullScreen ? 8 : 4, borderRadius: "50%",
                background: "url(/assets/ai-logo.svg) center / cover no-repeat",
                boxShadow: "0 0 30px rgba(0,212,255,0.4), 0 0 60px rgba(124,58,237,0.2)",
                animation: "neonPulse 2s ease-in-out infinite",
                zIndex: 2,
              }} />
              <div style={{
                position: "absolute", inset: fullScreen ? 0 : -2, borderRadius: "50%",
                border: "1px solid rgba(0,212,255,0.15)",
                animation: "spin 4s linear infinite",
              }} />
              <div style={{
                position: "absolute", inset: fullScreen ? -6 : -5, borderRadius: "50%",
                border: "1px dashed rgba(124,58,237,0.1)",
                animation: "spin 6s linear infinite reverse",
              }} />
            </div>
            <strong style={{
              display: "block", marginBottom: 4,
              background: "linear-gradient(135deg, #00d4ff, #7c3aed, #d946ef)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontSize: fullScreen ? 17 : 13, letterSpacing: fullScreen ? 2 : 1, textTransform: "uppercase",
            }}>
              <span className="glitch-text">ELIANA</span>
            </strong>
            {fullScreen && <p style={{ margin: "0 auto", maxWidth: 260, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Terminal de conocimiento cuántico activada.</p>}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            maxWidth: fullScreen ? "85%" : "92%",
            padding: fullScreen ? "10px 14px" : "6px 10px",
            borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
            background: msg.role === "user"
              ? "linear-gradient(135deg, #2563ff, #7c3aed)"
              : "rgba(10,14,30,0.7)",
            border: msg.role === "eliana" ? "1px solid rgba(0,212,255,0.1)" : "none",
            color: msg.role === "user" ? "#fff" : "var(--text)",
            fontSize: fullScreen ? 13 : 12,
            lineHeight: 1.4,
            animation: "fadeIn 0.3s ease-out",
          }}>
            {msg.role === "eliana" && (
              <div style={{
                display: "flex", alignItems: "center", gap: 4, marginBottom: 4,
                paddingBottom: 3, borderBottom: "1px solid rgba(0,212,255,0.06)",
              }}>
                <Sparkles className="w-2.5 h-2.5" style={{ color: "#00d4ff" }} />
                <strong style={{
                  fontSize: 9, textTransform: "uppercase", letterSpacing: 1,
                  background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  ELIANA
                </strong>
                <span style={{ marginLeft: "auto", fontSize: 8, color: "rgba(0,212,255,0.3)" }}>
                  {new Date(msg.timestamp).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            )}
            <p style={{ margin: 0, whiteSpace: "pre-wrap", fontSize: fullScreen ? 13 : 12 }}>
              {msg.role === "eliana" ? renderElianaText(msg, i) : msg.text}
            </p>
          </div>
        ))}

        {loading && (
          <div style={{
            alignSelf: "flex-start",
            padding: fullScreen ? "14px 18px" : "8px 12px",
            borderRadius: "14px 14px 14px 4px",
            background: "rgba(10,14,30,0.7)",
            border: "1px solid rgba(0,212,255,0.08)",
            display: "flex", alignItems: "center", gap: 8, fontSize: fullScreen ? 13 : 11, color: "var(--muted)",
            animation: "borderGlow 1.5s ease-in-out infinite",
          }}>
            <Loader2 className="w-3 h-3 animate-spin" style={{ color: "#00d4ff" }} />
            <span style={{
              background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontSize: fullScreen ? 11 : 9, letterSpacing: 1,
            }}>
              PROCESANDO...
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area" style={{
        padding: fullScreen ? "12px" : "6px",
        borderTop: "1px solid rgba(0,212,255,0.06)",
        display: "flex", gap: 4, alignItems: "center",
        background: "rgba(0,0,0,0.2)",
        position: "relative", zIndex: 2,
      }}>
        <button
          onClick={listening ? stopListening : startListening}
          title={listening ? "Detener" : "Hablar por voz"}
          style={{
            width: fullScreen ? 38 : 30, height: fullScreen ? 38 : 30,
            border: listening ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(0,212,255,0.15)", borderRadius: 10,
            background: listening ? "rgba(239,68,68,0.1)" : "rgba(0,212,255,0.05)",
            color: listening ? "#ef4444" : "rgba(0,212,255,0.6)", cursor: "pointer",
            display: "grid", placeItems: "center", flex: "0 0 auto",
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
          style={{
            flex: 1, minWidth: 0,
            padding: fullScreen ? "10px 14px" : "7px 10px",
            border: "1px solid rgba(0,212,255,0.08)", borderRadius: 12,
            background: "rgba(0,0,0,0.3)", color: "var(--text)",
            outline: "none", fontSize: fullScreen ? 12 : 11,
            transition: "border-color 0.3s",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)" }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.08)" }}
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          style={{
            width: fullScreen ? 38 : 30, height: fullScreen ? 38 : 30,
            border: 0, borderRadius: 10,
            background: input.trim() ? "linear-gradient(135deg, #2563ff, #7c3aed)" : "rgba(255,255,255,0.05)",
            color: input.trim() ? "#fff" : "rgba(255,255,255,0.2)", cursor: input.trim() ? "pointer" : "default",
            display: "grid", placeItems: "center", flex: "0 0 auto",
          }}
        >
          {loading ? <Loader2 className={`${fullScreen ? "w-4 h-4" : "w-3 h-3"} animate-spin`} /> : <Send className={fullScreen ? "w-4 h-4" : "w-3 h-3"} />}
        </button>
      </div>

      {listening && (
        <div style={{
          textAlign: "center", fontSize: 10, color: "#ef4444", padding: "4px 0", fontFamily: "monospace", letterSpacing: 1,
          animation: "pulse 1s infinite",
          position: "relative", zIndex: 2,
        }}>
          🎤 CAPTURA DE SEÑAL ACTIVADA...
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
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

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
        flex: 1, overflowY: "auto", padding: fullScreen ? "16px" : "8px",
        display: "flex", flexDirection: "column", gap: 8, position: "relative", zIndex: 2,
      }}>
        {messages.length === 0 && (
          <div className="chat-empty" style={{
            textAlign: "center", padding: "36px 16px",
            color: "var(--muted)", fontSize: 13, lineHeight: 1.6,
          }}>
            {/* Animated orbit rings */}
            <div style={{
              position: "relative", width: 80, height: 80, margin: "0 auto 16px",
            }}>
              <div className="neon-glow" style={{
                position: "absolute", inset: 8, borderRadius: "50%",
                background: "url(/assets/ai-logo.svg) center / cover no-repeat",
                boxShadow: "0 0 30px rgba(0,212,255,0.4), 0 0 60px rgba(124,58,237,0.2)",
                animation: "neonPulse 2s ease-in-out infinite",
                zIndex: 2,
              }} />
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                border: "1px solid rgba(0,212,255,0.15)",
                animation: "spin 4s linear infinite",
              }} />
              <div style={{
                position: "absolute", inset: -6, borderRadius: "50%",
                border: "1px dashed rgba(124,58,237,0.1)",
                animation: "spin 6s linear infinite reverse",
              }} />
            </div>
            <strong style={{
              display: "block", marginBottom: 4,
              background: "linear-gradient(135deg, #00d4ff, #7c3aed, #d946ef)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontSize: 17, letterSpacing: 2, textTransform: "uppercase",
            }}>
              <span className="glitch-text">ELIANA</span>
            </strong>
            <p style={{ margin: "0 auto", maxWidth: 260, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
              Terminal de conocimiento cuántico activada. Pregunta lo que quieras saber.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "85%",
            padding: "10px 14px",
            borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            background: msg.role === "user"
              ? "linear-gradient(135deg, #2563ff, #7c3aed)"
              : "rgba(10,14,30,0.7)",
            border: msg.role === "eliana" ? "1px solid rgba(0,212,255,0.1)" : "none",
            boxShadow: msg.role === "eliana" ? "0 0 20px rgba(0,212,255,0.03)" : "none",
            color: msg.role === "user" ? "#fff" : "var(--text)",
            fontSize: 13,
            lineHeight: 1.5,
            position: "relative",
            animation: "fadeIn 0.3s ease-out",
          }}>
            {msg.role === "eliana" && (
              <div style={{
                display: "flex", alignItems: "center", gap: 6, marginBottom: 6,
                paddingBottom: 4, borderBottom: "1px solid rgba(0,212,255,0.06)",
              }}>
                <Sparkles className="w-3 h-3" style={{ color: "#00d4ff" }} />
                <strong style={{
                  fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5,
                  background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  ELIANA v2.0
                </strong>
                <span style={{ marginLeft: "auto", fontSize: 9, color: "rgba(0,212,255,0.3)" }}>
                  {new Date(msg.timestamp).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            )}
            <p style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: msg.role === "eliana" ? "'Inter', monospace" : "inherit" }}>
              {msg.role === "eliana" ? renderElianaText(msg, i) : msg.text}
            </p>
          </div>
        ))}

        {loading && (
          <div style={{
            alignSelf: "flex-start",
            padding: "14px 18px",
            borderRadius: "18px 18px 18px 4px",
            background: "rgba(10,14,30,0.7)",
            border: "1px solid rgba(0,212,255,0.08)",
            display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--muted)",
            animation: "borderGlow 1.5s ease-in-out infinite",
            fontFamily: "monospace",
          }}>
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: "#00d4ff" }} />
            <span style={{
              background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              fontSize: 11, letterSpacing: 1,
            }}>
              PROCESANDO...
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area" style={{
        padding: fullScreen ? "12px" : "8px",
        borderTop: "1px solid rgba(0,212,255,0.06)",
        display: "flex", gap: 6, alignItems: "center",
        background: "rgba(0,0,0,0.2)",
        position: "relative", zIndex: 2,
      }}>
        <button
          onClick={listening ? stopListening : startListening}
          title={listening ? "Detener" : "Hablar por voz"}
          style={{
            width: 38, height: 38, border: listening ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(0,212,255,0.15)", borderRadius: 12,
            background: listening ? "rgba(239,68,68,0.1)" : "rgba(0,212,255,0.05)",
            color: listening ? "#ef4444" : "rgba(0,212,255,0.6)", cursor: "pointer",
            display: "grid", placeItems: "center", flex: "0 0 auto",
            animation: listening ? "pulse 1s infinite" : "none",
            transition: "all 0.2s",
          }}
        >
          {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          placeholder={listening ? "Escuchando..." : "Señal neuronal detectada. Transmite tu pregunta..."}
          disabled={listening}
          style={{
            flex: 1, minWidth: 0,
            padding: "10px 14px", border: "1px solid rgba(0,212,255,0.08)", borderRadius: 14,
            background: "rgba(0,0,0,0.3)", color: "var(--text)",
            outline: "none", fontSize: 12, fontFamily: "'Inter', monospace",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"; e.currentTarget.style.boxShadow = "0 0 15px rgba(0,212,255,0.05)" }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(0,212,255,0.08)"; e.currentTarget.style.boxShadow = "none" }}
        />

        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          title={voiceEnabled ? "Silenciar" : "Activar voz"}
          style={{
            width: 38, height: 38, border: "1px solid rgba(0,212,255,0.15)", borderRadius: 12,
            background: "rgba(0,212,255,0.05)",
            color: voiceEnabled ? "#00d4ff" : "rgba(255,255,255,0.2)", cursor: "pointer",
            display: "grid", placeItems: "center", flex: "0 0 auto",
            transition: "all 0.2s",
          }}
        >
          {speaking ? <Loader2 className="w-4 h-4 animate-spin" /> : voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          style={{
            width: 38, height: 38, border: 0, borderRadius: 12,
            background: input.trim() ? "linear-gradient(135deg, #2563ff, #7c3aed)" : "rgba(255,255,255,0.05)",
            color: input.trim() ? "#fff" : "rgba(255,255,255,0.2)", cursor: input.trim() ? "pointer" : "default",
            display: "grid", placeItems: "center", flex: "0 0 auto",
            transition: "all 0.2s",
          }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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

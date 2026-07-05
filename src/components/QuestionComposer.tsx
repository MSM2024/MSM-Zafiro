"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const RELATED_QUESTIONS = [
  "¿Cómo cambiará la IA la educación en los próximos 10 años?",
  "¿Cuáles son las mejores formas de aprender con inteligencia artificial?",
  "¿Puede una IA reemplazar a un profesor o solo ayudarlo?",
];

export function QuestionComposer() {
  const [value, setValue] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [status, setStatus] = useState("AI is understanding your intent...");
  const router = useRouter();

  function handleSubmit() {
    if (!value.trim()) return;
    const q = encodeURIComponent(value.trim());
    router.push(`/question?q=${q}`);
  }

  return (
    <div className="composer" style={{
      position: "relative", width: "min(850px, 100%)", margin: "0 auto",
      padding: 18, border: "1px solid var(--border)", borderRadius: 30,
      background: "var(--surface)", boxShadow: "0 24px 80px var(--shadow)",
      backdropFilter: "blur(24px)",
    }}>
      <div className="input-row" style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span className="ai-orb" aria-hidden="true" style={{
          width: 32, height: 32, borderRadius: 12,
          background: "url(/assets/ai-logo.svg) center / cover no-repeat",
          boxShadow: "0 0 0 0 rgba(0, 212, 255, 0.55)",
          animation: "pulse 1.5s infinite", flex: "0 0 auto",
        }} />
        <input
          aria-label="Pregunta"
          placeholder="Ask anything..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setShowPanel(e.target.value.trim().length > 0);
            if (e.target.value.trim().length < 18) {
              setStatus("AI is understanding your intent...");
            } else {
              setStatus("AI found similar questions before creating a duplicate.");
            }
          }}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          style={{
            width: "100%", border: 0, outline: 0, background: "transparent",
            color: "var(--text)", fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 650,
          }}
        />
        <button
          className="send-button"
          onClick={handleSubmit}
          aria-label="Enviar pregunta"
          style={{
            width: 52, height: 52, border: 0, borderRadius: 19, color: "white",
            background: "linear-gradient(135deg, #2563ff, #7c3aed)",
            fontSize: 22, flex: "0 0 auto", cursor: "pointer",
            boxShadow: "0 16px 40px rgba(37,99,255,0.28)",
          }}
        >
          →
        </button>
      </div>
      {showPanel && (
        <div className="ai-panel visible" style={{
          marginTop: 16, padding: 14, border: "1px solid var(--border)",
          borderRadius: 22, background: "rgba(37,99,255,0.06)", textAlign: "left",
        }}>
          <div className="ai-status" style={{ display: "flex", alignItems: "center", gap: 9, color: "var(--muted)", fontSize: 13, marginBottom: 12 }}>
            <span className="thinking-dot" style={{ width: 8, height: 8, borderRadius: 999, background: "#00d4ff", boxShadow: "0 0 22px rgba(0,212,255,0.9)" }} />
            <span>{status}</span>
          </div>
          <div className="suggestions" style={{ display: "grid", gap: 8 }}>
            {RELATED_QUESTIONS.map((q, i) => (
              <button
                key={q}
                className="suggestion"
                type="button"
                onClick={() => { setValue(q); setShowPanel(true); }}
                style={{
                  display: "flex", justifyContent: "space-between", gap: 14,
                  padding: "10px 12px", border: "1px solid var(--border)", borderRadius: 16,
                  color: "var(--text)", background: "var(--surface-strong)",
                  fontSize: 14, cursor: "pointer", width: "100", textAlign: "left",
                }}
              >
                <span>{q}</span>
                <span style={{ color: "var(--muted)" }}>{92 - i * 7}% match</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

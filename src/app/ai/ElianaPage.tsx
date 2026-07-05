"use client";

import { ElianaChat } from "@/components/ElianaChat";

export function ElianaPage() {
  return (
    <div className="eliana-fullscreen" style={{
      display: "grid", gridTemplateColumns: "1fr 360px", gap: 16,
      minHeight: "calc(100vh - 200px)", alignItems: "start",
    }}>
      {/* Left: Hero + Info */}
      <div className="eliana-hero" style={{
        display: "grid", gap: 24, alignContent: "start",
      }}>
        <div className="panel" style={{
          padding: 28, border: "1px solid var(--border)", borderRadius: 28,
          background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)",
          backdropFilter: "blur(22px)", textAlign: "center",
        }}>
          <div className="ai-orb" style={{
            width: 80, height: 80, borderRadius: 24, margin: "0 auto 16px",
            background: "url(/assets/ai-logo.svg) center / cover no-repeat",
            boxShadow: "0 0 40px rgba(0,212,255,0.4)",
            animation: "pulse 2s infinite",
          }} />
          <h1 style={{ margin: "0 0 8px", fontSize: 32, lineHeight: 1.1 }}>
            ELIANA
          </h1>
          <p style={{ color: "#00d4ff", fontSize: 14, margin: "0 0 16px" }}>
            Asistente Virtual de MSM Zafiro
          </p>
          <p style={{ maxWidth: 500, margin: "0 auto", color: "var(--muted)", lineHeight: 1.6, fontSize: 14 }}>
            ELIANA es la inteligencia artificial que piensa contigo. Responde preguntas, traduce, resume y te ayuda a construir conocimiento. Habla con ella por texto o por voz.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { title: "Responder", desc: "Pregunta cualquier cosa y ELIANA te responde al instante con información rigurosa." },
            { title: "Traducir", desc: "Pide una traducción a cualquier idioma. ELIANA traduce manteniendo el contexto." },
            { title: "Resumir", desc: "Pega un texto largo y ELIANA lo resume en segundos sin perder lo importante." },
          ].map((f) => (
            <div key={f.title} className="panel" style={{
              padding: 18, border: "1px solid var(--border)", borderRadius: 20,
              background: "var(--surface)", fontSize: 13, lineHeight: 1.5,
            }}>
              <strong style={{ display: "block", marginBottom: 4, color: "#00d4ff" }}>{f.title}</strong>
              <span style={{ color: "var(--muted)" }}>{f.desc}</span>
            </div>
          ))}
        </div>

        <div className="panel" style={{
          padding: 20, border: "1px solid var(--border)", borderRadius: 20,
          background: "linear-gradient(135deg, rgba(37,99,255,0.06), rgba(124,58,237,0.06))",
          fontSize: 13, lineHeight: 1.6, color: "var(--muted)",
        }}>
          <strong style={{ display: "block", marginBottom: 4, color: "var(--text)" }}>
            💡 Tips para hablar con ELIANA
          </strong>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            <li>Activa el micrófono para hablarle por voz</li>
            <li>ELIANA te responde con voz si el altavoz está activado</li>
            <li>Las conversaciones se guardan aunque cierres el navegador</li>
            <li>Pregunta en cualquier idioma, ELIANA entiende y responde</li>
          </ul>
        </div>
      </div>

      {/* Right: Chat */}
      <div className="panel" style={{
        border: "1px solid var(--border)", borderRadius: 28,
        background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)",
        backdropFilter: "blur(22px)", overflow: "hidden",
        height: "calc(100vh - 200px)", position: "sticky", top: 80,
        display: "flex", flexDirection: "column",
      }}>
        <div style={{
          padding: "14px 16px", borderBottom: "1px solid var(--border)",
          background: "linear-gradient(135deg, rgba(37,99,255,0.08), rgba(124,58,237,0.08))",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span className="ai-orb" style={{
            width: 32, height: 32, borderRadius: 10,
            background: "url(/assets/ai-logo.svg) center / cover no-repeat",
            boxShadow: "0 0 15px rgba(0,212,255,0.3)",
            animation: "pulse 2s infinite",
          }} />
          <div>
            <strong style={{ fontSize: 14, color: "var(--text)", display: "block" }}>ELIANA</strong>
            <span style={{ fontSize: 11, color: "#00d4ff" }}>Online · Pregunta lo que quieras</span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <ElianaChat fullScreen />
        </div>
      </div>
    </div>
  );
}

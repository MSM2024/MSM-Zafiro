"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function QuestionContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "¿Cómo puede una IA ayudar a una persona a aprender más rápido?";

  return (
    <div className="question-layout" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 330px", gap: 18, alignItems: "start" }}>
      <article className="panel question-main" style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)" }}>
        <div className="meta" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 12, marginBottom: 16 }}>
          <span>Pregunta abierta · IA · Educación</span>
          <span>Actualizada ahora</span>
        </div>
        <h2 className="question-title" style={{ margin: "0 0 16px", fontSize: "clamp(32px, 5vw, 58px)", lineHeight: 1.02 }}>{q}</h2>
        <div className="summary" style={{ padding: 18, border: "1px solid rgba(37,99,255,0.2)", borderRadius: 22, background: "rgba(37,99,255,0.08)" }}>
          <strong style={{ display: "block", marginBottom: 8 }}>AI dynamic summary</strong>
          <p className="answer" style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55, fontSize: 14 }}>
            Una IA puede adaptar explicaciones al nivel del usuario, crear ejercicios, detectar errores, traducir conceptos difíciles y convertir cualquier pregunta en una ruta de aprendizaje.
          </p>
        </div>
        <div className="answer-list" style={{ display: "grid", gap: 14, marginTop: 18 }}>
          <div className="answer-card" style={{ padding: 18, border: "1px solid var(--border)", borderRadius: 20, background: "var(--surface-strong)" }}>
            <strong style={{ display: "block", marginBottom: 8 }}>Respuesta de la comunidad</strong>
            <p className="answer" style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55, fontSize: 14 }}>
              La clave es que la IA no solo conteste, sino que pregunte de vuelta, mida comprensión y proponga el siguiente paso.
            </p>
            <span className="expert" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 12, padding: "7px 10px", borderRadius: 999, color: "#047857", background: "rgba(16,185,129,0.12)", fontSize: 12, fontWeight: 700 }}>Validado por experto en educación</span>
          </div>
          <div className="answer-card" style={{ padding: 18, border: "1px solid var(--border)", borderRadius: 20, background: "var(--surface-strong)" }}>
            <strong style={{ display: "block", marginBottom: 8 }}>Aporte técnico</strong>
            <p className="answer" style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55, fontSize: 14 }}>
              El sistema puede usar historial, embeddings, evaluaciones cortas y preferencias para recomendar contenido personalizado.
            </p>
          </div>
        </div>
      </article>
      <aside className="panel side-panel" style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)", display: "grid", gap: 16 }}>
        <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Respuestas</span><strong style={{ color: "var(--text)" }}>32</strong></div>
        <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Expertos</span><strong style={{ color: "var(--text)" }}>4</strong></div>
        <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Idiomas</span><strong style={{ color: "var(--text)" }}>ES / EN</strong></div>
        <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Popularidad</span><strong style={{ color: "var(--text)" }}>94%</strong></div>
        <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Estado</span><strong style={{ color: "var(--text)" }}>Vivo</strong></div>
      </aside>
    </div>
  );
}

export default function QuestionPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Cargando...</div>}>
      <QuestionContent />
    </Suspense>
  );
}

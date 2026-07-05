"use client";

import { useState } from "react";

export default function SponsorPage() {
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("IA");
  const [copy, setCopy] = useState("");
  const [budget, setBudget] = useState("49");
  const [status, setStatus] = useState("Esperando campaña");
  const [result, setResult] = useState("La IA revisará claridad, categoría, seguridad, spam, promesas falsas y relevancia antes de habilitar el pago.");

  const blockedTerms = ["casino", "apuesta", "milagro", "garantizado", "cura", "dinero fácil rápido"];

  function analyzeSponsor() {
    const combined = `${brand} ${copy}`.toLowerCase();
    if (!brand || !copy) {
      setStatus("Falta información");
      setResult("Agrega nombre de marca y texto del anuncio para que la IA pueda analizarlo.");
      return;
    }
    if (blockedTerms.some((t) => combined.includes(t))) {
      setStatus("No aprobado");
      setResult("La IA detectó promesas riesgosas, spam o una categoría no permitida. El sponsor debe editar el anuncio antes de pagar.");
      return;
    }
    setStatus("Aprobado por IA · Stripe listo");
    setResult(`${brand} fue aprobado para la categoría ${category}. Precio seleccionado: ${budget} USD. En la app real se abriría Stripe Checkout y al pagar se activa la campaña.`);
  }

  return (
    <>
      <div className="section-head" style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "clamp(26px, 4vw, 42px)", lineHeight: 1.05 }}>Sponsor Studio</h2>
          <p style={{ maxWidth: 560, margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.55 }}>Publicidad autoservicio: el sponsor crea una campaña, la IA la analiza, aprueba si cumple reglas y luego cobra por Stripe.</p>
        </div>
      </div>

      <div className="question-layout" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 330px", gap: 18, alignItems: "start" }}>
        <article className="panel question-main" style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)" }}>
          <h2 style={{ margin: "0 0 8px" }}>Create sponsored knowledge</h2>
          <p className="answer" style={{ margin: "0 0 18px", color: "var(--muted)", lineHeight: 1.55, fontSize: 14 }}>Los anuncios no se mezclan como respuestas orgánicas. Siempre aparecen como patrocinados y relacionados con categorías.</p>
          <div className="form-grid" style={{ display: "grid", gap: 12 }}>
            <input className="field" placeholder="Nombre de marca o sponsor" value={brand} onChange={(e) => setBrand(e.target.value)} style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 18, outline: 0, color: "var(--text)", background: "var(--surface-strong)", padding: "14px 15px", font: "inherit" }} />
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 18, outline: 0, color: "var(--text)", background: "var(--surface-strong)", padding: "14px 15px", font: "inherit" }}>
              {["IA", "Programación", "Negocios", "Educación", "Salud", "Finanzas"].map((c) => <option key={c}>{c}</option>)}
            </select>
            <textarea placeholder="Texto del anuncio. Ejemplo: Aprende IA con clases guiadas por preguntas." value={copy} onChange={(e) => setCopy(e.target.value)} style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 18, outline: 0, color: "var(--text)", background: "var(--surface-strong)", padding: "14px 15px", font: "inherit", minHeight: 112, resize: "vertical" }} />
            <select value={budget} onChange={(e) => setBudget(e.target.value)} style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 18, outline: 0, color: "var(--text)", background: "var(--surface-strong)", padding: "14px 15px", font: "inherit" }}>
              <option value="49">Starter - 49 USD</option>
              <option value="149">Growth - 149 USD</option>
              <option value="499">Scale - 499 USD</option>
            </select>
            <button className="primary-action" onClick={analyzeSponsor} style={{ minHeight: 50, border: 0, borderRadius: 18, color: "#fff", background: "linear-gradient(135deg, #2563ff, #7c3aed)", fontWeight: 800, cursor: "pointer", boxShadow: "0 16px 40px rgba(37,99,255,0.26)", font: "inherit" }}>Analizar con IA y continuar a Stripe</button>
          </div>
        </article>
        <aside className="panel side-panel" style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)", display: "grid", gap: 16 }}>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Revisión</span><strong style={{ color: "var(--text)" }}>IA automática</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Pago</span><strong style={{ color: "var(--text)" }}>Stripe</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Formato</span><strong style={{ color: "var(--text)" }}>Patrocinado</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Humano</span><strong style={{ color: "var(--text)" }}>No requerido</strong></div>
        </aside>
      </div>

      <div className="question-layout" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 330px", gap: 18, alignItems: "start", marginTop: 18 }}>
        <article className="panel question-main" style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)" }}>
          <h2 style={{ margin: "0 0 16px" }}>AI approval result</h2>
          <div className="summary" style={{ padding: 18, border: "1px solid rgba(37,99,255,0.2)", borderRadius: 22, background: "rgba(37,99,255,0.08)" }}>
            <strong style={{ display: "block", marginBottom: 8 }}>{status}</strong>
            <p className="answer" style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55, fontSize: 14 }}>{result}</p>
          </div>
          <div className="answer-list" style={{ display: "grid", gap: 14, marginTop: 18 }}>
            {[
              { title: "1. Análisis", desc: "La IA detecta si el anuncio es educativo, relevante y seguro." },
              { title: "2. Autorización", desc: "Si cumple reglas, queda aprobado automáticamente. Si no, pide cambios." },
              { title: "3. Stripe", desc: "El sponsor paga. El webhook activa la campaña y registra presupuesto." },
              { title: "4. Distribución", desc: "La publicidad aparece solo en categorías relacionadas y siempre marcada como Sponsored." },
            ].map((step) => (
              <div key={step.title} className="answer-card" style={{ padding: 18, border: "1px solid var(--border)", borderRadius: 20, background: "var(--surface-strong)" }}>
                <strong style={{ display: "block", marginBottom: 8 }}>{step.title}</strong>
                <p className="answer" style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55, fontSize: 14 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </article>
        <aside className="panel side-panel" style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)", display: "grid", gap: 16 }}>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Starter</span><strong style={{ color: "var(--text)" }}>49 USD</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Growth</span><strong style={{ color: "var(--text)" }}>149 USD</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Scale</span><strong style={{ color: "var(--text)" }}>499 USD</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Comisión</span><strong style={{ color: "var(--text)" }}>100% directa</strong></div>
        </aside>
      </div>
    </>
  );
}

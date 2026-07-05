"use client";

import { useState } from "react";

export default function CommunitiesPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Programación");
  const [purpose, setPurpose] = useState("");
  const [cards, setCards] = useState<Array<{ name: string; category: string; purpose: string }>>([]);

  function createCommunity() {
    const community = {
      name: name.trim() || "Nueva comunidad de conocimiento",
      category,
      purpose: purpose.trim() || "Resolver preguntas importantes con IA, comunidad y expertos.",
    };
    setCards((prev) => [community, ...prev]);
    setName("");
    setPurpose("");
  }

  return (
    <>
      <div className="section-head" style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "clamp(26px, 4vw, 42px)", lineHeight: 1.05 }}>Knowledge communities</h2>
          <p style={{ maxWidth: 560, margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.55 }}>No son grupos para subir fotos o historias. Son espacios donde una comunidad convierte preguntas en conocimiento organizado.</p>
        </div>
      </div>

      <div className="question-layout" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 330px", gap: 18, alignItems: "start" }}>
        <article className="panel question-main" style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)" }}>
          <h2 style={{ margin: "0 0 8px" }}>Create a community</h2>
          <p className="answer" style={{ color: "var(--muted)", lineHeight: 1.55, fontSize: 14 }}>Cada comunidad tiene preguntas, IA propia, expertos, retos, resumen semanal y reputación interna.</p>
          <div className="form-grid" style={{ display: "grid", gap: 12, marginTop: 18 }}>
            <input className="field" placeholder="Nombre de la comunidad" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 18, outline: 0, color: "var(--text)", background: "var(--surface-strong)", padding: "14px 15px", font: "inherit" }} />
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 18, outline: 0, color: "var(--text)", background: "var(--surface-strong)", padding: "14px 15px", font: "inherit" }}>
              {["Programación", "IA", "Negocios", "Salud", "Biblia", "Inventos", "Educación"].map((c) => <option key={c}>{c}</option>)}
            </select>
            <textarea placeholder="¿Qué problema resolverá esta comunidad?" value={purpose} onChange={(e) => setPurpose(e.target.value)} style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 18, outline: 0, color: "var(--text)", background: "var(--surface-strong)", padding: "14px 15px", font: "inherit", minHeight: 112, resize: "vertical" }} />
            <button className="primary-action" onClick={createCommunity} style={{ minHeight: 50, border: 0, borderRadius: 18, color: "#fff", background: "linear-gradient(135deg, #2563ff, #7c3aed)", fontWeight: 800, cursor: "pointer", boxShadow: "0 16px 40px rgba(37,99,255,0.26)", font: "inherit" }}>Crear comunidad demo</button>
          </div>
        </article>
        <aside className="panel side-panel" style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)", display: "grid", gap: 16 }}>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Tipo</span><strong style={{ color: "var(--text)" }}>Conocimiento</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Contenido principal</span><strong style={{ color: "var(--text)" }}>Preguntas</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>IA propia</span><strong style={{ color: "var(--text)" }}>Sí</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Fotos/historias</span><strong style={{ color: "var(--text)" }}>No</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Monetización</span><strong style={{ color: "var(--text)" }}>Premium</strong></div>
        </aside>
      </div>

      <div className="wall" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
        {[
          { meta: "Universidad · Global", title: "AI Research Circle", desc: "Researchers and students improving open questions about artificial intelligence." },
          { meta: "Builders · Public", title: "Inventors Lab", desc: "Ideas, prototypes, patents, feedback and collaboration for new inventions." },
          { meta: "Learning · ES / EN", title: "Programming Academy", desc: "Questions, code reviews, explanations and expert roadmaps for developers." },
          ...cards.map((c) => ({ meta: `${c.category} · Creada ahora`, title: c.name, desc: c.purpose })),
        ].map((card) => (
          <article key={card.title} className="card" style={{ minHeight: 180, padding: 20, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)" }}>
            <div className="meta" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 12, marginBottom: 16 }}><span>{card.meta}</span></div>
            <h2 className="question" style={{ margin: "0 0 14px", fontSize: 19, lineHeight: 1.25, fontWeight: 750 }}>{card.title}</h2>
            <p className="answer" style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55, fontSize: 14 }}>{card.desc}</p>
          </article>
        ))}
      </div>

      <div className="section-head" style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 18, marginTop: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "clamp(26px, 4vw, 42px)", lineHeight: 1.05 }}>Community knowledge map</h2>
          <p style={{ maxWidth: 560, margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.55 }}>Lo novedoso: en vez de un feed infinito, cada comunidad genera un mapa vivo de temas, preguntas y respuestas canónicas.</p>
        </div>
      </div>

      <div className="knowledge-map" style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 10 }}>
        {["Pregunta central", "Respuestas IA", "Aportes humanos", "Expertos", "Resumen final", "Retos", "Guías", "Fuentes", "Traducciones", "Top miembros"].map((node, i) => (
          <button key={node} className={`map-node ${i === 0 ? "hot" : ""}`} style={{ minHeight: 88, display: "grid", placeItems: "center", padding: 12, border: i === 0 ? "transparent" : "1px solid var(--border)", borderRadius: 22, background: i === 0 ? "linear-gradient(135deg, #2563ff, #7c3aed)" : "var(--surface-strong)", textAlign: "center", color: i === 0 ? "#fff" : "var(--muted)", fontSize: 12, cursor: "pointer", borderColor: "var(--border)" }}>{node}</button>
        ))}
      </div>
    </>
  );
}

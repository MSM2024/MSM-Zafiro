export default function AiPage() {
  return (
    <>
      <div className="section-head" style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "clamp(26px, 4vw, 42px)", lineHeight: 1.05 }}>The AI companion</h2>
          <p style={{ maxWidth: 560, margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.55 }}>ELIANA Asistente Virtual representa una pregunta, un ojo inteligente y una órbita de conocimiento vivo.</p>
        </div>
      </div>

      <div className="question-layout" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 330px", gap: 18, alignItems: "start" }}>
        <div className="panel question-main" style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)", textAlign: "center" }}>
          <img src="/assets/ai-logo.svg" alt="Logo de la IA" style={{ width: "min(260px, 100%)", borderRadius: 40 }} />
          <h2 style={{ margin: "16px 0 8px", fontSize: "clamp(28px, 4vw, 42px)" }}>ELIANA, la IA que piensa contigo</h2>
          <p className="answer" style={{ maxWidth: 600, margin: "0 auto", color: "var(--muted)", lineHeight: 1.55, fontSize: 14 }}>
            ELIANA responde primero, resume conversaciones, traduce, encuentra preguntas duplicadas y ayuda a organizar el conocimiento sin reemplazar a la comunidad.
          </p>
        </div>
        <aside className="panel side-panel" style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)", display: "grid", gap: 16 }}>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Responder</span><strong style={{ color: "var(--text)" }}>Instantáneo</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Traducir</span><strong style={{ color: "var(--text)" }}>Global</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Resumir</span><strong style={{ color: "var(--text)" }}>Dinámico</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Validar</span><strong style={{ color: "var(--text)" }}>Con humanos</strong></div>
        </aside>
      </div>

      <div className="concept-frame" style={{ display: "grid", gap: 14 }}>
        <div className="section-head" style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 18 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "clamp(26px, 4vw, 42px)", lineHeight: 1.05 }}>Premium concept render</h2>
            <p style={{ maxWidth: 560, margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.55 }}>Dirección visual dark neon para presentar Zafiro a programadores, socios o inversionistas.</p>
          </div>
        </div>
        <img className="concept-image" src="/assets/knowledge-future-premium-concept.png" alt="Concepto premium de Zafiro con ELIANA" style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 28, boxShadow: "0 30px 100px var(--shadow)" }} />
      </div>
    </>
  );
}

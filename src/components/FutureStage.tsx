import { QuestionComposer } from "./QuestionComposer";

export function FutureStage() {
  return (
    <section className="future-stage" aria-label="Pantalla completa Zafiro" style={{
      minHeight: "calc(100vh - 130px)", display: "grid",
      gridTemplateColumns: "250px minmax(0, 1fr) 310px", gap: 16, alignItems: "stretch",
    }}>
      {/* Left Panel - Brand */}
      <aside className="future-panel future-brand" style={{
        border: "1px solid rgba(0,212,255,0.14)", borderRadius: 28,
        background: "linear-gradient(180deg, rgba(15,23,42,0.82), rgba(9,10,15,0.74)), rgba(18,20,30,0.76)",
        boxShadow: "0 26px 90px rgba(0,0,0,0.36)", backdropFilter: "blur(26px)",
        display: "grid", alignContent: "start", gap: 22, padding: 26,
      }}>
        <img className="future-brand-logo" src="/assets/ai-logo.svg" alt="Logo de Zafiro" style={{ width: 138, height: 138, borderRadius: 42, objectFit: "cover", boxShadow: "0 0 70px rgba(0,212,255,0.36)" }} />
        <div>
          <h1 style={{ margin: 0, fontSize: 34, lineHeight: 0.95, color: "#f9fafb", textTransform: "uppercase" }}>MSM<br />Zafiro</h1>
          <small style={{ color: "#a7b5d9", letterSpacing: 3, textTransform: "uppercase", fontSize: 11 }}>La red social del conocimiento + IA</small>
        </div>
        <div className="future-steps" style={{ display: "grid", gap: 15 }}>
          {[
            { icon: "?", title: "Pregunta", desc: "Haz cualquier pregunta." },
            { icon: "AI", title: "IA responde", desc: "ELIANA crea la primera respuesta." },
            { icon: "∞", title: "Comunidad", desc: "Las personas agregan y mejoran." },
            { icon: "✓", title: "Expertos validan", desc: "La mejor respuesta gana confianza." },
            { icon: "↗", title: "Conocimiento vivo", desc: "La IA resume y organiza todo." },
          ].map((step) => (
            <div key={step.title} className="future-step" style={{ display: "grid", gridTemplateColumns: "38px 1fr", gap: 12, alignItems: "start", color: "#dbeafe" }}>
              <span style={{ display: "grid", placeItems: "center", width: 38, height: 38, border: "1px solid rgba(0,212,255,0.28)", borderRadius: 15, color: "#00d4ff", background: "rgba(37,99,255,0.12)", fontSize: 14 }}>{step.icon}</span>
              <div>
                <strong style={{ display: "block", color: "#ffffff", fontSize: 13, textTransform: "uppercase" }}>{step.title}</strong>
                <p style={{ margin: "3px 0 0", color: "#9ca3af", fontSize: 12, lineHeight: 1.35 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Center - Main */}
      <section className="future-main" style={{ display: "grid", gridTemplateRows: "auto minmax(0, 1fr) auto", gap: 14 }}>
        <div className="future-panel future-head" style={{ border: "1px solid rgba(0,212,255,0.14)", borderRadius: 28, background: "linear-gradient(180deg, rgba(15,23,42,0.82), rgba(9,10,15,0.74)), rgba(18,20,30,0.76)", boxShadow: "0 26px 90px rgba(0,0,0,0.36)", backdropFilter: "blur(26px)", padding: "18px 20px" }}>
          <h2 style={{ margin: 0, color: "#ffffff", fontSize: "clamp(28px,4vw,48px)", lineHeight: 1, textTransform: "uppercase" }}>La red social del conocimiento + IA</h2>
          <p style={{ maxWidth: 760, margin: "10px 0 0", color: "#c7d2fe", lineHeight: 1.45, fontSize: 14 }}>La primera plataforma donde las preguntas construyen el futuro. Una red social mundial para aprender, enseñar y crear conocimiento junto a Inteligencia Artificial y expertos.</p>
          <div className="future-metrics" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10, marginTop: 18 }}>
            {[
              { value: "∞", label: "Conocimiento sin límites" },
              { value: "+10M", label: "Usuarios" },
              { value: "+50M", label: "Preguntas" },
              { value: "+100M", label: "Respuestas" },
            ].map((m) => (
              <div key={m.value} className="future-metric" style={{ padding: 13, border: "1px solid rgba(0,212,255,0.12)", borderRadius: 18, color: "#dbeafe", background: "rgba(37,99,255,0.08)" }}>
                <strong style={{ display: "block", color: "#60a5fa", fontSize: 20 }}>{m.value}</strong>
                <span style={{ fontSize: 12 }}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="future-panel future-app" style={{ border: "1px solid rgba(0,212,255,0.14)", borderRadius: 28, background: "linear-gradient(180deg, rgba(15,23,42,0.82), rgba(9,10,15,0.74)), rgba(18,20,30,0.76)", boxShadow: "0 26px 90px rgba(0,0,0,0.36)", backdropFilter: "blur(26px)", padding: 14 }}>
          <div className="app-window" style={{ minHeight: 440, display: "grid", gridTemplateColumns: "160px minmax(0, 1fr) 210px", gap: 12, padding: 14, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, background: "rgba(4,7,18,0.82)" }}>
            <aside className="app-side" style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, background: "rgba(15,23,42,0.62)", padding: 12, display: "grid", alignContent: "start", gap: 8 }}>
              <img className="mark" src="/assets/ai-logo.svg" alt="" style={{ width: 30, height: 30, borderRadius: 10 }} />
              {["+ Preguntar", "Inicio", "Explorar", "Comunidades", "Mapa del conocimiento", "Expertos", "Sponsors"].map((btn) => (
                <button key={btn} style={{ minHeight: 34, border: 0, borderRadius: 12, color: btn.startsWith("+") ? "#fff" : "#c7d2fe", background: btn.startsWith("+") ? "linear-gradient(135deg, #2563ff, #7c3aed)" : "transparent", textAlign: "left", padding: "0 10px", fontSize: 12, cursor: "pointer" }}>{btn}</button>
              ))}
            </aside>
            <main className="app-feed" style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, background: "rgba(15,23,42,0.62)", padding: 12, display: "grid", alignContent: "start", gap: 12 }}>
              <div style={{ textAlign: "center" }}>
                <h3 style={{ margin: 0, color: "#fff", fontSize: 16 }}>¿Qué quieres saber hoy?</h3>
                <p className="answer" style={{ color: "#9ca3af", fontSize: 13 }}>Cada pregunta construye el futuro</p>
              </div>
              <div className="app-search" style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, border: "1px solid rgba(0,212,255,0.16)", borderRadius: 18, background: "rgba(2,6,23,0.78)" }}>
                <span className="ai-orb" aria-hidden="true" style={{ width: 24, height: 24, borderRadius: 8, background: "url(/assets/ai-logo.svg) center / cover no-repeat", flex: "0 0 auto" }} />
                <input id="stageAskInput" placeholder="Escribe tu pregunta aquí..." style={{ width: "100%", border: 0, outline: 0, background: "transparent", color: "#fff", fontSize: 14 }} />
                <button className="send-button" aria-label="Enviar" style={{ width: 36, height: 36, border: 0, borderRadius: 12, color: "white", background: "linear-gradient(135deg, #2563ff, #7c3aed)", cursor: "pointer", flex: "0 0 auto" }}>→</button>
              </div>
              {[
                { q: "¿Cómo empezar a invertir con poco dinero?", meta: "IA + comunidad · respondida por expertos" },
                { q: "¿Cuál es el mejor lenguaje para iniciar en 2026?", meta: "94 votos · 32 respuestas · Programación" },
                { q: "¿Cómo mejorar mi concentración cada día?", meta: "71 votos · resumen IA disponible" },
              ].map((item) => (
                <div key={item.q} className="mini-question" style={{ padding: 12, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, color: "#dbeafe", background: "rgba(255,255,255,0.04)" }}>
                  <strong style={{ display: "block", color: "#fff", marginBottom: 6, fontSize: 13 }}>{item.q}</strong>
                  <span style={{ color: "#8ea4d2", fontSize: 12 }}>{item.meta}</span>
                </div>
              ))}
            </main>
            <aside className="app-context" style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, background: "rgba(15,23,42,0.62)", padding: 12, display: "grid", gap: 12 }}>
              <div className="eliana-id" style={{ display: "grid", gridTemplateColumns: "50px 1fr", gap: 10, alignItems: "center", padding: 10, border: "1px solid rgba(0,212,255,0.14)", borderRadius: 16, background: "rgba(2,6,23,0.62)" }}>
                <img src="/assets/ai-logo.svg" alt="" style={{ width: 50, height: 50, borderRadius: 16 }} />
                <div>
                  <strong style={{ color: "#fff", fontSize: 13, display: "block" }}>ELIANA</strong>
                  <span style={{ color: "#8ea4d2", fontSize: 11 }}>Asistente Virtual</span>
                </div>
              </div>
              <div className="mini-map" style={{ minHeight: 120, position: "relative", border: "1px solid rgba(0,212,255,0.12)", borderRadius: 18, overflow: "hidden", background: "radial-gradient(circle at 50% 50%, rgba(0,212,255,0.26), transparent 12%), radial-gradient(circle at 25% 35%, rgba(124,58,237,0.28), transparent 10%), radial-gradient(circle at 75% 70%, rgba(37,99,255,0.28), transparent 10%), rgba(2,6,23,0.76)" }} />
              <div className="summary" style={{ padding: 12, border: "1px solid rgba(37,99,255,0.2)", borderRadius: 16, background: "rgba(37,99,255,0.1)" }}>
                <strong style={{ display: "block", marginBottom: 6, color: "#93c5fd", fontSize: 12 }}>Resumen IA</strong>
                <p className="answer" style={{ margin: 0, color: "#9ca3af", fontSize: 12 }}>La respuesta mejora con aportes humanos, validación experta y fuentes.</p>
              </div>
            </aside>
          </div>
        </div>

        <div className="future-bottom" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 14 }}>
          <div className="future-panel future-plans" style={{ border: "1px solid rgba(0,212,255,0.14)", borderRadius: 28, background: "linear-gradient(180deg, rgba(15,23,42,0.82), rgba(9,10,15,0.74)), rgba(18,20,30,0.76)", boxShadow: "0 26px 90px rgba(0,0,0,0.36)", backdropFilter: "blur(26px)", padding: 16 }}>
            <h3 style={{ margin: "0 0 12px", color: "#7dd3fc", textTransform: "uppercase", fontSize: 15 }}>Planes y membresías</h3>
            <div className="plan-row" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
              {[
                { name: "Free", price: "$0 / mes" },
                { name: "Plus", price: "$9.99 / mes" },
                { name: "Pro", price: "$19.99 / mes" },
              ].map((p) => (
                <div key={p.name} className="plan-mini" style={{ padding: 13, border: "1px solid rgba(0,212,255,0.12)", borderRadius: 18, color: "#dbeafe", background: "rgba(15,23,42,0.64)" }}>
                  <strong style={{ display: "block", color: "#fff" }}>{p.name}</strong>
                  <span style={{ fontSize: 12 }}>{p.price}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="future-panel future-sponsors" style={{ border: "1px solid rgba(0,212,255,0.14)", borderRadius: 28, background: "linear-gradient(180deg, rgba(15,23,42,0.82), rgba(9,10,15,0.74)), rgba(18,20,30,0.76)", boxShadow: "0 26px 90px rgba(0,0,0,0.36)", backdropFilter: "blur(26px)", padding: 16 }}>
            <h3 style={{ margin: "0 0 12px", color: "#7dd3fc", textTransform: "uppercase", fontSize: 15 }}>Patrocinadores / publicidad inteligente</h3>
            <div className="sponsor-flow" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8, color: "#c7d2fe", fontSize: 12 }}>
              {["1. Sponsor crea anuncio", "2. IA analiza y aprueba", "3. Stripe cobra", "4. Webhook activa"].map((s) => (
                <span key={s} style={{ padding: 12, border: "1px solid rgba(0,212,255,0.12)", borderRadius: 16, background: "rgba(15,23,42,0.64)" }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Right Panel */}
      <aside className="future-right" style={{ display: "grid", gap: 14 }}>
        <div className="future-panel eliana-card" style={{ border: "1px solid rgba(0,212,255,0.14)", borderRadius: 28, background: "linear-gradient(180deg, rgba(15,23,42,0.82), rgba(9,10,15,0.74)), rgba(18,20,30,0.76)", boxShadow: "0 26px 90px rgba(0,0,0,0.36)", backdropFilter: "blur(26px)", padding: 18 }}>
          <h3 style={{ margin: "0 0 12px", color: "#7dd3fc", textTransform: "uppercase", fontSize: 15 }}>Asistente virtual ELIANA</h3>
          <div className="eliana-id" style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 12, alignItems: "center", padding: 12, border: "1px solid rgba(0,212,255,0.14)", borderRadius: 20, background: "rgba(2,6,23,0.62)" }}>
            <img src="/assets/ai-logo.svg" alt="" style={{ width: 60, height: 60, borderRadius: 20 }} />
            <div>
              <strong style={{ color: "#fff", display: "block" }}>ELIANA</strong>
              <span style={{ color: "#9ca3af", fontSize: 13 }}>Tu copiloto inteligente</span>
            </div>
          </div>
          <div className="check-list" style={{ display: "grid", gap: 7, marginTop: 12, color: "#dbeafe", fontSize: 12 }}>
            {["✓ Responde tus preguntas", "✓ Resume información", "✓ Traduce idiomas", "✓ Detecta duplicados", "✓ Recomienda expertos", "✓ Crea mapas y guías"].map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </div>
        <div className="future-panel smart-communities" style={{ border: "1px solid rgba(0,212,255,0.14)", borderRadius: 28, background: "linear-gradient(180deg, rgba(15,23,42,0.82), rgba(9,10,15,0.74)), rgba(18,20,30,0.76)", boxShadow: "0 26px 90px rgba(0,0,0,0.36)", backdropFilter: "blur(26px)", padding: 18 }}>
          <h3 style={{ margin: "0 0 12px", color: "#7dd3fc", textTransform: "uppercase", fontSize: 15 }}>Comunidades inteligentes</h3>
          <div className="community-grid-mini" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
            {[
              { name: "Programación", members: "+128K" },
              { name: "Inteligencia Artificial", members: "+96K" },
              { name: "Negocios", members: "+87K" },
              { name: "Salud", members: "+75K" },
              { name: "Biblia", members: "+65K" },
            ].map((c) => (
              <div key={c.name} className="community-mini" style={{ minHeight: 60, padding: 11, border: "1px solid rgba(0,212,255,0.12)", borderRadius: 16, color: "#dbeafe", background: "rgba(15,23,42,0.64)", fontSize: 12 }}>
                <strong style={{ display: "block", color: "#fff" }}>{c.name}</strong>
                <span>{c.members} miembros</span>
              </div>
            ))}
            <div className="community-mini" style={{ minHeight: 60, padding: 11, border: "1px solid rgba(0,212,255,0.12)", borderRadius: 16, color: "#dbeafe", background: "rgba(15,23,42,0.64)", fontSize: 12, display: "grid", placeItems: "center" }}>
              <strong style={{ color: "#fff" }}>Crear comunidad</strong>
            </div>
          </div>
        </div>
        <div className="future-panel live-map-card" style={{ border: "1px solid rgba(0,212,255,0.14)", borderRadius: 28, background: "linear-gradient(180deg, rgba(15,23,42,0.82), rgba(9,10,15,0.74)), rgba(18,20,30,0.76)", boxShadow: "0 26px 90px rgba(0,0,0,0.36)", backdropFilter: "blur(26px)", padding: 18 }}>
          <h3 style={{ margin: "0 0 12px", color: "#7dd3fc", textTransform: "uppercase", fontSize: 15 }}>Mapa vivo del conocimiento</h3>
          <div className="mini-map" style={{ minHeight: 200, position: "relative", border: "1px solid rgba(0,212,255,0.12)", borderRadius: 18, overflow: "hidden", background: "radial-gradient(circle at 50% 50%, rgba(0,212,255,0.26), transparent 12%), radial-gradient(circle at 25% 35%, rgba(124,58,237,0.28), transparent 10%), radial-gradient(circle at 75% 70%, rgba(37,99,255,0.28), transparent 10%), rgba(2,6,23,0.76)" }} />
        </div>
      </aside>
    </section>
  );
}

export default function MembershipPage() {
  return (
    <>
      <div className="section-head" style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "clamp(26px, 4vw, 42px)", lineHeight: 1.05 }}>Membership and money engine</h2>
          <p style={{ maxWidth: 560, margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.55 }}>Monetización sencilla: planes, créditos de IA, comunidades premium, expertos y publicidad limpia por categoría.</p>
        </div>
      </div>

      <div className="category-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
        {[
          { name: "Free", desc: "Leer, buscar, participar y hacer preguntas con límites. Perfecto para crecimiento viral." },
          { name: "Plus", desc: "Más preguntas IA, traducciones, guardados, resúmenes y comunidades favoritas." },
          { name: "Pro", desc: "Investigación profunda, código, exportar documentos, carpetas privadas y herramientas avanzadas." },
          { name: "Community Premium", desc: "Comunidades privadas o premium. La plataforma cobra comisión al creador." },
          { name: "AI Credits", desc: "Recargas para tareas costosas: documentos, imágenes, código, análisis largo y traducciones grandes." },
          { name: "Sponsors", desc: "Publicidad clara por categoría: cursos, libros, herramientas, software y empresas verificadas." },
        ].map((plan) => (
          <article key={plan.name} className="panel category-card" style={{ padding: 20, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)" }}>
            <h3 style={{ margin: "0 0 8px" }}>{plan.name}</h3>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5, fontSize: 14 }}>{plan.desc}</p>
          </article>
        ))}
      </div>

      <div className="question-layout" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 330px", gap: 18, alignItems: "start" }}>
        <article className="panel question-main" style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)" }}>
          <h2 style={{ margin: "0 0 16px" }}>Stripe flow</h2>
          <div className="answer-list" style={{ display: "grid", gap: 14 }}>
            {[
              { title: "1. Usuario elige plan", desc: "Plus, Pro, créditos o comunidad premium." },
              { title: "2. Stripe Checkout", desc: "Stripe procesa pago, tarjeta, Apple Pay o Google Pay." },
              { title: "3. Webhook", desc: "El servidor recibe confirmación y actualiza el plan en Supabase." },
              { title: "4. Límites", desc: "La app desbloquea más IA, más guardados, comunidades premium y herramientas." },
            ].map((step) => (
              <div key={step.title} className="answer-card" style={{ padding: 18, border: "1px solid var(--border)", borderRadius: 20, background: "var(--surface-strong)" }}>
                <strong style={{ display: "block", marginBottom: 8 }}>{step.title}</strong>
                <p className="answer" style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55, fontSize: 14 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </article>
        <aside className="panel side-panel" style={{ padding: 24, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)", display: "grid", gap: 16 }}>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Pagos</span><strong style={{ color: "var(--text)" }}>Stripe</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Simple</span><strong style={{ color: "var(--text)" }}>Sí</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Publicidad</span><strong style={{ color: "var(--text)" }}>Limpia</strong></div>
          <div className="metric" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 14 }}><span>Comisión</span><strong style={{ color: "var(--text)" }}>10%-25%</strong></div>
        </aside>
      </div>
    </>
  );
}

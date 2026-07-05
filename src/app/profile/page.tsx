export default function ProfilePage() {
  return (
    <>
      <div className="section-head" style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "clamp(26px, 4vw, 42px)", lineHeight: 1.05 }}>Profile</h2>
          <p style={{ maxWidth: 560, margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.55 }}>A public identity built around questions, answers, expertise and reputation.</p>
        </div>
      </div>
      <div className="profile-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
        <article className="panel profile-card" style={{ padding: 22, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)" }}>
          <div className="avatar" style={{ width: 64, height: 64, marginBottom: 14, borderRadius: 22, background: "linear-gradient(135deg, #2563ff, #7c3aed, #d946ef)" }} />
          <h3 style={{ margin: "0 0 8px" }}>Camilo Knowledge</h3>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5, fontSize: 14 }}>Curioso, creador y fundador de una nueva red mundial de conocimiento.</p>
        </article>
        <article className="panel profile-card" style={{ padding: 22, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)" }}>
          <h3 style={{ margin: "0 0 8px" }}>Reputación</h3>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5, fontSize: 14 }}>8,420 puntos · Nivel 12 · 9 insignias · 3 especialidades.</p>
        </article>
        <article className="panel profile-card" style={{ padding: 22, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)" }}>
          <h3 style={{ margin: "0 0 8px" }}>Especialidades</h3>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5, fontSize: 14 }}>IA, tecnología, negocios, educación y productos digitales.</p>
        </article>
      </div>
    </>
  );
}

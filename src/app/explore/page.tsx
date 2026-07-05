const CATEGORIES = [
  { name: "Tecnología", desc: "AI, software, hardware, cybersecurity and future products." },
  { name: "Ciencia", desc: "Physics, biology, chemistry, research and experiments." },
  { name: "Salud", desc: "Medical education, prevention and expert-reviewed knowledge." },
  { name: "Negocios", desc: "Startups, investing, markets, strategy and operations." },
  { name: "Biblia", desc: "Questions, context, history, interpretation and learning." },
  { name: "Programación", desc: "Code, architecture, debugging, systems and developer tools." },
];

export default function ExplorePage() {
  return (
    <>
      <div className="section-head" style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "clamp(26px, 4vw, 42px)", lineHeight: 1.05 }}>Explore knowledge by category</h2>
          <p style={{ maxWidth: 560, margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.55 }}>Capsules of global curiosity. Each category can become a living community of experts, students and builders.</p>
        </div>
      </div>
      <div className="category-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
        {CATEGORIES.map((cat) => (
          <article key={cat.name} className="panel category-card" style={{ padding: 20, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)", backdropFilter: "blur(22px)" }}>
            <h3 style={{ margin: "0 0 8px" }}>{cat.name}</h3>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.5, fontSize: 14 }}>{cat.desc}</p>
          </article>
        ))}
      </div>
    </>
  );
}

const DEMO_CARDS = [
  {
    id: 1,
    category: "AI · Ciencia",
    time: "Hace 2 min",
    question: "¿Cómo cambiará la inteligencia artificial la educación?",
    answer: "La IA puede personalizar el aprendizaje, detectar dificultades temprano y ayudar a profesores a crear mejores rutas de estudio.",
    stats: ["24 respuestas", "3 expertos", "ES"],
  },
  {
    id: 2,
    category: "Espacio · Futuro",
    time: "Hace 8 min",
    question: "¿Qué necesita la humanidad para vivir en Marte?",
    answer: "Energía estable, hábitats presurizados, agua reciclada, protección contra radiación y sistemas agrícolas cerrados.",
    stats: ["41 respuestas", "5 expertos", "EN"],
  },
  {
    id: 3,
    category: "Negocios · Innovación",
    time: "Hace 13 min",
    question: "¿Cómo se valida una idea antes de construir una startup?",
    answer: "Empieza por un problema real, entrevista usuarios, mide intención de pago y prueba una solución mínima antes de escalar.",
    stats: ["18 respuestas", "2 expertos", "ES"],
  },
];

export function KnowledgeWall() {
  return (
    <section className="wall" aria-label="Muro vivo de conocimiento" style={{
      display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16,
    }}>
      {DEMO_CARDS.map((card) => (
        <article
          key={card.id}
          className="card"
          style={{
            minHeight: 224, padding: 20,
            border: "1px solid var(--border)", borderRadius: 24,
            background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)",
            backdropFilter: "blur(22px)", transition: "transform 180ms ease, border-color 180ms ease",
          }}
        >
          <div className="meta" style={{ display: "flex", justifyContent: "space-between", gap: 12, color: "var(--muted)", fontSize: 12, marginBottom: 16 }}>
            <span>{card.category}</span>
            <span>{card.time}</span>
          </div>
          <h2 className="question" style={{ margin: "0 0 14px", fontSize: 19, lineHeight: 1.25, fontWeight: 750 }}>{card.question}</h2>
          <p className="answer" style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55, fontSize: 14 }}>{card.answer}</p>
          <div className="stats" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 22, color: "var(--muted)", fontSize: 12 }}>
            {card.stats.map((s) => <span key={s}>{s}</span>)}
          </div>
        </article>
      ))}
    </section>
  );
}

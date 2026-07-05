import { FutureStage } from "@/components/FutureStage";
import { QuestionComposer } from "@/components/QuestionComposer";
import { KnowledgeWall } from "@/components/KnowledgeWall";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <FutureStage />

      <div className="hero" style={{ display: "grid", placeItems: "center", minHeight: "46vh", textAlign: "center" }}>
        <div className="hero-inner" style={{ width: "min(920px, 100%)" }}>
          <div className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18, padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 999, color: "var(--muted)", background: "var(--surface)", fontSize: 13, backdropFilter: "blur(18px)" }}>
            <span className="ai-orb" aria-hidden="true" style={{ width: 20, height: 20, borderRadius: 6, background: "url(/assets/ai-logo.svg) center / cover no-repeat", boxShadow: "0 0 0 0 rgba(0,212,255,0.55)", animation: "pulse 1.5s infinite", flex: "0 0 auto" }} />
            <span>IA + humanidad, construyendo conocimiento vivo</span>
          </div>
          <h1 style={{ margin: "0 0 26px", fontSize: "clamp(40px, 7vw, 82px)", lineHeight: 0.98, letterSpacing: 0 }}>
            ¿Qué quieres <span className="gradient-text">saber?</span>
          </h1>
          <QuestionComposer />
          <p className="subtitle" style={{ margin: "18px 0 0", color: "var(--muted)", fontSize: 17 }}>Pregunta lo que quieras. Aprende juntos. Mantén el conocimiento vivo.</p>
        </div>
      </div>

      <div className="categories" aria-label="Categorías" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            href={`/explore?cat=${cat.name.toLowerCase()}`}
            className={`pill ${cat.color}`}
            style={{
              padding: "9px 13px", border: "1px solid var(--border)", borderRadius: 999,
              background: "var(--surface)", color: "var(--text)", fontSize: 13,
              backdropFilter: "blur(16px)", textDecoration: "none",
            }}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="section-head" style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "clamp(26px, 4vw, 42px)", lineHeight: 1.05 }}>Muro de conocimiento vivo</h2>
          <p style={{ maxWidth: 560, margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.55 }}>Preguntas públicas del mundo, resumidas por IA y mejoradas por personas en tiempo real.</p>
        </div>
      </div>

      <KnowledgeWall />
    </>
  );
}

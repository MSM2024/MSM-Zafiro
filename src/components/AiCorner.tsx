"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const ACTIONS = [
  { href: "/", label: "Ver faltante" },
  { href: "/communities", label: "Comunidades" },
  { href: "/question", label: "Pregunta" },
  { href: "/membership", label: "Plan" },
];

export function AiCorner() {
  const [collapsed, setCollapsed] = useState(true);
  const [message, setMessage] = useState("Hola, soy ELIANA. Estoy lista para guiar el MVP: preguntas, comunidades, sponsors, Supabase, OpenAI, Stripe y lanzamiento.");

  useEffect(() => {
    if (collapsed) return;
    const t = setTimeout(() => {
      setCollapsed(true);
    }, 8000);
    return () => clearTimeout(t);
  }, [collapsed]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!collapsed) return;
      setCollapsed(false);
      setMessage("Sigo aquí si quieres crear una pregunta, comunidad o plan de monetización.");
      setTimeout(() => setCollapsed(true), 3200);
    }, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside
      className="ai-corner"
      aria-label="Asistente IA"
      style={{
        position: "fixed", right: 18, bottom: 92, zIndex: 30,
        width: collapsed ? "auto" : "min(360px, calc(100% - 36px))",
        border: "1px solid var(--border)", borderRadius: collapsed ? 24 : 28,
        background: "var(--surface)", boxShadow: "0 24px 90px var(--shadow)",
        backdropFilter: "blur(26px)", overflow: "hidden",
      }}
    >
      <div className="ai-corner-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: 12 }}>
        <div className="ai-corner-title" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, fontWeight: 750, cursor: "pointer" }} onClick={() => setCollapsed(!collapsed)}>
          <span className="ai-orb" aria-hidden="true" style={{
            width: 32, height: 32, borderRadius: 12,
            background: "url(/assets/ai-logo.svg) center / cover no-repeat",
            boxShadow: "0 0 0 0 rgba(0, 212, 255, 0.55)",
            animation: "pulse 1.5s infinite", flex: "0 0 auto",
          }} />
          {!collapsed && <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>ELIANA · Asistente Virtual</span>}
        </div>
        <button
          className="icon-button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Minimizar IA"
          style={{
            width: 42, height: 42, border: "1px solid var(--border)", borderRadius: 16,
            background: "var(--surface-strong)", color: "var(--muted)", cursor: "pointer", fontSize: 18,
            display: "grid", placeItems: "center", flex: "0 0 auto",
          }}
        >
          {collapsed ? "+" : "−"}
        </button>
      </div>
      {!collapsed && (
        <div className="ai-corner-body" style={{ display: "grid", gap: 12, padding: "0 14px 14px" }}>
          <div className="ai-message" style={{
            padding: 12, border: "1px solid rgba(37,99,255,0.18)", borderRadius: 18,
            background: "rgba(37,99,255,0.08)", color: "var(--muted)", fontSize: 13, lineHeight: 1.45,
          }}>
            {message}
          </div>
          <div className="ai-actions" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="mini-action"
                style={{
                  minHeight: 42, border: "1px solid var(--border)", borderRadius: 15,
                  color: "var(--text)", background: "var(--surface-strong)",
                  fontSize: 12, fontWeight: 700, cursor: "pointer",
                  display: "grid", placeItems: "center", textDecoration: "none",
                }}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

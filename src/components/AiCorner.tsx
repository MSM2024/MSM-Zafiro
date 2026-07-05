"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const ACTIONS = [
  { href: "/", label: "Inicio" },
  { href: "/question/new", label: "Preguntar" },
  { href: "/communities", label: "Comunidades" },
  { href: "/membership", label: "Plan" },
];

export function AiCorner() {
  const [collapsed, setCollapsed] = useState(true);
  const [message] = useState("Hola, soy ELIANA. ¿En qué puedo ayudarte?");

  useEffect(() => {
    if (collapsed) return;
    const t = setTimeout(() => setCollapsed(true), 6000);
    return () => clearTimeout(t);
  }, [collapsed]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!collapsed) return;
      setCollapsed(false);
      setTimeout(() => setCollapsed(true), 3000);
    }, 20000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside
      className="ai-corner"
      aria-label="Asistente IA"
      style={{
        position: "fixed", right: 12, bottom: 88, zIndex: 30,
        width: collapsed ? "auto" : "min(300px, calc(100% - 24px))",
        border: "1px solid var(--border)", borderRadius: collapsed ? 20 : 24,
        background: "var(--surface)", boxShadow: "0 18px 60px var(--shadow)",
        backdropFilter: "blur(26px)", overflow: "hidden",
      }}
    >
      <div className="ai-corner-head" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "8px 10px" }}>
        <div className="ai-corner-title" style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, fontWeight: 700, cursor: "pointer" }} onClick={() => setCollapsed(!collapsed)}>
          <span className="ai-orb" aria-hidden="true" style={{
            width: 24, height: 24, borderRadius: 8,
            background: "url(/assets/ai-logo.svg) center / cover no-repeat",
            boxShadow: "0 0 0 0 rgba(0, 212, 255, 0.55)",
            animation: "pulse 1.5s infinite", flex: "0 0 auto",
          }} />
          {!collapsed && <span style={{ fontSize: 13 }}>ELIANA</span>}
        </div>
        <button
          className="icon-button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Minimizar IA"
          style={{
            width: 30, height: 30, border: "1px solid var(--border)", borderRadius: 10,
            background: "var(--surface-strong)", color: "var(--muted)", cursor: "pointer", fontSize: 14,
            display: "grid", placeItems: "center", flex: "0 0 auto", lineHeight: 1,
          }}
        >
          {collapsed ? "⌄" : "×"}
        </button>
      </div>
      {!collapsed && (
        <div className="ai-corner-body" style={{ display: "grid", gap: 8, padding: "0 10px 10px" }}>
          <div className="ai-message" style={{
            padding: 10, border: "1px solid rgba(37,99,255,0.18)", borderRadius: 14,
            background: "rgba(37,99,255,0.08)", color: "var(--muted)", fontSize: 12, lineHeight: 1.4,
          }}>
            {message}
          </div>
          <div className="ai-actions" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="mini-action"
                style={{
                  minHeight: 34, border: "1px solid var(--border)", borderRadius: 12,
                  color: "var(--text)", background: "var(--surface-strong)",
                  fontSize: 11, fontWeight: 600, cursor: "pointer",
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

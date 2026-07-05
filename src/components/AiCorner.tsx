"use client";

import { useState, useEffect } from "react";
import { Sparkles, X, Maximize2 } from "lucide-react";
import Link from "next/link";
import { ElianaChat } from "./ElianaChat";

export function AiCorner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpen(true);
      setTimeout(() => setOpen(false), 6000);
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir ELIANA"
        className="neon-glow"
        style={{
          position: "fixed", right: 12, bottom: 88, zIndex: 30,
          width: 48, height: 48, borderRadius: 18, border: "1px solid rgba(0,212,255,0.35)",
          background: "linear-gradient(135deg, rgba(37,99,255,0.25), rgba(124,58,237,0.25))",
          backdropFilter: "blur(20px)", cursor: "pointer",
          display: "grid", placeItems: "center",
          boxShadow: "0 0 20px rgba(0,212,255,0.2), 0 0 40px rgba(124,58,237,0.1)",
          transition: "all 0.3s",
        }}
      >
        {/* Orbiting rings */}
        <div style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "1px solid rgba(0,212,255,0.12)", animation: "spin 4s linear infinite" }} />
        <div style={{ position: "absolute", inset: -10, borderRadius: "50%", border: "1px dashed rgba(124,58,237,0.08)", animation: "spin 6s linear infinite reverse" }} />
        <div style={{ position: "absolute", inset: -16, borderRadius: "50%", border: "1px dotted rgba(0,212,255,0.05)", animation: "spin 8s linear infinite" }} />

        <span className="ai-orb neon-glow" style={{
          width: 24, height: 24, borderRadius: 8,
          background: "url(/assets/ai-logo.svg) center / cover no-repeat",
          animation: "neonPulse 2s ease-in-out infinite",
          position: "relative",
        }} />
        <span style={{ position: "absolute", top: 2, left: 2, width: 4, height: 4, borderRadius: "50%", background: "#00d4ff", opacity: 0.6 }} />
        <span style={{ position: "absolute", bottom: 2, right: 2, width: 4, height: 4, borderRadius: "50%", background: "#7c3aed", opacity: 0.6 }} />
        <span style={{ position: "absolute", top: 2, right: 2, width: 3, height: 3, borderRadius: "50%", background: "#d946ef", opacity: 0.4 }} />
        <span style={{ position: "absolute", bottom: 2, left: 2, width: 3, height: 3, borderRadius: "50%", background: "#00d4ff", opacity: 0.4 }} />
      </button>
    );
  }

  return (
    <aside
      className="ai-corner-open"
      style={{
        position: "fixed", right: 12, bottom: 88, zIndex: 30,
        width: "min(360px, calc(100% - 24px))",
        height: "min(520px, calc(100vh - 120px))",
        border: "1px solid rgba(0,212,255,0.15)", borderRadius: 24,
        background: "linear-gradient(180deg, rgba(8,10,20,0.98), rgba(12,15,25,0.95))",
        boxShadow: "0 18px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,212,255,0.06)",
        backdropFilter: "blur(26px)", overflow: "hidden",
        display: "flex", flexDirection: "column",
        animation: "fadeInScale 0.25s ease-out",
      }}
    >
      {/* Holographic header */}
      <div className="holographic-bg" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 8, padding: "10px 14px",
        borderBottom: "1px solid rgba(0,212,255,0.08)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Scan overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.02) 2px, rgba(0,212,255,0.02) 4px)",
        }} />
        <div style={{
          position: "absolute", left: 0, right: 0, top: 0, height: "1px",
          background: "linear-gradient(90deg, transparent, #00d4ff, transparent)",
          opacity: 0.3,
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
          {/* Orb with rings */}
          <div style={{ position: "relative", width: 32, height: 32 }}>
            <div style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "1px solid rgba(0,212,255,0.1)", animation: "spin 3s linear infinite" }} />
            <span className="neon-glow" style={{
              position: "absolute", inset: 1, borderRadius: 8,
              background: "url(/assets/ai-logo.svg) center / cover no-repeat",
              boxShadow: "0 0 15px rgba(0,212,255,0.3)",
              animation: "neonPulse 2s ease-in-out infinite",
            }} />
          </div>
          <div>
            <strong style={{
              fontSize: 12, color: "#fff", display: "block",
              letterSpacing: 1.5, textTransform: "uppercase",
              background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              ELIANA
            </strong>
            <span style={{ fontSize: 9, color: "rgba(0,212,255,0.5)", display: "flex", alignItems: "center", gap: 4, fontFamily: "monospace" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 2s infinite" }} />
              SYSTEM ONLINE
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, position: "relative", zIndex: 1 }}>
          <Link href="/ai" aria-label="Pantalla completa"
            style={{
              width: 28, height: 28, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
              background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.3)", cursor: "pointer",
              display: "grid", placeItems: "center", textDecoration: "none",
            }}>
            <Maximize2 className="w-3 h-3" />
          </Link>
          <button onClick={() => setOpen(false)}
            style={{
              width: 28, height: 28, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
              background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.3)", cursor: "pointer",
              display: "grid", placeItems: "center",
            }}>
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      <ElianaChat />

      <style>{`
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </aside>
  );
}

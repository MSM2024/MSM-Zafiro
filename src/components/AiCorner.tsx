"use client";

import { useState, useEffect } from "react";
import { Sparkles, X, Maximize2 } from "lucide-react";
import Link from "next/link";
import { ElianaChat } from "./ElianaChat";

export function AiCorner() {
  const [open, setOpen] = useState(false);

  // Auto show/hide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setOpen(true);
      setTimeout(() => setOpen(false), 3000);
    }, 3000);
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
          width: 40, height: 40, borderRadius: 14, border: "1px solid rgba(0,212,255,0.35)",
          background: "linear-gradient(135deg, rgba(37,99,255,0.25), rgba(124,58,237,0.25))",
          backdropFilter: "blur(20px)", cursor: "pointer",
          display: "grid", placeItems: "center",
          boxShadow: "0 0 20px rgba(0,212,255,0.2), 0 0 40px rgba(124,58,237,0.1)",
          transition: "all 0.3s",
        }}
      >
        <span className="ai-orb neon-glow" style={{
          width: 20, height: 20, borderRadius: 6,
          background: "url(/assets/ai-logo.svg) center / cover no-repeat",
          animation: "neonPulse 2s ease-in-out infinite",
        }} />
      </button>
    );
  }

  return (
    <aside
      className="ai-corner-open"
      style={{
        position: "fixed", right: 8, bottom: 84, zIndex: 30,
        width: "min(280px, calc(100% - 16px))",
        height: "min(360px, calc(100vh - 100px))",
        border: "1px solid rgba(0,212,255,0.15)", borderRadius: 18,
        background: "linear-gradient(180deg, rgba(8,10,20,0.98), rgba(12,15,25,0.95))",
        boxShadow: "0 18px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,212,255,0.06)",
        backdropFilter: "blur(26px)", overflow: "hidden",
        display: "flex", flexDirection: "column",
        animation: "fadeInScale 0.2s ease-out",
      }}
    >
      {/* Header */}
      <div className="holographic-bg" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 6, padding: "6px 10px",
        borderBottom: "1px solid rgba(0,212,255,0.08)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, position: "relative", zIndex: 1 }}>
          <span className="neon-glow" style={{
            width: 22, height: 22, borderRadius: 6,
            background: "url(/assets/ai-logo.svg) center / cover no-repeat",
            boxShadow: "0 0 15px rgba(0,212,255,0.3)",
          }} />
          <strong style={{
            fontSize: 11, color: "#fff",
            letterSpacing: 1, textTransform: "uppercase",
            background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            ELIANA
          </strong>
        </div>
        <div style={{ display: "flex", gap: 4, position: "relative", zIndex: 1 }}>
          <button onClick={() => setOpen(false)}
            style={{
              width: 26, height: 26, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8,
              background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", cursor: "pointer",
              display: "grid", placeItems: "center", fontSize: 14, fontWeight: 700, lineHeight: 1,
            }}>
            ×
          </button>
        </div>
      </div>

      <ElianaChat />

      <style>{`@keyframes fadeInScale { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
    </aside>
  );
}

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
      setTimeout(() => setOpen(false), 3000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const glowRing = (
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 rounded-full blur-xl opacity-70 animate-pulse" style={{ animationDuration: "3s" }} />
  );

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir ELIANA"
        className="group"
        style={{
          position: "fixed", right: 12, bottom: 88, zIndex: 30,
          width: 44, height: 44, borderRadius: 14,
          cursor: "pointer",
          display: "grid", placeItems: "center",
          transition: "all 0.3s",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 rounded-xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity animate-pulse" style={{ animationDuration: "3s" }} />
        <div className="relative bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-cyan-400/40 dark:border-cyan-300/40 w-full h-full grid place-items-center shadow-lg">
          <span className="block w-5 h-5 rounded-md bg-[url(/assets/ai-logo.svg)] bg-cover bg-center" />
        </div>
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
        background: "linear-gradient(180deg, rgba(8,10,20,0.95), rgba(12,15,25,0.92))",
        boxShadow: "0 18px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,212,255,0.06)",
        backdropFilter: "blur(26px)", overflow: "hidden",
        display: "flex", flexDirection: "column",
        animation: "fadeInScale 0.2s ease-out",
      }}
    >
      <div className="relative" style={{ borderBottom: "1px solid rgba(0,212,255,0.08)", flexShrink: 0 }}>
        {glowRing}
        <div className="relative flex items-center justify-between gap-2 p-2 px-3 z-10">
          <div className="flex items-center gap-2">
            <span className="block w-5 h-5 rounded-md bg-[url(/assets/ai-logo.svg)] bg-cover bg-center" style={{ boxShadow: "0 0 15px rgba(0,212,255,0.3)" }} />
            <strong className="text-[11px] tracking-widest uppercase bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              ELIANA
            </strong>
          </div>
          <button onClick={() => setOpen(false)}
            className="w-7 h-7 grid place-items-center text-sm font-bold leading-none rounded-lg border border-white/15 bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      <ElianaChat />

      <style>{`@keyframes fadeInScale { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
    </aside>
  );
}

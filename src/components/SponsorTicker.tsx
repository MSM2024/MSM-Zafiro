"use client";

import { SPONSOR_MESSAGES } from "@/lib/constants";

export function SponsorTicker() {
  const items = SPONSOR_MESSAGES.flatMap((m) => [
    <span className="ticker-item" key={m.brand + "a"} style={{ display: "inline-flex", alignItems: "center", gap: 10, minHeight: 42, padding: "0 28px", color: "#dbeafe", whiteSpace: "nowrap", fontSize: 13 }}>
      <span className="ticker-badge" style={{ padding: "5px 9px", borderRadius: 999, color: "#fff", background: "linear-gradient(135deg, #2563ff, #7c3aed)", fontSize: 10, fontWeight: 900, textTransform: "uppercase" }}>Sponsored</span>
      <strong style={{ color: "#fff" }}>{m.brand}</strong>
      {m.text}
    </span>,
    <span className="ticker-item" key={m.brand + "b"} style={{ display: "inline-flex", alignItems: "center", gap: 10, minHeight: 42, padding: "0 28px", color: "#dbeafe", whiteSpace: "nowrap", fontSize: 13 }}>
      <span className="ticker-badge" style={{ padding: "5px 9px", borderRadius: 999, color: "#fff", background: "linear-gradient(135deg, #2563ff, #7c3aed)", fontSize: 10, fontWeight: 900, textTransform: "uppercase" }}>Sponsored</span>
      <strong style={{ color: "#fff" }}>{m.brand}</strong>
      {m.text}
    </span>,
  ]);

  return (
    <aside className="sponsor-ticker" style={{
      position: "sticky", top: 0, zIndex: 50, overflow: "hidden",
      borderBottom: "1px solid rgba(0, 212, 255, 0.16)",
      background: "linear-gradient(90deg, rgba(37, 99, 255, 0.22), rgba(124, 58, 237, 0.2), rgba(0, 212, 255, 0.18)), rgba(3, 7, 18, 0.92)",
      boxShadow: "0 16px 60px rgba(0, 0, 0, 0.28)", backdropFilter: "blur(24px)",
    }}>
      <div className="ticker-track" style={{ display: "flex", width: "max-content", animation: "tickerMove 34s linear infinite" }}>
        {items}
      </div>
    </aside>
  );
}

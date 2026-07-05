"use client";

import { useState } from "react";
import { Share2, Check, Link2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  variant?: "icon" | "full" | "pill";
}

const NETWORKS = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    color: "#25D366",
    icon: "🟢",
    getUrl: (u: string, t: string) => `https://wa.me/?text=${encodeURIComponent(t + " " + u)}`,
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    icon: "🔵",
    getUrl: (u: string) => `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
  },
  {
    id: "twitter",
    name: "X",
    color: "#000",
    icon: "🐦",
    getUrl: (u: string, t: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
  },
  {
    id: "telegram",
    name: "Telegram",
    color: "#0088cc",
    icon: "✈️",
    getUrl: (u: string, t: string) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
  },
  {
    id: "email",
    name: "Email",
    color: "#6b7280",
    icon: "📧",
    getUrl: (u: string, t: string) => `mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(t + "\n\n" + u)}`,
  },
];

export function ShareButton({ title, text, url, variant = "icon" }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = text || title;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
    setOpen(false);
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
        return;
      } catch { /* fallback to menu */ }
    }
    setOpen(!open);
  };

  if (variant === "full") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <strong style={{ fontSize: 13, color: "var(--text)" }}>Compartir</strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {NETWORKS.map((n) => (
            <a
              key={n.id}
              href={n.getUrl(shareUrl, shareText)}
              target="_blank"
              rel="noopener noreferrer"
              title={`Compartir en ${n.name}`}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", border: "1px solid var(--border)", borderRadius: 12,
                background: "var(--surface-strong)", color: "var(--text)",
                textDecoration: "none", fontSize: 12, fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              <span>{n.icon}</span>
              <span>{n.name}</span>
            </a>
          ))}
          <button
            onClick={copyLink}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px", border: "1px solid var(--border)", borderRadius: 12,
              background: copied ? "rgba(16,185,129,0.1)" : "var(--surface-strong)",
              color: copied ? "#10b981" : "var(--text)",
              cursor: "pointer", fontSize: 12, fontWeight: 500,
              transition: "all 0.2s",
            }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            {copied ? "Copiado" : "Copiar link"}
          </button>
        </div>
      </div>
    );
  }

  if (variant === "pill") {
    return (
      <div style={{ position: "relative" }}>
        <button
          onClick={shareNative}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 14px", border: "1px solid var(--border)", borderRadius: 999,
            background: "var(--surface)", color: "var(--muted)", cursor: "pointer",
            fontSize: 12, fontWeight: 500, transition: "all 0.2s",
          }}
        >
          <Share2 className="w-3.5 h-3.5" />
          Compartir
        </button>
        {open && (
          <div style={{
            position: "absolute", bottom: "100%", left: 0, marginBottom: 8,
            display: "flex", gap: 4, padding: 6,
            border: "1px solid var(--border)", borderRadius: 14,
            background: "var(--surface)", boxShadow: "0 8px 30px var(--shadow)",
            backdropFilter: "blur(20px)", zIndex: 50,
          }}>
            {NETWORKS.map((n) => (
              <a
                key={n.id}
                href={n.getUrl(shareUrl, shareText)}
                target="_blank"
                rel="noopener noreferrer"
                title={n.name}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  display: "grid", placeItems: "center",
                  background: "var(--surface-strong)", textDecoration: "none",
                  fontSize: 16, transition: "all 0.2s",
                }}
              >{n.icon}</a>
            ))}
            <button
              onClick={copyLink}
              title="Copiar link"
              style={{
                width: 36, height: 36, borderRadius: 10, border: 0,
                display: "grid", placeItems: "center",
                background: copied ? "rgba(16,185,129,0.1)" : "var(--surface-strong)",
                color: copied ? "#10b981" : "var(--muted)", cursor: "pointer", fontSize: 16,
              }}
            >
              {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    );
  }

  // default: icon
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={shareNative}
        title="Compartir"
        style={{
          width: 36, height: 36, border: "1px solid var(--border)", borderRadius: 10,
          background: "var(--surface-strong)", color: "var(--muted)", cursor: "pointer",
          display: "grid", placeItems: "center", transition: "all 0.2s",
        }}
      >
        <Share2 className="w-4 h-4" />
      </button>
      {open && (
        <div style={{
          position: "absolute", bottom: "100%", right: 0, marginBottom: 8,
          display: "flex", gap: 4, padding: 6,
          border: "1px solid var(--border)", borderRadius: 14,
          background: "var(--surface)", boxShadow: "0 8px 30px var(--shadow)",
          backdropFilter: "blur(20px)", zIndex: 50,
        }}>
          {NETWORKS.map((n) => (
            <a
              key={n.id}
              href={n.getUrl(shareUrl, shareText)}
              target="_blank"
              rel="noopener noreferrer"
              title={n.name}
              style={{
                width: 36, height: 36, borderRadius: 10,
                display: "grid", placeItems: "center",
                background: "var(--surface-strong)", textDecoration: "none",
                fontSize: 16, transition: "all 0.2s",
              }}
            >{n.icon}</a>
          ))}
          <button
            onClick={copyLink}
            title="Copiar link"
            style={{
              width: 36, height: 36, borderRadius: 10, border: 0,
              display: "grid", placeItems: "center",
              background: copied ? "rgba(16,185,129,0.1)" : "var(--surface-strong)",
              color: copied ? "#10b981" : "var(--muted)", cursor: "pointer", fontSize: 16,
            }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}

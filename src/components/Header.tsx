"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/communities", label: "Communities" },
  { href: "/ai", label: "AI" },
  { href: "/membership", label: "Plans" },
  { href: "/sponsor", label: "Sponsor" },
  { href: "/profile", label: "Profile" },
];

export function Header() {
  const pathname = usePathname();
  const { toggle } = useTheme();

  return (
    <header style={{
      position: "sticky", top: 16, zIndex: 10,
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18,
      padding: "12px 14px",
      border: "1px solid var(--border)", borderRadius: 24,
      background: "var(--surface)", boxShadow: "0 18px 70px var(--shadow)",
      backdropFilter: "blur(24px)",
    }}>
      <div className="brand" style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 190, fontWeight: 750 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}>
          <img className="mark" src="/assets/ai-logo.svg" alt="" style={{ width: 38, height: 38, borderRadius: 14, objectFit: "cover", boxShadow: "0 18px 50px rgba(37,99,255,0.3)" }} />
          <span style={{ fontSize: 15 }}>Zafiro</span>
        </Link>
        <span className="global-chip header-brand-chip" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 11px", border: "1px solid rgba(37,99,255,0.25)", borderRadius: 999, background: "rgba(37,99,255,0.08)", fontSize: 13, fontWeight: 700 }}>
          by MSM
        </span>
      </div>

      <nav className="header-nav" aria-label="Principal" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "nav-button",
              pathname === item.href && "active"
            )}
            style={{
              padding: "9px 10px", borderRadius: 999, fontSize: 13,
              color: pathname === item.href ? "var(--text)" : "var(--muted)",
              background: pathname === item.href ? "rgba(37,99,255,0.09)" : "transparent",
              border: 0, textDecoration: "none",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="actions header-actions" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Link
          href="/search"
          className="icon-button"
          aria-label="Buscar"
          style={{
            width: 42, height: 42, display: "grid", placeItems: "center",
            border: "1px solid var(--border)", borderRadius: 16,
            background: "var(--surface-strong)", color: "var(--muted)", textDecoration: "none", fontSize: 20,
          }}
        >
          ⌕
        </Link>
        <button
          className="icon-button"
          onClick={toggle}
          aria-label="Cambiar tema"
          style={{
            width: 42, height: 42, border: "1px solid var(--border)", borderRadius: 16,
            background: "var(--surface-strong)", color: "var(--muted)", fontSize: 18, cursor: "pointer",
          }}
        >
          ◐
        </button>
        <Link
          href="/auth"
          className="account-button"
          style={{
            minHeight: 42, border: 0, borderRadius: 16, color: "#fff",
            background: "linear-gradient(135deg, #2563ff, #7c3aed)",
            padding: "0 14px", fontSize: 13, fontWeight: 800, textDecoration: "none",
            display: "inline-flex", alignItems: "center",
          }}
        >
          Create account
        </Link>
      </div>
    </header>
  );
}

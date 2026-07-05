"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/explore", label: "Explorar", icon: "○" },
  { href: "/question/new", label: "Preguntar", icon: "+" },
  { href: "/communities", label: "Comunidades", icon: "◈" },
  { href: "/notifications", label: "Alertas", icon: "◉" },
  { href: "/profile", label: "Perfil", icon: "◎" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Navegación principal" style={{
      position: "fixed", left: "50%", right: "auto", bottom: 12,
      zIndex: 45, display: "flex", justifyContent: "space-around", alignItems: "center",
      width: "min(600px, calc(100% - 20px))", padding: "6px 4px",
      border: "1px solid var(--border)", borderRadius: 22,
      background: "var(--surface)", boxShadow: "0 12px 50px var(--shadow)",
      backdropFilter: "blur(24px)", transform: "translateX(-50%)",
    }}>
      {ITEMS.map((item) => {
        const isActive = pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn("nav-button", isActive && "active")}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              padding: "4px 8px", borderRadius: 12, minWidth: 48,
              color: isActive ? "var(--text)" : "var(--muted)",
              background: isActive ? "rgba(37,99,255,0.09)" : "transparent",
              border: 0, textDecoration: "none", transition: "color 150ms",
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

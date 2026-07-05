"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/question/new", label: "Ask" },
  { href: "/communities", label: "Communities" },
  { href: "/notifications", label: "Alerts" },
  { href: "/ai", label: "AI" },
  { href: "/profile", label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Navegación principal" style={{
      position: "fixed", left: "50%", right: "auto", bottom: 14,
      zIndex: 45, display: "grid",
      gridTemplateColumns: "repeat(7, minmax(72px, 1fr))", gap: 6,
      width: "min(780px, calc(100% - 28px))", padding: 8,
      border: "1px solid var(--border)", borderRadius: 24,
      background: "var(--surface)", boxShadow: "0 18px 70px var(--shadow)",
      backdropFilter: "blur(24px)", transform: "translateX(-50%)",
    }}>
      {ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn("nav-button", pathname === item.href && "active")}
          style={{
            padding: "9px 10px", borderRadius: 999, fontSize: 13, textAlign: "center",
            color: pathname === item.href ? "var(--text)" : "var(--muted)",
            background: pathname === item.href ? "rgba(37,99,255,0.09)" : "transparent",
            border: 0, textDecoration: "none",
          }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

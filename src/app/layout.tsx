import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { SponsorTicker } from "@/components/SponsorTicker";
import { BottomNav } from "@/components/BottomNav";
import { AiCorner } from "@/components/AiCorner";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "MSM Zafiro — Red Social del Conocimiento + IA",
    template: "%s | MSM Zafiro",
  },
  description:
    "Pregunta cualquier cosa. Recibe una respuesta inicial de IA. Mejórala con personas reales. Conserva conocimiento útil para todos.",
  keywords: [
    "red social del conocimiento",
    "IA",
    "inteligencia artificial",
    "preguntas y respuestas",
    "aprender",
    "conocimiento",
    "ELIANA",
    "MSM",
    "Zafiro",
  ],
  openGraph: {
    title: "MSM Zafiro — Red Social del Conocimiento + IA",
    description:
      "Pregunta cualquier cosa. Recibe una respuesta inicial de IA. Mejórala con personas reales. Conserva conocimiento útil para todos.",
    siteName: "MSM Zafiro",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MSM Zafiro",
    description:
      "La red social del conocimiento + IA. Pregunta cualquier cosa, aprende junto a la comunidad.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;650;700;750;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          <SponsorTicker />
          <div className="shell" style={{ width: "min(1220px, calc(100% - 32px))", margin: "0 auto", padding: "18px 0 112px" }}>
            <Header />
            <main style={{ display: "grid", gap: "46px", paddingTop: "54px" }}>
              {children}
            </main>
            <footer className="terms-footer" style={{ marginTop: 36, padding: 18, border: "1px solid var(--border)", borderRadius: 24, background: "var(--surface)", color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>
              <strong>Zafiro</strong> es una red mundial de conocimiento basada en preguntas. No es consejo médico, legal o financiero. La IA ayuda, pero puede equivocarse.
              <div className="terms-links" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
                <a href="/terms" style={{ color: "var(--text)", fontWeight: 700, textDecoration: "none" }}>Terms</a>
                <a href="/terms" style={{ color: "var(--text)", fontWeight: 700, textDecoration: "none" }}>Privacy</a>
                <a href="/terms" style={{ color: "var(--text)", fontWeight: 700, textDecoration: "none" }}>AI Safety</a>
                <a href="/membership" style={{ color: "var(--text)", fontWeight: 700, textDecoration: "none" }}>Plans</a>
              </div>
            </footer>
          </div>
          <AiCorner />
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}

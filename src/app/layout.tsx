import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import AuthBridgeInit from "@/components/AuthBridgeInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ZAFIRO — Universo Digital Soberano",
    template: "%s | ZAFIRO",
  },
  description: "Red Social del Conocimiento, la Conciencia y el Propósito. Conecta personas, ideas, conocimiento, negocios, tecnología, historia, fe y propósito en el ecosistema MSM.",
  keywords: ["ZAFIRO", "MSM", "ELIANA", "conocimiento", "conciencia", "propósito", "ecosistema digital", "red social", "IA"],
  authors: [{ name: "MSM MY STORE LLC" }],
  openGraph: {
    title: "ZAFIRO — Universo Digital Soberano",
    description: "Red Social del Conocimiento, la Conciencia y el Propósito. Conecta personas, ideas, conocimiento, negocios, tecnología, historia, fe y propósito en el ecosistema MSM.",
    siteName: "ZAFIRO",
    type: "website",
    locale: "es_ES",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ZAFIRO",
  },
  applicationName: "ZAFIRO",
  other: {
    "mobile-web-app-capable": "yes",
  },
};

/* ============================================================
   SALMO 91 — Protección divina sobre ZAFIRO OS
   "El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente."
   ============================================================ */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#050816" />
        <meta name="color-scheme" content="dark" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon-192.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js', { scope: '/' });
          }
        `}} />
      </head>
      <body className="bg-[#050816] text-white antialiased flex flex-col min-h-screen">
        <ClientLayout>
          <AuthBridgeInit />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

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
    default: "ZAFIRO — MSM Economía",
    template: "%s | ZAFIRO",
  },
  description: "Sistema Operativo de Microrredes Inteligentes para la economía cubana.",
  keywords: ["ZAFIRO", "MSM", "economía", "Cuba", "microrred", "IA", "ELIANA"],
  authors: [{ name: "MSM MY STORE LLC" }],
  openGraph: {
    title: "ZAFIRO — MSM Economía",
    description: "Sistema Operativo de Microrredes Inteligentes para la economía cubana.",
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
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

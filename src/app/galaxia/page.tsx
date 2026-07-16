'use client'

import { usePageTitle } from "@/lib/usePageTitle"
import dynamic from "next/dynamic"
import Link from "next/link"

const GalaxiaInfinita = dynamic(() => import("@/components/GalaxiaInfinita"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#020412] flex items-center justify-center">
      <div className="text-center">
        <p className="text-[10px] text-[#00D9FF] tracking-[0.3em] uppercase animate-pulse">
          Cargando Galaxia Infinita...
        </p>
        <div className="mt-4 w-8 h-8 border border-[#00D9FF]/30 border-t-[#00D9FF] rounded-full animate-spin mx-auto" />
      </div>
    </div>
  ),
})

export default function GalaxiaPage() {
  usePageTitle("Galaxia Infinita — ZAFIRO")

  return (
    <div className="fixed inset-0 w-full h-full bg-[#020412]">
      <GalaxiaInfinita />
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 text-[9px] text-slate-500 hover:text-white transition-colors bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800/30"
      >
        ← Salir del Portal
      </Link>
    </div>
  )
}

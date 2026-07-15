'use client'

import dynamic from "next/dynamic"
import { usePageTitle } from "@/lib/usePageTitle"

const HoloCinemaCanvas = dynamic(() => import("@/components/HoloCinemaCanvas"), { ssr: false })

export default function HoloCinemaPage() {
  usePageTitle("Holo Cinema — Genesis Chamber")

  return (
    <div className="fixed inset-0 bg-[#05070D]">
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h1 className="text-lg font-bold text-[#00D9FF]">HOLO CINEMA</h1>
        <p className="text-xs text-slate-500">Genesis Chamber — ELIANA Runtime</p>
      </div>
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none flex gap-3 text-xs text-slate-600">
        {["G1", "G2", "G3", "G4", "G5", "G6", "G7"].map((g, i) => {
          const colors = ["#00D9FF","#FF6B35","#FFD700","#7B68EE","#00E676","#FF4081","#FFFFFF"]
          return (
            <span key={g} style={{ color: colors[i] }}>
              {g}
            </span>
          )
        })}
      </div>
      <HoloCinemaCanvas />
    </div>
  )
}

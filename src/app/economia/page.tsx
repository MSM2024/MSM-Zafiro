'use client'

import EconomiaPanel from "@/components/EconomiaPanel"
import { usePageTitle } from "@/lib/usePageTitle"

export default function EconomiaPage() {
  usePageTitle("MSM Economía")
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <EconomiaPanel />
    </main>
  )
}

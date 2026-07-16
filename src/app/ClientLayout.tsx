'use client'

import { usePathname } from "next/navigation"
import Footer from "@/components/Footer"
import ElianaFloatingButton from "@/components/ElianaFloatingButton"
import NetworkBackground from "@/components/ui/NetworkBackground"
import PresenciaInstantanea from "@/components/PresenciaInstantanea"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/" || pathname.startsWith("/api/")

  return (
    <>
      <NetworkBackground />
      <div className="relative z-10">
        {children}
      </div>
      {!isHome && <Footer />}
      <PresenciaInstantanea />
      <ElianaFloatingButton />
    </>
  )
}

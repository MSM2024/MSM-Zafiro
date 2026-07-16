'use client'

import { usePathname } from "next/navigation"
import Footer from "@/components/Footer"
import ElianaFloatingButton from "@/components/ElianaFloatingButton"
import NetworkBackground from "@/components/ui/NetworkBackground"
import PresenciaInstantanea from "@/components/PresenciaInstantanea"
import ZafiroLockScreen from "@/components/ZafiroLockScreen"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/" || pathname.startsWith("/api/")

  return (
    <ZafiroLockScreen>
      <NetworkBackground />
      <div className="relative z-10">
        {children}
      </div>
      {!isHome && <Footer />}
      <PresenciaInstantanea />
      <ElianaFloatingButton />
    </ZafiroLockScreen>
  )
}

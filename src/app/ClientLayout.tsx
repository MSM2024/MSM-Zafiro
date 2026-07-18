'use client'

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Footer from "@/components/Footer"
import ElianaFloatingButton from "@/components/ElianaFloatingButton"
import NetworkBackground from "@/components/ui/NetworkBackground"
import PresenciaInstantanea from "@/components/PresenciaInstantanea"
import ZafiroLockScreen from "@/components/ZafiroLockScreen"
import ZafiroShell from "@/components/os/ZafiroShell"
import { loadPreferences } from "@/lib/settings/storage"
import { applyAllTheme } from "@/lib/settings/theme-manager"
import { getSession } from "@/lib/auth"

function ThemeInitializer() {
  useEffect(() => {
    const session = getSession()
    const userId = session?.id || session?.email || 'anonymous'
    const prefs = loadPreferences(userId)
    applyAllTheme(prefs)
  }, [])
  return null
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/" || pathname.startsWith("/api/")
  const isOsRoute = pathname.startsWith("/os/") || pathname === "/os"

  if (isOsRoute) {
    return <ZafiroShell>{children}</ZafiroShell>
  }

  return (
    <ZafiroLockScreen>
      <ThemeInitializer />
      <NetworkBackground />
      <div className="relative z-10">{children}</div>
      {!isHome && <Footer />}
      <PresenciaInstantanea />
      <ElianaFloatingButton />
    </ZafiroLockScreen>
  )
}

'use client'

import { useState, useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"
import Footer from "@/components/Footer"
import NetworkBackground from "@/components/ui/NetworkBackground"
import PresenciaInstantanea from "@/components/PresenciaInstantanea"
import ZafiroLockScreen from "@/components/ZafiroLockScreen"
import ElianaSplashScreen from "@/components/eliana3d/ElianaSplashScreen"
import ElianaChatWidget from "@/components/eliana3d/ElianaChatWidget"
import HoloCompanion from "@/components/HoloCompanion"

const SPLASH_SEEN_KEY = 'zafiro_splash_seen'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/" || pathname.startsWith("/api/")
  const [showSplash, setShowSplash] = useState(false)
  const [splashReady, setSplashReady] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem(SPLASH_SEEN_KEY)
    if (!seen && pathname === '/') {
      setShowSplash(true)
    }
    setSplashReady(true)
  }, [pathname])

  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem(SPLASH_SEEN_KEY, 'true')
    setShowSplash(false)
  }, [])

  if (showSplash) {
    return <ElianaSplashScreen onComplete={handleSplashComplete} />
  }

  if (!splashReady) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#050816' }} />
    )
  }

  return (
    <ZafiroLockScreen>
      <NetworkBackground />
      <div className="relative z-10">
        {children}
      </div>
      {!isHome && <Footer />}
      <PresenciaInstantanea />
      <ElianaChatWidget />
      <HoloCompanion />
    </ZafiroLockScreen>
  )
}

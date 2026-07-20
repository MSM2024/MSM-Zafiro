'use client'

import { useState, useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"
import Footer from "@/components/Footer"
import NetworkBackground from "@/components/ui/NetworkBackground"
import ZafiroLockScreen from "@/components/ZafiroLockScreen"
import ZafiroSplashScreen from "@/components/zafiro/ZafiroSplashScreen"
import ZafiroErrorBoundary from "@/components/ZafiroErrorBoundary"
import ElianaChatWidget from "@/components/eliana3d/ElianaChatWidget"
import ElianaFloating from "@/components/ElianaFloating"
import InstallPrompt from "@/components/InstallPrompt"
import { SyncStatusIndicator } from "@/components/SyncStatusIndicator"
import { registerSyncHandler } from "@/lib/sync-engine"
import { getOrders, updateOrderStatus, type Order } from "@/lib/marketplace"
import { injectBuildInfo } from "@/lib/build-info"

const SPLASH_SEEN_KEY = 'zafiro_splash_seen'
const SW_REGISTERED_KEY = 'zafiro_sw_registered'

function registerSW() {
  if (typeof window === 'undefined' || localStorage.getItem(SW_REGISTERED_KEY)) return
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(() => {
        try { localStorage.setItem(SW_REGISTERED_KEY, 'true') } catch {}
      })
      .catch(() => {})
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'CLEAR_CACHE') {
        caches.keys().then(keys => keys.forEach(k => caches.delete(k)))
      }
    })
  }
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/" || pathname.startsWith("/api/")
  const [showSplash, setShowSplash] = useState(false)
  const [splashReady, setSplashReady] = useState(false)

  useEffect(() => {
    registerSW()
    injectBuildInfo()
    const seen = sessionStorage.getItem(SPLASH_SEEN_KEY)
    if (!seen && pathname === '/') {
      setShowSplash(true)
    }
    setSplashReady(true)

    registerSyncHandler("post", async (item) => {
      try {
        const data = item.data as { id: string } & Record<string, any>
        const posts = JSON.parse(localStorage.getItem('zafiro_feed_posts') || '[]')
        if (posts.find((p: any) => p.id === data.id)) return true
        posts.unshift(data)
        localStorage.setItem('zafiro_feed_posts', JSON.stringify(posts))
        return true
      } catch { return false }
    })

    registerSyncHandler("message", async (item) => {
      try {
        const { convId, message } = item.data as { convId: string; message: any }
        const msgs = JSON.parse(localStorage.getItem('zafiro_msg_' + convId) || '[]')
        if (msgs.find((m: any) => m.id === message.id)) return true
        msgs.push(message)
        localStorage.setItem('zafiro_msg_' + convId, JSON.stringify(msgs))
        return true
      } catch { return false }
    })

    registerSyncHandler("order", async (item) => {
      try {
        const payload = item.data as Order
        const existing = getOrders().find(o => o.id === payload.id)
        if (existing) return true
        const orders = getOrders()
        orders.unshift(payload)
        localStorage.setItem('zafiro_orders', JSON.stringify(orders))
        return true
      } catch { return false }
    })
  }, [pathname])

  const handleSplashComplete = useCallback(() => {
    try {
      sessionStorage.setItem(SPLASH_SEEN_KEY, 'true')
    } catch { /* storage unavailable */ }
    setShowSplash(false)
  }, [])

  // Splash overlay instead of full unmount
  if (showSplash) {
    return <ZafiroSplashScreen onComplete={handleSplashComplete} />
  }

  if (!splashReady) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: '#000000' }}>
        <svg viewBox="0 0 100 120" className="w-10 h-12 animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(0,217,255,0.2))' }}>
          <polygon points="50,2 26,26 50,36" fill="#1a4b8c" opacity="0.9"/>
          <polygon points="50,2 74,26 50,36" fill="#1e3a5f" opacity="0.85"/>
          <polygon points="12,44 32,41 50,44 68,41 88,44" fill="#6366f1" opacity="0.8"/>
          <polygon points="12,48 32,49 50,108 50,118" fill="#2563eb" opacity="0.8"/>
          <polygon points="88,48 68,49 50,108 50,118" fill="#7c3aed" opacity="0.75"/>
        </svg>
      </div>
    )
  }

  return (
    <ZafiroErrorBoundary>
      <ZafiroLockScreen>
        <NetworkBackground />
        <div className="relative z-10">
          {children}
        </div>
        {!isHome && <Footer />}
        <ElianaFloating />
        <ElianaChatWidget />
        <InstallPrompt />
        <SyncStatusIndicator />
      </ZafiroLockScreen>
    </ZafiroErrorBoundary>
  )
}

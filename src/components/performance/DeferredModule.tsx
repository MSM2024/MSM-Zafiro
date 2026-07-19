'use client'

import { useState, useEffect, type ReactNode } from "react"
import { getNetworkMode, onNetworkModeChange } from "@/lib/performance/network-mode"
import { getModulePriority, shouldRenderComponent } from "@/lib/performance/adaptive-loader"
import type { ZafiroNetworkMode } from "@/lib/performance/network-mode"

interface Props {
  componentKey: string
  children: ReactNode
  fallback?: ReactNode
  loading?: ReactNode
}

export default function DeferredModule({ componentKey, children, fallback, loading }: Props) {
  const [mode, setMode] = useState<ZafiroNetworkMode>('FULL')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const m = getNetworkMode()
    setMode(m)
    const unsub = onNetworkModeChange(newMode => setMode(newMode))
    return unsub
  }, [])

  useEffect(() => {
    const shouldShow = shouldRenderComponent(componentKey, mode)
    if (shouldShow) {
      const priority = getModulePriority(componentKey, mode)
      const delay = priority === 'deferred' ? 2000 : priority === 'low' ? 500 : 0
      const timer = setTimeout(() => setLoaded(true), delay)
      return () => clearTimeout(timer)
    }
  }, [componentKey, mode])

  if (!shouldRenderComponent(componentKey, mode)) {
    return <>{fallback || null}</>
  }

  if (!loaded) {
    return <>{loading || <div className="animate-pulse bg-slate-800/40 rounded-xl min-h-[100px]" />}</>
  }

  return <>{children}</>
}

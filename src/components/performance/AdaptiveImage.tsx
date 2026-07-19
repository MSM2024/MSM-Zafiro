'use client'

import { useState, useEffect, useRef } from "react"
import { getNetworkMode, onNetworkModeChange } from "@/lib/performance/network-mode"
import type { ZafiroNetworkMode } from "@/lib/performance/network-mode"

interface Props {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  placeholder?: string
  sizes?: string
}

export default function AdaptiveImage({ src, alt, width, height, priority, className = '', placeholder, sizes }: Props) {
  const [mode, setMode] = useState<ZafiroNetworkMode>('FULL')
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMode(getNetworkMode())
    const unsub = onNetworkModeChange(m => setMode(m))
    return unsub
  }, [])

  useEffect(() => {
    if (priority) { setInView(true); return }
    if (!imgRef.current) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { rootMargin: '200px' },
    )
    obs.observe(imgRef.current)
    return () => obs.disconnect()
  }, [priority])

  const shouldLoad = mode !== 'OFFLINE' && inView
  const useLowRes = mode === 'LIGHT' && !priority

  const resolvedSrc = useLowRes && src.match(/\/assets\//)
    ? src.replace(/\.(webp|png|jpg|jpeg)$/i, '-small.webp')
    : src

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {placeholder && !loaded && (
        <div className="absolute inset-0 bg-slate-800/60 animate-pulse rounded-inherit" />
      )}
      {shouldLoad ? (
        <img
          src={resolvedSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          sizes={sizes}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      ) : (
        <div className="w-full h-full bg-slate-800/40 flex items-center justify-center">
          <span className="text-[10px] text-slate-600">{mode === 'OFFLINE' ? 'Sin conexión' : 'Cargando...'}</span>
        </div>
      )}
    </div>
  )
}

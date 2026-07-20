'use client'

import { useEffect, useState } from "react"

export function LoadingScreen({ text = "Cargando..." }: { text?: string }) {
  const [show, setShow] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShow(true), 150); return () => clearTimeout(t) }, [])
  if (!show) return null
  return (
    <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center gap-4">
      <svg viewBox="0 0 100 120" className="w-8 h-10 animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(0,217,255,0.2))' }}>
        <polygon points="50,2 26,26 50,36" fill="#1a4b8c" opacity="0.9" />
        <polygon points="50,2 74,26 50,36" fill="#1e3a5f" opacity="0.85" />
        <polygon points="12,44 32,41 50,44 68,41 88,44" fill="#6366f1" opacity="0.8" />
        <polygon points="12,48 32,49 50,108 50,118" fill="#2563eb" opacity="0.8" />
        <polygon points="88,48 68,49 50,108 50,118" fill="#7c3aed" opacity="0.75" />
      </svg>
      <p className="text-xs text-slate-500">{text}</p>
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from "react"

export function openElianaChat() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("eliana:open"))
}

export default function ElianaFloating() {
  const [hidden, setHidden] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setMounted(true)
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleOpen = () => setHidden(true)
    const handleClose = () => setHidden(false)

    window.addEventListener("eliana:open", handleOpen)
    window.addEventListener("eliana:chat-close", handleClose)

    return () => {
      window.removeEventListener("eliana:open", handleOpen)
      window.removeEventListener("eliana:chat-close", handleClose)
    }
  }, [mounted])

  const handleClick = useCallback(() => {
    openElianaChat()
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      openElianaChat()
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Floating card — visible when chat is closed */}
      {!hidden && (
        <button
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className="fixed z-[9999] flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050816]"
          style={{
            bottom: "max(16px, env(safe-area-inset-bottom, 16px))",
            right: "max(16px, env(safe-area-inset-right, 16px))",
          }}
          aria-label="Abrir chat con ELIANA IA"
        >
          {/* Card background */}
          <span
            className="absolute inset-0 rounded-2xl border border-slate-700/50 backdrop-blur-xl"
            style={{
              background: "linear-gradient(135deg, rgba(5,8,22,0.85), rgba(15,23,42,0.8))",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(0,217,255,0.08)",
            }}
          />

          {/* Hover glow */}
          <span
            className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "radial-gradient(ellipse at 30% 50%, rgba(0,217,255,0.06) 0%, transparent 70%)",
            }}
          />

          {/* Content */}
          <span className="relative z-10 flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-2.5">
            {/* Avatar */}
            <span
              className="shrink-0 rounded-full overflow-hidden border border-[#00D9FF]/20"
              style={{
                width: 44, height: 44,
                background: "linear-gradient(135deg, rgba(0,217,255,0.08), rgba(124,58,237,0.04))",
              }}
            >
              <img
                src="/assets/eliana/eliana-face.svg"
                alt="ELIANA"
                className="w-full h-full object-cover"
                style={{ transform: "scale(1.6) translateY(-6%)", objectPosition: "50% 22%" }}
                draggable={false}
              />
            </span>

            {/* Text */}
            <span className="flex flex-col items-start">
              <span className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-white leading-tight tracking-wide">
                  ELIANA
                </span>
                <span className="text-[9px] font-bold text-[#00D9FF] tracking-widest uppercase">
                  IA
                </span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 leading-tight">
                Tu gu&iacute;a inteligente
              </span>
            </span>

            {/* Status dot */}
            <span className="relative ml-1 sm:ml-2">
              <span className="block w-2.5 h-2.5 rounded-full bg-emerald-400"
                style={{
                  boxShadow: "0 0 6px rgba(52,211,153,0.5)",
                  animation: reduced ? "none" : "eliana-dot-pulse 2s ease-in-out infinite",
                }}
              />
            </span>
          </span>
        </button>
      )}

      {/* Keyboard shortcut: Escape re-shows card (chat sends eliana:chat-close) */}
      {/* Clicking ELIANA floating dispatches eliana:open — chat widget handles its own Escape */}

      <style>{`
        @keyframes eliana-dot-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </>
  )
}

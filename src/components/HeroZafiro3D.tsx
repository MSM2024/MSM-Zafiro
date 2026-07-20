'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

const ZAFIRO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 140">
  <defs>
    <linearGradient id="crL" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="#0f2b5c"/><stop offset="40%" stop-color="#1a4b8c"/><stop offset="70%" stop-color="#2563eb"/><stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <linearGradient id="crR" x1="1" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#0f1f3d"/><stop offset="40%" stop-color="#1e3a5f"/><stop offset="70%" stop-color="#6366f1"/><stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
    <linearGradient id="paL" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f2b5c"/><stop offset="40%" stop-color="#2563eb"/><stop offset="70%" stop-color="#6366f1"/><stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
    <linearGradient id="paR" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a1a3a"/><stop offset="40%" stop-color="#1e3a5f"/><stop offset="70%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#d946ef"/>
    </linearGradient>
    <linearGradient id="gir" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7c3aed"/><stop offset="30%" stop-color="#6366f1"/><stop offset="60%" stop-color="#2563eb"/><stop offset="100%" stop-color="#00D9FF"/>
    </linearGradient>
    <linearGradient id="bot" x1="0.5" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="#6366f1"/><stop offset="50%" stop-color="#a855f7"/><stop offset="100%" stop-color="#d946ef"/>
    </linearGradient>
    <radialGradient id="core" cx="50%" cy="55%" r="35%">
      <stop offset="0%" stop-color="#00D9FF" stop-opacity="0.25"/>
      <stop offset="60%" stop-color="#6366f1" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <filter id="sh"><feGaussianBlur in="SourceGraphic" stdDeviation="0.4"/></filter>
  </defs>
  <polygon points="50,2 26,26 50,36" fill="url(#crL)" opacity="0.95"/>
  <polygon points="50,2 74,26 50,36" fill="url(#crR)" opacity="0.9"/>
  <polygon points="8,36 26,26 32,41 12,44" fill="url(#crL)" opacity="0.8"/>
  <polygon points="92,36 74,26 68,41 88,44" fill="url(#crR)" opacity="0.75"/>
  <polygon points="12,44 32,41 50,44 68,41 88,44 92,40 92,48 88,51 68,49 50,51 32,49 12,51 8,48 8,40" fill="url(#gir)" opacity="0.85"/>
  <polygon points="12,48 32,49 50,108 50,128" fill="url(#paL)" opacity="0.9"/>
  <polygon points="88,48 68,49 50,108 50,128" fill="url(#paR)" opacity="0.85"/>
  <polygon points="12,51 32,49 50,128" fill="url(#paL)" opacity="0.45"/>
  <polygon points="88,51 68,49 50,128" fill="url(#paR)" opacity="0.4"/>
  <polygon points="44,123 50,136 56,123 50,128" fill="url(#bot)" opacity="0.9"/>
  <polygon points="50,2 43,13 50,19 57,13" fill="white" opacity="0.5" filter="url(#sh)"/>
  <polygon points="47,125 50,132 53,125 50,128" fill="white" opacity="0.35" filter="url(#sh)"/>
  <rect x="22" y="43" width="56" height="44" rx="22" fill="url(#core)"/>
  <ellipse cx="50" cy="60" rx="18" ry="24" fill="#00D9FF" opacity="0.1"><animate attributeName="opacity" values="0.08;0.18;0.08" dur="3s" repeatCount="indefinite"/></ellipse>
  <ellipse cx="50" cy="58" rx="9" ry="16" fill="white" opacity="0.05"><animate attributeName="opacity" values="0.03;0.09;0.03" dur="2s" repeatCount="indefinite"/></ellipse>
</svg>`

const ELIANA_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
  <defs>
    <radialGradient id="au" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#00D9FF" stop-opacity="0.1"/>
      <stop offset="50%" stop-color="#7C3AED" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="eg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00D9FF" stop-opacity="0.5"/>
      <stop offset="60%" stop-color="#00D9FF" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#00D9FF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ha" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a1a2e"/><stop offset="50%" stop-color="#0d0d1a"/><stop offset="100%" stop-color="#16213e"/>
    </linearGradient>
    <linearGradient id="tu" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#e8e0f0" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#c4b5d4" stop-opacity="0.75"/>
    </linearGradient>
    <linearGradient id="go" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24"/><stop offset="50%" stop-color="#D97706"/><stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="#000" opacity="0"/>
  <ellipse cx="200" cy="200" rx="150" ry="170" fill="url(#au)"/>
  <circle cx="200" cy="210" r="110" fill="none" stroke="#00D9FF" stroke-width="0.4" opacity="0.06"/>
  <path d="M115 180 C100 150 105 100 130 80 C150 65 180 55 200 52 C220 55 250 65 270 80 C295 100 300 150 285 180 C290 210 295 250 290 290 C285 330 270 370 260 400 C250 420 240 430 230 435 C220 438 210 440 200 440 C190 440 180 438 170 435 C160 430 150 420 140 400 C130 370 115 330 110 290 C105 250 110 210 115 180Z" fill="url(#ha)"/>
  <ellipse cx="200" cy="220" rx="72" ry="98" fill="#1e1b3a"/>
  <ellipse cx="200" cy="218" rx="66" ry="90" fill="#E8C9A0" opacity="0.25"/>
  <path d="M135 130 C140 100 160 80 190 75 C180 95 170 130 165 160 C160 145 148 140 135 130Z" fill="#1a1a2e" opacity="0.7"/>
  <path d="M265 130 C260 100 240 80 210 75 C220 95 230 130 235 160 C240 145 252 140 265 130Z" fill="#1a1a2e" opacity="0.7"/>
  <path d="M158 195 Q178 188 198 192" fill="none" stroke="#4a3f2e" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M202 192 Q222 188 242 195" fill="none" stroke="#4a3f2e" stroke-width="1.5" stroke-linecap="round"/>
  <ellipse cx="178" cy="210" rx="12" ry="7" fill="white" opacity="0.9"/>
  <ellipse cx="180" cy="210" rx="8" ry="6" fill="#1a1a3e"/>
  <ellipse cx="180" cy="210" rx="5" ry="5" fill="#0a4a8a"/>
  <ellipse cx="180" cy="210" rx="2.5" ry="4" fill="#00D9FF"/>
  <ellipse cx="180" cy="208" rx="1.2" ry="1.2" fill="white" opacity="0.8"/>
  <ellipse cx="178" cy="210" rx="14" ry="9" fill="url(#eg)"/>
  <ellipse cx="222" cy="210" rx="12" ry="7" fill="white" opacity="0.9"/>
  <ellipse cx="220" cy="210" rx="8" ry="6" fill="#1a1a3e"/>
  <ellipse cx="220" cy="210" rx="5" ry="5" fill="#0a4a8a"/>
  <ellipse cx="220" cy="210" rx="2.5" ry="4" fill="#00D9FF"/>
  <ellipse cx="220" cy="208" rx="1.2" ry="1.2" fill="white" opacity="0.8"/>
  <ellipse cx="222" cy="210" rx="14" ry="9" fill="url(#eg)"/>
  <path d="M195 220 C197 230 199 238 200 242 C201 238 203 230 205 220" fill="none" stroke="#b8957a" stroke-width="0.8" stroke-linecap="round" opacity="0.4"/>
  <path d="M178 258 Q190 254 200 258 Q210 254 222 258" fill="none" stroke="#c9787a" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
  <path d="M178 258 Q190 263 200 260 Q210 263 222 258" fill="none" stroke="#c9787a" stroke-width="0.8" stroke-linecap="round" opacity="0.3"/>
  <line x1="188" y1="310" x2="185" y2="330" stroke="#00D9FF" stroke-width="0.4" opacity="0.3"/>
  <line x1="212" y1="310" x2="215" y2="330" stroke="#00D9FF" stroke-width="0.4" opacity="0.3"/>
  <circle cx="185" cy="330" r="0.8" fill="#00D9FF" opacity="0.4"/>
  <circle cx="215" cy="330" r="0.8" fill="#00D9FF" opacity="0.4"/>
  <path d="M155 330 C160 340 165 390 170 440 C175 460 185 470 200 475 C215 470 225 460 230 440 C235 390 240 340 245 330 C230 340 215 345 200 348 C185 345 170 340 155 330Z" fill="url(#tu)"/>
  <path d="M155 330 C170 340 185 345 200 348 C215 345 230 340 245 330" fill="none" stroke="url(#go)" stroke-width="1.2" opacity="0.6"/>
  <line x1="200" y1="348" x2="200" y2="470" stroke="url(#go)" stroke-width="0.8" opacity="0.4"/>
</svg>`

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────

export default function HeroZafiro3D({ onEnter }: { onEnter?: () => void }) {
  const [mounted, setMounted] = useState(false)
  const [mountTimeout, setMountTimeout] = useState(false)

  useEffect(() => {
    setMounted(true)
    const t = setTimeout(() => setMountTimeout(true), 5000)
    return () => clearTimeout(t)
  }, [])

  if (!mounted && !mountTimeout) return <div className="w-full h-dvh" style={{ backgroundColor: '#000' }} />
  if (!mounted && mountTimeout) return (
    <div className="relative w-full h-dvh overflow-hidden flex flex-col items-center justify-center" style={{ backgroundColor: '#000' }}>
      <svg viewBox="0 0 100 140" className="w-16 h-auto mb-4" style={{ filter: 'drop-shadow(0 0 20px rgba(0,217,255,0.2))' }}>
        <polygon points="50,2 26,26 50,36" fill="#1a4b8c" opacity="0.9"/>
        <polygon points="50,2 74,26 50,36" fill="#1e3a5f" opacity="0.85"/>
        <polygon points="12,44 32,41 50,44 68,41 88,44" fill="#6366f1" opacity="0.8"/>
        <polygon points="12,48 32,49 50,108 50,118" fill="#2563eb" opacity="0.8"/>
        <polygon points="88,48 68,49 50,108 50,118" fill="#7c3aed" opacity="0.75"/>
      </svg>
      <h1 className="text-2xl font-black tracking-[0.15em]" style={{ fontFamily: 'Georgia, serif', color: '#fff' }}>ZAFIRO</h1>
    </div>
  )

  return (
    <div className="relative w-full h-svh overflow-hidden select-none" style={{ backgroundColor: '#000000' }}>

      {/* Nebula background */}
      <div className="absolute inset-0 z-0" style={{
        background: 'radial-gradient(ellipse at 20% 30%, rgba(10,25,49,0.65) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(106,13,173,0.15) 0%, transparent 55%), radial-gradient(ellipse at 50% 80%, rgba(0,217,255,0.05) 0%, transparent 40%)',
      }} />

      {/* Stars */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => {
          const seed = i * 7.389
          const x = (seed * 17.31) % 100
          const y = (seed * 13.07) % 100
          const s = 0.8 + (seed % 3) * 0.6
          return (
            <div key={i} className="absolute rounded-full bg-white"
              style={{
                width: s, height: s, left: `${x}%`, top: `${y}%`,
                opacity: 0.15 + (seed % 5) * 0.12,
                animation: `twinkle ${2 + (seed % 4)}s ease-in-out ${seed % 3}s infinite`,
              }} />
          )
        })}
      </div>

      {/* ELIANA - top right (mobile) / right center (desktop) */}
      <div className="absolute z-[2] pointer-events-none"
        style={{
          top: '3%', right: '3%',
          width: 'clamp(70px, 20vw, 140px)',
        }}>
        <img src={`data:image/svg+xml,${encodeURIComponent(ELIANA_SVG)}`}
          alt="ELIANA" className="w-full h-auto" style={{ filter: 'drop-shadow(0 0 20px rgba(0,217,255,0.15))' }} />
      </div>

      {/* Desktop: ELIANA larger */}
      <div className="hidden md:block absolute z-[2] pointer-events-none"
        style={{
          top: '50%', right: '4%', transform: 'translateY(-50%)',
          width: 'clamp(160px, 18vw, 260px)',
        }}>
        <img src={`data:image/svg+xml,${encodeURIComponent(ELIANA_SVG)}`}
          alt="ELIANA" className="w-full h-auto" style={{ filter: 'drop-shadow(0 0 30px rgba(0,217,255,0.2))' }} />
      </div>

      {/* Zafiro Diamond */}
      <div className="absolute inset-0 z-[3] flex items-center justify-center pointer-events-none"
        style={{ paddingTop: '2%' }}>
        <div style={{ width: 'clamp(110px, 30vw, 220px)' }}>
          <img src={`data:image/svg+xml,${encodeURIComponent(ZAFIRO_SVG)}`}
            alt="Zafiro" className="w-full h-auto"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(0,217,255,0.2)) drop-shadow(0 0 60px rgba(99,102,241,0.08))',
            }} />
        </div>
        <div className="absolute rounded-full pointer-events-none"
          style={{
            width: 'clamp(130px, 35vw, 260px)', height: 'clamp(130px, 35vw, 260px)',
            background: 'radial-gradient(circle, rgba(0,217,255,0.05) 0%, transparent 65%)',
            animation: 'pulse-glow 4s ease-in-out infinite',
          }} />
      </div>

      {/* Rings */}
      <div className="absolute inset-0 z-[3] pointer-events-none flex items-center justify-center">
        <div className="absolute rounded-full" style={{
          width: 'clamp(160px, 42vw, 320px)', height: 'clamp(160px, 42vw, 320px)',
          border: '1px solid rgba(0,255,255,0.04)',
          animation: 'spin-slow 30s linear infinite',
        }} />
        <div className="absolute rounded-full" style={{
          width: 'clamp(200px, 52vw, 400px)', height: 'clamp(200px, 52vw, 400px)',
          border: '1px solid rgba(138,43,226,0.03)',
          animation: 'spin-slow-rev 40s linear infinite',
        }} />
      </div>

      {/* Panels */}
      <div className="absolute z-[4] pointer-events-none"
        style={{ top: '8%', left: '4%' }}>
        <div style={{
          padding: '4px 10px', borderRadius: 8,
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          background: 'linear-gradient(135deg, rgba(15,82,186,0.07), rgba(10,25,49,0.12))',
          border: '1px solid rgba(0,255,255,0.1)',
          fontSize: 'clamp(6px, 1.8vw, 10px)',
          color: 'rgba(0,255,255,0.55)',
          fontFamily: 'monospace', letterSpacing: '0.15em',
        }}>
          SISTEMA ZAFIRO
        </div>
      </div>

      <div className="absolute z-[4] pointer-events-none"
        style={{ top: '8%', right: '4%' }}>
        <div style={{
          padding: '4px 10px', borderRadius: 8,
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          background: 'linear-gradient(135deg, rgba(106,13,173,0.07), rgba(10,25,49,0.12))',
          border: '1px solid rgba(138,43,226,0.1)',
          fontSize: 'clamp(6px, 1.8vw, 10px)',
          color: 'rgba(138,43,226,0.55)',
          fontFamily: 'monospace', letterSpacing: '0.15em',
        }}>
          NUCLEO
        </div>
      </div>

      {/* Desktop-only panels */}
      <div className="hidden md:block absolute z-[4] pointer-events-none"
        style={{ bottom: '28%', left: '5%' }}>
        <div style={{
          padding: '4px 10px', borderRadius: 8,
          backdropFilter: 'blur(6px)',
          background: 'linear-gradient(135deg, rgba(15,82,186,0.07), rgba(10,25,49,0.12))',
          border: '1px solid rgba(0,255,255,0.1)',
          fontSize: 9, color: 'rgba(0,255,255,0.5)',
          fontFamily: 'monospace', letterSpacing: '0.15em',
        }}>
          RENDIMIENTO
        </div>
      </div>
      <div className="hidden md:block absolute z-[4] pointer-events-none"
        style={{ bottom: '18%', left: '5%' }}>
        <div style={{
          padding: '4px 10px', borderRadius: 8,
          backdropFilter: 'blur(6px)',
          background: 'linear-gradient(135deg, rgba(106,13,173,0.07), rgba(10,25,49,0.12))',
          border: '1px solid rgba(138,43,226,0.1)',
          fontSize: 9, color: 'rgba(138,43,226,0.5)',
          fontFamily: 'monospace', letterSpacing: '0.15em',
        }}>
          ESTABILIDAD
        </div>
      </div>

      {/* Title content */}
      <div className="absolute left-0 right-0 z-[5] flex flex-col items-center pointer-events-none"
        style={{ top: '55%', transform: 'translateY(-50%)' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
          className="flex items-center justify-center gap-2 mb-1">
          <div style={{
            width: 'clamp(30px, 8vw, 60px)', height: 1,
            background: 'linear-gradient(to right, transparent, #00FFFF)',
          }} />
          <div style={{
            width: 4, height: 4, borderRadius: '50%',
            backgroundColor: '#00FFFF', boxShadow: '0 0 6px #00FFFF',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }} />
          <div style={{
            width: 'clamp(30px, 8vw, 60px)', height: 1,
            background: 'linear-gradient(to left, transparent, #00FFFF)',
          }} />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
          <span style={{
            display: 'inline-block',
            fontSize: 'clamp(32px, 10vw, 80px)',
            fontWeight: 900,
            letterSpacing: '0.08em',
            fontFamily: 'Georgia, serif',
            background: 'linear-gradient(135deg, #fff 0%, #87CEEB 25%, #00FFFF 50%, #7C3AED 75%, #fff 100%)',
            backgroundSize: '250% 100%',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 20px rgba(0,217,255,0.2))',
            animation: 'gradient-shift 8s linear infinite',
          }}>
            ZAFIRO
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{
            fontSize: 'clamp(8px, 2.5vw, 14px)',
            letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.55)',
            fontWeight: 300,
            marginTop: 4,
          }}>
          UNIVERSO INFINITO EN TUS MANOS
        </motion.p>
      </div>

      {/* Enter Button */}
      <motion.button onClick={onEnter}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        style={{
          position: 'absolute', bottom: '6%', left: '50%', transform: 'translateX(-50%)',
          zIndex: 7, cursor: 'pointer',
          padding: '10px 32px', borderRadius: 9999,
          fontSize: 'clamp(11px, 2.5vw, 14px)',
          fontFamily: 'monospace', letterSpacing: '0.25em',
          border: '1px solid rgba(0,255,255,0.2)',
          color: 'rgba(0,255,255,0.65)',
          background: 'linear-gradient(135deg, rgba(0,217,255,0.05), rgba(0,0,0,0.2))',
        }}
        whileHover={{ borderColor: 'rgba(0,255,255,0.5)', color: '#00FFFF', boxShadow: '0 0 25px rgba(0,255,255,0.12)' }}
        whileTap={{ scale: 0.97 }}>
        ENTRAR
      </motion.button>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 z-[6] pointer-events-none"
        style={{
          height: '12%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
        }} />

      {/* Keyframes */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.7; }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.08); opacity: 0.6; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-rev {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}

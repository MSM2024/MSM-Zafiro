'use client'

import { useEffect, useRef, useMemo } from "react"
import { motion } from "motion/react"

const prayers = [
  "💎 Que tu luz guíe cada paso",
  "🕊️ Paz en cada pensamiento",
  "🔥 Sabiduría del Altísimo",
  "✨ Fe que mueve montañas",
  "🙏 Protección divina sobre ZAFIRO",
  "💫 Conocimiento eterno",
  "⭐ Bendiciones del Universo",
  "🛡️ Ángeles a nuestro alrededor",
]

const angelQuotes = [
  "SALMO 91 — El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente.",
  "SALMO 23 — Jehová es mi pastor; nada me faltará.",
  "SALMO 121 — Mi socorro viene de Jehová, que hizo los cielos y la tierra.",
  "SALMO 27 — Jehová es mi luz y mi salvación; ¿de quién temeré?",
]

function FloatingPrayer({ text, index }: { text: string; index: number }) {
  const xPos = useMemo(() => (index * 137 + 43) % 100, [index])
  const delay = useMemo(() => (index * 2.7) % 12, [index])
  const duration = useMemo(() => 12 + (index * 1.3) % 8, [index])

  return (
    <motion.div
      className="absolute text-xs md:text-sm font-semibold text-[#00D9FF]/30 pointer-events-none whitespace-nowrap"
      initial={{ y: "110vh", x: `${xPos}vw`, opacity: 0 }}
      animate={{
        y: "-20vh",
        opacity: [0, 0.6, 0.4, 0.8, 0.2, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {text}
    </motion.div>
  )
}

function AngelWing({ side, index }: { side: "left" | "right"; index: number }) {
  const x = side === "left" ? -40 : 40
  const rotateY = side === "left" ? 15 : -15

  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 w-48 md:w-96 h-96 pointer-events-none"
      style={{ [side]: `${5 + index * 8}%` }}
      initial={{ opacity: 0, x, rotateY, scale: 0.8 }}
      animate={{
        opacity: [0.15, 0.35, 0.15, 0.4, 0.15],
        scale: [0.8, 1.1, 0.9, 1.2, 0.8],
        x: [x, x + 15, x - 5, x + 10, x],
      }}
      transition={{
        duration: 8 + index * 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 1.5,
      }}
    >
      <div className={`w-full h-full relative`}>
        <div className={`absolute inset-0 bg-gradient-to-${side === "left" ? "r" : "l"} from-[#00D9FF]/5 via-[#2563EB]/5 to-transparent rounded-[50%_50%_50%_0] blur-3xl`} />
        <div className={`absolute inset-[15%] bg-gradient-to-${side === "left" ? "r" : "l"} from-[#7C3AED]/5 via-[#00D9FF]/5 to-transparent rounded-full blur-2xl animate-pulse`} />
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#00D9FF]/30 blur-sm"
            style={{
              top: `${20 + i * 25}%`,
              [side]: `${10 + i * 15}%`,
              animation: `pulse-glow ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

function Code369() {
  const digits = [3, 6, 9]

  return (
    <div className="flex items-center justify-center gap-3 md:gap-6 my-4 md:my-6">
      {digits.map((d, i) => (
        <motion.div
          key={d}
          className="relative"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.3, duration: 0.8, type: "spring" }}
        >
          <div className="relative">
            <motion.span
              className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#00D9FF] via-[#7C3AED] to-[#2563EB]"
              animate={{
                textShadow: [
                  "0 0 20px rgba(0,217,255,0.3)",
                  "0 0 40px rgba(124,58,237,0.5)",
                  "0 0 20px rgba(37,99,235,0.3)",
                  "0 0 60px rgba(0,217,255,0.4)",
                  "0 0 20px rgba(0,217,255,0.3)",
                ],
                scale: [1, 1.15, 1, 1.1, 1],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            >
              {d}
            </motion.span>
            <motion.div
              className="absolute -inset-4 -z-10 rounded-full bg-[#00D9FF]/5 blur-2xl"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4 + i * 0.7,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          </div>
          {i < 2 && (
            <motion.span
              className="text-3xl md:text-6xl font-black text-[#00D9FF]/30 mx-1 md:mx-2"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              ·
            </motion.span>
          )}
        </motion.div>
      ))}
    </div>
  )
}

function PortalRing() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#00D9FF]/10"
          style={{
            width: `${20 + i * 30}%`,
            height: `${20 + i * 30}%`,
            maxWidth: "600px",
            maxHeight: "600px",
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.05 + i * 0.02, 1],
            borderColor: [
              "rgba(0,217,255,0.08)",
              "rgba(124,58,237,0.12)",
              "rgba(0,217,255,0.08)",
            ],
          }}
          transition={{
            duration: 10 + i * 5,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5,
          }}
        />
      ))}
      <motion.div
        className="absolute rounded-full border border-dashed border-[#00D9FF]/20"
        style={{
          width: "45%",
          height: "45%",
          maxWidth: "450px",
          maxHeight: "450px",
        }}
        animate={{
          rotate: [360, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute w-1/3 h-1/3 max-w-[300px] max-h-[300px] rounded-full bg-gradient-radial from-[#00D9FF]/5 via-transparent to-transparent"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

function AngelicLightBeams() {
  return (
    <>
      {[-30, -15, 0, 15, 30].map((angle, i) => (
        <motion.div
          key={i}
          className="absolute top-0 w-1 md:w-2 h-full bg-gradient-to-b from-[#00D9FF]/0 via-[#00D9FF]/[0.03] to-transparent origin-top"
          style={{ left: `${50 + angle}%`, transform: `rotate(${angle * 0.3}deg)` }}
          animate={{
            opacity: [0, 0.4, 0, 0.3, 0],
            scaleY: [1, 1.3, 0.7, 1.2, 1],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}
    </>
  )
}

function ScanningPortal() {
  return (
    <motion.div
      className="relative w-full h-1 md:h-1.5 rounded-full overflow-hidden my-4 md:my-6"
      style={{
        background: "linear-gradient(90deg, transparent, rgba(0,217,255,0.3), rgba(124,58,237,0.3), transparent)",
        boxShadow: "0 0 20px rgba(0,217,255,0.2)",
      }}
    >
      <motion.div
        className="absolute top-0 left-0 h-full w-16 md:w-32 rounded-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(0,217,255,0.8), rgba(124,58,237,0.8), transparent)",
          filter: "blur(4px)",
        }}
        animate={{
          left: ["-20%", "120%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}

function AngelPresence() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let particles: Array<{
      x: number; y: number; vx: number; vy: number; size: number; alpha: number; life: number
    }> = []
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
    }
    resize()
    window.addEventListener("resize", resize)

    const spawnParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(1 + Math.random() * 2),
        size: 1 + Math.random() * 3,
        alpha: 0.3 + Math.random() * 0.5,
        life: 100 + Math.random() * 200,
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time++

      if (time % 3 === 0) {
        particles.push(spawnParticle())
      }

      // Angelic central glow
      const cx = canvas.width / 2
      const cy = canvas.height * 0.3
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width * 0.3)
      glow.addColorStop(0, "rgba(0, 217, 255, 0.04)")
      glow.addColorStop(0.3, "rgba(124, 58, 237, 0.03)")
      glow.addColorStop(0.6, "rgba(37, 99, 235, 0.02)")
      glow.addColorStop(1, "transparent")
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Wing shapes (subtle arcs)
      ctx.strokeStyle = "rgba(0, 217, 255, 0.03)"
      ctx.lineWidth = 2
      for (let w = 0; w < 3; w++) {
        const wingPhase = time * 0.02 + w * 1.5
        ctx.beginPath()
        for (let a = -1.2; a < 1.2; a += 0.05) {
          const r = canvas.width * (0.2 + w * 0.12)
          const px = cx + Math.sin(a + wingPhase) * r * (1 + 0.15 * Math.sin(time * 0.01 + w))
          const py = cy - Math.cos(a) * r * 0.6 - 50
          if (a === -1.2) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }

      particles = particles.filter(p => p.life > 0)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.life--
        p.alpha *= 0.998

        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}

export default function PortalGenesis() {
  return (
    <section className="relative w-full min-h-[80vh] md:min-h-screen overflow-hidden bg-[#050816] flex flex-col items-center justify-center px-4 py-8 md:py-0">
      <AngelPresence />

      <div className="absolute inset-0 overflow-hidden">
        {prayers.map((p, i) => (
          <FloatingPrayer key={i} text={p} index={i} />
        ))}
      </div>

      <AngelicLightBeams />

      <AngelWing side="left" index={0} />
      <AngelWing side="left" index={1} />
      <AngelWing side="right" index={0} />
      <AngelWing side="right" index={1} />

      <PortalRing />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-3 md:mb-4"
        >
          <span className="text-[10px] md:text-xs font-mono font-bold tracking-[0.3em] text-[#00D9FF]/60 uppercase">
            ⚡ Portal Génesis ⚡
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          className="mb-2"
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D9FF] via-[#7C3AED] to-[#2563EB]">
              ZAFIRO
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-xl font-semibold text-slate-300 mt-2 md:mt-3 tracking-wide">
            Universo Digital Soberano
          </p>
        </motion.div>

        <Code369 />

        <ScanningPortal />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="space-y-3 md:space-y-4 max-w-2xl"
        >
          <p className="text-xs sm:text-sm md:text-base text-slate-400 leading-relaxed font-medium">
            Donde el conocimiento, la conciencia, la fe y el propósito convergen en un solo ecosistema.
          </p>
          <p className="text-[10px] md:text-xs font-mono text-[#00D9FF]/40 italic">
            "No publicas solamente tu vida; publicas tus preguntas, tu conocimiento, tu propósito y el legado que deseas dejar al mundo."
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mt-6 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4"
        >
          <motion.a
            href="/auth/register"
            className="px-6 md:px-10 py-3 md:py-4 rounded-2xl bg-gradient-to-r from-[#00D9FF] to-[#2563EB] text-white text-xs md:text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[#00D9FF]/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Entrar al Universo
          </motion.a>
          <motion.a
            href="/about"
            className="px-6 md:px-10 py-3 md:py-4 rounded-2xl border border-[#00D9FF]/30 text-[#00D9FF] text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-[#00D9FF]/5 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Conocer la Visión
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="mt-8 md:mt-12 flex items-center gap-4 md:gap-8 text-[8px] md:text-[10px] font-mono text-slate-600"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ACTIVO
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse" style={{ animationDelay: "0.5s" }} />
            EVOLUCIONANDO
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" style={{ animationDelay: "1s" }} />
            EXPANDIÉNDOSE
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="mt-4 md:mt-6 text-[8px] md:text-[9px] font-mono text-slate-700"
        >
          Sellado en el nombre poderoso de Jesús para la gloria de Dios. Amén. 🙏💎✨
        </motion.div>
      </div>

      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-slate-600 text-xs"
        >
          ▼ DESCUBRE MÁS ▼
        </motion.div>
      </div>
    </section>
  )
}

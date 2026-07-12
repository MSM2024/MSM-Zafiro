'use client'

import Link from "next/link"
import { ArrowLeft, Gem, Globe, Microscope, Network, BookOpen, Sparkles, Zap, Users, Target, Search, Shield } from "lucide-react"
import { usePageTitle } from "@/lib/usePageTitle"
import ElianaDiamond from "@/components/ElianaDiamond"

export default function ElianaPage() {
  usePageTitle("ELIANA — ZAFIRO")

  const capabilities = [
    { icon: "eliana", title: "Análisis de Contenido", desc: "ELIANA procesa cada plataforma conectada y extrae conceptos clave, categorías, temas y palabras clave. Genera resúmenes inteligentes que permiten entender el contenido sin necesidad de abrirlo." },
    { icon: Network, title: "Mapa Vivo del Conocimiento", desc: "Cada análisis se integra en un grafo de conocimiento donde los conceptos se relacionan entre sí. ELIANA descubre conexiones invisibles entre temas, creadores y plataformas." },
    { icon: Search, title: "Búsqueda Semántica", desc: "No busques por palabras clave. ELIANA entiende el significado de tu pregunta y encuentra respuestas relevantes aunque usen términos diferentes." },
    { icon: Gem, title: "Recomendaciones Inteligentes", desc: "Basado en tu perfil, tus intereses y tu historial, ELIANA sugiere preguntas, creadores, círculos y plataformas que podrían interesarte." },
    { icon: Sparkles, title: "Resúmenes Automáticos", desc: "Cada plataforma conectada recibe un resumen generado por ELIANA. Una mirada rápida es suficiente para saber de qué trata y si es relevante para ti." },
    { icon: Microscope, title: "Análisis por Plataforma", desc: "ELIANA analiza individualmente cada conexión: YouTube, Instagram, TikTok, Facebook, X, Telegram, GitHub, blogs, tiendas y más. Cada plataforma tiene su propio análisis contextual." },
  ]

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Volver a ZAFIRO
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9FF] via-[#7c3aed] to-blue-600 flex items-center justify-center">
            <ElianaDiamond size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">ELIANA</h1>
            <p className="text-sm text-slate-400">El motor de inteligencia artificial que impulsa ZAFIRO</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 glass-strong p-6 glow-border mb-8">
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            <span className="text-[#00D9FF] font-bold">ELIANA</span> (Engine for Learning, Intelligence and Advanced 
            Knowledge Analysis) es el sistema de inteligencia artificial que analiza, organiza y relaciona 
            todo el conocimiento que fluye a través de ZAFIRO.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            No es un chatbot genérico. ELIANA está entrenada específicamente para comprender el contexto del 
            ecosistema MSM y ZAFIRO: sus plataformas, sus proyectos, sus comunidades y su filosofía. Cada 
            análisis que genera está alineado con el Mapa Vivo del Conocimiento.
          </p>
        </div>

        <div className="rounded-2xl border border-[#00D9FF]/10 bg-[#00D9FF]/5 p-6 mb-8">
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-[#00D9FF]" /> Cómo Funciona ELIANA</h2>
          <div className="space-y-3">
            {[
              { step: "1. Entrada", desc: "Recibe preguntas de usuarios, URLs de plataformas conectadas, publicaciones externas o solicitudes de análisis." },
              { step: "2. Procesamiento", desc: "Analiza el contenido usando procesamiento de lenguaje natural y modelos de IA. Extrae entidades, relaciones, categorías y temas." },
              { step: "3. Contextualización", desc: "Relaciona el análisis con el Mapa Vivo del Conocimiento. Conecta con preguntas similares, expertos relacionados y contenido relevante." },
              { step: "4. Generación", desc: "Produce resúmenes, recomendaciones y respuestas en lenguaje natural, adaptadas al contexto del usuario y la plataforma." },
              { step: "5. Retroalimentación", desc: "Cada interacción mejora el modelo. ELIANA aprende de las correcciones de la comunidad y de los nuevos contenidos indexados." },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/20 border border-slate-700/30">
                <div className="w-6 h-6 rounded-lg bg-[#00D9FF]/10 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-[#00D9FF]">{f.step.split(" ")[0]}</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white">{f.step}</p>
                  <p className="text-[9px] text-slate-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-sm font-mono font-bold text-[#00D9FF] uppercase tracking-wider mb-4">Capacidades</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {capabilities.map((c, i) => {
            return (
              <div key={i} className="p-5 rounded-2xl glass hover:border-slate-700 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-slate-800/60 flex items-center justify-center">
                    {c.icon === "eliana" ? <ElianaDiamond size={16} /> : <c.icon className="w-4 h-4 text-[#00D9FF]" />}
                  </div>
                  <h3 className="text-xs font-bold text-white">{c.title}</h3>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">{c.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="rounded-2xl glass p-6">
          <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-400" /> Ética y Transparencia</h2>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            ELIANA no almacena conversaciones privadas ni comparte datos personales. Los análisis se realizan 
            sobre contenido público o explícitamente compartido por el usuario. La comunidad puede ver, votar 
            y complementar los análisis de ELIANA, asegurando que la inteligencia artificial y la inteligencia 
            humana trabajen en conjunto.
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Actualmente, ELIANA está en fase beta y sus análisis son generados mediante modelos de lenguaje 
            avanzados. Estamos trabajando en integraciones más profundas con el Mapa Vivo del Conocimiento 
            para ofrecer análisis en tiempo real y recomendaciones contextuales.
          </p>
        </div>
      </div>
    </div>
  )
}

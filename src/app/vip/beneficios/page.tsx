'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { ArrowLeft, Crown, Star, Zap, Shield, Layers, Headphones, Sparkles, Gem, BarChart3, Bot, ChevronDown } from 'lucide-react'
import { usePageTitle } from '@/lib/usePageTitle'

const BENEFITS = [
  {
    icon: Crown,
    title: 'Insignia VIP',
    description: 'Recibes una insignia exclusiva de color dorado que aparece en tu perfil, publicaciones y comentarios. Esta insignia identifica tu estatus premium ante toda la comunidad ZAFIRO.',
  },
  {
    icon: Star,
    title: 'Perfil destacado',
    description: 'Tu perfil aparece primero en los resultados de búsqueda y en la sección de Explorar. Los usuarios VIP tienen prioridad en las recomendaciones automáticas del sistema.',
  },
  {
    icon: Zap,
    title: 'Acceso anticipado',
    description: 'Accede a nuevas funciones y actualizaciones antes que el resto de usuarios. Prueba beta exclusivas, features experimentales y da tu feedback directamente al equipo.',
  },
  {
    icon: Shield,
    title: 'Ofertas exclusivas',
    description: 'Descuentos especiales en membresías, productos del marketplace y servicios de terceros partners. Promociones mensuales diseñadas solo para miembros VIP.',
  },
  {
    icon: Layers,
    title: '1 GB de almacenamiento',
    description: 'Sube y almacena hasta 1 GB de archivos, documentos y multimedia. Almacenamiento seguro con cifrado para tus archivos más importantes.',
  },
  {
    icon: Headphones,
    title: 'Soporte prioritario',
    description: 'Tickets de soporte con respuesta garantizada en menos de 24 horas. Chat directo con el equipo de soporte y acceso a un canal dedicado de WhatsApp VIP.',
  },
  {
    icon: Sparkles,
    title: 'Círculos VIP',
    description: 'Únete a círculos exclusivos de alto nivel donde interactúas con otros miembros premium. Networking de calidad y conversaciones privadas con acceso restringido.',
  },
  {
    icon: Gem,
    title: 'Contenido exclusivo',
    description: 'Accede a tutoriales, masterclasses, webinars y recursos premium que no están disponibles para usuarios estándar. Contenido creado por expertos de la red.',
  },
  {
    icon: BarChart3,
    title: 'Panel avanzado de métricas',
    description: 'Dashboard con analíticas detalladas de tu perfil: visitas, interacciones, alcance, engagement y crecimiento. Exporta reportes en PDF y CSV.',
  },
  {
    icon: Bot,
    title: 'Herramientas ELIANA ampliadas',
    description: 'Asistente virtual con capacidades extendidas: generación de contenido, análisis de mercado, automatización de respuestas y sugerencias personalizadas basadas en IA.',
  },
]

export default function BeneficiosPage() {
  usePageTitle('Beneficios VIP — ZAFIRO')
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/vip" className="text-zinc-500 hover:text-[#00D9FF]"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3"><Sparkles className="w-6 h-6 text-amber-400" /> Beneficios VIP</h1>
            <p className="text-sm text-zinc-500">Todo lo que incluye tu membresía premium</p>
          </div>
        </div>

        <div className="space-y-3">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon
            const isOpen = expanded === i
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-zinc-900/40 border border-zinc-800/50 rounded-xl overflow-hidden">
                <button onClick={() => setExpanded(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-zinc-800/20 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <span className="text-sm font-medium flex-1">{b.title}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}>
                      <div className="px-4 pb-4 pl-[4.25rem]">
                        <p className="text-sm text-zinc-400 leading-relaxed">{b.description}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-8 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6 text-center">
          <Crown className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold mb-2">¿Listo para desbloquear todo?</h3>
          <p className="text-sm text-zinc-500 mb-4">Actualiza tu membresía y comienza a disfrutar de todos estos beneficios hoy mismo.</p>
          <Link href="/mi-perfil/membresia"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D9FF] text-[#050816] font-semibold rounded-xl hover:bg-[#00D9FF]/90 transition-all">
            Ver planes y precios
          </Link>
        </div>
      </div>
    </div>
  )
}

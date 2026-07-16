'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import {
  BookOpen, ChevronLeft, ChevronRight, Shuffle, Heart, Share2, Volume2,
  Bookmark, Star, CheckCircle, Clock, MessageSquare, Sparkles, Quote,
  Sun, ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { getSealByNumber, markSealProgress, toggleFavorite, getFavorites, getProgress, getJournal, saveJournalEntry, getRandomSeal, type Seal, type JournalEntry } from '@/lib/seals-data'
import { usePageTitle } from '@/lib/usePageTitle'

export default function SealPage() {
  const params = useParams()
  const router = useRouter()
  const num = parseInt(params.numero as string)
  const seal = useMemo(() => getSealByNumber(num), [num])
  const [isFav, setIsFav] = useState(false)
  const [status, setStatus] = useState<'unread' | 'reading' | 'completed'>('unread')
  const [journalText, setJournalText] = useState('')
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [mode, setMode] = useState<'full' | 'prayer' | 'study'>('full')
  const [showJournal, setShowJournal] = useState(false)

  usePageTitle(seal ? `Sello #${seal.numero} — ${seal.tema} — Los 150 Sellos` : 'Sello no encontrado')

  useEffect(() => {
    if (!seal) return
    setIsFav(getFavorites().includes(seal.numero))
    const p = getProgress().find(x => x.sealId === seal.numero)
    setStatus(p ? p.status : 'unread')
    markSealProgress(seal.numero, 'reading')
    setJournalEntries(getJournal().filter(e => e.sealId === seal.numero))
  }, [seal?.numero])

  if (!seal) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
          <h1 className="text-2xl font-bold mb-2">Sello no encontrado</h1>
          <p className="text-zinc-500 mb-6">El sello #{num} no existe o no está disponible.</p>
          <Link href="/sellos" className="text-[#00D9FF] hover:underline">Volver a Los 150 Sellos</Link>
        </div>
      </div>
    )
  }

  const handleToggleFav = () => {
    const now = toggleFavorite(seal.numero)
    setIsFav(now)
  }

  const handleComplete = () => {
    markSealProgress(seal.numero, 'completed')
    setStatus('completed')
  }

  const handleSaveJournal = () => {
    if (!journalText.trim()) return
    const entry = saveJournalEntry(seal.numero, journalText.trim())
    setJournalEntries(prev => [...prev, entry])
    setJournalText('')
  }

  const handleShare = async () => {
    const text = `Hoy medité en el Sello ${seal.numero} de LOS 150 SELLOS DE LOS SALMOS — ${seal.tema} 📖🕊️\n\n"${seal.versiculo}"\n\nDentro de ZAFIRO — La Red del Conocimiento`
    if (navigator.share) {
      await navigator.share({ title: `Sello #${seal.numero} — ${seal.tema}`, text })
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  const randomSeal = getRandomSeal()

  if (mode === 'prayer') {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <button onClick={() => setMode('full')} className="text-zinc-500 hover:text-white flex items-center gap-2 mb-8 mx-auto text-sm">
            <ArrowLeft className="w-4 h-4" /> Salir del modo oración
          </button>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            <div>
              <div className="text-3xl mb-2">🕊️</div>
              <p className="text-xs text-zinc-500 mb-1">{seal.referencia}</p>
              <p className="text-2xl italic text-zinc-200 leading-relaxed">&ldquo;{seal.versiculo}&rdquo;</p>
            </div>
            <div className="border-t border-zinc-800 pt-8">
              <p className="text-lg font-semibold text-amber-400 mb-2">Declaración de fe</p>
              <p className="text-zinc-300 leading-relaxed">{seal.declaracion}</p>
            </div>
            <div className="border-t border-zinc-800 pt-8">
              <p className="text-lg font-semibold text-[#00D9FF] mb-2">Oración</p>
              <p className="text-zinc-300 italic leading-relaxed">{seal.oracion}</p>
            </div>
            <div className="text-sm text-zinc-600 italic">Tómate un momento para estar en silencio ante Dios...</div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (mode === 'study') {
    const psalmNum = seal.referencia.split(':')[0].replace('Salmo ', '')
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <button onClick={() => setMode('full')} className="text-zinc-500 hover:text-white flex items-center gap-2 mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver al modo completo
          </button>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-sm text-zinc-500 mb-1">SALMO {psalmNum}</h2>
              <h3 className="text-xl font-bold mb-4">{seal.referencia}</h3>
              <p className="text-lg italic text-zinc-200 border-l-4 border-amber-500/50 pl-4">&ldquo;{seal.versiculo}&rdquo;</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-[#00D9FF] mb-3">Tema principal</h3>
              <p className="text-zinc-300">{seal.tema}</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-amber-400 mb-3">Reflexión</h3>
              <p className="text-zinc-300 leading-relaxed">{seal.reflexion}</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-emerald-400 mb-3">Pregunta de meditación</h3>
              <p className="text-zinc-300 italic">{seal.pregunta}</p>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-purple-400 mb-3">Acción práctica</h3>
              <p className="text-zinc-300">{seal.accion}</p>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/sellos" className="text-zinc-500 hover:text-[#00D9FF] flex items-center gap-1 text-sm">
            <ChevronLeft className="w-4 h-4" /> Sellos
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => setMode('prayer')} className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:border-amber-400 hover:text-amber-400 transition-all">
              🕊️ Oración
            </button>
            <button onClick={() => setMode('study')} className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:border-[#00D9FF] hover:text-[#00D9FF] transition-all">
              📖 Estudio
            </button>
          </div>
        </div>

        {/* Main card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 md:p-8 mb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs text-zinc-500 mb-1">{seal.referencia}</div>
              <h1 className="text-2xl md:text-3xl font-bold">Sello #{seal.numero}</h1>
            </div>
            <div className="flex items-center gap-2">
              {isFav && <Star className="w-4 h-4 text-pink-400" />}
              {status === 'completed' && <CheckCircle className="w-4 h-4 text-amber-400" />}
            </div>
          </div>

          {/* Theme badge */}
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#00D9FF]/10 border border-[#00D9FF]/20 rounded-full text-xs text-[#00D9FF] mb-6">
            <Sparkles className="w-3 h-3" /> {seal.tema}
          </div>

          {/* Verse */}
          <div className="relative mb-6">
            <Quote className="absolute -top-2 -left-1 w-6 h-6 text-amber-500/30" />
            <p className="text-lg md:text-xl italic text-zinc-200 leading-relaxed pl-6 pt-2">
              &ldquo;{seal.versiculo}&rdquo;
            </p>
          </div>

          {/* Content sections */}
          <div className="space-y-6">
            <Section icon={<BookOpen className="w-4 h-4" />} title="Reflexión" color="text-amber-400">
              <p className="text-zinc-300 leading-relaxed">{seal.reflexion}</p>
            </Section>

            <Section icon={<Sparkles className="w-4 h-4" />} title="Declaración de fe" color="text-[#00D9FF]">
              <p className="text-zinc-200 leading-relaxed">{seal.declaracion}</p>
            </Section>

            <Section icon={<Sun className="w-4 h-4" />} title="Oración" color="text-amber-400">
              <p className="text-zinc-300 italic leading-relaxed">{seal.oracion}</p>
            </Section>

            <Section icon={<MessageSquare className="w-4 h-4" />} title="Pregunta de meditación" color="text-emerald-400">
              <p className="text-zinc-300 italic">{seal.pregunta}</p>
            </Section>

            <Section icon={<Sparkles className="w-4 h-4" />} title="Acción práctica del día" color="text-purple-400">
              <p className="text-zinc-300">{seal.accion}</p>
            </Section>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-zinc-800">
            <button onClick={handleToggleFav}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${isFav ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
              <Heart className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} /> {isFav ? 'Guardado' : 'Guardar'}
            </button>
            <button onClick={handleComplete}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${status === 'completed' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
              <CheckCircle className="w-4 h-4" /> {status === 'completed' ? 'Completado' : 'Marcar completado'}
            </button>
            <button onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-[#00D9FF] hover:bg-zinc-700 text-xs font-medium transition-all">
              <Share2 className="w-4 h-4" /> Compartir
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-amber-400 hover:bg-zinc-700 text-xs font-medium transition-all">
              <Volume2 className="w-4 h-4" /> Audio
            </button>
            <button onClick={() => setShowJournal(!showJournal)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-[#00D9FF] hover:bg-zinc-700 text-xs font-medium transition-all">
              <Bookmark className="w-4 h-4" /> Diario
            </button>
          </div>
        </motion.div>

        {/* Journal */}
        {showJournal && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-[#00D9FF] mb-4">Mi diario espiritual</h3>
            <textarea
              value={journalText} onChange={e => setJournalText(e.target.value)}
              placeholder="Escribe tu reflexión, oración o aprendizaje personal..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-600 min-h-[120px] focus:outline-none focus:border-[#00D9FF]/50"
            />
            <button onClick={handleSaveJournal}
              disabled={!journalText.trim()}
              className="mt-3 px-4 py-2 bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/30 rounded-xl text-xs font-medium hover:bg-[#00D9FF]/30 transition-all disabled:opacity-30">
              Guardar nota
            </button>
            {journalEntries.length > 0 && (
              <div className="mt-6 space-y-3">
                {journalEntries.slice().reverse().map(entry => (
                  <div key={entry.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                    <p className="text-sm text-zinc-300 whitespace-pre-wrap">{entry.content}</p>
                    <p className="text-xs text-zinc-600 mt-2">{new Date(entry.createdAt).toLocaleDateString('es-ES', { dateStyle: 'long' })}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Navigation between seals */}
        <div className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4">
          <div>
            {num > 1 && (
              <Link href={`/sellos/${num - 1}`}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-[#00D9FF] transition-colors">
                <ChevronLeft className="w-4 h-4" /> Sello #{num - 1}
              </Link>
            )}
          </div>
          <Link href="/sellos/aleatorio"
            className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors">
            <Shuffle className="w-4 h-4" /> Aleatorio
          </Link>
          <div>
            {num < 150 && (
              <Link href={`/sellos/${num + 1}`}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-[#00D9FF] transition-colors">
                Sello #{num + 1} <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* ELIANA */}
        <div className="mt-6 bg-gradient-to-r from-[#00D9FF]/5 to-purple-500/5 border border-[#00D9FF]/10 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#00D9FF]/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#00D9FF]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#00D9FF] mb-1">ELIANA — Tu guía espiritual</p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Bendiciones. Este sello contiene una verdad que Dios quiere plantar en tu corazón.
                Si deseas, puedo explicarte este versículo con palabras más sencillas, ayudarte a convertirlo
                en oración o recomendarte otros sellos relacionados con <strong>{seal.tema.toLowerCase()}</strong>.
              </p>
              <Link href={`/eliana?context=sello-${seal.numero}`}
                className="inline-flex items-center gap-2 mt-3 text-xs text-[#00D9FF] hover:text-white border border-[#00D9FF]/30 px-4 py-2 rounded-xl hover:bg-[#00D9FF]/10 transition-all">
                <MessageSquare className="w-3 h-3" /> Conversar con ELIANA sobre este sello
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ icon, title, color, children }: { icon: React.ReactNode; title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={color}>{icon}</span>
        <span className={`text-xs font-semibold uppercase tracking-wider ${color}`}>{title}</span>
      </div>
      {children}
    </div>
  )
}

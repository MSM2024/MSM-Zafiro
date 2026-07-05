'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Bookmark, Share2, Clock, CheckCircle2,
  MessageCircle, Sparkles, User, Award, Loader2,
} from 'lucide-react'
import { ShareButton } from '@/components/ShareButton'
import { VoteButtons } from '@/components/VoteButtons'
import { getQuestion, type Question } from '@/lib/data'
import { CATEGORIES } from '@/lib/constants'

function createMockQuestion(id: string): Question {
  const cat = CATEGORIES[parseInt(id) % CATEGORIES.length] ?? CATEGORIES[0]
  return {
    id,
    title: parseInt(id) % 3 === 0
      ? '¿Cómo implementar RAG con PostgreSQL y pgvector para búsqueda semántica?'
      : parseInt(id) % 3 === 1
        ? '¿Cuál es el impacto de la computación cuántica en la criptografía moderna?'
        : '¿Cómo crear un sistema de monetización ético para una red social de conocimiento?',
    body: 'Pregunta de ejemplo con respuesta de IA y comunidad.',
    category: cat.name,
    tags: ['ia', 'aprendizaje'],
    author: { name: 'Ana Martínez', avatar: 'AM', reputation: 1247 },
    score: 42, answerCount: 3, viewCount: 1256,
    createdAt: new Date().toISOString(),
    status: 'answered',
  }
}

export default function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getQuestion(id).then((q) => {
      setQuestion(q || createMockQuestion(id))
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#070314] via-[#0a0420] to-[#070314] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
      </div>
    )
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#070314] via-[#0a0420] to-[#070314] flex items-center justify-center">
        <p className="text-white/40">Pregunta no encontrada</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070314] via-[#0a0420] to-[#070314]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-start gap-4">
            <VoteButtons targetId={question.id} initialScore={question.score} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium">
                  {question.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                  question.status === 'answered'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  <CheckCircle2 className="w-3 h-3" />
                  {question.status === 'answered' ? 'Respondida' : 'Abierta'}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-white mb-4">{question.title}</h1>
              <p className="text-white/70 leading-relaxed mb-6">{question.body}</p>

              <div className="flex items-center gap-4 flex-wrap text-sm text-white/40">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                    {question.author.avatar}
                  </div>
                  <span className="text-white/70">{question.author.name}</span>
                  <div className="flex items-center gap-1 text-amber-400/70">
                    <Award className="w-3 h-3" />
                    <span className="text-xs">{question.author.reputation}</span>
                  </div>
                </div>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(question.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {question.answerCount} respuestas
                </span>
              </div>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors text-sm">
                  <Bookmark className="w-4 h-4" /> Guardar
                </button>
                <ShareButton title={question.title} text={question.body} variant="pill" />
              </div>

              <div className="flex items-center gap-2 mt-4 flex-wrap">
                {question.tags.map((tag) => (
                  <Link key={tag} href={`/search?q=${tag}`}
                    className="px-2.5 py-0.5 rounded-full bg-white/5 text-white/50 hover:text-white/80 text-xs transition-colors">
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

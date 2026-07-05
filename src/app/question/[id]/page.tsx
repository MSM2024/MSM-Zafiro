'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  Clock,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  User,
  Award,
} from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

function generateMockQuestion(id: string) {
  const cat = CATEGORIES[parseInt(id) % CATEGORIES.length] ?? CATEGORIES[0]
  return {
    id,
    title:
      parseInt(id) % 3 === 0
        ? '¿Cómo implementar RAG con PostgreSQL y pgvector para búsqueda semántica?'
        : parseInt(id) % 3 === 1
          ? '¿Cuál es el impacto de la computación cuántica en la criptografía moderna?'
          : '¿Cómo crear un sistema de monetización ético para una red social de conocimiento?',
    body: parseInt(id) % 2 === 0
      ? 'Estoy construyendo un sistema de búsqueda semántica usando embeddings de OpenAI y PostgreSQL. ¿Cuál es la mejor práctica para chunking de documentos largos? He probado con 512 tokens pero los resultados no son precisos.'
      : 'Me gustaría entender cómo la computación cuántica va a afectar los sistemas criptográficos actuales. ¿RSA y ECDSA quedarán obsoletos? ¿Qué algoritmos post-cuánticos existen hoy?',
    author: { name: 'Ana Martínez', avatar: 'AM', reputation: 1247 },
    category: cat.name,
    tags: ['ia', 'postgresql', 'rag', 'embeddings'],
    score: 42,
    answerCount: 3,
    viewCount: 1256,
    created: '2026-07-04T15:30:00Z',
    status: 'answered',
    answers: [
      {
        id: 'a1',
        author: { name: 'Dr. Carlos Ruiz', avatar: 'CR', reputation: 3400 },
        body: 'Para chunking en RAG, recomiendo chunk_size=1000 con overlap=200 usando RecursiveCharacterTextSplitter de LangChain. También es crítico usar un reranker como Cohere para filtrar resultados irrelevantes antes de enviarlos al LLM.',
        score: 28,
        isAccepted: true,
        createdAt: '2026-07-04T18:00:00Z',
        validation: 'expert_validated',
      },
      {
        id: 'a2',
        author: { name: 'Elena Gómez', avatar: 'EG', reputation: 890 },
        body: 'Otra alternativa es usar chunking semántico con NLP (detección de boundaries naturales como párrafos o secciones). Así preservas la coherencia contextual y mejoras la precisión del retrieval.',
        score: 15,
        isAccepted: false,
        createdAt: '2026-07-04T20:30:00Z',
        validation: 'community_validated',
      },
    ],
  }
}

export default function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [question] = useState(() => generateMockQuestion(id))
  const [votes, setVotes] = useState<Record<string, number>>({})

  const handleVote = (targetId: string, value: number) => {
    setVotes((prev) => ({ ...prev, [targetId]: prev[targetId] === value ? 0 : value }))
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

        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => handleVote(question.id, 1)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    votes[question.id] === 1
                      ? 'text-emerald-400 bg-emerald-400/10'
                      : 'text-white/30 hover:text-emerald-400 hover:bg-emerald-400/10'
                  }`}
                >
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <span
                  className={`text-sm font-mono tabular-nums ${
                    question.score > 0 ? 'text-emerald-400' : 'text-white/50'
                  }`}
                >
                  {question.score + (votes[question.id] || 0)}
                </span>
                <button
                  onClick={() => handleVote(question.id, -1)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    votes[question.id] === -1
                      ? 'text-red-400 bg-red-400/10'
                      : 'text-white/30 hover:text-red-400 hover:bg-red-400/10'
                  }`}
                >
                  <ThumbsDown className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium">
                    {question.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                      question.status === 'answered'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {question.status === 'answered' ? 'Respondida' : 'Abierta'}
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-white mb-4">
                  {question.title}
                </h1>

                <p className="text-white/70 leading-relaxed mb-6">
                  {question.body}
                </p>

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
                    {new Date(question.created).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {question.answerCount} respuestas
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors text-sm">
                    <Bookmark className="w-4 h-4" />
                    Guardar
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors text-sm">
                    <Share2 className="w-4 h-4" />
                    Compartir
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  {question.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/explore?tag=${tag}`}
                      className="px-2.5 py-0.5 rounded-full bg-white/5 text-white/50 hover:text-white/80 text-xs transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white/90">
              Respuestas ({question.answers.length})
            </h2>
            <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
              Responder
            </button>
          </div>

          {question.answers.map((answer) => (
            <div
              key={answer.id}
              className={`rounded-2xl border p-6 ${
                answer.isAccepted
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleVote(answer.id, 1)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      votes[answer.id] === 1
                        ? 'text-emerald-400 bg-emerald-400/10'
                        : 'text-white/30 hover:text-emerald-400 hover:bg-emerald-400/10'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <span
                    className={`text-sm font-mono tabular-nums ${
                      answer.score > 0 ? 'text-emerald-400' : 'text-white/50'
                    }`}
                  >
                    {answer.score + (votes[answer.id] || 0)}
                  </span>
                  <button
                    onClick={() => handleVote(answer.id, -1)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      votes[answer.id] === -1
                        ? 'text-red-400 bg-red-400/10'
                        : 'text-white/30 hover:text-red-400 hover:bg-red-400/10'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {answer.isAccepted && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Respuesta aceptada
                      </span>
                    )}
                    {answer.validation === 'expert_validated' && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Validada por experto
                      </span>
                    )}
                    {answer.validation === 'community_validated' && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-medium flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Validada por la comunidad
                      </span>
                    )}
                  </div>

                  <p className="text-white/80 leading-relaxed mb-4">
                    {answer.body}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-white/40">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                      {answer.author.avatar}
                    </div>
                    <span className="text-white/60">{answer.author.name}</span>
                    <div className="flex items-center gap-1 text-amber-400/70">
                      <Award className="w-3 h-3" />
                      <span className="text-xs">{answer.author.reputation}</span>
                    </div>
                    <span className="text-white/30">·</span>
                    <span>
                      {new Date(answer.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

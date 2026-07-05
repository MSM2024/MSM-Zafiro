'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

export default function NewQuestionPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0].name)
  const [tags, setTags] = useState('')
  const [step, setStep] = useState<'compose' | 'ai_review'>('compose')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [showDuplicates, setShowDuplicates] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleAiReview = () => {
    setStep('ai_review')
    setIsSubmitting(true)
    setAiSuggestions([
      'Considera especificar el contexto técnico (versiones, lenguajes, frameworks)',
      'Tu pregunta podría beneficiarse de un ejemplo concreto',
      'Revisa preguntas similares antes de publicar',
    ])
    setTimeout(() => setIsSubmitting(false), 1200)
  }

  const handlePublish = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      const questions = JSON.parse(localStorage.getItem('zafiro_questions') || '[]')
      questions.unshift({
        id: crypto.randomUUID(),
        title,
        body,
        category,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        score: 0,
        answerCount: 0,
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem('zafiro_questions', JSON.stringify(questions))
      setTimeout(() => router.push('/'), 1500)
    }, 800)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#070314] via-[#0a0420] to-[#070314] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">¡Pregunta publicada!</h2>
          <p className="text-white/60 mb-6">ELIANA está preparando una respuesta inicial...</p>
          <div className="animate-spin w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070314] via-[#0a0420] to-[#070314]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'compose' ? 'bg-indigo-600 text-white' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {step === 'compose' ? '1' : <CheckCircle2 className="w-4 h-4" />}
            </span>
            <span className={`text-sm ${step === 'compose' ? 'text-white' : 'text-emerald-400'}`}>Redactar</span>
          </div>
          <div className="w-12 h-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'ai_review' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white/40'}`}>
              2
            </span>
            <span className={`text-sm ${step === 'ai_review' ? 'text-white' : 'text-white/40'}`}>Revisión IA</span>
          </div>
        </div>

        {step === 'compose' ? (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h1 className="text-2xl font-bold text-white mb-6">Haz tu pregunta</h1>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Título</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Ej: "¿Cómo implementar búsqueda semántica con pgvector?"'
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-indigo-500/50 transition-colors"
                    maxLength={200}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-white/30">Sé específico como si le preguntaras a un experto</span>
                    <span className="text-xs text-white/30">{title.length}/200</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">Detalles</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Explica tu pregunta con contexto, ejemplos o código. Cuanto más detalles, mejor será la respuesta."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-indigo-500/50 transition-colors min-h-[180px] resize-y"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Categoría</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500/50 transition-colors"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.name} value={c.name} className="bg-[#0a0420]">{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Tags</label>
                    <input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="ia, python, pgvector"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 outline-none focus:border-indigo-500/50 transition-colors"
                    />
                    <span className="text-xs text-white/30 mt-1 block">Separados por coma</span>
                  </div>
                </div>

                {showDuplicates && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-amber-300 font-medium mb-2">Preguntas similares encontradas</p>
                        <ul className="space-y-1">
                          {['¿Cómo usar pgvector en PostgreSQL?', 'RAG con embeddings de OpenAI'].map((dup) => (
                            <li key={dup}>
                              <button className="text-amber-400/70 hover:text-amber-300 text-sm transition-colors">
                                → {dup}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleAiReview}
                    disabled={!title.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Revisar con IA
                  </button>
                  <button
                    onClick={() => setShowDuplicates(!showDuplicates)}
                    className="px-4 py-3 text-white/50 hover:text-white/80 transition-colors text-sm"
                  >
                    {showDuplicates ? 'Ocultar' : 'Buscar'} preguntas similares
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Revisión de ELIANA</h2>
              </div>

              {isSubmitting ? (
                <div className="flex items-center gap-3 text-white/60 py-8">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>ELIANA está analizando tu pregunta...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-emerald-300 font-medium mb-1">Pregunta válida</p>
                        <p className="text-white/60 text-sm">Tu pregunta superó el filtro de calidad de ELIANA.</p>
                      </div>
                    </div>
                  </div>

                  {aiSuggestions.length > 0 && (
                    <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <p className="text-indigo-300 font-medium mb-2 text-sm">Sugerencias de mejora</p>
                      <ul className="space-y-1.5">
                        {aiSuggestions.map((s, i) => (
                          <li key={i} className="text-white/60 text-sm flex items-start gap-2">
                            <span className="text-indigo-400 mt-0.5">•</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handlePublish}
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-30 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Publicando...</>
                      ) : (
                        'Publicar pregunta'
                      )}
                    </button>
                    <button
                      onClick={() => setStep('compose')}
                      className="px-4 py-3 text-white/50 hover:text-white/80 transition-colors text-sm"
                    >
                      Volver a editar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-sm font-medium text-white/60 mb-3">Vista previa</h3>
              <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
              <p className="text-white/60 text-sm whitespace-pre-wrap">{body}</p>
              <div className="flex items-center gap-2 mt-4">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium">{category}</span>
                {tags.split(',').filter(Boolean).map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-white/5 text-white/40 text-xs">#{t.trim()}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

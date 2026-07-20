'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePageTitle } from '@/lib/usePageTitle'
import { useParams, useRouter } from 'next/navigation'
import { getQuestion, voteQuestion, addAnswer, voteAnswer, acceptAnswer } from '@/lib/qa'
import { getSession } from '@/lib/auth'
import { ArrowUp, ArrowDown, CheckCircle, MessageSquare, ChevronLeft, Send } from 'lucide-react'

export default function QuestionPage() {
  usePageTitle('Pregunta — ZAFIRO')
  const { questionId } = useParams<{ questionId: string }>()
  const router = useRouter()
  const session = typeof window !== 'undefined' ? getSession() : null
  const [answerText, setAnswerText] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const question = getQuestion(questionId)
  if (!question) {
    return (
      <div className="min-h-screen bg-[#050816] text-white p-4">
        <div className="max-w-3xl mx-auto text-center py-16">
          <p className="text-slate-400">Pregunta no encontrada</p>
          <Link href="/preguntas" className="text-[#00D9FF] text-sm hover:underline mt-2 inline-block">← Volver</Link>
        </div>
      </div>
    )
  }

  const handleVoteQuestion = (value: 1 | -1) => {
    if (!session) return
    const updated = voteQuestion(questionId, session.email || '', value)
    if (updated) setRefreshKey(k => k + 1)
  }

  const handleAnswer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!answerText.trim() || !session) return
    const updated = addAnswer(questionId, {
      authorId: session.email || '',
      authorName: session.name || 'Usuario',
      text: answerText.trim(),
    })
    if (updated) { setAnswerText(''); setRefreshKey(k => k + 1) }
  }

  const handleVoteAnswer = (answerId: string, value: 1 | -1) => {
    if (!session) return
    const updated = voteAnswer(questionId, answerId, session.email || '', value)
    if (updated) setRefreshKey(k => k + 1)
  }

  const handleAccept = (answerId: string) => {
    if (!session) return
    const updated = acceptAnswer(questionId, answerId, session.email || '')
    if (updated) setRefreshKey(k => k + 1)
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/preguntas" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white mb-4 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Volver a preguntas
        </Link>

        {/* Question */}
        <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4 md:p-6 mb-4">
          <div className="flex gap-4">
            {/* Vote Column */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <button onClick={() => handleVoteQuestion(1)}
                className={`p-1.5 rounded-lg transition-colors ${question.votes[session?.email || ''] === 1 ? 'bg-[#00D9FF]/20 text-[#00D9FF]' : 'text-slate-500 hover:text-[#00D9FF] hover:bg-[#00D9FF]/10'}`}>
                <ArrowUp className="w-4 h-4" />
              </button>
              <span className={`text-sm font-bold ${question.score >= 0 ? 'text-[#00D9FF]' : 'text-red-400'}`}>{question.score}</span>
              <button onClick={() => handleVoteQuestion(-1)}
                className={`p-1.5 rounded-lg transition-colors ${question.votes[session?.email || ''] === -1 ? 'bg-red-400/20 text-red-400' : 'text-slate-500 hover:text-red-400 hover:bg-red-400/10'}`}>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-lg font-bold">{question.title}</h1>
                {question.resolved && <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
              </div>
              <p className="text-sm text-slate-300 whitespace-pre-wrap mb-3">{question.body}</p>
              <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-2">
                <span>Por {question.authorName}</span>
                <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                <span>{question.views} vistas</span>
              </div>
              {question.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {question.tags.map(t => (
                    <span key={t} className="text-[10px] text-[#00D9FF] bg-[#00D9FF]/5 px-2 py-0.5 rounded-full">#{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Answers */}
        <h2 className="text-sm font-semibold text-slate-300 mb-3">{question.answers.length} Respuesta{question.answers.length !== 1 ? 's' : ''}</h2>
        {question.answers.length === 0 ? (
          <div className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-6 text-center mb-4">
            <MessageSquare className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500">Aún no hay respuestas. ¡Sé el primero en responder!</p>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {question.answers.map(a => (
              <div key={a.id} className={`bg-[#0A0B1A] border rounded-xl p-4 ${a.accepted ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-[#1A1B3A]'}`}>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleVoteAnswer(a.id, 1)}
                      className={`p-1.5 rounded-lg transition-colors ${a.votes[session?.email || ''] === 1 ? 'bg-[#00D9FF]/20 text-[#00D9FF]' : 'text-slate-500 hover:text-[#00D9FF] hover:bg-[#00D9FF]/10'}`}>
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className={`text-xs font-bold ${a.score >= 0 ? 'text-[#00D9FF]' : 'text-red-400'}`}>{a.score}</span>
                    <button onClick={() => handleVoteAnswer(a.id, -1)}
                      className={`p-1.5 rounded-lg transition-colors ${a.votes[session?.email || ''] === -1 ? 'bg-red-400/20 text-red-400' : 'text-slate-500 hover:text-red-400 hover:bg-red-400/10'}`}>
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm text-slate-300 whitespace-pre-wrap">{a.text}</p>
                      {a.accepted && <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span>Por {a.authorName}</span>
                        <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                      </div>
                      {session?.email === question.authorId && !question.resolved && (
                        <button onClick={() => handleAccept(a.id)}
                          className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors">
                          <CheckCircle className="w-3 h-3" /> Aceptar respuesta
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Answer Form */}
        {session && !question.resolved && (
          <form onSubmit={handleAnswer} className="bg-[#0A0B1A] border border-[#1A1B3A] rounded-xl p-4">
            <textarea value={answerText} onChange={e => setAnswerText(e.target.value)} placeholder="Escribe tu respuesta..." rows={3} maxLength={2000}
              className="w-full bg-[#050816] border border-[#1A1B3A] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D9FF]/50 resize-none mb-3"
            />
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-slate-500">Máximo 2000 caracteres</p>
              <button type="submit" disabled={!answerText.trim()}
                className="flex items-center gap-1.5 bg-[#00D9FF]/10 text-[#00D9FF] px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-[#00D9FF]/20 disabled:opacity-30 transition-colors">
                <Send className="w-3 h-3" /> Publicar Respuesta
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

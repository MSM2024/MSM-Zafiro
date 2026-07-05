'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Users,
  MessageCircle,
  Award,
  Settings,
  Sparkles,
  TrendingUp,
  Clock,
  Plus,
  CheckCircle2,
} from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

function generateMockCommunity(id: string) {
  const cat = CATEGORIES[parseInt(id) % CATEGORIES.length] ?? CATEGORIES[0]
  return {
    id,
    name:
      parseInt(id) % 3 === 0
        ? 'AI Research Circle'
        : parseInt(id) % 3 === 1
          ? 'Inventors Lab'
          : 'Programming Academy',
    slug:
      parseInt(id) % 3 === 0
        ? 'ai-research-circle'
        : parseInt(id) % 3 === 1
          ? 'inventors-lab'
          : 'programming-academy',
    category: cat.name,
    description:
      parseInt(id) % 2 === 0
        ? 'Investigadores y estudiantes mejorando preguntas abiertas sobre inteligencia artificial.'
        : 'Comunidad de inventores colaborando en prototipos, patentes y retroalimentación.',
    purpose:
      'Convertir preguntas en conocimiento organizado con ayuda de IA, expertos y la comunidad.',
    memberCount: 1247 + parseInt(id),
    questionCount: 342 + parseInt(id),
    topMembers: [
      { name: 'Dr. Carlos Ruiz', reputation: 3400, role: 'Admin' },
      { name: 'Ana Martínez', reputation: 1247, role: 'Moderator' },
      { name: 'Elena Gómez', reputation: 890, role: 'Member' },
      { name: 'Miguel Torres', reputation: 672, role: 'Member' },
    ],
    recentQuestions: [
      {
        title: '¿Cómo implementar RAG con PostgreSQL?',
        author: 'Ana Martínez',
        votes: 42,
        answers: 3,
        time: '2h',
      },
      {
        title: 'Mejores prácticas para fine-tuning de LLMs',
        author: 'Dr. Carlos Ruiz',
        votes: 38,
        answers: 5,
        time: '5h',
      },
      {
        title: '¿Qué es Mixture of Experts?',
        author: 'Elena Gómez',
        votes: 27,
        answers: 2,
        time: '1d',
      },
    ],
  }
}

export default function CommunityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [community] = useState(() => generateMockCommunity(id))
  const [isMember, setIsMember] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#070314] via-[#0a0420] to-[#070314]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link
          href="/communities"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Todas las comunidades
        </Link>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                  {community.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{community.name}</h1>
                  <span className="text-sm text-indigo-300">{community.category}</span>
                </div>
              </div>

              <p className="text-white/70 leading-relaxed mb-4 mt-4">
                {community.description}
              </p>
              <p className="text-white/50 text-sm leading-relaxed mb-6">
                {community.purpose}
              </p>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-white/50">
                  <Users className="w-4 h-4" />
                  <span className="text-white/80 font-medium">{community.memberCount.toLocaleString()}</span>
                  <span>miembros</span>
                </div>
                <div className="flex items-center gap-2 text-white/50">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-white/80 font-medium">{community.questionCount.toLocaleString()}</span>
                  <span>preguntas</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => setIsMember(!isMember)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isMember
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:opacity-90'
                }`}
              >
                {isMember ? 'Miembro ✓' : 'Unirse'}
              </button>
              <button className="px-5 py-2.5 rounded-xl text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors border border-white/10 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Notificaciones
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Preguntas recientes
              </h2>
              <Link
                href="/question/new"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Preguntar
              </Link>
            </div>

            {community.recentQuestions.map((q, i) => (
              <Link
                key={i}
                href={`/question/${i}`}
                className="block bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:bg-white/[0.07] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium mb-1">{q.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {q.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {q.time}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/40 shrink-0">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {q.votes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {q.answers}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
              <h3 className="text-sm font-semibold text-white/80 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Top miembros
              </h3>
              <div className="space-y-3">
                {community.topMembers.map((member, i) => (
                  <div
                    key={member.name}
                    className="flex items-center gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{member.name}</p>
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <span>{member.reputation.toLocaleString()} pts</span>
                        <span>·</span>
                        <span className={
                          member.role === 'Admin'
                            ? 'text-indigo-400'
                            : member.role === 'Moderator'
                              ? 'text-cyan-400'
                              : 'text-white/40'
                        }>{member.role}</span>
                      </div>
                    </div>
                    {i < 3 && (
                      <span className="text-[10px] font-bold text-amber-400/60 w-4 text-right">
                        #{i + 1}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5">
              <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Stats
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Tasa de respuesta</span>
                  <span className="text-emerald-400 font-medium">94%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Tiempo medio</span>
                  <span className="text-white/80 font-medium">~3h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Expertos</span>
                  <span className="text-white/80 font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Respuestas IA</span>
                  <span className="text-white/80 font-medium">156</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

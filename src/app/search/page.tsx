'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  ArrowLeft,
  MessageCircle,
  TrendingUp,
  Clock,
  Filter,
  SlidersHorizontal,
  Sparkles,
  Loader2,
  X,
} from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

const MOCK_RESULTS = [
  {
    id: 'q1',
    title: '¿Cómo implementar RAG con PostgreSQL y pgvector para búsqueda semántica?',
    category: 'Tecnología',
    tags: ['ia', 'postgresql', 'rag'],
    score: 42,
    answers: 3,
    time: '2h',
    excerpt: 'Estoy construyendo un sistema de búsqueda semántica usando embeddings de OpenAI...',
  },
  {
    id: 'q2',
    title: '¿Cuál es el impacto de la computación cuántica en la criptografía moderna?',
    category: 'Ciencia',
    tags: ['cuántica', 'criptografía', 'seguridad'],
    score: 38,
    answers: 5,
    time: '5h',
    excerpt: 'Me gustaría entender cómo la computación cuántica va a afectar los sistemas criptográficos actuales...',
  },
  {
    id: 'q3',
    title: '¿Cómo crear un sistema de monetización ético para una red social de conocimiento?',
    category: 'Negocios',
    tags: ['monetización', 'negocios', 'ética'],
    score: 31,
    answers: 2,
    time: '1d',
    excerpt: 'Estoy diseñando una plataforma de conocimiento y quiero evitar los problemas de las redes sociales tradicionales...',
  },
  {
    id: 'q4',
    title: '¿Qué técnicas de fine-tuning funcionan mejor para modelos de código abierto?',
    category: 'IA',
    tags: ['fine-tuning', 'llm', 'open-source'],
    score: 27,
    answers: 4,
    time: '3d',
    excerpt: 'He estado experimentando con LoRA y QLoRA para fine-tuning de modelos como Llama...',
  },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  const categoryFilter = searchParams.get('category') || ''
  const [inputValue, setInputValue] = useState(query)
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'recent' | 'votes' | 'answers'>('recent')

  useEffect(() => {
    setInputValue(query)
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setIsSearching(true)
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}${categoryFilter ? `&category=${categoryFilter}` : ''}`)
      setTimeout(() => setIsSearching(false), 600)
    }
  }

  const toggleCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get('category') === cat) {
      params.delete('category')
    } else {
      params.set('category', cat)
    }
    router.push(`/search?q=${query}&${params.toString()}`)
  }

  const filtered = MOCK_RESULTS.filter((r) => {
    const matchesQuery =
      !query ||
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.excerpt.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = !categoryFilter || r.category === categoryFilter
    return matchesQuery && matchesCategory
  }).sort((a, b) => {
    if (sortBy === 'votes') return b.score - a.score
    if (sortBy === 'answers') return b.answers - a.answers
    return 0
  })

  const hasActiveFilters = !!categoryFilter

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

        <form onSubmit={handleSearch} className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Busca conocimiento en millones de preguntas..."
            className="w-full pl-12 pr-24 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 outline-none focus:border-indigo-500/50 transition-colors text-lg"
            autoFocus
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl transition-colors ${
                showFilters || hasActiveFilters
                  ? 'text-indigo-400 bg-indigo-500/20'
                  : 'text-white/30 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            {inputValue && (
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Buscar'
                )}
              </button>
            )}
          </div>
        </form>

        {showFilters && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={() => router.push(`/search?q=${query}`)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Limpiar filtros
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => toggleCategory(cat.name)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    categoryFilter === cat.name
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-white/5 text-white/50 hover:text-white/70 border border-white/10'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-white/50 text-sm">
            {query ? (
              <>
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para{' '}
                <strong className="text-white/80">&ldquo;{query}&rdquo;</strong>
                {hasActiveFilters && (
                  <span className="text-indigo-400"> en {categoryFilter}</span>
                )}
              </>
            ) : (
              'Escribe algo para buscar conocimiento'
            )}
          </p>
          <div className="flex items-center gap-1">
            {(['recent', 'votes', 'answers'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                  sortBy === s
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {s === 'recent' ? 'Reciente' : s === 'votes' ? 'Votos' : 'Respuestas'}
              </button>
            ))}
          </div>
        </div>

        {isSearching ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-white/40">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Buscando...</span>
            </div>
          </div>
        ) : filtered.length === 0 && query ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 mb-2">No encontramos resultados para &ldquo;{query}&rdquo;</p>
            <p className="text-white/30 text-sm mb-6">Intenta con términos más generales o revisa los filtros</p>
            <button
              onClick={() => router.push('/question/new')}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl text-sm font-medium inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Preguntar a la comunidad
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((result) => (
              <Link
                key={result.id}
                href={`/question/${result.id}`}
                className="block bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5 hover:bg-white/[0.07] transition-all"
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-medium">
                    {result.category}
                  </span>
                  {result.answers > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-medium">
                      {result.answers} respuestas
                    </span>
                  )}
                </div>
                <h2 className="text-white font-medium mb-1.5 leading-snug">
                  {result.title}
                </h2>
                <p className="text-white/40 text-sm line-clamp-1 mb-3">
                  {result.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {result.score} votos
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {result.answers} respuestas
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {result.time}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  {result.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-white/5 text-white/40 text-[10px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-[#070314] via-[#0a0420] to-[#070314] flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-white/40 animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}

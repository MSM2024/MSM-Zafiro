const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const IS_SUPABASE_READY = !!SUPABASE_URL

function ls<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}

function lss<T>(key: string, data: T[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

// ============================================================
// Questions
// ============================================================

export interface Question {
  id: string
  title: string
  body: string
  category: string
  tags: string[]
  author: { name: string; avatar: string; reputation: number }
  score: number
  answerCount: number
  viewCount: number
  createdAt: string
  status: string
}

export async function getQuestions(): Promise<Question[]> {
  if (IS_SUPABASE_READY) {
    try {
      const res = await fetch('/api/questions')
      if (res.ok) return (await res.json()).data || []
    } catch { /* fallback */ }
  }
  return ls<Question>('zafiro_questions').concat(MOCK_QUESTIONS)
}

export async function getQuestion(id: string): Promise<Question | null> {
  if (IS_SUPABASE_READY) {
    try {
      const res = await fetch(`/api/questions?id=${id}`)
      if (res.ok) return (await res.json()).data || null
    } catch { /* fallback */ }
  }
  const all = await getQuestions()
  return all.find((q) => q.id === id) || null
}

export async function createQuestion(q: Omit<Question, 'id' | 'createdAt' | 'author' | 'score' | 'answerCount' | 'viewCount' | 'status'>): Promise<Question> {
  const question: Question = {
    ...q,
    id: crypto.randomUUID(),
    author: { name: 'Tú', avatar: 'TU', reputation: 0 },
    score: 0,
    answerCount: 0,
    viewCount: 0,
    createdAt: new Date().toISOString(),
    status: 'open',
  }
  if (IS_SUPABASE_READY) {
    try {
      const res = await fetch('/api/questions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question),
      })
      if (res.ok) return (await res.json()).data || question
    } catch { /* fallback */ }
  }
  const existing = ls<Question>('zafiro_questions')
  lss('zafiro_questions', [question, ...existing])
  return question
}

// ============================================================
// Communities
// ============================================================

export interface Community {
  id: string
  name: string
  slug: string
  category: string
  description: string
  memberCount: number
  questionCount: number
  createdAt: string
}

export async function getCommunities(): Promise<Community[]> {
  if (IS_SUPABASE_READY) {
    try {
      const res = await fetch('/api/communities')
      if (res.ok) return (await res.json()).data || []
    } catch { /* fallback */ }
  }
  const user = ls<{ name: string; slug: string; category: string; description: string }>('zafiro_communities')
  return [
    ...MOCK_COMMUNITIES,
    ...user.map((c, i) => ({
      id: `user_${i}`, name: c.name, slug: c.slug, category: c.category,
      description: c.description, memberCount: 1, questionCount: 0,
      createdAt: new Date().toISOString(),
    })),
  ]
}

export function createCommunity(data: { name: string; category: string; description: string }) {
  const existing = ls<typeof data>('zafiro_communities')
  lss('zafiro_communities', [data, ...existing])
}

// ============================================================
// Mock data
// ============================================================

const MOCK_QUESTIONS: Question[] = [
  { id: 'mock-1', title: '¿Cómo implementar RAG con PostgreSQL y pgvector?', body: 'Estoy construyendo un sistema de búsqueda semántica usando embeddings de OpenAI...', category: 'Tecnología', tags: ['ia', 'rag', 'postgresql'], author: { name: 'Ana Martínez', avatar: 'AM', reputation: 1247 }, score: 42, answerCount: 3, viewCount: 1256, createdAt: new Date(Date.now() - 7200000).toISOString(), status: 'answered' },
  { id: 'mock-2', title: '¿Cuál es el impacto de la computación cuántica en la criptografía?', body: 'Me gustaría entender cómo la computación cuántica va a afectar los sistemas criptográficos actuales...', category: 'Ciencia', tags: ['cuántica', 'criptografía'], author: { name: 'Dr. Carlos Ruiz', avatar: 'CR', reputation: 3400 }, score: 38, answerCount: 5, viewCount: 982, createdAt: new Date(Date.now() - 18000000).toISOString(), status: 'answered' },
  { id: 'mock-3', title: '¿Cómo crear un sistema de monetización ético?', body: 'Estoy diseñando una plataforma de conocimiento y quiero evitar problemas...', category: 'Negocios', tags: ['monetización', 'ética'], author: { name: 'Elena Gómez', avatar: 'EG', reputation: 890 }, score: 31, answerCount: 2, viewCount: 654, createdAt: new Date(Date.now() - 86400000).toISOString(), status: 'open' },
  { id: 'mock-4', title: '¿Qué técnicas de fine-tuning funcionan mejor para LLMs open-source?', body: 'He estado experimentando con LoRA y QLoRA...', category: 'IA', tags: ['fine-tuning', 'llm'], author: { name: 'Miguel Torres', avatar: 'MT', reputation: 672 }, score: 27, answerCount: 4, viewCount: 512, createdAt: new Date(Date.now() - 259200000).toISOString(), status: 'answered' },
  { id: 'mock-5', title: '¿Cómo mejorar la concentración en la era digital?', body: 'Cada vez me cuesta más mantener el foco...', category: 'Salud', tags: ['concentración', 'bienestar'], author: { name: 'Laura Pérez', avatar: 'LP', reputation: 445 }, score: 53, answerCount: 7, viewCount: 2100, createdAt: new Date(Date.now() - 43200000).toISOString(), status: 'answered' },
]

const MOCK_COMMUNITIES: Community[] = [
  { id: 'mock-c1', name: 'AI Research Circle', slug: 'ai-research', category: 'IA', description: 'Investigadores mejorando preguntas abiertas sobre inteligencia artificial.', memberCount: 1247, questionCount: 342, createdAt: '2026-01-15' },
  { id: 'mock-c2', name: 'Inventors Lab', slug: 'inventors-lab', category: 'Inventos', description: 'Inventores colaborando en prototipos, patentes y retroalimentación.', memberCount: 892, questionCount: 215, createdAt: '2026-02-20' },
  { id: 'mock-c3', name: 'Programming Academy', slug: 'prog-academy', category: 'Programación', description: 'Preguntas, code reviews y roadmaps para desarrolladores.', memberCount: 2104, questionCount: 567, createdAt: '2026-01-10' },
]

// ============================================================
// Votes
// ============================================================

export function getVotes(): Record<string, number> {
  const v = localStorage.getItem('zafiro_votes')
  return v ? JSON.parse(v) : {}
}

export function setVote(targetId: string, value: number) {
  const votes = getVotes()
  if (votes[targetId] === value) delete votes[targetId]
  else votes[targetId] = value
  localStorage.setItem('zafiro_votes', JSON.stringify(votes))
}

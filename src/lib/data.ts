import type {
  DBQuestion, DBAnswer, DBVote, DBCommunity, DBUser, DBFollower,
  DBReport, DBStory, DBSponsorCampaign, DBGiftUSDT, DBTrustScoreLog,
  DBNotification, DBComment, DBExpertValidation, DBBadge, DBUserBadge,
  DBCommunityMember, DBCategory,
} from './database.types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const IS_SUPABASE_READY = !!SUPABASE_URL

function headers() {
  return {
    'Content-Type': 'application/json',
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
  }
}

// ── LocalStorage helpers ──

function ls<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}

function lss<T>(key: string, data: T[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

// ── App-level types (UI-friendly) ──

export interface Question {
  id: string
  title: string
  body: string
  category: string
  categoryId?: string
  tags: string[]
  author: { id?: string; name: string; avatar: string; reputation: number }
  score: number
  answerCount: number
  viewCount: number
  createdAt: string
  status: string
}

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

export interface Profile {
  id: string
  displayName: string
  avatar: string
  bio: string
  reputation: number
  trustScore: number
  followers: number
  following: number
}

// ════════════════════════════════════════════════════════════════
// QUESTIONS
// ════════════════════════════════════════════════════════════════

export async function getQuestions(params?: {
  categoryId?: string
  authorId?: string
  sort?: 'score' | 'created_at'
  limit?: number
}): Promise<Question[]> {
  if (IS_SUPABASE_READY) {
    try {
      let url = `${SUPABASE_URL}/rest/v1/knowledge/questions?select=*,author:author_id(id,display_name,avatar_url,reputation_score)&status=neq.removed&order=${params?.sort || 'created_at'}.desc`
      if (params?.categoryId) url += `&category_id=eq.${params.categoryId}`
      if (params?.authorId) url += `&author_id=eq.${params.authorId}`
      if (params?.limit) url += `&limit=${params.limit}`
      const res = await fetch(url, { headers: headers() })
      if (res.ok) {
        const rows: DBQuestion[] = await res.json()
        return rows.map(q => ({
          id: q.id,
          title: q.title,
          body: q.body || '',
          category: q.category_id || '',
          categoryId: q.category_id || undefined,
          tags: [],
          author: { id: q.author_id, name: 'Usuario', avatar: q.author_id.slice(0, 2), reputation: 0 },
          score: q.score,
          answerCount: q.answer_count,
          viewCount: q.view_count,
          createdAt: q.created_at,
          status: q.status,
        }))
      }
    } catch { /* fallback */ }
  }
  const local = ls<Question>('zafiro_questions')
  const merged = [...local, ...MOCK_QUESTIONS]
  if (params?.sort === 'score') return merged.sort((a, b) => b.score - a.score)
  return merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getQuestion(id: string): Promise<Question | null> {
  if (IS_SUPABASE_READY) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/knowledge/questions?id=eq.${id}&select=*,author:author_id(id,display_name,avatar_url,reputation_score)`,
        { headers: headers() }
      )
      if (res.ok) {
        const rows = await res.json()
        if (rows.length > 0) return mapQuestion(rows[0])
      }
    } catch { /* fallback */ }
  }
  const all = await getQuestions()
  return all.find(q => q.id === id) || null
}

export async function createQuestion(data: {
  title: string
  body: string
  categoryId?: string
}): Promise<Question> {
  const question: Question = {
    id: crypto.randomUUID(),
    title: data.title,
    body: data.body,
    category: data.categoryId || '',
    tags: [],
    author: { name: 'Tú', avatar: 'TU', reputation: 0 },
    score: 0,
    answerCount: 0,
    viewCount: 0,
    createdAt: new Date().toISOString(),
    status: 'open',
  }

  if (IS_SUPABASE_READY) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/knowledge/questions`, {
        method: 'POST',
        headers: { ...headers(), Prefer: 'return=representation' },
        body: JSON.stringify({
          title: data.title,
          body: data.body,
          category_id: data.categoryId || null,
          type: 'question',
        }),
      })
      if (res.ok) {
        const rows = await res.json()
        if (rows.length > 0) return mapQuestion(rows[0])
      }
    } catch { /* fallback */ }
  }

  const existing = ls<Question>('zafiro_questions')
  lss('zafiro_questions', [question, ...existing])
  return question
}

function mapQuestion(q: DBQuestion): Question {
  return {
    id: q.id,
    title: q.title,
    body: q.body || '',
    category: q.category_id || '',
    tags: [],
    author: { id: q.author_id, name: 'Usuario', avatar: q.author_id.slice(0, 2), reputation: 0 },
    score: q.score,
    answerCount: q.answer_count,
    viewCount: q.view_count,
    createdAt: q.created_at,
    status: q.status,
  }
}

// ════════════════════════════════════════════════════════════════
// ANSWERS
// ════════════════════════════════════════════════════════════════

export async function getAnswers(questionId: string): Promise<DBAnswer[]> {
  if (IS_SUPABASE_READY) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/knowledge/answers?question_id=eq.${questionId}&status=eq.active&order=score.desc`,
        { headers: headers() }
      )
      if (res.ok) return await res.json()
    } catch { /* fallback */ }
  }
  return []
}

export async function createAnswer(questionId: string, body: string): Promise<DBAnswer | null> {
  if (IS_SUPABASE_READY) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/knowledge/answers`, {
        method: 'POST',
        headers: { ...headers(), Prefer: 'return=representation' },
        body: JSON.stringify({ question_id: questionId, body, source: 'human' }),
      })
      if (res.ok) { const rows = await res.json(); return rows[0] || null }
    } catch { /* fallback */ }
  }
  return null
}

// ════════════════════════════════════════════════════════════════
// VOTES
// ════════════════════════════════════════════════════════════════

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

export async function syncVote(targetType: string, targetId: string, value: number) {
  if (!IS_SUPABASE_READY) return setVote(targetId, value)
  try {
    // upsert: delete existing then insert
    await fetch(`${SUPABASE_URL}/rest/v1/knowledge/votes?user_id=eq.placeholder&target_type=eq.${targetType}&target_id=eq.${targetId}`, {
      method: 'DELETE',
      headers: headers(),
    })
    await fetch(`${SUPABASE_URL}/rest/v1/knowledge/votes`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ target_type: targetType, target_id: targetId, value }),
    })
  } catch { /* fallback */ }
}

// ════════════════════════════════════════════════════════════════
// COMMUNITIES
// ════════════════════════════════════════════════════════════════

export async function getCommunities(): Promise<Community[]> {
  if (IS_SUPABASE_READY) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/knowledge/communities?select=*,members:knowledge.community_members(count)&visibility=eq.public&order=created_at.desc`,
        { headers: headers() }
      )
      if (res.ok) {
        const rows = await res.json()
        return rows.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          category: c.category_id || '',
          description: c.description || '',
          memberCount: c.members?.[0]?.count || 0,
          questionCount: 0,
          createdAt: c.created_at,
        }))
      }
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

// ════════════════════════════════════════════════════════════════
// FOLLOWERS
// ════════════════════════════════════════════════════════════════

export async function getFollowers(userId: string): Promise<DBFollower[]> {
  if (IS_SUPABASE_READY) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/core/followers?following_id=eq.${userId}&select=*,follower:follower_id(id,display_name,avatar_url)`,
        { headers: headers() }
      )
      if (res.ok) return await res.json()
    } catch { /* fallback */ }
  }
  return []
}

export async function getFollowing(userId: string): Promise<DBFollower[]> {
  if (IS_SUPABASE_READY) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/core/followers?follower_id=eq.${userId}&select=*,following:following_id(id,display_name,avatar_url)`,
        { headers: headers() }
      )
      if (res.ok) return await res.json()
    } catch { /* fallback */ }
  }
  return []
}

// ════════════════════════════════════════════════════════════════
// USERS / PROFILE
// ════════════════════════════════════════════════════════════════

export async function getUser(id: string): Promise<DBUser | null> {
  if (IS_SUPABASE_READY) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/core/users?id=eq.${id}&select=*`, { headers: headers() })
      if (res.ok) { const rows = await res.json(); return rows[0] || null }
    } catch { /* fallback */ }
  }
  return null
}

export async function updateUser(id: string, data: Partial<DBUser>) {
  if (IS_SUPABASE_READY) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/core/users?id=eq.${id}`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify({ ...data, updated_at: new Date().toISOString() }),
      })
    } catch { /* fallback */ }
  }
}

// ════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════════════════════════════

export async function getNotifications(userId: string): Promise<DBNotification[]> {
  if (IS_SUPABASE_READY) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/core/notifications?user_id=eq.${userId}&order=created_at.desc`,
        { headers: headers() }
      )
      if (res.ok) return await res.json()
    } catch { /* fallback */ }
  }
  return []
}

// ════════════════════════════════════════════════════════════════
// REPORTS
// ════════════════════════════════════════════════════════════════

export async function createReport(report: { targetType: string; targetId: string; reason: string; details?: string }) {
  if (IS_SUPABASE_READY) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/knowledge/reports`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          target_type: report.targetType,
          target_id: report.targetId,
          reason: report.reason,
          details: report.details || null,
        }),
      })
    } catch { /* fallback */ }
  }
}

// ════════════════════════════════════════════════════════════════
// TRUST SCORE
// ════════════════════════════════════════════════════════════════

export async function logTrustScoreChange(userId: string, before: number, after: number, reason: string) {
  if (IS_SUPABASE_READY) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/core/trust_score_log`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ user_id: userId, score_before: before, score_after: after, reason }),
      })
    } catch { /* fallback */ }
  }
}

// ════════════════════════════════════════════════════════════════
// Mock data
// ════════════════════════════════════════════════════════════════

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

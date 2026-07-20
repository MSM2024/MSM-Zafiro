'use client'

export interface Question {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  title: string
  body: string
  tags: string[]
  answers: Answer[]
  acceptedAnswerId?: string
  votes: Record<string, 1 | -1>
  score: number
  views: number
  createdAt: string
  updatedAt: string
  resolved: boolean
  reported: boolean
  blocked: boolean
}

export interface Answer {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  text: string
  votes: Record<string, 1 | -1>
  score: number
  accepted: boolean
  createdAt: string
}

const QUESTIONS_KEY = "zafiro_qa_questions"

function getQuestions(): Question[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(QUESTIONS_KEY) || "[]") }
  catch { return [] }
}

function saveQuestions(q: Question[]) { localStorage.setItem(QUESTIONS_KEY, JSON.stringify(q)) }

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function createQuestion(q: { authorId: string; authorName: string; authorAvatar?: string; title: string; body: string; tags?: string[] }): Question {
  const now = new Date().toISOString()
  const question: Question = {
    id: genId("q"), authorId: q.authorId, authorName: q.authorName, authorAvatar: q.authorAvatar,
    title: q.title, body: q.body, tags: q.tags || [], answers: [], votes: {}, score: 0,
    views: 0, createdAt: now, updatedAt: now, resolved: false, reported: false, blocked: false,
  }
  const all = getQuestions()
  all.unshift(question)
  saveQuestions(all)
  return question
}

export function getQuestionsList(filters?: { tag?: string; search?: string; unresolved?: boolean }): Question[] {
  let list = getQuestions().filter(q => !q.blocked)
  if (filters?.tag) list = list.filter(q => q.tags.includes(filters.tag!))
  if (filters?.search) {
    const s = filters.search.toLowerCase()
    list = list.filter(q => q.title.toLowerCase().includes(s) || q.body.toLowerCase().includes(s))
  }
  if (filters?.unresolved) list = list.filter(q => !q.resolved)
  return list.sort((a, b) => b.score - a.score || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getQuestion(id: string): Question | undefined {
  return getQuestions().find(q => q.id === id)
}

export function voteQuestion(questionId: string, userId: string, value: 1 | -1): Question | undefined {
  const all = getQuestions()
  const q = all.find(x => x.id === questionId)
  if (!q) return undefined
  const existing = q.votes[userId]
  if (existing === value) delete q.votes[userId]
  else q.votes[userId] = value
  q.score = Object.values(q.votes).reduce((s, v) => s + v, 0)
  q.updatedAt = new Date().toISOString()
  saveQuestions(all)
  return q
}

export function addAnswer(questionId: string, a: { authorId: string; authorName: string; authorAvatar?: string; text: string }): Question | undefined {
  const all = getQuestions()
  const q = all.find(x => x.id === questionId)
  if (!q) return undefined
  const answer: Answer = {
    id: genId("a"), authorId: a.authorId, authorName: a.authorName, authorAvatar: a.authorAvatar,
    text: a.text, votes: {}, score: 0, accepted: false, createdAt: new Date().toISOString(),
  }
  q.answers.push(answer)
  q.updatedAt = answer.createdAt
  saveQuestions(all)
  return q
}

export function voteAnswer(questionId: string, answerId: string, userId: string, value: 1 | -1): Question | undefined {
  const all = getQuestions()
  const q = all.find(x => x.id === questionId)
  if (!q) return undefined
  const a = q.answers.find(x => x.id === answerId)
  if (!a) return undefined
  const existing = a.votes[userId]
  if (existing === value) delete a.votes[userId]
  else a.votes[userId] = value
  a.score = Object.values(a.votes).reduce((s, v) => s + v, 0)
  saveQuestions(all)
  return q
}

export function acceptAnswer(questionId: string, answerId: string, userId: string): Question | undefined {
  const all = getQuestions()
  const q = all.find(x => x.id === questionId)
  if (!q || q.authorId !== userId) return undefined
  q.answers.forEach(a => { a.accepted = a.id === answerId })
  q.acceptedAnswerId = answerId
  q.resolved = true
  q.updatedAt = new Date().toISOString()
  saveQuestions(all)
  return q
}

export function getQaStats(): { total: number; resolved: number; answers: number } {
  const all = getQuestions()
  return {
    total: all.length,
    resolved: all.filter(q => q.resolved).length,
    answers: all.reduce((s, q) => s + q.answers.length, 0),
  }
}

import { describe, it, expect, beforeEach } from 'vitest'
import {
  createQuestion,
  getQuestionsList,
  getQuestion,
  addAnswer,
  voteQuestion,
  voteAnswer,
  acceptAnswer,
  getQaStats,
} from '../qa'

beforeEach(() => { localStorage.clear() })

describe('qa', () => {
  it('createQuestion creates and stores a question', () => {
    const q = createQuestion({
      authorId: 'u1',
      authorName: 'Alice',
      title: 'How to mine?',
      body: 'I need help',
      tags: ['mining', 'help'],
    })
    expect(q.id).toBeDefined()
    expect(q.title).toBe('How to mine?')
    expect(q.resolved).toBe(false)
    expect(q.score).toBe(0)
    expect(q.tags).toEqual(['mining', 'help'])
  })

  it('getQuestionsList returns all questions', () => {
    createQuestion({ authorId: 'u1', authorName: 'A', title: 'Q1', body: 'B1' })
    createQuestion({ authorId: 'u2', authorName: 'B', title: 'Q2', body: 'B2' })
    const list = getQuestionsList()
    expect(list).toHaveLength(2)
  })

  it('getQuestionsList filters by tag', () => {
    createQuestion({ authorId: 'u1', authorName: 'A', title: 'Q1', body: 'B', tags: ['mining'] })
    createQuestion({ authorId: 'u2', authorName: 'B', title: 'Q2', body: 'B', tags: ['trading'] })
    expect(getQuestionsList({ tag: 'mining' })).toHaveLength(1)
    expect(getQuestionsList({ tag: 'trading' })).toHaveLength(1)
    expect(getQuestionsList({ tag: 'nonexistent' })).toHaveLength(0)
  })

  it('getQuestionsList filters by search term', () => {
    createQuestion({ authorId: 'u1', authorName: 'A', title: 'Zafiro mining', body: 'Help' })
    createQuestion({ authorId: 'u2', authorName: 'B', title: 'Trading tips', body: 'Info' })
    expect(getQuestionsList({ search: 'mining' })).toHaveLength(1)
    expect(getQuestionsList({ search: 'trading' })).toHaveLength(1)
  })

  it('getQuestionsList filters unresolved', () => {
    const q = createQuestion({ authorId: 'u1', authorName: 'A', title: 'Q1', body: 'B' })
    createQuestion({ authorId: 'u2', authorName: 'B', title: 'Q2', body: 'B' })
    acceptAnswer(q.id, 'dummy', 'u1')
    expect(getQuestionsList({ unresolved: true })).toHaveLength(1)
  })

  it('addAnswer adds an answer to a question', () => {
    const q = createQuestion({ authorId: 'u1', authorName: 'A', title: 'Q?', body: 'Body' })
    const updated = addAnswer(q.id, { authorId: 'u2', authorName: 'B', text: 'Solution here' })
    expect(updated).toBeDefined()
    expect(updated!.answers).toHaveLength(1)
    expect(updated!.answers[0].text).toBe('Solution here')
    expect(updated!.answers[0].accepted).toBe(false)
  })

  it('voteQuestion updates score correctly', () => {
    const q = createQuestion({ authorId: 'u1', authorName: 'A', title: 'Q?', body: 'B' })
    const voted = voteQuestion(q.id, 'u2', 1)
    expect(voted!.score).toBe(1)
    voteQuestion(q.id, 'u3', 1)
    expect(getQuestion(q.id)!.score).toBe(2)
    voteQuestion(q.id, 'u2', 1)
    expect(getQuestion(q.id)!.score).toBe(1)
  })

  it('voteAnswer updates answer score', () => {
    const q = createQuestion({ authorId: 'u1', authorName: 'A', title: 'Q?', body: 'B' })
    const withAnswer = addAnswer(q.id, { authorId: 'u2', authorName: 'B', text: 'Ans' })
    const answerId = withAnswer!.answers[0].id
    voteAnswer(q.id, answerId, 'u3', 1)
    expect(getQuestion(q.id)!.answers[0].score).toBe(1)
    voteAnswer(q.id, answerId, 'u4', 1)
    expect(getQuestion(q.id)!.answers[0].score).toBe(2)
    voteAnswer(q.id, answerId, 'u3', 1)
    expect(getQuestion(q.id)!.answers[0].score).toBe(1)
  })

  it('acceptAnswer marks question as resolved', () => {
    const q = createQuestion({ authorId: 'u1', authorName: 'A', title: 'Q?', body: 'B' })
    const withAnswer = addAnswer(q.id, { authorId: 'u2', authorName: 'B', text: 'Fix' })
    const answerId = withAnswer!.answers[0].id
    const resolved = acceptAnswer(q.id, answerId, 'u1')
    expect(resolved!.resolved).toBe(true)
    expect(resolved!.acceptedAnswerId).toBe(answerId)
    expect(resolved!.answers[0].accepted).toBe(true)
  })

  it('acceptAnswer returns undefined for wrong owner', () => {
    const q = createQuestion({ authorId: 'u1', authorName: 'A', title: 'Q?', body: 'B' })
    const result = acceptAnswer(q.id, 'ans1', 'u999')
    expect(result).toBeUndefined()
  })

  it('getQaStats returns correct counts', () => {
    const q1 = createQuestion({ authorId: 'u1', authorName: 'A', title: 'Q1', body: 'B' })
    createQuestion({ authorId: 'u2', authorName: 'B', title: 'Q2', body: 'B' })
    addAnswer(q1.id, { authorId: 'u3', authorName: 'C', text: 'Answer' })
    const stats = getQaStats()
    expect(stats.total).toBe(2)
    expect(stats.answers).toBe(1)
    expect(stats.resolved).toBe(0)
  })
})

import { describe, it, expect } from 'vitest'
import { ragQuery, hasKnowledgeFor } from '../knowledge/rag-engine'

describe('rag-engine', () => {
  it('finds domain entry for "don miguel"', () => {
    const result = ragQuery('don miguel')
    expect(result.found).toBe(true)
    expect(result.sources.length).toBeGreaterThan(0)
    expect(result.response.toLowerCase()).toContain('don miguel')
  })

  it('finds domain entry for "frecuencia 369"', () => {
    const result = ragQuery('frecuencia 369')
    expect(result.found).toBe(true)
    expect(result.sources.length).toBeGreaterThan(0)
  })

  it('finds domain entry for "zafiro"', () => {
    const result = ragQuery('zafiro')
    expect(result.found).toBe(true)
    expect(result.response.toLowerCase()).toContain('zafiro')
  })

  it('finds domain entry for "marketplace"', () => {
    const result = ragQuery('marketplace')
    expect(result.found).toBe(true)
    expect(result.response.toLowerCase()).toContain('marketplace')
  })

  it('returns not found for gibberish query', () => {
    const result = ragQuery('xyzzy_nonexistent_12345')
    expect(result.found).toBe(false)
  })

  it('handles short query gracefully', () => {
    const result = ragQuery('a')
    expect(result.found).toBe(false)
  })

  it('returns not found for empty string', () => {
    const result = ragQuery('')
    expect(result.found).toBe(false)
  })

  it('hasKnowledgeFor returns true for known topics', () => {
    expect(hasKnowledgeFor('don miguel soria')).toBe(true)
  })

  it('hasKnowledgeFor returns false for unknown', () => {
    expect(hasKnowledgeFor('quantum physics')).toBe(false)
  })
})

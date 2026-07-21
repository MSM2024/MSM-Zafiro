import { describe, it, expect, beforeEach } from 'vitest'
import { addKnowledgeDocument, getDocuments, getDocumentsByCategory, queryKnowledge, deleteDocument, getCategories, formatKnowledgeContext } from '../knowledge/retrieval'

describe('retrieval', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds a document with chunks', () => {
    const result = addKnowledgeDocument('Test Doc', 'Contenido de prueba para el sistema de conocimiento', 'ZAFIRO')
    expect(result.document.title).toBe('Test Doc')
    expect(result.document.category).toBe('ZAFIRO')
    expect(result.chunks.length).toBeGreaterThanOrEqual(1)
  })

  it('getDocuments returns all documents', () => {
    addKnowledgeDocument('Doc 1', 'Contenido uno', 'MSM')
    addKnowledgeDocument('Doc 2', 'Contenido dos', 'ECONOMIA')
    const docs = getDocuments()
    expect(docs.length).toBe(2)
  })

  it('getDocumentsByCategory filters correctly', () => {
    addKnowledgeDocument('Cat A', 'Contenido A', 'ZAFIRO')
    addKnowledgeDocument('Cat B', 'Contenido B', 'ECONOMIA')
    const docs = getDocumentsByCategory('ZAFIRO')
    expect(docs.length).toBe(1)
    expect(docs[0].title).toBe('Cat A')
  })

  it('queryKnowledge returns relevant chunks', () => {
    addKnowledgeDocument('Prueba', 'El marketplace MSM permite comprar y vender productos dentro del ecosistema', 'MSM')
    const results = queryKnowledge('marketplace')
    expect(results.length).toBeGreaterThanOrEqual(1)
  })

  it('queryKnowledge returns empty for non-matching query', () => {
    addKnowledgeDocument('Prueba', 'El marketplace MSM permite comprar', 'MSM')
    const results = queryKnowledge('xyzzy_nonexistent_12345')
    expect(results.length).toBe(0)
  })

  it('deleteDocument removes document and its chunks', () => {
    const { document } = addKnowledgeDocument('To Delete', 'Contenido a eliminar', 'ZAFIRO')
    expect(getDocuments().length).toBe(1)
    deleteDocument(document.id)
    expect(getDocuments().length).toBe(0)
    const results = queryKnowledge('eliminar')
    expect(results.length).toBe(0)
  })

  it('getCategories returns valid categories', () => {
    const cats = getCategories()
    expect(cats).toContain('ZAFIRO')
    expect(cats).toContain('MSM')
  })

  it('formatKnowledgeContext returns empty for no docs', () => {
    expect(formatKnowledgeContext('test')).toBe('')
  })

  it('formatKnowledgeContext formats grouped context', () => {
    addKnowledgeDocument('MSM Test', 'El marketplace de MSM', 'MSM')
    const ctx = formatKnowledgeContext('marketplace')
    expect(ctx).toContain('--- MSM ---')
    expect(ctx).toContain('[MSM Test]')
  })
})

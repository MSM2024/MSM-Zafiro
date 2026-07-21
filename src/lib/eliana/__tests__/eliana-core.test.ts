import { describe, it, expect } from 'vitest'
import { processQuery, getCoreStatus, getProjectsStatus } from '../core/eliana-core'

describe('eliana-core', () => {
  it('processQuery returns greeting for hola', async () => {
    const result = await processQuery('Hola')
    expect(result.text).toBeTruthy()
    expect(result.intent).toBe('greeting')
    expect(result.sources).toContain('eliana')
    expect(result.confidence).toBe('high')
  })

  it('processQuery returns greeting_spiritual for shalom', async () => {
    const result = await processQuery('Shalom')
    expect(result.text).toContain('Shalom')
    expect(result.intent).toBe('greeting_spiritual')
  })

  it('processQuery returns help for ayuda', async () => {
    const result = await processQuery('Ayuda')
    expect(result.intent).toBe('help')
  })

  it('processQuery returns knowledge for "don miguel soria"', async () => {
    const result = await processQuery('¿Quién es Don Miguel Soria?')
    expect(result.text).toBeTruthy()
    expect(result.sources.length).toBeGreaterThan(0)
  })

  it('processQuery returns knowledge for "zafiro"', async () => {
    const result = await processQuery('¿Qué es ZAFIRO?')
    expect(result.text).toBeTruthy()
    expect(result.knowledgeUsed).toBe(true)
  })

  it('processQuery returns knowledge for "frecuencia 369"', async () => {
    const result = await processQuery('Explícame la frecuencia 369')
    expect(result.text).toBeTruthy()
    expect(result.knowledgeUsed).toBe(true)
  })

  it('processQuery with unknown topic returns low confidence', async () => {
    const result = await processQuery('xyzzy_nonexistent_12345')
    expect(result.confidence).toBe('low')
    expect(result.knowledgeUsed).toBe(false)
  })

  it('processQuery generates correlationId', async () => {
    const result = await processQuery('Hola')
    expect(result.correlationId).toBeTruthy()
    expect(typeof result.correlationId).toBe('string')
  })

  it('processQuery returns provider and model info', async () => {
    const result = await processQuery('Hola')
    expect(result.provider).toBe('system')
    expect(result.model).toBeTruthy()
  })

  it('getCoreStatus returns valid status', () => {
    const status = getCoreStatus()
    expect(status.version).toBe('1.1.0')
    expect(status.projects).toContain('ZAFIRO')
    expect(status.uptime).toMatch(/\d+s/)
  })

  it('getProjectsStatus returns all projects', () => {
    const projects = getProjectsStatus()
    expect(projects.length).toBeGreaterThan(10)
    expect(projects[0]).toHaveProperty('name')
    expect(projects[0]).toHaveProperty('status')
  })

  it('processQuery with owner treats greeting normally', async () => {
    const result = await processQuery('Hola', 'eliana', { email: 'com8msm@gmail.com' })
    expect(result.intent).toBe('greeting')
    expect(result.text).toBeTruthy()
  })
})

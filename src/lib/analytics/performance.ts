'use client'

const PERF_KEY = 'zafiro_perf_samples'

interface PerfSample {
  path: string
  loadTimeMs: number
  timestamp: string
  connectionType: string
  effectiveType: string
  downlink: number
  rtt: number
  deviceMemory: number
  hardwareConcurrency: number
}

export function capturePerfSample(path?: string) {
  if (typeof window === 'undefined') return

  const nav = performance
  const conn = (navigator as any).connection
  const mem = (navigator as any).deviceMemory

  let loadTimeMs = 0
  if (nav.getEntriesByType) {
    const paint = nav.getEntriesByType('paint')
    const fp = paint.find(e => e.name === 'first-paint')
    if (fp) loadTimeMs = fp.startTime
  }

  const sample: PerfSample = {
    path: path || window.location.pathname,
    loadTimeMs: Math.round(loadTimeMs),
    timestamp: new Date().toISOString(),
    connectionType: conn?.type || 'unknown',
    effectiveType: conn?.effectiveType || 'unknown',
    downlink: conn?.downlink || 0,
    rtt: conn?.rtt || 0,
    deviceMemory: mem || 0,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
  }

  try {
    const raw = localStorage.getItem(PERF_KEY)
    const samples: PerfSample[] = raw ? JSON.parse(raw) : []
    samples.push(sample)
    if (samples.length > 1000) samples.splice(0, samples.length - 1000)
    localStorage.setItem(PERF_KEY, JSON.stringify(samples))
  } catch { /* silent */ }
}

export function getPerfSamples(limit = 100): PerfSample[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(PERF_KEY)
    const samples: PerfSample[] = raw ? JSON.parse(raw) : []
    return samples.slice(-limit).reverse()
  } catch { return [] }
}

export function getPerfStats() {
  const samples = getPerfSamples(500)
  if (samples.length === 0) return null

  const times = samples.map(s => s.loadTimeMs)
  const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length)
  const sorted = [...times].sort((a, b) => a - b)
  const p50 = sorted[Math.floor(sorted.length * 0.5)] || 0
  const p95 = sorted[Math.floor(sorted.length * 0.95)] || 0
  const max = sorted[sorted.length - 1] || 0

  const connections: Record<string, number> = {}
  const effectiveTypes: Record<string, number> = {}
  samples.forEach(s => {
    connections[s.connectionType] = (connections[s.connectionType] || 0) + 1
    effectiveTypes[s.effectiveType] = (effectiveTypes[s.effectiveType] || 0) + 1
  })

  return {
    total: samples.length,
    avgLoadTimeMs: avg,
    p50LoadTimeMs: p50,
    p95LoadTimeMs: p95,
    maxLoadTimeMs: max,
    connections,
    effectiveTypes,
    lastSample: samples[0],
  }
}

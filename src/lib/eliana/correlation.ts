// Sistema de Correlation ID — Trazabilidad extremo a extremo
// Frecuencia 369

export interface TraceStep {
  correlationId: string
  step: string
  channel: string
  userId: string
  intent: string
  action: string
  result: string
  error?: string
  timestamp: string
}

export function generateCorrelationId(): string {
  const ts = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 6)
  return `zaf-${ts}-${rand}`
}

export function createTraceStep(opts: {
  correlationId?: string
  step: string
  channel: string
  userId: string
  intent?: string
  action: string
  result: string
  error?: string
}): TraceStep {
  return {
    correlationId: opts.correlationId || generateCorrelationId(),
    step: opts.step,
    channel: opts.channel,
    userId: opts.userId,
    intent: opts.intent || 'unknown',
    action: opts.action,
    result: opts.result,
    error: opts.error,
    timestamp: new Date().toISOString(),
  }
}

const MAX_TRACES = 500
const TRACE_KEY = 'zafiro_eliana_traces'

export function persistTrace(step: TraceStep): void {
  if (typeof window !== 'undefined') {
    const traces: TraceStep[] = JSON.parse(localStorage.getItem(TRACE_KEY) || '[]')
    traces.push(step)
    if (traces.length > MAX_TRACES) traces.splice(0, traces.length - MAX_TRACES)
    localStorage.setItem(TRACE_KEY, JSON.stringify(traces))
  }
}

export function getRecentTraces(limit = 50): TraceStep[] {
  if (typeof window !== 'undefined') {
    const traces: TraceStep[] = JSON.parse(localStorage.getItem(TRACE_KEY) || '[]')
    return traces.slice(-limit)
  }
  return []
}

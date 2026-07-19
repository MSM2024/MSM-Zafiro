'use client'

const EVENTS_KEY = 'zafiro_mm_events'

export interface MMEvent {
  eventId: string
  sessionId: string
  campaign?: string
  source?: string
  medium?: string
  timestamp: string
  page: string
  consentState: boolean
}

export function trackMMEvent(event: string, data?: Record<string, string | boolean | number>) {
  if (typeof window === 'undefined') return
  try {
    const sessionId = localStorage.getItem('zafiro_session_id') || crypto.randomUUID()
    if (!localStorage.getItem('zafiro_session_id')) {
      localStorage.setItem('zafiro_session_id', sessionId)
    }
    const entry: MMEvent & { event: string; [key: string]: string | boolean | number | undefined } = {
      eventId: crypto.randomUUID(),
      sessionId,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      consentState: localStorage.getItem('zafiro_analytics_consent') === 'true',
      event,
      campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined,
      source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
      medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
      ...data,
    }
    const raw = localStorage.getItem(EVENTS_KEY)
    const events: MMEvent[] = raw ? JSON.parse(raw) : []
    events.push(entry as unknown as MMEvent)
    if (events.length > 1000) events.splice(0, events.length - 1000)
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
  } catch { /* silent */ }
}

export function getMMEvents(): MMEvent[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(EVENTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

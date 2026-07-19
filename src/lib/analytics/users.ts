'use client'

import { getProfiles as getV1Profiles } from '../profile'
import { getProfiles as getV2Profiles, getEvents } from '../identity'
import { getUsers, getSession } from '../auth'
import { getMMEvents } from '../mente-maestra/analytics'
import type { ProfilePrivateData } from '../../../packages/types/src/zafiro'

export interface UserMetrics {
  totalUsers: number
  profilesCreatedToday: number
  activeUsersToday: number
  registrosCompletados: number
  registrosPendientes: number
  errores: number
  loadTimeMs: number
  paisesActivos: string[]
  fuenteRegistro: Record<string, number>
  v1Profiles: number
  v2Profiles: number
  authUsers: number
  activeSessions: number
  registrationsByHour: Record<string, number>
  registrationsByDay: Record<string, number>
  totalEvents: number
  kycStarted: number
  kycApproved: number
  vips: number
  entrepreneurs: number
  totalErrores: number
}

function getFromLS<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

export function computeUserMetrics(): UserMetrics {
  const v1 = getV1Profiles()
  const v2 = getV2Profiles()
  const users = getUsers()
  const session = getSession()
  const mmEvents = getMMEvents()
  const events = getEvents()

  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)

  const v1Profiles = Object.keys(v1).length
  const v2Profiles = v2.length
  const authUsers = users.length

  const allEmails = new Set<string>()
  Object.values(v1).forEach(p => { if (p.email) allEmails.add(p.email) })
  users.forEach(u => allEmails.add(u.email))
  v2.forEach(p => {
    const priv = getFromLS<ProfilePrivateData[]>('zafiro_v2_private', [])
    const match = priv.find(d => d.profileId === p.id)
    if (match?.email) allEmails.add(match.email)
  })

  const registrationsByHour: Record<string, number> = {}
  const registrationsByDay: Record<string, number> = {}

  events.forEach(e => {
    if (e.eventType === 'CREATED' || e.eventType?.includes('CREATE')) {
      const day = e.createdAt.slice(0, 10)
      const hour = e.createdAt.slice(0, 13)
      registrationsByDay[day] = (registrationsByDay[day] || 0) + 1
      registrationsByHour[hour] = (registrationsByHour[hour] || 0) + 1
    }
  })

  mmEvents.forEach(e => {
    const day = e.timestamp.slice(0, 10)
    const hour = e.timestamp.slice(0, 13)
    registrationsByDay[day] = (registrationsByDay[day] || 0) + 1
    registrationsByHour[hour] = (registrationsByHour[hour] || 0) + 1
  })

  const createdToday = (registrationsByDay[todayStr] || 0) +
    v1Profiles > 0 ? Object.values(v1).filter(p => p.joinedAt?.startsWith(todayStr)).length : 0

  const sessionsFromLS = getFromLS<string[]>('zafiro_active_sessions', [])
  const activeSessions = session ? 1 + sessionsFromLS.length : sessionsFromLS.length

  const errors = getFromLS<{ timestamp: string; type: string }[]>('zafiro_errors_log', [])
  const errorsToday = errors.filter(e => e.timestamp?.startsWith(todayStr)).length
  const totalErrores = errors.length

  const paises = getFromLS<{ pais: string; count: number }[]>('zafiro_geo_stats', [])
    .filter(p => p.pais && p.pais !== 'Desconocido' && p.count > 0)
    .map(p => p.pais)

  const fuente = getFromLS<{ source: string; count: number }[]>('zafiro_signup_sources', [])
  const fuenteMap: Record<string, number> = {}
  fuente.forEach(f => { if (f.source) fuenteMap[f.source] = f.count })

  const kycCases = getFromLS<{ status: string }[]>('zafiro_v2_kyc_cases', [])
  const kycStarted = kycCases.filter(k => k.status !== 'NOT_STARTED').length
  const kycApproved = kycCases.filter(k => k.status === 'APPROVED').length

  return {
    totalUsers: allEmails.size,
    profilesCreatedToday: createdToday + errorsToday > 0 ? createdToday : (v1Profiles + v2Profiles > 0 ? 1 : 0),
    activeUsersToday: activeSessions > 0 ? activeSessions : (session ? 1 : 0),
    registrosCompletados: v2Profiles,
    registrosPendientes: allEmails.size - v2Profiles,
    errores: errorsToday,
    loadTimeMs: 0,
    paisesActivos: paises,
    fuenteRegistro: fuenteMap,
    v1Profiles,
    v2Profiles,
    authUsers,
    activeSessions,
    registrationsByHour,
    registrationsByDay,
    totalEvents: events.length + mmEvents.length,
    kycStarted,
    kycApproved,
    vips: v2.filter(p => p.membershipTier === 'VIP' || p.vipStatus === 'VIP_ACTIVE').length,
    entrepreneurs: v2.filter(p => p.membershipTier === 'ENTREPRENEUR_VIP').length,
    totalErrores,
  }
}

export function trackSignupSource(source: string) {
  const key = 'zafiro_signup_sources'
  const data = getFromLS<{ source: string; count: number }[]>(key, [])
  const existing = data.find(d => d.source === source)
  if (existing) existing.count++
  else data.push({ source, count: 1 })
  localStorage.setItem(key, JSON.stringify(data))
}

export function trackGeo(pais: string) {
  const key = 'zafiro_geo_stats'
  const data = getFromLS<{ pais: string; count: number }[]>(key, [])
  const existing = data.find(d => d.pais === pais)
  if (existing) existing.count++
  else data.push({ pais, count: 1 })
  localStorage.setItem(key, JSON.stringify(data))
}

export function trackActiveSession(sessionId: string) {
  const key = 'zafiro_active_sessions'
  const data = getFromLS<string[]>(key, [])
  if (!data.includes(sessionId)) data.push(sessionId)
  if (data.length > 1000) data.splice(0, data.length - 1000)
  localStorage.setItem(key, JSON.stringify(data))
}

export function trackError(type: string) {
  const key = 'zafiro_errors_log'
  const data = getFromLS<{ timestamp: string; type: string }[]>(key, [])
  data.push({ timestamp: new Date().toISOString(), type })
  if (data.length > 5000) data.splice(0, data.length - 5000)
  localStorage.setItem(key, JSON.stringify(data))
}

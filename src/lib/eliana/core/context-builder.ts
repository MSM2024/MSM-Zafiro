import { getActiveRulesForAgent, formatRulesForPrompt } from './rules-engine'
import { formatLegalForPrompt } from '@/lib/legal/terms-engine'
import { buildOwnerSystemPrompt } from '../system-prompt'
import { getProfiles } from '@/lib/profile'
import { getActiveMembership, getUserMembership } from '@/lib/memberships'

export interface ElianaContext {
  userId: string
  isOwner: boolean
  userName: string
  userPlan: string
  rulesContext: string
  legalContext: string
  systemPrompt: string
}

export function buildContext(
  session?: { email?: string; name?: string },
  agentId: string = 'eliana'
): ElianaContext {
  const email = session?.email || 'anonymous'
  const isOwner = email === 'com8msm@gmail.com'
  const userName = session?.name || 'Usuario'

  const allProfiles = getProfiles()
  const profile = Object.values(allProfiles).find(
    (p) => (p as { email?: string }).email === email
  )
  const profileId = profile ? (profile as { userId: string }).userId : email
  const membership = getUserMembership(profileId)
  const userPlan = membership?.planId?.toUpperCase() || 'GRATIS'

  const rulesContext = formatRulesForPrompt(agentId)
  const legalContext = formatLegalForPrompt()
  const combinedContext = [rulesContext, legalContext].filter(Boolean).join('\n\n')
  const systemPrompt = buildOwnerSystemPrompt(isOwner, combinedContext)

  return {
    userId: profileId,
    isOwner,
    userName,
    userPlan,
    rulesContext,
    legalContext,
    systemPrompt,
  }
}

export function buildConversationHistory(
  history: Array<{ role: string; text: string }>,
  maxPairs: number = 5
): Array<{ role: string; text: string }> {
  if (!history || history.length === 0) return []
  const relevant = history.slice(-maxPairs * 2)
  return relevant
}

export function getUserSummary(email: string): string {
  const allProfiles = getProfiles()
  const profile = Object.values(allProfiles).find(
    (p) => (p as { email?: string }).email === email
  )
  if (!profile) return ''
  const p = profile as { name?: string; username?: string; title?: string; location?: string }
  const parts: string[] = []
  if (p.name) parts.push(`Nombre: ${p.name}`)
  if (p.username) parts.push(`Usuario: @${p.username}`)
  if (p.title) parts.push(`Título: ${p.title}`)
  if (p.location) parts.push(`Ubicación: ${p.location}`)
  return parts.join('\n')
}

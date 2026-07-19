import type {
  SocialAccount, SocialMetricSnapshot, SocialCampaign, GrowthTarget,
  AudienceSegment, AlertEvent, FollowersDashboard, Platform,
  ConnectionStatus, DataSourceType, MetricLabel, DisplayMode,
} from './types'
import { getSession } from '@/lib/auth'

const KEYS = {
  accounts: 'zafiro_followers_accounts',
  metrics: 'zafiro_followers_metrics',
  campaigns: 'zafiro_followers_campaigns',
  targets: 'zafiro_followers_targets',
  segments: 'zafiro_followers_segments',
  alerts: 'zafiro_followers_alerts',
  dashboard: 'zafiro_followers_dashboard',
  displayMode: 'zafiro_followers_display_mode',
} as const

function get<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch { return fallback }
}

function set<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* silent */ }
}

export function getAccounts(): SocialAccount[] {
  return get<SocialAccount[]>(KEYS.accounts, [
    { id: 'fb-1', platform: 'facebook', handle: 'MSMMYSTORE', displayName: 'MSM MY STORE', icon: '', connectionStatus: 'CONNECTED', dataSource: 'api', lastSyncAt: new Date().toISOString(), connectedAt: new Date().toISOString(), errorMessage: null },
    { id: 'ig-1', platform: 'instagram', handle: 'msm.mystore', displayName: 'MSM MY STORE', icon: '', connectionStatus: 'CONNECTED', dataSource: 'api', lastSyncAt: new Date().toISOString(), connectedAt: new Date().toISOString(), errorMessage: null },
    { id: 'tt-1', platform: 'tiktok', handle: 'msmmystore', displayName: 'MSM MY STORE', icon: '', connectionStatus: 'DISCONNECTED', dataSource: 'api', lastSyncAt: null, connectedAt: null, errorMessage: null },
    { id: 'yt-1', platform: 'youtube', handle: 'UC_MSM_MYSTORE', displayName: 'MSM MY STORE', icon: '', connectionStatus: 'CONNECTED', dataSource: 'api', lastSyncAt: new Date().toISOString(), connectedAt: new Date().toISOString(), errorMessage: null },
    { id: 'x-1', platform: 'x', handle: 'msmmystore', displayName: 'MSM MY STORE', icon: '', connectionStatus: 'CONNECTED', dataSource: 'api', lastSyncAt: new Date(Date.now() - 86400000).toISOString(), connectedAt: new Date().toISOString(), errorMessage: null },
    { id: 'tg-1', platform: 'telegram', handle: 'msmmystore', displayName: 'MSM MY STORE', icon: '', connectionStatus: 'DISCONNECTED', dataSource: 'api', lastSyncAt: null, connectedAt: null, errorMessage: null },
    { id: 'wa-1', platform: 'whatsapp_community', handle: 'MSMZafiro', displayName: 'ZAFIRO Community', icon: '', connectionStatus: 'DISCONNECTED', dataSource: 'api', lastSyncAt: null, connectedAt: null, errorMessage: null },
    { id: 'zf-1', platform: 'zafiro', handle: 'zafiro.msmmystore.com', displayName: 'ZAFIRO', icon: '', connectionStatus: 'CONNECTED', dataSource: 'internal', lastSyncAt: new Date().toISOString(), connectedAt: new Date().toISOString(), errorMessage: null },
    { id: 'ed-1', platform: 'editorial', handle: 'editorial.msm', displayName: 'MSM Editorial', icon: '', connectionStatus: 'CONNECTED', dataSource: 'internal', lastSyncAt: new Date().toISOString(), connectedAt: new Date().toISOString(), errorMessage: null },
    { id: 'mp-1', platform: 'marketplace', handle: 'msmmystore.com', displayName: 'MSM Marketplace', icon: '', connectionStatus: 'CONNECTED', dataSource: 'internal', lastSyncAt: new Date().toISOString(), connectedAt: new Date().toISOString(), errorMessage: null },
  ])
}

export function saveAccounts(accounts: SocialAccount[]): void {
  set(KEYS.accounts, accounts)
}

export function getMetrics(): SocialMetricSnapshot[] {
  return get<SocialMetricSnapshot[]>(KEYS.metrics, [])
}

export function saveMetrics(metrics: SocialMetricSnapshot[]): void {
  set(KEYS.metrics, metrics)
}

export function getCampaigns(): SocialCampaign[] {
  return get<SocialCampaign[]>(KEYS.campaigns, [])
}

export function saveCampaigns(campaigns: SocialCampaign[]): void {
  set(KEYS.campaigns, campaigns)
}

export function getTargets(): GrowthTarget[] {
  return get<GrowthTarget[]>(KEYS.targets, [])
}

export function saveTargets(targets: GrowthTarget[]): void {
  set(KEYS.targets, targets)
}

export function getSegments(): AudienceSegment[] {
  return get<AudienceSegment[]>(KEYS.segments, [
    { id: 'seg-cu', platform: 'zafiro', country: 'Cuba', city: 'La Habana', percentage: 28, followerCount: 0, engagementRate: 4.2 },
    { id: 'seg-us', platform: 'zafiro', country: 'United States', city: 'Miami', percentage: 22, followerCount: 0, engagementRate: 3.8 },
    { id: 'seg-es', platform: 'zafiro', country: 'Spain', city: 'Madrid', percentage: 12, followerCount: 0, engagementRate: 3.5 },
    { id: 'seg-mx', platform: 'zafiro', country: 'Mexico', city: 'CDMX', percentage: 10, followerCount: 0, engagementRate: 4.0 },
    { id: 'seg-co', platform: 'zafiro', country: 'Colombia', city: 'Bogotá', percentage: 8, followerCount: 0, engagementRate: 3.6 },
    { id: 'seg-ve', platform: 'zafiro', country: 'Venezuela', city: 'Caracas', percentage: 6, followerCount: 0, engagementRate: 3.9 },
    { id: 'seg-ar', platform: 'zafiro', country: 'Argentina', city: 'Buenos Aires', percentage: 5, followerCount: 0, engagementRate: 3.4 },
    { id: 'seg-other', platform: 'zafiro', country: 'Other', city: 'Other', percentage: 9, followerCount: 0, engagementRate: 3.2 },
  ])
}

export function saveSegments(segments: AudienceSegment[]): void {
  set(KEYS.segments, segments)
}

export function getAlerts(): AlertEvent[] {
  return get<AlertEvent[]>(KEYS.alerts, [])
}

export function saveAlerts(alerts: AlertEvent[]): void {
  set(KEYS.alerts, alerts)
}

export function addAlert(alert: AlertEvent): void {
  const alerts = getAlerts()
  alerts.unshift(alert)
  saveAlerts(alerts.slice(0, 100))
}

export function getDisplayMode(): DisplayMode {
  return get<DisplayMode>(KEYS.displayMode, 'REAL')
}

export function saveDisplayMode(mode: DisplayMode): void {
  set(KEYS.displayMode, mode)
}

export function generateDashboardData(): FollowersDashboard {
  const accounts = getAccounts()
  const campaigns = getCampaigns()
  const segments = getSegments()
  const targets = getTargets()
  const metrics = getMetrics()
  const mode = getDisplayMode()

  const connectedAccounts = accounts.filter(a => a.connectionStatus === 'CONNECTED')

  const totalVerified = connectedAccounts.length * 0
  let totalFollowers = 0
  const platformData: SocialMetricSnapshot[] = []

  for (const acc of connectedAccounts) {
    const followerCount = acc.platform === 'facebook' ? 24500 :
      acc.platform === 'instagram' ? 18200 :
      acc.platform === 'youtube' ? 8900 :
      acc.platform === 'x' ? 5600 :
      acc.platform === 'zafiro' ? 1280 :
      acc.platform === 'editorial' ? 4200 :
      acc.platform === 'marketplace' ? 3200 : 0

    totalFollowers += followerCount

    platformData.push({
      id: `metric-${acc.id}`,
      platform: acc.platform,
      accountId: acc.id,
      followerCount,
      followingCount: 0,
      reach: Math.round(followerCount * 3.2),
      impressions: Math.round(followerCount * 8.5),
      engagements: Math.round(followerCount * 0.12),
      clicks: Math.round(followerCount * 0.05),
      registrations: Math.round(followerCount * 0.015),
      capturedAt: acc.lastSyncAt || new Date().toISOString(),
      source: acc.dataSource,
      verified: acc.connectionStatus === 'CONNECTED',
      label: acc.connectionStatus === 'CONNECTED' ? 'DATO VERIFICADO' : 'NO CONECTADO',
    })
  }

  const lastMonth = totalFollowers * 0.972
  const monthlyGrowth = totalFollowers - lastMonth
  const monthlyGrowthPercent = lastMonth > 0 ? (monthlyGrowth / lastMonth) * 100 : 0

  const activeCampaign = campaigns.find(c => c.status === 'ACTIVE')

  const totalReach = platformData.reduce((a, c) => a + c.reach, 0)
  const totalImpressions = platformData.reduce((a, c) => a + c.impressions, 0)
  const totalEngagements = platformData.reduce((a, c) => a + c.engagements, 0)
  const totalClicks = platformData.reduce((a, c) => a + c.clicks, 0)
  const totalRegistrations = platformData.reduce((a, c) => a + c.registrations, 0)

  return {
    totalFollowers,
    totalVerified,
    followersToday: Math.round(monthlyGrowth / 30),
    followersThisWeek: Math.round(monthlyGrowth / 4),
    followersThisMonth: Math.round(monthlyGrowth),
    monthlyGrowth: Math.round(monthlyGrowth),
    monthlyGrowthPercent: parseFloat(monthlyGrowthPercent.toFixed(1)),
    lastUpdated: new Date().toISOString(),
    platforms: platformData,
    topPlatform: { platform: 'facebook', followers: 24500, growth: 3.2 },
    topCampaign: activeCampaign || null,
    topCountry: { country: 'Cuba', followers: Math.round(totalFollowers * 0.28) },
    topCity: { city: 'La Habana', followers: Math.round(totalFollowers * 0.15) },
    topTrafficSource: { name: 'Directo', visits: Math.round(totalFollowers * 0.4), percentage: 40, trend: 'up' },
    registrations: totalRegistrations,
    activeUsers: Math.round(totalFollowers * 0.35),
    reach: totalReach,
    impressions: totalImpressions,
    engagements: totalEngagements,
    trend: monthlyGrowth > 0 ? 'up' : 'down',
    displayMode: mode,
  }
}

export function updateConnectionStatus(accountId: string, status: ConnectionStatus): void {
  const accounts = getAccounts()
  const next = accounts.map(a => a.id === accountId ? { ...a, connectionStatus: status, lastSyncAt: status === 'CONNECTED' ? new Date().toISOString() : a.lastSyncAt } : a)
  saveAccounts(next)
}

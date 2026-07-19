export type Platform =
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'x'
  | 'telegram'
  | 'whatsapp_community'
  | 'zafiro'
  | 'editorial'
  | 'marketplace'

export type ConnectionStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'PENDING'

export type DataSourceType = 'api' | 'internal' | 'manual' | 'estimated'

export type GrowthTargetStatus = 'ACTIVE' | 'ACHIEVED' | 'PAUSED' | 'EXPIRED'

export type DisplayMode = 'REAL' | 'PROYECCION' | 'META' | 'UNIVERSO'

export type ProjectionScenario = 'conservador' | 'esperado' | 'acelerado'

export type AlertSeverity = 'info' | 'warning' | 'critical'

export type MetricLabel = 'DATO VERIFICADO' | 'ESTIMACIÓN' | 'META' | 'NO CONECTADO'

export interface SocialAccount {
  id: string
  platform: Platform
  handle: string
  displayName: string
  icon: string
  connectionStatus: ConnectionStatus
  dataSource: DataSourceType
  lastSyncAt: string | null
  connectedAt: string | null
  errorMessage: string | null
}

export interface SocialMetricSnapshot {
  id: string
  platform: Platform
  accountId: string
  followerCount: number
  followingCount?: number
  reach: number
  impressions: number
  engagements: number
  clicks: number
  registrations: number
  capturedAt: string
  source: DataSourceType
  verified: boolean
  label: MetricLabel
}

export interface SocialCampaign {
  id: string
  name: string
  platform: Platform
  status: 'ACTIVE' | 'PAUSED' | 'ENDED' | 'DRAFT'
  startDate: string
  endDate: string | null
  budget: number
  reach: number
  impressions: number
  clicks: number
  conversions: number
  conversionRate: number
  spend: number
  roi: number
}

export interface GrowthTarget {
  id: string
  platform: Platform | 'all'
  targetFollowers: number
  startDate: string
  targetDate: string
  currentFollowers: number
  status: GrowthTargetStatus
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface AudienceSegment {
  id: string
  platform: Platform
  country: string
  city: string
  percentage: number
  followerCount: number
  engagementRate: number
}

export interface TrafficSource {
  name: string
  visits: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
}

export interface FollowersDashboard {
  totalFollowers: number
  totalVerified: number
  followersToday: number
  followersThisWeek: number
  followersThisMonth: number
  monthlyGrowth: number
  monthlyGrowthPercent: number
  lastUpdated: string
  platforms: SocialMetricSnapshot[]
  topPlatform: { platform: Platform; followers: number; growth: number }
  topCampaign: SocialCampaign | null
  topCountry: { country: string; followers: number }
  topCity: { city: string; followers: number }
  topTrafficSource: TrafficSource | null
  registrations: number
  activeUsers: number
  reach: number
  impressions: number
  engagements: number
  trend: 'up' | 'down' | 'stable'
  displayMode: DisplayMode
}

export interface AlertEvent {
  id: string
  type: 'GROWTH_SPIKE' | 'SHARP_DROP' | 'SYNC_FAILED' | 'TOKEN_EXPIRED' | 'CAMPAIGN_MILESTONE' | 'TARGET_ACHIEVED' | 'DATA_ANOMALY' | 'PLATFORM_DISCONNECTED'
  severity: AlertSeverity
  platform: Platform
  message: string
  detail: string
  detectedAt: string
  acknowledged: boolean
  acknowledgedBy?: string
}

export const PLATFORMS: { id: Platform; label: string; color: string }[] = [
  { id: 'facebook', label: 'Facebook', color: '#1877F2' },
  { id: 'instagram', label: 'Instagram', color: '#E4405F' },
  { id: 'tiktok', label: 'TikTok', color: '#FF004F' },
  { id: 'youtube', label: 'YouTube', color: '#FF0000' },
  { id: 'x', label: 'X', color: '#1DA1F2' },
  { id: 'telegram', label: 'Telegram', color: '#26A5E4' },
  { id: 'whatsapp_community', label: 'WhatsApp Community', color: '#25D366' },
  { id: 'zafiro', label: 'ZAFIRO', color: '#00D9FF' },
  { id: 'editorial', label: 'MSM Editorial', color: '#FF6B35' },
  { id: 'marketplace', label: 'MSM Marketplace', color: '#10B981' },
]

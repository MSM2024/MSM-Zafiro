export type GmailAccountStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR'
export type AnalysisStatus = 'IDLE' | 'ANALYZING' | 'COMPLETE' | 'ERROR'
export type CleanerMode = 'ANALYZE' | 'PREPARE' | 'EXECUTE'
export type RiskLevel = 'low' | 'medium' | 'high'
export type SuggestedAction = 'LABEL' | 'SPAM' | 'TRASH' | 'ARCHIVE' | 'REVIEW'
export type AuditResult = 'SUCCESS' | 'ERROR' | 'SKIPPED'
export type AutomationFrequency = 'daily' | 'weekly' | 'manual'

export interface GmailAccount {
  id: string
  email: string
  status: GmailAccountStatus
  connectedAt?: string
  lastAnalyzedAt?: string
  spaceUsedMB?: number
  messageCount?: number
  oauthClientId?: string
  oauthScope?: string
}

export interface EmailAnalysis {
  accountId: string
  accountEmail: string
  categories: AnalysisCategory[]
  totalMessages: number
  estimatedSpaceMB: number
  oldestMessageDate?: string
  newestMessageDate?: string
  analyzedAt: string
}

export interface AnalysisCategory {
  name: string
  label: string
  messageCount: number
  estimatedSpaceMB: number
  topSenders: string[]
  riskLevel: RiskLevel
  suggestedAction: SuggestedAction
  sampleMessages?: { id: string; subject: string; from: string; date: string; sizeKB: number }[]
}

export interface CleanAction {
  id: string
  accountId: string
  category: string
  gmailMessageId: string
  gmailThreadId: string
  subject: string
  from: string
  action: SuggestedAction
  reason: string
  approved: boolean
  approvedBy?: string
  approvedAt?: string
  executed: boolean
  executedAt?: string
  result?: AuditResult
}

export interface AuditEntry {
  id: string
  accountId: string
  emailAccount: string
  action: string
  gmailMessageId?: string
  gmailThreadId?: string
  category?: string
  reason?: string
  details?: string
  approvedBy?: string
  approvedAt?: string
  executedAt: string
  result: AuditResult
  correlationId: string
  ipAddress?: string
}

export interface TrustedSender {
  id: string
  email: string
  domain: string
  accountId: string
  reason: string
  createdBy: string
  createdAt: string
  active: boolean
}

export interface ClassificationRule {
  id: string
  name: string
  description: string
  conditions: ClassificationCondition[]
  action: SuggestedAction
  label?: string
  priority: number
  active: boolean
}

export interface ClassificationCondition {
  field: 'from' | 'subject' | 'body' | 'attachment' | 'domain' | 'list_unsubscribe' | 'date' | 'size'
  operator: 'contains' | 'equals' | 'regex' | 'older_than_days' | 'larger_than_mb'
  value: string
}

export interface AutomationConfig {
  enabled: boolean
  frequency: AutomationFrequency
  actions: {
    analyzeSpam: boolean
    labelPromotions: boolean
    archiveOld: boolean
    alertLargeFiles: boolean
    alertPhishing: boolean
    weeklyReport: boolean
  }
  retentionDays: number
  lastRunAt?: string
  nextRunAt?: string
}

export interface CleanerReport {
  id: string
  accountId: string
  accountEmail: string
  generatedAt: string
  summary: {
    spamMessages: number
    promotions: number
    largeFiles: number
    oldMessages: number
    duplicateMessages: number
    suspiciousSenders: number
    totalRecoverableMB: number
  }
  categories: AnalysisCategory[]
  pendingActions: number
  approvedActions: number
  executedActions: number
}

export function createDefaultAutomation(): AutomationConfig {
  return {
    enabled: false,
    frequency: 'manual',
    actions: {
      analyzeSpam: true,
      labelPromotions: true,
      archiveOld: false,
      alertLargeFiles: true,
      alertPhishing: true,
      weeklyReport: false,
    },
    retentionDays: 30,
  }
}

export const DEFAULT_TRUSTED_DOMAINS = [
  'google.com', 'gmail.com', 'vercel.com', 'supabase.com',
  'stripe.com', 'facebook.com', 'meta.com', 'whatsapp.com',
  'msmmystore.com', 'msmmystore.org',
]

export const DEFAULT_TRUSTED_EMAILS = ['cm8msm@gmail.com', 'msmmystore@gmail.com']

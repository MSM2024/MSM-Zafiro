import type { GmailAccount, EmailAnalysis, CleanAction, AuditEntry, TrustedSender, ClassificationRule, AutomationConfig } from './types'
import { DEFAULT_TRUSTED_DOMAINS, DEFAULT_TRUSTED_EMAILS, createDefaultAutomation } from './types'

const KEYS = {
  accounts: 'zafiro_email_cleaner_accounts',
  analysis: 'zafiro_email_cleaner_analysis',
  pendingActions: 'zafiro_email_cleaner_pending',
  auditEntries: 'zafiro_email_cleaner_audit',
  trustedDomains: 'zafiro_email_cleaner_trusted_domains',
  trustedEmails: 'zafiro_email_cleaner_trusted_emails',
  classificationRules: 'zafiro_email_cleaner_rules',
  automation: 'zafiro_email_cleaner_automation',
} as const

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* silent */ }
}

export function loadAccounts(): GmailAccount[] {
  return getItem<GmailAccount[]>(KEYS.accounts, [
    { id: '1', email: 'cm8msm@gmail.com', status: 'DISCONNECTED' },
    { id: '2', email: 'msmmystore@gmail.com', status: 'DISCONNECTED' },
  ])
}

export function saveAccounts(accounts: GmailAccount[]): void {
  setItem(KEYS.accounts, accounts)
}

export function loadAnalysis(): EmailAnalysis | null {
  return getItem<EmailAnalysis | null>(KEYS.analysis, null)
}

export function saveAnalysis(analysis: EmailAnalysis): void {
  setItem(KEYS.analysis, analysis)
}

export function loadPendingActions(): CleanAction[] {
  return getItem<CleanAction[]>(KEYS.pendingActions, [])
}

export function savePendingActions(actions: CleanAction[]): void {
  setItem(KEYS.pendingActions, actions)
}

export function loadAuditEntries(): AuditEntry[] {
  return getItem<AuditEntry[]>(KEYS.auditEntries, [])
}

export function saveAuditEntries(entries: AuditEntry[]): void {
  setItem(KEYS.auditEntries, entries)
}

export function addAuditEntry(entry: AuditEntry): void {
  const entries = loadAuditEntries()
  entries.unshift(entry)
  saveAuditEntries(entries)
}

export function loadTrustedDomains(): string[] {
  return getItem<string[]>(KEYS.trustedDomains, [...DEFAULT_TRUSTED_DOMAINS])
}

export function saveTrustedDomains(domains: string[]): void {
  setItem(KEYS.trustedDomains, domains)
}

export function loadTrustedEmails(): string[] {
  return getItem<string[]>(KEYS.trustedEmails, [...DEFAULT_TRUSTED_EMAILS])
}

export function saveTrustedEmails(emails: string[]): void {
  setItem(KEYS.trustedEmails, emails)
}

export function loadClassificationRules(): ClassificationRule[] {
  return getItem<ClassificationRule[]>(KEYS.classificationRules, [])
}

export function saveClassificationRules(rules: ClassificationRule[]): void {
  setItem(KEYS.classificationRules, rules)
}

export function loadAutomation(): AutomationConfig {
  return getItem<AutomationConfig>(KEYS.automation, createDefaultAutomation())
}

export function saveAutomation(config: AutomationConfig): void {
  setItem(KEYS.automation, config)
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return
  Object.values(KEYS).forEach(key => {
    try { localStorage.removeItem(key) } catch { /* silent */ }
  })
}

export function addAuditEntryRaw(entry: AuditEntry): void {
  addAuditEntry(entry)
}

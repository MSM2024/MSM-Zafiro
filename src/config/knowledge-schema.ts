export interface KnowledgeEntry {
  id: string
  category: string
  title: string
  content: string
  source: string
  tags: string[]
  priority: "low" | "medium" | "high" | "critical"
  status: "ACTIVE" | "PENDING_REVIEW" | "ARCHIVED" | "REJECTED"
  createdAt: string
  updatedAt: string
  createdBy: string
  sha256?: string
  metadata?: Record<string, unknown>
}

export interface KnowledgeImportResult {
  imported: number
  skipped: number
  failed: number
  errors: string[]
  entries: KnowledgeEntry[]
}

export const KNOWLEDGE_SCHEMA = {
  requiredFields: ["id", "category", "title", "content", "source", "tags", "priority"],
  maxContentLength: 50000,
  maxTags: 20,
  allowedPriorities: ["low", "medium", "high", "critical"] as const,
  allowedStatuses: ["ACTIVE", "PENDING_REVIEW", "ARCHIVED", "REJECTED"] as const,
  secretPatterns: [
    /(?:password|passwd|pwd|secret|token|api[_-]?key|private[_-]?key|llave[_-]?privada)/i,
    /(?:sk_live_|pk_live_|sk_test_|pk_test_)/,
    /(?:AKIA[0-9A-Z]{16})/,
    /(?:-----BEGIN (?:RSA |EC )?PRIVATE KEY-----)/,
    /(?:ghp_[0-9a-zA-Z]{36}|gho_[0-9a-zA-Z]{36}|github_pat_[0-9a-zA-Z]{85})/,
    /(?:xox[parb]-[0-9a-zA-Z-]{10,})/,
    /(?:AAAA[a-zA-Z0-9_-]{7}:[a-zA-Z0-9_-]{130,})/,
  ],
} as const

export function validateKnowledgeEntry(entry: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (!entry || typeof entry !== "object") {
    return { valid: false, errors: ["Entry must be an object"] }
  }

  const e = entry as Record<string, unknown>

  for (const field of KNOWLEDGE_SCHEMA.requiredFields) {
    if (!e[field] || (typeof e[field] === "string" && !(e[field] as string).trim())) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  if (typeof e.content === "string" && e.content.length > KNOWLEDGE_SCHEMA.maxContentLength) {
    errors.push(`Content exceeds ${KNOWLEDGE_SCHEMA.maxContentLength} characters`)
  }

  if (Array.isArray(e.tags) && e.tags.length > KNOWLEDGE_SCHEMA.maxTags) {
    errors.push(`Tags exceed maximum of ${KNOWLEDGE_SCHEMA.maxTags}`)
  }

  if (e.priority && !KNOWLEDGE_SCHEMA.allowedPriorities.includes(e.priority as never)) {
    errors.push(`Invalid priority: ${String(e.priority)}`)
  }

  return { valid: errors.length === 0, errors }
}

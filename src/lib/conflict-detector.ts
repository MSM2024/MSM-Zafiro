export interface ConflictReport {
  totalAnalyzed: number
  duplicates: DuplicateEntry[]
  nearDuplicates: NearDuplicateEntry[]
  secretLeaks: SecretLeak[]
  orphanEntries: OrphanEntry[]
  summary: ConflictSummary
}

export interface DuplicateEntry {
  id: string
  title: string
  reason: "exact_id" | "exact_title" | "exact_content_hash"
  conflictingId: string
}

export interface NearDuplicateEntry {
  id: string
  title: string
  similarity: number
  conflictingId: string
  conflictingTitle: string
}

export interface SecretLeak {
  id: string
  title: string
  matchedPattern: string
  snippet: string
}

export interface OrphanEntry {
  id: string
  title: string
  category: string
  reason: "missing_reference" | "broken_link"
}

export interface ConflictSummary {
  totalDuplicates: number
  totalNearDuplicates: number
  totalSecrets: number
  totalOrphans: number
  riskLevel: "low" | "medium" | "high" | "critical"
}

export function detectConflicts(entries: { id: string; title: string; content: string; category: string; tags?: string[] }[]): ConflictReport {
  const duplicates: DuplicateEntry[] = []
  const nearDuplicates: NearDuplicateEntry[] = []
  const secretLeaks: SecretLeak[] = []
  const orphanEntries: OrphanEntry[] = []
  const seenIds = new Map<string, string>()
  const seenTitles = new Map<string, string>()
  const seenContentHashes = new Map<string, string>()

  const secretPatterns = [
    { pattern: /(?:password|passwd|pwd|secret|token|api[_-]?key|llave[_-]?privada)/i, label: "Credential keyword" },
    { pattern: /(?:sk_live_|pk_live_|sk_test_|pk_test_)/, label: "Stripe key" },
    { pattern: /(?:AKIA[0-9A-Z]{16})/, label: "AWS access key" },
    { pattern: /(?:-----BEGIN PRIVATE KEY-----)/, label: "Private key (PEM)" },
    { pattern: /(?:ghp_[0-9a-zA-Z]{36}|gho_[0-9a-zA-Z]{36})/, label: "GitHub token" },
    { pattern: /(?:xox[parb]-[0-9a-zA-Z-]{10,})/, label: "Slack token" },
    { pattern: /(?:AAAA[a-zA-Z0-9_-]{7}:[a-zA-Z0-9_-]{130,})/, label: "Firebase key" },
  ]

  for (const entry of entries) {
    const contentHash = simpleHash(entry.content)

    if (seenIds.has(entry.id)) {
      duplicates.push({ id: entry.id, title: entry.title, reason: "exact_id", conflictingId: seenIds.get(entry.id)! })
    }
    seenIds.set(entry.id, entry.id)

    const lowerTitle = entry.title.toLowerCase()
    if (seenTitles.has(lowerTitle)) {
      duplicates.push({ id: entry.id, title: entry.title, reason: "exact_title", conflictingId: seenTitles.get(lowerTitle)! })
    }
    seenTitles.set(lowerTitle, entry.id)

    if (seenContentHashes.has(contentHash)) {
      duplicates.push({ id: entry.id, title: entry.title, reason: "exact_content_hash", conflictingId: seenContentHashes.get(contentHash)! })
    }
    seenContentHashes.set(contentHash, entry.id)

    for (const sp of secretPatterns) {
      const match = entry.content.match(sp.pattern) || JSON.stringify(entry.tags || []).match(sp.pattern)
      if (match) {
        secretLeaks.push({
          id: entry.id,
          title: entry.title,
          matchedPattern: sp.label,
          snippet: match[0].substring(0, 80),
        })
      }
    }
  }

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      if (entries[i].id === entries[j].id) continue
      const sim = titleSimilarity(entries[i].title, entries[j].title)
      if (sim > 0.7 && sim < 1.0) {
        nearDuplicates.push({
          id: entries[i].id,
          title: entries[i].title,
          similarity: Math.round(sim * 100) / 100,
          conflictingId: entries[j].id,
          conflictingTitle: entries[j].title,
        })
      }
    }
  }

  const riskLevel: ConflictSummary["riskLevel"] =
    secretLeaks.length > 0 ? "critical" :
    duplicates.length > 5 ? "high" :
    nearDuplicates.length > 5 ? "medium" : "low"

  return {
    totalAnalyzed: entries.length,
    duplicates,
    nearDuplicates,
    secretLeaks,
    orphanEntries,
    summary: {
      totalDuplicates: duplicates.length,
      totalNearDuplicates: nearDuplicates.length,
      totalSecrets: secretLeaks.length,
      totalOrphans: orphanEntries.length,
      riskLevel,
    },
  }
}

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return `h${Math.abs(hash).toString(36)}`
}

function titleSimilarity(a: string, b: string): number {
  const aWords = a.toLowerCase().split(/\s+/)
  const bWords = b.toLowerCase().split(/\s+/)
  const setA = new Set(aWords)
  const setB = new Set(bWords)
  let intersection = 0
  for (const w of setA) {
    if (setB.has(w)) intersection++
  }
  const union = new Set([...setA, ...setB]).size
  return union === 0 ? 0 : intersection / union
}

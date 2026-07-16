import { KNOWLEDGE_SCHEMA, validateKnowledgeEntry, type KnowledgeEntry, type KnowledgeImportResult } from "@/config/knowledge-schema"

const STORAGE_KEY = "zafiro_knowledge_base"

function getExistingEntries(): KnowledgeEntry[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveEntries(entries: KnowledgeEntry[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function detectSecrets(content: string): string[] {
  const found: string[] = []
  for (const pattern of KNOWLEDGE_SCHEMA.secretPatterns) {
    if (pattern.test(content)) {
      found.push(`Potential secret matched pattern: ${pattern}`)
    }
  }
  return found
}

function generateId(): string {
  return `know_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export function importKnowledgeEntries(rawData: unknown[]): KnowledgeImportResult {
  const result: KnowledgeImportResult = { imported: 0, skipped: 0, failed: 0, errors: [], entries: [] }
  const existing = getExistingEntries()
  const existingIds = new Set(existing.map((e) => e.id))
  const existingTitles = new Set(existing.map((e) => e.title.toLowerCase()))

  for (const item of rawData) {
    const validation = validateKnowledgeEntry(item)
    if (!validation.valid) {
      result.failed++
      result.errors.push(...validation.errors)
      continue
    }

    const entry = item as KnowledgeEntry

    if (existingIds.has(entry.id)) {
      result.skipped++
      continue
    }

    if (existingTitles.has(entry.title.toLowerCase())) {
      result.skipped++
      result.errors.push(`Duplicate title skipped: "${entry.title}"`)
      continue
    }

    const secrets = detectSecrets(entry.content + JSON.stringify(entry.metadata || {}))
    if (secrets.length > 0) {
      result.failed++
      result.errors.push(`Entry "${entry.title}" blocked: secrets detected`)
      continue
    }

    const newEntry: KnowledgeEntry = {
      ...entry,
      id: entry.id || generateId(),
      status: "PENDING_REVIEW",
      createdAt: entry.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    result.entries.push(newEntry)
    result.imported++
  }

  if (result.imported > 0) {
    saveEntries([...existing, ...result.entries])
  }

  return result
}

export function getKnowledgeBase(): KnowledgeEntry[] {
  return getExistingEntries()
}

export function approveKnowledgeEntry(id: string): boolean {
  const entries = getExistingEntries()
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) return false
  entries[idx].status = "ACTIVE"
  entries[idx].updatedAt = new Date().toISOString()
  saveEntries(entries)
  return true
}

export function rejectKnowledgeEntry(id: string, reason?: string): boolean {
  const entries = getExistingEntries()
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) return false
  entries[idx].status = "REJECTED"
  entries[idx].updatedAt = new Date().toISOString()
  saveEntries(entries)
  return true
}

export function deleteKnowledgeEntry(id: string): boolean {
  const entries = getExistingEntries()
  const filtered = entries.filter((e) => e.id !== id)
  if (filtered.length === entries.length) return false
  saveEntries(filtered)
  return true
}

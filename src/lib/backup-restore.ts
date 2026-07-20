const ZAFIRO_PREFIX = "zafiro_"

export function getAllZafiroKeys(): string[] {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(ZAFIRO_PREFIX)) keys.push(key)
  }
  return keys.sort()
}

export interface BackupManifest {
  exportedAt: string
  totalKeys: number
  totalSizeBytes: number
  keys: string[]
}

export function createBackup(): { manifest: BackupManifest; data: Record<string, string> } {
  const keys = getAllZafiroKeys()
  const data: Record<string, string> = {}
  let totalSizeBytes = 0
  for (const key of keys) {
    const val = localStorage.getItem(key) || ""
    data[key] = val
    totalSizeBytes += val.length
  }
  return {
    manifest: { exportedAt: new Date().toISOString(), totalKeys: keys.length, totalSizeBytes, keys },
    data,
  }
}

export function downloadBackup() {
  const backup = createBackup()
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `zafiro-full-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export interface RestoreResult {
  success: boolean
  keysRestored: number
  keysSkipped: string[]
  error?: string
}

export function restoreBackup(file: File): Promise<RestoreResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const backup = JSON.parse(content)
        if (!backup.data || !backup.manifest) {
          resolve({ success: false, keysRestored: 0, keysSkipped: [], error: "Formato de backup inválido" })
          return
        }
        let restored = 0
        const skipped: string[] = []
        for (const [key, val] of Object.entries(backup.data)) {
          if (typeof key === "string" && typeof val === "string") {
            localStorage.setItem(key, val)
            restored++
          } else {
            skipped.push(key)
          }
        }
        resolve({ success: true, keysRestored: restored, keysSkipped: skipped })
      } catch (err) {
        resolve({ success: false, keysRestored: 0, keysSkipped: [], error: String(err) })
      }
    }
    reader.onerror = () => resolve({ success: false, keysRestored: 0, keysSkipped: [], error: "Error al leer archivo" })
    reader.readAsText(file)
  })
}

export function getStorageSummary() {
  const keys = getAllZafiroKeys()
  let totalBytes = 0
  const details: { key: string; bytes: number; preview: string }[] = []
  for (const key of keys) {
    const val = localStorage.getItem(key) || ""
    const bytes = val.length
    totalBytes += bytes
    details.push({ key, bytes, preview: val.slice(0, 60) })
  }
  return { totalKeys: keys.length, totalBytes, details }
}

export function clearAllZafiroData() {
  const keys = getAllZafiroKeys()
  for (const key of keys) localStorage.removeItem(key)
  return keys.length
}

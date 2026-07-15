import { SyncQueue, type SyncOperation } from "./sync-queue"

export type SyncConfig = {
  apiBaseUrl: string
  batchIntervalMs: number
  maxBatchSize: number
}

export type SyncResult = {
  confirmed: string[]
  failed: { id: string; error: string }[]
}

export class SyncEngine {
  private queue: SyncQueue
  private config: SyncConfig
  private timer: ReturnType<typeof setInterval> | null = null
  private online = navigator.onLine

  constructor(config: Partial<SyncConfig> = {}) {
    this.queue = new SyncQueue()
    this.config = {
      apiBaseUrl: "/api/sync",
      batchIntervalMs: 5000,
      maxBatchSize: 10,
      ...config,
    }
    this.queue.load()
    window.addEventListener("online", () => { this.online = true; this.flush() })
    window.addEventListener("offline", () => { this.online = false })
  }

  enqueue(op: Omit<Parameters<SyncQueue["enqueue"]>[0], never>): string {
    return this.queue.enqueue(op)
  }

  start(): void {
    if (this.timer) return
    this.timer = setInterval(() => this.flush(), this.config.batchIntervalMs)
  }

  stop(): void {
    if (this.timer) { clearInterval(this.timer); this.timer = null }
  }

  async flush(): Promise<SyncResult> {
    if (!this.online) return { confirmed: [], failed: [] }
    const batch = this.queue.pending().slice(0, this.config.maxBatchSize)
    if (batch.length === 0) return { confirmed: [], failed: [] }

    const result: SyncResult = { confirmed: [], failed: [] }

    for (const op of batch) {
      try {
        const res = await fetch(this.config.apiBaseUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(op),
        })
        if (res.ok) {
          this.queue.confirm(op.id)
          result.confirmed.push(op.id)
        } else {
          this.queue.retry(op.id)
          result.failed.push({ id: op.id, error: `HTTP ${res.status}` })
        }
      } catch (err) {
        this.queue.retry(op.id)
        result.failed.push({ id: op.id, error: String(err) })
      }
    }
    return result
  }

  getQueue(): SyncOperation[] {
    return this.queue.all()
  }

  getFailed(): SyncOperation[] {
    return this.queue.failed()
  }
}

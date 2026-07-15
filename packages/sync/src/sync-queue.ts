export type SyncOperation = {
  id: string
  type: "create" | "update" | "delete"
  table: string
  payload: Record<string, unknown>
  timestamp: number
  retries: number
  maxRetries: number
  status: "pending" | "processing" | "confirmed" | "failed"
  backoffMs: number
}

export class SyncQueue {
  private queue: SyncOperation[] = []
  private processing = false

  enqueue(op: Omit<SyncOperation, "id" | "timestamp" | "retries" | "status" | "backoffMs">): string {
    const id = crypto.randomUUID()
    this.queue.push({
      ...op,
      id,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: 5,
      status: "pending",
      backoffMs: 1000,
    })
    this.persist()
    return id
  }

  dequeue(): SyncOperation | undefined {
    const idx = this.queue.findIndex((o) => o.status === "pending")
    if (idx === -1) return
    const op = this.queue[idx]
    op.status = "processing"
    this.persist()
    return op
  }

  confirm(id: string): void {
    const op = this.queue.find((o) => o.id === id)
    if (op) { op.status = "confirmed" }
    this.persist()
  }

  retry(id: string): void {
    const op = this.queue.find((o) => o.id === id)
    if (!op) return
    op.retries++
    if (op.retries >= op.maxRetries) {
      op.status = "failed"
    } else {
      op.backoffMs = Math.min(op.backoffMs * 2, 60000)
      op.status = "pending"
    }
    this.persist()
  }

  pending(): SyncOperation[] {
    return this.queue.filter((o) => o.status === "pending" || o.status === "processing")
  }

  failed(): SyncOperation[] {
    return this.queue.filter((o) => o.status === "failed")
  }

  all(): SyncOperation[] {
    return [...this.queue]
  }

  clear(): void {
    this.queue = []
    this.persist()
  }

  private persist(): void {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("zafiro_sync_queue", JSON.stringify(this.queue))
    }
  }

  load(): void {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = localStorage.getItem("zafiro_sync_queue")
      if (raw) {
        try {
          this.queue = JSON.parse(raw)
        } catch { this.queue = [] }
      }
    }
  }
}

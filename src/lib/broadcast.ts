const CHANNEL_NAME = "zafiro-cross-pillar"

export type BroadcastEventType =
  | "notification:new"
  | "notification:read"
  | "data:changed"
  | "pillar:updated"

export interface BroadcastMessage {
  type: BroadcastEventType
  pillar?: string
  payload?: unknown
  timestamp: string
}

let channel: BroadcastChannel | null = null

function getChannel(): BroadcastChannel {
  if (typeof window === "undefined") return null as unknown as BroadcastChannel
  if (!channel) {
    channel = new BroadcastChannel(CHANNEL_NAME)
  }
  return channel
}

export function broadcastMessage(msg: Omit<BroadcastMessage, "timestamp">) {
  try {
    const ch = getChannel()
    ch.postMessage({ ...msg, timestamp: new Date().toISOString() })
  } catch {}
}

export function onBroadcastMessage(callback: (msg: BroadcastMessage) => void) {
  if (typeof window === "undefined") return () => {}
  try {
    const ch = getChannel()
    const handler = (event: MessageEvent) => {
      callback(event.data as BroadcastMessage)
    }
    ch.addEventListener("message", handler)
    return () => {
      ch.removeEventListener("message", handler)
    }
  } catch {
    return () => {}
  }
}

export function notifyDataChanged(pillar?: string) {
  broadcastMessage({ type: "data:changed", pillar })
}

export function notifyPillarUpdated(pillar: string) {
  broadcastMessage({ type: "pillar:updated", pillar })
}

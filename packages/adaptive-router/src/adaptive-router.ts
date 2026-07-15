import type { ChannelType } from "../../mesh-bridge/src/mesh-bridge"

export type ChannelScore = {
  channel: ChannelType
  score: number
  latency: number
  throughput: number
  cost: number
  available: boolean
}

const CHANNEL_BASELINE: Record<ChannelType, { latency: number; throughput: number; cost: number }> = {
  wifi: { latency: 10, throughput: 100, cost: 0 },
  lora: { latency: 500, throughput: 0.3, cost: 0.01 },
  bluetooth: { latency: 50, throughput: 10, cost: 0 },
  satellite: { latency: 2000, throughput: 5, cost: 0.5 },
  nfc: { latency: 100, throughput: 0.1, cost: 0 },
}

export class AdaptiveRouter {
  private lastScores: Map<ChannelType, ChannelScore> = new Map()

  scoreChannels(payloadSizeKb: number): ChannelScore[] {
    const scores: ChannelScore[] = []

    for (const [channel, base] of Object.entries(CHANNEL_BASELINE)) {
      const c = channel as ChannelType
      const available = this.isAvailable(c)
      const latency = base.latency + payloadSizeKb * 2
      const throughput = Math.min(base.throughput, payloadSizeKb > 0 ? base.throughput : 999)
      const cost = base.cost * payloadSizeKb

      const score = available
        ? (throughput * 10) / (latency / 100 + 1) / (cost + 0.1)
        : 0

      const entry: ChannelScore = { channel: c, score, latency, throughput, cost, available }
      this.lastScores.set(c, entry)
      scores.push(entry)
    }

    return scores.sort((a, b) => b.score - a.score)
  }

  bestChannel(payloadSizeKb: number): ChannelType {
    const scores = this.scoreChannels(payloadSizeKb)
    return scores[0]?.channel ?? "wifi"
  }

  private isAvailable(channel: ChannelType): boolean {
    try {
      if (typeof navigator === "undefined" || !navigator) return channel === "wifi"
      const conn = (navigator as any).connection
      switch (channel) {
        case "wifi":
          return conn?.type === "wifi" || !!(navigator as any).onLine
        case "bluetooth":
          return typeof (navigator as any).bluetooth !== "undefined"
        case "lora":
          return false
        case "satellite":
          return false
        case "nfc":
          return typeof (navigator as any).ndef !== "undefined"
        default:
          return false
      }
    } catch {
      return channel === "wifi"
    }
  }
}

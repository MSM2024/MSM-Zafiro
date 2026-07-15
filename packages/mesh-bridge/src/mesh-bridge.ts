export type ChannelType = "wifi" | "lora" | "bluetooth" | "satellite" | "nfc"

export type MeshMessage = {
  id: string
  from: string
  to: string
  channel: ChannelType
  payload: unknown
  ttl: number
  hops: number
  timestamp: number
  ack: boolean
}

export type PeerInfo = {
  id: string
  channels: ChannelType[]
  lastSeen: number
  signal: number
}

export class MeshBridge {
  private peers: Map<string, PeerInfo> = new Map()
  private messages: MeshMessage[] = []
  private onMessage: ((msg: MeshMessage) => void) | null = null

  constructor() {
    if (typeof navigator !== "undefined") {
      this.listenNetworkInfo()
    }
  }

  private listenNetworkInfo(): void {
    const conn = (navigator as any).connection
    if (conn) {
      conn.addEventListener("change", () => {
        this.broadcastPeerInfo()
      })
    }
  }

  registerPeer(id: string, channels: ChannelType[]): void {
    this.peers.set(id, { id, channels, lastSeen: Date.now(), signal: -1 })
  }

  unregisterPeer(id: string): void {
    this.peers.delete(id)
  }

  getPeers(): PeerInfo[] {
    return Array.from(this.peers.values())
  }

  send(to: string, payload: unknown, channel?: ChannelType): string {
    const id = crypto.randomUUID()
    const msg: MeshMessage = {
      id,
      from: "local",
      to,
      channel: channel || "wifi",
      payload,
      ttl: 3,
      hops: 0,
      timestamp: Date.now(),
      ack: false,
    }
    this.messages.push(msg)
    this.deliver(msg)
    return id
  }

  broadcast(payload: unknown): string[] {
    return this.getPeers().map((p) => this.send(p.id, payload))
  }

  onReceive(cb: (msg: MeshMessage) => void): void {
    this.onMessage = cb
  }

  private deliver(msg: MeshMessage): void {
    if (msg.hops >= msg.ttl) return
    msg.hops++
    this.onMessage?.(msg)
    if (typeof navigator !== "undefined") {
      try {
        const bc = new BroadcastChannel("zafiro-mesh")
        bc.postMessage(msg)
        bc.close()
      } catch { /* fallback */ }
    }
  }

  private broadcastPeerInfo(): void {
    this.broadcast({ type: "peer_info", timestamp: Date.now() })
  }
}

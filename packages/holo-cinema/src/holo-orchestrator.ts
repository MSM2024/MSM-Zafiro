import type {
  SceneState, SceneNode, SceneDelta, SceneSnapshot,
  HoloEvent, HoloEventType, AdapterCapability, OutputAdapterType,
  CameraState, LightingState,
} from "./holo-protocol"

type AdapterInterface = {
  type: OutputAdapterType
  render: (state: SceneState) => Promise<void>
  applyDelta: (delta: SceneDelta) => Promise<void>
  onEvent: (event: HoloEvent) => Promise<void>
  dispose: () => Promise<void>
}

type EventHandler = (event: HoloEvent) => void

export class HoloOrchestrator {
  private adapters: Map<OutputAdapterType, AdapterInterface> = new Map()
  private scene: SceneState | null = null
  private eventHandlers: Map<HoloEventType, EventHandler[]> = new Map()
  private snapshots: SceneSnapshot[] = []
  private outputMode: "single" | "multi" = "single"
  private activeAdapter: OutputAdapterType = "web"
  private frameId = 0

  registerAdapter(adapter: AdapterInterface): void {
    this.adapters.set(adapter.type, adapter)
  }

  unregisterAdapter(type: OutputAdapterType): void {
    this.adapters.delete(type)
  }

  getAdapters(): AdapterCapability[] {
    return Array.from(this.adapters.entries()).map(([type, a]) => ({
      type,
      name: a.type,
      version: "0.1.0",
      features: [],
      connected: true,
      latency: 0,
    }))
  }

  setScene(scene: SceneState): void {
    this.scene = scene
    this.broadcastEvent({
      id: crypto.randomUUID(),
      type: "SCENE_CREATED",
      timestamp: Date.now(),
      sceneId: scene.id,
      payload: scene,
      source: "orchestrator",
      version: scene.version,
    })
    this.renderAll()
  }

  updateScene(partial: Partial<SceneState>): void {
    if (!this.scene) return
    this.scene = { ...this.scene, ...partial, version: this.scene.version + 1, timestamp: Date.now() }
    this.broadcastEvent({
      id: crypto.randomUUID(),
      type: "SCENE_UPDATED",
      timestamp: Date.now(),
      sceneId: this.scene.id,
      payload: { version: this.scene.version, changes: Object.keys(partial) },
      source: "orchestrator",
      version: this.scene.version,
    })
    this.renderAll()
  }

  addNode(node: SceneNode): void {
    if (!this.scene) return
    this.scene.nodes.push(node)
    this.scene.version++
    this.scene.timestamp = Date.now()
    this.broadcastEvent({
      id: crypto.randomUUID(),
      type: "NODE_ADDED",
      timestamp: Date.now(),
      sceneId: this.scene.id,
      payload: node,
      source: "orchestrator",
      version: this.scene.version,
    })
    this.renderAll()
  }

  removeNode(nodeId: string): void {
    if (!this.scene) return
    this.scene.nodes = this.scene.nodes.filter((n) => n.id !== nodeId)
    this.scene.version++
    this.broadcastEvent({
      id: crypto.randomUUID(),
      type: "NODE_REMOVED",
      timestamp: Date.now(),
      sceneId: this.scene.id,
      payload: { nodeId },
      source: "orchestrator",
      version: this.scene.version,
    })
    this.renderAll()
  }

  transformNode(nodeId: string, transform: SceneNode["transform"]): void {
    if (!this.scene) return
    const node = this.scene.nodes.find((n) => n.id === nodeId)
    if (!node) return
    node.transform = transform
    this.scene.version++
    this.broadcastEvent({
      id: crypto.randomUUID(),
      type: "NODE_TRANSFORMED",
      timestamp: Date.now(),
      sceneId: this.scene.id,
      payload: { nodeId, transform },
      source: "orchestrator",
      version: this.scene.version,
    })
    this.renderAll()
  }

  setCamera(camera: Partial<CameraState>): void {
    if (!this.scene) return
    this.scene.camera = { ...this.scene.camera, ...camera }
    this.scene.version++
    this.broadcastEvent({
      id: crypto.randomUUID(),
      type: "CAMERA_CHANGED",
      timestamp: Date.now(),
      sceneId: this.scene.id,
      payload: camera,
      source: "orchestrator",
      version: this.scene.version,
    })
    this.renderAll()
  }

  setLighting(lighting: Partial<LightingState>): void {
    if (!this.scene) return
    this.scene.lighting = { ...this.scene.lighting, ...lighting }
    this.scene.version++
    this.broadcastEvent({
      id: crypto.randomUUID(),
      type: "LIGHTING_CHANGED",
      timestamp: Date.now(),
      sceneId: this.scene.id,
      payload: lighting,
      source: "orchestrator",
      version: this.scene.version,
    })
    this.renderAll()
  }

  setOutputMode(mode: "single" | "multi"): void {
    this.outputMode = mode
  }

  switchAdapter(type: OutputAdapterType): void {
    this.activeAdapter = type
    this.broadcastEvent({
      id: crypto.randomUUID(),
      type: "OUTPUT_SWITCHED",
      timestamp: Date.now(),
      sceneId: this.scene?.id || "",
      payload: { from: this.activeAdapter, to: type },
      source: "orchestrator",
      version: this.scene?.version || 0,
    })
    this.renderAll()
  }

  snapshot(label?: string): SceneSnapshot {
    if (!this.scene) throw new Error("No scene loaded")
    const snap: SceneSnapshot = {
      id: crypto.randomUUID(),
      scene: JSON.parse(JSON.stringify(this.scene)),
      capturedAt: Date.now(),
      label,
    }
    this.snapshots.push(snap)
    return snap
  }

  on(type: HoloEventType, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(type) || []
    handlers.push(handler)
    this.eventHandlers.set(type, handlers)
  }

  private async renderAll(): Promise<void> {
    if (!this.scene) return
    const targets = this.outputMode === "multi"
      ? Array.from(this.adapters.values())
      : [this.adapters.get(this.activeAdapter)].filter(Boolean) as AdapterInterface[]

    await Promise.all(targets.map((a) => a.render(this.scene!)))
  }

  private broadcastEvent(event: HoloEvent): void {
    const handlers = this.eventHandlers.get(event.type) || []
    handlers.forEach((h) => h(event))
  }

  async dispose(): Promise<void> {
    await Promise.all(Array.from(this.adapters.values()).map((a) => a.dispose()))
    this.adapters.clear()
    this.scene = null
    this.eventHandlers.clear()
    this.snapshots = []
  }
}

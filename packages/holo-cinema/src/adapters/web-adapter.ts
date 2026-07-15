import type { SceneState, SceneDelta, HoloEvent, OutputAdapterType } from "../holo-protocol"

export type WebAdapterCallback = {
  onSceneUpdate: (state: SceneState) => void
  onDelta: (delta: SceneDelta) => void
  onEvent: (event: HoloEvent) => void
}

export class WebAdapter {
  readonly type: OutputAdapterType = "web"
  private callbacks: WebAdapterCallback | null = null
  private currentState: SceneState | null = null

  connect(callbacks: WebAdapterCallback): void {
    this.callbacks = callbacks
  }

  async render(state: SceneState): Promise<void> {
    this.currentState = state
    this.callbacks?.onSceneUpdate(state)
  }

  async applyDelta(delta: SceneDelta): Promise<void> {
    if (!this.currentState) return
    if (delta.baseVersion !== this.currentState.version) return

    for (const id of delta.removed) {
      this.currentState.nodes = this.currentState.nodes.filter((n) => n.id !== id)
    }
    for (const node of delta.added) {
      this.currentState.nodes.push(node)
    }
    for (const u of delta.updated) {
      const idx = this.currentState.nodes.findIndex((n) => n.id === u.id)
      if (idx !== -1) this.currentState.nodes[idx] = { ...this.currentState.nodes[idx], ...u.patch }
    }
    if (delta.camera) this.currentState.camera = { ...this.currentState.camera, ...delta.camera }
    if (delta.lighting) this.currentState.lighting = { ...this.currentState.lighting, ...delta.lighting }

    this.currentState.version = delta.targetVersion
    this.callbacks?.onDelta(delta)
  }

  async onEvent(event: HoloEvent): Promise<void> {
    this.callbacks?.onEvent(event)
  }

  async dispose(): Promise<void> {
    this.callbacks = null
    this.currentState = null
  }

  getState(): SceneState | null {
    return this.currentState
  }
}

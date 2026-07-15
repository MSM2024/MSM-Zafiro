export type NodeType =
  | "cube" | "sphere" | "plane" | "model" | "text"
  | "camera" | "light" | "particle" | "avatar" | "guardian"

export type Transform = {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
}

export type GeometryRef = {
  type: "box" | "sphere" | "plane" | "gltf" | "custom"
  params: Record<string, unknown>
}

export type MaterialRef = {
  color?: string
  opacity?: number
  metalness?: number
  roughness?: number
  emissive?: string
  emissiveIntensity?: number
  map?: string
}

export type CameraState = {
  position: [number, number, number]
  target: [number, number, number]
  fov: number
  near: number
  far: number
}

export type LightingState = {
  ambient: { color: string; intensity: number }
  directional: { color: string; intensity: number; position: [number, number, number] }
  point?: { color: string; intensity: number; position: [number, number, number] }
}

export type EnvironmentState = {
  background: string
  fog?: { color: string; density: number }
}

export type SceneNode = {
  id: string
  type: NodeType
  transform: Transform
  geometry?: GeometryRef
  material?: MaterialRef
  children: string[]
  parent?: string
  visible: boolean
  active: boolean
  metadata: Record<string, unknown>
}

export type SceneState = {
  id: string
  version: number
  timestamp: number
  nodes: SceneNode[]
  camera: CameraState
  lighting: LightingState
  environment: EnvironmentState
  metadata: Record<string, unknown>
}

export type HoloEventType =
  | "SCENE_CREATED" | "SCENE_UPDATED" | "SCENE_DELETED"
  | "NODE_ADDED" | "NODE_REMOVED" | "NODE_TRANSFORMED"
  | "CAMERA_CHANGED" | "LIGHTING_CHANGED"
  | "AVATAR_SPEAKING" | "AVATAR_GESTURE"
  | "GUARDIAN_ACTIVATED" | "GUARDIAN_DEACTIVATED"
  | "OUTPUT_SWITCHED" | "FRAME_SYNC"

export type HoloEvent = {
  id: string
  type: HoloEventType
  timestamp: number
  sceneId: string
  payload: unknown
  source: string
  version: number
}

export type SceneDelta = {
  sceneId: string
  baseVersion: number
  targetVersion: number
  added: SceneNode[]
  removed: string[]
  updated: { id: string; patch: Partial<SceneNode> }[]
  camera?: Partial<CameraState>
  lighting?: Partial<LightingState>
}

export type SceneSnapshot = {
  id: string
  scene: SceneState
  capturedAt: number
  label?: string
}

export type OutputAdapterType = "web" | "unity" | "unreal" | "openxr" | "lightfield"

export type AdapterCapability = {
  type: OutputAdapterType
  name: string
  version: string
  features: string[]
  connected: boolean
  latency: number
}

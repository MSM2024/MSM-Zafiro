# Holo Protocol — Scene Protocol v0.1.0

## Overview
Protocolo de comunicación entre capas holográficas. Define tipos, estado de escena, eventos, snapshots, actualizaciones delta, y sincronización temporal.

## Scene State

```typescript
interface SceneState {
  id: string
  version: number
  timestamp: number
  nodes: SceneNode[]
  camera: CameraState
  lighting: LightingState
  environment: EnvironmentState
  metadata: Record<string, unknown>
}

interface SceneNode {
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
```

## Event Types
- `SCENE_CREATED` · `SCENE_UPDATED` · `SCENE_DELETED`
- `NODE_ADDED` · `NODE_REMOVED` · `NODE_TRANSFORMED`
- `CAMERA_CHANGED` · `LIGHTING_CHANGED`
- `AVATAR_SPEAKING` · `AVATAR_GESTURE`
- `GUARDIAN_ACTIVATED` · `GUARDIAN_DEACTIVATED`

## Transport
- WebSocket para tiempo real (scene state)
- REST para snapshots completos
- Delta updates para cambios incrementales
- Idempotencia por version + timestamp

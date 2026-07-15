# Cinema Output Specification — v0.1.0

## Output Adapters

### 1. Web 3D (MVP)
- **Runtime**: Three.js via React Three Fiber
- **Canvas**: WebGL 2.0
- **Features**: Scene preview, avatar ELIANA, 7 guardian rings, orbital camera
- **File**: `packages/holo-cinema/src/adapters/web-adapter.ts`

### 2. Unity Bridge
- **Runtime**: Unity WebGL build
- **Comms**: postMessage / WebSocket bridge
- **Scene**: GLTF scene export

### 3. Unreal Bridge
- **Runtime**: Unreal Engine Pixel Streaming
- **Comms**: WebRTC + WebSocket

### 4. OpenXR
- **Runtime**: WebXR API
- **Devices**: Quest, HoloLens, Apple Vision Pro

### 5. Light Field
- **Runtime**: Looking Glass / holographic display
- **Format**: Quilt image sequence

## Multiproyección
- Sincronización temporal: Precision Time Protocol (PTP) via WebSocket
- Frame-accurate switching entre adaptadores
- Cinema Control Plane como orquestador central

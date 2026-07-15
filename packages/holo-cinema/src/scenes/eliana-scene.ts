import type { SceneState, SceneNode } from "../holo-protocol"

const GUARDIAN_COLORS = [
  "#00D9FF", "#FF6B35", "#FFD700", "#7B68EE",
  "#00E676", "#FF4081", "#FFFFFF",
]

function createGuardianRing(index: number, color: string): SceneNode {
  const angle = (index / 7) * Math.PI * 2
  const radius = 3 + index * 0.8
  return {
    id: `guardian-${index + 1}`,
    type: "guardian",
    transform: {
      position: [Math.cos(angle) * radius, Math.sin(angle) * radius, 0],
      rotation: [0, 0, index * 0.5],
      scale: [0.3, 0.3, 0.3],
    },
    geometry: { type: "sphere", params: { radius: 0.15 } },
    material: { color, emissive: color, emissiveIntensity: 0.5, metalness: 0.8, roughness: 0.2 },
    children: [],
    visible: true,
    active: true,
    metadata: { guardianIndex: index + 1, label: `G${index + 1}` },
  }
}

export function createElianaScene(): SceneState {
  const nodes: SceneNode[] = []

  const core: SceneNode = {
    id: "eliana-core",
    type: "avatar",
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] },
    geometry: { type: "sphere", params: { radius: 0.5 } },
    material: { color: "#00D9FF", emissive: "#00D9FF", emissiveIntensity: 1, metalness: 0.9, roughness: 0.1 },
    children: [],
    visible: true,
    active: true,
    metadata: { label: "ELIANA" },
  }
  nodes.push(core)

  for (let i = 0; i < 7; i++) {
    const ring = createGuardianRing(i, GUARDIAN_COLORS[i])
    nodes.push(ring)
  }

  const platform: SceneNode = {
    id: "platform",
    type: "plane",
    transform: { position: [0, -0.8, 0], rotation: [-Math.PI / 2, 0, 0], scale: [8, 8, 1] },
    geometry: { type: "plane", params: { width: 8, height: 8 } },
    material: { color: "#0a0a2e", opacity: 0.5, metalness: 0.3, roughness: 0.7 },
    children: [],
    visible: true,
    active: true,
    metadata: {},
  }
  nodes.push(platform)

  return {
    id: crypto.randomUUID(),
    version: 1,
    timestamp: Date.now(),
    nodes,
    camera: {
      position: [0, 2, 6],
      target: [0, 0, 0],
      fov: 60,
      near: 0.1,
      far: 100,
    },
    lighting: {
      ambient: { color: "#ffffff", intensity: 0.3 },
      directional: { color: "#ffffff", intensity: 0.8, position: [5, 10, 5] },
    },
    environment: {
      background: "#05070D",
      fog: { color: "#05070D", density: 0.02 },
    },
    metadata: { name: "ELIANA Genesis Chamber" },
  }
}

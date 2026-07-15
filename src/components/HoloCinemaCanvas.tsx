'use client'

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Stars } from "@react-three/drei"
import { useMemo } from "react"
import { createElianaScene } from "../../packages/holo-cinema/src/scenes/eliana-scene"
import type { SceneNode } from "../../packages/holo-cinema/src/holo-protocol"

function SceneNode({ node }: { node: SceneNode }) {
  const { transform, geometry, material } = node
  const mat = useMemo(() => ({
    color: material?.color || "#ffffff",
    metalness: material?.metalness ?? 0,
    roughness: material?.roughness ?? 0.5,
    emissive: material?.emissive || "#000000",
    emissiveIntensity: material?.emissiveIntensity ?? 0,
    transparent: (material?.opacity ?? 1) < 1,
    opacity: material?.opacity ?? 1,
  }), [material])

  if (node.type === "plane") {
    return (
      <mesh position={transform.position} rotation={transform.rotation as any}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial {...mat} side={2} />
      </mesh>
    )
  }

  const radius = (geometry?.params?.radius as number) || 0.5

  return (
    <mesh position={transform.position} scale={transform.scale}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial {...mat} />
    </mesh>
  )
}

export default function HoloCinemaCanvas() {
  const scene = useMemo(() => createElianaScene(), [])

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: scene.camera.position, fov: scene.camera.fov, near: scene.camera.near, far: scene.camera.far }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: scene.environment.background }}
      >
        <ambientLight intensity={scene.lighting.ambient.intensity} />
        <directionalLight
          position={scene.lighting.directional.position}
          intensity={scene.lighting.directional.intensity}
        />
        <Stars radius={50} depth={50} count={2000} factor={4} fade speed={1} />
        <OrbitControls enableDamping dampingFactor={0.05} />
        {scene.nodes.map((node) => (
          <SceneNode key={node.id} node={node} />
        ))}
      </Canvas>
    </div>
  )
}

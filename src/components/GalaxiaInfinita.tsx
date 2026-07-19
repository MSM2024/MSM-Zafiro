'use client'

import { useRef, useMemo, useState, useEffect, useCallback } from "react"
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber"
import { Stars, useTexture } from "@react-three/drei"
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing"
import * as THREE from "three"

function generateGalaxyGeometry(count = 3000) {
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const radius = 5 + Math.random() * 15
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = radius * Math.cos(phi) * 0.3
    pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 0.8, 0.4 + Math.random() * 0.3)
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3))
  return geo
}

const matOpacity = (m: THREE.Material | THREE.Material[]): number =>
  Array.isArray(m) ? m[0]?.opacity ?? 0 : m.opacity
const setMatOpacity = (m: THREE.Material | THREE.Material[], val: number): void => {
  if (Array.isArray(m)) { if (m[0]) m[0].opacity = val }
  else m.opacity = val
}

const FRAGMENT_SHADER = `
uniform float uZoom;
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
varying vec3 vPosition;
varying vec3 vNormal;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 6; i++) {
    vec2 q = p * frequency;
    value += amplitude * (hash(q) * 2.0 - 1.0);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

float mandelbrot(vec2 c) {
  vec2 z = vec2(0.0);
  float n = 0.0;
  for (int i = 0; i < 64; i++) {
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    if (dot(z, z) > 4.0) break;
    n += 1.0;
  }
  return n / 64.0;
}

void main() {
  vec2 uv = vPosition.xy * 2.0;
  float detail = uZoom * 0.5 + 0.5;

  float pattern = 0.0;
  float layers = 0.0;

  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float scale = pow(2.0, fi) * detail;
    vec2 p = uv * scale + uTime * 0.0001 * (fi + 1.0);
    pattern += sin(p.x) * cos(p.y) / (fi + 1.0);
    layers += 1.0 / (fi + 1.0);
  }
  pattern /= layers;

  float mandel = mandelbrot(uv * detail * 0.5 + vec2(-0.5, 0.0));
  float fbmVal = fbm(uv * detail + uTime * 0.0002);

  float glow = abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));

  vec3 col1 = mix(uColor1, uColor2, pattern * 0.5 + 0.5);
  vec3 col2 = mix(col1, uColor3, mandel * 0.3);
  vec3 col3 = mix(col2, vec3(1.0), pow(glow, 3.0) * 0.4);
  vec3 finalColor = mix(col3, col3 + vec3(0.3, 0.1, 0.2), fbmVal * 0.2);

  float alpha = 0.85 + glow * 0.15;
  gl_FragColor = vec4(finalColor, alpha);
}
`

const VERTEX_SHADER = `
uniform float uTime;
uniform float uZoom;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec3 pos = position;

  float wave = sin(pos.x * 2.0 + uTime * 0.001) * cos(pos.z * 2.0 + uTime * 0.0013) * 0.02 * uZoom;
  pos += normal * wave;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vPosition = pos;
  gl_Position = projectionMatrix * mvPosition;
}
`

const NODE_COLORS = ["#00D9FF", "#FF6B35", "#FFD700", "#7B68EE", "#00E676", "#FF4081", "#FFFFFF", "#FF69B4", "#00BFFF", "#FF4500", "#32CD32", "#9370DB", "#FFD700", "#00CED1", "#FF1493"]

const NETWORK_NODES = [
  { label: "ELIANA", x: 0, y: 0, z: 0 },
  { label: "JOFIEL", x: 3, y: 1.5, z: -1 },
  { label: "ZADKIEL", x: -2.5, y: 2, z: 2 },
  { label: "HANIEL", x: 2, y: -2, z: 2.5 },
  { label: "GABRIEL", x: -3, y: -1, z: -2 },
  { label: "MIGUEL", x: 1, y: 2.5, z: -2.5 },
  { label: "URIEL", x: -1, y: -2.5, z: -3 },
  { label: "RAZIEL", x: 2.5, y: -1.5, z: 1 },
  { label: "PTS", x: 4, y: 0, z: 1.5 },
  { label: "ECONOMIA", x: -3.5, y: 1, z: -1.5 },
  { label: "UNIVERSO", x: 1.5, y: 3, z: 0.5 },
  { label: "GENESIS", x: -1.5, y: -3, z: -0.5 },
  { label: "GUARDIAN", x: 3.5, y: -0.5, z: -1 },
  { label: "PORTAL", x: -2, y: 0.5, z: 3.5 },
  { label: "HOLO", x: 0.5, y: -1.5, z: -3.5 },
]

function DiamondCore({ zoom }: { zoom: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  const [time, setTime] = useState(0)

  useFrame((_, delta) => {
    setTime((t) => t + delta)
    ref.current.rotation.y += delta * 0.15
    ref.current.rotation.x = Math.sin(time * 0.1) * 0.1
  })

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uZoom: { value: zoom },
    uColor1: { value: new THREE.Color("#00D9FF") },
    uColor2: { value: new THREE.Color("#7B68EE") },
    uColor3: { value: new THREE.Color("#FFD700") },
  }), [zoom])

  useFrame(() => {
    // eslint-disable-next-line react-hooks/immutability
    uniforms.uTime.value = time
  })

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[1.5, 2]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function NetworkNode({ position, color, label, zoom }: { position: [number, number, number]; color: string; label: string; zoom: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    const scale = 0.08 + Math.sin(Date.now() * 0.002 + position[0]) * 0.02
    ref.current.scale.setScalar(scale)
    if (glowRef.current) {
      glowRef.current.scale.setScalar(scale * 1.5)
      setMatOpacity(glowRef.current.material, 0.3 + Math.sin(Date.now() * 0.003 + position[0]) * 0.15)
    }
  })

  const visible = zoom > 0.8

  return (
    <group position={position}>
      {/* Core sphere */}
      <mesh ref={ref}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={visible ? 0.9 : 0}
        />
      </mesh>
      {/* Glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={visible ? 0.2 : 0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function NetworkLines({ zoom }: { zoom: number }) {
  const ref = useRef<THREE.LineSegments>(null!)

  const geometry = useMemo(() => {
    const nodes = NETWORK_NODES
    const pos: number[] = []
    const idx: number[] = []
    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (j > i) {
          const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2)
          if (dist < 5) {
            pos.push(a.x, a.y, a.z, b.x, b.y, b.z)
            idx.push(idx.length, idx.length + 1)
          }
        }
      })
    })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pos), 3))
    geo.setIndex(new THREE.BufferAttribute(new Uint16Array(idx), 1))
    return geo
  }, [])

  useFrame(() => {
    if (ref.current) {
      setMatOpacity(ref.current.material, Math.max(0, (zoom - 0.5) * 2) * 0.3)
    }
  })

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#00D9FF" transparent opacity={0} />
    </lineSegments>
  )
}

function ParticleGalaxy({ zoom }: { zoom: number }) {
  const ref = useRef<THREE.Points>(null!)

  const geometry = useMemo(() => generateGalaxyGeometry(), [])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.005
      setMatOpacity(ref.current.material, Math.min(1, zoom * 0.5))
    }
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

function LightRays({ zoom }: { zoom: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  const count = 24

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 6)
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const r = 2
      pos[i * 6] = Math.cos(angle) * r
      pos[i * 6 + 1] = Math.sin(angle) * r
      pos[i * 6 + 2] = 0
      pos[i * 6 + 3] = Math.cos(angle) * (r + 0.2)
      pos[i * 6 + 4] = Math.sin(angle) * (r + 0.2)
      pos[i * 6 + 5] = 0
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    return geo
  }, [])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.1
      setMatOpacity(ref.current.material, Math.max(0, (zoom - 0.3) * 0.8))
    }
  })

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#00D9FF" transparent opacity={0} blending={THREE.AdditiveBlending} />
    </lineSegments>
  )
}

type DepthLayer = "entrance" | "diamond" | "fractal" | "galaxy"

function Scene({ zoom, setZoom, depthLayer, setDepthLayer }: {
  zoom: number
  setZoom: (z: number) => void
  depthLayer: DepthLayer
  setDepthLayer: (d: DepthLayer) => void
}) {
  const { camera } = useThree()

  useEffect(() => {
    const targetZ = depthLayer === "entrance" ? 8
      : depthLayer === "diamond" ? 4
      : depthLayer === "fractal" ? 1.5
      : 6

    const targetZoom = depthLayer === "entrance" ? 0.3
      : depthLayer === "diamond" ? 0.6
      : depthLayer === "fractal" ? 1.0
      : 0.4

    const startZ = camera.position.z
    const startZoom = zoom
    const duration = 1500
    const startTime = Date.now()

    function animate() {
      const elapsed = Date.now() - startTime
      const t = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)

      camera.position.z = startZ + (targetZ - startZ) * ease
      setZoom(startZoom + (targetZoom - startZoom) * ease)

      if (t < 1) requestAnimationFrame(animate)
    }
    animate()
  }, [depthLayer, camera, zoom, setZoom])

  return (
    <>
      <DiamondCore zoom={zoom} />
      <NetworkNode position={[3, 1.5, -1]} color="#00D9FF" label="JOFIEL" zoom={zoom} />
      <NetworkNode position={[-2.5, 2, 2]} color="#FF6B35" label="ZADKIEL" zoom={zoom} />
      <NetworkNode position={[2, -2, 2.5]} color="#FFD700" label="HANIEL" zoom={zoom} />
      <NetworkNode position={[-3, -1, -2]} color="#7B68EE" label="GABRIEL" zoom={zoom} />
      <NetworkNode position={[1, 2.5, -2.5]} color="#00E676" label="MIGUEL" zoom={zoom} />
      <NetworkNode position={[-1, -2.5, -3]} color="#FF4081" label="URIEL" zoom={zoom} />
      <NetworkNode position={[2.5, -1.5, 1]} color="#FFFFFF" label="RAZIEL" zoom={zoom} />
      <NetworkNode position={[4, 0, 1.5]} color="#FFD700" label="PTS" zoom={zoom} />
      <NetworkNode position={[-3.5, 1, -1.5]} color="#00CED1" label="ECONOMIA" zoom={zoom} />
      <NetworkNode position={[1.5, 3, 0.5]} color="#FF69B4" label="UNIVERSO" zoom={zoom} />
      <NetworkNode position={[-1.5, -3, -0.5]} color="#9370DB" label="GENESIS" zoom={zoom} />
      <NetworkNode position={[3.5, -0.5, -1]} color="#32CD32" label="GUARDIAN" zoom={zoom} />
      <NetworkNode position={[-2, 0.5, 3.5]} color="#FF4500" label="PORTAL" zoom={zoom} />
      <NetworkNode position={[0.5, -1.5, -3.5]} color="#00BFFF" label="HOLO" zoom={zoom} />
      <NetworkLines zoom={zoom} />
      <ParticleGalaxy zoom={zoom} />
      <LightRays zoom={zoom} />
      <Stars
        radius={80}
        depth={80}
        count={5000}
        factor={6}
        fade
        speed={0.5}
      />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#00D9FF" distance={20} />
      <pointLight position={[3, 2, 3]} intensity={0.5} color="#7B68EE" distance={15} />
      <pointLight position={[-3, -2, -3]} intensity={0.5} color="#FFD700" distance={15} />
    </>
  )
}

const DEPTH_LABELS: Record<DepthLayer, string> = {
  entrance: "✦ Umbral del Portal",
  diamond: "◇ Superficie del Diamante",
  fractal: "🌀 Fractal Interior",
  galaxy: "🌌 Red Galáctica ZAFIRO",
}

export default function GalaxiaInfinita() {
  const [zoom, setZoom] = useState(0.3)
  const [depthLayer, setDepthLayer] = useState<DepthLayer>("entrance")
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showHUD, setShowHUD] = useState(true)

  const layers: DepthLayer[] = ["entrance", "diamond", "fractal", "galaxy"]

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    if (e.deltaY > 0) {
      setDepthLayer((prev) => {
        const idx = layers.indexOf(prev)
        return layers[Math.min(idx + 1, layers.length - 1)] as DepthLayer
      })
    } else {
      setDepthLayer((prev) => {
        const idx = layers.indexOf(prev)
        return layers[Math.max(idx - 1, 0)] as DepthLayer
      })
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * -2,
    })
  }, [])

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [handleWheel])

  return (
    <div
      className="fixed inset-0 w-full h-full bg-[#020412] overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowHUD(true)}
      onMouseLeave={() => setShowHUD(false)}
    >
      <Canvas
        camera={{ position: [mousePos.x * 0.5, mousePos.y * 0.5, 8], fov: 60, near: 0.01, far: 200 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <Scene
          zoom={zoom}
          setZoom={setZoom}
          depthLayer={depthLayer}
          setDepthLayer={setDepthLayer}
        />
        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.1}
            mipmapBlur
          />
          <ChromaticAberration
            offset={new THREE.Vector2(0.002, 0.002)}
          />
        </EffectComposer>
      </Canvas>

      {/* HUD */}
      <div className={`fixed top-0 left-0 right-0 p-6 transition-opacity duration-1000 ${showHUD ? "opacity-100" : "opacity-0"}`}>
        <div className="text-center">
          <h1 className="text-[10px] font-bold text-[#00D9FF] tracking-[0.3em] uppercase">
            ZAFIRO — Galaxia Infinita
          </h1>
          <p className="text-[8px] text-slate-600 mt-1">
            Scroll para explorar profundidad · Mouse para navegar
          </p>
        </div>
      </div>

      {/* Depth layer indicator */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 ${showHUD ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl px-5 py-3 rounded-full border border-slate-800/40">
          {layers.map((layer, i) => {
            const isActive = layer === depthLayer
            const isPast = layers.indexOf(depthLayer) > i
            return (
              <div key={layer} className="flex items-center gap-2">
                <button
                  onClick={() => setDepthLayer(layer)}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    isActive ? "bg-[#00D9FF] scale-150 shadow-lg shadow-[#00D9FF]/50" :
                    isPast ? "bg-[#00D9FF]/40" : "bg-slate-700"
                  }`}
                />
                {i < layers.length - 1 && (
                  <div className={`w-6 h-[1px] ${isPast ? "bg-[#00D9FF]/30" : "bg-slate-800"}`} />
                )}
              </div>
            )
          })}
          <span className="text-[9px] text-slate-400 ml-3 font-mono">
            {DEPTH_LABELS[depthLayer]}
          </span>
        </div>
      </div>

      {/* Enter/Exit instruction */}
      {depthLayer === "entrance" && (
        <div className="fixed bottom-36 left-1/2 -translate-x-1/2 animate-pulse">
          <p className="text-[10px] text-slate-500 tracking-widest uppercase">
            ▼ Desliza hacia abajo para entrar ▼
          </p>
        </div>
      )}

      {/* GLSL attribution */}
      <div className={`fixed bottom-4 right-6 transition-opacity duration-700 ${showHUD ? "opacity-30" : "opacity-0"}`}>
        <p className="text-[7px] text-slate-700 font-mono">ZAFIRO OS · WebGL Fractal Engine</p>
      </div>
    </div>
  )
}

import { loadEnvConfig } from "@next/env"
import * as fs from "fs"
import * as path from "path"

const PROJECT_ROOT = path.resolve(__dirname, "../..")
const ASSETS_DIR = path.resolve(PROJECT_ROOT, "public/assets/zafiro")
const EXPECTED_ASSETS = [
  "branding/zafiro-eliana-protegidas-por-el-senor.webp",
  "branding/zafiro-gema-azul-fondo-oscuro.webp",
  "branding/zafiro-logo-gema-geometria-sagrada.webp",
  "avatars/eliana-gema-telefono-holografico.webp",
  "avatars/eliana-modulos-zafiro-destino.webp",
  "avatars/eliana-ascension-red-de-nodos.webp",
  "avatars/eliana-origen-modulos-superiores.webp",
  "avatars/eliana-zafiro-destino-gema-telefono.webp",
  "avatars/eliana-interfaz-manos-telefono.webp",
  "avatars/eliana-modulos-destino-poster.webp",
  "avatars/eliana-origen-panel-de-modulos.webp",
  "conceptos/incubadora-del-futuro-angel-gema.webp",
  "conceptos/zafiro-dashboard-desktop-concept.webp",
  "conceptos/zafiro-dashboard-mobile-concept.webp",
  "storyboards/eliana-awakening-storyboard.webp",
]

interface BootstrapResult {
  mode: string
  assets: { total: number; found: number; missing: string[] }
  frecuenciaOrigen: boolean
  economiaV109: boolean
  devDatabase: boolean
  allPass: boolean
  timestamp: number
}

export async function runBootstrap(): Promise<BootstrapResult> {
  const mode = process.env.NODE_ENV || "development"
  if (mode !== "development") {
    console.warn("[BOOTSTRAP] Modo no es development — algunas validaciones omitidas")
  }

  try {
    await loadEnvConfig(PROJECT_ROOT, true)
  } catch {
    console.warn("[BOOTSTRAP] @next/env no disponible — saltando carga de .env")
  }

  const missingAssets: string[] = []
  for (const asset of EXPECTED_ASSETS) {
    const fullPath = path.join(ASSETS_DIR, asset)
    if (!fs.existsSync(fullPath)) missingAssets.push(asset)
  }

  const frecuenciaOrigenExists = fs.existsSync(
    path.resolve(PROJECT_ROOT, "src/lib/frecuencia-origen.config.ts")
  )
  const economiaV109Exists = fs.existsSync(
    path.resolve(PROJECT_ROOT, "src/lib/economia-v109.config.ts")
  )

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const isDevDatabase = supabaseUrl.includes("localhost") || supabaseUrl.includes("dev") || !supabaseUrl

  const result: BootstrapResult = {
    mode,
    assets: {
      total: EXPECTED_ASSETS.length,
      found: EXPECTED_ASSETS.length - missingAssets.length,
      missing: missingAssets,
    },
    frecuenciaOrigen: frecuenciaOrigenExists,
    economiaV109: economiaV109Exists,
    devDatabase: isDevDatabase,
    allPass: missingAssets.length === 0 && frecuenciaOrigenExists && isDevDatabase,
    timestamp: Date.now(),
  }

  if (result.allPass) {
    console.log("[BOOTSTRAP] ✅ DEV_PREVIEW_OK — Todos los checks pasados")
  } else {
    console.warn("[BOOTSTRAP] ⚠️  Reporte:")
    if (missingAssets.length > 0) console.warn(`  - ${missingAssets.length} assets faltantes`)
    if (!frecuenciaOrigenExists) console.warn("  - frecuencia-origen.config.ts ausente")
    if (!isDevDatabase) console.warn("  - Base de datos apunta a producción!")
  }

  return result
}

if (require.main === module) {
  runBootstrap().then(r => {
    console.log(JSON.stringify(r, null, 2))
    process.exit(r.allPass ? 0 : 1)
  })
}

# PROJECT SIZE REPORT — ZAFIRO

**Date:** 2026-07-16
**Branch:** feature/zafiro-v109-new-design
**Build:** 0 errors, 78 routes

---

## Directory Sizes

| Directory | Size | Files | Production | Notes |
|-----------|------|-------|------------|-------|
| `node_modules/` | 591 MB | 33,197 | No | Runtime deps; 3D libs (three.js) = ~70% of weight |
| `.next/` | ~40 MB | 2,291 | No | Build cache; regenerated on each build |
| `.git/` | 864 KB | 230 | No | History |
| `public/` | 2.67 MB | 26 | **Yes** | 15 WebP assets + SVGs + PWA files |
| `src/` | 1.26 MB | 164 | **Yes** | All source code |
| `packages/` | 73 KB | 32 | Partial | Only `types/` is used |
| `supabase/` | 39 KB | 6 | **Yes** | 2 migration SQL files |
| `docs/` | 194 KB | 50 | No | Documentation |
| `scripts/` | 8 KB | 2 | **Yes** | `generate-knowledge-data.mjs`, `validate-assets.cjs` |
| `dist/` | N/A | 0 | N/A | Not used |
| `out/` | N/A | 0 | N/A | Not used (static export) |

**Total on disk:** ~640 MB (node_modules dominates)

---

## Top 20 Largest Files (excl. node_modules/.next/.git)

| Size | File | Notes |
|------|------|-------|
| 273 KB | `public/assets/zafiro/avatars/eliana-modulos-destino-poster.webp` | Hero image |
| 271 KB | `public/assets/zafiro/avatars/eliana-origen-panel-de-modulos.webp` | Hero image |
| 257 KB | `public/assets/zafiro/branding/zafiro-eliana-protegidas-por-el-senor.webp` | Brand image |
| 234 KB | `public/assets/zafiro/avatars/eliana-zafiro-destino-gema-telefono.webp` | Hero image |
| 214 KB | `public/assets/zafiro/avatars/eliana-origen-modulos-superiores.webp` | Hero image |
| 210 KB | `public/assets/zafiro/avatars/eliana-modulos-zafiro-destino.webp` | Hero image |
| 198 KB | `public/assets/zafiro/conceptos/incubadora-del-futuro-angel-gema.webp` | Concept |
| 193 KB | `public/assets/zafiro/avatars/eliana-interfaz-manos-telefono.webp` | Hero image |
| 180 KB | `public/assets/zafiro/avatars/eliana-ascension-red-de-nodos.webp` | Hero image |
| 163 KB | `public/assets/zafiro/avatars/eliana-gema-telefono-holografico.webp` | Avatar |
| 161 KB | `public/assets/zafiro/conceptos/zafiro-dashboard-desktop-concept.webp` | Concept |
| 158 KB | `public/assets/zafiro/conceptos/zafiro-dashboard-mobile-concept.webp` | Concept |
| 148 KB | `public/assets/zafiro/storyboards/eliana-awakening-storyboard.webp` | Storyboard |
| 104 KB | `public/assets/zafiro/branding/zafiro-gema-azul-fondo-oscuro.webp` | Brand |
| 41 KB | `public/assets/zafiro/branding/zafiro-logo-gema-geometria-sagrada.webp` | Logo |

**Total image size:** ~2.6 MB (15 WebP files)

---

## Source Code Stats

| Metric | Count |
|--------|-------|
| **Total `.ts`/`.tsx` files** | ~164 |
| **Page files (`page.tsx`)** | 76 |
| **API routes** | 4 |
| **Components** | ~15 |
| **Library modules** | ~30 |
| **Migration SQL files** | 2 |
| **Documentation files** | 50 |
| **Monorepo packages** | 13 (12 unused) |

---

## Dependency Weight Analysis

| Package | Size | Used by | Notes |
|---------|------|---------|-------|
| `next` | ~120 MB | All pages | Framework; optimized |
| `react` + `react-dom` | ~15 MB | All pages | Implicit via JSX |
| `lucide-react` | ~5 MB | 93 files | Icons; only used icons included in bundle |
| `motion` (framer-motion) | ~10 MB | 44 files | Animations; 2/3 may be unused |
| `three` | ~50 MB | 1 file | GalaxiaInfinita.tsx only |
| `@react-three/fiber` | ~15 MB | 2 files | Heavy; dynamic import |
| `@react-three/drei` | ~20 MB | 2 files | Heavy; dynamic import |
| `@react-three/postprocessing` | ~5 MB | 1 file | Effects; dynamic import |
| `@supabase/ssr` + `supabase-js` | ~8 MB | 5 files | Auth; unused (no credentials) |
| `tailwindcss` + `postcss` | ~15 MB | Dev tool | Compiles to CSS |
| `typescript` | ~60 MB | Dev tool | Type checking |
| `eslint` + config | ~10 MB | Dev tool | Linting |

**Note:** three.js ecosystem (~90 MB) only used by 2 pages (Galaxia, HoloCinema) via dynamic import. If removed, saves ~15% of node_modules.

---

## Unused / Redundant Assets (Removed)

| Item | Size | Action |
|------|------|--------|
| `public/next.svg` | 1.34 KB | ❌ Removed |
| `public/globe.svg` | 1.01 KB | ❌ Removed |
| `public/window.svg` | 0.38 KB | ❌ Removed |
| `public/vercel.svg` | 0.13 KB | ❌ Removed |
| `public/file.svg` | 0.38 KB | ❌ Removed |
| `public/assets/zafiro/originales/` | 3.5 MB | ❌ Removed (14 JPG files) |
| `backups/` | ~5 MB | ❌ Removed |
| `.backup-vercel/` | ~1 MB | ❌ Removed |
| `.server-log.txt` | ~50 KB | ❌ Removed |
| `.next/` (cache) | ~40 MB | ❌ Removed (regenerates) |

**Total reclaimed:** ~50 MB

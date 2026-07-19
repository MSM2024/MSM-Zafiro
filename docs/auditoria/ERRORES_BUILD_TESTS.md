# Documento 9 — Errores de Build y Tests

**Repositorio**: `https://github.com/MSM2024/MSM-Zafiro.git`
**Rama**: `main` · **Commit**: `278b81c`
**Fecha**: 2026-07-18
**Alcance**: Build, lint, TypeScript, tests, problemas conocidos

---

## Resumen

| Categoría | Estado | Detalle |
|-----------|--------|---------|
| Build | ✅ OK | 129 rutas, 0 errores, ~35s |
| Lint | ⚠️ 3 errores, ~50 warnings | `require()` en CJS, variables sin uso |
| TypeScript | ✅ OK | Strict mode, 0 errores (tests excluidos) |
| Tests | ❌ INOPERATIVO | 0 ejecutables, 5 archivos importan paquetes eliminados |

---

## 1. Build

**Comando**: `npm run build` (Next.js)
**Resultado**: Compila exitosamente con 129 rutas generadas.

**Detalle de rutas generadas**:
- App routes (SPA): `/`, `/auth/*`, `/mi-perfil/*`, `/vip/*`, `/kyc/*`, `/emprendedor/*`
- Sellos: `/sellos`, `/sellos/[numero]`, `/sellos/aleatorio`, `/sellos/hoy`, `/sellos/favoritos`, `/sellos/diario`
- Admin: `/admin`, `/admin/usuarios`, `/admin/vip`, `/admin/kyc`, `/admin/kyb`, `/admin/riesgos`, `/admin/auditoria`, `/admin/cripto`, `/admin/knowledge-import`, `/admin/tasas`, `/admin/bpa`, `/admin/logistica`, `/admin/ratings`
- API routes: 19 endpoints (`/api/eliana/*`, `/api/stripe/*`, `/api/owner/devices/*`, `/api/whatsapp/webhook`, `/api/sync`, `/api/chat`, `/api/economia/cierre`, `/api/profiles/create`, `/api/legal/*`)
- Extras: `/about`, `/what-we-do`, `/how-it-works`, `/eliana`, `/ecosystem`, `/vision`, `/mission`, `/values`, `/help`, `/terms`, `/privacy`, `/rules`, `/universo`, `/galaxia`, `/holo-cinema`, `/dashboard`, `/economia`, `/trading`, `/constitucion`, `/impacto`, `/imperio`, `/familia/*`

**Duración**: ~35 segundos

**Sin errores de build**. Compila limpio.

---

## 2. Lint

**Comando**: `next lint` / ESLint
**Configuración**: `next.config.ts` (sin overrides custom)

### Errores (3)

**Archivo**: `scripts/validate-assets.cjs`

| Línea | Regla | Mensaje |
|-------|-------|---------|
| ~5 | `@typescript-eslint/no-require-imports` | `require('fs')` — CommonJS en proyecto ESM |
| ~12 | `@typescript-eslint/no-require-imports` | `require('path')` |
| ~20 | `@typescript-eslint/no-require-imports` | `require('sharp')` o similar |

**Causa**: Archivo `.cjs` que usa `require()` — ESLint lo trata como TypeScript por configuración de extends.

### Warnings (~50)

**Principales categorías**:

| Archivo | Warnings | Tipo |
|---------|----------|------|
| `src/lib/eliana/process-message.ts` | 5 | Unused imports/vars |
| `src/app/about/page.tsx` | 2 | Unused imports |
| `src/app/admin/auditoria/page.tsx` | 2 | Unused imports |
| `src/lib/angel-security.ts` | 1 | `any` type (línea 341: `profile: any`) |
| Múltiples archivos admin | ~10 | `no-unused-vars` |
| Múltiples archivos | ~30 | Mixed warnings |

**Detalle de `src/lib/eliana/process-message.ts`**:
- Importaciones no utilizadas de módulos internos
- Variables declaradas pero no referenciadas
- Estos warnings no impiden el build pero indican código muerto

---

## 3. TypeScript

**Configuración**: `tsconfig.json` con `strict: true`
**Resultado**: 0 errores TypeScript

**Exclusión de tests**: El directorio `tests/` está excluido del chequeo TypeScript — si no lo estuviera, los imports de paquetes eliminados generarían errores TS.

---

## 4. Tests — Estado Inoperativo

### Archivos encontrados

| Archivo | Importa paquete | Estado del paquete |
|---------|----------------|-------------------|
| `tests/adaptive-router.test.ts` | `../packages/adaptive-router/src/adaptive-router.ts` | ❌ Eliminado |
| `tests/digital-twin.test.ts` | `../packages/digital-twin/src/digital-twin.ts` y `../packages/digital-twin/src/node-model.ts` | ❌ Eliminado |
| `tests/portable-eliana.test.ts` | `../packages/portable-eliana/...` | ❌ Eliminado |
| `tests/sync-queue.test.ts` | `../packages/sync-queue/...` | ❌ Eliminado |
| `tests/package.json` | — | Sin configuración de runner |

### Configuración de test runner

**Archivo**: `tests/package.json` — Existe pero no contiene scripts de test, dependencias de test, ni configuración de jest/vitest.

**package.json raíz**: No tiene script `"test"` configurado.

**CI/CD**: Sin configuración de GitHub Actions, no hay pipeline de tests.

### Contenido de los test files

**`tests/adaptive-router.test.ts`** (38 líneas):
```typescript
import { AdaptiveRouter } from "../packages/adaptive-router/src/adaptive-router.ts"
// Test framework custom (no jest/vitest)
function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✅ ${name}`) }
  catch (e) { console.log(`  ❌ ${name}: ${e}`) }
}
```

- Usa framework de testing custom (no jest/vitest/mocha)
- 3 tests: `scoreChannels`, `bestChannel`, `each channel has required fields`
- El paquete `adaptive-router` fue eliminado en limpieza de monorepo

**`tests/digital-twin.test.ts`** (55 líneas):
```typescript
import { DigitalTwin } from "../packages/digital-twin/src/digital-twin.ts"
import { createNode } from "../packages/digital-twin/src/node-model.ts"
```

- 5 tests: register, list, relate, heartbeat, stale detection, export
- Paquete `digital-twin` eliminado

### Problema raíz

Los tests fueron escritos para un monorepo de 13 packages. Cuando se limpiaron 10+ packages muertos, los tests quedaron huérfanos. No se actualizó la infraestructura de testing.

---

## 5. Problemas Conocidos Adicionales

### 5.1 localStorage en Server-Side Rendering

**Archivo**: `src/lib/auth.ts:1` — `'use client'` pero funciones como `getSession()` son llamadas desde server-side codepaths.

```typescript
// auth.ts:99 — Retorna null siempre en server
if (typeof window === "undefined") return null
```

**Efecto**: Cualquier componente que intente leer la sesión en server-side (SSR, generateMetadata, etc.) obtiene `null`. No es un error de build pero causa comportamiento inesperado.

### 5.2 Rate Limiting In-Memory

**Archivo**: `src/lib/angel-security.ts:249`

```typescript
const rateLimitStore = new Map<string, RateLimitEntry>()
```

**Comentario en el código** (líneas 245-247):
```
// ADVERTENCIA: En Vercel serverless, cada invocación tiene un Map fresco.
// Para rate limiting real en producción, migrar a Upstash/Redis.
// Esta implementación funciona correctamente solo en entornos con memoria persistente.
```

En Vercel, cada request puede ejecutarse en una instancia diferente. El Map se reinicia.

### 5.3 `any` Types en Código Crítico

**Archivo**: `src/lib/angel-security.ts:341`

```typescript
export function validateSession(): { valid: boolean; profile: any; role: UserRole | null } {
```

El tipo `any` en `profile` deshabilita el type checking para toda la cadena de autenticación.

### 5.4 Imports Circulares Potenciales

`auth.ts` importa de `profile.ts`, `referidos.ts`, `supabase.ts`, `email-service.ts`. Cualquier cambio en estos módulos puede causar problemas de circular dependency.

---

## 6. Resumen de Acciones Necesarias

| Prioridad | Acción | Archivos |
|-----------|--------|----------|
| ALTO | Eliminar 4 test files huérfanos o recrear tests con paquetes actuales | `tests/*.test.ts` |
| ALTO | Configurar test runner (vitest recomendado) | `package.json`, `vitest.config.ts` |
| MEDIO | Corregir 3 errores lint en `validate-assets.cjs` | `scripts/validate-assets.cjs` |
| MEDIO | Limpiar ~50 unused imports/vars warnings | Múltiples archivos |
| MEDIO | Agregar script `"test"` a `package.json` | `package.json` |
| BAJO | Eliminar `any` de `validateSession()` return type | `src/lib/angel-security.ts:341` |
| BAJO | Configurar CI pipeline con lint + build + tests | `.github/workflows/` |

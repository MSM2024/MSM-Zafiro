# DUPLICATES REPORT — ZAFIRO

## 1. ELIANA — DOS IMPLEMENTACIONES

| Aspecto | src/lib/eliana/ | packages/eliana/ |
|---------|----------------|-----------------|
| Ubicación | `src/lib/eliana/engine.ts` (12KB) | `packages/eliana/src/process-message.ts` (3KB) |
| Archivos | 6 (engine, types, analysis, knowledge, memory, recommendations) | 1 (process-message) |
| Estado | PARCIAL — engine.ts tiene lógica de intención, pero analysis/recommendations son esqueletos | PARCIAL — solo processMessage exportado |
| Acción | Migrar lógica de engine.ts → packages/eliana/, retirar src/lib/eliana/ |

## 2. FRECUENCIA ORIGEN — TRES VERSIONES

| Archivo | Estado |
|---------|--------|
| `src/lib/frecuencia-origen.config.ts` | FUNCIONAL — Nudo Único, 7 Guardianes, reglas |
| `src/lib/FrequencyOriginService.ts` | PARCIAL — clase base con offlineGuardar() |
| `packages/frequency-origin/src/frequency-origin.config.ts` | FUNCIONAL — FREQUENCY_ORIGIN unificada |
| Acción | Unificar en packages/frequency-origin/, eliminar src/lib/ versiones |

## 3. WHATSAPP — TRES ARCHIVOS DISPERSOS

| Archivo | Estado |
|---------|--------|
| `src/lib/whatsapp-client.ts` | FUNCIONAL — cliente API WhatsApp Cloud |
| `packages/whatsapp/src/eliana-visual-writer.ts` | FUNCIONAL — formato visual |
| `src/app/api/whatsapp/webhook/route.ts` | FUNCIONAL — webhook endpoint |
| Acción | Mover whatsapp-client.ts a packages/whatsapp/, consolidar |

## 4. TIPOS DE USUARIO — DOS DEFINICIONES

| Archivo | Tipo | Campos |
|---------|------|--------|
| `src/lib/auth.ts` | AuthUser, Profile | id, email, role, username, avatar_url, full_name |
| `packages/types/src/zafiro.ts` | ZafiroUser | id, email, role, username |
| Acción | Extender ZafiroUser con todos los campos, eliminar AuthUser |

## 5. ECOSISTEMA VS UNIVERSO

| Archivo | Estado |
|---------|--------|
| `src/lib/ecosistema.ts` | SIMULADO — 3 funciones, datos mock |
| `src/lib/universo.ts` | FUNCIONAL — getConnections, addConnection, removeConnection |
| Acción | Retirar ecosistema.ts, universo.ts es el fuente de verdad |

## 6. GEMOLOGÍA — DOS ARCHIVOS

| Archivo | Estado |
|---------|--------|
| `src/lib/gemology-data.ts` | FUNCIONAL — 35 gemas con propiedades |
| `src/lib/gemology-types.ts` | PARCIAL — tipos de gemas |
| Acción | Fusionar tipos en gemology-data.ts |

## 7. MANIFEST — DOS ARCHIVOS

| Archivo | Referenciado por |
|---------|-----------------|
| `public/manifest.json` | layout.tsx (actual) |
| `public/manifest.webmanifest` | layout.tsx (nuevo, después del commit) |
| Acción | layout.tsx apunta a manifest.webmanifest, retirar manifest.json |

## 8. ECONOMÍA — CUATRO ARCHIVOS DISPERSOS

| Archivo | Estado |
|---------|--------|
| `src/lib/economia-v109.config.ts` | FUNCIONAL — config económica |
| `src/lib/EconomiaService.ts` | FUNCIONAL — orquestador |
| `src/components/EconomiaPanel.tsx` | FUNCIONAL — UI |
| `src/app/api/economia/cierre/route.ts` | FUNCIONAL — API |
| Acción | Mover servicios a packages/economy/, mantener UI en src/ |

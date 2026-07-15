# UNUSED CODE REPORT — ZAFIRO

## Código Muerto Confirmado

| Archivo | Razón | Líneas |
|---------|-------|--------|
| `src/lib/eliana/analysis.ts` | No importado por ningún archivo | ~50 |
| `src/lib/eliana/recommendations.ts` | No importado por ningún archivo | ~50 |
| `src/lib/eliana/knowledge.ts` | Reemplazado por packages/eliana/ | ~80 |
| `src/lib/eliana/memory.ts` | Reemplazado por packages/eliana/ | ~60 |
| `src/lib/ecosistema.ts` | Reemplazado por src/lib/universo.ts | ~30 |
| `public/manifest.json` | Reemplazado por manifest.webmanifest | ~15 |

## Código Potencialmente No Usado

| Archivo | Razón |
|---------|-------|
| `packages/eliana/src/process-message.ts` | Importado solo por webhook route, que es server-side |
| `packages/whatsapp/src/eliana-visual-writer.ts` | Exportado pero no importado por src/ |
| `packages/mesh-bridge/src/mesh-bridge.ts` | Exportado pero no usado en src/ |
| `packages/digital-twin/src/digital-twin.ts` | Exportado pero no usado en src/ |
| `packages/adaptive-router/src/adaptive-router.ts` | Exportado pero no usado en src/ |
| `packages/portable-eliana/src/package-export.ts` | Exportado pero no usado en src/ |

## Dependencias No Usadas
| Paquete | ¿Se usa? |
|---------|---------|
| zod | No importado en ningún archivo src/ o packages/ |
| zod-validation-error | No importado |

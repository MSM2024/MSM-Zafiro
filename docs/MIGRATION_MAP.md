# MIGRATION MAP — Consolidación ZAFIRO

| Origen | Destino | Acción | Reversible |
|--------|---------|--------|------------|
| `src/lib/eliana/engine.ts` | `packages/eliana/src/engine.ts` | MOVER + actualizar imports | Sí |
| `src/lib/eliana/types.ts` | `packages/eliana/src/types.ts` | MOVER | Sí |
| `src/lib/eliana/memory.ts` | `packages/eliana/src/memory.ts` | MOVER | Sí |
| `src/lib/eliana/knowledge.ts` | `packages/eliana/src/knowledge.ts` | MOVER | Sí |
| `src/lib/eliana/analysis.ts` | — | RETIRAR (código muerto) | N/A |
| `src/lib/eliana/recommendations.ts` | — | RETIRAR (código muerto) | N/A |
| `src/lib/frecuencia-origen.config.ts` | `packages/frequency-origin/src/` | FUSIONAR con config existente | Sí |
| `src/lib/FrequencyOriginService.ts` | `packages/frequency-origin/src/` | MOVER | Sí |
| `src/lib/economia-v109.config.ts` | `packages/economy/src/` | MOVER | Sí |
| `src/lib/EconomiaService.ts` | `packages/economy/src/` | MOVER | Sí |
| `src/lib/auth.ts` (tipos) | `packages/types/src/zafiro.ts` | FUSIONAR ZafiroUser | Sí |
| `src/lib/whatsapp-client.ts` | `packages/whatsapp/src/` | MOVER | Sí |
| `src/lib/ecosistema.ts` | — | RETIRAR | N/A |
| `public/manifest.json` | — | RETIRAR | N/A |
| `src/lib/gemology-types.ts` | `src/lib/gemology-data.ts` | FUSIONAR | Sí |

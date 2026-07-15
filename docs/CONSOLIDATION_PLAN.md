# CONSOLIDATION PLAN — ZAFIRO

## Fase 1: Tipos Compartidos
Mover todos los tipos a `packages/types/`, eliminar AuthUser local, unificar ZafiroUser.
- Archivos: src/lib/auth.ts (tipos), src/lib/profile.ts (tipos), packages/types/src/zafiro.ts
- Riesgo: BAJO — solo cambios de import

## Fase 2: Configuración Central
Unificar frecuencia-origen, economía-v109, y configuraciones en `packages/config/`.
- Archivos: src/lib/frecuencia-origen.config.ts, src/lib/economia-v109.config.ts, packages/frequency-origin/
- Riesgo: BAJO — son datos, no lógica

## Fase 3: Autenticación
Mover src/lib/auth.ts + src/lib/supabase.ts + src/proxy.ts a `packages/auth/`.
- Riesgo: MEDIO — middleware y proxy dependen de rutas absolutas

## Fase 4: ELIANA
Fusionar src/lib/eliana/ con packages/eliana/.
- Archivos: engine.ts (lógica de intención), types.ts (tipos), memory.ts, knowledge.ts
- Riesgo: MEDIO — engine.ts tiene lógica de negocio activa

## Fase 5: Economía
Crear `packages/economy/` con EconomiaService + economía-v109.config.
- Mantener EconomiaPanel.tsx en src/components/ (solo UI)
- Riesgo: BAJO — los datos persisten en localStorage

## Fase 6: WhatsApp
Mover whatsapp-client.ts a packages/whatsapp/.
- Mantener webhook route en src/app/api/ (es ruta Next.js)
- Riesgo: BAJO — solo mover import

## Fase 7: Event Bus
Consolidar packages/events/ como único bus.
- Verificar que src/lib/EconomiaService.ts use ZafiroEventBus
- Riesgo: BAJO

## Fase 8: Offline + Sync
Consolidar packages/offline/ + packages/sync/.
- OfflineOperation → operaciones pendientes
- SyncQueue → cola con backoff
- Riesgo: BAJO

## Fase 9: Limpieza
- Retirar src/lib/ecosistema.ts (reemplazado por universo.ts)
- Retirar public/manifest.json (reemplazado por manifest.webmanifest)
- Retirar src/lib/eliana/analysis.ts, recommendations.ts, knowledge.ts (código muerto)
- Fusionar src/lib/gemology-types.ts en gemology-data.ts
- Riesgo: BAJO

## Fase 10: Documentación + Tests
- Actualizar README.md con nueva estructura
- Agregar tests de integración para los módulos consolidados
- Riesgo: NINGUNO

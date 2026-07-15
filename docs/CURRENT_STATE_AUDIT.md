# CURRENT STATE AUDIT — ZAFIRO

**Fecha:** 15 Julio 2026
**Rama:** `integration/msm-master-molecule`
**Commit:** `913e061`
**Tag:** `release-zafiro-msm-economia-beta`

---

## Resumen

| Estado | Cantidad |
|--------|----------|
| ✅ IMPLEMENTADO | 12 |
| ⚠️ PARCIAL | 8 |
| 🟡 SIMULADO | 4 |
| 📝 DOCUMENTADO | 3 |
| 🔬 INVESTIGACIÓN | 5 |
| ❌ NO INICIADO | 20 |

---

## 1. Frecuencia Origen

| Componente | Estado | Archivo |
|------------|--------|---------|
| Config Nudo Único | ✅ | `src/lib/frecuencia-origen.config.ts` |
| FrequencyOriginService | ✅ | `src/lib/FrequencyOriginService.ts` |
| Economia V1.0.9 | ✅ | `src/lib/economia-v109.config.ts` |
| EconomiaService | ✅ | `src/lib/EconomiaService.ts` |
| Paquete central (`packages/frequency-origin/`) | ❌ | No existe monorepo |
| FREQUENCY_ORIGIN config unificada | ⚠️ | Existe pero en `src/lib/` no en `packages/` |

## 2. Tipos Centrales

| Componente | Estado | Archivo |
|------------|--------|---------|
| ZafiroSystemStatus | ⚠️ | No existe tipo unificado |
| ZafiroUser/Role | ✅ | `src/lib/auth.ts` (getUserRole) |
| GuardianState | ⚠️ | Definido en config pero no como tipo |
| Paquete `packages/types/` | ❌ | No existe |

## 3. Guardianes

| Componente | Estado | Archivo |
|------------|--------|---------|
| 7 Guardianes definidos | ✅ | `src/lib/frecuencia-origen.config.ts` |
| GuardianRegistry | ❌ | No existe |
| Guardian visual components | ❌ | No existen |

## 4. Supabase / Base de Datos

| Componente | Estado | Archivo |
|------------|--------|---------|
| Auth (browser) | ✅ | `src/lib/supabase.ts` |
| Auth (server) | ✅ | `src/lib/supabase-server.ts` |
| Proxy middleware | ✅ | `src/proxy.ts` |
| Roles (OWNER/CASHIER/VIEWER) | ✅ | `src/lib/auth.ts` |
| Migración 00001 (auth+profiles) | ✅ | `supabase/migrations/00001_auth_roles_profiles.sql` |
| Migración 00002 (economia) | ✅ | `supabase/migrations/00002_economia_schema.sql` |
| Tablas frequency_origin | ❌ | No existen en SQL |
| Tablas guardian_actions | ✅ | En migración 00002 |
| Tablas conversation_state | ❌ | No existe |
| Tablas pending_operations | ❌ | No existe |
| RLS policies | ⚠️ | Existen en 00001/00002, faltan para nuevas tablas |

## 5. Event Bus

| Componente | Estado | Archivo |
|------------|--------|---------|
| ZafiroEventType | ❌ | No existe |
| ZafiroEventBus | ❌ | No existe |
| Event types list | ❌ | No existe |

## 6. ELIANA

| Componente | Estado | Archivo |
|------------|--------|---------|
| ELIANA page | ✅ | `src/app/eliana/page.tsx` |
| ElianaDiamond component | ✅ | `src/components/ElianaDiamond.tsx` |
| ElianaFloatingButton | ✅ | `src/components/ElianaFloatingButton.tsx` |
| ElianaVisualWriter | ❌ | No existe |
| processMessage orchestrator | ❌ | No existe |
| Intent classification | ❌ | No existe |
| Conversation state | ❌ | No existe |

## 7. WhatsApp Business

| Componente | Estado | Archivo |
|------------|--------|---------|
| WhatsApp webhook | ❌ | No existe |
| ElianaVisualWriter | ❌ | No existe |
| Meta signature verification | ❌ | No existe |
| +53 number handling | ❌ | No existe |
| WhatsApp env vars | ❌ | No configuradas |

## 8. Offline Core

| Componente | Estado | Archivo |
|------------|--------|---------|
| localStorage persistence | ✅ | Múltiples keys zafiro_* |
| OfflineQueue | ⚠️ | `EconomiaService.offlineCore.guardar()` |
| IndexedDB database | ❌ | No existe |
| Pending operations table | ❌ | No existe en frontend |
| OfflineOperation types | ❌ | No existen |

## 9. Sync Engine

| Componente | Estado | Archivo |
|------------|--------|---------|
| Sync queue | ❌ | No existe |
| Retry with backoff | ❌ | No existe |
| Idempotency | ✅ | `idempotency_key` en rewards_log |

## 10. MSM Economía

| Componente | Estado | Archivo |
|------------|--------|---------|
| Config V1.0.9 | ✅ | `src/lib/economia-v109.config.ts` |
| EconomiaService | ✅ | `src/lib/EconomiaService.ts` |
| SQL tables | ✅ | `supabase/migrations/00002_economia_schema.sql` |
| Caja CUP/USD | ✅ | Tabla `economia_caja` |
| Inventario | ✅ | Tabla `economia_inventario` |
| Ventas flow | ⚠️ | Service creado, UI pendiente |
| Cancelaciones | ⚠️ | Estados definidos, lógica pendiente |
| Cierre diario | ❌ | No implementado |
| Dashboard financial | ✅ | Ruta `/dashboard` |

## 11. PWA

| Componente | Estado | Archivo |
|------------|--------|---------|
| manifest.webmanifest | ❌ | 404 en producción |
| service-worker.js | ❌ | 404 en producción |
| Icon 192x192 | ❌ | No existe |
| Icon 512x512 | ❌ | No existe |
| offline page | ❌ | No existe |
| Install prompt | ❌ | No configurado |

## 12. Modo Éter

| Componente | Estado | Archivo |
|------------|--------|---------|
| EtherMode component | ❌ | No existe |
| Visual states | ❌ | No existen |

## 13. Avatar ELIANA

| Componente | Estado | Archivo |
|------------|--------|---------|
| ElianaAvatar | ❌ | No existe |
| ZafiroCore | ❌ | No existe |
| GuardianRing | ❌ | No existe |
| VoiceActivation | ❌ | No existe |

## 14. Adaptive Router

| Componente | Estado | Archivo |
|------------|--------|---------|
| Channel selection | ❌ | No existe |
| Score algorithm | ❌ | No existe |

## 15. Mesh Bridge

| Componente | Estado | Archivo |
|------------|--------|---------|
| Investigation | 🔬 | No iniciado |
| Prototype | 🔬 | No iniciado |

## 16. Digital Twin

| Componente | Estado | Archivo |
|------------|--------|---------|
| Node model | 🔬 | No iniciado |

## 17. Paquete Portable

| Componente | Estado | Archivo |
|------------|--------|---------|
| ELIANA export JSON | ❌ | No existe |

## 18. Seguridad

| Componente | Estado | Archivo |
|------------|--------|---------|
| Supabase Auth | ✅ | `src/lib/auth.ts` |
| RBAC | ✅ | En proxy + auth |
| RLS | ✅ | En migraciones SQL |
| Sanitización XSS | ✅ | `renderSafeMessage()` |
| Auditoría | ✅ | `audit_logs` + `guardian_actions` |
| Rate limiting | ❌ | No implementado |
| CSP headers | ❌ | No configurado |

## 19. Documentación

| Documento | Estado |
|-----------|--------|
| README.md | ❌ | No existe |
| CURRENT_STATE_AUDIT.md | ✅ | Este documento |
| ROADMAP_ZAFIRO_9_VERSIONS.md | ❌ | No existe |
| TARGET_ARCHITECTURE.md | ❌ | No existe |
| SECURITY_MODEL.md | ❌ | No existe |
| DEPLOYMENT_GUIDE.md | ❌ | No existe |
| CHANGELOG.md | ❌ | No existe |

## 20. Pruebas

| Tipo | Estado |
|------|--------|
| Unit tests | ❌ | No existen |
| Integration tests | ❌ | No existen |
| E2E tests | ❌ | No existen |
| Route tests | ⚠️ | Manual (verificado 33 rutas 200 OK) |
| Build test | ✅ | 0 errores, 0 warnings |

---

## Resumen de Riesgos

1. **No hay PWA** — la app no es instalable, no funciona offline real
2. **No hay WhatsApp Business** — canal +53 no integrado
3. **No hay tests automatizados** — sin red de seguridad
4. **No hay documentación** — README, arquitectura, despliegue faltan
5. **Monorepo no existe** — todo en `src/` plano, sin `packages/`
6. **No hay Sync Engine** — operaciones offline no se sincronizan automáticamente
7. **Supabase no configurado** — todo en localStorage, migración pendiente
8. **Vulnerabilidad moderate** en postcss (vía next)

---

## Prioridad de Implementación

| Prioridad | Fase | Tiempo estimado |
|-----------|------|----------------|
| 🔴 Alta | F1 — Frecuencia Origen + Tipos | 2h |
| 🔴 Alta | F2 — Supabase + RLS + Event Bus | 3h |
| 🔴 Alta | F3 — ELIANA + WhatsApp | 4h |
| 🟡 Media | F4 — Offline Core + Sync | 3h |
| 🟡 Media | F5 — MSM Economía UI | 3h |
| 🟡 Media | F6 — PWA + Modo Éter + Avatar | 3h |
| 🟢 Baja | F7 — Adaptive Router + Mesh | 5h |
| 🟢 Baja | F8 — Pruebas + Documentación | 4h |
| 🟢 Baja | F9 — Despliegue | 1h |

**Total estimado:** 28h

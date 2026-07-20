# Plan de Ejecución — MSM Ecosystem

**Basado en:** ORDEN_MAESTRA.md
**Inicio:** 2026-07-20
**Actualizado:** 2026-07-20
**Build:** 0 errores, 173 rutas

---

## Fase 0 — Auditoría y Protección (COMPLETADA)

- [x] Inspección completa del repositorio
- [x] TypeScript: 0 errores
- [x] Seguridad: OTP codes eliminados, verification code generado dinámicamente
- [x] Middleware: proxy.ts funcional con route protection
- [x] AI synthesis: corregida (era fire-and-forget)
- [x] Dynamic requires: reemplazados con static imports
- [x] SVGs no usados eliminados de public/
- [x] Docs: AUDITORIA_INICIAL.md, ARQUITECTURA_ACTUAL.md, PLAN_DE_EJECUCION.md, ZAFIRO_IMAGE_AUDIT.md

## Fase 1 — ZAFIRO Social (COMPLETADA)

### 1.1 Auth
- [x] Login/Register funcional (localStorage)
- [x] Session persistence
- [x] Hardcoded OTP codes eliminados
- [ ] Supabase auth real (bloqueado: sin credenciales)

### 1.2 Perfil (UNIFICADO)
- [x] V1 y V2 unificados en `/profile-page`
- [x] `/mi-perfil` y `/zafiro/perfil` redirigen a `/profile-page`
- [x] Seguidores/seguidos funcional (`lib/social.ts`)
- [x] Bloquear/reportar usuario

### 1.3 Feed
- [x] Publicaciones con texto
- [x] Reacciones (likes) y comentarios
- [x] Paginación y estados vacíos
- [x] Reportar publicaciones

### 1.4 Preguntas y Respuestas
- [x] Crear pregunta, responder, votar
- [x] Tags y búsqueda
- [x] Rutas `/preguntas` y `/preguntas/[questionId]`

### 1.5 Círculos
- [x] Crear círculo (público/privado)
- [x] Unirse/salir con invites para privados
- [x] Moderadores
- [x] Rutas `/circulos` y `/circulos/[circleId]`

### 1.6 Mensajería
- [x] Chat entre usuarios
- [x] Conversaciones con read/unread
- [x] Ruta `/messages`
- [ ] Notificaciones push reales

### 1.7 Notificaciones
- [x] Cross-pillar notification engine
- [x] Notification bell en ZafiroShell
- [x] Auto-notificaciones 5 pilares
- [x] BroadcastChannel cross-tab sync

### 1.8 Moderación
- [x] Reportes en feed
- [x] Bloqueos/suspensiones en social.ts
- [x] Historial admin (adminActions)

## Fase 2 — ELIANA IA (COMPLETADA)

- [x] Chat funcional (response-router con 10+ intents)
- [x] Prompt injection guard
- [x] RAG engine (localStorage)
- [x] Multi-provider AI (6 proveedores)
- [x] AI synthesis corregida
- [ ] RAG con datos reales (requiere Supabase)

## Fase 3 — MSM Marketplace (COMPLETADA)

- [x] Catálogo de productos (10+ seed)
- [x] Carrito de compras
- [x] Checkout con selección de pago
- [x] Órdenes con 7 estados
- [x] Admin CRUD productos y órdenes
- [x] Variantes de producto (precio/stock por opción)
- [x] Comercios (registro, verificación 1-click, perfil público)
- [x] Panel de vendedor (`/marketplace/vendor`)
- [x] Evidencias de entrega (foto + nota)
- [x] Reviews en tiendas
- [x] Admin tab "Comercios"
- [ ] Stripe integration real (bloqueado: sin keys)

## Fase 4 — Offline-First (EN CURSO)

- [x] Operation queue (`lib/offline-queue.ts`)
- [x] Queue states: local → pending → syncing → confirmed → failed
- [x] Retry with backoff, max retries, conflict strategies
- [x] Sync engine (`lib/sync-engine.ts`) con handler registry
- [x] Admin sync panel (`/admin/sync`)
- [x] SyncStatusIndicator (floating badge global)
- [x] Integración en marketplace (orders → enqueue + handler)
- [ ] Integración en feed (posts → enqueue)
- [ ] Integración en mensajería (messages → enqueue)

## Fase 5 — MSM Mesh, Points, Coin (PENDIENTE)

- [ ] Crear repositorio independiente `msm-mesh-android`
- [ ] Android Studio + Kotlin + Jetpack Compose
- [ ] Bluetooth/Wi-Fi Direct discovery
- [ ] Secure connection + sync
- [ ] Gateway mode
- [ ] MSM Points (recompensas)
- [ ] MSM Coin (interfaces only, desactivado)

---

## Hitos

| Día | Meta | Estado |
|-----|------|--------|
| 1 | Fase 0 (auditoría, seguridad, build) | ✅ Completa |
| 1-2 | Fase 1 (auth, perfil unificado, feed, QA, círculos, mensajería) | ✅ Completa |
| 2-3 | Fase 2 (ELIANA robusta con RAG, multi-provider) | ✅ Completa |
| 3-4 | Fase 3 (Marketplace con comercios, variantes, vendor panel) | ✅ Completa |
| 4-5 | Fase 4 (offline queue, sync engine, admin panel) | 🔄 En curso |
| 6-7 | Deploy beta + fixes finales | ⏳ Pendiente |

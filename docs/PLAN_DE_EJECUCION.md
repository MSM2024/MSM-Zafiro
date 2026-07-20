# Plan de Ejecución — MSM Ecosystem

**Basado en:** ORDEN_MAESTRA.md
**Inicio:** 2026-07-20
**Objetivo:** Todo funcional en 1 semana

---

## Fase 0 — Auditoría y Protección (COMPLETADA)

- [x] Inspección completa del repositorio
- [x] Identificación de framework, lenguaje, DB, auth, APIs, rutas
- [x] Build: 0 errores, 167 rutas
- [x] TypeScript: 0 errores
- [x] Seguridad: OTP codes eliminados, verification code generado dinámicamente
- [x] Middleware: proxy.ts funcional con route protection
- [x] AI synthesis: corregida (era fire-and-forget)
- [x] Dynamic requires: reemplazados con static imports
- [x] Docs: AUDITORIA_INICIAL.md, ARQUITECTURA_ACTUAL.md, PLAN_DE_EJECUCION.md
- [ ] DECISIONES_TECNICAS.md (pendiente)
- [ ] CHANGELOG.md (pendiente)

## Fase 1 — ZAFIRO Funcional (EN CURSO)

Prioridad: máxima. ZAFIRO es la cara visible del ecosistema.

### 1.1 Auth
- [x] Login funcional (localStorage)
- [x] Register funcional
- [x] Session persistence
- [ ] Supabase auth real (bloqueado: sin credenciales)
- [ ] Rate limiting de login
- [ ] Password strength validation server-side

### 1.2 Perfil
- [x] V1 profile system (zafiro_profiles)
- [x] V2 profile system (zafiro_v2_profiles)
- [ ] Unificar V1 y V2 en un solo sistema
- [ ] Foto de perfil (file upload)
- [ ] Seguidores/seguidos funcional
- [ ] Bloquear/reportar usuario

### 1.3 Feed
- [ ] Publicaciones con texto e imágenes
- [ ] Reacciones (likes)
- [ ] Comentarios
- [ ] Paginación
- [ ] Estados vacíos

### 1.4 Preguntas y Respuestas
- [ ] Crear pregunta
- [ ] Responder
- [ ] Votar
- [ ] Tags/búsqueda

### 1.5 Círculos
- [ ] Crear círculo
- [ ] Unirse/salir
- [ ] Publicaciones internas
- [ ] Privacidad

### 1.6 Mensajería
- [x] Chat con ELIANA
- [ ] Chat entre usuarios
- [ ] Estados (enviado/entregado/leído)

### 1.7 Notificaciones
- [x] Cross-pillar notification engine
- [x] Notification bell en ZafiroShell
- [ ] Notificaciones push reales

### 1.8 Moderación
- [ ] Reportes
- [ ] Bloqueos/suspensiones
- [ ] Historial admin

## Fase 2 — ELIANA IA

- [x] Chat funcional (response-router con 10+ intents)
- [x] Prompt injection guard
- [x] RAG engine (localStorage)
- [x] Multi-provider AI (6 proveedores)
- [ ] AI synthesis ya no es fire-and-forget (✅ corregido)
- [ ] RAG con datos reales (requiere Supabase)
- [ ] Rates/limites por usuario
- [ ] Moderación de respuestas

## Fase 3 — MSM Marketplace Beta

- [x] Catálogo de productos (10 seed)
- [x] Carrito de compras
- [x] Checkout con selección de pago
- [x] Órdenes con 7 estados
- [x] Admin CRUD productos y órdenes
- [ ] Comercios (registro, verificación, perfil)
- [ ] Variantes de producto
- [ ] Evidencias de entrega
- [ ] Panel de vendedor
- [ ] Stripe integration real

## Fase 4 — Offline-First

- [ ] Operation queue
- [ ] Sync engine
- [ ] Conflict resolution
- [ ] Estados: LOCAL_ONLY → PENDING → SYNCING → CONFIRMED

## Fase 5+ — MSM Mesh, Points, Coin

- [ ] Crear repositorio independiente `msm-mesh-android`
- [ ] Android Studio + Kotlin + Jetpack Compose
- [ ] Bluetooth/Wi-Fi Direct discovery
- [ ] Secure connection + sync
- [ ] Gateway mode
- [ ] MSM Points (recompensas)
- [ ] MSM Coin (interfaces only, desactivado)

---

## Hitos Semanales

| Día | Meta |
|-----|------|
| 1-2 | Fase 0 completa + Fase 1 (auth, perfil, feed básico) |
| 3-4 | Fase 1 completa + Fase 2 (ELIANA robusta) |
| 5-6 | Fase 3 (Marketplace beta) + Fase 4 (offline-first) |
| 7 | Deploy beta + tests + documentación final |

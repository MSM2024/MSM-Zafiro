# Changelog — MSM ZAFIRO

## [1.5.0] — 2026-07-20 — Sprint Completo (5 Fases)

### Fase 5 — MSM Points + MSM Coin (NUEVO)
- `lib/rewards.ts`: 6 nuevas RewardActions (create_post, send_message, create_order, create_product, register_store) + 4 badges
- `lib/msm-coin.ts`: Wallet MSM Coin + transacciones simuladas (interfaz solamente, desactivado)
- `/rewards`: Tab PTS + tab MSM Coin con wallet display
- `ZafiroShell.tsx`: Badge PTS visible en barra superior
- Integración earnPTS en feed.ts, messages.ts, marketplace.ts, marketplace-stores.ts

### Fase 4 — Offline-First (NUEVO)
- `lib/offline-queue.ts`: Cola de operaciones offline con estados local/pending/syncing/confirmed/failed
- `lib/sync-engine.ts`: Motor de sincronización con handler registry, processQueue, retryFailed
- `components/SyncStatusIndicator.tsx`: Badge flotante global con contador y controles
- `/admin/sync`: Panel admin completo de sincronización
- `/offline`: Mejorado con estado de cola y link a admin
- `ClientLayout.tsx`: Handlers registrados para order, post, message
- Integración enqueue en feed.ts (createPost), messages.ts (sendMessage), marketplace.ts (createOrder)

### Fase 3 — Marketplace (NUEVO)
- `lib/marketplace.ts`: Variantes de producto (VariantGroup/VariantOption con precio/stock)
- `lib/marketplace-stores.ts`: Comercios con registro, verificación 1-click, reviews, delivery evidence
- `/marketplace/registrar-comercio`: Registro de tiendas
- `/marketplace/vendor`: Panel de vendedor con stats, productos, órdenes
- `/admin/marketplace`: Tab "Comercios" agregado

### Fase 1 — ZAFIRO Social (NUEVO)
- `lib/feed.ts`: Feed social con posts, likes, comments, report, paginación
- `lib/social.ts`: Following/followers/block system
- `lib/qa.ts`: Preguntas y respuestas con votación, tags, búsqueda
- `lib/circles.ts`: Círculos sociales (público/privado, moderadores, invites)
- `lib/messages.ts`: Mensajería entre usuarios con conversaciones, read/unread
- `/feed`, `/preguntas`, `/preguntas/[questionId]`, `/circulos`, `/circulos/[circleId]`, `/messages`
- Perfiles unificados: /mi-perfil y /zafiro/perfil redirigen a /profile-page

### Infraestructura
- Build: 0 errores, 173 rutas
- Git: Commits en main + beta, push automático
- Nav integrada en ZafiroUniverse.tsx (Feed, Preguntas, Círculos, Mi Perfil)
- PLAN_DE_EJECUCION.md actualizado

## [1.4.0] — 2026-07-18 — ELIANA 3D + Lock Screen + Biblioteca Viva
- ELIANA 3D flotante con drag, click, chat, keyboard accesibilidad
- ZafiroLockScreen con PIN Maestro, Modo Emergencia, Desafío Fundador
- ZafiroSplashScreen holográfico
- Biblioteca Viva: libro "De Cero a Dueño Digital" sincronizado con ELIANA
- Knowledge Data Pipeline (38 docs)
- VERCEL_TOKEN + secrets actualizados

## [1.3.0] — 2026-07-17 — Familia + Ledger Maestro + Tasas Cuba
- Nube Familiar: árbol genealógico, galería, cronología, Encuentro 2026
- Ledger Maestro 5 pasos con Firma 369-777
- Panel Tasas Cuba + BPA Mirror
- Logística de Contenedores Frecuencia 369
- Portal Génesis con deploy workflow 369

## [1.2.0] — 2026-07-16 — ELIANA Response Pipeline
- Response-router con 10+ intents y prompt injection guard
- RAG engine con localStorage
- Multi-provider AI (6 proveedores)
- WhatsApp webhook + payment confirmation
- HoloCompanion

## [1.1.0] — 2026-07-15 — Holo Cinema MVP
- Holo Cinema 3D Web MVP
- Types consolidation Fase 1
- ZAFIRO Event Bus + Frequency Origin

## [1.0.0] — 2026-07-14 — Fundación
- Next.js App Router con 165+ rutas
- Supabase + Stripe integration (bloqueado por credenciales)
- Auth demo con localStorage
- Cross-pillar notifications, search, leaderboard, export, stats, timeline
- BroadcastChannel cross-tab sync
- Admin dashboard 360

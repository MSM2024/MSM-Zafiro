# ZAFIRO Project — Arquitectura Canónica

## Ecosistema MSM — Orden Maestra

```
💎 ZAFIRO        → Identidad (Perfiles, VIP, KYC)
🏪 MSM MARKETPLACE → Comercio (Tiendas, Pedidos, Entregas)
📖 MSM EDITORIAL  → Conocimiento (Escritores, Libros, Devocionales)
💰 MSM ECONOMÍA   → Operativa (Caja, Inventario Privado)
```

**Estrategia:** Integración vía APIs y Eventos — bases de datos independientes.

## Server
- **Start**: `Start-Process -FilePath "cmd.exe" -ArgumentList "/c npx next dev -p 3001" -NoNewWindow`
- **Kill**: `Get-Process -Name node | Stop-Process -Force`
- **Build**: `cmd.exe /c "npm run build"`
- **Test**: `npx vitest run`
- **Test (watch)**: `npx vitest`
- **Backup**: `git bundle create "..\ZAFIRO_BACKUP_$(Get-Date -Format yyyyMMdd)\full.bundle" --all`

## Estado Actual (2026-07-20)
- **Build**: 0 errores, 173 rutas
- **Tests**: 64 tests (vitest, 7 suites) — offline-queue, feed, marketplace, rewards, messages, qa, notifications
- **UI**: PageShell con page transitions (feed, preguntas, circulos, messages, marketplace), Skeleton/LoadingScreen/EmptyState reutilizables
- **PWA**: service worker con push notifications, install prompt, manifest con shortcuts y screenshots, registro automático en ClientLayout
- **Admin Dashboard 360**: gráficos de pedidos por estado, productos por categoría, revenue trend line
- **Último commit**: `31d4ca8` — main + beta, deployeado en Vercel
- **CONECTAR 5 PILARES (INTEGRACIÓN COMPLETA)**: Editorial→Marketplace bridge, cross-pillar notification center, search, leaderboard, export, stats widget, activity timeline, broadcast sync, API endpoint
- **Editorial→Marketplace bridge**: `marketplace-bridge.ts` con syncBookToMarketplace / unsync / getBookMarketplaceProduct, botones "Comprar" en biblioteca pública y perfiles de escritores
- **Cross-pillar notifications**: `src/lib/notifications.ts` — motor que agrega eventos de los 5 pilares, localStorage, notificaciones auto-generadas por acción
- **Auto-notificaciones 5 pilares**: `registerUser` (Identity), `createOrder`/`updateOrderStatus` (Marketplace), `addBook`/`updateBook→PUBLICADO`/`addWriter`/`addDevocional` (Editorial), `addLedgerEntry` (Economy), `markSealProgress→completed` (Sellos)
- **Notification bell**: ZafiroShell con contador real no-leídos, polling 10s + BroadcastChannel cross-tab sync
- **Cross-pillar search**: `src/lib/search.ts` — busca productos, libros, devocionales, escritores, perfiles, sellos
- **Cross-pillar leaderboard**: `src/lib/leaderboard.ts` + `CrossPillarLeaderboard.tsx` — ranking multi-pilar con badges
- **Cross-pillar export**: `src/lib/export.ts` + `/admin/exportar` — CSV/JSON, por sección, descarga individual o completa
- **Cross-pillar stats**: `src/lib/cross-pillar-stats.ts` + `CrossPillarStatsWidget.tsx` — estadísticas agregadas de los 5 pilares
- **Cross-pillar timeline**: `src/lib/activity-timeline.ts` + `ActivityTimeline.tsx` — feed cronológico unificado multi-pilar
- **Cross-pillar API**: `/api/cross-pillar` — endpoint JSON con stats, timeline, notifications
- **BroadcastChannel sync**: `src/lib/broadcast.ts` — sincronización cross-tab para notificaciones y datos
- **Páginas actualizadas con datos multi-pilar**: `/ecosystem` (stats+vivo, leaderboard, timeline + link a /actividad), `/imperio` (timeline + link a /actividad), `/os` (stats widget + timeline + link a /actividad), `/admin/dashboard-360` (timeline + link a /actividad), `/perfil/[username]` (timeline + link a /actividad), `/zafiro/perfil` (timeline + link a /actividad), `/admin` (stats widget + actividad tab), `/admin/metricas` (cross-pillar stats widget agregado)
- **Admin Editorial mejorado**: tab de Libros con CRUD completo (crear, editar, eliminar), tab de Escritores con edición y eliminación, tab de Devocionales con CRUD completo
- **Admin Marketplace mejorado**: modal "Crear Producto" con formulario completo (nombre, descripción, precio, stock, categoría)
- **Página de actividad dedicada**: `/actividad` con timeline completo multi-pilar y filtros por pilar, linkeada desde todas las páginas con timeline
- **Crear Producto en admin**: modal con nombre, descripción, precio, stock, categoría

## Routes (165)
- **App**: `/` (SPA: Inicio, Explorar, Gemología, Círculos, Sponsors, Perfil)
- **Auth**: `/auth/login`, `/auth/register`, `/auth/recover`, `/auth/verify`
- **Identidad**: `/mi-perfil`, `/mi-perfil/seguridad`, `/mi-perfil/membresia`, `/mi-perfil/verificacion`
- **VIP**: `/vip`, `/vip/beneficios`
- **KYC**: `/kyc/inicio`, `/kyc/consentimiento`, `/kyc/datos`, `/kyc/documento`, `/kyc/estado`
- **Emprendedor**: `/emprendedor`, `/emprendedor/registro`, `/emprendedor/verificacion`, `/emprendedor/equipo`, `/emprendedor/beneficiarios`
- **Sellos**: `/sellos`, `/sellos/[numero]`, `/sellos/aleatorio`, `/sellos/hoy`, `/sellos/favoritos`, `/sellos/diario`, `/admin/sellos`
- **Admin**: `/admin`, `/admin/usuarios`, `/admin/vip`, `/admin/kyc`, `/admin/kyb`, `/admin/riesgos`, `/admin/auditoria`, `/admin/cripto`, `/admin/knowledge-import`, `/admin/tasas`, `/admin/bpa`, `/admin/logistica`, `/admin/ratings`, `/admin/email-cleaner`, `/admin/mente-maestra-leads`, `/admin/campanas`, `/admin/seguidores-holograma`, `/admin/rendimiento`, `/admin/dashboard-360`, `/admin/exportar`, `/admin/marketplace`, `/admin/editorial`, `/admin/metricas`, `/admin/ledger`
- **Documentación**: `/about`, `/what-we-do`, `/how-it-works`, `/eliana`, `/ecosystem`, `/vision`, `/mission`, `/values`, `/help`, `/terms`, `/privacy`, `/rules`
- **OS**: `/os`, `/os/apps`, `/os/files`, `/os/notifications`, `/os/search`
- **Extras**: `/universo`, `/perfil/[username]`, `/galaxia`, `/holo-cinema`, `/dashboard`, `/economia`, `/trading`, `/constitucion`, `/impacto`, `/imperio`, `/offline`, `/visual-preview`, `/memberships`, `/messages`, `/settings`, `/rewards`, `/referidos`, `/profile-page`, `/profile-page/edit`, `/profile-page/connections`, `/profile-page/projects`, `/sponsors-page`, `/gemologia`, `/contact`, `/zafiro/owner/dispositivos`, `/pagar`, `/editorial`, `/editorial/biblioteca`, `/editorial/devocionales`, `/editorial/escritores`, `/marketplace`, `/marketplace/cart`, `/marketplace/orders`, `/actividad`
- **API**: `/api/chat`, `/api/cross-pillar`, `/api/economia/cierre`, `/api/sync`, `/api/whatsapp/webhook`, `/api/owner/devices/register`, `/api/owner/devices/trust`, `/api/owner/devices/revoke`, `/api/owner/devices/sync`, `/api/email-cleaner/analyze`, `/api/email-cleaner/audit`, `/api/email-cleaner/connect`, `/api/email-cleaner/execute`, `/api/email-cleaner/revoke`, `/api/email-cleaner/trusted-senders`, `/api/mente-maestra/leads`, `/api/feature-flags`, `/api/eliana/chat`, `/api/eliana/audit`, `/api/eliana/feedback`, `/api/eliana/knowledge/search`, `/api/eliana/knowledge/upload`, `/api/profiles/create`, `/api/stripe/create-checkout-session`, `/api/stripe/customer-portal`, `/api/stripe/webhook`, `/api/legal/privacy`, `/api/legal/terms`

## Conventions
- All pages `'use client'` — use `usePageTitle("Name")` from `@/lib/usePageTitle`
- Mobile-first: dark `#050816`, accent `#00D9FF`, font Geist
- Icons: `lucide-react`. Animation: `motion/react`
- State: localStorage (keys prefixed `zafiro_`)
- Path alias: `@/*` → `./src/*`, `@zafiro/types` → `./packages/types/src/zafiro`

## Required ENV (.env.local)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PRICE_PRO`, `NEXT_PUBLIC_STRIPE_PRICE_CUBA_PLUS`
- `GEMINI_API_KEY`

## Bloqueantes
1. **Supabase sin credenciales** — auth, DB, RLS, todo bloqueado
2. **VERCEL_TOKEN** — actualizado en GitHub Secrets con nuevo token Vercel
   - **VERCEL_ORG_ID**: `team_eYjbIlfQF6GWALFMxqAXYyZo` (set)
   - **VERCEL_PROJECT_ID_ZAFIRO**: `prj_B1Mvz1NVUbjOp3BexRqyKxmPcSMt` (set)
   - **VERCEL_PROJECT_ID_MSM**: `prj_LjoIShD2l8A3n5QoC5M6fh2GrDL6` (set)
   - **vercel.json scope**: corregido de `msm-my-store` → `msmmystore`
3. **Sin tests resuelto** — 27 tests (vitest, 3 suites)

## Feature Status (99 features total)
- ✅ 37% funcional
- ⚠️ 27% parcial/simulado
- ❌ 35% no funcional

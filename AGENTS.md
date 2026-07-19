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
- **Backup**: `git bundle create "..\ZAFIRO_BACKUP_$(Get-Date -Format yyyyMMdd)\full.bundle" --all`

## Estado Actual (2026-07-18)
- **Build**: 0 errores, 153 rutas
- **Último commit**: `278b81c` — main, deployeado en Vercel
- **ORDEN POST LIBRO ELIANA 3D**: Nueva identidad visual de ELIANA — 5 componentes (SplashScreen, Portrait, AvatarCard, ChatWidget, HologramBeta), assets SVG (`eliana-face.svg`, `eliana-ui-icons.svg`), splash+chat reemplazados en `ClientLayout.tsx`, integración visual en `/eliana`
- **Book "De Cero a Dueño Digital"**: PUBLICADO via `seedDeCeroADuenoDigital(true)`, sync a ELIANA knowledge, accesible en `/zafiro/biblioteca`
- **ELIANA 3D components**: `ElianaPortrait` (SVG reutilizable, size/animated/aura/reduced), `ElianaAvatarCard` (3 variantes: default/compact/full, status dot, CTAs), `ElianaChatWidget` (FAB+panel completo con avatar, burbujas, typing indicator, 4 sugerencias), `ElianaSplashScreen` (partículas, geometría sagrada, 4 fases animación), `ElianaHologramBeta` (canvas 60 partículas, 3 anillos, diamante central)
- **Libs nuevas**: `eliana3d/` — 5 componentes en `src/components/eliana3d/`
- **Assets nuevos**: `public/assets/eliana/eliana-face.svg`, `public/assets/eliana/eliana-ui-icons.svg`
- **Logística Contenedores**: `/admin/logistica` — módulo nuevo USA/Panamá→Cuba, Frecuencia 369, sincronizado con Ledger Maestro
- **Sponsors**: Limpiados — ahora solo `msmmystore.com`, `wa.me/17723015523`, `WhatsApp Channel`
- **Perfiles**: Cache invalidado al guardar — cambios reflejados al instante entre páginas
- **Nube Familiar**: `/familia/*` (7 rutas) — Encuentro Soria Martínez 16-ago-2026, árbol genealógico, galería, cronología, historias, invitación WhatsApp
- **Módulos económicos**: `/admin/tasas` (tasas Cuba + calculadora MSM), `/admin/bpa` (BPA Mirror v1.0)
- **Libs nuevas**: `ledger.ts`, `firma-369.ts`, `tasas.ts`, `bpa-mirror.ts`, `familia.ts`, `owner.ts`, `logistica-contenedores.ts`
- **Frecuencia 369 + Nodo Único**: inyectados en ELIANA (web + WhatsApp), sin errores
- **Migraciones**: 00006 (17 tablas familia), 00007 (exchange_rate_snapshots)
- **Dominio**: https://zafiro.msmmystore.com — CNAME → Vercel, HTTPS 200 OK
- **Auth**: localStorage fallback — Supabase sin credenciales
- **Datos**: localStorage (15+ keys) — migraciones SQL listas (2 archivos)
- **Monorepo**: 13 packages, solo `types/` usado (12 muertos)
- **Assets**: 15 WebP en `public/assets/zafiro/`, JPG originales eliminados, 5 SVGs Next.js eliminados
- **Onboarding**: `ONBOARDING_NUEVO_COLABORADOR.md` + `EQUIPO_ZAFIRO.md` + script invites
- **Rama sync**: `sync-20260717` con ARCHIVO_DE_CONTINUIDAD.md (pendientes 23-jul)
- **Owner Profile**: `owner.ts` + `bootstrapOwnerProfile()` reconoce com8msm@gmail.com → OWNER_SUPERADMIN, LIFETIME_UNLIMITED, badges FUNDADOR
- **Owner Devices**: `owner-devices.ts` — registro, confianza, revocación, sync localStorage, 4 API routes, panel `/zafiro/owner/dispositivos`
- **Migraciones nuevas**: `00008_owner_profiles.sql`, `00009_owner_devices.sql`
- **Limpieza**: 10 packages muertos eliminados → solo quedan `eliana/`, `holo-cinema/`, `types/`
- **Fix React 19 lint**: 6 errores `set-state-in-effect` corregidos a lazy initialization
- **Fix tipos**: 8 `no-explicit-any`, 6 `purity`, 2 `immutability`, 1 `unescaped-entities` corregidos
- **ELIANA knowledge**: 38 docs (+2: protocolo owner, sincronización dispositivos)
- **Avatar component**: `Avatar.tsx` con fallback initials para profile images
- **ZafiroShell OS**: `ClientLayout.tsx` renderiza `ZafiroShell` para todas las rutas `/os/*` — escritorio con dock, top bar, launcher
- **OS Pages**: `/os` (widgets), `/os/apps` (12 apps grid), `/os/files` (gestor archivos), `/os/notifications` (centro notificaciones), `/os/search` (búsqueda global)
- **Email Cleaner persistencia**: `src/lib/email-cleaner/persistence.ts` (12 funciones localStorage), página actualizada con handlers reales
- **Admin leads**: `/admin/mente-maestra-leads` — filtros, búsqueda, export CSV, localStorage persistence
- **Admin campañas**: `/admin/campanas` — edición inline, ciclo estados, métricas
- **LeadForm persistente**: `LeadForm.tsx` guarda leads en localStorage tras API success
- **QR Holográfico**: `src/lib/payments/config.ts`, `src/components/payments/QrCode.tsx` (qrcode library), `src/components/payments/HolographicQrCard.tsx` (marco holográfico, QR plano escaneable, 5 estados), `src/app/pagar/page.tsx` (selector USDT/Venmo)
- **Seguidores holograma**: `src/lib/followers/types.ts` (10 plataformas), `storage.ts` (10 localStorage keys), `adapters.ts` (10 adaptadores), `HolographicFollowersScene.tsx` (8 botones, 4 modos), `FollowersOrbit.tsx`, `PlatformNode.tsx`, `WorldFollowerMap.tsx`, `GrowthTimeline.tsx`, `TargetProjection.tsx`, `/admin/seguidores-holograma`
- **Velocidad Luz 369/777**: `src/lib/performance/` (network-mode, connection-monitor, request-cache, adaptive-loader, sync-engine, performance-budget), componentes UI (NetworkModeIndicator, AdaptiveImage, DeferredModule, OfflineStatus), `/admin/rendimiento`, docs (3 archivos)

## Routes (153)
- **App**: `/` (SPA: Inicio, Explorar, Gemología, Círculos, Sponsors, Perfil)
- **Auth**: `/auth/login`, `/auth/register`, `/auth/recover`, `/auth/verify`
- **Identidad**: `/mi-perfil`, `/mi-perfil/seguridad`, `/mi-perfil/membresia`, `/mi-perfil/verificacion`
- **VIP**: `/vip`, `/vip/beneficios`
- **KYC**: `/kyc/inicio`, `/kyc/consentimiento`, `/kyc/datos`, `/kyc/documento`, `/kyc/estado`
- **Emprendedor**: `/emprendedor`, `/emprendedor/registro`, `/emprendedor/verificacion`, `/emprendedor/equipo`, `/emprendedor/beneficiarios`
- **Sellos**: `/sellos`, `/sellos/[numero]`, `/sellos/aleatorio`, `/sellos/hoy`, `/sellos/favoritos`, `/sellos/diario`, `/admin/sellos`
- **Admin**: `/admin`, `/admin/usuarios`, `/admin/vip`, `/admin/kyc`, `/admin/kyb`, `/admin/riesgos`, `/admin/auditoria`, `/admin/cripto`, `/admin/knowledge-import`, `/admin/tasas`, `/admin/bpa`, `/admin/logistica`, `/admin/ratings`, `/admin/email-cleaner`, `/admin/mente-maestra-leads`, `/admin/campanas`, `/admin/seguidores-holograma`, `/admin/rendimiento`
- **Documentación**: `/about`, `/what-we-do`, `/how-it-works`, `/eliana`, `/ecosystem`, `/vision`, `/mission`, `/values`, `/help`, `/terms`, `/privacy`, `/rules`
- **OS**: `/os`, `/os/apps`, `/os/files`, `/os/notifications`, `/os/search`
- **Extras**: `/universo`, `/perfil/[username]`, `/galaxia`, `/holo-cinema`, `/dashboard`, `/economia`, `/trading`, `/constitucion`, `/impacto`, `/imperio`, `/offline`, `/visual-preview`, `/memberships`, `/messages`, `/settings`, `/rewards`, `/referidos`, `/profile-page`, `/profile-page/edit`, `/profile-page/connections`, `/profile-page/projects`, `/sponsors-page`, `/gemologia`, `/contact`, `/zafiro/owner/dispositivos`, `/pagar`
- **API**: `/api/chat`, `/api/economia/cierre`, `/api/sync`, `/api/whatsapp/webhook`, `/api/owner/devices/register`, `/api/owner/devices/trust`, `/api/owner/devices/revoke`, `/api/owner/devices/sync`, `/api/email-cleaner/analyze`, `/api/email-cleaner/audit`, `/api/email-cleaner/connect`, `/api/email-cleaner/execute`, `/api/email-cleaner/revoke`, `/api/email-cleaner/trusted-senders`, `/api/mente-maestra/leads`, `/api/feature-flags`, `/api/eliana/chat`, `/api/eliana/audit`, `/api/eliana/feedback`, `/api/eliana/knowledge/search`, `/api/eliana/knowledge/upload`

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
3. **Sin tests** — 0 tests en todo el proyecto

## Feature Status (99 features total)
- ✅ 37% funcional
- ⚠️ 27% parcial/simulado
- ❌ 35% no funcional

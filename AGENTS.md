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

## Estado Actual (2026-07-16)
- **Build**: 0 errores, 88 rutas
- **Nube Familiar**: `/familia/*` (7 rutas) — Encuentro Soria Martínez 16-ago-2026, árbol genealógico, galería, cronología, historias, invitación WhatsApp
- **Módulos económicos**: `/admin/tasas` (tasas Cuba + calculadora MSM), `/admin/bpa` (BPA Mirror v1.0)
- **Libs nuevas**: `ledger.ts` (Flujo Económico 5 pasos), `firma-369.ts` (firma cripto-espiritual), `tasas.ts`, `bpa-mirror.ts`, `familia.ts`, `owner.ts` (Membresía Eterna)
- **Frecuencia 369 + Nodo Único**: inyectados en ELIANA (web + WhatsApp), sin errores "No pude procesar"
- **Migraciones**: 00006 (17 tablas familia), 00007 (exchange_rate_snapshots)
- **Dominio**: https://zafiro.msmmystore.com — CNAME → Vercel, HTTPS 200 OK
- **Auth**: localStorage fallback — Supabase sin credenciales
- **Datos**: localStorage (15+ keys) — migraciones SQL listas (2 archivos)
- **Monorepo**: 13 packages, solo `types/` usado (12 muertos)
- **Assets**: 15 WebP en `public/assets/zafiro/`, JPG originales eliminados, 5 SVGs Next.js eliminados

## Routes (78)
- **App**: `/` (SPA: Inicio, Explorar, Gemología, Círculos, Sponsors, Perfil)
- **Auth**: `/auth/login`, `/auth/register`, `/auth/recover`, `/auth/verify`
- **Identidad**: `/mi-perfil`, `/mi-perfil/seguridad`, `/mi-perfil/membresia`, `/mi-perfil/verificacion`
- **VIP**: `/vip`, `/vip/beneficios`
- **KYC**: `/kyc/inicio`, `/kyc/consentimiento`, `/kyc/datos`, `/kyc/documento`, `/kyc/estado`
- **Emprendedor**: `/emprendedor`, `/emprendedor/registro`, `/emprendedor/verificacion`, `/emprendedor/equipo`, `/emprendedor/beneficiarios`
- **Sellos**: `/sellos`, `/sellos/[numero]`, `/sellos/aleatorio`, `/sellos/hoy`, `/sellos/favoritos`, `/sellos/diario`, `/admin/sellos`
- **Admin**: `/admin`, `/admin/usuarios`, `/admin/vip`, `/admin/kyc`, `/admin/kyb`, `/admin/riesgos`, `/admin/auditoria`, `/admin/cripto`, `/admin/knowledge-import`
- **Documentación**: `/about`, `/what-we-do`, `/how-it-works`, `/eliana`, `/ecosystem`, `/vision`, `/mission`, `/values`, `/help`, `/terms`, `/privacy`, `/rules`
- **Extras**: `/universo`, `/perfil/[username]`, `/galaxia`, `/holo-cinema`, `/dashboard`, `/economia`, `/trading`, `/constitucion`, `/impacto`, `/imperio`, `/offline`, `/visual-preview`, `/memberships`, `/messages`, `/settings`, `/rewards`, `/referidos`, `/profile-page`, `/profile-page/edit`, `/profile-page/connections`, `/profile-page/projects`, `/sponsors-page`, `/gemologia`, `/contact`
- **API**: `/api/chat`, `/api/economia/cierre`, `/api/sync`, `/api/whatsapp/webhook`

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
2. **VERCEL_OIDC_TOKEN expuesto** en .env.local — rotar desde Vercel Dashboard
3. **Sin tests** — 0 tests en todo el proyecto
4. **12 packages muertos** — sin imports, sin build, sin tests

## Feature Status (99 features total)
- ✅ 37% funcional
- ⚠️ 27% parcial/simulado
- ❌ 35% no funcional

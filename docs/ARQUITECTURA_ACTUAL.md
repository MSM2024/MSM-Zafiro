# Arquitectura Actual — ZAFIRO Ecosystem

**Fecha:** 2026-07-20
**Stack:** Next.js 16.2.10 (Turbopack) + TypeScript + localStorage

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.2.10 (App Router) |
| Lenguaje | TypeScript 5.x |
| UI | Tailwind CSS 4 + motion/react (Framer Motion) |
| Iconos | lucide-react |
| Fuente | Geist (local) |
| Almacenamiento | localStorage (100% client-side) |
| Auth | localStorage + Supabase SDK (sin credenciales) |
| Pagos | Stripe SDK (sin keys, modo simulado) |
| IA | Google Gemini (con key) + OpenAI/Anthropic/DeepSeek/Perplexity/Grok (sin keys) |
| Build | Turbopack (dev) + Next.js build (prod) |
| Deploy | Vercel (configurado) |

---

## Estructura de directorios

```
src/
├── app/                    # Next.js App Router pages + API
│   ├── admin/              # 35+ admin panels
│   ├── api/                # 28 API routes
│   ├── auth/               # Login, register, recover, verify
│   ├── eliana/             # ELIANA chat page
│   ├── marketplace/        # Product catalog, cart, orders
│   ├── editorial/          # Biblioteca, devocionales, escritores
│   ├── economia/           # Economy panel
│   └── zafiro/             # Perfil, privacidad, admin eliana
├── components/             # React components
│   ├── eliana3d/           # ELIANA avatar, hologram, chat widget
│   ├── os/                 # ZafiroShell, OS components
│   ├── payments/           # QR, holographic card
│   └── zafiro/             # Hero, splash screen
├── lib/                    # Business logic (TODA en localStorage)
│   ├── eliana/             # Core ELIANA (response-router, RAG, etc.)
│   ├── editorial/          # Books, writers, devocionales
│   ├── knowledge/          # Domain data, chunker
│   └── payments/           # Payment storage, config
├── hooks/                  # Custom hooks (useBadgeChecker)
├── proxy.ts                # Next.js 16 middleware (route protection)
└── middleware.ts           # Removed (merged into proxy.ts)
```

---

## Flujo de datos actual

```
Browser (cliente)
  ├── localStorage ←→ Pages (lectura/escritura directa)
  ├── fetch() → API Routes (server-side)
  │     └── API routes intentan leer localStorage → fallan/retornan defaults
  └── fetch() → /api/eliana/chat (único endpoint con lógica real)
        └── processQuery() → response-router → RAG/AI
```

**Problema arquitectónico principal:** Toda la data vive en localStorage (cliente). Las API routes no tienen acceso a datos persistentes. Esto significa que:

1. Las API routes `/api/cross-pillar`, `/api/eliana/feedback`, `/api/eliana/audit`, etc. retornan datos vacíos.
2. No hay persistencia server-side.
3. Cada dispositivo tiene datos aislados.

---

## localStorage Keys (52 total)

| Prefijo | # Keys | Propósito |
|---------|--------|-----------|
| `zafiro_` | 45+ | Datos de aplicación (auth, perfiles, sellos, ledger, etc.) |
| `zafiro_eliana_` | 5 | ELIANA traces, memory, feedback, training |
| `zafiro_angel_` | 3 | Seguridad (audit, MFA, events) |
| `zafiro_owner_` | 3 | Owner membership, audit, MFA |
| `zafiro_v2_` | 10+ | V2 identity system |

---

## Dependencias externas (env vars requeridas)

| Variable | Estado | Usada por |
|----------|--------|-----------|
| `GEMINI_API_KEY` | ❌ No configurada | ELIANA AI |
| `NEXT_PUBLIC_SUPABASE_URL` | ❌ No configurada | Auth + DB |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ❌ No configurada | Auth + DB |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ No configurada | Admin DB |
| `STRIPE_SECRET_KEY` | ❌ No configurada | Pagos |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ❌ No configurada | Pagos |
| `STRIPE_WEBHOOK_SECRET` | ❌ No configurada | Pagos |
| `WHATSAPP_ACCESS_TOKEN` | ❌ No configurada | WhatsApp |
| `WHATSAPP_APP_SECRET` | ❌ No configurada | WhatsApp |

---

## Decisiones técnicas clave

1. **localStorage como DB**: Decisión pragmática para MVP sin backend. Toda la lógica de negocio está en el cliente.
2. **Dual auth system**: Supabase SDK presente para cuando haya credenciales; fallback a localStorage.
3. **Proxy.ts como middleware**: Next.js 16 usa `proxy.ts` en vez de `middleware.ts` para route protection.
4. **'use client' en todas las pages**: Incluyendo las que no necesitan interactividad, por consistencia.
5. **Dynamic imports para evitar ciclos**: Algunos módulos usan `require()` dinámico (ya corregido).

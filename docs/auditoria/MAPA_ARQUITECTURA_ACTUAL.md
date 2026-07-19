# MAPA DE ARQUITECTURA ACTUAL — ZAFIRO OS

**Fecha de auditoría:** 2026-07-18
**Repositorio:** https://github.com/MSM2024/MSM-Zafiro.git
**Branch:** `main` | **Commit:** `278b81c`
**Dominio:** https://zafiro.msmmystore.com (CNAME → Vercel)

---

## 1. Overview

ZAFIRO OS es una **Red Social del Conocimiento, la Conciencia y el Propósito** construida como una aplicación monolítica Next.js que emula un ecosistema de microservicios mediante módulos de librería. El sistema integra identidad (perfiles, VIP, KYC), comercio (economía, ledger, trading), conocimiento (ELIANA IA, base de conocimiento gemológica), comunidad (sellos, comentarios, referidos), administración, y un módulo familiar.

**Arquitectura resumida:**

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (CSR)                       │
│  Next.js App Router · 105 page.tsx · 43 componentes     │
│  'use client' universal · localStorage (40+ keys)        │
├─────────────────────────────────────────────────────────┤
│                    API LAYER (19 routes)                  │
│  /api/chat · /api/stripe/* · /api/eliana/* · /api/owner  │
├─────────────────────────────────────────────────────────┤
│                   LIB LAYER (53 modules)                  │
│  auth · eliana/engine · ai/providers · ledger · owner     │
├─────────────────────────────────────────────────────────┤
│              EXTERNAL SERVICES (sin credenciales)         │
│  Supabase (0 config) · Stripe (keys) · Gemini (key)      │
└─────────────────────────────────────────────────────────┘
```

**Estado del Build:** 129 rutas compiladas, 0 errores. **Lint:** 3 errores ESLint, ~50 warnings de variables no usadas.

---

## 2. Technology Stack

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Framework** | Next.js (Turbopack) | 16.2.10 |
| **Runtime** | React | 19.2.4 |
| **Lenguaje** | TypeScript | ^5.0.0 |
| **Node.js** | Node | v22.23.1 |
| **Package Manager** | npm | lockfile v3 |
| **CSS Framework** | Tailwind CSS | ^4.0.0 |
| **PostCSS** | @tailwindcss/postcss | ^4.0.0 |
| **Fuentes** | Geist, Geist_Mono | via next/font/google |
| **Iconos** | lucide-react | ^1.23.0 |
| **Animaciones** | motion (framer-motion v12) | ^12.42.2 |
| **3D / WebGL** | Three.js, @react-three/fiber, drei, postprocessing | ^0.185.1 / ^9.6.1 / ^10.7.7 / ^3.0.4 |
| **Base de datos** | Supabase (PostgreSQL) | @supabase/supabase-js ^2.110.1, @supabase/ssr ^0.12.0 |
| **Pagos** | Stripe | ^22.3.2 |
| **IA** | Google Gemini (gemini-1.5-flash) | API REST externa |
| **PWA** | Service Worker (sw.js) + manifest | Cache-first offline |
| **Linter** | ESLint + eslint-config-next | ^9.0.0 / 16.2.10 |
| **Deploy** | Vercel | via git push |

**TypeScript Config:**
- `target: ES2017`, `module: esnext`, `moduleResolution: bundler`
- `strict: true`, `isolatedModules: true`, `jsx: react-jsx`
- Aliases: `@/*` → `./src/*`, `@zafiro/types` → `./packages/types/src/zafiro`

---

## 3. Monorepo Structure

### 3.1 Paquetes activos (4)

| Paquete | Ubicación | Estado |
|---------|-----------|--------|
| `types` | `packages/types/` | ✅ Activo — tipo central `zafiro.ts` con `ZafiroUser`, `ZafiroSession`, `LegacyUserRole` |
| `eliana` | `packages/eliana/` | ⚠️ Presencia física, contenido no verificado como importado activamente |
| `frequency-origin` | `packages/frequency-origin/` | ⚠️ Presencia física, contenido no verificado |
| `holo-cinema` | `packages/holo-cinema/` | ⚠️ Presencia física, contenido no verificado |

### 3.2 Paquetes eliminados (10)

Eliminados del repositorio pero aún visibles en historial de commits:

| Paquete | Impacto |
|---------|---------|
| `adaptive-router` | Test roto: `tests/adaptive-router.test.ts` |
| `digital-twin` | Test roto: `tests/digital-twin.test.ts` |
| `events` | Sin test conocido |
| `guardians` | Sin test conocido |
| `mesh-bridge` | Sin test conocido |
| `offline` | Sin test conocido |
| `portable-eliana` | Test roto: `tests/portable-eliana.test.ts` |
| `sync` | Test roto: `tests/sync-queue.test.ts` |
| `whatsapp` | Sin test conocido |
| `zafiro-types` | Reemplazado por `types` |

### 3.3 Directorios del proyecto

```
MSM-Zafiro/
├── public/                     # Assets estáticos
│   ├── assets/zafiro/          # 14 subdirectorios, 15+ WebP
│   ├── eliana-diamond.svg      # Favicon / PWA icon
│   ├── icons/                  # icon-192.svg, icon-512.svg
│   ├── manifest.json           # PWA manifest
│   ├── manifest.webmanifest    # PWA manifest (duplicate)
│   └── sw.js                   # Service Worker
├── src/
│   ├── app/                    # Next.js App Router (105 pages, 19 API routes)
│   ├── components/             # 43 componentes React
│   ├── config/                 # 3 archivos (knowledge-schema, zafiro-assets x2)
│   ├── lib/                    # 53 módulos de lógica
│   └── security/               # 2 guards (require-role, require-aal2)
├── packages/                   # 4 paquetes monorepo
├── supabase/migrations/        # 11 archivos SQL
├── tests/                      # 5 archivos (todos rotos)
├── scripts/                    # Scripts de build (.cjs)
├── next.config.ts
├── tsconfig.json
├── package.json
└── AGENTS.md
```

---

## 4. App Router Map

### 4.1 Páginas de Aplicación (105 page.tsx)

#### Inicio y Navegación Principal
| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/` | `src/app/page.tsx` | SPA principal: Inicio, Explorar, Gemología, Círculos, Sponsors, Perfil |
| `/universo` | `src/app/universo/` | Universo digital del usuario |
| `/galaxia` | `src/app/galaxia/` | Galaxia infinita de contenido |
| `/ecosystem` | `src/app/ecosystem/` | Ecosistema MSM |
| `/dashboard` | `src/app/dashboard/` | Panel de control |

#### Autenticación
| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/auth/login` | `src/app/auth/login/` | Login con fallback localStorage |
| `/auth/register` | `src/app/auth/register/` | Registro con SHA-256 |
| `/auth/recover` | `src/app/auth/recover/` | Recuperación de contraseña |
| `/auth/verify` | `src/app/auth/verify/` | Verificación de email |

#### Identidad y Perfil
| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/mi-perfil` | `src/app/mi-perfil/` | Perfil del usuario |
| `/mi-perfil/seguridad` | `src/app/mi-perfil/seguridad/` | Configuración de seguridad |
| `/mi-perfil/membresia` | `src/app/mi-perfil/membresia/` | Estado de membresía |
| `/mi-perfil/verificacion` | `src/app/mi-perfil/verificacion/` | Verificación KYC |
| `/perfil/[username]` | `src/app/perfil/[username]/` | Perfil público por username |
| `/profile-page` | `src/app/profile-page/` | Página de perfil alternativa |
| `/profile-page/edit` | `src/app/profile-page/edit/` | Edición de perfil |
| `/profile-page/connections` | `src/app/profile-page/connections/` | Conexiones del usuario |
| `/profile-page/projects` | `src/app/profile-page/projects/` | Proyectos del usuario |

#### VIP y Membresías
| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/vip` | `src/app/vip/` | Portal VIP |
| `/vip/beneficios` | `src/app/vip/beneficios/` | Beneficios VIP |
| `/memberships` | `src/app/memberships/` | Planes de membresía |
| `/zafiro/membresias` | `src/app/zafiro/membresias/` | Sistema de membresías |

#### KYC (Verificación de Identidad)
| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/kyc/inicio` | `src/app/kyc/inicio/` | Inicio del proceso KYC |
| `/kyc/consentimiento` | `src/app/kyc/consentimiento/` | Consentimiento |
| `/kyc/datos` | `src/app/kyc/datos/` | Datos personales |
| `/kyc/documento` | `src/app/kyc/documento/` | Subida de documento |
| `/kyc/estado` | `src/app/kyc/estado/` | Estado de verificación |

#### Emprendedor
| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/emprendedor` | `src/app/emprendedor/` | Portal emprendedor |
| `/emprendedor/registro` | `src/app/emprendedor/registro/` | Registro de negocio |
| `/emprendedor/verificacion` | `src/app/emprendedor/verificacion/` | Verificación KYB |
| `/emprendedor/equipo` | `src/app/emprendedor/equipo/` | Gestión de equipo |
| `/emprendedor/beneficiarios` | `src/app/emprendedor/beneficiarios/` | Beneficiarios |

#### Sellos (Sistema de Logros)
| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/sellos` | `src/app/sellos/` | Catálogo de sellos |
| `/sellos/[numero]` | `src/app/sellos/[numero]/` | Detalle de sello por número |
| `/sellos/aleatorio` | `src/app/sellos/aleatorio/` | Sello aleatorio |
| `/sellos/hoy` | `src/app/sellos/hoy/` | Sello del día |
| `/sellos/favoritos` | `src/app/sellos/favoritos/` | Sellos favoritos |
| `/sellos/diario` | `src/app/sellos/diario/` | Reto diario de sellos |

#### Administración
| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/admin` | `src/app/admin/` | Dashboard admin |
| `/admin/usuarios` | `src/app/admin/usuarios/` | Gestión de usuarios |
| `/admin/vip` | `src/app/admin/vip/` | Administración VIP |
| `/admin/kyc` | `src/app/admin/kyc/` | Casos KYC |
| `/admin/kyc/[caseId]` | `src/app/admin/kyc/[caseId]/` | Detalle de caso KYC |
| `/admin/kyb` | `src/app/admin/kyb/` | Casos KYB |
| `/admin/kyb/[caseId]` | `src/app/admin/kyb/[caseId]/` | Detalle de caso KYB |
| `/admin/riesgos` | `src/app/admin/riesgos/` | Panel de riesgos |
| `/admin/auditoria` | `src/app/admin/auditoria/` | Logs de auditoría |
| `/admin/cripto` | `src/app/admin/cripto/` | Activos cripto |
| `/admin/tasas` | `src/app/admin/tasas/` | Tasas de cambio Cuba + calculadora MSM |
| `/admin/bpa` | `src/app/admin/bpa/` | BPA Mirror v1.0 |
| `/admin/logistica` | `src/app/admin/logistica/` | Logística contenedores USA/Panamá→Cuba |
| `/admin/ratings` | `src/app/admin/ratings/` | Sistema de calificaciones |
| `/admin/sellos` | `src/app/admin/sellos/` | Administración de sellos |
| `/admin/knowledge-import` | `src/app/admin/knowledge-import/` | Importación de conocimiento |
| `/admin/marketing` | `src/app/admin/marketing/` | Panel de marketing |
| `/admin/ledger` | `src/app/admin/ledger/` | Ledger maestro |

#### Admin ELIANA
| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/zafiro/admin/eliana/panel` | `src/app/zafiro/admin/eliana/panel/` | Panel de control ELIANA |
| `/zafiro/admin/eliana/inventario` | `src/app/zafiro/admin/eliana/inventario/` | Inventario de conocimiento |
| `/zafiro/admin/eliana/expedientes` | `src/app/zafiro/admin/eliana/expedientes/` | Expedientes |
| `/zafiro/admin/eliana/directorio` | `src/app/zafiro/admin/eliana/directorio/` | Directorio |
| `/zafiro/admin/eliana/core` | `src/app/zafiro/admin/eliana/core/` | Core de ELIANA |
| `/zafiro/admin/eliana/conocimiento` | `src/app/zafiro/admin/eliana/conocimiento/` | Base de conocimiento |

#### Owner
| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/zafiro/owner/dispositivos` | `src/app/zafiro/owner/dispositivos/` | Gestión de dispositivos del owner |
| `/zafiro/admin/perfiles` | `src/app/zafiro/admin/perfiles/` | Administración de perfiles |
| `/zafiro/admin/terminos` | `src/app/zafiro/admin/terminos/` | Gestión de términos legales |

#### Villa Esperanza
| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/villa-esperanza` | `src/app/villa-esperanza/` | Portal Villa Esperanza |
| `/villa-esperanza/villa-azul` | `src/app/villa-esperanza/villa-azul/` | Villa Azul |
| `/villa-esperanza/santuario` | `src/app/villa-esperanza/santuario/` | Santuario |
| `/villa-esperanza/financiamiento` | `src/app/villa-esperanza/financiamiento/` | Opciones de financiamiento |
| `/villa-esperanza/cabanas` | `src/app/villa-esperanza/cabanas/` | Cabañas |
| `/villa-esperanza/arbol-de-la-vida` | `src/app/villa-esperanza/arbol-de-la-vida/` | Árbol de la vida |

#### Familia
| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/familia` | `src/app/familia/` | Portal familiar |
| `/familia/encuentro-2026` | `src/app/familia/encuentro-2026/` | Encuentro Soria Martínez 16-ago-2026 |
| `/familia/arbol` | `src/app/familia/arbol/` | Árbol genealógico |
| `/familia/galeria` | `src/app/familia/galeria/` | Galería de fotos |
| `/familia/cronologia` | `src/app/familia/cronologia/` | Cronología familiar |
| `/familia/historias` | `src/app/familia/historias/` | Historias familiares |
| `/familia/invitacion` | `src/app/familia/invitacion/` | Invitación por WhatsApp |

#### Módulos Especializados
| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/gemologia` | `src/app/gemologia/` | Módulo de gemología |
| `/holo-cinema` | `src/app/holo-cinema/` | Cine holográfico (Three.js) |
| `/economia` | `src/app/economia/` | Panel económico |
| `/trading` | `src/app/trading/` | Estrategias de trading |
| `/referidos` | `src/app/referidos/` | Sistema de referidos |
| `/rewards` | `src/app/rewards/` | Recompensas y badges |
| `/messages` | `src/app/messages/` | Mensajería interna |
| `/contact` | `src/app/contact/` | Formulario de contacto |
| `/settings` | `src/app/settings/` | Configuración general |
| `/sponsors-page` | `src/app/sponsors-page/` | Página de sponsors |
| `/visual-preview` | `src/app/visual-preview/` | Preview visual |
| `/impacto` | `src/app/impacto/` | Impacto social |
| `/imperio` | `src/app/imperio/` | Impero MSM |
| `/constitucion` | `src/app/constitucion/` | Constitución |
| `/eliana` | `src/app/eliana/` | Página dedicada ELIANA |
| `/offline` | `src/app/offline/` | Página offline |

#### Documentación Legal e Institucional
| Ruta | Archivo |
|------|---------|
| `/about` | `src/app/about/` |
| `/what-we-do` | `src/app/what-we-do/` |
| `/how-it-works` | `src/app/how-it-works/` |
| `/vision` | `src/app/vision/` |
| `/mission` | `src/app/mission/` |
| `/values` | `src/app/values/` |
| `/help` | `src/app/help/` |
| `/terms` | `src/app/terms/` |
| `/privacy` | `src/app/privacy/` |
| `/zafiro/terminos` | `src/app/zafiro/terminos/` |
| `/zafiro/privacidad` | `src/app/zafiro/privacidad/` |
| `/zafiro/reglas-comunidad` | `src/app/zafiro/reglas-comunidad/` |
| `/zafiro/perfil` | `src/app/zafiro/perfil/` |

### 4.2 API Routes (19 endpoints)

| Ruta | Método | Descripción | Estado |
|------|--------|-------------|--------|
| `/api/chat` | POST | Chat general con ELIANA (rate-limited, 30 req/min) | ✅ Funcional |
| `/api/eliana/chat` | POST | Chat específico ELIANA | ⚠️ Depende de Gemini key |
| `/api/eliana/feedback` | POST | Feedback de respuestas ELIANA | ⚠️ Depende de Gemini key |
| `/api/eliana/knowledge/search` | POST | Búsqueda en base de conocimiento | ⚠️ Depende de Gemini key |
| `/api/eliana/knowledge/upload` | POST | Subida de conocimiento | ⚠️ Depende de Gemini key |
| `/api/eliana/audit` | GET | Auditoría de interacciones ELIANA | ⚠️ Depende de Gemini key |
| `/api/stripe/create-checkout-session` | POST | Crear sesión de checkout Stripe | ✅ Funcional |
| `/api/stripe/customer-portal` | POST | Portal de cliente Stripe | ✅ Funcional |
| `/api/stripe/webhook` | POST | Webhook de eventos Stripe | ✅ Funcional |
| `/api/profiles/create` | POST | Creación de perfil | ⚠️ Depende de Supabase |
| `/api/sync` | POST | Sincronización de datos | ⚠️ Depende de Supabase |
| `/api/economia/cierre` | POST | Cierre económico diario | ✅ Funcional |
| `/api/owner/devices/register` | POST | Registrar dispositivo owner | ✅ Funcional |
| `/api/owner/devices/trust` | POST | Confiar dispositivo | ✅ Funcional |
| `/api/owner/devices/revoke` | POST | Revocar dispositivo | ✅ Funcional |
| `/api/owner/devices/sync` | POST | Sincronizar dispositivos | ✅ Funcional |
| `/api/legal/terms` | GET | Obtener términos legales | ✅ Funcional |
| `/api/legal/privacy` | GET | Obtener política de privacidad | ✅ Funcional |
| `/api/whatsapp/webhook` | POST | Webhook de WhatsApp | ⚠️ Depende de configuración |

---

## 5. Data Flow

### 5.1 Flujo de Autenticación

```
Usuario → registerUser() → ¿Supabase configurado?
  ├─ SÍ → supabase.auth.signUp() → sesión en localStorage
  └─ NO → hashPassword(SHA-256 + salt) → guardar en localStorage["zafiro_users"]
              → crear sesión en localStorage["zafiro_session"]
              → crear perfil en localStorage["zafiro_profiles"]
```

**Cadena de hash:** `SHA-256(password + "zafiro_salt_v1")` — salta hardcodeada, vulnerable a rainbow tables.

### 5.2 Flujo de ELIANA (IA Copiloto)

```
Usuario → ElianaFloatingButton → processElianaRequest()
  ├─ Memoria a corto plazo (localStorage["zafiro_eliana_memory"])
  ├─ Contexto de página (PTS, nivel, racha)
  ├─ Knowledge Graph (localStorage["zafiro_eliana_graph"])
  └─ Intenta fetch("/api/chat")
       ├─ Éxito → callAI() → Gemini API (gemini-1.5-flash)
       │         ├─ Gemini responde → retorna texto
       │         └─ Gemini falla → fallback local
       └─ Error → getFallbackResponse() (match de keywords en hardcode)
```

### 5.3 Flujo de Pagos (Stripe)

```
Usuario → StripeModal → POST /api/stripe/create-checkout-session
  → createPendingMembership() (localStorage)
  → createCheckoutSession() (Stripe API)
  → Redirect a Stripe Checkout
  → Webhook /api/stripe/webhook → confirmar membresía
```

### 5.4 Flujo de Datos Principal

**TODA la persistencia es localStorage.** No hay base de datos real funcionando.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Páginas    │────▶│  Libs (53)   │────▶│  localStorage │
│  (105 pages) │◀────│  (lógica)    │◀────│  (40+ keys)   │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                     ┌──────▼───────┐
                     │  API Routes  │──── Gemini / Stripe / WhatsApp
                     │  (19 routes) │
                     └──────────────┘
```

---

## 6. Component Hierarchy

### 6.1 Layout Global (`src/app/layout.tsx` → `ClientLayout.tsx`)

```
RootLayout (Server Component)
├── <html lang="es"> con font Geist
├── <head> con PWA meta, Service Worker registration
└── <body> bg-[#050816]
    └── ClientLayout ('use client')
        ├── ZafiroLockScreen (pantalla de bloqueo con PIN)
        │   ├── NetworkBackground (fondo de partículas)
        │   ├── {children} (páginas)
        │   ├── Footer (no en home ni /api/*)
        │   ├── PresenciaInstantanea (indicador de actividad)
        │   └── ElianaFloatingButton (botón flotante de IA)
        └── AuthBridgeInit (inicialización auth bridge)
```

### 6.2 Componentes Principales (43 total)

#### Navegación y Layout
| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| `BottomNav` | `src/components/BottomNav.tsx` | Navegación inferior móvil |
| `Footer` | `src/components/Footer.tsx` | Pie de página |
| `NotificationsDropdown` | `src/components/NotificationsDropdown.tsx` | Dropdown de notificaciones |

#### Eliana (IA)
| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| `ElianaFloatingButton` | `src/components/ElianaFloatingButton.tsx` | Botón flotante de chat |
| `ElianaAvatar` | `src/components/ElianaAvatar.tsx` | Avatar de ELIANA |
| `ElianaDiamond` | `src/components/ElianaDiamond.tsx` | Icono diamante ELIANA |
| `ResponseActionBar` | `src/components/eliana/ResponseActionBar.tsx` | Barra de acciones post-respuesta |

#### UI
| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| `GlassCard` | `src/components/ui/GlassCard.tsx` | Tarjeta glassmorphism |
| `GradientText` | `src/components/ui/GradientText.tsx` | Texto con degradado |
| `NetworkBackground` | `src/components/ui/NetworkBackground.tsx` | Fondo de red de nodos |
| `Skeleton` | `src/components/ui/Skeleton.tsx` | Placeholder de carga |
| `StatCard` | `src/components/ui/StatCard.tsx` | Tarjeta de estadística |
| `Avatar` | `src/components/Avatar.tsx` | Avatar con fallback initials |

#### Visualización de Contenido
| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| `StoriesBar` | `src/components/StoriesBar.tsx` | Barra de historias estilo Instagram |
| `StoryViewer` | `src/components/StoryViewer.tsx` | Visor de historias |
| `StarRating` | `src/components/StarRating.tsx` | Calificación por estrellas |
| `TrendsSection` | `src/components/TrendsSection.tsx` | Sección de tendencias |
| `ExpertLeaderboard` | `src/components/ExpertLeaderboard.tsx` | Tabla de líderes expertos |
| `FounderChallenge` | `src/components/FounderChallenge.tsx` | Reto del fundador |
| `DailyBrief` | `src/components/DailyBrief.tsx` | Resumen diario |
| `AddQuestionModal` | `src/components/AddQuestionModal.tsx` | Modal para agregar preguntas |

#### Sponsors
| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| `SponsorFloatingBar` | `src/components/SponsorFloatingBar.tsx` | Barra flotante de sponsors |
| `SponsorDetailModal` | `src/components/SponsorDetailModal.tsx` | Modal de detalle de sponsor |
| `SponsorAnalyticsChart` | `src/components/SponsorAnalyticsChart.tsx` | Gráfica de analytics de sponsors |

#### Sellos
| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| `SealCard` | `src/components/sellos/SealCard.tsx` | Tarjeta de sello |
| `SealVisualGrid` | `src/components/sellos/SealVisualGrid.tsx` | Grid visual de sellos |

#### Gemología
| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| `GemLab` | `src/components/gemology/GemLab.tsx` | Laboratorio de gemas |
| `Handbook` | `src/components/gemology/Handbook.tsx` | Manual de gemología |
| `LoreExplorer` | `src/components/gemology/LoreExplorer.tsx` | Explorador de lore |
| `AiAssistant` | `src/components/gemology/AiAssistant.tsx` | Asistente IA de gemología |

#### Visual / Animación
| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| `ParticlesBackground` | `src/components/ParticlesBackground.tsx` | Fondo de partículas |
| `GalaxiaInfinita` | `src/components/GalaxiaInfinita.tsx` | Galaxia infinita 3D |
| `GenesisChamberBackground` | `src/components/GenesisChamberBackground.tsx` | Fondo de cámara génesis |
| `ZafiroUniverse` | `src/components/ZafiroUniverse.tsx` | Universo ZAFIRO |
| `PortalGenesis` | `src/components/PortalGenesis.tsx` | Portal de génesis |
| `HoloCinemaCanvas` | `src/components/HoloCinemaCanvas.tsx` | Canvas de cine holográfico |
| `ModuleAngels` | `src/components/ModuleAngels.tsx` | Ángeles de módulos |
| `KnowledgeGraph` | `src/components/KnowledgeGraph.tsx` | Grafo de conocimiento |

#### Integración
| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| `StripeModal` | `src/components/StripeModal.tsx` | Modal de pagos Stripe |
| `AuthBridgeInit` | `src/components/AuthBridgeInit.tsx` | Puente de autenticación |
| `EconomiaPanel` | `src/components/EconomiaPanel.tsx` | Panel económico |
| `ZafiroLockScreen` | `src/components/ZafiroLockScreen.tsx` | Pantalla de bloqueo |

---

## 7. State Management (Inventario de Claves localStorage)

### 7.1 Inventario Completo de Claves

| Clave | Módulo | Tipo | Descripción |
|-------|--------|------|-------------|
| `zafiro_users` | `auth.ts` | `ZafiroUser[]` | Usuarios registrados |
| `zafiro_session` | `auth.ts` | `ZafiroSession` | Sesión activa |
| `zafiro_user_role` | `auth.ts` | `string` | Rol del usuario |
| `zafiro_auth_bridge` | `auth-bridge.ts` | `object` | Puente de autenticación |
| `zafiro_profiles` | `profile.ts` | `object[]` | Perfiles de usuario |
| `zafiro_owner_membership` | `owner.ts` | `object` | Membresía del owner |
| `zafiro_owner_audit_log` | `owner.ts` | `object[]` | Log de auditoría owner |
| `zafiro_owner_mfa_active` | `owner.ts` | `string` | MFA del owner (true/false) |
| `zafiro_owner_devices` | `owner-devices.ts` | `OwnerDevice[]` | Dispositivos autorizados |
| `zafiro_owner_sync_prefs` | `owner-devices.ts` | `SyncPreferences` | Preferencias de sync |
| `zafiro_owner_device_events` | `owner-devices.ts` | `DeviceSyncEvent[]` | Eventos de dispositivos |
| `zafiro_secure_pin` | `security-lock.ts` | `string` | PIN de seguridad (hash) |
| `zafiro_pin_attempts` | `security-lock.ts` | `object` | Intentos de PIN |
| `zafiro_emergency_lockout` | `security-lock.ts` | `string` | Bloqueo de emergencia |
| `zafiro_session_unlocked` | `security-lock.ts` | `string` | Sesión desbloqueada |
| `zafiro_founder_key` | `security-lock.ts` | `string` | Llave del fundador |
| `zafiro_founder_session` | `security-lock.ts` | `string` | Sesión del fundador |
| `zafiro_audit_events` | `security-lock.ts` | `object[]` | Eventos de auditoría |
| `zafiro_eliana_memory` | `eliana/memory.ts` | `object` | Memoria de ELIANA |
| `zafiro_eliana_graph` | `eliana/knowledge.ts` | `object` | Grafo de conocimiento |
| `zafiro_eliana_analysis` | `eliana/analysis.ts` | `object` | Análisis de ELIANA |
| `zafiro_recommendations_cache` | `eliana/recommendations.ts` | `object` | Cache de recomendaciones |
| `zafiro_knowledge_base` | `import-whatsapp-knowledge.ts` | `object` | Base de conocimiento importada |
| `zafiro_ledger_maestro` | `ledger.ts` | `object[]` | Ledger maestro de transacciones |
| `zafiro_ledger_cierres` | `ledger.ts` | `object[]` | Cierres contables |
| `zafiro_exchange_rates` | `tasas.ts` | `object` | Tasas de cambio |
| `zafiro_bpa_balance` | `bpa-mirror.ts` | `object` | Saldo BPA |
| `zafiro_bpa_transfers` | `bpa-mirror.ts` | `object[]` | Transferencias BPA |
| `zafiro_trading_1pct` | `trading-strategy.ts` | `object` | Estrategia de trading |
| `zafiro_trading_ops` | `trading-strategy.ts` | `object[]` | Operaciones de trading |
| `zafiro_cripto_activos` | `cripto-activos.ts` | `object` | Activos cripto |
| `zafiro_pts` | `rewards.ts` | `object` | Cuentas de puntos |
| `zafiro_streak` | `rewards.ts` | `object` | Rachas diarias |
| `zafiro_earned_badges` | `rewards.ts` | `object` | Badges obtenidos |
| `zafiro_daily_actions` | `rewards.ts` | `object` | Acciones diarias |
| `zafiro_referral_codes` | `referidos.ts` | `object[]` | Códigos de referido |
| `zafiro_referral_tracking` | `referidos.ts` | `object[]` | Tracking de referidos |
| `zafiro_comentarios` | `comentarios.ts` | `object[]` | Comentarios |
| `zafiro_publicaciones` | `comentarios.ts` | `object[]` | Publicaciones |
| `zafiro_presencia_instantanea` | `presencia.ts` | `object` | Presencia en tiempo real |
| `zafiro_sponsors` | `zafiro-data.ts` | `object[]` | Sponsors |
| `zafiro_questions` | `zafiro-data.ts` | `object[]` | Preguntas del sistema |
| `zafiro_universo` | `universo.ts` | `object` | Universo digital del usuario |
| `zafiro_creator_profiles` | `universo.ts` | `object[]` | Perfiles de creadores |
| `zafiro_contenedores` | `logistica-contenedores.ts` | `object[]` | Contenedores logísticos |
| `zafiro_impacto_social` | `impacto-social.ts` | `object` | Datos de impacto social |
| `zafiro_firmas_369` | `firma-369.ts` | `object[]` | Firmas de frecuencia 369 |
| `zafiro_reunion_guests` | `familia.ts` | `object[]` | Invitados de reunión familiar |
| `zafiro_family_photos` | `familia.ts` | `object[]` | Fotos familiares |
| `zafiro_family_stories` | `familia.ts` | `object[]` | Historias familiares |
| `zafiro_villa_phases` | `villa-esperanza.ts` | `object` | Fases de Villa Esperanza |
| `zafiro_villa_contributions` | `villa-esperanza.ts` | `object[]` | Contribuciones Villa Esperanza |
| `zafiro_economia` | `EconomiaPanel.tsx` | `object[]` | Operaciones económicas |
| `zafiro_dark` | `ZafiroUniverse.tsx` | `string` | Modo oscuro (true/false) |
| `zafiro_chat_messages` | `ZafiroUniverse.tsx` | `object[]` | Mensajes de chat |
| `zafiro_messages` | `messages/page.tsx` | `object[]` | Mensajes internos |
| `zafiro_contact_messages` | `contact/page.tsx` | `object[]` | Mensajes de contacto |
| `zafiro_following` | `profile-page/page.tsx` | `string[]` | Usuarios seguidos |

**Total: ~60+ claves únicas** de localStorage con prefijo `zafiro_`.

### 7.2 Patrón de Acceso

Todas las claves siguen el patrón:
```typescript
const KEY = "zafiro_<modulo>"
function get(): T[] { return JSON.parse(localStorage.getItem(KEY) || "[]") }
function set(data: T[]): void { localStorage.setItem(KEY, JSON.stringify(data)) }
```

**Problemas:**
- Sin validación de esquema al leer
- Sin manejo de corrupción de datos
- Sin migración entre versiones
- Sin sincronización entre pestañas
- Límite de ~5MB por dominio (localStorage)

---

## 8. Security Architecture

### 8.1 Capas de Seguridad

| Capa | Implementación | Estado |
|------|---------------|--------|
| **Autenticación** | localStorage fallback + SHA-256 hardcoded salt | ⚠️ Funcional pero inseguro |
| **Supabase Auth** | Declarado, 0 credenciales configuradas | ❌ No funcional |
| **PIN de Seguridad** | `security-lock.ts` — PIN + intentos + lockout | ⚠️ Solo client-side |
| **Owner Firewall** | `eliana/owner-firewall.ts` — control de acceso del owner | ⚠️ Sin backend |
| **Role Guards** | `require-role.ts` — jerarquía owner > admin > cashier > sponsor > viewer > user | ⚠️ Sin verificación server-side |
| **AAL2 Guard** | `require-aal2.ts` — nivel de autenticación avanzado | ⚠️ Sin backend |
| **CSP Headers** | `next.config.ts` — Content-Security-Policy completa | ✅ Configurado |
| **Rate Limiting** | `/api/chat` — 30 req/min por IP | ✅ Funcional |
| **Dispositivos Owner** | `owner-devices.ts` — registro, confianza, revocación | ✅ Funcional (localStorage) |
| **Firma 369** | `firma-369.ts` — sistema de firmas simbólicas | ⚠️ Simbólico, no criptográfico |

### 8.2 Headers de Seguridad (next.config.ts)

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;
  connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

**Vulnerabilidades identificadas:**
- `'unsafe-eval'` y `'unsafe-inline'` en CSP reducen la protección
- Contraseña hasheada con salt hardcodeado (`zafiro_salt_v1`) — vulnerable a rainbow tables
- Todo el control de acceso es client-side — sin verificación server-side
- Roles almacenados en localStorage — manipulables
- No hay middleware de autenticación en API routes
- Token VERCEL_OIDC_TOKEN expuesto en .env.local (según AGENTS.md)

---

## 9. Integration Points

### 9.1 Servicios Externos

| Servicio | Integración | Estado | Credenciales |
|----------|------------|--------|--------------|
| **Supabase** | Client + SSR | ❌ Sin config | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — no configuradas |
| **Stripe** | Server + Webhook | ✅ Parcial | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| **Google Gemini** | API REST directa | ✅ Parcial | `GEMINI_API_KEY` |
| **Unsplash CDN** | URLs hardcodeadas | ⚠️ Frágil | 20+ URLs en `zafiro-data.ts` y `comentarios.ts` |
| **WhatsApp** | Webhook + Cliente | ⚠️ Parcial | Configuración pendiente |
| **Vercel** | Deploy automático | ✅ Funcional | Via git push |
| **LightningCSS** | Win32 native binary | ✅ Opcional | `lightningcss-win32-x64-msvc` |

### 9.2 Dependencias de CDN (Sin Fallback Local)

Las 20+ URLs de Unsplash están hardcodeadas en:
- `src/lib/zafiro-data.ts` — 26 referencias
- `src/lib/comentarios.ts` — 5 referencias
- `src/app/page.tsx` — 2 referencias

**Riesgo:** Si Unsplash cambia URLs, rate-limita, o cae, las imágenes de toda la app se rompen.

### 9.3 Base de Conocimiento ELIANA

```
src/lib/knowledge.ts → loadKnowledgeBase() → carga datasets desde archivos JSON
src/lib/knowledge-data.ts → datos generados por build:knowledge script
src/lib/eliana/knowledge/ → 5 módulos (chunker, domain-data, knowledge-registry, rag-engine, retrieval)
src/lib/eliana/system-prompt.ts → prompt del sistema ELIANA
src/lib/knowledge-schema.ts (config/) → esquema de conocimiento
```

ELIANA opera con:
1. **Gemini API** (si GEMINI_API_KEY está configurada)
2. **Fallback local** — match de keywords con respuestas hardcodeadas en `/api/chat`
3. **Knowledge base** — datasets pre-generados por `scripts/generate-knowledge-data.mjs`

### 9.4 Migraciones SQL (11 archivos — nunca ejecutadas)

| Migración | Contenido |
|-----------|-----------|
| `00001_auth_roles_profiles` | Roles, perfiles, autenticación |
| `00002_economia_schema` | Esquema económico |
| `00003_frequency_origin` | Frecuencia de origen |
| `00003_seals_module` | Módulo de sellos |
| `00004_rls_frequency_origin` | Row Level Security para frecuencia |
| `00005_identity_system` | Sistema de identidad |
| `00006_family_cloud` | Nube familiar (17 tablas) |
| `00007_exchange_rates` | Tasas de cambio |
| `00008_owner_profiles` | Perfiles del owner |
| `00009_owner_devices` | Dispositivos del owner |
| `00010_profiles_memberships_stripe` | Perfiles, membresías, Stripe |

**Estado:** Archivos SQL listos pero Supabase no tiene credenciales, por lo que **0 migraciones han sido ejecutadas contra una base de datos real**.

---

## 10. Gaps & Inconsistencies

### 10.1 Bloqueantes Críticos

| # | Gap | Impacto | Archivos Afectados |
|---|-----|---------|-------------------|
| 1 | **Supabase sin credenciales** | Auth, DB, RLS, sync — todo bloqueado | `supabase.ts`, `supabase-server.ts`, todas las API routes |
| 2 | **VERCEL_OIDC_TOKEN expuesto** en .env.local | Seguridad del deploy comprometida | `.env.local` |
| 3 | **Tests rotos** — 4 tests importan paquetes eliminados | 0 tests ejecutables | `tests/*.test.ts` |
| 4 | **11 migraciones SQL sin ejecutar** | Esquema de DB inexistente en Supabase | `supabase/migrations/` |

### 10.2 Deudas Técnicas

| # | Deuda | Detalle |
|---|-------|---------|
| 5 | **localStorage como única fuente de verdad** | ~60 claves, 5MB límite, sin sync, sin backup, sin migración |
| 6 | **Auth sin backend** | SHA-256 con salt hardcodeado, sin rate limiting en registro |
| 7 | **Control de acceso client-side** | Roles manipulables, sin verificación server-side |
| 8 | **Sin tests** | 0 tests ejecutables en todo el proyecto |
| 9 | **Imágenes 100% CDN** | 20+ URLs de Unsplash hardcodeadas, sin fallback local |
| 10 | **53 lib modules sin tree-shaking** | Todos se importan sin lazy loading |
| 11 | **~50 unused-vars warnings** | Código muerto sin limpiar |
| 12 | **PWA manifest duplicado** | `manifest.json` y `manifest.webmanifest` |
| 13 | **SVG icons para PWA** | `sizes: "any"` no soportado en todos los navegadores |
| 14 | **Sin robots.txt / sitemap.xml** | SEO comprometido |
| 15 | **Paquetes monorepo sin usage** | `eliana/`, `frequency-origin/`, `holo-cinema/` — presencia física sin importaciones claras |

### 10.3 Inconsistencias de Arquitectura

| # | Inconsistencia | Detalle |
|---|---------------|---------|
| 16 | **"use client" universal** | Las 105 páginas son client components — no hay Server Components para optimizar |
| 17 | **Auth bridge dual** | `auth.ts` + `auth-bridge.ts` — dos sistemas paralelos |
| 18 | **Doble ruta de perfil** | `/mi-perfil` + `/profile-page` + `/zafiro/perfil` — 3 ubicaciones para perfil |
| 19 | **API routes sin auth middleware** | Ninguna API route verifica sesión del usuario |
| 20 | **Eliana engine duplicado** | `lib/eliana/engine.ts` (client) + `/api/chat/route.ts` (server) — dos motores paralelos |
| 21 | **Conocimiento estático + dinámico** | `knowledge-data.ts` (build time) + `knowledge.ts` (runtime) — dos fuentes |
| 22 | **Security guards sin uso efectivo** | `require-role.ts` y `require-aal2.ts` requieren Supabase client que no existe |
| 23 | **Owner hardcodeado** | Email `com8msm@gmail.com` hardcodeado en `owner.ts` — no configurable |
| 24 | **3 ESLint errors** | `require()` en `scripts/*.cjs` — rompe lint pero no build |

### 10.4 Métricas de Calidad

| Métrica | Valor |
|---------|-------|
| Páginas | 105 |
| API Routes | 19 |
| Componentes React | 43 |
| Lib Modules | 53 |
| Security Guards | 2 |
| Migraciones SQL | 11 |
| Tests ejecutables | 0 |
| Claves localStorage | ~60 |
| Imágenes locales | 15 WebP + 5 SVG |
| Imágenes CDN | 20+ URLs Unsplash |
| Errores build | 0 |
| Errores lint | 3 |
| Warnings lint | ~50 |
| Paquetes monorepo | 4 (3 sin uso verificado) |
| ENV vars requeridas | 8 (3 configuradas) |

---

*Documento generado automáticamente el 2026-07-18 por auditoría del código fuente.*
*Basado en commit `278b81c` de la rama `main`.*

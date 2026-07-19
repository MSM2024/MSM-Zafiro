# Documento 4: Inventario de Rutas y Componentes

**Repositorio:** https://github.com/MSM2024/MSM-Zafiro.git
**Rama:** `main` | **Commit:** `278b81c`
**Fecha:** 2026-07-17

---

## Resumen

| Métrica | Valor |
|---------|-------|
| Archivos `page.tsx` | 105 |
| Archivos `route.ts` (API) | 19 |
| Directorios de ruta | 50 |
| Componentes (`/src/components/`) | 43 |
| Módulos lib (`/src/lib/`) | 75 |
| Todos los pages son `'use client'` | Sí |

---

## 1. Páginas Públicas

| Ruta | Archivo | localStorage | API externa | Unsplash |
|------|---------|:---:|:---:|:---:|
| `/` | `src/app/page.tsx` | Sí | Sí (chat) | No |
| `/about` | `src/app/about/page.tsx` | No | No | No |
| `/what-we-do` | `src/app/what-we-do/page.tsx` | No | No | No |
| `/how-it-works` | `src/app/how-it-works/page.tsx` | No | No | No |
| `/ecosystem` | `src/app/ecosystem/page.tsx` | No | No | No |
| `/vision` | `src/app/vision/page.tsx` | No | No | No |
| `/mission` | `src/app/mission/page.tsx` | No | No | No |
| `/values` | `src/app/values/page.tsx` | No | No | No |
| `/help` | `src/app/help/page.tsx` | No | No | No |
| `/terms` | `src/app/terms/page.tsx` | No | No | No |
| `/privacy` | `src/app/privacy/page.tsx` | No | No | No |
| `/rules` | `src/app/rules/page.tsx` | No | No | No |
| `/contact` | `src/app/contact/page.tsx` | Sí | No | No |
| `/memberships` | `src/app/memberships/page.tsx` | Sí | Sí (Stripe) | No |
| `/offline` | `src/app/offline/page.tsx` | No | No | No |

---

## 2. Auth (`/auth/*`)

| Ruta | Archivo | localStorage | API externa | Unsplash |
|------|---------|:---:|:---:|:---:|
| `/auth/login` | `src/app/auth/login/page.tsx` | Sí | Supabase (fallback) | No |
| `/auth/register` | `src/app/auth/register/page.tsx` | Sí | Supabase (fallback) | No |
| `/auth/recover` | `src/app/auth/recover/page.tsx` | Sí | Supabase (fallback) | No |
| `/auth/verify` | `src/app/auth/verify/page.tsx` | Sí | Supabase (fallback) | No |

---

## 3. Perfil / Identidad

| Ruta | Archivo | localStorage | API externa | Unsplash |
|------|---------|:---:|:---:|:---:|
| `/mi-perfil` | `src/app/mi-perfil/page.tsx` | Sí | No | No |
| `/mi-perfil/seguridad` | `src/app/mi-perfil/seguridad/page.tsx` | Sí | No | No |
| `/mi-perfil/membresia` | `src/app/mi-perfil/membresia/page.tsx` | Sí | Sí (Stripe) | No |
| `/mi-perfil/verificacion` | `src/app/mi-perfil/verificacion/page.tsx` | Sí | No | No |
| `/perfil/[username]` | `src/app/perfil/[username]/page.tsx` | Sí | No | No |
| `/profile-page` | `src/app/profile-page/page.tsx` | Sí | No | Sí |
| `/profile-page/edit` | `src/app/profile-page/edit/page.tsx` | Sí | No | No |
| `/profile-page/connections` | `src/app/profile-page/connections/page.tsx` | Sí | No | No |
| `/profile-page/projects` | `src/app/profile-page/projects/page.tsx` | Sí | No | No |
| `/settings` | `src/app/settings/page.tsx` | Sí | No | No |

---

## 4. VIP

| Ruta | Archivo | localStorage | API externa | Unsplash |
|------|---------|:---:|:---:|:---:|
| `/vip` | `src/app/vip/page.tsx` | Sí | No | No |
| `/vip/beneficios` | `src/app/vip/beneficios/page.tsx` | Sí | No | No |

---

## 5. KYC

| Ruta | Archivo | localStorage | API externa | Unsplash |
|------|---------|:---:|:---:|:---:|
| `/kyc/inicio` | `src/app/kyc/inicio/page.tsx` | Sí | No | No |
| `/kyc/consentimiento` | `src/app/kyc/consentimiento/page.tsx` | Sí | No | No |
| `/kyc/datos` | `src/app/kyc/datos/page.tsx` | Sí | No | No |
| `/kyc/documento` | `src/app/kyc/documento/page.tsx` | Sí | No | No |
| `/kyc/estado` | `src/app/kyc/estado/page.tsx` | Sí | No | No |

---

## 6. Emprendedor

| Ruta | Archivo | localStorage | API externa | Unsplash |
|------|---------|:---:|:---:|:---:|
| `/emprendedor` | `src/app/emprendedor/page.tsx` | Sí | No | No |
| `/emprendedor/registro` | `src/app/emprendedor/registro/page.tsx` | Sí | No | No |
| `/emprendedor/verificacion` | `src/app/emprendedor/verificacion/page.tsx` | Sí | No | No |
| `/emprendedor/equipo` | `src/app/emprendedor/equipo/page.tsx` | Sí | No | No |
| `/emprendedor/beneficiarios` | `src/app/emprendedor/beneficiarios/page.tsx` | Sí | No | No |

---

## 7. Sellos

| Ruta | Archivo | localStorage | API externa | Unsplash |
|------|---------|:---:|:---:|:---:|
| `/sellos` | `src/app/sellos/page.tsx` | Sí | No | No |
| `/sellos/[numero]` | `src/app/sellos/[numero]/page.tsx` | Sí | No | No |
| `/sellos/aleatorio` | `src/app/sellos/aleatorio/page.tsx` | Sí | No | No |
| `/sellos/hoy` | `src/app/sellos/hoy/page.tsx` | Sí | No | No |
| `/sellos/favoritos` | `src/app/sellos/favoritos/page.tsx` | Sí | No | No |
| `/sellos/diario` | `src/app/sellos/diario/page.tsx` | Sí | No | No |
| `/admin/sellos` | `src/app/admin/sellos/page.tsx` | Sí | No | No |

---

## 8. Admin (`/admin/*` — 21 subpáginas)

| Ruta | Archivo | localStorage | API externa | Unsplash |
|------|---------|:---:|:---:|:---:|
| `/admin` | `src/app/admin/page.tsx` | Sí | No | No |
| `/admin/usuarios` | `src/app/admin/usuarios/page.tsx` | Sí | No | No |
| `/admin/vip` | `src/app/admin/vip/page.tsx` | Sí | No | No |
| `/admin/kyc` | `src/app/admin/kyc/page.tsx` | Sí | No | No |
| `/admin/kyc/[caseId]` | `src/app/admin/kyc/[caseId]/page.tsx` | Sí | No | No |
| `/admin/kyb` | `src/app/admin/kyb/page.tsx` | Sí | No | No |
| `/admin/kyb/[caseId]` | `src/app/admin/kyb/[caseId]/page.tsx` | Sí | No | No |
| `/admin/riesgos` | `src/app/admin/riesgos/page.tsx` | Sí | No | No |
| `/admin/auditoria` | `src/app/admin/auditoria/page.tsx` | Sí | No | No |
| `/admin/cripto` | `src/app/admin/cripto/page.tsx` | Sí | No | No |
| `/admin/tasas` | `src/app/admin/tasas/page.tsx` | Sí | No | No |
| `/admin/bpa` | `src/app/admin/bpa/page.tsx` | Sí | No | No |
| `/admin/logistica` | `src/app/admin/logistica/page.tsx` | Sí | No | No |
| `/admin/ratings` | `src/app/admin/ratings/page.tsx` | Sí | No | No |
| `/admin/financiamiento` | `src/app/admin/financiamiento/page.tsx` | Sí | No | No |
| `/admin/marketing` | `src/app/admin/marketing/page.tsx` | Sí | No | No |
| `/admin/dashboard-360` | `src/app/admin/dashboard-360/page.tsx` | Sí | No | No |
| `/admin/ledger` | `src/app/admin/ledger/page.tsx` | Sí | No | No |
| `/admin/clientes-confiable` | `src/app/admin/clientes-confiable/page.tsx` | Sí | No | No |
| `/admin/knowledge-import` | `src/app/admin/knowledge-import/page.tsx` | Sí | No | No |

---

## 9. Zafiro (`/zafiro/*` — 14 subpáginas)

| Ruta | Archivo | localStorage | API externa | Unsplash |
|------|---------|:---:|:---:|:---:|
| `/zafiro/perfil` | `src/app/zafiro/perfil/page.tsx` | Sí | No | No |
| `/zafiro/membresias` | `src/app/zafiro/membresias/page.tsx` | Sí | Sí (Stripe) | No |
| `/zafiro/terminos` | `src/app/zafiro/terminos/page.tsx` | Sí | No | No |
| `/zafiro/privacidad` | `src/app/zafiro/privacidad/page.tsx` | Sí | No | No |
| `/zafiro/reglas-comunidad` | `src/app/zafiro/reglas-comunidad/page.tsx` | Sí | No | No |
| `/zafiro/owner/dispositivos` | `src/app/zafiro/owner/dispositivos/page.tsx` | Sí | No | No |
| `/zafiro/admin/terminos` | `src/app/zafiro/admin/terminos/page.tsx` | Sí | No | No |
| `/zafiro/admin/perfiles` | `src/app/zafiro/admin/perfiles/page.tsx` | Sí | No | No |
| `/zafiro/admin/eliana/panel` | `src/app/zafiro/admin/eliana/panel/page.tsx` | Sí | No | No |
| `/zafiro/admin/eliana/inventario` | `src/app/zafiro/admin/eliana/inventario/page.tsx` | Sí | No | No |
| `/zafiro/admin/eliana/expedientes` | `src/app/zafiro/admin/eliana/expedientes/page.tsx` | Sí | No | No |
| `/zafiro/admin/eliana/directorio` | `src/app/zafiro/admin/eliana/directorio/page.tsx` | Sí | No | No |
| `/zafiro/admin/eliana/core` | `src/app/zafiro/admin/eliana/core/page.tsx` | Sí | No | No |
| `/zafiro/admin/eliana/conocimiento` | `src/app/zafiro/admin/eliana/conocimiento/page.tsx` | Sí | No | No |

---

## 10. Familia (`/familia/*` — 7 subpáginas)

| Ruta | Archivo | localStorage | API externa | Unsplash |
|------|---------|:---:|:---:|:---:|
| `/familia` | `src/app/familia/page.tsx` | Sí | No | No |
| `/familia/arbol` | `src/app/familia/arbol/page.tsx` | Sí | No | No |
| `/familia/cronologia` | `src/app/familia/cronologia/page.tsx` | Sí | No | No |
| `/familia/galeria` | `src/app/familia/galeria/page.tsx` | Sí | No | No |
| `/familia/historias` | `src/app/familia/historias/page.tsx` | Sí | No | No |
| `/familia/encuentro-2026` | `src/app/familia/encuentro-2026/page.tsx` | Sí | No | No |
| `/familia/invitacion` | `src/app/familia/invitacion/page.tsx` | Sí | No | No |

---

## 11. Villa Esperanza (`/villa-esperanza/*` — 6 subpáginas)

| Ruta | Archivo | localStorage | API externa | Unsplash |
|------|---------|:---:|:---:|:---:|
| `/villa-esperanza` | `src/app/villa-esperanza/page.tsx` | Sí | No | No |
| `/villa-esperanza/cabanas` | `src/app/villa-esperanza/cabanas/page.tsx` | Sí | No | No |
| `/villa-esperanza/santuario` | `src/app/villa-esperanza/santuario/page.tsx` | Sí | No | No |
| `/villa-esperanza/financiamiento` | `src/app/villa-esperanza/financiamiento/page.tsx` | Sí | No | No |
| `/villa-esperanza/villa-azul` | `src/app/villa-esperanza/villa-azul/page.tsx` | Sí | No | No |
| `/villa-esperanza/arbol-de-la-vida` | `src/app/villa-esperanza/arbol-de-la-vida/page.tsx` | Sí | No | No |

---

## 12. Economía

| Ruta | Archivo | localStorage | API externa | Unsplash |
|------|---------|:---:|:---:|:---:|
| `/economia` | `src/app/economia/page.tsx` | Sí | No | No |
| `/trading` | `src/app/trading/page.tsx` | Sí | No | No |

---

## 13. Extras

| Ruta | Archivo | localStorage | API externa | Unsplash |
|------|---------|:---:|:---:|:---:|
| `/eliana` | `src/app/eliana/page.tsx` | Sí | Sí (AI) | No |
| `/gemologia` | `src/app/gemologia/page.tsx` | Sí | Sí (AI) | No |
| `/holo-cinema` | `src/app/holo-cinema/page.tsx` | Sí | No | No |
| `/galaxia` | `src/app/galaxia/page.tsx` | Sí | No | No |
| `/universo` | `src/app/universo/page.tsx` | Sí | No | No |
| `/dashboard` | `src/app/dashboard/page.tsx` | Sí | No | No |
| `/visual-preview` | `src/app/visual-preview/page.tsx` | No | No | No |
| `/sponsors-page` | `src/app/sponsors-page/page.tsx` | Sí | No | No |
| `/rewards` | `src/app/rewards/page.tsx` | Sí | No | No |
| `/referidos` | `src/app/referidos/page.tsx` | Sí | No | No |
| `/messages` | `src/app/messages/page.tsx` | Sí | No | No |
| `/constitucion` | `src/app/constitucion/page.tsx` | No | No | No |
| `/impacto` | `src/app/impacto/page.tsx` | Sí | No | No |
| `/imperio` | `src/app/imperio/page.tsx` | Sí | No | No |

---

## 14. Rutas API (19 archivos `route.ts`)

| Ruta API | Archivo | Método | Descripción |
|----------|---------|--------|-------------|
| `/api/chat` | `src/app/api/chat/route.ts` | POST | Chat ELIANA (Gemini/OpenAI/Anthropic/fallback) |
| `/api/sync` | `src/app/api/sync/route.ts` | GET/POST | Sincronización de datos |
| `/api/profiles/create` | `src/app/api/profiles/create/route.ts` | POST | Crear perfil en Supabase |
| `/api/stripe/create-checkout-session` | `src/app/api/stripe/create-checkout-session/route.ts` | POST | Crear sesión Stripe Checkout |
| `/api/stripe/customer-portal` | `src/app/api/stripe/customer-portal/route.ts` | POST | Portal de facturación Stripe |
| `/api/stripe/webhook` | `src/app/api/stripe/webhook/route.ts` | POST | Webhook de Stripe |
| `/api/whatsapp/webhook` | `src/app/api/whatsapp/webhook/route.ts` | GET/POST | Webhook WhatsApp Business |
| `/api/eliana/chat` | `src/app/api/eliana/chat/route.ts` | POST | Chat ELIANA avanzado |
| `/api/eliana/feedback` | `src/app/api/eliana/feedback/route.ts` | POST | Feedback de ELIANA |
| `/api/eliana/audit` | `src/app/api/eliana/audit/route.ts` | GET | Auditoría de ELIANA |
| `/api/eliana/knowledge/search` | `src/app/api/eliana/knowledge/search/route.ts` | POST | Búsqueda de conocimiento |
| `/api/eliana/knowledge/upload` | `src/app/api/eliana/knowledge/upload/route.ts` | POST | Subida de conocimiento |
| `/api/economia/cierre` | `src/app/api/economia/cierre/route.ts` | POST | Cierre diario económico |
| `/api/legal/terms` | `src/app/api/legal/terms/route.ts` | GET/POST | Términos legales |
| `/api/legal/privacy` | `src/app/api/legal/privacy/route.ts` | GET/POST | Política de privacidad |
| `/api/owner/devices/register` | `src/app/api/owner/devices/register/route.ts` | POST | Registrar dispositivo owner |
| `/api/owner/devices/trust` | `src/app/api/owner/devices/trust/route.ts` | POST | Confiar en dispositivo |
| `/api/owner/devices/revoke` | `src/app/api/owner/devices/revoke/route.ts` | POST | Revocar dispositivo |
| `/api/owner/devices/sync` | `src/app/api/owner/devices/sync/route.ts` | POST | Sincronizar dispositivo |

---

## 15. Componentes (`/src/components/` — 43 archivos)

| Componente | Archivo | Categoría |
|-----------|---------|-----------|
| `Avatar` | `Avatar.tsx` | UI |
| `AuthBridgeInit` | `AuthBridgeInit.tsx` | Auth |
| `AddQuestionModal` | `AddQuestionModal.tsx` | Modular |
| `BottomNav` | `BottomNav.tsx` | Navegación |
| `DailyBrief` | `DailyBrief.tsx` | Contenido |
| `EconomiaPanel` | `EconomiaPanel.tsx` | Económico |
| `ElianaAvatar` | `ElianaAvatar.tsx` | ELIANA |
| `ElianaDiamond` | `ElianaDiamond.tsx` | ELIANA |
| `ElianaFloatingButton` | `ElianaFloatingButton.tsx` | ELIANA |
| `ExpertLeaderboard` | `ExpertLeaderboard.tsx` | Contenido |
| `Footer` | `Footer.tsx` | Navegación |
| `FounderChallenge` | `FounderChallenge.tsx` | Gamificación |
| `GalaxiaInfinita` | `GalaxiaInfinita.tsx` | Visual |
| `GenesisChamberBackground` | `GenesisChamberBackground.tsx` | Visual |
| `HoloCinemaCanvas` | `HoloCinemaCanvas.tsx` | Visual |
| `KnowledgeGraph` | `KnowledgeGraph.tsx` | Conocimiento |
| `ModuleAngels` | `ModuleAngels.tsx` | Seguridad |
| `NotificationsDropdown` | `NotificationsDropdown.tsx` | UI |
| `ParticlesBackground` | `ParticlesBackground.tsx` | Visual |
| `PortalGenesis` | `PortalGenesis.tsx` | Visual |
| `PresenciaInstantanea` | `PresenciaInstantanea.tsx` | Social |
| `SponsorAnalyticsChart` | `SponsorAnalyticsChart.tsx` | Sponsors |
| `SponsorDetailModal` | `SponsorDetailModal.tsx` | Sponsors |
| `SponsorFloatingBar` | `SponsorFloatingBar.tsx` | Sponsors |
| `StarRating` | `StarRating.tsx` | UI |
| `StoriesBar` | `StoriesBar.tsx` | Social |
| `StoryViewer` | `StoryViewer.tsx` | Social |
| `StripeModal` | `StripeModal.tsx` | Pagos |
| `TrendsSection` | `TrendsSection.tsx` | Contenido |
| `ZafiroLockScreen` | `ZafiroLockScreen.tsx` | Seguridad |
| `ZafiroUniverse` | `ZafiroUniverse.tsx` | Visual |
| `eliana/ResponseActionBar` | `eliana/ResponseActionBar.tsx` | ELIANA |
| `gemology/AiAssistant` | `gemology/AiAssistant.tsx` | Gemología |
| `gemology/GemLab` | `gemology/GemLab.tsx` | Gemología |
| `gemology/Handbook` | `gemology/Handbook.tsx` | Gemología |
| `gemology/LoreExplorer` | `gemology/LoreExplorer.tsx` | Gemología |
| `sellos/SealCard` | `sellos/SealCard.tsx` | Sellos |
| `sellos/SealVisualGrid` | `sellos/SealVisualGrid.tsx` | Sellos |
| `ui/GlassCard` | `ui/GlassCard.tsx` | UI Kit |
| `ui/GradientText` | `ui/GradientText.tsx` | UI Kit |
| `ui/NetworkBackground` | `ui/NetworkBackground.tsx` | UI Kit |
| `ui/Skeleton` | `ui/Skeleton.tsx` | UI Kit |
| `ui/StatCard` | `ui/StatCard.tsx` | UI Kit |

---

## 16. Módulos Lib (`/src/lib/` — 75 archivos)

### Core
| Módulo | Archivo | Descripción |
|--------|---------|-------------|
| `auth` | `auth.ts` | Autenticación mock + Supabase |
| `auth-bridge` | `auth-bridge.ts` | Puente auth multi-página |
| `supabase` | `supabase.ts` | Cliente Supabase browser |
| `supabase-server` | `supabase-server.ts` | Cliente Supabase server |
| `stripe-server` | `stripe-server.ts` | Helpers Stripe server |
| `usePageTitle` | `usePageTitle.ts` | Hook SEO |

### Identidad / Perfiles
| Módulo | Archivo | Descripción |
|--------|---------|-------------|
| `profile` | `profile.ts` | Perfiles de usuario |
| `identity` | `identity.ts` | Sistema identidad v2 |
| `owner` | `owner.ts` | Owner profile + audit |
| `owner-devices` | `owner-devices.ts` | Dispositivos owner |
| `memberships` | `memberships.ts` | Membresías + Stripe |
| `plans` | `plans.ts` | Planes de membresía |
| `angel-security` | `angel-security.ts` | MFA + seguridad ángeles |
| `security-middleware` | `security-middleware.ts` | Middleware de seguridad |
| `security-lock` | `security-lock.ts` | PIN + lockout |

### Económico
| Módulo | Archivo | Descripción |
|--------|---------|-------------|
| `EconomiaService` | `EconomiaService.ts` | Servicio económico |
| `economia-v109.config` | `economia-v109.config.ts` | Configuración económica |
| `ledger` | `ledger.ts` | Ledger maestro |
| `tasas` | `tasas.ts` | Tasas de cambio Cuba |
| `bpa-mirror` | `bpa-mirror.ts` | Mirror BPA |
| `cripto-activos` | `cripto-activos.ts` | Activos cripto |
| `trading-strategy` | `trading-strategy.ts` | Estrategia trading |
| `financiamiento` | `financiamiento.ts` | Campañas financiamiento |
| `firma-369` | `firma-369.ts` | Firma digital 369 |
| `logistica-contenedores` | `logistica-contenedores.ts` | Logística contenedores |
| `cliente-confiable` | `cliente-confiable.ts` | Clientes de confianza |
| `ratings` | `ratings.ts` | Sistema de ratings |
| `presencia` | `presencia.ts` | Presencia instantánea |

### ELIANA / IA
| Módulo | Archivo | Descripción |
|--------|---------|-------------|
| `ai/providers` | `ai/providers.ts` | Gemini/OpenAI/Anthropic |
| `eliana/engine` | `eliana/engine.ts` | Motor ELIANA |
| `eliana/types` | `eliana/types.ts` | Tipos ELIANA |
| `eliana/system-prompt` | `eliana/system-prompt.ts` | System prompt |
| `eliana/server-store` | `eliana/server-store.ts` | Storage server-side |
| `eliana/response-filter` | `eliana/response-filter.ts` | Filtro de respuestas |
| `eliana/omnicanal` | `eliana/omnicanal.ts` | Omnicanal (dir, exp, inv) |
| `eliana/memory` | `eliana/memory.ts` | Memoria ELIANA |
| `eliana/feedback` | `eliana/feedback.ts` | Feedback ELIANA |
| `eliana/knowledge` | `eliana/knowledge.ts` | Grafo de conocimiento |
| `eliana/correlation` | `eliana/correlation.ts` | Correlación trazas |
| `eliana/analysis` | `eliana/analysis.ts` | Análisis ELIANA |
| `eliana/recommendations` | `eliana/recommendations.ts` | Recomendaciones |
| `eliana/intent-classifier` | `eliana/intent-classifier.ts` | Clasificador de intención |
| `eliana/owner-firewall` | `eliana/owner-firewall.ts` | Firewall owner |
| `eliana/remesas` | `eliana/remesas.ts` | Remesas |
| `eliana/core/eliana-core` | `eliana/core/eliana-core.ts` | Core ELIANA |
| `eliana/core/rules-engine` | `eliana/core/rules-engine.ts` | Motor de reglas |
| `eliana/core/sync-protocol` | `eliana/core/sync-protocol.ts` | Protocolo sincronización |
| `eliana/core/agent-registry` | `eliana/core/agent-registry.ts` | Registro agentes |
| `eliana/knowledge/retrieval` | `eliana/knowledge/retrieval.ts` | Retrieval conocimiento |
| `eliana/knowledge/rag-engine` | `eliana/knowledge/rag-engine.ts` | Motor RAG |
| `eliana/knowledge/knowledge-registry` | `eliana/knowledge/knowledge-registry.ts` | Registro conocimiento |
| `eliana/knowledge/domain-data` | `eliana/knowledge/domain-data.ts` | Datos de dominio |
| `eliana/knowledge/chunker` | `eliana/knowledge/chunker.ts` | Chunking |

### Contenido / Datos
| Módulo | Archivo | Descripción |
|--------|---------|-------------|
| `zafiro-data` | `zafiro-data.ts` | Datos mock (stories, preguntas, experts) |
| `seals-data` | `seals-data.ts` | Datos sellos (150 salmos) |
| `knowledge-data` | `knowledge-data.ts` | Base conocimiento hardcoded |
| `knowledge` | `knowledge.ts` | Motor de conocimiento |
| `comentarios` | `comentarios.ts` | Comentarios y publicaciones |
| `gemology-data` | `gemology-data.ts` | Datos gemología |
| `gemology-types` | `gemology-types.ts` | Tipos gemología |
| `import-whatsapp-knowledge` | `import-whatsapp-knowledge.ts` | Importar knowledge WhatsApp |

### Otros
| Módulo | Archivo | Descripción |
|--------|---------|-------------|
| `referidos` | `referidos.ts` | Sistema de referidos |
| `rewards` | `rewards.ts` | Recompensas |
| `registrar-codigos` | `registrar-codigos.ts` | Registrar códigos |
| `marketing` | `marketing.ts` | Assets marketing |
| `email-service` | `email-service.ts` | Servicio email simulado |
| `whatsapp-client` | `whatsapp-client.ts` | Cliente WhatsApp |
| `impacto-social` | `impacto-social.ts` | Impacto social |
| `ecosistema` | `ecosistema.ts` | Ecosistema MSM |
| `conflict-detector` | `conflict-detector.ts` | Detector de conflictos |
| `FrequencyOriginService` | `FrequencyOriginService.ts` | Servicio frecuencia origen |
| `familia` | `familia.ts` | Nube familiar |
| `villa-esperanza` | `villa-esperanza.ts` | Villa Esperanza |
| `universo` | `universo.ts` | Universo ZAFIRO |
| `legal/terms-engine` | `legal/terms-engine.ts` | Motor legal |

---

## Observaciones

1. **100% client-side**: Todos los `page.tsx` usan `'use client'`. No hay server components para páginas.
2. **localStorage omnipresente**: ~95% de las páginas dependen de localStorage para persistencia.
3. **API dependency**: Solo ~5 páginas dependen de APIs externas (Stripe, Supabase, AI).
4. **Unsplash**: Ninguna imagen Unsplash se usa directamente en componentes de página — las imágenes provienen de `zafiro-data.ts` y `comentarios.ts` que ahora usan `ZAFIRO_ASSETS` (migrados a WebP local).
5. **Layout único**: Solo 1 `layout.tsx` raíz en `src/app/layout.tsx`.

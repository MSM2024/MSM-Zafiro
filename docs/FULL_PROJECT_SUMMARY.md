# FULL PROJECT SUMMARY — ZAFIRO

## ¿Qué existe hoy?
ZAFIRO es un monorepo Next.js 16 (App Router) con 39 rutas, 8 paquetes internos en `packages/`, sistema de autenticación dual (Supabase SSR + localStorage), y módulos de economía, frecuencia origen, guardianes, eventos, ELIANA, WhatsApp, sincronización y PWA.

## ¿Qué funciona?
- Build: 0 errores, 0 warnings
- 39 rutas estáticas y dinámicas + 1 Proxy
- Auth dual: login, registro, recuperación, verificación
- Planes y suscripciones en /terms (Stripe simulado)
- Roles: usuario, colaborador, admin, superadmin
- 4 migraciones SQL de Supabase (auth, economía, frecuencia, RLS)
- PWA: manifest.webmanifest, service worker, offline page
- WhatsApp Business webhook endpoint
- Sync Engine: cola con backoff exponencial
- 18 tests unitarios (todos pasan)
- MSM Economía UI panel
- Avatar ELIANA con GuardianRing

## ¿Qué está conectado?
- Supabase configurado (env vars) pero sin projecto activo — fallback a localStorage
- Stripe configurado (env vars) pero simulado
- Gemini API configurado (env var) pero no integrado
- Vercel: proyecto `msm-zafiro` conectado a GitHub

## ¿Qué está simulado?
- Stripe: claves en .env.local, sin webhooks reales, StripeModal es placeholder
- Supabase: clientes configurados pero app opera en localStorage fallback
- Gemini: API key presente pero no usada en producción
- WhatsApp: webhook endpoint listo, sin número real registrado en Meta
- Sync Engine: endpoint /api/sync listo, sin lógica real de base de datos
- Economía: operaciones en localStorage, sin persistencia en Supabase

## ¿Qué está repetido?
1. **ELIANA**: `src/lib/eliana/` (5 archivos: engine, types, analysis, knowledge, memory, recommendations) vs `packages/eliana/` (process-message.ts)
2. **Frecuencia Origen**: `src/lib/frecuencia-origen.config.ts` + `FrequencyOriginService.ts` vs `packages/frequency-origin/`
3. **WhatsApp**: `src/lib/whatsapp-client.ts` + `src/app/api/whatsapp/` vs `packages/whatsapp/` (eliana-visual-writer.ts)
4. **Ecosistema**: `src/lib/ecosistema.ts` vs `src/lib/universo.ts`
5. **Gemología**: `src/lib/gemology-data.ts` + `gemology-types.ts` vs `src/lib/knowledge.ts`
6. **Tipos de usuario**: `src/lib/auth.ts` (AuthUser, Profile) vs `packages/types/src/zafiro.ts` (ZafiroUser)
7. **localStorage keys**: 17 keys dispersas sin centralización
8. **Manifest**: `public/manifest.json` (old) vs `public/manifest.webmanifest` (new) — layout.tsx apunta a manifest.json

## ¿Qué debe unirse?
| Grupo | Fuentes actuales | Destino |
|-------|-----------------|---------|
| ELIANA | src/lib/eliana/ + packages/eliana/ | packages/eliana/ |
| Economía | src/lib/EconomiaService.ts + economia-v109.config.ts + src/components/EconomiaPanel.tsx + packages/sync/ | packages/economy/ |
| Frecuencia Origen | src/lib/frecuencia-origen.config.ts + FrequencyOriginService.ts + packages/frequency-origin/ | packages/frequency-origin/ |
| WhatsApp | src/lib/whatsapp-client.ts + packages/whatsapp/ + src/app/api/whatsapp/ | packages/whatsapp/ |
| Event Bus | packages/events/ + src/lib/EconomiaService.ts internal events | packages/events/ |
| Offline | packages/offline/ + packages/sync/ | packages/offline/ |
| Types | packages/types/ + interfaces dispersas en src/lib/ | packages/types/ |
| Auth | src/lib/auth.ts + src/lib/supabase.ts + src/proxy.ts | packages/auth/ |

## ¿Qué se puede retirar?
- `public/manifest.json` → reemplazado por manifest.webmanifest
- `src/lib/eliana/analysis.ts` → no usado
- `src/lib/eliana/recommendations.ts` → no usado
- `src/lib/eliana/knowledge.ts` → duplicado de packages/eliana/
- `src/lib/eliana/memory.ts` → duplicado de packages/eliana/
- `src/lib/ecosistema.ts` → reemplazado por universo.ts
- `src/lib/gemology-types.ts` → fusionable con gemology-data.ts

## ¿Qué falta para la beta?
1. Conexión real a Supabase (base de datos funcionando)
2. Stripe funcional (checkout + webhooks)
3. Gemini API integrada con ELIANA
4. WhatsApp Business número real verificado
5. IndexedDB para almacenamiento offline persistente
6. Sync Engine conectado a Supabase real
7. Pantallas de onboarding y registro pulidas
8. Pruebas de integración

## ¿Qué falta para producción?
1. Stripe en modo live
2. Supabase en producción
3. Monitoreo y alertas (Sentry/Vercel Analytics)
4. Términos legales finalizados y publicados
5. Pruebas e2e completas
6. Auditoría de seguridad
7. Documentación de API pública
8. CI/CD pipeline completo

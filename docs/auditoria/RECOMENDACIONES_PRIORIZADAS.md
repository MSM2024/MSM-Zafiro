# Documento 11 — Recomendaciones Priorizadas

**Repositorio**: `https://github.com/MSM2024/MSM-Zafiro.git`
**Rama**: `main` · **Commit**: `278b81c`
**Fecha**: 2026-07-18
**Alcance**: Acciones correctivas ordenadas por impacto y urgencia

---

## Matriz de Priorización

| Prioridad | Impacto | Esfuerzo | Categoría |
|-----------|---------|----------|-----------|
| P0 — CRÍTICO | Seguridad inmediata | Bajo | Rotación de secretos |
| P1 — ALTO | Funcionalidad core | Medio | Arquitectura auth/DB |
| P2 — MEDIO | Calidad y confiabilidad | Medio | Infraestructura |
| P3 — BAJO | Mejoras incrementales | Alto | Optimización |

---

## P0 — CRÍTICO (Hacer HOY)

### 1. Rotar VERCEL_OIDC_TOKEN

**Problema**: Token OIDC completo visible en `.env.local`, que fue commiteado al historial de git.

**Acción**:
1. Ir a Vercel Dashboard → Project → Settings → Environment Variables
2. Eliminar el token actual
3. Generar nuevo token OIDC
4. Si `.env.local` fue commiteado: `git filter-branch` o BFG Repo Cleaner para eliminar del historial
5. Verificar que `.gitignore` excluye `.env.local` (actualmente sí, líneas 33-37 de `.gitignore`)

**Archivos**: `.env.local`, `.gitignore`
**Esfuerzo**: 30 minutos
**Riesgo si no se hace**: Token puede ser extraído del historial de git y usado para acceder a Vercel

---

### 2. Decisión Arquitectónica: Supabase o localStorage

**Problema**: El código intenta usar Supabase en cada operación pero nunca conecta. Crea complejidad innecesaria y falsas expectativas.

**Opción A — Supabase** (recomendada si hay presupuesto):
1. Crear proyecto Supabase
2. Configurar variables en Vercel Dashboard
3. Ejecutar las 11 migraciones de `supabase/migrations/`
4. Eliminar toda la lógica de fallback localStorage en `auth.ts`
5. Configurar RLS policies

**Opción B — localStorage-only** (recomendada si presupuesto es 0):
1. Eliminar imports de Supabase de `auth.ts`, `supabase.ts`
2. Eliminar `@supabase/ssr` y `@supabase/supabase-js` de `package.json`
3. Eliminar archivos `supabase/migrations/*.sql` (o mover a `docs/` como referencia)
4. Eliminar `require-aal2.ts`, `require-role.ts` (ya eliminados)
5. Documentar claramente que auth es local-only

**Archivos afectados**: `src/lib/auth.ts`, `src/lib/supabase.ts`, `src/lib/angel-security.ts`, `supabase/migrations/*`, `package.json`
**Esfuerzo**: 2-4 horas (Opción B), 1-2 días (Opción A)
**Riesgo si no se hace**: Confusión constante entre qué funciona y qué no

---

## P1 — ALTO (Esta semana)

### 3. Configurar WhatsApp Access Token y App Secret

**Problema**: Webhook de WhatsApp no puede responder mensajes ni verificar firmas POST.

**Acción**:
1. Obtener `WHATSAPP_ACCESS_TOKEN` desde Meta Business Dashboard
2. Obtener `WHATSAPP_APP_SECRET` desde Meta App Settings
3. Configurar en Vercel Dashboard (Environment Variables)
4. Verificar que el webhook recibe y procesa mensajes

**Archivos**: `.env.example` (líneas 37-40), `src/app/api/whatsapp/webhook/route.ts`
**Esfuerzo**: 1 hora
**Riesgo si no se hace**: WhatsApp ELIANA completamente inoperativo

---

### 4. Corregir security-middleware.ts para Server-Side

**Problema**: `authenticateRequest()` siempre retorna 401 porque `getSession()` lee de localStorage.

**Acción** (si se elige Opción A — Supabase):
```typescript
// Reemplazar validateSession() para que use Supabase server-side
export function validateSession(req?: NextRequest) {
  // Usar cookies o Authorization header en vez de localStorage
  const token = req?.headers.get('authorization')?.replace('Bearer ', '')
  // Validar con Supabase server-side
}
```

**Acción** (si se elige Opción B — localStorage):
- Eliminar `security-middleware.ts` completamente
- Las API routes no necesitan auth si son todas públicas
- Agregar rate limiting por IP como único control

**Archivos**: `src/lib/security-middleware.ts`, `src/lib/angel-security.ts:341-350`
**Esfuerzo**: 2-3 horas
**Riesgo si no se hace**: Todas las API routes son inaccesibles (401) o completamente abiertas

---

### 5. Configurar al menos un API Key de AI

**Problema**: ELIANA solo responde con knowledge base local, sin capacidades de AI real.

**Acción recomendada**:
1. Crear cuenta en Google AI Studio (gratis para Gemini 1.5 Flash)
2. Obtener `GEMINI_API_KEY`
3. Configurar en Vercel Dashboard
4. Verificar que `/api/eliana/chat` responde con AI generada

**Archivos**: `src/lib/ai/providers.ts:24`, `.env.example:24`
**Esfuerzo**: 30 minutos
**Costo**: Gratis (tier gratuito de Gemini)
**Riesgo si no se hace**: ELIANA es un chatbot de FAQ, no una AI

---

### 6. Resolver Tests Huérfanos

**Problema**: 4 archivos de test importan paquetes eliminados. No hay test runner.

**Acción**:
1. **Eliminar** los 4 archivos de test huérfanos: `tests/adaptive-router.test.ts`, `tests/digital-twin.test.ts`, `tests/portable-eliana.test.ts`, `tests/sync-queue.test.ts`
2. **Eliminar** `tests/package.json` vacío
3. **Configurar** vitest en el proyecto raíz
4. **Crear** 1-2 tests básicos para paths críticos

**Archivos**: `tests/*.test.ts`, `tests/package.json`, `package.json`
**Esfuerzo**: 1-2 horas
**Riesgo si no se hace**: Confusión sobre estado de testing, imports rotos si alguien intenta ejecutar

---

## P2 — MEDIO (Próximas 2 semanas)

### 7. Rate Limiting Real en Producción

**Problema**: Rate limiting in-memory se reinicia en cada cold start de Vercel.

**Acción**:
1. Registrar cuenta en Upstash (tier gratuito: 10,000 comandos/día)
2. Instalar `@upstash/ratelimit` y `@upstash/redis`
3. Reemplazar `Map` en `angel-security.ts:249` y `eliana/chat/route.ts:14`

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "60 s"),
});
```

**Archivos**: `src/lib/angel-security.ts`, `src/app/api/eliana/chat/route.ts`
**Esfuerzo**: 2-3 horas
**Costo**: Gratis (tier gratuito)
**Riesgo si no se hace**: Ataques de fuerza bruta sin límite real

---

### 8. Reemplazar localStorage Auth con Auth Real

**Problema**: Sesiones en localStorage son vulnerables a XSS. Sin HttpOnly cookies.

**Acciones**:
- Si Supabase: Usar `@supabase/ssr` para cookies HttpOnly
- Si sin Supabase: Implementar JWT firmado en API route + HttpOnly cookie
- Eliminar `SESSION_KEY = "zafiro_session"` de localStorage

**Archivos**: `src/lib/auth.ts`, `src/lib/security-lock.ts`
**Esfuerzo**: 4-8 horas
**Riesgo si no se hace**: Cualquier XSS roba la sesión completa

---

### 9. Limpiar Archivos Públicos No Usados

**Problema**: 5 SVGs de Next.js default en `public/` sin usar.

**Acción**: Eliminar:
- `public/file.svg`
- `public/globe.svg`
- `public/next.svg`
- `public/vercel.svg`
- `public/window.svg`

**Referencia**: `docs/ZAFIRO_IMAGE_AUDIT.md` — confirma que son unused
**Esfuerzo**: 5 minutos
**Riesgo si no se hace**: Confusión sobre qué assets son del proyecto

---

### 10. Migrar Imágenes Externas a Local

**Problema**: 20 URLs de Unsplash hardcodeadas en `zafiro-data.ts` y `comentarios.ts`. Si Unsplash cambia o bloquea, todas las imágenes se rompen.

**Acción**:
1. Descargar las 20 imágenes de Unsplash
2. Guardar en `public/assets/zafiro/` (ya existe directorio con 15 WebP)
3. Reemplazar URLs por paths locales
4. Opcionalmente usar `next/image` para optimización

**Archivos**: `src/lib/zafiro-data.ts` (26 ocurrencias), `src/lib/comentarios.ts` (5 ocurrencias), `src/app/page.tsx` (2 ocurrencias)
**Esfuerzo**: 2-3 horas
**Riesgo si no se hace**: Imágenes se rompen si CDN cambia

---

### 11. Limpiar Documentación Obsoleta

**Problema**: 56+ archivos en `docs/` muchos contradictorios con el código actual.

**Acción**:
1. Crear `docs/AUDITORIA_2026-07-18/` — mover documentos de auditoría actual
2. Archivar docs obsoletos en `docs/archivo/`
3. Mantener solo docs sincronizados con código
4. Agregar fecha de última verificación a cada doc

**Archivos**: `docs/*.md` (56 archivos)
**Esfuerzo**: 2-4 horas
**Riesgo si no se hace**: Equipo confía en documentación incorrecta

---

## P3 — BAJO (Cuando haya tiempo)

### 12. Validación Zod en API Routes

**Problema**: Sin validación de schema en cuerpos de request.

**Acción**:
1. Instalar `zod` (si no está — verificar `package.json`)
2. Crear schemas en `src/lib/schemas.ts`
3. Validar en cada API route antes de procesar

**Nota**: `angel-security.ts:373-378` ya define regex patterns pero no se usan. Convertir a schemas Zod.

**Archivos**: Todas las 19 API routes
**Esfuerzo**: 3-4 horas

---

### 13. Tests para Paths Críticos

**Acción**: Crear tests para:
- Auth flow (register, login, logout)
- ELIANA chat (message processing, rate limiting)
- Economy module (cierre, cálculos)
- Owner devices (register, trust, revoke)

**Framework**: Vitest (recomendado para Next.js)
**Esfuerzo**: 4-8 horas

---

### 14. IndexedDB para Offline Persistence

**Problema**: `localStorage` tiene límite de 5-10MB. Para datos de economy, familia, y knowledge base se necesita más espacio.

**Acción**:
1. Implementar `idb-keyval` o `Dexie.js`
2. Migrar datos grandes de localStorage a IndexedDB
3. Mantener localStorage para auth session (simple, pequeño)

**Esfuerzo**: 4-6 horas

---

### 15. Verificación de Webhook Stripe

**Problema**: `constructWebhookEvent()` en `stripe-server.ts:92-113` tiene verificación de firma pero fallback a parsear JSON cuando no hay secret.

**Archivo**: `src/lib/stripe-server.ts:99-105`
```typescript
if (!stripe || !secret || secret.startsWith('whsec_your')) {
  // Simulated mode — no signature verification
  return JSON.parse(body.toString())
}
```

**Acción**: Configurar `STRIPE_WEBHOOK_SECRET` en Vercel Dashboard y eliminar modo simulado.

**Esfuerzo**: 30 minutos

---

### 16. MFA con TOTP Real

**Problema**: Actual MFA (`security-lock.ts`) usa PIN de 6 dígitos en localStorage. No es MFA real.

**Acción**:
1. Implementar TOTP (Time-based One-Time Password) con `otplib`
2. QR code para Google Authenticator / Authy
3. Reemplazar `security-lock.ts` con implementación estándar

**Esfuerzo**: 4-6 horas

---

### 17. Estrategia de Backups Automatizados

**Acción**:
1. GitHub Actions con `git bundle` semanal
2. Si Supabase: backup automático de DB
3. Export de localStorage a archivo descargable
4. Almacenar en S3 o similar

**Esfuerzo**: 2-3 horas

---

### 18. Hardening CSP

**Acción**: Evaluar si `'unsafe-eval'` es realmente necesario:
- Si Three.js se usa: Documentar como requisito
- Si no se usa: Eliminar `'unsafe-eval'`
- Agregar `HSTS` header
- Agregar `Permissions-Policy` header

**Archivo**: `next.config.ts:18`
**Esfuerzo**: 1 hora

---

## Resumen de Esfuerzo Total

| Prioridad | Acciones | Esfuerzo Total |
|-----------|----------|---------------|
| P0 CRÍTICO | 2 | ~1.5 horas |
| P1 ALTO | 4 | ~6-9 horas |
| P2 MEDIO | 5 | ~11-16 horas |
| P3 BAJO | 7 | ~18-29 horas |
| **TOTAL** | **18** | **~37-56 horas** |

**Recomendación**: Comenzar por P0 (rotar token + decisión Supabase/localStorage). Estas 2 acciones desbloquean todas las demás.

---

## Dependencias entre Acciones

```
P0-2 (Decisión Supabase/localStorage)
  ├──→ P1-4 (Fix security-middleware)
  ├──→ P1-6 (Tests)
  ├──→ P2-8 (Real auth)
  └──→ P2-11 (Cleanup docs)

P0-1 (Rotar token)
  └──→ Independiente, hacer primero

P1-3 (WhatsApp keys)
  └──→ Independiente

P1-5 (AI key)
  └──→ Independiente

P2-7 (Rate limiting)
  └──→ Independiente

P2-9 (SVG cleanup)
  └──→ Independiente
```

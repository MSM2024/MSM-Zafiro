# Documento 8 — Auditoría de Seguridad Inicial

**Repositorio**: `https://github.com/MSM2024/MSM-Zafiro.git`
**Rama**: `main` · **Commit**: `278b81c`
**Fecha**: 2026-07-18
**Alcance**: Seguridad de la aplicación, autenticación, secretos, APIs, dependencias

---

## Resumen Ejecutivo

| Severidad | Cantidad | Estado |
|-----------|----------|--------|
| CRÍTICO | 2 | Token OIDC expuesto, API routes sin autenticación |
| ALTO | 4 | Auth client-side, SHA-256 sin bcrypt, rate limit in-memory, CSP débil |
| MEDIO | 4 | Sin validación inputs, webhook sin firma, MFA localStorage, documentación obsoleta |
| BAJO | 4 | Sin tests, sin backups, CORS implícito, dependencias sin audit |

**Puntuación**: 2/10 — La aplicación tiene capas de seguridad escritas pero ninguna efectiva en producción.

---

## 1. Autenticación

### Estado actual: CLIENT-SIDE, sin persistencia server-side

**Archivo**: `src/lib/auth.ts`

```typescript
// auth.ts:98-105 — getSession() lee de localStorage
export function getSession(): ZafiroSession | null {
  if (typeof window === "undefined") return null  // ← SIEMPRE null en server
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) return JSON.parse(raw)
    return null
  } catch { return null }
}
```

**Hallazgos**:
- Sesión almacenada en `localStorage` (clave `zafiro_session`) — vulnerable a XSS
- Sin cookies HttpOnly, sin tokens JWT firmados, sin refresh tokens server-side
- `getSession()` retorna `null` en todo contexto server-side (API routes, middleware)
- Todo el módulo tiene `'use client'` — incompatible con server-side rendering

**Archivo**: `src/lib/auth.ts:13-18` — Hash SHA-256 client-side

```typescript
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + "zafiro_salt_v1")
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("")
}
```

- Salt hardcoded: `zafiro_salt_v1`
- Sin bcrypt/argon2 — SHA-256 es inadecuado para hashing de contraseñas
- Sin rate limiting en login (el rate limit es solo en `/api/eliana/chat`)
- Contraseña en localStorage: hash permanente visible para cualquier script inyectado

---

## 2. Secretos Expuestos

### VERCEL_OIDC_TOKEN

**Archivo**: `.env.local`

El archivo `.env.local` contiene `VERCEL_OIDC_TOKEN` como un JWT completo visible en texto plano. Aunque `.gitignore` (líneas 33-37, 53) incluye `.env.local` y `.env*`, el archivo fue commiteado previamente y persiste en el历史ial de git.

**Estado actual de .gitignore**:
```gitignore
# .gitignore:33-37
.env
.env.local
.env.*.local
!.env.example
```
Y también (línea 53):
```
.env*
```

**Problema**: El token OIDC se usó al menos una vez en el historial de commits. Necesita rotación inmediata desde Vercel Dashboard.

### Variables no configuradas

**Archivo**: `.env.example` — Lista 18+ variables, todas con valores placeholder:
- `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co` (línea 6)
- `STRIPE_SECRET_KEY=sk_live_your_secret_key` (línea 16)
- `GEMINI_API_KEY=your-gemini-api-key` (línea 24)
- `OPENAI_API_KEY=sk-your-openai-api-key` (línea 29)
- `ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key` (línea 34)
- `WHATSAPP_*` — todas comentadas (líneas 37-48)

---

## 3. Autenticación de API Routes

### security-middleware.ts — Siempre retorna 401

**Archivo**: `src/lib/security-middleware.ts:26-38`

```typescript
export function authenticateRequest(request: NextRequest): AuthResult {
  const { valid, profile, role } = validateSession()
  if (!valid || !profile || !role) {
    return {
      authenticated: false,
      error: 'No autorizado — sesión inválida o expirada',
      status: 401,
    }
  }
  // ...
}
```

**Archivo**: `src/lib/angel-security.ts:341-350`

```typescript
export function validateSession(): { valid: boolean; profile: any; role: UserRole | null } {
  const session = getSession()  // ← llama auth.ts getSession() que retorna null en server
  if (!session) return { valid: false, profile: null, role: null }
  // ...
}
```

**Cadena de fallo**: `authenticateRequest()` → `validateSession()` → `getSession()` → `localStorage.getItem()` → `null` (server-side) → **siempre 401**.

**Efecto**: Todas las 19 API routes están protegidas en papel pero completamente desprotegidas en la práctica — o bien fallan con 401 o no usan el middleware.

**Rutas API encontradas** (`src/app/api/**/route.ts`):
- `/api/eliana/chat` — No usa middleware, funciona sin auth
- `/api/eliana/audit`, `/api/eliana/feedback`, `/api/eliana/knowledge/*` — No usan middleware
- `/api/stripe/*`, `/api/owner/devices/*`, `/api/economia/cierre`, `/api/sync`, `/api/chat` — Dependen de la sesión

---

## 4. Content Security Policy (CSP)

**Archivo**: `next.config.ts:18`

```typescript
{ key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" }
```

**Problemas**:
- `'unsafe-eval'` en `script-src` — permite `eval()`, `Function()`, `setTimeout(string)` — vector XSS significativo
- `'unsafe-inline'` en `script-src` — permite scripts inline, reduce protección CSP
- `img-src https:` — permite imágenes desde cualquier HTTPS, no solo dominios específicos
- `connect-src https:` — permite conexiones a cualquier HTTPS

**Nota**: `'unsafe-eval'` puede ser requerido por Three.js pero no está documentado como tal.

---

## 5. Rate Limiting

### In-memory Map — No persiste en Vercel

**Archivo**: `src/lib/angel-security.ts:244-278`

```typescript
// ADVERTENCIA: En Vercel serverless, cada invocación tiene un Map fresco.
// Para rate limiting real en producción, migrar a Upstash/Redis.
const rateLimitStore = new Map<string, RateLimitEntry>()
```

**Archivo**: `src/app/api/eliana/chat/route.ts:14`

```typescript
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
```

**Problema**: En Vercel serverless, cada invocación de función tiene un `Map` nuevo. El rate limit se reinicia en cada cold start. Un atacante puede hacer 30 requests por invocación sin límite efectivo.

---

## 6. Webhook WhatsApp

**Archivo**: `src/app/api/whatsapp/webhook/route.ts`

**Verificación de firma** (POST): Correctamente implementada con HMAC-SHA256 (líneas 126-134):
```typescript
function verifySignature(body: string, signature: string): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET
  if (!appSecret) { return false }  // ← rechaza si no configurado
  const expected = 'sha256=' + createHmac('sha256', appSecret).update(body).digest('hex')
  return signature === expected
}
```

**Problema**: Si `WHATSAPP_APP_SECRET` no está configurado (como actualmente), `verifySignature()` retorna `false` y **rechaza todos los POST**. El webhook nunca procesa mensajes.

**Verificación de GET** (líneas 48-56): Usa `VERIFY_TOKEN` hardcoded como fallback `'zafiro_verify_2026'` — aceptable para verificación inicial de Meta.

---

## 7. Validación de Inputs

**Estado**: Mínima. No hay Zod para cuerpos de request.

**Archivo**: `src/app/api/eliana/chat/route.ts:48`:
```typescript
if (!message || typeof message !== 'string' || !message.trim()) {
```

**Archivo**: `src/app/api/stripe/create-checkout-session/route.ts:18-19`:
```typescript
if (!profileId || !email || !planId) {
```

- Sin validación de formato de email, UUID, etc.
- `src/lib/angel-security.ts:373-378` define schemas de regex pero **nunca se importan ni usan** en API routes
- Sin protección contra inyección SQL (sin riesgo actual por no haber DB)

---

## 8. Row Level Security (RLS)

**Estado**: 11 archivos SQL con políticas RLS definidas — **nunca ejecutadas**.

**Archivos**:
```
supabase/migrations/00001_auth_roles_profiles.sql
supabase/migrations/00002_economia_schema.sql
supabase/migrations/00003_frequency_origin.sql
supabase/migrations/00003_seals_module.sql
supabase/migrations/00004_rls_frequency_origin.sql
supabase/migrations/00005_identity_system.sql
supabase/migrations/00006_family_cloud.sql
supabase/migrations/00007_exchange_rates.sql
supabase/migrations/00008_owner_profiles.sql
supabase/migrations/00009_owner_devices.sql
supabase/migrations/00010_profiles_memberships_stripe.sql
```

- Supabase sin credenciales configuradas → base de datos inaccesible → RLS sin efecto

---

## 9. MFA (Multi-Factor Authentication)

### security-lock.ts — PIN en localStorage

**Archivo**: `src/lib/security-lock.ts`

- PIN de 6 dígitos hasheado con SHA-256 + salt hardcoded (`ZAFIRO-369-777`, línea 17)
- Almacenado en `localStorage` (clave `zafiro_secure_pin`)
- Estado de sesión en `sessionStorage` (clave `zafiro_session_unlocked`)
- 3 intentos → lockout 15 minutos en `localStorage`
- "Clave del Fundador" — similarly en localStorage

**Archivo**: `src/lib/require-aal2.ts` — No existe (confirmado por glob). El guard MFA de Supabase fue eliminado pero referenciado en documentación.

---

## 10. CORS

No hay configuración explícita de CORS. Next.js usa sus valores por defecto (permite same-origin). CSP maneja algunos aspectos via `connect-src 'self' https:`.

---

## 11. Dependencias

**Dependencias server-side con potencial de ejecución**:
- `stripe` SDK — Puede ejecutar cobros reales si `STRIPE_SECRET_KEY` se configura
- `@supabase/ssr`, `@supabase/supabase-js` — Configurados pero sin credenciales

**Sin auditoría CVE**: No se ejecutó `npm audit` ni se verificaron vulnerabilidades conocidas.

---

## 12. Backups

**Estado**: Sin sistema automatizado.

**AGENTS.md** menciona script manual:
```
git bundle create "..\ZAFIRO_BACKUP_$(Get-Date -Format yyyyMMdd)\full.bundle" --all
```

- Sin backup de base de datos (no hay DB activa)
- Sin export de localStorage
- Sin cron ni pipeline CI/CD de backup

---

## 13. Tests

**Estado**: 0 tests ejecutables.

**Archivos de test encontrados** (`tests/`):
- `tests/adaptive-router.test.ts` — importa `../packages/adaptive-router/src/adaptive-router.ts` (paquete eliminado)
- `tests/digital-twin.test.ts` — importa `../packages/digital-twin/src/digital-twin.ts` (paquete eliminado)
- `tests/portable-eliana.test.ts` — importa paquete eliminado
- `tests/sync-queue.test.ts` — importa paquete eliminado
- `tests/package.json` — sin configuración de test runner

**Sin test runner**: No hay jest, vitest, ni任何 test runner configurado en `package.json` raíz.

---

## 14. HTTPS

- **Dominio**: `zafiro.msmmystore.com` — CNAME → Vercel
- **HTTPS**: Configurado via Vercel Dashboard (automático)
- **HSTS**: No configurado explícitamente en headers

---

## 15. Security Headers

**Archivo**: `next.config.ts:14-17`

| Header | Valor | Estado |
|--------|-------|--------|
| X-Frame-Options | DENY | ✅ Correcto |
| X-Content-Type-Options | nosniff | ✅ Correcto |
| Referrer-Policy | strict-origin-when-cross-origin | ✅ Correcto |
| Content-Security-Policy | Ver sección 4 | ⚠️ Con 'unsafe-eval' |

**Faltantes**: HSTS, Permissions-Policy, X-XSS-Protection (deprecated pero aún útil en navegadores antiguos).

---

## 16. Audit Log

**Archivo**: `src/app/api/whatsapp/webhook/route.ts:41-46`

```typescript
async function writeAudit(event: {...}): Promise<void> {
  const fs = await import('node:fs/promises')
  const logPath = process.env.AUDIT_LOG_PATH || './audit.log'
  const entry = JSON.stringify({ ...event, timestamp: new Date().toISOString() }) + '\n'
  try { await fs.appendFile(logPath, entry) } catch {}
}
```

- Escribe a `./audit.log` en el filesystem del serverless function — **se pierde en cada cold start**
- `angel-security.ts` escribe audit a `localStorage` (clave `zafiro_angel_audit`) — solo client-side
- Sin retención, rotación, ni monitoreo centralizado

---

## 17. SQL Injection

**Riesgo**: NULO — No hay base de datos activa. Sin Supabase configurado, no hay queries SQL en runtime.

---

## 18. XSS

**Vectores**:
- CSP permite `'unsafe-inline'` y `'unsafe-eval'` en `script-src`
- Datos de usuario en localStorage se inyectan directamente en DOM
- Sin sanitización de HTML en entrada de chat
- `filterResponse()` en `src/lib/eliana/response-filter.ts` — filtra respuestas de AI pero no input de usuario

---

## Conclusión

La aplicación tiene una arquitectura de seguridad ambiciosa pero completamente inoperativa. Todas las capas de protección (auth, RLS, rate limiting, MFA, audit) dependen de Supabase sin credenciales o de localStorage que no persiste en server-side. El único mecanismo de seguridad funcional es la verificación de firma HMAC del webhook de WhatsApp, y eso requiere que `WHATSAPP_APP_SECRET` esté configurado.

**Riesgo actual**: La aplicación está desplegada en producción (`zafiro.msmmystore.com`) con todas estas deficiencias activas.

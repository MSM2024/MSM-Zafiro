# Documento 10 — Diferencias y Contradicciones

**Repositorio**: `https://github.com/MSM2024/MSM-Zafiro.git`
**Rama**: `main` · **Commit**: `278b81c`
**Fecha**: 2026-07-18
**Alcance**: Inconsistencias entre documentación, configuración y código real

---

## Resumen

Se encontraron **12 contradicciones significativas** donde la documentación o configuración declarada no coincide con el estado real del código.

---

## 1. Supabase: Declarado en Todas Partes, Configurado en Ninguna

### Lo que dice la documentación

**AGENTS.md** (sección Estado Actual):
> Auth: localStorage fallback — Supabase sin credenciales

**ARCHIVO_DE_CONTINUIDAD.md** y múltiples docs en `docs/`:
> Migraciones listas, esquemas definidos, RLS policies

### Lo que dice el código

**Archivo**: `src/lib/supabase.ts:8-10`
```typescript
function isConfigured(): boolean {
  return !!(supabaseUrl && supabaseUrl !== "https://your-project.supabase.co"
    && supabaseAnonKey && supabaseAnonKey !== "your-anon-key-here")
}
```

**Archivo**: `.env.example` — Todas las variables Supabase son placeholders:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### La contradicción

- 11 archivos de migración SQL (`supabase/migrations/00001-00010`) definen tablas, RLS, funciones
- `auth.ts` intenta usar Supabase primero en cada operación de auth (líneas 37-51, 75-84)
- Pero `getSupabaseClient()` retorna `null` siempre → fallback a localStorage
- **Resultado**: Todo el sistema de auth Supabase (200+ líneas) nunca se ejecuta. Las migraciones SQL existen pero nunca corren. Los 56+ docs en `docs/` referencian features Supabase que no funcionan.

---

## 2. require-role.ts y require-aal2.ts: Server Guards en Proyecto Client-Side

### Lo que dice el código

**Archivo eliminado**: `src/lib/require-role.ts` y `src/lib/require-aal2.ts` — glob confirma que no existen.

### La contradicción

- `AGENTS.md` menciona `requireRole()` como funcional
- `angel-security.ts:352-365` define `requireRole()` server-side
- Pero **todas las páginas** son `'use client'`
- El módulo `auth.ts:1` declara `'use client'` explícitamente

**Efecto**: No hay ninguna ruta de ejecución donde `requireRole()` de `angel-security.ts` pueda ser llamada desde una página. Las pages client-side llaman a `requireRole()` de `auth.ts` (versión legacy, línea 172-175) que compara roles en localStorage.

---

## 3. security-middleware.ts: Autenticación Imposible en Server

### Lo que dice el código

**Archivo**: `src/lib/security-middleware.ts:26-38`
```typescript
export function authenticateRequest(request: NextRequest): AuthResult {
  const { valid, profile, role } = validateSession()  // ← siempre falla en server
  if (!valid || !profile || !role) {
    return { authenticated: false, error: 'No autorizado', status: 401 }
  }
}
```

### La contradicción

- `authenticateRequest()` es la función central de protección de API routes
- Llama a `validateSession()` que llama a `getSession()` que lee de `localStorage`
- En contextos server-side (API routes, middleware), `localStorage` no existe
- `getSession()` retorna `null` cuando `typeof window === "undefined"`

**Resultado**: Ninguna API route puede autenticar requests. La única ruta que funciona (`/api/eliana/chat`) no usa el middleware.

---

## 4. Stripe: Checkout Completo, Keys Desconfiguradas, Modo Simulado

### Lo que dice el código

**Archivo**: `src/lib/stripe-server.ts:9-13`
```typescript
function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key || key.startsWith('sk_live_your')) return null
  return new Stripe(key, {})
}
```

**Archivo**: `src/lib/stripe-server.ts:28-33`
```typescript
if (!stripe) {
  // Simulated mode for development
  return {
    url: `${successUrl}?session_id=cs_sim_${Date.now()}&profile_id=${profileId}`,
    sessionId: `cs_sim_${Date.now()}`,
  }
}
```

### Lo que dice la documentación

**AGENTS.md**: No menciona explícitamente que Stripe está en modo simulado.
**`.env.example`**: Lista `STRIPE_SECRET_KEY=sk_live_your_secret_key` como placeholder.

### La contradicción

- Flujo de checkout completamente implementado (`/api/stripe/create-checkout-session`, `/api/stripe/webhook`, `/api/stripe/customer-portal`)
- Cuando `STRIPE_SECRET_KEY` no empieza con `sk_live_your`, retorna URLs simuladas (`cs_sim_*`)
- El webhook de Stripe (`/api/stripe/webhook`) tiene verificación de firma que fallback a parsear JSON directo cuando no hay secret (líneas 99-105)
- **Riesgo**: Un admin podría asumir que los pagos están funcionando cuando en realidad está en modo simulado

---

## 5. ELIANA AI: 3 Providers, 0 Keys Configuradas

### Lo que dice el código

**Archivo**: `src/lib/ai/providers.ts`

```typescript
export const geminiProvider: AIProvider = {
  name: "Gemini", model: "gemini-1.5-flash",
  key: process.env.GEMINI_API_KEY || "",  // ← vacío
}
export const openaiProvider: AIProvider = {
  name: "OpenAI", model: "gpt-4o-mini",
  key: process.env.OPENAI_API_KEY || "",  // ← vacío
}
export const anthropicProvider: AIProvider = {
  name: "Anthropic", model: "claude-3-haiku-20240307",
  key: process.env.ANTHROPIC_API_KEY || "",  // ← vacío
}
```

**Archivo**: `src/lib/ai/providers.ts:144-149`
```typescript
for (const provider of providers) {
  if (!provider.key) continue  // ← salta todos
  const result = await provider.call(message, history, systemPrompt)
  if (result) return { text: result, provider: provider.name, model: provider.model }
}
return { text: "", provider: "local", model: "fallback" }  // ← siempre esto
```

### La contradicción

- 3 providers configurados con modelos específicos, timeouts, y manejo de errores
- Zero API keys → `callAI()` retorna texto vacío con provider `"local"`
- ELIANA solo puede responder con knowledge base local (sin AI real)
- `.env.example` documenta OpenAI y Anthropic como "Optional" — creando ilusión de funcionalidad

---

## 6. Auth: localStorage Fallback vs. Supabase-First

### Lo que dice AGENTS.md

> Auth: localStorage fallback — Supabase sin credenciales

### Lo que dice el código

**Archivo**: `src/lib/auth.ts:34-65`
```typescript
export async function registerUser(...) {
  const supabase = getSupabaseClient()
  if (supabase) {  // ← intenta Supabase PRIMERO
    const { data, error } = await supabase.auth.signUp({...})
    // ...
  }
  // Fallback: localStorage
}
```

### La contradicción

- AGENTS.md dice "localStorage fallback" — sugiere que localStorage es backup
- El código intenta Supabase primero, localStorage segundo
- En la práctica, Supabase siempre falla → siempre usa localStorage
- Pero la semántica del código es "Supabase-primary, localStorage-fallback" — lo opuesto de lo documentado

---

## 7. Tests: Directorio Existente, Infraestructura Ausente

### Lo que dice AGENTS.md

> Sin tests — 0 tests en todo el proyecto

### Lo que existe

Directorio `tests/` con 4 archivos de test + 1 package.json:
- `tests/adaptive-router.test.ts`
- `tests/digital-twin.test.ts`
- `tests/portable-eliana.test.ts`
- `tests/sync-queue.test.ts`

### La contradicción

- Los archivos de test existen pero son inoperativos
- Importan paquetes eliminados del monorepo
- No hay test runner configurado (sin jest, vitest, ni script en package.json)
- AGENTS.md dice "0 tests" — técnicamente correcto (0 ejecutables) pero ignora que 4 archivos de test existen con código que alguna vez funcionó

---

## 8. CSP: 'unsafe-eval' Contradice Postura de Seguridad

### Lo que dice next.config.ts

```typescript
script-src 'self' 'unsafe-eval' 'unsafe-inline'
```

### Lo que dice la documentación de seguridad

Múltiples docs en `docs/` (`SECURITY_FINAL_AUDIT.md`, `VERCEL_SECURITY_AUDIT.md`, `AUTH_SECURITY_AUDIT.md`) describen CSP como "seguro" o "hardened".

### La contradicción

- `'unsafe-eval'` permite `eval()` y `Function()` — vectores XSS significativos
- Puede ser necesario para Three.js o librerías de rendering, pero no está documentado como requisito
- `'unsafe-inline'` permite scripts inline — reduce la protección CSP a nivel de decoración

---

## 9. Documentación: 56+ Archivos, Muchos Obsoletos

### Lo que existe

Directorio `docs/` contiene **56 archivos markdown**:

```
AUDIT_REPORT_v1.md, PRODUCTION_READINESS.md, SECURITY_FINAL_AUDIT.md,
AUTH_SECURITY_AUDIT.md, FUNCTIONAL_AUDIT.md, CURRENT_STATE_AUDIT.md,
RISK_REGISTER.md, INCIDENT_RESPONSE_PLAN.md, MFA_IMPLEMENTATION.md,
KYC_WORKFLOW.md, KYC_SECURITY.md, DATABASE_AUDIT.md, ...
```

### La contradicción

- Muchos describen features como "fully implemented" que en realidad están en modo simulado
- `PRODUCTION_READINESS.md` sugiere nivel de preparación que no existe
- `FUNCTIONAL_AUDIT.md` puede reportar funcionalidades que dependen de Supabase sin configurar
- `MFA_IMPLEMENTATION.md` describe MFA que opera en localStorage, no MFA real
- **No hay mecanismo de sincronización** entre docs y código — se desactualizan inmediatamente

---

## 10. .env.example: Multi-Node WhatsApp, Single Node Reality

### Lo que dice .env.example

```bash
# --- WHATSAPP BUSINESS (Multi-Node) ---
# Add up to 9 additional WhatsApp Business nodes:
# WHATSAPP_PHONE_NUMBER_ID_1=second-phone-number-id
# WHATSAPP_ACCESS_TOKEN_1=second-access-token
```

### Lo que dice el código

**Archivo**: `src/lib/whatsapp-client.ts` (referenciado en webhook):
```typescript
const node = getNodeByPhoneId(phoneNumberId)
```

**Archivo**: `src/app/api/whatsapp/webhook/route.ts:7`:
```typescript
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'zafiro_verify_2026'
```

### La contradicción

- `.env.example` documenta capacidades multi-node (hasta 10 nodos WhatsApp)
- El webhook funciona con un solo token de verificación
- `WHATSAPP_ACCESS_TOKEN` y `WHATSAPP_APP_SECRET` están comentados
- No hay evidencia de que multi-node funcione o esté implementado más allá del env template

---

## 11. Git Tag vs. Deployment Pipeline

### Lo que existe

```
$ git tag --list
release-zafiro-msm-economia-beta
```

### La contradicción

- Tag existe pero no hay pipeline CI/CD configurado
- No hay GitHub Actions, no hay Vercel config file, no hay deploy scripts
- Solo `main` branch tiene commits significativos
- El tag no tiene relación con ningún release process documentado

---

## 12. Dominios: Tres Declarados, Uno Funcionando

### Lo que dice la documentación

- `zafiro.msmmystore.com` — CNAME → Vercel ✅
- `market.msmmystore.com` — Mencionado en docs como marketplace
- `blog.msmmystore.com` — Mencionado en docs

### Realidad

- Solo `zafiro.msmmystore.com` tiene evidencia de apuntar a Vercel
- No hay evidencia DNS para `market.msmmystore.com` ni `blog.msmmystore.com`
- No hay deploy de marketplace ni blog en el repositorio actual

---

## Tabla Resumen de Contradicciones

| # | Contradicción | Severidad | Evidencia |
|---|--------------|-----------|-----------|
| 1 | Supabase declarado, sin configurar | CRÍTICA | `supabase.ts`, `.env.example`, 11 migrations |
| 2 | Server guards en proyecto client-only | ALTA | `angel-security.ts`, todas las pages `'use client'` |
| 3 | Middleware auth siempre retorna 401 | CRÍTICA | `security-middleware.ts:27`, `auth.ts:99` |
| 4 | Stripe en modo simulado, no documentado | ALTA | `stripe-server.ts:28-33` |
| 5 | 3 AI providers, 0 keys | ALTA | `providers.ts:24,61,94` |
| 6 | Auth dice fallback, código intenta Supabase primero | MEDIA | `auth.ts:37`, AGENTS.md |
| 7 | Tests existen pero son inoperativos | MEDIA | `tests/*.test.ts`, paquetes eliminados |
| 8 | CSP unsafe-eval, docs dicen "seguro" | MEDIA | `next.config.ts:18` |
| 9 | 56 docs, muchos obsoletos | BAJA | `docs/*.md` |
| 10 | Multi-node WhatsApp, sin configurar | BAJA | `.env.example:42-48` |
| 11 | Git tag sin pipeline | BAJA | `git tag --list` |
| 12 | 3 dominios, 1 funcionando | BAJA | DNS docs vs. realidad |

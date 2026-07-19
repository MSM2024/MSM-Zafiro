# Documento 6: Inventario de Integraciones Externas

**Repositorio:** https://github.com/MSM2024/MSM-Zafiro.git
**Rama:** `main` | **Commit:** `278b81c`
**Fecha:** 2026-07-17

---

## Resumen

| Integración | Estado | Credenciales | Funcional |
|-------------|--------|:---:|:---:|
| Supabase | Configurado, sin credenciales | No | No |
| Stripe | Configurado, simulado | No | Parcial (simulado) |
| Gemini AI | Configurado, sin key | No | Fallback local |
| OpenAI | Opcional, sin key | No | No |
| Anthropic | Opcional, sin key | No | No |
| WhatsApp Business | Webhook existe, sin token | No | Recepción sí, respuesta No |
| Vercel | Deploy activo | OIDC (expuesto) | Sí |
| Unsplash | URLs hardcoded | N/A | Parcial (externo) |
| Meta Graph API | Código existe, sin config | No | No |
| Email Service | Simulado en localStorage | N/A | No |

---

## 1. Supabase (Auth + Database)

**Estado:** 🔴 No funcional
**Archivos:** `src/lib/supabase.ts`, `src/lib/supabase-server.ts`
**Migraciones:** 11 archivos en `supabase/migrations/`

### Variables Requeridas
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co  ← PLACEHOLDER
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here            ← PLACEHOLDER
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here         ← PLACEHOLDER
```

### Comportamiento Actual
- `supabase.ts:9` — `isConfigured()` verifica que URL no sea placeholder
- Si no está configurado, `getSupabaseClient()` retorna `null`
- Toda la app cae en fallback localStorage:
  - `auth.ts:53-64` — Registro en localStorage
  - `auth.ts:87-94` — Login en localStorage
  - `auth.ts:98-105` — Sesión en localStorage
- Las 11 migraciones SQL definen 45+ tablas pero **ninguna ha sido ejecutada**
- No hay proyecto Supabase creado en ningún ambiente

### Impacto
- Sin autenticación real
- Sin base de datos persistente
- Sin RLS (Row Level Security)
- Sin real-time subscriptions
- Sin Edge Functions
- Sin Storage (archivos)

---

## 2. Stripe (Pagos)

**Estado:** 🟡 Modo simulado
**Archivos:** `src/lib/stripe-server.ts`, `src/components/StripeModal.tsx`, `src/app/api/stripe/*` (3 rutas)

### Variables Requeridas
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_...  ← PLACEHOLDER
STRIPE_SECRET_KEY=sk_live_your_...                    ← PLACEHOLDER
STRIPE_WEBHOOK_SECRET=whsec_your_...                  ← PLACEHOLDER
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_pro_monthly_id     ← PLACEHOLDER
NEXT_PUBLIC_STRIPE_PRICE_CUBA_PLUS=price_cuba_plus    ← PLACEHOLDER
```

### Comportamiento Actual
- `stripe-server.ts:11` — `getStripe()` retorna `null` si key empieza con `sk_live_your`
- `stripe-server.ts:30-33` — Sin Stripe real, crea sesiones simuladas (`cs_sim_{timestamp}`)
- `stripe-server.ts:99-106` — Webhook sin secret real parsea body directamente
- `StripeModal.tsx` — Muestra interfaz placeholder sin procesar pagos reales
- Las membresías se guardan en localStorage sin validación Stripe

### APIs
| Ruta | Método | Estado |
|------|--------|--------|
| `/api/stripe/create-checkout-session` | POST | Simulado (retorna URL fake) |
| `/api/stripe/customer-portal` | POST | Simulado (retorna URL fake) |
| `/api/stripe/webhook` | POST | Recibe pero no valida firma |

### Impacto
- Sin cobros reales
- Sin suscripciones activas
- Sin webhooks de confirmación
- Sin Customer Portal funcional

---

## 3. Gemini AI (Google)

**Estado:** 🟡 Parcial (fallback local)
**Archivos:** `src/lib/ai/providers.ts`, `src/app/api/chat/route.ts`, `src/app/api/eliana/chat/route.ts`

### Variables
```
GEMINI_API_KEY=your-gemini-api-key  ← NO EN .env.local
```

### Comportamiento Actual
- `providers.ts:24` — `geminiProvider.key` = `process.env.GEMINI_API_KEY || ""`
- `providers.ts:26` — Si key está vacía, retorna `null` inmediatamente
- `providers.ts:37-55` — Con key válida, llama `generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- Parámetros: temperature 0.7, maxOutputTokens 800
- Sin key, el chat ELIANA usa respuestas hardcoded de `knowledge-data.ts`
- `callAI()` en `providers.ts:135-150` intenta Gemini → OpenAI → Anthropic → fallback local

### Impacto
- ELIANA responde con respuestas predefinidas
- Sin comprensión contextual real
- Sin generación de contenido dinámico

---

## 4. OpenAI

**Estado:** 🔴 No configurado
**Archivos:** `src/lib/ai/providers.ts`

### Variables
```
OPENAI_API_KEY=sk-your-openai-api-key  ← OPCIONAL, no configurado
```

### Comportamiento
- `providers.ts:61` — `openaiProvider.key` = `process.env.OPENAI_API_KEY || ""`
- Si vacío, se salta en la cadena de fallback
- Modelo configurado: `gpt-4o-mini`
- Endpoint: `https://api.openai.com/v1/chat/completions`

---

## 5. Anthropic

**Estado:** 🔴 No configurado
**Archivos:** `src/lib/ai/providers.ts`

### Variables
```
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key  ← OPCIONAL, no configurado
```

### Comportamiento
- `providers.ts:94` — `anthropicProvider.key` = `process.env.ANTHROPIC_API_KEY || ""`
- Si vacío, se salta en la cadena de fallback
- Modelo configurado: `claude-3-haiku-20240307`
- Endpoint: `https://api.anthropic.com/v1/messages`

---

## 6. WhatsApp Business

**Estado:** 🟡 Webhook activo, respuesta bloqueada
**Archivos:** `src/app/api/whatsapp/webhook/route.ts`, `src/lib/whatsapp-client.ts`

### Variables
```
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id    ← COMENTADO
WHATSAPP_ACCESS_TOKEN=your-access-token           ← COMENTADO
WHATSAPP_APP_SECRET=your-app-secret               ← COMENTADO
WHATSAPP_VERIFY_TOKEN=zafiro_verify_2026          ← DEFAULT
```

### Comportamiento
- `webhook/route.ts:7-8` — API version `v22.0`, base URL `https://graph.facebook.com`
- `webhook/route.ts:48-57` — GET responde verificación (funcional si token coincide)
- `webhook/route.ts:59-124` — POST procesa mensajes entrantes:
  - Valida firma HMAC con `WHATSAPP_APP_SECRET`
  - Si no hay app secret, rechaza con 401
  - Usa `processElianaMessage()` de `packages/eliana/`
  - Intenta responder vía `sendWhatsAppMessage()`
- `webhook/route.ts:12-13` — Sin `WHATSAPP_ACCESS_TOKEN`, loguea error y no responde
- `whatsapp-client.ts` — Soporte multi-nodo (hasta 9 nodos adicionales)
- `webhook/route.ts:41-46` — Audit log en archivo `./audit.log`

### APIs WhatsApp Multi-Nodo
```
WHATSAPP_PHONE_NUMBER_ID_1=second-phone-number-id
WHATSAPP_ACCESS_TOKEN_1=second-access-token
WHATSAPP_PHONE_NUMBER_ID_2=third-phone-number-id
WHATSAPP_ACCESS_TOKEN_2=third-access-token
```

### Impacto
- Webhook puede recibir mensajes si está configurado en Meta
- No puede responder (sin access token)
- Sin verificación HMAC (sin app secret)
- Audit log funciona (escritura a archivo)

---

## 7. Vercel (Deploy)

**Estado:** 🟢 Activo
**Archivos:** `.vercel/repo.json`, `.env.vercel`

### Configuración
- Proyecto desplegado en `zafiro.msmmystore.com`
- Dominio: CNAME → Vercel
- HTTPS: 200 OK
- Build: `npm run build` (0 errores, 105+ rutas)
- Framework: Next.js con App Router

### Seguridad
- ⚠️ `VERCEL_OIDC_TOKEN` presente en `.env.local` — **EXPUESTO**
- Debe rotarse desde Vercel Dashboard → Settings → Tokens

---

## 8. Unsplash (Imágenes CDN)

**Estado:** 🟡 Funcional pero frágil
**Archivos:** `src/lib/zafiro-data.ts`, `src/lib/comentarios.ts`, `src/app/page.tsx`

### URLs Hardcoded (20+ únicas)
Todas las imágenes raster del app provienen de Unsplash CDN:
- Avatares de expertos
- Imágenes de stories
- Imágenes de categorías
- Imágenes de sponsors
- Imágenes de posts/comentarios

### Problemas
- Sin fallback local si Unsplash cambia URLs
- Sin rate limiting implementado
- Sin optimización (no usa `next/image`)
- Sin lazy loading
- Sin responsive images
- URLs pueden cambiar o expirar
- Sin cache policy controlada

### Migración en Progreso
- Se han creado 15 WebP locales en `public/assets/zafiro/`
- `ZAFIRO_ASSETS` en `src/config/zafiro-assets.ts` tiene 14 entradas
- `zafiro-data.ts` ya importa `ZAFIRO_ASSETS` y usa WebP locales
- Faltan: imágenes de avatares de expertos y algunos sponsors

---

## 9. Meta Graph API (WhatsApp)

**Estado:** 🔴 No configurado
**Archivos:** `src/lib/whatsapp-client.ts`, `src/app/api/whatsapp/webhook/route.ts`

### Uso
- Se usa para enviar mensajes vía WhatsApp Business Platform API v22.0
- Requiere las mismas credenciales que WhatsApp Business
- No hay implementación separada de Meta Graph API

---

## 10. Email Service

**Estado:** 🔴 Simulado
**Archivos:** `src/lib/email-service.ts`

### Comportamiento
- `email-service.ts:16-31` — `sendEmail()` guarda emails en localStorage bajo `zafiro_email_outbox`
- No hay conexión SMTP real
- No hay envío de emails
- Los emails de recuperación de contraseña se "envían" a localStorage
- Se pueden ver en la app pero nunca llegan al destinatario real

### Usado por
- `auth.ts:152-158` — Recuperación de contraseña
- Cualquier componente que llame `sendEmail()`

---

## 11. Qdrant / Dify CE (Planeado)

**Estado:** 🔴 No implementado
**Archivos:** Ninguno

### Plan Original
- **Qdrant**: Vector store para embeddings del Knowledge Pack
- **Dify CE**: Orquestador de IA con RAG
- **Docker Compose**: Para desplegar ambos servicios
- **Ninguno ha sido implementado**

---

## 12. Dependencias NPM (package.json)

### Framework
- `next` (16.x) — Framework React
- `react`, `react-dom` (19.x) — UI Library
- `typescript` — Lenguaje

### UI/UX
- `tailwindcss` — Estilos
- `motion` (framer-motion) — Animaciones
- `lucide-react` — Iconos
- `recharts` — Gráficos

### Backend/API
- `@supabase/ssr` — Supabase client
- `stripe` — Stripe SDK
- `@google/generative-ai` — Gemini SDK (instalado pero sin key)

### Seguridad
- No hay librerías de hashing (usa `crypto.subtle` nativo)
- No hay librerías de validación (sin Zod, sin io-ts)
- No hay rate limiting library

---

## Tabla de Estado Resumen

| # | Integración | Archivos | ENV requerido | Configurado | Funcional | Riesgo |
|---|-------------|----------|---------------|:---:|:---:|:---:|
| 1 | Supabase | 2 lib + 11 SQL | 3 keys | No | No | 🔴 Crítico |
| 2 | Stripe | 1 lib + 3 API + 1 UI | 5 keys | No | Simulado | 🟡 Alto |
| 3 | Gemini AI | 1 lib + 2 API | 1 key | No | Fallback | 🟡 Medio |
| 4 | OpenAI | 1 lib | 1 key | No | No | 🟢 Bajo |
| 5 | Anthropic | 1 lib | 1 key | No | No | 🟢 Bajo |
| 6 | WhatsApp | 1 lib + 1 API | 4 vars | No | Webhook only | 🟡 Alto |
| 7 | Vercel | Deploy | OIDC | Sí | Sí | 🟡 OIDC expuesto |
| 8 | Unsplash | 3 archivos | N/A | Sí | Externo | 🟡 Frágil |
| 9 | Meta Graph | Código WhatsApp | Misma WA | No | No | 🟢 Bajo |
| 10 | Email | 1 lib | Ninguna | N/A | Simulado | 🟡 Alto |
| 11 | Qdrant/Dify | Ninguno | N/A | No | No | 🟢 N/A |

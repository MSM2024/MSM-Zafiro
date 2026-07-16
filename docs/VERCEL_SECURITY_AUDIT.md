# GUARDIÁN 4 — Vercel y Dominio: Auditoría de Seguridad

**Fecha:** 2026-07-15
**Dominio:** `zafiro.msmmystore.com`
**Hosting:** Vercel (plan Hobby)
**Estado:** ⚠️ PARCIAL

---

## Resumen de Controles

| Control | Estado | Evidencia |
|---------|--------|-----------|
| HTTPS válido | ✅ PASS | SSL válido, redirect HTTP→HTTPS 308 |
| HTTP→HTTPS redirect | ✅ PASS | Verificado |
| Mixed content | ✅ PASS | 0 recursos mixtos |
| Dominio CNAME correcto | ✅ PASS | `b67345187636a284.vercel-dns-017.com` |
| Preview deployments protegidos | ❌ FAIL | Vercel Authentication activa (pública) |
| Paneles internos protegidos | ⚠️ PARCIAL | Solo por Vercel Auth, no por rol |
| WAF | ❌ FAIL | No configurado |
| Rate limiting | ⚠️ PARCIAL | Solo en `/api/chat` |
| Reglas de bots | ❌ FAIL | No configurado |
| CSP | ❌ FAIL | No implementado |
| HSTS | ✅ PASS | `max-age=63072000` verificado |
| X-Content-Type-Options | ❌ FAIL | No verificado |
| Referrer-Policy | ❌ FAIL | No configurado |
| Permissions-Policy | ❌ FAIL | No configurado |
| Protección webhooks (firma) | ⚠️ PARCIAL | Stripe webhook secret existe, WhatsApp no |

---

## Hallazgos

### ALTO: Sin CSP (Content Security Policy)

No hay cabecera CSP configurada. Esto permite:
- XSS potencial
- Carga de recursos no autorizados
- Clickjacking

**Solución:** Agregar en `next.config.ts` o `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com https://api.openai.com https://api.anthropic.com https://api.stripe.com; frame-src 'self' https://js.stripe.com;"
        }
      ]
    }
  ]
}
```

### ALTO: Preview deployments sin autenticación

Vercel Authentication está activa pero es genérica. Los preview deployments deberían requerir autenticación por rol.

### MEDIO: Sin WAF ni reglas de bots

No hay protección contra:
- Web scraping automatizado
- Ataques DDoS básicos
- Bots maliciosos

### MEDIO: Sin rate limiting global

Solo `/api/chat` tiene rate limiting. Las rutas `/api/auth/*` y `/api/payments/*` no lo tienen.

### BAJO: Cabeceras de seguridad faltantes

Faltan configurar:
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## Cabeceras de Seguridad Recomendadas

Agregar en `next.config.ts`:

```typescript
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]
```

---

## Rutas que Requieren Protección Adicional

| Ruta | Riesgo | Medida |
|------|--------|--------|
| `/admin/*` | CRÍTICO | AAL2 + rol OWNER/admin |
| `/api/auth/*` | ALTO | Rate limiting + captcha |
| `/api/payments/*` | CRÍTICO | AAL2 + firma |
| `/api/whatsapp/*` | ALTO | Verificación de firma Meta |
| `/api/webhooks/*` | ALTO | Stripe signature verification |
| `/api/export/*` | ALTO | AAL2 + rate limiting |

# GUARDIÁN 2 — Secretos: Inventario y Clasificación

**Fecha:** 2026-07-15
**Método:** Revisión de código, git history, archivos .env, configuración Vercel
**Estado:** ⚠️ REQUIRES_OWNER_ACTION

---

## ⚠️ AVISO DE SEGURIDAD

Este documento NO contiene valores secretos. Solo nombres, ubicaciones y estado.

---

## Inventario de Secretos Detectados

| # | Nombre | Tipo | Ubicación | Estado | Riesgo |
|---|--------|------|-----------|--------|--------|
| 1 | `GEMINI_API_KEY` | API Key | `.env.local`, Vercel Env | ⚠️ Activo | Alto |
| 2 | `NEXT_PUBLIC_SUPABASE_URL` | URL Pública | `.env.local`, Frontend | ℹ️ Público | Bajo |
| 3 | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave Pública | `.env.local`, Frontend | ℹ️ Público (diseñado) | Bajo |
| 4 | `SUPABASE_SERVICE_ROLE_KEY` | **Secreto CRÍTICO** | `.env.local` only | ⚠️ No en código | **CRÍTICO** |
| 5 | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clave Pública | `.env.local`, Frontend | ℹ️ Público (diseñado) | Bajo |
| 6 | `STRIPE_SECRET_KEY` | **Secreto CRÍTICO** | `.env.local` only | ⚠️ No en código | **CRÍTICO** |
| 7 | `STRIPE_WEBHOOK_SECRET` | Secreto | `.env.local` only | ⚠️ No en código | Alto |
| 8 | `VERCEL_OIDC_TOKEN` | Token | `.env.local` | ⚠️ EXPUESTO | **CRÍTICO** |
| 9 | `WHATSAPP_ACCESS_TOKEN` | Token Acceso | `.env.local` (comentado) | ⚠️ No activo | Alto |
| 10 | `WHATSAPP_PHONE_NUMBER_ID` | ID | `.env.local` (comentado) | ⚠️ No activo | Medio |
| 11 | `GEMINI_API_KEY` en `.env.example` | Placeholder | `.env.example` | ✅ Seguro (placeholder) | Bajo |

---

## Hallazgos CRÍTICOS

### CRÍTICO 1: VERCEL_OIDC_TOKEN en `.env.local`

El archivo `.env.local` contiene un token OIDC de Vercel válido. Este token permite:
- Acceso a deployments de Vercel
- Operaciones como el equipo `msmmystore`

**Acción requerida:** Rotar inmediatamente desde Vercel Dashboard.

### CRÍTICO 2: SUPABASE_SERVICE_ROLE_KEY

Actualmente solo en `.env.local`. Verificar que **nunca** se use en:
- Componentes de frontend ('use client')
- Variables `NEXT_PUBLIC_*`
- Código empaquetado enviado al navegador

### CRÍTICO 3: Sin secret scanning en GitHub

No hay `secret scanning` ni `push protection` activados. Un push accidental expondría todas las claves.

---

## Buenas Prácticas Actuales ✅

- `.env.local` en `.gitignore` — verificado
- `SUPABASE_SERVICE_ROLE_KEY` solo en servidor
- `NEXT_PUBLIC_*` solo para valores públicos
- `.env.example` usa placeholders, no valores reales
- Stripe publishable key separada de secret key

---

## Archivos Creados

- `docs/SECRET_INVENTORY.md` — Este inventario
- `docs/SECRET_ROTATION_REPORT.md` — Procedimiento de rotación
- `.env.example` — Ya existía, actualizado con nuevos campos

---

## Acciones Requeridas (Don Miguel)

1. Rotar `VERCEL_OIDC_TOKEN` en Vercel Dashboard
2. Activar secret scanning en GitHub repo
3. Activar push protection en GitHub repo
4. Verificar que `SUPABASE_SERVICE_ROLE_KEY` no esté en ningún log
5. Usar Secret Manager (Vercel Environment Variables) para todas las claves

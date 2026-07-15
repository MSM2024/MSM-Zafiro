# Modelo de Seguridad — ZAFIRO

## Principios
1. **Offline-first**: Los datos se cifran localmente antes de sincronizar
2. **Defensa en profundidad**: Auth dual (Supabase SSR + localStorage)
3. **Mínimo privilegio**: RLS en cada tabla de Supabase
4. **Auditable**: Cada operación económica pasa por el Guardián 2

## Capas

### 1. Autenticación
- Supabase SSR con refresh tokens
- Fallback localStorage para modo offline
- Sesión verificada por middleware en `/dashboard`, `/admin`, `/settings`

### 2. Base de Datos (Supabase)
- Row-Level Security (RLS) en todas las tablas
- Políticas por rol: `usuario`, `colaborador`, `admin`, `superadmin`
- Migraciones: `00001_auth_roles_profiles.sql`, `00004_rls_frequency_origin.sql`

### 3. API
- Rate limiting por IP (Vercel + middleware)
- Validación de entrada en cada handler
- HMAC-SHA256 en webhooks WhatsApp

### 4. Cliente
- Content Security Policy vía headers
- No exposición de secrets en client bundle
- localStorage solo para datos no sensibles

### 5. Comunicaciones
- HTTPS forzado (Vercel)
- CORS restringido a orígenes conocidos
- Headers de seguridad: X-Frame-Options, X-Content-Type-Options

## Guardianes de Seguridad
- **G1** (Cian) — Integridad del Nudo Único
- **G2** (Naranja) — Validación económica
- **G3** (Oro) — Veracidad transaccional
- **G4** (Púrpura) — Ética y derechos
- **G5** (Verde) — Sostenibilidad
- **G6** (Rosa) — Experiencia de usuario
- **G7** (Blanco) — Acceso y transparencia

## Contacto
Seguridad: security@msmmystore.com

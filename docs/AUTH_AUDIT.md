# AUTH AUDIT — ZAFIRO

## Sistema Actual
- **Supabase SSR**: Login, registro, recover, verify via `@supabase/ssr`
- **localStorage fallback**: Auth simulado cuando Supabase no está conectado
- **Proxy**: `src/proxy.ts` para protección de rutas
- **Middleware**: Protege /dashboard, /admin, /settings

## Archivos de Autenticación
| Archivo | Propósito | Estado |
|---------|-----------|--------|
| `src/lib/auth.ts` | AuthClient, AuthUser, Profile, roles | FUNCIONAL |
| `src/lib/supabase.ts` | createClient (browser) | FUNCIONAL |
| `src/lib/supabase-server.ts` | createServerClient (SSR) | FUNCIONAL |
| `src/proxy.ts` | Route protection middleware | FUNCIONAL |
| `supabase/migrations/00001_auth_roles_profiles.sql` | DB schema | FUNCIONAL |

## Roles Definidos
| Rol | Nivel | Acceso |
|-----|-------|--------|
| usuario | 1 | Básico |
| colaborador | 2 | Contenido |
| admin | 3 | Admin panel |
| superadmin | 4 | Full access |

## Riesgos
1. localStorage fallback no tiene validación real
2. Sin refresh token rotation implementado
3. Sin rate limiting en login/register
4. Sin MFA/2FA

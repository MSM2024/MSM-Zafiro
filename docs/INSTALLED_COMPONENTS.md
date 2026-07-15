# INSTALLED COMPONENTS — ZAFIRO

## Dependencias de Producción
| Paquete | Versión | Propósito |
|---------|---------|-----------|
| next | 16.2.10 | Framework |
| react / react-dom | 19.2.4 | UI |
| @supabase/ssr | ^0.12.0 | Supabase SSR auth |
| @supabase/supabase-js | ^2.110.1 | Supabase client |
| lucide-react | ^1.23.0 | Iconos |
| motion | ^12.42.2 | Animaciones |

## Dependencias de Desarrollo
| Paquete | Propósito |
|---------|-----------|
| @tailwindcss/postcss | Tailwind v4 PostCSS |
| tailwindcss | CSS framework |
| typescript | TypeScript |
| eslint / eslint-config-next | Linting |

## Packages Internos (11)
| Package | Archivos | Estado |
|---------|----------|--------|
| @zafiro/types | 1 | FUNCIONAL |
| @zafiro/events | 2 | FUNCIONAL |
| @zafiro/frequency-origin | 1 | FUNCIONAL |
| @zafiro/guardians | 1 | FUNCIONAL |
| @zafiro/offline | 1 | FUNCIONAL |
| @zafiro/eliana | 1 | PARCIAL |
| @zafiro/whatsapp | 1 | PARCIAL |
| @zafiro/sync | 2 | FUNCIONAL |
| @zafiro/digital-twin | 2 | FUNCIONAL |
| @zafiro/mesh-bridge | 1 | FUNCIONAL |
| @zafiro/adaptive-router | 1 | FUNCIONAL |
| @zafiro/portable-eliana | 1 | FUNCIONAL |

## Rutas (39 total)
- Static: 35 (/, /about, /terms, /privacy, etc.)
- Dynamic: 3 (/api/chat, /perfil/[username], /api/whatsapp/webhook, /api/sync, /api/economia/cierre)
- Proxy middleware: 1

## Migraciones SQL (4)
| Migración | Tablas | Propósito |
|-----------|--------|-----------|
| 00001_auth_roles_profiles.sql | auth users, roles, profiles | Auth + roles |
| 00002_economia_schema.sql | economia_*, frequency_*, guardian_* | Economía + frecuencia |
| 00003_frequency_origin.sql | frequency_channels, nodes, events, conversation_state | Frecuencia Origen |
| 00004_rls_frequency_origin.sql | RLS policies | Seguridad |

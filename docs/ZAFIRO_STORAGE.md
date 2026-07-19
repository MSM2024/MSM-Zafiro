# ZAFIRO OS — Storage Layer

## Capas de Almacenamiento

### A. Local

- IndexedDB — Datos offline, operaciones pendientes, caché
- localStorage — Preferencias, configuración de UI
- Cache API — Assets, respuestas de API
- Configuración de sesión

### B. Cloud (Supabase/PostgreSQL)

- Datos persistentes de usuarios
- Perfiles, membresías, roles
- Operaciones económicas
- Auditoría
- Backups

### C. Externo (BYOS — Bring Your Own Storage)

- Google Drive
- OneDrive
- S3 compatible
- Almacenamiento elegido por la organización

## Modo Offline

| Estado | Descripción |
|--------|-------------|
| ONLINE | Conexión activa, operaciones en tiempo real |
| OFFLINE | Sin conexión, operaciones en cola local |
| RECONNECTING | Reconectando, sincronizando pendientes |
| SYNC_ERROR | Error de sincronización, requiere revisión |

## Seguridad

- Cifrado en reposo (AES-256 para datos locales)
- Cifrado en tránsito (HTTPS/TLS)
- Checksum en cada documento
- Firma de operaciones
- Backup automatizado
- Retention policy configurable

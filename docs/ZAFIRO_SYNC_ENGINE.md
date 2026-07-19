# ZAFIRO OS — Sync Engine

## Propósito

Sincronización offline/online con resolución de conflictos, idempotencia y auditoría.

## Estados de Sincronización

- `SAVED` — Guardado localmente
- `PENDING` — Pendiente de sincronizar
- `SYNCING` — Sincronizando
- `SYNCED` — Sincronizado correctamente
- `CONFLICT` — Conflicto detectado
- `ERROR` — Error de sincronización
- `REQUIRES_REVIEW` — Requiere revisión manual

## Componentes

| Componente | Función |
|------------|---------|
| SyncQueue | Cola de operaciones pendientes |
| ConflictResolver | Resolución automática (last-write-wins o merge) |
| IdempotencyGuard | Evita duplicados por reintentos |
| ChecksumValidator | Verifica integridad de datos |
| StorageAdapter | Adaptador para diferentes backends |

## Requisitos

- Idempotencia en todas las operaciones
- Versionado de documentos
- Checksum para detección de corrupción
- Resolución de conflictos automática y manual
- Cola persistente en IndexedDB
- Reintentos con backoff exponencial
- Restauración desde backup
- Cifrado en reposo y tránsito

# ZAFIRO Sync Engine — Sincronización Offline

## Arquitectura

```
Usuario Offline → Queue (localStorage) → Procesamiento Automático → API → OK
                      ↓ fallback
               Reintento (3x) → Error → Requiere revisión
```

## Operaciones Soportadas

| Tipo | Payload | Idempotency |
|------|---------|-------------|
| `CREATE` | { entity, data } | checksum del data |
| `UPDATE` | { entity, id, changes } | checksum de changes |
| `DELETE` | { entity, id } | entity + id |
| `SYNC` | { module, payload } | checksum del payload |

## Ciclo de Vida

1. **Enqueue**: `enqueueOperation(type, entity, data, actorId, deviceId)`
   - Genera idempotencyKey (SHA-256 checksum)
   - Guarda en `zafiro_sync_queue`
   - Retorna `operationId`

2. **Process**: `processSyncQueue()`
   - Drenaje FIFO
   - Máximo 10 por lote
   - Retry 3 veces con backoff
   - Marca `synced` o `failed`

3. **Stats**: `getSyncStats()`
   - `total`, `pending`, `synced`, `failed`

## Verificación

```js
import { enqueueOperation, processSyncQueue, getSyncStats } from '@/lib/performance/sync-engine'

// Encolar
const id = enqueueOperation('CREATE', 'follower', { name: 'Test' }, 'actor-1', 'device-1')

// Procesar
await processSyncQueue()

// Estado
const stats = getSyncStats() // { total: 1, pending: 0, synced: 1, failed: 0 }
```

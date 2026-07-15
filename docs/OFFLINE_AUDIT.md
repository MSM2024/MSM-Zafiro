# OFFLINE AUDIT — ZAFIRO

## Capacidades Offline Actuales
| Componente | Estado | Persistencia |
|------------|--------|-------------|
| PWA Service Worker | ✅ Creado | Cache API |
| Offline page | ✅ Creado | Static |
| SyncEngine | ✅ Creado | localStorage |
| SyncQueue | ✅ Creado | localStorage |
| OfflineOperation types | ✅ Creado | localStorage |
| Manifest | ✅ webmanifest | — |

## localStorage Keys (17)
| Key | Propósito | Módulo |
|-----|-----------|--------|
| zafiro_messages | Mensajes | Messages |
| zafiro_contact_messages | Contacto | Contact |
| zafiro_profile | Perfil | Profile |
| zafiro_campaigns | Campañas | Sponsors |
| zafiro_universo | Conexiones | Universo |
| zafiro_comentarios | Comentarios | Gemología |
| zafiro_publicaciones | Publicaciones | Social |
| zafiro_following | Seguidos | Social |
| zafiro_dark | Tema | UI |
| zafiro_pts_accounts | PTS | Payments |
| zafiro_referrals | Referidos | Referidos |
| zafiro_rewards | Recompensas | Rewards |
| zafiro_economia | Economía | Economía (nueva) |
| zafiro_sync_queue | Sync queue | Sync (nueva) |
| zafiro_messages_* | Mensajes chat | Chat |
| zafiro_profile_data | Perfil data | Profile |
| zafiro_user_settings | Settings | Settings |

## Lo que Falta
1. IndexedDB database wrapper (reemplazar localStorage gradualmente)
2. Cola de operaciones con confirmación visual
3. Sincronización automática al reconectar
4. Indicador de estado offline/online en UI
5. Cache de API requests para lectura offline
6. Conflicto de resolución (último escritor gana por ahora)

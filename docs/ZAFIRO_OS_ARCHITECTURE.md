# ZAFIRO OS — Arquitectura

## Capas

```
┌─────────────────────────────────────────────┐
│              EXPERIENCE LAYER                │
│  ZAFIRO Shell · Desktop · Mobile · Holo     │
├─────────────────────────────────────────────┤
│              APPLICATION LAYER               │
│  App Launcher · Window Manager · Widgets     │
├─────────────────────────────────────────────┤
│              INTEGRATION LAYER               │
│  Identity · Security · Events · Sync        │
├─────────────────────────────────────────────┤
│              CONNECTOR LAYER                 │
│  Marketplace · Editorial · Economy · Comms   │
├─────────────────────────────────────────────┤
│              STORAGE LAYER                   │
│  Local (IndexedDB) · Cloud (Supabase) · Ext  │
├─────────────────────────────────────────────┤
│              HARDWARE LAYER                  │
│  Web · PWA · Tauri Desktop · Android · AOSP │
└─────────────────────────────────────────────┘
```

## Núcleos

| Core | Responsabilidad |
|------|----------------|
| Identity Core | Usuarios, perfiles, membresías, roles, KYC, KYB |
| Security Core | Auth, MFA, RBAC, RLS, cifrado, auditoría |
| Permission Engine | Permisos granulares por usuario, rol y módulo |
| Event Bus | Comunicación asíncrona entre módulos |
| Sync Engine | Sincronización offline/online con resolución de conflictos |
| Storage Layer | Almacenamiento local, cloud y externo |
| ELIANA Core | Asistente central, contexto, adaptadores |
| App Launcher | Descubrimiento, instalación y gestión de aplicaciones |
| Notification Center | Notificaciones push, internas y por canal |
| Search Engine | Búsqueda universal a través de todos los módulos |
| Communication Hub | Gmail, WhatsApp, mensajes internos, emisoras |
| Holo Runtime | Experiencias 3D, WebGL, telepresencia |
| Device Manager | Dispositivos, sesiones, confianza, revocación |
| Audit Engine | Registro inmutable de todas las operaciones |

## Reglas Arquitectónicas

1. Cada módulo tiene su propia base de datos o esquema
2. Los módulos se comunican solo a través del Event Bus
3. No hay dependencias circulares entre módulos
4. Cada módulo expone una API REST o GraphQL
5. Las integraciones externas usan adaptadores
6. Todos los eventos son auditados
7. Los secretos nunca están en frontend
8. Las operaciones críticas requieren aprobación del OWNER

# ZAFIRO OS — Modelo de Aplicaciones

## Estructura de una Aplicación

```typescript
interface ZafiroApp {
  appId: string
  name: string
  description: string
  version: string
  icon: string
  route: string
  permissions: string[]
  status: AppStatus
  category: AppCategory
  offlineSupport: boolean
  requiredMembership?: string
  requiredVerification?: boolean
  featureFlags?: string[]
  checksum: string
  publisher: string
  installState: InstallState
}
```

## Estados

| Estado | Descripción |
|--------|-------------|
| `AVAILABLE` | Disponible para instalar |
| `INSTALLED` | Instalada y lista |
| `DISABLED` | Deshabilitada por permisos o restricción |
| `UPDATE_AVAILABLE` | Actualización pendiente |
| `RESTRICTED` | Requiere membresía o verificación |
| `REMOVED` | Desinstalada |

## Aplicaciones Iniciales

| App | Categoría | Offline |
|-----|-----------|---------|
| Mi Perfil | Identidad | ✅ |
| ELIANA | Asistente | ✅ |
| MSM Marketplace | Comercio | ❌ |
| MSM Editorial | Conocimiento | ❌ |
| MSM Economía | Operativa | ❌ |
| Comunidad | Social | ✅ |
| Familia | Social | ✅ |
| Proyectos | Productividad | ✅ |
| Mensajes | Comunicación | ✅ |
| Archivos | Almacenamiento | ✅ |
| Notificaciones | Sistema | ✅ |
| Seguridad | Sistema | ❌ |
| Dispositivos | Sistema | ✅ |
| Emisoras en Vivo | Multimedia | ❌ |
| Holo Cinema | Experiencia | ❌ |
| Administración | Sistema | ❌ |

## Permisos por App

Cada aplicación declara los permisos que necesita. El usuario otorga o deniega. Ejemplos:

- `identity.profile.read` — Leer perfil público
- `identity.profile.write` — Actualizar perfil
- `marketplace.orders.read` — Leer pedidos
- `economy.operations.read` — Leer operaciones
- `storage.files.read` — Leer archivos
- `comms.email.read` — Leer correos
- `comms.whatsapp.send` — Enviar WhatsApp
- `devices.manage` — Gestionar dispositivos

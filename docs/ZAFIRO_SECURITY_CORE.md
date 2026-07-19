# ZAFIRO OS — Security Core

## Implementaciones

- Supabase Auth o proveedor validado
- MFA (autenticación multifactor)
- RBAC (control de acceso basado en roles)
- RLS (Row Level Security en PostgreSQL)
- CSP (Content Security Policy)
- CORS configurado
- CSRF protection
- Rate limiting
- Protección contra replay attacks
- Firmas de eventos
- Cifrado en tránsito (HTTPS/TLS)
- Cifrado local (IndexedDB cifrada)
- Secretos en servidor (variables de entorno, no en frontend)
- Auditoría append-only
- Protección de sesiones
- Revocación de dispositivos
- Bloqueo remoto
- Alertas de seguridad
- Recuperación de cuenta

## Módulos de Seguridad

| Módulo | Función |
|--------|---------|
| SecurityCenter | Panel de configuración de seguridad |
| DeviceTrustManager | Gestión de confianza de dispositivos |
| SessionManager | Sesiones activas, expiración, revocación |
| PermissionManager | Gestión granular de permisos |
| AuditViewer | Visualización de auditoría |
| EmergencyLock | Bloqueo de emergencia de todas las sesiones |
| OwnerApprovalGate | Gate de aprobación para acciones críticas |

## Prohibiciones

- No guardar contraseñas en código, BD o logs
- No guardar códigos 2FA
- No guardar semillas o claves privadas
- No exponer tokens en frontend
- No guardar documentos KYC en Git
- No almacenar datos biométricos en logs
- No enviar secretos por mensajes no cifrados

# ZAFIRO OS — Identity Core

## Responsabilidad

Administrar usuarios, perfiles, membresías, roles, permisos, KYC, KYB, sesiones, dispositivos y auditoría de identidad.

## Modelos

- `users` — Cuenta central, email, auth provider, MFA
- `profiles` — Nombre, bio, avatar, redes, ubicación
- `private_profiles` — Datos privados (dirección, teléfono, documento)
- `memberships` — Plan, vigencia, beneficios, stripeCustomerId
- `businesses` — Negocios registrados (KYB)
- `business_members` — Miembros de un negocio con roles
- `kyc_cases` — Solicitudes KYC con documentos y estados
- `kyb_cases` — Solicitudes KYB con documentos y estados
- `roles` — Catálogo de roles del sistema
- `permissions` — Catálogo de permisos
- `user_roles` — Asignación de roles a usuarios
- `role_permissions` — Permisos por rol
- `badges` — Insignias (FUNDADOR, VIP, OWNER, etc.)
- `user_badges` — Insignias otorgadas a usuarios
- `consent_records` — Registro de consentimientos
- `devices` — Dispositivos registrados
- `device_sessions` — Sesiones activas por dispositivo
- `platform_access` — Acceso por plataforma (web, desktop, mobile)
- `identity_audit_events` — Auditoría de identidad

## Reglas

- Una cuenta MSM por persona
- Un zafiroUserId único
- Ninguna contraseña en SQL
- Ningún documento KYC en frontend
- MFA para administradores
- Sesiones verificadas en servidor
- Tokens de corta duración
- Reautenticación para acciones críticas

## OWNER

| Campo | Valor |
|-------|-------|
| Nombre | Miguel Soria Martínez |
| Email | cm8msm@gmail.com |
| Rol | OWNER_SUPERADMIN |
| Membresía | LIFETIME_UNLIMITED |
| Insignias | FUNDADOR, OWNER, ADMINISTRADOR_OFICIAL, EQUIPO_MSM, VIP |

### Permisos del OWNER

- system.manage, identity.manage, users.manage, roles.manage
- memberships.manage, kyc.review, kyb.review
- marketplace.manage, editorial.manage, economy.manage
- eliana.configure, devices.manage, security.manage
- audit.read, deployments.read

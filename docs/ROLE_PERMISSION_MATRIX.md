# Matriz de Roles y Permisos — ZAFIRO

## Los 6 roles

| # | Rol | Descripción |
|---|-----|-------------|
| 1 | `OWNER_SUPERADMIN` | Dueño del sistema. Acceso total. Permisos irrestrictos. |
| 2 | `ADMIN` | Administrador general. Gestiona usuarios, membresías, contenido. |
| 3 | `COMPLIANCE_REVIEWER` | Revisor de cumplimiento. Enfocado en KYC/KYB. |
| 4 | `SUPPORT_AGENT` | Agente de soporte. Solo lectura para ayudar usuarios. |
| 5 | `ENTREPRENEUR` | Emprendedor. Acceso al marketplace. |
| 6 | `USER` | Usuario estándar. Solo lectura básica. |

---

## Los 16 permisos

| # | Permiso | Descripción |
|---|---------|-------------|
| 1 | `users.read` | Leer perfiles y datos de usuarios |
| 2 | `users.update` | Actualizar perfiles de usuarios |
| 3 | `users.suspend` | Suspender o desactivar cuentas |
| 4 | `roles.manage` | Asignar y cambiar roles de usuario |
| 5 | `memberships.manage` | Gestionar niveles de membresía (STANDARD, VIP, ENTREPRENEUR_VIP) |
| 6 | `kyc.read` | Leer casos, documentos y revisiones KYC |
| 7 | `kyc.review` | Revisar casos KYC pendientes |
| 8 | `kyc.approve` | Aprobar verificaciones KYC |
| 9 | `kyc.reject` | Rechazar verificaciones KYC |
| 10 | `kyb.review` | Revisar verificaciones empresariales |
| 11 | `kyb.approve` | Aprobar verificaciones empresariales |
| 12 | `audit.read` | Leer logs de auditoría (verification_events, admin_actions) |
| 13 | `system.configure` | Configurar parámetros del sistema |
| 14 | `plans.manage` | Gestionar planes de membresía y precios |
| 15 | `marketplace.manage` | Gestionar el marketplace y publicaciones |
| 16 | `economy.manage` | Gestionar la economía interna (puntos, recompensas) |
| 17 | `security.manage` | Gestionar configuraciones de seguridad |

---

## Matriz de permisos por rol

| Permiso | OWNER | ADMIN | COMPLIANCE | SUPPORT | ENTREPRENEUR | USER |
|---------|:-----:|:-----:|:----------:|:-------:|:------------:|:----:|
| `users.read` | ✓ | ✓ | | ✓ | ✓ | ✓ |
| `users.update` | ✓ | ✓ | | | | |
| `users.suspend` | ✓ | | | | | |
| `roles.manage` | ✓ | | | | | |
| `memberships.manage` | ✓ | ✓ | | | | |
| `kyc.read` | ✓ | ✓ | ✓ | ✓ | | |
| `kyc.review` | ✓ | ✓ | ✓ | | | |
| `kyc.approve` | ✓ | | ✓ | | | |
| `kyc.reject` | ✓ | | ✓ | | | |
| `kyb.review` | ✓ | ✓ | ✓ | | | |
| `kyb.approve` | ✓ | | ✓ | | | |
| `audit.read` | ✓ | ✓ | ✓ | | | |
| `system.configure` | ✓ | | | | | |
| `plans.manage` | ✓ | ✓ | | | | |
| `marketplace.manage` | ✓ | ✓ | | | ✓ | |
| `economy.manage` | ✓ | | | | | |
| `security.manage` | ✓ | | | | | |

---

## Lo que cada rol PUEDE y NO PUEDE hacer

### OWNER_SUPERADMIN

**PUEDE:**
- Todo lo que cualquier otro rol puede hacer
- Suspender y eliminar usuarios
- Cambiar roles de cualquier usuario
- Aprobar y rechazar KYC/KYB
- Configurar el sistema
- Gestionar la economía
- Gestionar seguridad
- Acceder a todos los logs de auditoría
- Realizar acciones que requieren MFA

**NO PUEDE:**
- Nada está prohibido para este rol

### ADMIN

**PUEDE:**
- Leer y actualizar usuarios
- Gestionar membresías
- Revisar casos KYC y KYB
- Leer logs de auditoría
- Gestionar planes y marketplace

**NO PUEDE:**
- Suspender usuarios (`users.suspend`)
- Cambiar roles (`roles.manage`)
- Aprobar o rechazar KYC/KYB directamente
- Configurar el sistema
- Gestionar economía
- Gestionar seguridad

### COMPLIANCE_REVIEWER

**PUEDE:**
- Leer, revisar, aprobar y rechazar KYC
- Revisar y aprobar KYB
- Leer logs de auditoría

**NO PUEDE:**
- Modificar usuarios
- Cambiar membresías
- Configurar el sistema
- Gestionar marketplace o economía
- Acceder a funciones de admin general

### SUPPORT_AGENT

**PUEDE:**
- Leer perfiles de usuarios
- Leer casos KYC

**NO PUEDE:**
- Modificar datos de usuarios
- Revisar o decidir KYC
- Acceder a logs de auditoría
- Realizar ninguna acción administrativa

### ENTREPRENEUR

**PUEDE:**
- Leer perfiles de usuarios
- Gestionar contenido en el marketplace

**NO PUEDE:**
- Acceder a datos de otros usuarios
- Revisar KYC
- Realizar acciones administrativas
- Configurar el sistema

### USER

**PUEDE:**
- Leer perfiles de usuarios (básico)

**NO PUEDE:**
- Modificar datos de otros usuarios
- Revisar KYC
- Realizar acciones administrativas
- Acceder a logs de auditoría
- Gestionar marketplace

---

## Implementación en src/lib/identity.ts

### Definición del mapa de permisos

```typescript
const PERMISSION_MAP: Record<UserRole, Permission[]> = {
  OWNER_SUPERADMIN: [
    'users.read', 'users.update', 'users.suspend',
    'roles.manage', 'memberships.manage',
    'kyc.read', 'kyc.review', 'kyc.approve', 'kyc.reject',
    'kyb.review', 'kyb.approve',
    'audit.read', 'system.configure',
    'plans.manage', 'marketplace.manage', 'economy.manage', 'security.manage',
  ],
  ADMIN: [
    'users.read', 'users.update',
    'memberships.manage',
    'kyc.read', 'kyc.review',
    'kyb.review',
    'audit.read',
    'plans.manage', 'marketplace.manage',
  ],
  COMPLIANCE_REVIEWER: [
    'kyc.read', 'kyc.review', 'kyc.approve', 'kyc.reject',
    'kyb.review', 'kyb.approve',
    'audit.read',
  ],
  SUPPORT_AGENT: ['users.read', 'kyc.read'],
  ENTREPRENEUR: ['users.read', 'marketplace.manage'],
  USER: ['users.read'],
}
```

### Función hasPermission

```typescript
export function hasPermission(
  profile: Profile | undefined,
  permission: Permission
): boolean {
  if (!profile) return false
  return (PERMISSION_MAP[profile.role] || []).includes(permission)
}
```

- Recibe un perfil y un permiso
- Retorna `true` si el rol del perfil tiene ese permiso
- Retorna `false` si el perfil es `undefined` o no tiene el permiso

### Función can

```typescript
export function can(permission: Permission): boolean {
  const session = getSession()
  if (!session) return false
  const profile = getProfileByAuthId(session.id)
  return hasPermission(profile, permission)
}
```

- Función de conveniencia que obtiene la sesión actual automáticamente
- Útil para checks rápidos en componentes UI
- Retorna `false` si no hay sesión activa

### Uso en componentes

```typescript
import { can } from '@/lib/identity'

// En un componente
if (can('kyc.approve')) {
  // Mostrar botón de aprobar KYC
}

if (can('users.suspend')) {
  // Mostrar opción de suspender usuario
}
```

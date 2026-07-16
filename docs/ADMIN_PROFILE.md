# Perfil Administrativo — Don Miguel

## Bootstrap automático via env vars

El perfil de administrador principal (Don Miguel) se bootstrap automáticamente al iniciar sesión usando variables de entorno configuradas en `.env.local`:

```
NEXT_PUBLIC_ZAFIRO_OWNER_EMAIL=cm8msm@gmail.com
NEXT_PUBLIC_ZAFIRO_OWNER_DISPLAY_NAME=Don Miguel
```

**Proceso:**
1. El usuario inicia sesión con su email
2. `bootstrapOwnerProfile()` compara el email de la sesión con `OWNER_EMAIL`
3. Si coinciden (case-insensitive), se crea o actualiza el perfil automáticamente
4. Se asignan: rol `OWNER_SUPERADMIN`, tier `VIP`, VIP activo, verificación aprobada
5. Se otorgan 4 insignias automáticas
6. Se registra un evento `OWNER_BOOTSTRAPPED` en el log de auditoría

El sistema es idempotente — si el perfil ya existe, solo actualiza los campos de administrador.

## Permisos de OWNER_SUPERADMIN

El rol `OWNER_SUPERADMIN` tiene los 16 permisos disponibles en el sistema:

| # | Permiso | Descripción |
|---|---------|-------------|
| 1 | `users.read` | Leer perfiles de usuarios |
| 2 | `users.update` | Actualizar perfiles de usuarios |
| 3 | `users.suspend` | Suspender cuentas de usuarios |
| 4 | `roles.manage` | Gestionar roles del sistema |
| 5 | `memberships.manage` | Gestionar niveles de membresía |
| 6 | `kyc.read` | Leer casos y documentos KYC |
| 7 | `kyc.review` | Revisar casos KYC |
| 8 | `kyc.approve` | Aprobar verificaciones KYC |
| 9 | `kyc.reject` | Rechazar verificaciones KYC |
| 10 | `kyb.review` | Revisar verificaciones empresariales |
| 11 | `kyb.approve` | Aprobar verificaciones empresariales |
| 12 | `audit.read` | Leer logs de auditoría |
| 13 | `system.configure` | Configurar el sistema |
| 14 | `plans.manage` | Gestionar planes de membresía |
| 15 | `marketplace.manage` | Gestionar el marketplace |
| 16 | `economy.manage` | Gestionar la economía del sistema |
| 17 | `security.manage` | Gestionar configuraciones de seguridad |

## Acciones críticas que requieren MFA + confirmación + auditoría

Toda acción administrativa crítica pasa por el sistema `recordAdminAction()`, que requiere:

1. **MFA verificado** (`mfaVerified: true`) — La acción no se registra si `mfaVerified` es `false`
2. **Confirmación** — El sistema solicita confirmación antes de ejecutar
3. **Auditoría** — Cada acción genera un registro append-only con:
   - `actorProfileId` — Quién realizó la acción
   - `actionType` — Tipo de acción
   - `targetType` y `targetId` — Qué se afectó
   - `reason` — Razón obligatoria
   - `operationId` — ID único de operación
   - `metadata` — Datos adicionales

**Acciones que requieren este flujo:**
- Suspender usuarios (`users.suspend`)
- Cambiar roles (`roles.manage`)
- Gestionar membresías (`memberships.manage`)
- Aprobar/rechazar KYC/KYB
- Configurar el sistema (`system.configure`)
- Gestionar economía y planes

Cada acción también genera un `verification_events` correspondiente para mantener el log de auditoría completo.

## Proceso de bootstrapping en src/lib/identity.ts

El archivo `src/lib/identity.ts` (línea 509-541) implementa el bootstrap:

```typescript
// Variables de entorno
const OWNER_EMAIL = process.env.NEXT_PUBLIC_ZAFIRO_OWNER_EMAIL || 'cm8msm@gmail.com'
const OWNER_DISPLAY = process.env.NEXT_PUBLIC_ZAFIRO_OWNER_DISPLAY_NAME || 'Don Miguel'

export function bootstrapOwnerProfile(): Profile | undefined
```

**Flujo interno:**
1. Obtiene la sesión actual vía `getSession()`
2. Verifica si el email coincide con `OWNER_EMAIL`
3. Busca perfil existente por `authUserId`
4. Si no existe → `createProfile()` con rol `OWNER_SUPERADMIN`
5. Actualiza el perfil con: `role: 'OWNER_SUPERADMIN'`, `membershipTier: 'VIP'`, `vipStatus: 'VIP_ACTIVE'`, `verificationStatus: 'APPROVED'`
6. Otorga insignias: `ADMINISTRADOR_OFICIAL`, `VIP`, `IDENTIDAD_VERIFICADA`, `FUNDADOR`
7. Registra evento `OWNER_BOOTSTRAPPED`

## Cómo funciona bootstrapOwnerProfile()

```typescript
export function bootstrapOwnerProfile(): Profile | undefined {
  // 1. Verificar sesión
  const session = getSession()
  if (!session) return undefined

  // 2. Verificar email del owner
  const isOwner = session.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()
  if (!isOwner) return undefined

  // 3. Buscar o crear perfil
  let profile = getProfileByAuthId(session.id)
  if (!profile) {
    profile = createProfile(
      session.id,
      OWNER_DISPLAY,
      session.email || OWNER_EMAIL,
      'OWNER_SUPERADMIN'
    )
  }

  // 4. Actualizar con privilegios de owner
  profile = updateProfile(profile.id, {
    role: 'OWNER_SUPERADMIN',
    membershipTier: 'VIP',
    vipStatus: 'VIP_ACTIVE',
    verificationStatus: 'APPROVED',
  }) || profile

  // 5. Otorgar insignias
  awardBadge(profile.id, 'ADMINISTRADOR_OFICIAL')
  awardBadge(profile.id, 'VIP')
  awardBadge(profile.id, 'IDENTIDAD_VERIFICADA')
  awardBadge(profile.id, 'FUNDADOR')

  // 6. Registrar en auditoría
  recordEvent('profile', profile.id, 'OWNER_BOOTSTRAPPED', profile.id)

  return profile
}
```

**Notas importantes:**
- Las funciones `awardBadge` son idempotentes — no duplican insignias existentes
- El `updateProfile` sobrescribe los campos críticos cada vez (seguridad)
- El evento `OWNER_BOOTSTRAPPED` permite rastrear cuándo se activó el owner
- Si el email no coincide, la función retorna `undefined` silenciosamente

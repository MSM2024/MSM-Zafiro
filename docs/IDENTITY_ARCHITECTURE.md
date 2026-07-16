# Arquitectura de Identidad — ZAFIRO

## Resumen del sistema de identidad soberana

ZAFIRO implementa un sistema de identidad soberana donde el usuario es dueño de su perfil, su nivel de acceso y su estado de verificación. El sistema está diseñado para funcionar sin servidor (localStorage como MVP) y escalar a Supabase cuando se conecte.

Las tres dimensiones de identidad están completamente separadas y pueden cambiar independientemente una de otra:

- **Rol del sistema** → Define QUÉ puedes hacer en la plataforma
- **Nivel de membresía** → Define QUÉ beneficios y funciones tienes disponibles
- **Estado de verificación** → Define QUÉ tan verificado estás ante el sistema

Esta separación permite que un usuario pueda ser VIP sin estar verificado, estar verificado sin ser VIP, o tener un rol administrativo sin necesariamente tener verificación completa.

## Las 3 dimensiones separadas

### 1. Rol del sistema (QUIÉN eres)

Determina los permisos y capacidades del usuario dentro de la plataforma. Se asigna al registro y puede ser gestionado por administradores.

### 2. Nivel de membresía (QUÉ beneficios tienes)

Determina el tier de acceso y los beneficios disponibles. Independiente del rol — un OWNER_SUPERADMIN puede tener tier STANDARD o VIP.

### 3. Estado de verificación (QUÉ tan verificado estás)

Rastrea el progreso del proceso KYC/KYB. Independiente del rol y del tier — un usuario puede ser VIP sin estar verificado.

## Mapa de tipos

### UserRole (6 roles)

| Tipo | Descripción |
|------|-------------|
| `OWNER_SUPERADMIN` | Dueño del sistema, permisos totales |
| `ADMIN` | Administrador general |
| `COMPLIANCE_REVIEWER` | Revisor de cumplimiento KYC/KYB |
| `SUPPORT_AGENT` | Agente de soporte, solo lectura |
| `ENTREPRENEUR` | Emprendedor con acceso al marketplace |
| `USER` | Usuario estándar |

### MembershipTier (3 niveles)

| Tipo | Descripción |
|------|-------------|
| `STANDARD` | Nivel base, sin beneficios premium |
| `VIP` | Membresía premium individual |
| `ENTREPRENEUR_VIP` | Membresía premium para negocios |

### VerificationStatus (8 estados)

| Tipo | Descripción |
|------|-------------|
| `NOT_STARTED` | Sin proceso de verificación |
| `IN_PROGRESS` | Verificación en curso |
| `PENDING_REVIEW` | Esperando revisión humana |
| `APPROVED` | Verificación aprobada |
| `REJECTED` | Verificación rechazada |
| `MORE_INFORMATION_REQUIRED` | Se necesita información adicional |
| `EXPIRED` | Verificación expirada |
| `SUSPENDED` | Verificación suspendida |

### RiskLevel (5 niveles)

| Tipo | Descripción |
|------|-------------|
| `LOW` | Riesgo bajo |
| `MEDIUM` | Riesgo medio |
| `HIGH` | Riesgo alto |
| `PROHIBITED` | Prohibido — no puede operar |
| `MANUAL_REVIEW` | Requiere revisión manual |

### VipStatus (6 estados)

| Tipo | Descripción |
|------|-------------|
| `VIP_PENDING_PAYMENT` | VIP activado, esperando pago |
| `VIP_ACTIVE` | VIP activo y pagado |
| `VIP_PAST_DUE` | Pago atrasado |
| `VIP_CANCEL_AT_PERIOD_END` | Cancelado, activo hasta fin de período |
| `VIP_SUSPENDED` | VIP suspendido |
| `VIP_EXPIRED` | VIP expirado |

### AccountStatus (4 estados)

| Tipo | Descripción |
|------|-------------|
| `ACTIVE` | Cuenta activa |
| `INACTIVE` | Cuenta inactiva |
| `SUSPENDED` | Cuenta suspendida |
| `CLOSED` | Cuenta cerrada |

### BadgeType (7 insignias)

| Tipo | Descripción |
|------|-------------|
| `ADMINISTRADOR_OFICIAL` | Insignia de administrador oficial |
| `VIP` | Insignia VIP |
| `IDENTIDAD_VERIFICADA` | Identidad verificada |
| `EMPRENDEDOR_VIP` | Emprendedor VIP |
| `NEGOCIO_VERIFICADO` | Negocio verificado |
| `FUNDADOR` | Fundador de ZAFIRO |
| `EQUIPO_MSM` | Miembro del equipo MSM |

## Diagrama de entidades

```
auth.users (Supabase Auth)
    │
    ├──► profiles_v2 (perfil público)
    │       ├── id (PK)
    │       ├── auth_user_id (FK → auth.users, UNIQUE)
    │       ├── public_handle (UNIQUE)
    │       ├── display_name
    │       ├── role (user_role enum)
    │       ├── membership_tier (membership_tier enum)
    │       ├── vip_status (vip_status enum)
    │       ├── account_status (account_status enum)
    │       ├── verification_status (verification_status enum)
    │       └── ... (preferred_name, biography, etc.)
    │
    ├──► profile_private_data (datos privados, 1:1)
    │       ├── id (PK)
    │       ├── profile_id (FK → profiles_v2, UNIQUE)
    │       ├── email, phone_e164, date_of_birth
    │       ├── legal_first_name, legal_middle_name, legal_last_name
    │       ├── address fields
    │       └── encrypted_identifier_reference
    │
    ├──► kyc_cases (verificación KYC, 1:1 por perfil)
    │       ├── id (PK)
    │       ├── profile_id (FK → profiles_v2)
    │       ├── status (verification_status)
    │       ├── risk_level (risk_level)
    │       ├── provider, provider_reference
    │       └── dates (submitted_at, reviewed_at, expires_at)
    │
    ├──► kyc_documents (documentos, N:1 con kyc_cases)
    │       ├── id (PK)
    │       ├── kyc_case_id (FK → kyc_cases)
    │       ├── document_type, storage_reference
    │       └── file_hash, status
    │
    ├──► kyc_provider_sessions (sesiones del proveedor, N:1)
    │       ├── id (PK)
    │       ├── kyc_case_id (FK → kyc_cases)
    │       ├── provider, provider_reference
    │       └── status, result (JSONB)
    │
    ├──► kyc_reviews (decisiones de revisión, N:1)
    │       ├── id (PK)
    │       ├── kyc_case_id (FK → kyc_cases)
    │       ├── reviewer_profile_id (FK → profiles_v2)
    │       ├── decision (verification_status)
    │       ├── reason_code, internal_note
    │       └── audit_event_id
    │
    ├──► business_profiles (perfil empresarial, 0:1)
    │       ├── id (PK)
    │       ├── owner_profile_id (FK → profiles_v2)
    │       ├── legal_business_name, entity_type
    │       ├── registered_address (JSONB)
    │       └── verification_status, risk_level
    │
    ├──► business_members (miembros del negocio, N:1)
    │       ├── id (PK)
    │       ├── business_profile_id (FK → business_profiles)
    │       ├── full_name, control_role
    │       ├── ownership_percentage
    │       └── kyc_status
    │
    ├──► beneficial_owners (beneficiarios finales, N:1)
    │       ├── id (PK)
    │       ├── business_profile_id (FK → business_profiles)
    │       ├── full_name, ownership_percentage
    │       └── kyc_status
    │
    ├──► consent_records (consentimientos, append-only)
    │       ├── id (PK)
    │       ├── profile_id (FK → profiles_v2)
    │       ├── consent_type, consent_version
    │       ├── granted (boolean)
    │       └── ip_address, user_agent
    │
    ├──► verification_events (log de auditoría, append-only)
    │       ├── id (PK)
    │       ├── entity_type, entity_id
    │       ├── event_type
    │       ├── actor_profile_id (FK → profiles_v2)
    │       ├── previous_status, new_status
    │       ├── operation_id (UNIQUE)
    │       └── metadata (JSONB)
    │
    ├──► profile_badges (insignias, N:1)
    │       ├── id (PK)
    │       ├── profile_id (FK → profiles_v2)
    │       ├── badge_type (badge_type enum)
    │       ├── earned_at, expires_at
    │       └── UNIQUE(profile_id, badge_type)
    │
    └──► admin_actions (acciones admin, append-only)
            ├── id (PK)
            ├── actor_profile_id (FK → profiles_v2)
            ├── action_type, target_type, target_id
            ├── reason
            ├── mfa_verified (debe ser true)
            └── operation_id (UNIQUE)
```

### Relaciones clave

| Relación | Cardinalidad | Descripción |
|----------|-------------|-------------|
| profiles_v2 ↔ profile_private_data | 1:1 | Datos privados separados del perfil público |
| profiles_v2 ↔ kyc_cases | 1:1 | Un caso KYC por perfil |
| kyc_cases ↔ kyc_documents | 1:N | Múltiples documentos por caso |
| kyc_cases ↔ kyc_reviews | 1:N | Múltiples revisiones por caso |
| profiles_v2 ↔ business_profiles | 1:0..1 | Solo emprendedores tienen perfil empresarial |
| business_profiles ↔ business_members | 1:N | Múltiples miembros por negocio |
| business_profiles ↔ beneficial_owners | 1:N | Múltiples beneficiarios finales |
| profiles_v2 ↔ consent_records | 1:N | Histórico de consentimientos |
| profiles_v2 ↔ verification_events | 1:N | Actor en eventos de auditoría |
| profiles_v2 ↔ profile_badges | 1:N | Múltiples insignias por perfil |
| profiles_v2 ↔ admin_actions | 1:N | Acciones administrativas realizadas |

## Storage

### localStorage (activo para MVP)

El sistema actual funciona completamente con localStorage. Todas las tablas se almacenan como arrays JSON bajo claves específicas:

| Clave | Contenido |
|-------|-----------|
| `zafiro_v2_profiles` | Perfiles públicos |
| `zafiro_v2_private` | Datos privados |
| `zafiro_v2_kyc_cases` | Casos KYC |
| `zafiro_v2_kyc_docs` | Documentos KYC |
| `zafiro_v2_kyc_reviews` | Revisiones KYC |
| `zafiro_v2_business` | Perfiles empresariales |
| `zafiro_v2_business_members` | Miembros del negocio |
| `zafiro_v2_consents` | Consentimientos |
| `zafiro_v2_events` | Eventos de auditoría |
| `zafiro_v2_admin_actions` | Acciones administrativas |
| `zafiro_v2_badges` | Insignias |

### Supabase (cuando esté conectado)

La migración SQL `00005_identity_system.sql` define todas las tablas, índices, políticas RLS, triggers y funciones necesarias para la versión en Supabase.

**Políticas RLS activas:**
- `profiles_v2`: propio usuario lee/escribe; admins leen todos
- `profile_private_data`: solo el propio usuario
- `kyc_cases`: propio lee; reviewers gestionan
- `kyc_documents`: solo reviewers vía URLs firmadas
- `business_profiles`: propio lee/escribe; reviewers gestionan
- `verification_events`: append-only; admins y owner leen
- `profile_badges`: todos leen; sistema inserta
- `admin_actions`: append-only; solo admins leen

**Trigger automático:**
- `on_auth_user_created_v2`: Al registrar un usuario en `auth.users`, crea automáticamente `profiles_v2` y `profile_private_data`.

## Referencia a las migraciones SQL

| Migración | Archivo | Contenido |
|-----------|---------|-----------|
| 00001 | `auth_roles_profiles.sql` | Roles base y tabla profiles inicial |
| 00002 | `economia_schema.sql` | Sistema económico (puntos, transacciones) |
| 00003 | `seals_module.sql` / `frequency_origin.sql` | Módulo de sellos y origen de frecuencia |
| 00004 | `rls_frequency_origin.sql` | RLS para frecuencia y origen |
| 00005 | `identity_system.sql` | **Sistema de identidad completo** |

La migración `00005` es la que implementa todo lo documentado aquí. Debe ejecutarse después de revisar:
1. Enums existentes en la base de datos
2. Nombres de tablas existentes (profiles ya existe en 00001)
3. Políticas RLS existentes
4. Referencias a `auth.users`

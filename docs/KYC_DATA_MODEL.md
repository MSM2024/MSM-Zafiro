# Modelo de Datos KYC — ZAFIRO

## profiles_v2

Tabla principal de perfiles públicos. Un registro por cada usuario registrado.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | Identificador único del perfil |
| `auth_user_id` | UUID (FK → auth.users, UNIQUE) | Referencia al usuario de Supabase Auth |
| `public_handle` | TEXT (UNIQUE) | Handle público (@usuario) |
| `display_name` | TEXT | Nombre para mostrar |
| `preferred_name` | TEXT | Nombre preferido (opcional) |
| `profile_photo_url` | TEXT | URL de la foto de perfil |
| `biography` | TEXT | Biografía del usuario |
| `business_category` | TEXT | Categoría de negocio |
| `role` | user_role (enum) | Rol del sistema (ver sección de enums) |
| `membership_tier` | membership_tier (enum) | Nivel de membresía |
| `vip_status` | vip_status (enum) | Estado VIP (nullable) |
| `account_status` | account_status (enum) | Estado de la cuenta |
| `verification_status` | verification_status (enum) | Estado de verificación KYC |
| `language` | TEXT | Idioma preferido (default: 'es') |
| `timezone` | TEXT | Zona horaria |
| `marketing_consent` | BOOLEAN | Consentimiento de marketing |
| `whatsapp_consent` | BOOLEAN | Consentimiento de WhatsApp |
| `privacy_version` | TEXT | Versión de política de privacidad aceptada |
| `terms_version` | TEXT | Versión de términos aceptada |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización (auto-update trigger) |

**Índices:**
- `idx_profiles_v2_auth_user` → `auth_user_id`
- `idx_profiles_v2_handle` → `public_handle`
- `idx_profiles_v2_role` → `role`
- `idx_profiles_v2_tier` → `membership_tier`
- `idx_profiles_v2_verification` → `verification_status`

---

## profile_private_data

Datos privados del perfil. Relación 1:1 con `profiles_v2`. Solo accesible por el propio usuario.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | Identificador único |
| `profile_id` | UUID (FK → profiles_v2, UNIQUE) | Referencia al perfil |
| `legal_first_name` | TEXT | Nombre legal |
| `legal_middle_name` | TEXT | Segundo nombre legal |
| `legal_last_name` | TEXT | Apellidos legales |
| `date_of_birth` | DATE | Fecha de nacimiento |
| `email` | TEXT | Email (obligatorio) |
| `phone_e164` | TEXT | Teléfono en formato E.164 |
| `country_code` | TEXT | Código de país |
| `province_region` | TEXT | Provincia o región |
| `municipality_city` | TEXT | Municipio o ciudad |
| `address_line1` | TEXT | Dirección línea 1 |
| `address_line2` | TEXT | Dirección línea 2 |
| `postal_code` | TEXT | Código postal |
| `encrypted_identifier_reference` | TEXT | Referencia a identificador cifrado |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |

> **Nota de cifrado:** Los campos sensibles deben cifrarse en reposo. El campo `encrypted_identifier_reference` almacena la referencia al identificador (pasaporte, licencia) cifrado. En localStorage, los datos se almacenan como JSON plano — el cifrado se implementa cuando se migra a Supabase.

---

## kyc_cases

Casos de verificación KYC. Relación 1:1 con `profiles_v2`.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | Identificador del caso |
| `profile_id` | UUID (FK → profiles_v2) | Perfil asociado |
| `status` | verification_status (enum) | Estado actual del caso |
| `risk_level` | risk_level (enum) | Nivel de riesgo evaluado |
| `provider` | TEXT | Nombre del proveedor KYC |
| `provider_reference` | TEXT | ID de referencia del proveedor |
| `assurance_level` | TEXT | Nivel de garantía alcanzado |
| `consent_record_id` | UUID | Referencia al consentimiento |
| `submitted_at` | TIMESTAMPTZ | Fecha de envío |
| `reviewed_at` | TIMESTAMPTZ | Fecha de revisión |
| `expires_at` | TIMESTAMPTZ | Fecha de expiración |
| `next_review_at` | TIMESTAMPTZ | Próxima revisión programada |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |

**Transiciones de estado válidas:**

```
NOT_STARTED → IN_PROGRESS
IN_PROGRESS → PENDING_REVIEW
IN_PROGRESS → MORE_INFORMATION_REQUIRED
MORE_INFORMATION_REQUIRED → IN_PROGRESS
PENDING_REVIEW → APPROVED
PENDING_REVIEW → REJECTED
PENDING_REVIEW → MORE_INFORMATION_REQUIRED
APPROVED → EXPIRED
APPROVED → SUSPENDED
```

**Índices:**
- `idx_kyc_cases_profile` → `profile_id`
- `idx_kyc_cases_status` → `status`
- `idx_kyc_cases_risk` → `risk_level`

---

## kyc_documents

Documentos subidos para verificación KYC. Relación N:1 con `kyc_cases`.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | Identificador del documento |
| `kyc_case_id` | UUID (FK → kyc_cases) | Caso KYC asociado |
| `document_type` | TEXT | Tipo de documento (passport, drivers_license, etc.) |
| `provider_reference` | TEXT | Referencia del proveedor |
| `storage_reference` | TEXT | Ruta en el bucket de almacenamiento privado |
| `file_name` | TEXT | Nombre original del archivo |
| `file_hash` | TEXT | Hash del archivo para verificar integridad |
| `status` | TEXT | Estado (uploaded, reviewed, rejected) |
| `reviewed_at` | TIMESTAMPTZ | Fecha de revisión |
| `review_note` | TEXT | Nota del revisor |
| `created_at` | TIMESTAMPTZ | Fecha de subida |

---

## kyc_provider_sessions

Sesiones con proveedores externos de KYC. Relación N:1 con `kyc_cases`.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | Identificador de la sesión |
| `kyc_case_id` | UUID (FK → kyc_cases) | Caso KYC asociado |
| `provider` | TEXT | Nombre del proveedor |
| `provider_reference` | TEXT | ID de referencia del proveedor |
| `session_url` | TEXT | URL de la sesión del proveedor |
| `status` | TEXT | Estado de la sesión (created, active, completed, expired) |
| `expires_at` | TIMESTAMPTZ | Fecha de expiración de la sesión |
| `result` | JSONB | Resultado completo del proveedor |
| `created_at` | TIMESTAMPTZ | Fecha de creación |

---

## kyc_reviews

Registro de decisiones de revisión. Relación N:1 con `kyc_cases`.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | Identificador de la revisión |
| `kyc_case_id` | UUID (FK → kyc_cases) | Caso KYC revisado |
| `reviewer_profile_id` | UUID (FK → profiles_v2) | Perfil del revisor |
| `decision` | verification_status (enum) | Decisión tomada |
| `reason_code` | TEXT | Código de razón |
| `internal_note` | TEXT | Nota interna del revisor |
| `provider_reference` | TEXT | Referencia del proveedor |
| `decided_at` | TIMESTAMPTZ | Fecha de la decisión |
| `next_review_at` | TIMESTAMPTZ | Próxima revisión programada |
| `audit_event_id` | TEXT | ID del evento de auditoría asociado |
| `created_at` | TIMESTAMPTZ | Fecha de creación del registro |

> **Nota:** Cada revisión es un registro append-only. No se editan ni eliminan revisiones existentes.

---

## business_profiles

Perfiles empresariales. Relación 1:1 con `profiles_v2` (solo para `ENTREPRENEUR_VIP`).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | Identificador del negocio |
| `owner_profile_id` | UUID (FK → profiles_v2) | Perfil del propietario |
| `legal_business_name` | TEXT | Nombre legal de la empresa |
| `trading_name` | TEXT | Nombre comercial |
| `entity_type` | TEXT | Tipo de entidad legal |
| `registration_number` | TEXT | Número de registro comercial |
| `tax_identifier_reference` | TEXT | Identificador fiscal |
| `incorporation_country` | TEXT | País de incorporación |
| `incorporation_region` | TEXT | Región de incorporación |
| `registered_address` | JSONB | Dirección registrada |
| `operating_address` | JSONB | Dirección operativa |
| `business_category` | TEXT | Categoría del negocio |
| `business_description` | TEXT | Descripción |
| `website` | TEXT | Sitio web |
| `support_email` | TEXT | Email de soporte |
| `support_phone` | TEXT | Teléfono de soporte |
| `expected_monthly_volume` | NUMERIC | Volumen mensual esperado |
| `expected_transaction_count` | INTEGER | Transacciones esperadas |
| `operating_countries` | TEXT[] | Países donde opera |
| `source_of_funds_category` | TEXT | Origen de fondos |
| `marketplace_category` | TEXT | Categoría en marketplace |
| `verification_status` | verification_status | Estado de verificación KYB |
| `risk_level` | risk_level | Nivel de riesgo |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Última actualización |

**Índices:**
- `idx_business_owner` → `owner_profile_id`
- `idx_business_verification` → `verification_status`

---

## verification_events

Log de auditoría append-only. Cada evento es inmutable.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID (PK) | Identificador del evento |
| `entity_type` | TEXT | Tipo de entidad (profile, kyc_case, business_profile, admin_action) |
| `entity_id` | UUID | ID de la entidad afectada |
| `event_type` | TEXT | Tipo de evento (CREATED, STATUS_APPROVED, OWNER_BOOTSTRAPPED, etc.) |
| `actor_profile_id` | UUID (FK → profiles_v2) | Quién realizó la acción |
| `previous_status` | TEXT | Estado anterior (para cambios de estado) |
| `new_status` | TEXT | Nuevo estado |
| `reason_code` | TEXT | Código de razón |
| `metadata` | JSONB | Datos adicionales del evento |
| `operation_id` | TEXT (UNIQUE) | ID único de operación (op_timestamp_random) |
| `created_at` | TIMESTAMPTZ | Fecha del evento |

**Índices:**
- `idx_verif_events_entity` → `(entity_type, entity_id)`
- `idx_verif_events_op` → `operation_id`
- `idx_verif_events_time` → `created_at DESC`

> **Política:** Esta tabla es append-only. Los eventos nunca se editan ni eliminan. La política RLS permite INSERT a cualquier usuario autenticado, pero SELECT solo a admins, compliance reviewers y el propio actor.

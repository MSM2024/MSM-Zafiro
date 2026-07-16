# Flujo KYB — ZAFIRO

## Flujo de verificación empresarial (Know Your Business)

El proceso KYB en ZAFIRO verifica la existencia legal de un negocio y la identidad de sus representantes.

---

## Requisito previo: KYC del representante

**El representante que registra el negocio DEBE completar su KYC personal primero.**

No se puede iniciar un proceso KYB sin tener verificación KYC aprobada (`verificationStatus: 'APPROVED'`).

```
Usuario quiere registrar negocio
    │
    ▼
¿Tiene KYC aprobado? ─── No ──► Completar KYC primero
    │
    Sí
    │
    ▼
Puede crear businessProfile
```

---

## Registro del negocio

### Campos requeridos

| Campo | Descripción | Obligatorio |
|-------|-------------|-------------|
| `legal_business_name` | Nombre legal de la empresa | ✓ |
| `entity_type` | Tipo de entidad (SA, SRL, LLC, etc.) | Opcional |
| `registration_number` | Número de registro comercial | Opcional |
| `tax_identifier_reference` | Número fiscal / RIF / EIN | Opcional |
| `incorporation_country` | País de incorporación | Opcional |
| `incorporation_region` | Región/estado de incorporación | Opcional |
| `registered_address` | Dirección registrada (JSONB) | ✓ (objeto vacío por defecto) |
| `operating_address` | Dirección operativa (JSONB) | Opcional |
| `business_category` | Categoría del negocio | Opcional |
| `business_description` | Descripción del negocio | Opcional |
| `website` | Sitio web | Opcional |
| `support_email` | Email de soporte | Opcional |
| `support_phone` | Teléfono de soporte | Opcional |
| `expected_monthly_volume` | Volumen mensual esperado | Opcional |
| `expected_transaction_count` | Cantidad de transacciones esperadas | Opcional |
| `operating_countries` | Países donde opera (array) | Opcional |
| `source_of_funds_category` | Categoría de origen de fondos | Opcional |
| `marketplace_category` | Categoría en el marketplace | Opcional |

### Creación del perfil empresarial
```typescript
createBusinessProfile(ownerProfileId, legalBusinessName, entityType)
```

**Efectos automáticos:**
1. Se crea el `businessProfile` con `verificationStatus: 'NOT_STARTED'`
2. Se actualiza el perfil del owner a `membershipTier: 'ENTREPRENEUR_VIP'`
3. Se registra un evento `CREATED` en `verification_events`

---

## Documentos empresariales configurables

Los documentos requeridos varían según el tipo de entidad y jurisdicción. Son configurables por el administrador.

### Documentos comunes

| Documento | Descripción | Requisito |
|-----------|-------------|-----------|
| Acta de constitución | Documento de constitución legal | Obligatorio para SA/SRL |
| Registro comercial | Certificado de registro | Obligatorio |
| Identificación fiscal | RIF, EIN, o equivalente | Obligatorio |
| Estatutos sociales | Documentos internos | Según jurisdicción |
| Poder del representante | Autorización para actuar | Para representantes autorizados |
| Estados financieros | Últimos estados auditados | Para altos volúmenes |
| Licencia de operación | Permiso municipal/estatal | Según actividad |

---

## Representantes

Cada negocio puede tener múltiples representantes, cada uno con su propio proceso KYC.

### Roles de representante

| Rol | Código | Descripción |
|-----|--------|-------------|
| Propietario | `owner` | Dueño legal del negocio |
| Director | `director` | Director o ejecutivo principal |
| Representante autorizado | `authorized_representative` | Persona autorizada a actuar |
| Beneficiario final | `beneficial_owner` | Persona con control significativo (>25%) |

### Campos por representante

| Campo | Descripción |
|-------|-------------|
| `full_name` | Nombre completo del representante |
| `control_role` | Rol de control en el negocio |
| `ownership_percentage` | Porcentaje de propiedad (0-100) |
| `kyc_status` | Estado de verificación KYC individual |
| `user_profile_id` | Referencia al perfil de ZAFIRO (si tiene cuenta) |
| `verification_reference` | Referencia del proceso de verificación |

### Registro de representante
```typescript
addBusinessMember(
  businessProfileId,
  'Juan García',
  'owner',
  100.00  // 100% de propiedad
)
```

### Para cada representante
- `ownership_percentage` — Porcentaje de propiedad (numérico)
- `control_role` — Rol de control (owner, director, authorized_representative, beneficial_owner)
- `kyc_status` — Estado de verificación KYC individual (misma escala que `verification_status`)

### Beneficiarios finales
Los beneficiarios finales (personas con >25% de propiedad o control significativo) se registran en una tabla separada `beneficial_owners` para cumplimiento AML/KYC.

---

## Estados de verificación KYB

### Flujo de estados

```
NOT_STARTED
    │
    ▼
IN_PROGRESS (documentos enviados)
    │
    ├──► MORE_INFORMATION_REQUIRED (faltan documentos)
    │        │
    │        ▼
    │    IN_PROGRESS (documentos adicionales enviados)
    │
    ▼
PENDING_REVIEW (esperando revisor)
    │
    ├──► APPROVED (verificación completa)
    ├──► REJECTED (documentos inválidos)
    └──► SUSPENDED (problemas detectados post-aprobación)
```

### Estados detallados

| Estado | Descripción |
|--------|-------------|
| `NOT_STARTED` | Sin proceso KYB iniciado |
| `IN_PROGRESS` | Documentos enviados, en proceso |
| `MORE_INFORMATION_REQUIRED` | Se necesita documentación adicional |
| `PENDING_REVIEW` | Esperando revisión humana |
| `APPROVED` | Negocio verificado |
| `REJECTED` | Verificación fallida |
| `SUSPENDED` | Verificación suspendida post-aprobación |
| `EXPIRED` | Verificación expirada (requiere renovación) |

### Cada decisión KYB requiere
- `reviewerProfileId` — Quién revisó
- `providerReference` — Referencia del proveedor (si aplica)
- `reasonCode` — Código de razón
- `internalNote` — Nota interna
- `auditEventId` — ID del evento de auditoría

### Cambios de estado
Cada cambio de estado en `business_profiles` se registra automáticamente en `verification_events` con el estado anterior y nuevo.

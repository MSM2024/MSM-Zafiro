# Flujo KYC — ZAFIRO

## Flujo completo de verificación de identidad

El proceso KYC (Know Your Customer) en ZAFIRO sigue un flujo de 6 pasos diseñado para cumplimiento regulatorio y seguridad.

---

## Paso 1: Consentimiento

**Antes de recopilar cualquier dato**, el usuario debe otorgar consentimiento explícito.

### Elementos requeridos
- **Política de privacidad** — Enlace a `/privacy` con versión actual
- **Proveedor KYC** — Identificación del proveedor que procesará los datos
- **Retención** — Período durante el cual se guardarán los datos
- **Finalidad** — Para qué se usarán los datos

### Registro de consentimiento
```typescript
recordConsent(profileId, 'kyc_processing', '1.0', true)
```

Cada consentimiento se almacena como `ConsentRecord` con:
- `consentType` — Tipo de consentimiento
- `consentVersion` — Versión de la política aceptada
- `granted` — `true` o `false`
- `ipAddress` — IP del usuario (opcional)
- `userAgent` — User agent del navegador (opcional)

El consentimiento es **versionado** — cada cambio de política requiere un nuevo consentimiento.

---

## Paso 2: Datos básicos

El usuario completa su información personal básica.

### Campos requeridos

| Campo | Descripción | Validación |
|-------|-------------|------------|
| `legal_first_name` | Nombre legal | Obligatorio, sin caracteres especiales |
| `legal_middle_name` | Segundo nombre | Opcional |
| `legal_last_name` | Apellidos | Obligatorio |
| `date_of_birth` | Fecha de nacimiento | Obligatorio, mayor de 18 años |
| `phone_e164` | Teléfono en formato E.164 | Obligatorio, validado |
| `email` | Email | Obligatorio, validado |
| `country_code` | País de residencia | Obligatorio |
| `province_region` | Provincia/estado | Obligatorio |
| `municipality_city` | Ciudad | Obligatorio |
| `address_line1` | Dirección línea 1 | Obligatorio |
| `address_line2` | Dirección línea 2 | Opcional |
| `postal_code` | Código postal | Opcional |

### Almacenamiento
Los datos se guardan en `profile_private_data`, **nunca** en `profiles_v2`. Esta separación garantiza que:
- Los datos sensibles no se exponen en consultas públicas
- Solo el propio usuario y administradores autorizados pueden acceder
- El perfil público nunca contiene información personal identificable

---

## Paso 3: Documento de identidad

El usuario sube un documento de identidad oficial.

### Documentos aceptados

| Tipo | Código | Descripción |
|------|--------|-------------|
| Pasaporte | `passport` | Pasaporte internacional vigente |
| Licencia de conducir | `drivers_license` | Licencia oficial del país de residencia |
| Documento nacional | `national_id` | Documento de identidad nacional |
| Permiso de residencia | `residence_permit` | Permiso de residencia para extranjeros |

### Requisitos del documento
- **Formato** — Imagen (JPG, PNG) o PDF
- **Tamaño máximo** — Configurable por el administrador
- **Legibilidad** — Todos los datos deben ser legibles
- **Vigencia** — Documento no vencido
- **Integridad** — Sin ediciones o manipulaciones

### Almacenamiento seguro
- Los documentos se almacenan en **almacenamiento privado** (nunca en `public/`)
- Se genera un `file_hash` para verificar integridad
- Se registra una `storage_reference` (ruta en el bucket privado)
- Las URLs de acceso son **firmadas y de corta duración**

---

## Paso 4: Verificación de titularidad

El usuario demuestra que es el titular del documento mediante selfie.

### Proceso
1. El sistema crea una sesión con el proveedor KYC
2. El usuario realiza una selfie o video selfie
3. El proveedor compara la selfie con la foto del documento
4. Se retorna un resultado de coincidencia

### Implementación
```typescript
const provider = new SandboxKycProvider()
const session = await provider.createSession({
  profileId: profile.id,
  kycCaseId: kycCase.id,
  documentTypes: ['passport']
})
```

### Niveles de garantía (assurance level)
| Nivel | Descripción |
|-------|-------------|
| `LOW` | Verificación básica, sin comparación biométrica |
| `MEDIUM` | Comparación de foto con documento |
| `HIGH` | Comparación biométrica avanzada + liveness detection |

---

## Paso 5: Evaluación de riesgo

El sistema evalúa el riesgo del usuario basado en múltiples factores.

### Niveles de riesgo

| Nivel | Descripción | Acción requerida |
|-------|-------------|-----------------|
| `LOW` | Sin señales de alerta | Aprobación automática posible |
| `MEDIUM` | Señales menores requieren revisión | Revisión manual recomendada |
| `HIGH` | Señales significativas de riesgo | Revisión manual obligatoria |
| `PROHIBITED` | Lista de sanciones o riesgo extremo | Rechazo inmediato |
| `MANUAL_REVIEW` | No se puede determinar automáticamente | Revisión humana obligatoria |

### Factores de evaluación
- Coincidencia selfie/documento
- Vigencia del documento
- Consistencia de datos
- Historial previo en la plataforma
- Resultados del proveedor KYC

---

## Paso 6: Decisión

Un revisor autorizado toma la decisión final sobre el caso KYC.

### Decisiones posibles

| Decisión | Estado | Descripción |
|----------|--------|-------------|
| Aprobar | `APPROVED` | Verificación completa y exitosa |
| Rechazar | `REJECTED` | Verificación fallida |
| Solicitar información | `MORE_INFORMATION_REQUIRED` | Se necesita documentación adicional |
| En revisión | `PENDING_REVIEW` | Esperando revisor humano |

### Requisitos de la decisión

Toda decisión debe incluir:

```typescript
{
  reviewerProfileId: string    // ID del revisor (obligatorio)
  providerReference?: string   // Referencia del proveedor
  reasonCode?: string          // Código de razón
  internalNote?: string        // Nota interna
  auditEventId: string         // ID del evento de auditoría
}
```

### Implementación
```typescript
// Aprobar
approveKyc(caseId, reviewerProfileId, 'DOCUMENTS_VALID', 'Todos los documentos verificados')

// Rechazar
rejectKyc(caseId, reviewerProfileId, 'DOCUMENT_EXPIRED', 'Pasaporte vencido')

// Solicitar información
requestKycInfo(caseId, reviewerProfileId, 'SELFIEUNCLEAR')
```

### Sincronización con perfil
Cuando cambia el estado de `kyc_cases`, automáticamente se actualiza `profiles_v2.verification_status` y se registra un `verification_events` con el cambio de estado anterior → nuevo.

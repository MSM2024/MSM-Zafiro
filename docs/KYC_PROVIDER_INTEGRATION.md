# Integración de Proveedor KYC — ZAFIRO

## Interfaz KycProvider

ZAFIRO define una interfaz abstracta para integrar cualquier proveedor de verificación de identidad. Esto permite cambiar de proveedor sin modificar la lógica de negocio.

```typescript
export interface KycProvider {
  createSession(input: {
    profileId: string
    kycCaseId: string
    documentTypes: string[]
  }): Promise<KycProviderSession>

  getSession(reference: string): Promise<KycProviderResult>

  cancelSession(reference: string): Promise<void>

  verifyWebhook(payload: unknown, signature: string): Promise<boolean>
}
```

### Método createSession

Crea una nueva sesión de verificación con el proveedor.

**Parámetros:**
- `profileId` — ID del perfil del usuario
- `kycCaseId` — ID del caso KYC asociado
- `documentTypes` — Tipos de documento requeridos (`['passport']`, `['drivers_license']`, etc.)

**Retorna:** `KycProviderSession`
```typescript
{
  sessionId: string        // ID de la sesión en el proveedor
  url?: string             // URL para que el usuario complete la verificación
  expiresAt?: string       // Cuándo expira la sesión
  providerReference: string // Referencia para futuras llamadas
}
```

### getSession

Obtiene el estado actual de una sesión de verificación.

**Parámetros:**
- `reference` — `providerReference` de la sesión

**Retorna:** `KycProviderResult`
```typescript
{
  providerReference: string
  status: string              // 'PENDING', 'COMPLETED', 'FAILED', 'EXPIRED'
  assuranceLevel?: string     // 'LOW', 'MEDIUM', 'HIGH'
  riskLevel?: RiskLevel       // Nivel de riesgo evaluado
  reasonCodes?: string[]      // Códigos de razón del resultado
  rawResult?: Record<string, unknown>  // Resultado completo del proveedor
}
```

### cancelSession

Cancela una sesión activa en el proveedor.

**Parámetros:**
- `reference` — `providerReference` de la sesión

### verifyWebhook

Verifica la autenticidad de un webhook recibido del proveedor.

**Parámetros:**
- `payload` — Cuerpo del webhook
- `signature` — Firma HMAC del webhook

**Retorna:** `boolean` — `true` si la firma es válida

---

## Implementación SandboxKycProvider

ZAFIRO incluye un proveedor sandbox para desarrollo y pruebas:

```typescript
export class SandboxKycProvider implements KycProvider {
  async createSession(input): Promise<KycProviderSession> {
    const ref = `sbx_${genId()}`
    return {
      sessionId: genId(),
      url: `/kyc/mock?ref=${ref}`,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      providerReference: ref,
    }
  }

  async getSession(reference: string): Promise<KycProviderResult> {
    return {
      providerReference: reference,
      status: 'COMPLETED',
      assuranceLevel: 'MEDIUM',
      riskLevel: 'LOW',
      reasonCodes: [],
    }
  }

  async cancelSession(_reference: string): Promise<void> {}

  async verifyWebhook(_payload: unknown, _signature: string): Promise<boolean> {
    return true
  }
}
```

### Comportamiento del sandbox

| Método | Comportamiento |
|--------|---------------|
| `createSession` | Retorna una URL mock (`/kyc/mock?ref=...`) |
| `getSession` | Siempre retorna `COMPLETED` con riesgo `LOW` |
| `cancelSession` | No hace nada (silencioso) |
| `verifyWebhook` | Siempre retorna `true` |

**Uso:** Solo para desarrollo. En producción, reemplazar con un proveedor real.

---

## Webhook firmado para actualizar estados

Los proveedores KYC envían notificaciones via webhook cuando cambia el estado de una verificación.

### Flujo del webhook

```
Proveedor KYC envía webhook
    │
    ▼
ZAFIRO recibe POST en /api/kyc/webhook
    │
    ▼
verifyWebhook(payload, signature)
    │
    ├── Firma inválida → Rechazar (401)
    │
    ├── Firma válida → Procesar
    │       │
    │       ▼
    │   Extraer provider_reference
    │       │
    │       ▼
    │   Buscar kyc_case por provider_reference
    │       │
    │       ▼
    │   Actualizar estado del caso
    │       │
    │       ▼
    │   Registrar verification_event
    │       │
    │       ▼
    │   Actualizar verification_status en profiles_v2
    │
    └── Retornar 200 OK
```

### Formato del webhook (ejemplo)

```json
{
  "provider_reference": "sbx_abc123",
  "status": "COMPLETED",
  "assurance_level": "HIGH",
  "risk_level": "LOW",
  "reason_codes": [],
  "completed_at": "2026-01-15T10:30:00Z"
}
```

### Seguridad del webhook
- **Firma HMAC** — Verificada antes de procesar
- **Idempotencia** — Webhooks duplicados no causan efecto
- **Timeout** — Responder en menos de 5 segundos
- **Reintentos** — El proveedor reintenta hasta recibir 200

---

## El frontend nunca aprueba KYC directamente

**Regla crítica:** La UI del frontend nunca ejecuta `approveKyc()` o `rejectKyc()` directamente.

### Flujo correcto

```
Frontend muestra caso KYC
    │
    ▼
Revisor toma decisión
    │
    ▼
Frontend envía solicitud a API interna
    │
    ▼
API verifica:
    1. ¿El usuario tiene permiso (kyc.approve / kyc.reject)?
    2. ¿El usuario tiene MFA verificado?
    3. ¿El caso está en estado válido para esta acción?
    │
    ├── Validación falla → Retornar error
    │
    ├── Validación pasa → Ejecutar approveKyc() / rejectKyc()
    │       │
    │       ▼
    │   Registrar kyc_review
    │       │
    │       ▼
    │   Registrar verification_event
    │       │
    │       ▼
    │   Actualizar profiles_v2.verification_status
    │       │
    │       ▼
    │   Retornar resultado
    │
    └── Frontend actualiza UI
```

**Razón:** Las decisiones de cumplimiento requieren verificación server-side de permisos, MFA y auditoría.

---

## La app debe admitir cambiar de proveedor sin reconstruir todo

El diseño del sistema permite intercambiar proveedores KYC mediante:

### 1. Interfaz común
Todos los proveedores implementan `KycProvider`. El código de negocio solo usa esta interfaz.

### 2. Configuración por variable de entorno
```env
KYC_PROVIDER=sandbox          # O 'sumsub', 'jumio', 'onfido', etc.
KYC_PROVIDER_API_KEY=...
KYC_PROVIDER_WEBHOOK_SECRET=...
```

### 3. Factory pattern (futuro)
```typescript
function createKycProvider(): KycProvider {
  switch (process.env.KYC_PROVIDER) {
    case 'sandbox': return new SandboxKycProvider()
    case 'sumsub': return new SumsubKycProvider()
    case 'jumio': return new JumioKycProvider()
    default: return new SandboxKycProvider()
  }
}
```

### 4. Migración de datos
Al cambiar de proveedor:
- Los `kyc_cases` existentes conservan su estado
- Los `kyc_documents` con `storage_reference` siguen accesibles
- Las `kyc_provider_sessions` antiguas se mantienen como histórico
- Solo las nuevas sesiones usan el nuevo proveedor

---

## Variables de entorno necesarias

### Proveedor KYC

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `KYC_PROVIDER` | Nombre del proveedor activo | `sandbox`, `sumsub`, `jumio` |
| `KYC_PROVIDER_API_KEY` | API key del proveedor | `sk_live_...` |
| `KYC_PROVIDER_API_SECRET` | Secret del proveedor | `...` |
| `KYC_PROVIDER_WEBHOOK_SECRET` | Secreto para verificar webhooks | `...` |
| `KYC_PROVIDER_BASE_URL` | URL base de la API del proveedor | `https://api.sumsub.com` |

### Almacenamiento de documentos

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `SUPABASE_STORAGE_BUCKET_KYC` | Bucket privado para documentos KYC | `kyc-documents` |
| `KYC_DOC_MAX_SIZE_MB` | Tamaño máximo por archivo | `10` |
| `KYC_DOC_SIGNED_URL_TTL` | Duración de URLs firmadas (segundos) | `900` |

### Configuración general

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `KYC_RETENTION_YEARS` | Años de retención de documentos | `7` |
| `KYC_AUTO_APPROVE_RISK` | Nivel de riesgo para aprobación automática | `LOW` |
| `KYC_MANUAL_REVIEW_RISK` | Nivel que fuerza revisión manual | `MEDIUM` |

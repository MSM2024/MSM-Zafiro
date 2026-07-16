# Checklist de Revisión Legal — KYC ZAFIRO

## NIST 800-63A Compliance Checklist

Estándar del NIST para verificación de identidad digital (Digital Identity Guidelines).

### IAL (Identity Assurance Level)

| # | Requisito | Estado ZAFIRO | Notas |
|---|-----------|:------------:|-------|
| 1 | Resolución de identidad (IAL2+) | ✓ | Datos legales + documento + selfie |
| 2 | Verificación de documento de identidad | ✓ | Via proveedor KYC |
| 3 | Verificación de selfie / biometría | ✓ | Comparación facial con documento |
| 4 | Prueba de vida (liveness detection) | Parcial | Depende del proveedor |
| 5 | Validación de documento en tiempo real | ✓ | Via proveedor KYC |

### AAL (Authenticator Assurance Level)

| # | Requisito | Estado ZAFIRO | Notas |
|---|-----------|:------------:|-------|
| 6 | Autenticación multifactor para admin | ✓ | MFA obligatorio para acciones críticas |
| 7 | Gestión de sesiones segura | ✓ | Supabase Auth con JWT |
| 8 | Reautenticación para datos sensibles | ✓ | Ventana de 15 minutos |

### FAL (Federation Assurance Level)

| # | Requisito | Estado ZAFIRO | Notas |
|---|-----------|:------------:|-------|
| 9 | Tokens de acceso firmados | ✓ | JWT via Supabase |
| 10 | Validación de assertion | ✓ | Server-side verification |

---

## FinCEN CDD Requirements

Customer Due Diligence (CDD) bajo la normativa FinCEN (EE.UU.).

| # | Requisito | Estado ZAFIRO | Implementación |
|---|-----------|:------------:|----------------|
| 1 | Identificar al cliente | ✓ | KYC: nombre legal, DOB, nacionalidad |
| 2 | Verificar la identidad | ✓ | Documento + selfie + proveedor |
| 3 | Comprender la naturaleza del negocio | ✓ | KYB: entityType, businessDescription |
| 4 | Evaluar riesgo de lavado de dinero | ✓ | RiskLevel: LOW/MEDIUM/HIGH/PROHIBITED |
| 5 | Monitoreo continuo | Parcial | `next_review_at` en kyc_cases |
| 6 | Mantener registros 5+ años | ✓ | Política de retención configurable |
| 7 | Informar transacciones sospechosas | Pendiente | Requiere integración con sistema SAR |

### Beneficiarios finales (Beneficial Ownership)

| # | Requisito | Estado ZAFIRO | Implementación |
|---|-----------|:------------:|----------------|
| 8 | Identificar beneficiarios con >25% propiedad | ✓ | Tabla `beneficial_owners` |
| 9 | Verificar identidad de beneficiarios | ✓ | Campo `kyc_status` por beneficiario |
| 10 | Actualizar información cuando cambie | ✓ | Registro con `updated_at` |

---

## OFAC/Sanctions Screening Considerations

Verificación contra listas de sanciones (OFAC, EU, UN).

| # | Consideración | Estado ZAFIRO | Acción requerida |
|---|---------------|:------------:|------------------|
| 1 | Screening contra lista SDN (OFAC) | Pendiente | Integrar con proveedor o API externa |
| 2 | Screening contra listas EU/UK | Pendiente | Mismo mecanismo que OFAC |
| 3 | Screening contra listas ONU | Pendiente | Mismo mecanismo |
| 4 | Actualización de listas | Pendiente | Sincronización periódica |
| 5 | Bloqueo automático de match exacto | Pendiente | `riskLevel: 'PROHIBITED'` |
| 6 | Revisión manual de match fuzzy | Pendiente | `riskLevel: 'MANUAL_REVIEW'` |
| 7 | Registro de cada screening | ✓ | `verification_events` append-only |
| 8 | Retención de resultados de screening | ✓ | Políticade retención configurable |

**Nota:** El nivel de riesgo `PROHIBITED` está diseñado para bloquear usuarios que matcheen en listas de sanciones. La integración con APIs de screening es pendiente de implementación.

---

## Data Privacy (GDPR-style Principles Applied to ZAFIRO)

Principios de privacidad de datos aplicados al sistema.

| # | Principio GDPR | Implementación ZAFIRO |
|---|----------------|----------------------|
| 1 | Licitud, lealtad y transparencia | ✓ Consentimiento explícito antes de KYC |
| 2 | Limitación de finalidad | ✓ Datos KYC solo para verificación |
| 3 | Minimización de datos | ✓ Solo campos necesarios en cada tabla |
| 4 | Exactitud | ✓ `updated_at` + revisión periódica |
| 5 | Limitación de almacenamiento | ✓ Política de retención configurable |
| 6 | Integridad y confidencialidad | ✓ Cifrado en tránsito y reposo |
| 7 | Responsabilidad demostrable | ✓ Logs append-only, auditoría completa |
| 8 | Derechos del interesado | ✓ Exportación y eliminación controladas |

### Datos personales que ZAFIRO almacena

| Categoría | Campos | Tabla |
|-----------|--------|-------|
| Identificación | Nombre legal, DOB, nacionalidad | `profile_private_data` |
| Contacto | Email, teléfono, dirección | `profile_private_data` |
| Documentos | Pasaporte, licencia, selfie | `kyc_documents` (storage) |
| Biométricos | Comparación facial (procesado por proveedor) | No almacenado en ZAFIRO |
| Empresarial | Nombre legal, registro, dirección fiscal | `business_profiles` |
| Financiero | Volumen esperado, origen de fondos | `business_profiles` |

---

## Consent and Right to Deletion

### Consentimiento

| # | Requisito | Implementación |
|---|-----------|----------------|
| 1 | Consentimiento antes de recolectar datos | ✓ `recordConsent()` antes de KYC |
| 2 | Consentimiento granular (por tipo) | ✓ `consentType` por categoría |
| 3 | Consentimiento versionado | ✓ `consentVersion` por cada versión de política |
| 4 | Retiro de consentimiento | ✓ `granted: false` en nuevo registro |
| 5 | Prueba de consentimiento | ✓ Registro con timestamp, IP, user agent |
| 6 | Menores de edad | ✓ Validación `date_of_birth > 18 años` |

### Derecho a eliminación

| # | Requisito | Implementación |
|---|-----------|----------------|
| 7 | Solicitud de eliminación por usuario | ✓ Endpoint de solicitud |
| 8 | Eliminación de datos personales | ✓ Eliminación de `profile_private_data` |
| 9 | Eliminación de documentos | ✓ Eliminación del almacenamiento privado |
| 10 | Conservación de registros anonimizados | ✓ Logs de auditoría se anonimizan |
| 11 | Confirmación al usuario | ✓ Notificación de eliminación completada |
| 12 | Plazo de响应 | ✓ Máximo 30 días (recomendado < 72 horas) |

---

## Data Retention Periods

| Tipo de dato | Período mínimo | Períario recomendado | Base legal |
|-------------|---------------|---------------------|------------|
| Documentos KYC | 5 años | 7 años | FinCEN CDD Rule |
| Datos de identidad | 5 años post-relación | 7 años | BSA/AML |
| Registros de transacciones | 5 años | 7 años | FinCEN |
| Consentimientos | Duración de la relación |终生 | GDPR Art. 7 |
| Logs de auditoría | 5 años | 10 años | Cumplimiento general |
| Datos de marketing | Hasta retiro de consentimiento | N/A | GDPR Art. 6 |
| Cookies / tracking | 12 meses | 6 meses | ePrivacy |

### Implementación en ZAFIRO

- `kyc_cases.expires_at` — Programa la expiración del caso
- `kyc_cases.next_review_at` — Programa la próxima revisión
- `profile_badges.expires_at` — Expiración de insignias (si aplica)
- `consent_records.created_at` — Fecha del consentimiento para calcular retención

---

## Breach Notification Procedures

### Procedimiento de notificación de brecha

| Paso | Acción | Plazo |
|------|--------|-------|
| 1 | Detectar y contener la brecha | Inmediato |
| 2 | Evaluar alcance y tipos de datos afectados | < 24 horas |
| 3 | Notificar a autoridades competentes | < 72 horas (GDPR) |
| 4 | Notificar a usuarios afectados | < 72 horas (si riesgo alto) |
| 5 | Documentar el incidente | Inmediato |
| 6 | Implementar medidas correctivas | < 30 días |
| 7 | Revisar y actualizar procedimientos | < 60 días |

### Datos que requieren notificación si se comprometen

- Nombres y documentos de identidad
- Direcciones y teléfonos
- Emails y contraseñas (si estuvieran almacenadas — no aplica con Supabase Auth)
- Datos biométricos (si estuvieran almacenados — no aplica)
- Información financiera

### Responsables
- **Owner (Don Miguel):** Decisión final de notificación
- **Compliance:** Evaluación del alcance
- **Legal:** Redacción de notificaciones

---

## Vendor/SaaS Provider Due Diligence

### Checklist para evaluar proveedores KYC

| # | Criterio | Preguntas clave |
|---|----------|-----------------|
| 1 | Certificaciones | ¿SOC 2 Type II? ¿ISO 27001? |
| 2 | Cumplimiento GDPR | ¿Base en UE o mecanismos de transferencia? |
| 3 | Almacenamiento de datos | ¿Dónde se almacenan los datos? ¿Jurisdicción? |
| 4 | Retención de datos | ¿Cuánto tiempo conservan los datos? |
| 5 | Seguridad | ¿Cifrado en tránsito y reposo? ¿Pentests? |
| 6 | Disponibilidad | ¿SLA de uptime? ¿Soporte 24/7? |
| 7 | API y documentación | ¿API estable? ¿Documentación clara? |
| 8 | Webhooks | ¿Firma HMAC? ¿Reintentos? |
| 9 | Costos | ¿Por verificación? ¿Mensual? ¿Setup? |
| 10 | Jurisdicciones soportadas | ¿Países donde opera ZAFIRO? |

### Proveedor actual
- **Proveedor:** Sandbox (mock)
- **Uso:** Desarrollo y pruebas
- **Producción:** Pendiente de seleccionar proveedor real

---

## Jurisdiction-Specific Considerations

### Estados Unidos (EE.UU.)

| Requisito | Implementación |
|-----------|----------------|
| BSA/AML compliance | CDD Rule, SAR filing (pendiente) |
| OFAC sanctions screening | Pendiente de integración |
| FinCEN CDD Rule | Beneficial ownership (implementado) |
| State-level requirements | Varía por estado — revisar por jurisdicción |
| CCPA (California) | Derechos de privacidad (implementado) |

### Cuba

| Requisito | Implementación |
|-----------|----------------|
| Regulaciones BCN | Operaciones con criptomonedas — revisar |
| Restricciones OFAC | Cuba está en lista SDN — screening obligatorio |
| Remesas | Licencia especial requerida — no implementado |
| Identificación | Cédula de identidad — documento aceptado |

### Internacional

| Requisito | Implementación |
|-----------|----------------|
| GDPR (UE) | Principios de privacidad (implementado) |
| LGPD (Brasil) | Similar a GDPR — revisar requisitos específicos |
| PIPL (China) | Revisar si aplica para usuarios chinos |
| PIPA (Corea) | Revisar si aplica para usuarios coreanos |
| AMLD6 (UE) | Due diligence mejorado — implementado parcialmente |

### Notas importantes

1. **Cuba + OFAC:** Cualquier servicio que opere con usuarios cubanos DEBE verificar compliance con OFAC. La lista SDN incluye entidades cubanas que no pueden recibir servicios.

2. **Multi-jurisdicción:** ZAFIRO opera internacionalmente. Cada jurisdicción tiene requisitos específicos. Se recomienda asesoría legal local para mercados específicos.

3. **Criptomonedas:** Si ZAFIRO maneja criptomonedas, aplica regulación adicional (MiCA en EU, MSB registration en EE.UU.).

4. **Actualizaciones legales:** Este checklist debe revisarse trimestralmente para mantenerse al día con cambios regulatorios.

---

## Revision History

| Fecha | Versión | Cambios |
|-------|---------|---------|
| 2026-01-15 | 1.0 | Checklist inicial |

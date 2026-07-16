# Seguridad KYC — ZAFIRO

## Documentos en almacenamiento privado

Los documentos de verificación (pasaportes, licencias, selfies) **nunca** se almacenan en el directorio `public/`. Se utilizan buckets privados de Supabase Storage o almacenamiento equivalente.

**Regla:** Si un archivo puede contener datos personales identificables (PII), debe estar en almacenamiento privado con acceso controlado.

---

## URLs firmadas y de corta duración

Las URLs para acceder a documentos son temporales y firmadas criptográficamente:

- **Duración máxima:** 15 minutos por defecto
- **Firma:** Token JWT con expiración
- **Uso único:** Cada URL solo puede usarse una vez para visualización
- **Sin caché:** Headers `Cache-Control: no-store`

Los revisores solicitan una URL firmada cada vez que necesitan ver un documento. Cada solicitud se registra en el log de auditoría.

---

## Cifrado en tránsito y reposo

### En tránsito
- Todas las comunicaciones usan TLS 1.2+ (HTTPS)
- Las conexiones al proveedor KYC se cifran
- Los webhooks se verifican con HMAC

### En reposo
- Los datos en Supabase se cifran en reposo (AES-256 por defecto de Supabase)
- El campo `encrypted_identifier_reference` en `profile_private_data` almacena identificadores cifrados
- En localStorage (MVP), los datos están en texto plano — esto es aceptable solo para desarrollo, **no** para producción

---

## Política de retención configurable

Los períodos de retención son configurables por el administrador:

| Tipo de dato | Período mínimo | Período recomendado | Acción al expirar |
|-------------|---------------|--------------------|--------------------|
| Documentos KYC | 5 años | 7 años | Eliminación segura |
| Datos personales | 3 años | 5 años | Anonimización |
| Logs de auditoría | 5 años | 10 años | Archivado |
| Consentimientos | 3 años |终生 | Conservación permanente |
| Sesiones de proveedor | 1 año | 2 años | Eliminación |

**Implementación:** Cada `kyc_case` tiene campos `expires_at` y `next_review_at` para programar revisiones y eliminaciones automáticas.

---

## Registro de cada visualización

Cada vez que un revisor accede a un documento sensible, se registra:

- **Quién** — `actor_profile_id`
- **Qué** — `entity_type` + `entity_id`
- **Cuándo** — `created_at`
- **Por qué** — `reason_code` (contexto de revisión)
- **Operación** — `operation_id` único

Los registros de visualización se almacenan en `verification_events` y son inmutables (append-only).

---

## Ocultar números de documentos en logs/analytics

Los números de documentos de identidad (pasaporte, licencia, RIF, EIN) **nunca** se muestran en:

- Logs del servidor
- Dashboard de analytics
- Notificaciones
- Exportaciones de datos
- Mensajes de error

**Regla:** Solo se muestra un hash truncado o los últimos 4 dígitos cuando es estrictamente necesario para referencia.

---

## Reautenticación para datos sensibles

Antes de acceder o modificar datos sensibles, el sistema requiere reautenticación:

| Operación | Reautenticación requerida |
|-----------|--------------------------|
| Ver datos personales | Sesión activa (< 15 min) |
| Modificar dirección | Reautenticación |
| Cambiar email | Reautenticación + verificación |
| Subir documento KYC | Sesión activa |
| Acceder a documentos de otros | MFA obligatorio |

---

## MFA para administradores

Todas las acciones administrativas críticas requieren MFA (Multi-Factor Authentication):

- `recordAdminAction()` retorna `null` si `mfaVerified: false`
- Las acciones sin MFA no se registran en el log de auditoría
- El sistema bloquea la ejecución antes de intentar la operación

**Acciones que requieren MFA:**
- Suspender usuarios
- Cambiar roles
- Aprobar/rechazar KYC/KYB
- Configurar el sistema
- Gestionar economía

---

## Rate limiting en API KYC

Las endpoints de KYC implementan rate limiting para prevenir abuso:

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| Crear sesión KYC | 3 por hora | Rolling |
| Subir documento | 5 por hora | Rolling |
| Solicitar revisión | 2 por hora | Rolling |
| Webhook del proveedor | 100 por minuto | Fixed window |

**Respuesta cuando se excede el límite:** HTTP 429 Too Many Requests con `Retry-After` header.

---

## Antivirus y validación de archivos

Todos los archivos subidos pasan por validación antes de ser aceptados:

### Validación de tipo MIME
- Solo se aceptan: `image/jpeg`, `image/png`, `application/pdf`
- Se verifica el magic bytes del archivo, no solo la extensión

### Tamaño máximo
- Configurable por administrador
- Default: 10 MB por archivo
- Default: 50 MB total por caso KYC

### Antivirus
- Los archivos se escanean antes de ser procesados
- Archivos infectados se rechazan inmediatamente
- Se registra el resultado del escaneo en auditoría

### Integridad
- Se genera un `file_hash` (SHA-256) al subir
- Se verifica la integridad antes de cada visualización
- Cualquier discrepancia genera una alerta de seguridad

---

## Consentimiento versionado

Cada cambio en la política de privacidad o términos de servicio requiere un nuevo consentimiento del usuario:

1. Se publica la nueva versión de la política
2. Se notifica a los usuarios afectados
3. Se solicita aceptación explícita
4. Se registra el consentimiento con versión y timestamp
5. Los usuarios sin consentimiento actualizado tienen acceso restringido

**Formato del registro:**
```typescript
{
  consentType: 'privacy_policy',
  consentVersion: '1.2',
  granted: true,
  ipAddress: '...',
  userAgent: '...'
}
```

---

## Exportación y eliminación controladas

### Exportación (derecho de portabilidad)
- El usuario puede solicitar exportación de sus datos
- Se genera un archivo JSON/CSV con todos los datos del perfil
- Los documentos se exportan como URLs firmadas temporales
- La exportación se registra en auditoría

### Eliminación (derecho al olvido)
- El usuario puede solicitar eliminación de datos
- Se elimina la identificación personal, pero se conservan registros anonimizados para auditoría
- Los documentos se eliminan del almacenamiento privado
- Los logs de auditoría se anonimizan (el `actor_profile_id` se reemplaza por un hash)
- La eliminación es irreversible

---

## Nunca guardar

Estos datos **nunca** deben almacenarse en la aplicación:

| Dato | Razón |
|------|-------|
| Contraseñas | Supabase Auth maneja autenticación |
| Números completos de documentos | Riesgo de fraude si se exponen |
| Biometría procesada manualmente | El procesamiento lo hace el proveedor |
| Claves privadas | Nunca en el lado del cliente |
| Tokens del proveedor KYC | Solo se usan en sesión, se invalidan al cerrar |
| Documentos en Git | Historial inmutable expone datos sensibles |
| PII en logs del servidor | Cumplimiento GDPR/privacidad |
| Datos de tarjetas de crédito | Nunca tocar — usar pasarela de pago |

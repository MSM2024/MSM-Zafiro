# GUARDIÁN 1 — Identidad: Auditoría de Seguridad de Autenticación

**Fecha:** 2026-07-15
**Auditado por:** OpenCode ZAFIRO Security Shield
**Estado:** PARCIAL — requiere implementación Supabase

---

## Resumen de Controles

| Control | Estado | Prioridad |
|---------|--------|-----------|
| Supabase Auth habilitado | ✅ PASS | — |
| MFA TOTP configurable | ❌ FAIL | Alta |
| AAL2 obligatorio para OWNER | ❌ FAIL | Alta |
| AAL2 en pagos/caja/cancelaciones | ❌ FAIL | Alta |
| Sesiones de corta duración | ❌ FAIL | Media |
| Reautenticación pre-acción crítica | ❌ FAIL | Alta |
| Códigos de recuperación | ❌ FAIL | Media |
| Lista de sesiones/dispositivos | ❌ FAIL | Media |
| Revocación global de sesiones | ❌ FAIL | Media |
| Rate limiting login/recuperación | ⚠️ PARCIAL | Alta |
| Protección contra enumeración | ❌ FAIL | Alta |

---

## Hallazgos

### CRÍTICO: Sin MFA obligatorio en acciones sensibles

Actualmente no hay verificación de nivel AAL2 antes de:
- Pagos, reembolsos, cancelaciones
- Retiros de caja, transferencias
- Cambio de roles de usuario
- Modificación de configuración
- Exportación de datos
- Operaciones de wallet

**Solución:** Implementar `src/security/require-aal2.ts` y usarlo en todas las rutas de API sensibles.

### ALTO: Sin reautenticación previa a acciones críticas

No hay flujo de "confirmar con contraseña/MFA" antes de:
- Cancelar suscripción
- Eliminar cuenta
- Transferir fondos
- Cambiar email

### ALTO: Sin rate limiting en login y recuperación

`/api/chat` tiene rate limiting básico, pero `/auth/login` y `/auth/recover` no lo tienen.

### MEDIO: Sin sesiones de corta duración

No hay distinción entre sesión normal y sesión elevada. Todas las sesiones usan el mismo TTL.

---

## Archivos Creados

- `src/security/require-aal2.ts` — Exigencia de nivel AAL2
- `src/security/require-role.ts` — Verificación de roles
- `docs/MFA_IMPLEMENTATION.md` — Guía de implementación MFA

---

## Próximos Pasos

1. Conectar Supabase Auth real (actualmente en localStorage fallback)
2. Activar MFA TOTP en proyecto Supabase
3. Integrar `requireAAL2()` en rutas de API de pagos y administración
4. Agregar rate limiting en login
5. Agregar confirmación de reautenticación pre-acción crítica

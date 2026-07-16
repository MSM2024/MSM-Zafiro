# GUARDIÁN 6 — PC de Desarrollo: Checklist de Seguridad para Windows

**Fecha:** 2026-07-15
**Sistema:** Windows (PC de Don Miguel)
**Estado:** ⚠️ REQUIRES_OWNER_ACTION — Solo guía, sin cambios automáticos

---

## Instrucciones

Esta lista es una guía. **No se realizarán cambios automáticos.**
Cada ítem debe ser verificado y aprobado por Don Miguel antes de implementar.

---

## Checklist

### 1. Windows Update

- [ ] Windows está actualizado a la última versión
- [ ] Las actualizaciones de seguridad están al día
- [ ] Las actualizaciones son automáticas

**Cómo verificar:** `Settings → Windows Update → Check for updates`

### 2. Microsoft Defender

- [ ] Microsoft Defender Antivirus está activo
- [ ] La protección en tiempo real está habilitada
- [ ] La protección contra ransomware está activa
- [ ] El escaneo periódico está configurado

**Cómo verificar:** `Windows Security → Virus & threat protection`

### 3. Firewall

- [ ] Microsoft Defender Firewall está activo
- [ ] El firewall está activo en redes públicas y privadas
- [ ] No hay reglas de entrada innecesarias

**Cómo verificar:** `Windows Security → Firewall & network protection`

### 4. SmartScreen

- [ ] Microsoft Defender SmartScreen está activo
- [ ] Protección contra apps y archivos sospechosos
- [ ] Protección contra sitios web maliciosos

**Cómo verificar:** `Windows Security → App & browser control`

### 5. BitLocker / Cifrado

- [ ] BitLocker o Device Encryption está activo
- [ ] La unidad del sistema está cifrada
- [ ] La clave de recuperación está respaldada (no en el PC)

**Cómo verificar:** `Settings → Privacy & security → Device encryption`

### 6. Secure Boot

- [ ] Secure Boot está activo en UEFI/BIOS

**Cómo verificar:** `msinfo32 → System Summary → Secure Boot State`

### 7. Windows Hello

- [ ] Windows Hello (PIN, huella o facial) está configurado
- [ ] Solo el usuario autorizado puede iniciar sesión

**Cómo verificar:** `Settings → Accounts → Sign-in options`

### 8. Bloqueo Automático

- [ ] La pantalla se bloquea después de ≤5 minutos de inactividad
- [ ] La sesión se bloquea al cerrar la tapa (laptop)
- [ ] El protector de pantalla con bloqueo está activo

**Cómo configurar:** `Settings → Personalization → Lock screen → Screen timeout settings`

### 9. Cuenta de Usuario

- [ ] La cuenta diaria NO tiene privilegios administrativos
- [ ] Existe una cuenta separada para tareas administrativas
- [ ] La cuenta administrativa solo se usa para instalaciones

**Cómo verificar:** `Settings → Accounts → Your info` (debe decir "Administrator" SOLO si es necesario)

### 10. Escritorio Remoto

- [ ] Escritorio remoto está DESACTIVADO cuando no se usa
- [ ] Si está activo, usa autenticación a nivel de red (NLA)
- [ ] Puerto 3389 no está expuesto en el router

**Cómo verificar:** `Settings → System → Remote Desktop`

### 11. Compartición de Archivos

- [ ] La compartición de archivos por red está DESACTIVADA
- [ ] No hay carpetas compartidas innecesarias
- [ ] El descubrimiento de red está desactivado en redes públicas

**Cómo verificar:** `Control Panel → Network and Sharing Center → Advanced sharing settings`

### 12. Backups

- [ ] Los backups están cifrados
- [ ] Los backups se almacenan en ubicación separada (externo/nube)
- [ ] Los backups incluyen archivos de proyecto y .env

### 13. OpenCode

- [ ] OpenCode se ejecuta con permisos mínimos
- [ ] No se ejecuta como administrador
- [ ] Las reglas de `opencode.json` están activas

### 14. Llaves Secretas

- [ ] No hay archivos `.env` en el Escritorio
- [ ] No hay archivos `.env` en la carpeta Descargas
- [ ] No hay llaves privadas (`.pem`, `.key`) en carpetas de usuario
- [ ] Las semillas de wallet no están en texto plano

---

## Resumen

| Categoría | Items | Estado |
|-----------|-------|--------|
| Seguridad del Sistema | 1-4 | ⬜ Pendiente |
| Cifrado y Arranque | 5-6 | ⬜ Pendiente |
| Autenticación | 7-9 | ⬜ Pendiente |
| Red y Acceso | 10-11 | ⬜ Pendiente |
| Datos y Backups | 12-14 | ⬜ Pendiente |

**Total: 30 items — requiere verificación manual por Don Miguel**

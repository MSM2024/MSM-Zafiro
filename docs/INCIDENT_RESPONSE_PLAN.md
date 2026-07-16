# GUARDIÁN 7 — Vigilancia y Recuperación: Plan de Respuesta a Incidentes

**Fecha:** 2026-07-15
**Estado:** ✅ Plan creado — requiere configuración de monitoreo

---

## Clasificación de Incidentes

| Nivel | Nombre | Tiempo de Respuesta | Ejemplos |
|-------|--------|---------------------|----------|
| **S1** | Crítico | < 1 hora | Brecha de datos, acceso no autorizado, service_role expuesta |
| **S2** | Alto | < 4 horas | Intento de acceso sospechoso, DDoS, ML de fraude |
| **S3** | Medio | < 24 horas | Error repetido, tráfico anormal, backup fallido |
| **S4** | Bajo | < 72 horas | Warning de seguridad, rate limit alcanzado |

---

## Playbooks de Respuesta

### S1: Brecha de Datos / Secreto Expuesto

1. **Detectar**: Alerta de secret scanning o reporte de terceros
2. **Contener**:
   - Revocar secreto inmediatamente (dashboard del proveedor)
   - Rotar todas las claves relacionadas
   - Bloquear IP/sesión involucrada
3. **Investigar**:
   - Revisar audit_log para acceso no autorizado
   - Verificar git history para commits con secretos
   - Revisar logs de Vercel y Supabase
4. **Recuperar**:
   - Desplegar nuevas claves
   - Ejecutar script de verificación de integridad
   - Notificar a usuarios afectados si aplica
5. **Post-mortem**:
   - Documentar causa raíz
   - Actualizar secret scanning
   - Revisar procedimiento de rotación

### S2: Intento de Acceso Sospechoso

1. **Detectar**: Múltiples intentos de login fallidos desde misma IP
2. **Contener**:
   - Rate limiting inmediato
   - Bloquear IP temporalmente
   - Forzar reautenticación para cuentas objetivo
3. **Investigar**:
   - Revisar session_log
   - Identificar patrón de ataque
   - Verificar si hubo éxito
4. **Recuperar**:
   - Revocar sesiones sospechosas
   - Notificar a usuario si su cuenta fue objetivo

### S3: Error Repetido en Sistema

1. **Detectar**: Más de 10 errores en 5 minutos en misma ruta
2. **Investigar**:
   - Revisar logs de Vercel Functions
   - Verificar si es error de código o infraestructura
3. **Recuperar**:
   - Rollback a último deploy estable
   - Corregir error en rama de desarrollo
   - Desplegar fix

### S4: Alerta de Seguridad

1. **Investigar**: Verificar si es falso positivo
2. **Documentar**: Registrar en security_events
3. **Resolver**: Ajustar umbral de alerta si es necesario

---

## Alertas Automáticas

| Evento | Canal | Prioridad |
|--------|-------|-----------|
| Login sospechoso (>5 fallos/min) | Email + Dashboard | S2 |
| Cambio de rol de usuario | Email | S2 |
| Cambio de variables de entorno (Vercel) | Email | S2 |
| Migración de base de datos | Email | S2 |
| Error repetido en API | Dashboard | S3 |
| Respuesta 5xx > 1% en 5 min | Email | S2 |
| Tráfico > 3x del promedio | Email | S2 |
| Backup completado/fallido | Dashboard | S3 |
| Deploy a producción | Email | S2 |
| Nuevo colaborador en GitHub | Email | S3 |

---

## Procedimiento de Recuperación

### Backup y Restauración

```bash
# Backup manual de Supabase
npx supabase db dump -f ./backups/pre-migration-$(date +%Y%m%d).sql

# Backup de variables Vercel
vercel env pull .env.vercel-backup

# Restauración (solo si es necesario)
npx supabase db restore ./backups/pre-migration-20260715.sql
```

### Pruebas de Restauración

- [ ] Backup semanal automatizado
- [ ] Prueba de restauración mensual en entorno DEV
- [ ] Verificar integridad de datos post-restauración
- [ ] Documentar tiempo de recuperación (RTO objetivo: < 2 horas)

---

## Contactos de Seguridad

Ver `docs/SECURITY_CONTACTS.md`

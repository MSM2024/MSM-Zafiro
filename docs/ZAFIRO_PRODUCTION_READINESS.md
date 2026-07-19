# ZAFIRO OS — Production Readiness

## Checklist por Despliegue

### Build
- [ ] 0 errores de compilación
- [ ] 0 errores de TypeScript
- [ ] 0 errores de lint
- [ ] Build reproducible

### Tests
- [ ] Tests unitarios pasan
- [ ] Tests de integración pasan
- [ ] Tests de carga pasan
- [ ] Tests de seguridad pasan

### Infraestructura
- [ ] HTTPS funcionando
- [ ] CDN configurada
- [ ] Cache configurada
- [ ] Rate limiting activo
- [ ] CSP configurado
- [ ] CORS configurado
- [ ] Backup automático
- [ ] Monitoreo activo (Sentry o similar)
- [ ] Logs centralizados

### Datos
- [ ] RLS configurado
- [ ] Migraciones aplicadas
- [ ] Seed data verificada
- [ ] Backup reciente
- [ ] Rollback probado

### Seguridad
- [ ] MFA para administradores
- [ ] Secretos rotados
- [ ] Auditoría activa
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Sesiones seguras

### Despliegue
- [ ] Preview deploy probado
- [ ] Canary deploy probado
- [ ] Rollback probado (< 5 minutos)
- [ ] Feature flags configurados
- [ ] Monitoreo de errores
- [ ] Alertas configuradas

## Escalamiento

1. Don Miguel (OWNER)
2. Equipo autorizado (5-10 personas)
3. 5% de usuarios
4. 25% de usuarios
5. 100% de usuarios

## Rollback

- `git revert` del commit problemático
- O Vercel Dashboard → Promote previous deployment
- Verificar en < 5 minutos
- Notificar al equipo

## Prohibiciones en Producción

- No cambiar producción sin backup
- No activar pagos sin aprobación del OWNER
- No ejecutar KYC real sin proveedor validado
- No borrar datos de usuario sin consentimiento
- No deshabilitar seguridad temporalmente
- No compartir credenciales de producción
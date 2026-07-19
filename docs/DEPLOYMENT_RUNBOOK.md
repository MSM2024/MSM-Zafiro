# Deployment Runbook — ZAFIRO Canary System

## Autoridad
- **OWNER**: Miguel Soria Martínez
- **Sistema**: Feature Flags + Preview/Canary + Rollback Automático

---

## Etapas de Despliegue

### ETAPA 0: Preview Deployment
- **URL**: Automática por Vercel (`*-git-*.vercel.app`)
- **Trigger**: Push a rama `preview/*` o PR abierto
- **Acceso**: Solo Don Miguel + equipo técnico
- **Feature flags**: Todos en `alpha`, solo OWNER puede activar
- **Supabase**: Esquema de staging o sin Supabase
- **Duración**: Indefinida hasta aprobación

### ETAPA 1: Solo Don Miguel
- **URL**: Preview promovida o canary
- **Acceso**: Autenticación con email `com8msm@gmail.com`
- **Feature flags**: En `alpha`, OWNER activa manualmente
- **Pruebas**: Registro, login, perfil, dashboard, ELIANA

### ETAPA 2: Equipo Autorizado
- **URL**: Canary persistente
- **Acceso**: Cuentas en whitelist
- **Feature flags**: Flags en `beta`
- **Pruebas**: APIs, PWA, offline, reconexión

### ETAPA 3: 5% de Usuarios
- **URL**: Producción con feature flags
- **Feature flags**: `canary`
- **Tráfico**: 5% aleatorio o por segmento

### ETAPA 4: 25% de Usuarios
- **URL**: Producción
- **Feature flags**: `canary` + `production`
- **Monitoreo**: Intensivo

### ETAPA 5: 100%
- **URL**: Producción
- **Feature flags**: Producción
- **Monitoreo**: Estándar

---

## Feature Flags Registry

| Flag | Etapa | Default | Owner Only | Descripción |
|------|-------|---------|------------|-------------|
| `SECURITY_MIDDLEWARE_ENABLED` | alpha | off | sí | Seguridad en API routes |
| `NEW_AUTH_ENABLED` | alpha | off | sí | Nueva autenticación Supabase |
| `SUPABASE_PROFILE_ENABLED` | alpha | off | sí | Perfiles persistentes |
| `SERVER_SESSION_ENABLED` | alpha | off | sí | Sesiones servidor |
| `RLS_ENFORCED` | alpha | off | sí | Row Level Security |
| `ELIANA_REAL_DATA_ENABLED` | beta | off | sí | ELIANA con datos reales |
| `ECONOMY_BACKEND_ENABLED` | beta | off | sí | Backend económico real |
| `STRIPE_LIVE_ENABLED` | alpha | off | sí | Pagos reales |
| `WHATSAPP_LIVE_ENABLED` | alpha | off | sí | WhatsApp real |
| `KYC_LIVE_ENABLED` | alpha | off | sí | KYC externo |

---

## Checklist por Despliegue

### Pre-despliegue
- [ ] Build local exitoso (`npm run build`)
- [ ] Lint sin errores (`npx eslint src/`)
- [ ] Feature flags revisados (`src/lib/feature-flags.ts`)
- [ ] Rama creada desde `main` actualizada
- [ ] Envs verificados en Vercel Dashboard

### Despliegue
- [ ] Push a rama de preview `preview/*`
- [ ] Vercel deploy iniciado
- [ ] URL Preview anotada
- [ ] Deployment ID anotado
- [ ] Feature flags configurados

### Post-despliegue
- [ ] Health check: `/api/eliana/chat` → `{ status: 'ok' }`
- [ ] Feature flags API: `GET /api/feature-flags` → lista completa
- [ ] Login funcional en navegador
- [ ] Perfil visible en `/zafiro/perfil`
- [ ] ELIANA responde en `/eliana`
- [ ] PWA instalable (manifest + SW)
- [ ] Logs de Vercel sin errores 500

### Prueba Bajo Fuego
- [ ] Registro real de usuario de prueba
- [ ] Login real + sesión persistente
- [ ] Acceso protegido (ruta `/admin` redirige)
- [ ] Perfil persistente entre recargas
- [ ] Dashboard carga correctamente
- [ ] ELIANA web responde con conocimiento
- [ ] PWA instalable en móvil
- [ ] Modo offline muestra página offline
- [ ] Reconexión automática
- [ ] APIs responden (no 500)
- [ ] Logs sin errores críticos
- [ ] Sin alertas de seguridad

### Rollback
- [ ] `git revert` del commit de despliegue
- [ ] O Vercel Dashboard → Promote previous deployment
- [ ] Feature flags reseteados a default
- [ ] Verificar que rollback funciona en < 5 minutos

---

## Monitoreo

### Vercel Dashboard
- [ ] Logs de funciones serverless
- [ ] Métricas de latencia (p50, p95, p99)
- [ ] Errores 4xx/5xx
- [ ] Uso de ancho de banda

### Logs de API
- [ ] Correlation ID en cada respuesta
- [ ] Auditoría de eventos de seguridad
- [ ] Trazas de ELIANA

### Alertas al OWNER
- [ ] Aumento de errores > 1%
- [ ] Falla de login
- [ ] Falla de RLS
- [ ] Pérdida de persistencia
- [ ] Accesos indebidos
- [ ] Latencia > 5s
- [ ] Errores financieros
- [ ] WhatsApp duplica mensajes

---

## Detener o Revertir Inmediatamente Si

- Aumentan errores 5xx > 1%
- Falla login para usuarios autorizados
- Falla RLS (usuarios ven datos ajenos)
- Se pierde persistencia de perfiles
- Aparecen duplicados de usuarios
- Existen accesos indebidos a admin
- Latencia aumenta significativamente (> 5s p95)
- Aparecen errores financieros
- WhatsApp duplica mensajes
- El rollback no está disponible

---

## Acciones Prohibidas Sin Aprobación del OWNER

- Pagos reales (Stripe live)
- KYC/KYB con proveedor externo
- Cambios DNS
- Borrados masivos de datos
- Migraciones destructivas de DB
- Operaciones financieras reales
- WhatsApp masivo (> 10 mensajes/día)
- Cambios de roles del OWNER
- Despliegue directo a producción sin preview

---

## Entregables por Despliegue

Cada despliegue debe documentar:
1. **URL Preview/Canary**
2. **Rama** (`preview/fecha-descripcion`)
3. **Commit SHA**
4. **Deployment ID** (Vercel)
5. **Funciones activadas**
6. **Feature flags activos**
7. **Usuarios autorizados**
8. **Pruebas realizadas**
9. **Logs revisados**
10. **Errores encontrados**
11. **Resultado del rollback** (si aplicó)
12. **Recomendación**: mantener, corregir o promover

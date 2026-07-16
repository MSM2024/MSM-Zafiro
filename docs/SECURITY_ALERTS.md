# GUARDIÁN 7 — Alertas de Seguridad

---

## Configuración de Alertas

### 1. Login Sospechoso

```sql
-- Crear vista de monitoreo
CREATE VIEW security_alerts_login AS
SELECT
  count(*) as attempts,
  COUNT(DISTINCT user_id) as users_targeted,
  MIN(created_at) as first_attempt,
  MAX(created_at) as last_attempt
FROM session_log
WHERE action = 'login_failed'
  AND created_at > NOW() - INTERVAL '5 minutes'
HAVING count(*) > 5;
```

**Umbral:** >5 fallos en 5 minutos → Alerta S2

### 2. Cambio de Roles

```sql
CREATE VIEW security_alerts_role_changes AS
SELECT * FROM audit_log
WHERE action LIKE 'role.changed%'
  AND created_at > NOW() - INTERVAL '24 hours';
```

**Umbral:** Cualquier cambio → Alerta S2

### 3. Error Rate en API

```sql
CREATE VIEW security_alerts_api_errors AS
SELECT
  route,
  COUNT(*) as errors,
  (COUNT(*) * 100.0 / NULLIF(total_requests, 0)) as error_rate
FROM api_log
WHERE status_code >= 500
  AND created_at > NOW() - INTERVAL '5 minutes'
GROUP BY route
HAVING (COUNT(*) * 100.0 / NULLIF(total_requests, 0)) > 1;
```

**Umbral:** >1% errores 5xx en 5 minutos → Alerta S2

### 4. Tráfico Anormal

```sql
CREATE VIEW security_alerts_traffic AS
SELECT
  COUNT(*) as requests_5min,
  (SELECT AVG(cnt) FROM (
    SELECT COUNT(*) as cnt FROM api_log
    WHERE created_at BETWEEN NOW() - INTERVAL '10 minutes' AND NOW() - INTERVAL '5 minutes'
  ) as avg_window) as avg_requests
FROM api_log
WHERE created_at > NOW() - INTERVAL '5 minutes'
HAVING COUNT(*) > 3 * (SELECT AVG(cnt) FROM (
  SELECT COUNT(*) as cnt FROM api_log
  WHERE created_at BETWEEN NOW() - INTERVAL '10 minutes' AND NOW() - INTERVAL '5 minutes'
) as avg_window);
```

**Umbral:** >3x del promedio en 5 min → Alerta S2

### 5. Deploy a Producción

```typescript
// Vercel Webhook: deployment.ready
// Enviar alerta a Don Miguel
```

**Umbral:** Cualquier deploy → Alerta S2

---

## Canales de Alerta

| Tipo | Canal | Implementado |
|------|-------|-------------|
| Crítico (S1) | Email + Dashboard | ❌ |
| Alto (S2) | Email | ❌ |
| Medio (S3) | Dashboard | ❌ |
| Bajo (S4) | Log | ❌ |

**Nota:** Las alertas requieren conexión Supabase real para funcionar (actualmente en localStorage fallback).

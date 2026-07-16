# GUARDIÁN 3 — Base de Datos: Matriz RLS

**Fecha:** 2026-07-15
**Estado:** ⚠️ REQUIRES_OWNER_ACTION — Tablas no creadas en Supabase

---

## Convenciones

| Símbolo | Significado |
|---------|-------------|
| ✅ | Implementado |
| ❌ | No implementado |
| N/A | No aplica |
| ⚠️ | Pendiente de verificación |

---

## Matriz de Tablas

### Tablas Públicas (Sistema)

| Tabla | RLS | SELECT | INSERT | UPDATE | DELETE | AAL2 | Riesgo |
|-------|-----|--------|--------|--------|--------|------|--------|
| `questions` | ❌ | Todos | Auth | Owner/Author | Owner/Admin | No | Medio |
| `replies` | ❌ | Todos | Auth | Owner | Owner/Admin | No | Bajo |
| `communities` | ❌ | Todos | Auth | Owner/Admin | Owner/Admin | No | Bajo |
| `community_members` | ❌ | Auth | Auth | Owner | Owner | No | Medio |
| `stories` | ❌ | Todos | Auth | Owner/Admin | Owner/Admin | No | Bajo |
| `sponsors` | ❌ | Todos | Auth | Owner | Owner/Admin | No | Medio |
| `trends` | ❌ | Todos | Admin | Admin | Admin | No | Bajo |
| `universo_connections` | ❌ | Owner | Owner | Owner | Owner | No | Bajo |

### Tablas Sensibles

| Tabla | RLS | SELECT | INSERT | UPDATE | DELETE | AAL2 | Riesgo |
|-------|-----|--------|--------|--------|--------|------|--------|
| `user_roles` | ❌ | Owner/Admin | Owner | Owner | Owner | ✅ Sí | **CRÍTICO** |
| `payments` | ❌ | Owner/Cashier | System | Owner | Never | ✅ Sí | **CRÍTICO** |
| `subscriptions` | ❌ | Owner/User | System | System | Owner | ✅ Sí | **CRÍTICO** |
| `pts_balance` | ❌ | Owner/User | System | System | Never | ✅ Sí | **CRÍTICO** |
| `pts_transactions` | ❌ | Owner/User | System | Never | Never | ✅ Sí | **CRÍTICO** |
| `referrals` | ❌ | Owner/User | System | System | Never | No | Alto |
| `rewards` | ❌ | Owner/User | System | System | Owner | ✅ Sí | Alto |
| `withdrawals` | ❌ | Owner/User | User | System | Never | ✅ Sí | **CRÍTICO** |

### Tablas de Auditoría

| Tabla | RLS | SELECT | INSERT | UPDATE | DELETE | AAL2 | Riesgo |
|-------|-----|--------|--------|--------|--------|------|--------|
| `audit_log` | ❌ | Owner/Admin | System | Never | Never | ✅ Sí | **CRÍTICO** |
| `security_events` | ❌ | Owner/Admin | System | Never | Never | ✅ Sí | **CRÍTICO** |
| `session_log` | ❌ | Owner/Admin | System | Never | Never | ✅ Sí | **CRÍTICO** |

---

## Políticas RLS Recomendadas

### `user_roles` — Solo OWNER

```sql
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_select_user_roles" ON user_roles
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'owner')
  );

CREATE POLICY "owner_insert_user_roles" ON user_roles
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'owner')
  );

CREATE POLICY "owner_update_user_roles" ON user_roles
  FOR UPDATE USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'owner')
  );

CREATE POLICY "owner_delete_user_roles" ON user_roles
  FOR DELETE USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'owner')
  );
```

### `payments` — Solo lectura para OWNER y CASHIER

```sql
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_cashier_select_payments" ON payments
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role IN ('owner', 'admin', 'cashier'))
  );

-- INSERT solo desde backend (service_role)
CREATE POLICY "system_insert_payments" ON payments
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
```

### `audit_log` — Append-only

```sql
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "system_insert_audit" ON audit_log
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "owner_admin_select_audit" ON audit_log
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM user_roles WHERE role IN ('owner', 'admin'))
  );

-- NO HAY POLÍTICAS DE UPDATE/DELETE — audit_log es append-only
```

---

## Funciones Transaccionales Recomendadas

### Ventas (idempotente)

```sql
CREATE OR REPLACE FUNCTION process_payment(
  p_user_id UUID,
  p_amount NUMERIC,
  p_idempotency_key TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_previous RECORD;
BEGIN
  -- Verificar idempotencia
  SELECT * INTO v_previous FROM payments WHERE idempotency_key = p_idempotency_key;
  IF FOUND THEN
    RETURN jsonb_build_object('status', 'duplicate', 'payment_id', v_previous.id);
  END IF;

  -- Insertar pago
  INSERT INTO payments (user_id, amount, idempotency_key, status)
  VALUES (p_user_id, p_amount, p_idempotency_key, 'completed');

  -- Actualizar balance
  UPDATE pts_balance SET balance = balance + (p_amount * 100) WHERE user_id = p_user_id;

  -- Auditoría
  INSERT INTO audit_log (action, user_id, metadata)
  VALUES ('payment.processed', p_user_id, jsonb_build_object('amount', p_amount));

  RETURN jsonb_build_object('status', 'success');
END;
$$;
```

---

## Próximos Pasos

1. Crear todas las tablas en Supabase (actualmente en localStorage fallback)
2. Ejecutar migraciones SQL con RLS
3. Verificar que `SUPABASE_SERVICE_ROLE_KEY` solo se use en server actions
4. Probar políticas con diferentes roles
5. Documentar backup antes de cada migración

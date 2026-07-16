# GUARDIÁN 1 — MFA: Guía de Implementación

**Basado en:** Supabase Auth + MFA TOTP (RFC 6238)

---

## 1. Habilitar MFA en Supabase

```sql
-- En SQL Editor de Supabase Dashboard
-- 1. Asegurar que la tabla user_roles existe
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('owner','admin','cashier','viewer','user','sponsor')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
```

## 2. Asignar Rol a Usuario (solo OWNER)

```sql
SELECT set_claim(auth.uid(), 'user_role', '"admin"');
-- o directamente en user_roles:
INSERT INTO user_roles (user_id, role) VALUES ('UUID_DEL_USUARIO', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin', updated_at = now();
```

## 3. Verificar Nivel AAL2 en Backend

Usar `requireAAL2` de `@/security/require-aal2`:

```typescript
import { requireAAL2 } from "@/security/require-aal2"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    await requireAAL2(supabase, "pagos.cancelar")
  } catch (error) {
    return Response.json({ error: "MFA requerido" }, { status: 403 })
  }

  // ... lógica de pago
}
```

## 4. Verificar Rol en Backend

```typescript
import { requireRole } from "@/security/require-role"

const { userId, role } = await requireRole(supabase, ["owner", "admin"])
```

## 5. Frontend: Forzar MFA antes de acción sensible

```typescript
import type { SupabaseClient } from "@supabase/supabase-js"

async function promptMFA(supabase: SupabaseClient): Promise<boolean> {
  const { data: { aal } } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  if (aal === "aal2") return true

  // Redirigir a verificación MFA
  window.location.href = "/auth/mfa-verify"
  return false
}
```

## 6. Códigos de Recuperación

```typescript
// Generar códigos de recuperación durante el enrolamiento MFA
const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" })
if (data?.id) {
  const { data: recoveryData } = await supabase.auth.admin.generateRecoveryCodes()
  // Mostrar códigos al usuario UNA SOLA VEZ
}
```

## 7. Lista de Sesiones

```typescript
const { data: sessions } = await supabase.auth.admin.listSessions()
// Mostrar en panel de administración /admin/security
```

## 8. Revocación Global

```typescript
await supabase.auth.admin.signOut(userId)
// o todas las sesiones excepto la actual:
await supabase.auth.admin.signOutAllSessions()
```

---

## Requisitos Previos

- [ ] Proyecto Supabase conectado (no localStorage fallback)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurado
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurado
- [ ] `SUPABASE_SERVICE_ROLE_KEY` solo en servidor
- [ ] Migración SQL ejecutada: `user_roles` table

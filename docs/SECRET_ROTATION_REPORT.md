# GUARDIÁN 2 — Secretos: Procedimiento de Rotación

---

## Cuándo Rotar

- Inmediatamente después de una exposición confirmada
- Cada 90 días para claves de producción
- Cuando un colaborador con acceso deja el equipo
- Después de un incidente de seguridad
- Cuando un secreto aparece en código, logs o capturas

---

## Procedimiento por Tipo de Secreto

### 1. VERCEL_OIDC_TOKEN

```bash
# 1. Ir a Vercel Dashboard → Settings → Tokens
# 2. Revocar token actual
# 3. Generar nuevo token
# 4. Actualizar .env.local
# 5. Verificar deploy funcional
```

### 2. SUPABASE_SERVICE_ROLE_KEY

```bash
# 1. Ir a Supabase Dashboard → Project Settings → API
# 2. Service Role Key → Regenerate
# 3. Actualizar .env.local y Vercel Environment Variables
# 4. Verificar que migraciones y triggers funcionan
# 5. Verificar que RLS sigue activo
```

### 3. STRIPE_SECRET_KEY

```bash
# 1. Ir a Stripe Dashboard → Developers → API Keys
# 2. Revocar clave actual
# 3. Crear nueva clave restringida
# 4. Actualizar .env.local y Vercel
# 5. Probar webhook con Stripe CLI: stripe trigger payment_intent.succeeded
```

### 4. GEMINI_API_KEY

```bash
# 1. Ir a Google AI Studio → API Keys
# 2. Revocar clave actual
# 3. Crear nueva clave
# 4. Actualizar .env.local y Vercel
# 5. Probar: curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
```

### 5. WhatsApp Tokens

```bash
# 1. Ir a Meta Developer Dashboard → WhatsApp → Configuration
# 2. Regenerate token
# 3. Actualizar .env.local y Vercel
# 4. Probar webhook con Meta webhook tester
```

---

## Verificación Post-Rotación

```bash
# Verificar que el build funciona sin errores de autenticación
npm run build

# Verificar que el health endpoint responde
curl -I https://zafiro.msmmystore.com/api/health

# Verificar webhooks Stripe
stripe trigger payment_intent.succeeded

# Verificar conexión Supabase
node -e "const { createClient } = require('@supabase/supabase-js'); const c = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY); c.from('health_check').select('*').limit(1).then(r => console.log(r.status))"
```

---

## Checklist de Rotación

- [ ] Nuevo secreto generado (no reutilizar el anterior)
- [ ] Secreto anterior revocado
- [ ] `.env.local` actualizado
- [ ] Vercel Environment Variables actualizadas
- [ ] Build exitoso (`npm run build`)
- [ ] Health check funcional
- [ ] Logs verificados (sin exposición del nuevo secreto)
- [ ] Fecha de próxima rotación registrada

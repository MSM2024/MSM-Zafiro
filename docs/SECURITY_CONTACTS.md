# GUARDIÁN 7 — Contactos de Seguridad

---

## Internos

| Rol | Nombre | Contacto | Disponibilidad |
|-----|--------|----------|----------------|
| OWNER / Fundador | Miguel Soria Martínez (Don Miguel) | msmmystore@gmail.com | 24/7 |
| Desarrollador Principal | OpenCode (automatizado) | N/A | 24/7 |
| Administrador de Infraestructura | Don Miguel | msmmystore@gmail.com | 24/7 |

## Proveedores

| Servicio | Contacto de Seguridad | Documentación |
|----------|----------------------|---------------|
| **Vercel** | [Vercel Security](https://vercel.com/security) | [Reportar vulnerabilidad](https://vercel.com/security/report) |
| **Supabase** | [Supabase Security](https://supabase.com/security) | security@supabase.com |
| **Stripe** | [Stripe Security](https://stripe.com/security) | security@stripe.com |
| **GitHub** | [GitHub Security](https://github.com/security) | [Reportar vulnerabilidad](https://github.com/contact/security) |
| **Google Cloud (Gemini)** | [Google Cloud Security](https://cloud.google.com/security) | |
| **OpenAI** | [OpenAI Security](https://openai.com/security) | security@openai.com |
| **Anthropic** | [Anthropic Security](https://anthropic.com/security) | security@anthropic.com |

## Respuesta a Incidentes

| Tipo | Contacto | Tiempo |
|------|----------|--------|
| Brecha de datos | Don Miguel (Email) | Inmediato |
| Abuso de plataforma | Don Miguel (Email) | < 4 horas |
| Reporte de vulnerabilidad | Don Miguel (Email) | < 24 horas |
| Abuso de API | Rate limiting automático | Inmediato |

---

## Procedimiento de Escalamiento

```
Detector automático (alarma)
  → OpenCode evalúa severidad (S1-S4)
    → S1/S2: Notificar a Don Miguel inmediatamente (Email + SMS)
    → S3: Registrar en security_events, notificar en < 1 hora
    → S4: Registrar en security_events, revisar en < 24 horas
```

## Canales de Comunicación

- **Emergencia**: Email directo a Don Miguel
- **Reportes automáticos**: Dashboard /admin + Email
- **Documentación**: GitHub Issues (privado)
- **Auditoría**: `audit_log` en Supabase
